<script>
(function () {
  const SCRIPT_ORIGIN = 'https://chatbot.dialogintelligens.dk'; // iframe origin
  const IFRAME_URL    = 'https://chatbot.dialogintelligens.dk'; // iframe src

  document.addEventListener('DOMContentLoaded', () => {

    /* ---------- iframe ---------- */
    const iframe = document.createElement('iframe');
    iframe.id = 'chat-iframe';
    iframe.src = IFRAME_URL;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = '1px solid #000';
    iframe.style.boxSizing = 'border-box';
    iframe.style.display = 'block';
    iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-forms allow-popups'
    );

    document.currentScript.insertAdjacentElement('afterend', iframe);

    /* ---------- resize logic (from new script, simplified) ---------- */
    let isIframeEnlarged = false;

    function adjustIframeSize() {
      if (isIframeEnlarged) {
        iframe.style.height = '90vh';
      } else {
        iframe.style.height = '600px';
      }
    }

    /* ---------- send integrationOptions (new protocol) ---------- */
    function sendIntegrationOptions() {
      if (!iframe.contentWindow) return;

      iframe.contentWindow.postMessage(
        {
          action: 'integrationOptions',

          chatbotID: 'bodylab',
          pagePath: window.location.href,

          /* branding */
          themeColor: '#65bddb',
          headerLogoG: 'https://dialogintelligens.dk/wp-content/uploads/2024/10/customLogo.png',
          titleLogoG: 'https://dialogintelligens.dk/wp-content/uploads/2024/06/messageIcon.png',

          /* privacy */
          privacyLink:
            'https://dialogintelligens.dk/wp-content/uploads/2024/08/Privatlivspolitik-bodylab.pdf',

          /* copy */
          inputPlaceholder: 'Skriv dit spørgsmål her...',
          firstMessage:
            'Mit navn er Buddy. Jeg er din virtuelle træningsmakker 👋',

          /* feature flags */
          gptInterface: true,
          isEmbedded: true
        },
        SCRIPT_ORIGIN
      );
    }

    /* ---------- receive messages from iframe ---------- */
    window.addEventListener('message', (event) => {
      if (event.origin !== SCRIPT_ORIGIN) return;

      if (event.data?.action === 'toggleSize') {
        isIframeEnlarged = !isIframeEnlarged;
        adjustIframeSize();
      }
    });

    /* ---------- init ---------- */
    iframe.addEventListener('load', () => {
      sendIntegrationOptions();
      adjustIframeSize();
    });
  });
})();
</script>

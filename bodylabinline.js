(function () {
  const SCRIPT_ORIGIN = 'https://chatbot.dialogintelligens.dk';
  const IFRAME_URL = 'https://chatbot.dialogintelligens.dk';
  const API_URL = 'https://api.dialogintelligens.dk';

    const CHATBOT_ID = 'bodylab';
    const scriptEl = document.currentScript;

    window.chatbotInitialized = true;

    const hideWidgetStyle = document.createElement('style');
    hideWidgetStyle.textContent = '#chat-container, #chat-button, #chatbase-message-bubbles { display: none !important; }';
    document.head.appendChild(hideWidgetStyle);

    function destroyWidgetChatbot() {
      if (window.DialogIntelligens?.destroy) {
        window.DialogIntelligens.destroy();
      }
      window.chatbotInitialized = true;
    }

    let dashboardConfig = {};
    let isChatExpanded = false;

    document.addEventListener('DOMContentLoaded', async () => {
      destroyWidgetChatbot();
      setTimeout(destroyWidgetChatbot, 200);
      setTimeout(destroyWidgetChatbot, 2500);
 
     /* ---------- fetch dashboard config ---------- */
     try {
       const response = await fetch(`${API_URL}/api/integration-config/${CHATBOT_ID}`);
       if (response.ok) {
         dashboardConfig = await response.json();
       }
     } catch (e) {
       console.warn('Failed to fetch dashboard config:', e);
     }
 
     const container = document.createElement('div');
 
     /* ---------- iframe ---------- */
     const iframe = document.createElement('iframe');
     iframe.id = 'chat-iframe-inline';
     iframe.src = IFRAME_URL;
     iframe.style.display = 'block';
     iframe.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox'
     );
 
     container.appendChild(iframe);
     const placeholder = document.getElementById('chatbot-placeholder');
     if (placeholder) {
       placeholder.appendChild(container);
     } else if (scriptEl && scriptEl.parentElement) {
       scriptEl.parentElement.appendChild(container);
     } else {
       document.body.appendChild(container);
     }
 
     /* ---------- set initial size (minimal - input only) ---------- */
     container.style.width = '100%';
     container.style.maxWidth = '100%';
     container.style.height = '90px';
     container.style.margin = '0 auto';
     container.style.marginTop = '2em';
     container.style.marginBottom = '2em';
     container.style.transition = 'height 0.5s ease';
     container.style.boxSizing = 'border-box';
     iframe.style.width = '100%';
     iframe.style.height = '100%';
     iframe.style.border = 'none';
     iframe.style.boxSizing = 'border-box';
 
     /* ---------- resize logic ---------- */
     let isIframeEnlarged = false;
 
     function adjustIframeSize() {
       const isMobile = window.innerWidth < 1000;

       if (!isChatExpanded) {
         container.style.width = '100%';
         container.style.maxWidth = '100%';
         container.style.height = '90px';
         container.style.marginLeft = 'auto';
         container.style.marginRight = 'auto';
         container.style.marginBottom = '2em';
         return;
       }
 
       let maxWidth, height;
       if (isIframeEnlarged) {
         maxWidth = '80vw';
         height = '500px';
       } else if (isMobile) {
         maxWidth = '100%';
         height = '450px';
       } else {
         maxWidth = '60vw';
         height = '450px';
       }
 
       container.style.width = '100%';
       container.style.maxWidth = maxWidth;
       container.style.height = height;
       container.style.marginLeft = 'auto';
       container.style.marginRight = 'auto';
       container.style.marginBottom = '2em';
     }
 
     /* ---------- send integrationOptions ---------- */
     function sendIntegrationOptions() {
       if (!iframe.contentWindow) return;
 
       iframe.contentWindow.postMessage(
         {
           action: 'integrationOptions',
           chatbotID: CHATBOT_ID,
           pagePath: window.location.href,
 
           ...dashboardConfig,
 
           /* overrides (keep these hardcoded) */
           privacyLink:
             'https://dialogintelligens.dk/wp-content/uploads/2024/08/Privatlivspolitik-bodylab.pdf',
           inputPlaceholder: 'Skriv dit spørgsmål her...',
           firstMessage: '',

           /* feature flags */
           gptInterface: true,
           isEmbedded: false,
           fullscreenMode: true
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

      if (event.data?.action === 'expandChat') {
        isChatExpanded = true;
        adjustIframeSize();
      }

      if (event.data?.action === 'collapseChat') {
        isChatExpanded = false;
        adjustIframeSize();
      }

      if (event.data?.action === 'navigate' && event.data.url) {
        localStorage.setItem('chatWindowState', 'open');
        window.location.href = event.data.url;
      }
     });
 
 
    /* ---------- init ---------- */
    iframe.addEventListener('load', () => {
      sendIntegrationOptions();
      adjustIframeSize();
    });

    window.addEventListener('resize', () => adjustIframeSize());
 
   });
})();
(function () {
  const SCRIPT_ORIGIN = 'https://chatbot.dialogintelligens.dk';
  const IFRAME_URL = 'https://chatbot.dialogintelligens.dk';
  const API_URL = 'https://api.dialogintelligens.dk';

  const scriptEl = document.currentScript;

  /**
   * Resolves chatbot id for inline embed (same idea as universal-chatbot.js).
   * 1) data-chatbot-id on the script tag
   * 2) ?id= on the script src
   */
  function resolveChatbotId(el) {
    if (!el) return null;
    const fromData = el.getAttribute('data-chatbot-id');
    if (fromData && fromData.trim()) return fromData.trim();
    try {
      if (!el.src) return null;
      const id = new URL(el.src).searchParams.get('id');
      if (id && id.trim()) return id.trim();
    } catch (_) {
      return null;
    }
    return null;
  }

  const CHATBOT_ID = resolveChatbotId(scriptEl);
  if (!CHATBOT_ID) {
    console.error(
      '[inline-chatbot] Missing chatbot id. Use <script src=".../inline-chatbot.js?id=YOUR_ID"></script> or data-chatbot-id on the script tag.'
    );
    return;
  }

  window.chatbotInitialized = true;

  const hideWidgetStyle = document.createElement('style');
  hideWidgetStyle.textContent =
    '#chat-container, #chat-button, #chat-iframe, #chatbase-message-bubbles { display: none !important; }';
  document.head.appendChild(hideWidgetStyle);

  function destroyWidgetChatbot() {
    if (window.DialogIntelligens?.destroy) {
      window.DialogIntelligens.destroy();
    }
    const widgetIframe = document.getElementById('chat-iframe');
    if (widgetIframe) widgetIframe.remove();
    window.chatbotInitialized = true;
  }

  let dashboardConfig = {};
  let isChatExpanded = false;

  async function init() {
    destroyWidgetChatbot();
    setTimeout(destroyWidgetChatbot, 200);
    setTimeout(destroyWidgetChatbot, 2500);
    setTimeout(destroyWidgetChatbot, 5000);
    setTimeout(destroyWidgetChatbot, 10000);

    try {
      const response = await fetch(
        `${API_URL}/api/integration-config/${encodeURIComponent(CHATBOT_ID)}`
      );
      if (response.ok) {
        dashboardConfig = await response.json();
      }
    } catch (e) {
      console.warn('Failed to fetch dashboard config:', e);
    }

    const container = document.createElement('div');

    const iframe = document.createElement('iframe');
    iframe.id = 'chat-iframe-inline';
    iframe.src = IFRAME_URL;
    iframe.setAttribute('allow', 'microphone');
    iframe.style.display = 'block';

    container.appendChild(iframe);
    const placeholder = document.getElementById('chatbot-placeholder');
    if (placeholder) {
      placeholder.appendChild(container);
    } else if (
      scriptEl &&
      scriptEl.parentElement &&
      scriptEl.parentElement !== document.head
    ) {
      scriptEl.parentElement.appendChild(container);
    } else if (document.body) {
      document.body.appendChild(container);
    } else {
      const appendWhenBody = () => {
        const root = document.body || document.documentElement;
        if (root) root.appendChild(container);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', appendWhenBody, { once: true });
      } else {
        appendWhenBody();
      }
    }

    container.style.width = '100%';
    container.style.maxWidth = '100%';
    container.style.height = '100px';
    container.style.margin = '0 auto';
    container.style.marginTop = '2em';
    container.style.marginBottom = '2em';
    container.style.transition = 'height 0.5s ease';
    container.style.boxSizing = 'border-box';
    container.style.overflow = 'hidden';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.boxSizing = 'border-box';

    let isIframeEnlarged = false;

    function adjustIframeSize() {
      const isMobile = window.innerWidth < 1000;

      if (!isChatExpanded) {
        container.style.width = '100%';
        container.style.maxWidth = '100%';
        container.style.height = '100px';
        container.style.marginLeft = 'auto';
        container.style.marginRight = 'auto';
        container.style.marginBottom = '2em';
        return;
      }

      let maxWidth, height;
      if (isIframeEnlarged) {
        maxWidth = '100%';
        height = '500px';
      } else if (isMobile) {
        maxWidth = '100%';
        height = '450px';
      } else {
        maxWidth = '100%';
        height = '450px';
      }

      container.style.width = '100%';
      container.style.maxWidth = maxWidth;
      container.style.height = height;
      container.style.marginLeft = 'auto';
      container.style.marginRight = 'auto';
      container.style.marginBottom = '2em';
    }

    function sendIntegrationOptions() {
      if (!iframe.contentWindow) return;

      iframe.contentWindow.postMessage(
        {
          ...dashboardConfig,
          action: 'integrationOptions',
          chatbotID: CHATBOT_ID,
          pagePath: window.location.href,
          gptInterface: true,
          isEmbedded: false,
          fullscreenMode: true,
        },
        SCRIPT_ORIGIN
      );
    }

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
        if (event.data.url.endsWith('.pdf')) {
          window.open(event.data.url, '_blank', 'noopener');
        } else {
          localStorage.setItem('chatWindowState', 'open');
          window.location.href = event.data.url;
        }
      }
    });

    iframe.addEventListener('load', () => {
      sendIntegrationOptions();
      adjustIframeSize();
      setTimeout(sendIntegrationOptions, 500);
      setTimeout(sendIntegrationOptions, 2000);
    });

    window.addEventListener('resize', () => adjustIframeSize());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

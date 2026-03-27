/**
 * Inline Dialog Intelligens chatbot — universal single-file embed.
 *
 * Usage:
 *   <script src="https://scripts.dialogintelligens.dk/chatbotinline.js?id=YOUR_CHATBOT_ID"></script>
 *
 * The chatbot renders inside #chatbot-placeholder if it exists, otherwise
 * next to the script tag. Optional: set window.__CHATBOT_INLINE_OVERRIDES__
 * before loading to merge extra integrationOptions.
 */
(function () {
  const IFRAME_URL = 'https://chatbot.dialogintelligens.dk';
  const API_URL = 'https://api.dialogintelligens.dk';
  const SCRIPT_ORIGIN = 'https://chatbot.dialogintelligens.dk';

  const scriptEl = document.currentScript;

  function getChatbotId() {
    try {
      const src = scriptEl?.src
        || [...document.getElementsByTagName('script')]
            .reverse()
            .find(s => s.src && (s.src.includes('chatbotinline.js') || s.src.includes('chatbot-inline.js')))?.src;
      if (src) return new URL(src).searchParams.get('id')?.trim() || null;
    } catch { /* ignore */ }
    return document.getElementById('chatbot-placeholder')?.getAttribute('data-chatbot-id') || null;
  }

  function destroyWidgetChatbot() {
    window.DialogIntelligens?.destroy?.();
    const el = document.getElementById('chat-iframe');
    if (el) el.remove();
    window.chatbotInitialized = true;
  }

  let dashboardConfig = {};
  let isChatExpanded = false;

  async function init() {
    const id = getChatbotId();
    if (!id) {
      console.error('chatbotinline: missing ?id= on script URL or data-chatbot-id on #chatbot-placeholder.');
      return;
    }

    window.chatbotInitialized = true;

    const hideWidgetStyle = document.createElement('style');
    hideWidgetStyle.textContent =
      '#chat-container, #chat-button, #chat-iframe, #chatbase-message-bubbles { display: none !important; }';
    document.head.appendChild(hideWidgetStyle);

    destroyWidgetChatbot();
    setTimeout(destroyWidgetChatbot, 200);
    setTimeout(destroyWidgetChatbot, 2500);
    setTimeout(destroyWidgetChatbot, 5000);
    setTimeout(destroyWidgetChatbot, 10000);

    try {
      const response = await fetch(`${API_URL}/api/integration-config/${encodeURIComponent(id)}`);
      if (response.ok) dashboardConfig = await response.json();
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
    } else if (scriptEl?.parentElement) {
      scriptEl.parentElement.appendChild(container);
    } else {
      document.body.appendChild(container);
    }

    Object.assign(container.style, {
      width: '100%', maxWidth: '100%', height: '100px',
      margin: '0 auto', marginTop: '2em', marginBottom: '2em',
      transition: 'height 0.5s ease', boxSizing: 'border-box', overflow: 'hidden',
    });
    Object.assign(iframe.style, {
      width: '100%', height: '100%', border: 'none', boxSizing: 'border-box',
    });

    let isIframeEnlarged = false;

    const overrides =
      typeof window.__CHATBOT_INLINE_OVERRIDES__ === 'object' && window.__CHATBOT_INLINE_OVERRIDES__ !== null
        ? window.__CHATBOT_INLINE_OVERRIDES__
        : {};

    function adjustIframeSize() {
      if (!isChatExpanded) {
        container.style.height = '100px';
      } else {
        container.style.height = isIframeEnlarged ? '500px' : '450px';
      }
    }

    function sendIntegrationOptions() {
      if (!iframe.contentWindow) return;
      iframe.contentWindow.postMessage({
        action: 'integrationOptions',
        chatbotID: id,
        pagePath: window.location.href,
        ...dashboardConfig,
        ...overrides,
        gptInterface: true,
        isEmbedded: false,
        fullscreenMode: true,
      }, SCRIPT_ORIGIN);
    }

    window.addEventListener('message', (event) => {
      if (event.origin !== SCRIPT_ORIGIN) return;
      const d = event.data;
      if (!d || typeof d !== 'object') return;

      if (d.action === 'toggleSize') {
        isIframeEnlarged = !isIframeEnlarged;
        adjustIframeSize();
      }
      if (d.action === 'expandChat') { isChatExpanded = true; adjustIframeSize(); }
      if (d.action === 'collapseChat') { isChatExpanded = false; adjustIframeSize(); }
      if (d.action === 'navigate' && d.url) {
        if (d.url.endsWith('.pdf')) {
          window.open(d.url, '_blank', 'noopener');
        } else {
          localStorage.setItem('chatWindowState', 'open');
          window.location.href = d.url;
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
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

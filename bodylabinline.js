(function () {
  const SCRIPT_ORIGIN = 'https://chatbot.dialogintelligens.dk';
  const IFRAME_URL = 'https://chatbot.dialogintelligens.dk';
  const API_URL = 'https://api.dialogintelligens.dk';
 
   const CHATBOT_ID = 'bodylab';
   const scriptEl = document.currentScript;
 
   let dashboardConfig = {};
 
   document.addEventListener('DOMContentLoaded', async () => {
 
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
     iframe.id = 'chat-iframe';
     iframe.src = IFRAME_URL;
     iframe.style.display = 'block';
     iframe.setAttribute(
       'sandbox',
       'allow-scripts allow-same-origin allow-forms allow-popups'
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
 
     /* ---------- set initial size ---------- */
     container.style.width = '60vw';
     container.style.height = '100vh';
     container.style.margin = '0 auto';
     container.style.marginBottom = '10vh';
     iframe.style.width = '100%';
     iframe.style.height = '100%';
     iframe.style.border = 'none';
     iframe.style.boxSizing = 'border-box';
 
     /* ---------- resize logic ---------- */
     let isIframeEnlarged = false;
 
     function getResponsiveHeight(value) {
       if (typeof CSS !== 'undefined' && CSS.supports('height', '1dvh')) {
         return `${value}dvh`;
       }
       return `${value}vh`;
     }
 
     function adjustIframeSize() {
       const isMobile = window.innerWidth < 1000;
 
       let width, height;
       if (isIframeEnlarged) {
         width = '80vw';
         height = 100;
       } else if (isMobile) {
         width = '95vw';
         height = 100;
       } else {
         width = '60vw';
         height = 100;
       }
 
       container.style.width = width;
       container.style.height = getResponsiveHeight(height);
       container.style.marginLeft = 'auto';
       container.style.marginRight = 'auto';
       container.style.marginBottom = '10vh';
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
           firstMessage:
             'Mit navn er Buddy. Jeg er din virtuelle træningsmakker 👋',
 
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
     });
 
 
     /* ---------- init ---------- */
     iframe.addEventListener('load', () => {
       sendIntegrationOptions();
       adjustIframeSize();
     });
 
     window.addEventListener('resize', () => adjustIframeSize());
 
   });
 })();
 
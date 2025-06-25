(function() {
    // Capture the <script> element reference NOW:
    const thisScript = document.currentScript;
  
    // Log that our script is loading (for debugging)
    console.log("[bodylabinline.js] Loaded script from GitHub...");
  
    // Wait until DOM is ready so we can safely append elements
    document.addEventListener('DOMContentLoaded', function() {
  
      // --- 1) Inject the <style> for responsive margin ---
      var styleElement = document.createElement('style');
      styleElement.innerHTML = `
        /* Add margin on the left side for PC screens only */
        @media (min-width: 1024px) {
          #chat-iframe {
            margin-left: 0px; /* you can adjust if needed */
          }
        }
      `;
      document.head.appendChild(styleElement);
  
      // --- 2) Create and insert the <iframe> ---
      var iframeElement = document.createElement('iframe');
      iframeElement.id = 'chat-iframe';
      iframeElement.src = 'https://bodylab.onrender.com';
      iframeElement.style.width = '100%';
      iframeElement.style.height = '600px';
      iframeElement.style.border = 'none';
      iframeElement.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  
      // Insert the iframe *after* this <script> element
      thisScript.insertAdjacentElement('afterend', iframeElement);
  
      // Keep track of toggling large/small
      var isIframeEnlarged = false;
  
      // This function posts your integration options to the iframe
      function sendMessageToIframe() {
        var iframeWindow = iframeElement.contentWindow;
        if (iframeWindow) {
          iframeWindow.postMessage(
            {
              action: 'integrationOptions',
  
              // All your settings:
              titleLogoG: 'https://dialogintelligens.dk/wp-content/uploads/2024/06/messageIcon.png',
              headerLogoG: 'https://dialogintelligens.dk/wp-content/uploads/2024/10/customLogo.png',
              themeColor: '#65bddb',
              pagePath: window.location.href,
              headerTitleG: 'AI Buddy',
              titleG: 'AI Buddy',
              headerSubtitleG: 'Du chatter med Buddy. Jeg ved det meste om træning og Bodylab-produkter, hvis jeg selv skal sige det. Så hvis du har et spørgsmål, kan jeg med stor sandsynlighed hjælpe dig. Jeg er dog kun en robot, og ligesom mennesker kan jeg også fejle. Hvis du synes, jeg sludrer, tager du bare fat i vores',
              contactLink: 'https://www.bodylab.dk/shop/cms-contact.html',
              contactTitle: 'kundeservice',
              privacyLink: 'http://dialogintelligens.dk/wp-content/uploads/2024/08/Privatlivspolitik-bodylab.pdf',
              inputText: 'Skriv dit spørgsmål her...',
  
              // API endpoints:
              placeholderAPI: 'https://den-utrolige-snebold.onrender.com/api/v1/prediction/19576769-c4c7-4183-9c4a-6c9fbd0d4519',
              weightLossAPI: 'https://den-utrolige-snebold.onrender.com/api/v1/prediction/f8bece82-8b6b-4acf-900e-83f1415b713d',
              productAPI: 'https://den-utrolige-snebold.onrender.com/api/v1/prediction/fe4ea863-86ca-40b6-a17b-d52a60da4a6b',
              recipeAPI: 'https://den-utrolige-snebold.onrender.com/api/v1/prediction/34b30c22-d938-4701-b644-d8da7755ad29',
              statestikAPI: 'https://den-utrolige-snebold.onrender.com/api/v1/prediction/8cf402f5-4796-4929-8853-e078f93bf7fe',
  
                    apiFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/d04e4181-6db3-4acf-aad7-8a41878e8df6",
        apiVarFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/a0f4e81d-bc70-41fe-8fa4-316707513839",
        apiFlowKey: "order",
  
              chatbotID: 'bodylab',
  
              // Meal plans
              mealplan1500: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-1500-kcal.pdf',
              mealplan2000: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-2000-kcal.pdf',
              mealplan2500: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-2500-kcal.pdf',
              mealplan3000: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-3000-kcal.pdf',
              mealplan3500: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-3500-kcal.pdf',
              vægttabmealplan1500: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-1500-kcal.pdf',
              vægttabmealplan2000: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-2000-kcal.pdf',
              vægttabmealplan2500: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-2500-kcal.pdf',
              vægttabmealplan3000: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-3000-kcal.pdf',
              vægttabmealplan3500: 'http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-3500-kcal.pdf',
  
              // Intro messages
              firstMessage1: 'Hej',
              firstMessage2: 'Mit navn er Buddy. Jeg er din virtuelle træningsmakker, som kan hjælpe dig med alt fra produktanbefalinger til træningstips. Stil mig et spørgsmål – så finder vi en løsning sammen! Når du skriver, accepterer du samtidig, at vores samtale behandles og gemmes 🤖',
  
              // Extra feature
              gptInterface: true
            },
            'https://bodylab.onrender.com' // Target origin must match the iframe's domain
          );
        } else {
          console.error('[bodylabinline.js] Iframe window not available.');
        }
      }
  
      // Listen for messages from the iframe
      window.addEventListener('message', function (event) {
        if (event.origin !== 'https://bodylab.onrender.com') {
          return; // Ignore messages from unknown origins
        }
        if (event.data.action === 'toggleSize') {
          isIframeEnlarged = !isIframeEnlarged;
          adjustIframeSize();
        }
        // Handle other actions if needed
      });
  
      // On iframe load, send the integration options
      function iframeLoaded() {
        // small delay so the iframe is ready for postMessage
        setTimeout(sendMessageToIframe, 200);
      }
  
      // Attach load listener
      iframeElement.addEventListener('load', iframeLoaded);
    });
  })();

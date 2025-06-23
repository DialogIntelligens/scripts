(function() {
    // Capture the <script> element reference NOW:
    const thisScript = document.currentScript;
  
    // Log that our script is loading (for debugging)
    console.log("[bodylabinline.js] Loaded script from GitHub...");
  
    // Wait until DOM is ready so we can safely append elements
    document.addEventListener('DOMContentLoaded', function() {
  
      // --- 1) Inject the <style> for responsive margin and fixed input ---
      var styleElement = document.createElement('style');
      styleElement.innerHTML = `
        /* Add margin on the left side for PC screens only */
        @media (min-width: 1024px) {
          #chat-iframe {
            margin-left: 0px; /* you can adjust if needed */
          }
        }
        
        /* Fixed input field styles */
        #chat-input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-top: 1px solid #e0e0e0;
          padding: 15px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        #chat-input-field {
          flex: 1;
          padding: 12px 50px 12px 15px;
          border: 1px solid #A9A9A9;
          border-radius: 0;
          font-size: 16px;
          outline: none;
          font-family: 'Barlow Semi Condensed', Arial, sans-serif;
        }
        
        #chat-input-field:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        #chat-send-button {
          position: absolute;
          right: 25px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        #chat-send-button:hover {
          opacity: 1;
        }
        
        #chat-send-button img {
          width: 20px;
          height: 20px;
        }
        
        /* Adjust iframe to leave space for fixed input */
        #chat-iframe {
          margin-bottom: 80px; /* Leave space for the fixed input */
        }
      `;
      document.head.appendChild(styleElement);
  
      // --- 2) Create and insert the <iframe> ---
      var iframeElement = document.createElement('iframe');
      iframeElement.id = 'chat-iframe';
      iframeElement.src = 'http://localhost:3000/';
      iframeElement.style.width = '100%';
      iframeElement.style.height = '600px';
      iframeElement.style.border = 'none';
      iframeElement.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  
      // Insert the iframe *after* this <script> element
      thisScript.insertAdjacentElement('afterend', iframeElement);

      // --- 3) Create the external fixed input field ---
      var inputContainer = document.createElement('div');
      inputContainer.id = 'chat-input-container';
      
      var inputField = document.createElement('input');
      inputField.id = 'chat-input-field';
      inputField.type = 'text';
      inputField.placeholder = 'Skriv dit spørgsmål her...';
      
      var sendButton = document.createElement('button');
      sendButton.id = 'chat-send-button';
      sendButton.innerHTML = '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIuMDEgMjFMMjMgMTJMMi4wMSAzTDIuMDAgMTBMMTcgMTJMMi4wMCAxNEwyLjAxIDIxWiIgZmlsbD0iIzY1YmRkYiIvPgo8L3N2Zz4K" alt="Send" />';
      
      inputContainer.appendChild(inputField);
      inputContainer.appendChild(sendButton);
      
      // Append to body so it's always visible
      document.body.appendChild(inputContainer);
  
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
            'http://localhost:3000/' // Target origin must match the iframe's domain
          );
        } else {
          console.error('[bodylabinline.js] Iframe window not available.');
        }
      }
  
      // Optional: Adjust the iframe size if the iframe toggles
      function adjustIframeSize() {
        iframeElement.style.height = isIframeEnlarged ? '800px' : '600px';
      }
  
      // --- 4) Handle input field functionality ---
      function sendMessageToChat() {
        var message = inputField.value.trim();
        if (message) {
          // Send the message to the iframe
          var iframeWindow = iframeElement.contentWindow;
          if (iframeWindow) {
            iframeWindow.postMessage(
              {
                action: 'sendMessage',
                message: message
              },
              'http://localhost:3000/'
            );
            // Clear the input field
            inputField.value = '';
          }
        }
      }

      // Handle send button click
      sendButton.addEventListener('click', sendMessageToChat);

      // Handle Enter key press
      inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          sendMessageToChat();
        }
      });

      // Listen for messages from the iframe
      window.addEventListener('message', function (event) {
        if (event.origin !== 'http://localhost:3000/') {
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

(function() {
    // Capture the <script> element reference NOW:
    const thisScript = document.currentScript;
  
    // Log that our script is loading (for debugging)
    console.log("[bodylabinline.js] Loaded script from GitHub...");
  
    // Wait until DOM is ready so we can safely append elements
    document.addEventListener('DOMContentLoaded', function() {
  
      // --- 1) Inject the <style> for responsive margin and sticky input ---
      var styleElement = document.createElement('style');
      styleElement.innerHTML = `
        /* Add margin on the left side for PC screens only */
        @media (min-width: 1024px) {
          #chat-iframe {
            margin-left: 0px; /* you can adjust if needed */
          }
        }
        
        /* Sticky input field styles */
        #sticky-input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-top: 1px solid #e0e0e0;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: 1em;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        #sticky-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 100%;
        }
        
        #sticky-chat-input {
          background-color: white;
          padding: 0.6em;
          padding-right: 3.2em;
          border: none;
          border-radius: 0.0em;
          width: 100%;
          box-sizing: border-box;
          outline: 0.064em solid #A9A9A9;
          outline-offset: 0.13em;
          font-size: 16px;
        }
        
        #sticky-chat-input:focus {
          outline: 0.064em solid #007bff;
        }
        
        #sticky-chat-input::placeholder {
          color: #A9A9A9;
        }
        
        #sticky-send-button {
          cursor: pointer;
          width: 1.3em;
          height: 1.3em;
          position: absolute;
          right: 1.4em;
          top: 50%;
          transform: translateY(-50%);
        }
        
        /* Add bottom padding to iframe container to make room for sticky input */
        #chat-iframe {
          margin-bottom: 80px;
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

      // --- 3) Create sticky input field ---
      var stickyInputContainer = document.createElement('div');
      stickyInputContainer.id = 'sticky-input-container';
      
      var stickyInputWrapper = document.createElement('div');
      stickyInputWrapper.id = 'sticky-input-wrapper';
      
      var stickyInput = document.createElement('input');
      stickyInput.id = 'sticky-chat-input';
      stickyInput.type = 'text';
      stickyInput.placeholder = 'Skriv dit spørgsmål her...';
      
      var stickySendButton = document.createElement('img');
      stickySendButton.id = 'sticky-send-button';
      stickySendButton.src = 'https://dialogintelligens.dk/wp-content/uploads/2024/06/sendButton.png';
      stickySendButton.alt = 'Send';
      
      stickyInputWrapper.appendChild(stickyInput);
      stickyInputWrapper.appendChild(stickySendButton);
      stickyInputContainer.appendChild(stickyInputWrapper);
      
      // Get the iframe width and apply it to the sticky input
      function updateStickyInputWidth() {
        var iframeRect = iframeElement.getBoundingClientRect();
        var iframeLeft = iframeRect.left;
        var iframeWidth = iframeRect.width;
        
        stickyInputWrapper.style.maxWidth = iframeWidth + 'px';
        stickyInputWrapper.style.marginLeft = iframeLeft + 'px';
        stickyInputWrapper.style.marginRight = 'auto';
      }
      
      // Insert sticky input into page
      document.body.appendChild(stickyInputContainer);
      
      // Update width on window resize
      window.addEventListener('resize', updateStickyInputWidth);
      
      // Initial width update
      setTimeout(updateStickyInputWidth, 100);

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
  
      // Handle input events
      function handleStickyInputSend() {
        var message = stickyInput.value.trim();
        if (message) {
          // Send message to iframe
          var iframeWindow = iframeElement.contentWindow;
          if (iframeWindow) {
            iframeWindow.postMessage({
              action: 'sendMessage',
              message: message
            }, 'http://localhost:3000/');
          }
          stickyInput.value = ''; // Clear input
        }
      }
      
      // Sticky input event listeners
      stickySendButton.addEventListener('click', handleStickyInputSend);
      stickyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          handleStickyInputSend();
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
          // Update sticky input width after size change
          setTimeout(updateStickyInputWidth, 100);
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

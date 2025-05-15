(function() {
  // Capture the <script> element reference
  const thisScript = document.currentScript;

  // Log that our script is loading (for debugging)
  console.log("[bevco-inline.js] Loaded script...");

  // Wait until DOM is ready so we can safely append elements
  document.addEventListener('DOMContentLoaded', function() {

    // --- 1) Inject the <style> for responsive margin ---
    var styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Add margin on the left side for PC screens only */
      @media (min-width: 1024px) {
        #chat2-iframe {
          /*margin-left: 150px;*/
        }
      }
    `;
    document.head.appendChild(styleElement);

    // --- 2) Create and insert the <iframe> ---
    var iframeElement = document.createElement('iframe');
    iframeElement.id = 'chat2-iframe';
    iframeElement.src = 'https://skalerbartprodukt.onrender.com';
    iframeElement.style.width = '400px';
    iframeElement.style.height = '600px';
    iframeElement.style.border = 'none';
    iframeElement.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    // Insert the iframe *after* this <script> element
    thisScript.insertAdjacentElement('afterend', iframeElement);

    // Keep track of toggling large/small
    var isIframeEnlarged = false;

    // Function to generate or retrieve a unique user ID
    function getOrCreateWebsiteUserId() {
      // Create a unique ID if one doesn't exist yet
      let userId = localStorage.getItem('websiteUserId');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('websiteUserId', userId);
      }
      return userId;
    }

    // This function posts your integration options to the iframe
    function sendMessageToIframe() {
      // Retrieve or create websiteuserid in parent domain's localStorage
      let websiteUserId = getOrCreateWebsiteUserId();
      
      var iframeWindow = iframeElement.contentWindow;
      if (iframeWindow) {
        iframeWindow.postMessage(
          {
            action: 'integrationOptions',
            chatbotID: "bevco",
            pagePath: window.location.href,
            statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/9b5c61e2-5915-42ac-b348-37ff0a78aeb6",
            apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/6b24d40e-26e6-44b8-8ec3-f5c4c8a7de85",
            fordelingsflowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/e5db4106-a57a-46b1-baa2-e19f7bfaa917",
            flow2Key: "product",
            flow2API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/33f10ef1-ab35-4cf1-b468-bc407de54cf0",
            flow3Key: "order",
            flow3API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/b3dd20c6-7111-43a7-961a-ce91e632cfc8",
            flow4API: "",
            flow4Key: "",
            
            leadGen: "%%",
            leadMail: "Team@dialogintelligens.dk",
            leadField1: "Navn",
            leadField2: "Tlf nummer",

            metaDataAPI: "",
            metaDataKey: "",
            
            imageAPI: '',

            apiFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/e7bed92f-688d-4cb1-a963-087ea3a4d450",
            apiVarFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/cca56d9a-ced2-4fd6-8d93-2fc3751e9111",
            apiFlowKey: "order",

            // Order tracking settings
            orderTrackingUrl: 'https://api.bevco.dk/store-api/dialog-intelligens/order/search',
            trackingNeedsAuth: false,
            trackingUseProxy: true,
            trackingProxyUrl: 'https://egendatabasebackend.onrender.com/api/proxy/bevco-order',
            trackingRequestMethod: 'POST',
            trackingCustomHeaders: {},
            trackingRequestBody: '{"order_number":"","email":"","phone":"","order_date":""}',
            trackingRequiredFields: ['order_number', 'email', 'phone', 'order_date'],
            trackingStateUrl: '',
            trackingStateIdPath: '',
            trackingLineItemStatePath: '',
            trackingStateNameLocale: '',

            useThumbsRating: false,
            ratingTimerDuration: 15000,
            replaceExclamationWithPeriod: false,

            pineconeApiKey: "",
            knowledgebaseIndexApiEndpoint: "",
            flow2KnowledgebaseIndex: "",
            flow3KnowledgebaseIndex: "",
            flow4KnowledgebaseIndex: "",
            apiFlowKnowledgebaseIndex: "",
            websiteOverride: "",
            languageOverride: "",
            valutaOverride: "",
            customVar1: "",
            
            privacyLink: "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik_bevco.pdf",

            // Set FreshdeskForm text
            freshdeskEmailLabel: "Din email:",
            freshdeskMessageLabel: "Besked til kundeservice:",
            freshdeskImageLabel: "Upload billede (valgfrit):",
            freshdeskChooseFileText: "Vælg fil",
            freshdeskNoFileText: "Ingen fil valgt",
            freshdeskSendingText: "Sender...",
            freshdeskSubmitText: "Send henvendelse",
            
            // Set FreshdeskForm validation error messages
            freshdeskEmailRequiredError: "Email er påkrævet",
            freshdeskEmailInvalidError: "Indtast venligst en gyldig email adresse",
            freshdeskFormErrorText: "Ret venligst fejlene i formularen",
            freshdeskMessageRequiredError: "Besked er påkrævet",
            freshdeskSubmitErrorText: "Der opstod en fejl ved afsendelse af henvendelsen. Prøv venligst igen.",
            
            // Set confirmation messages
            contactConfirmationText: "Tak for din henvendelse, vi vender tilbage hurtigst muligt.",
            freshdeskConfirmationText: "Tak for din henvendelse, vi vender tilbage hurtigst muligt.",

            inputPlaceholder: "Skriv dit spørgsmål her...",
            ratingMessage: "Fik du besvaret dit spørgsmål?",
            headerLogoG: "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/chatbot_logo/logo-1746541405373.png",
            themeColor: "#f9b655",
            headerTitleG: "AI Bæver",
            headerSubtitleG: "Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.",
            subtitleLinkText: "",
            subtitleLinkUrl: "",
            
            titleG: "AI Bæver",
            firstMessage: "Hej 😊 Spørg mig om alt – lige fra produkter til generelle spørgsmål, ordrestatus, eller tips & tricks til drikkevarer og grej 🍹🍾",
            parentWebsiteUserId: websiteUserId,
            isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
            isPhoneView: window.innerWidth < 800
          },
          'https://skalerbartprodukt.onrender.com'
        );
      } else {
        console.error('[bevco-inline.js] Iframe window not available');
      }
    }

    // Adjust iframe size based on toggle state
    function adjustIframeSize() {
      iframeElement.style.transition = 'height 0.3s ease'; // Smooth transitions
      iframeElement.style.height = isIframeEnlarged ? '800px' : '600px';
    }

    // Listen for messages from the iframe
    window.addEventListener('message', function (event) {
      if (event.origin !== 'https://skalerbartprodukt.onrender.com') {
        return; // Ignore messages from unknown origins
      }
      
      if (event.data.action === 'toggleSize') {
        isIframeEnlarged = !isIframeEnlarged;
        adjustIframeSize();
      }
    });

    // On iframe load, send the integration options
    function iframeLoaded() {
      // Small delay so the iframe is ready for postMessage
      setTimeout(sendMessageToIframe, 200);
    }

    // Attach load listener
    iframeElement.addEventListener('load', iframeLoaded);
  });
})();

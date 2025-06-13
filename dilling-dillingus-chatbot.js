function initChatbot() {

  const urlFlag = new URLSearchParams(window.location.search).get('chat');
  if (urlFlag === 'open') {
    // remember the preference so refreshes or internal navigation keep it open
    localStorage.setItem('chatWindowState', 'open');
    // optional: scrub the parameter from the address bar
    history.replaceState(null, '', window.location.pathname);
  }
  
  // Check if already initialized
  if (document.getElementById('chat-container')) {
   // console.log("Chatbot already loaded.");
    return;
  }    
      
  // 1. Create a unique container for your widget
  var widgetContainer = document.createElement('div');
  widgetContainer.id = 'my-chat-widget';
  document.body.appendChild(widgetContainer);    
  
  /**
   * 1. GLOBAL & FONT SETUP
   */
  var isIframeEnlarged = false; 
  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;600;900&display=swap';
  document.head.appendChild(fontLink);

  /**
   * 2. INJECT CSS
   */
  var css = `
    /* ----------------------------------------
       A) ANIMATIONS
       ---------------------------------------- */
    @keyframes blink-eye {
      0%, 100% { transform: scaleY(1); }
      50% { transform: scaleY(0.1); }
    }
    @keyframes jump {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    #funny-smiley.blink {
      display: inline-block;
      animation: blink-eye 0.5s ease-in-out 2;
    }
    #funny-smiley.jump {
      display: inline-block;
      animation: jump 0.5s ease-in-out 2;
    }
  
    /* ----------------------------------------
       C) CHAT BUTTON + POPUP STYLES
       ---------------------------------------- */
    #chat-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 200;
    }
    #chat-button {
      cursor: pointer;
      background: none;
      border: none;
      position: fixed;
      z-index: 20;
      right: 20px;
      bottom: 20px;
    }
    #chat-button svg {
      width: 60px;
      height: 60px;
      transition: opacity 0.3s;
      scale: 1.4;
    }
    #chat-button:hover svg {
      opacity: 0.7;
      transform: scale(1.1);
    }
  
    /* Popup rise animation */
    @keyframes rise-from-bottom {
      0% {
        transform: translateY(50px) scale(1);
        opacity: 0;
      }
      100% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
  
    /* Popup container */
    #chatbase-message-bubbles {
      position: absolute;
      bottom: 9px;
      right: 46px;
      border-radius: 20px;
      font-family: 'Montserrat', sans-serif;
      font-size: 20px;
      z-index: 18;
      scale: 0.60;
      cursor: pointer;
      display: none; /* hidden by default */
      flex-direction: column;
      gap: 50px;
      background-color: white;
      transform-origin: bottom right;
      box-shadow:
        0px 0.6px 0.54px -1.33px rgba(0, 0, 0, 0.15),
        0px 2.29px 2.06px -2.67px rgba(0, 0, 0, 0.13),
        0px 10px 9px -4px rgba(0, 0, 0, 0.04),
        rgba(0, 0, 0, 0.125) 0px 0.362176px 0.941657px -1px,
        rgba(0, 0, 0, 0.18) 0px 3px 7.8px -2px;
      animation: rise-from-bottom 0.6s ease-out;
    }
    #chatbase-message-bubbles::after {
      content: '';
      position: absolute;
      bottom: 0px;
      right: 30px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 10px 0 20px;
      border-color: white transparent transparent transparent;
      box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px;
    }
  
    /* Close button is hidden by default; becomes visible/enlarged on hover */
    #chatbase-message-bubbles .close-popup {
      position: absolute;
      top: 8px;
      right: 15px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      background-color: rgba(224, 224, 224, 0);
      color: black;
      opacity: 0;
      transform: scale(0.7);
      transition: background-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;
      z-index: 1000000;
      pointer-events: none;
    }
    #chatbase-message-bubbles:hover .close-popup {
      opacity: 1;
      transform: scale(1.2);
      pointer-events: auto;
    }
    #chatbase-message-bubbles .close-popup:hover {
      background-color: black;
      color: white;
    }
   
    @media (max-width: 600px) {
      #chatbase-message-bubbles {
        width: 90vw;
        max-width: 90vw;
        bottom: 69px;
        right: 0vw;
      }
    }
  
    :root {
      --icon-color: #000000;
    }
  
    /* The main message content area */
    #chatbase-message-bubbles .message-content {
      display: flex;
      justify-content: flex-end;
      padding: 0;
    }
    #chatbase-message-bubbles .message-box {
      background-color: white;
      color: black;
      border-radius: 10px;
      padding: 12px 12px 12px 20px;
      margin: 8px;
      font-size: 25px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
      line-height: 1.4em;
      opacity: 1;
      transform: scale(1);
      transition: opacity 1s, transform 1s;
      width: 100%;
      box-sizing: border-box;
      word-wrap: break-word;
      max-width: 100%;
      text-align: center;
    }
    .gDpkyS {
      position: fixed;
      width: 100vw;
      height: 100%;
      bottom: 0em;
      right: 0em;
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0.3em 0.5em;
      border-radius: 0.8em;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      visibility: visible;
    }    
  `;
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  /**
   * 3. INJECT HTML
   */
  var chatbotHTML = `
      <div id="chat-container">
        <!-- Chat Button -->
        <button id="chat-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 66 66" fill="none">
          <circle cx="33" cy="33" r="33" fill="#A3A3A3"/>
          <path d="M39.5405 38.5859H28.0146L20.547 46.575V38.5859H18.8959C16.6004 38.5859 14.7388 36.7626 14.7388 34.5141V20.7954C14.7388 18.5469 16.6004 16.7235 18.8959 16.7235H39.5415C41.837 16.7235 43.6986 18.5469 43.6986 20.7954V34.515C43.6986 36.7635 41.837 38.5868 39.5415 38.5868L39.5405 38.5859Z" fill="white"/>
          <path d="M20.5469 47.2986C20.4574 47.2986 20.3669 47.2823 20.2792 47.2497C19.9948 47.1412 19.8082 46.8735 19.8082 46.575V39.3096H18.8959C16.1968 39.3096 14 37.1588 14 34.5141V20.7954C14 18.1508 16.1959 16 18.8959 16H39.5414C42.2405 16 44.4373 18.1508 44.4373 20.7954V34.5151C44.4373 37.1588 42.2414 39.3105 39.5414 39.3105H28.3405L21.0918 47.0643C20.9486 47.2172 20.7501 47.2995 20.5469 47.2995V47.2986ZM18.8959 17.4471C17.0112 17.4471 15.4774 18.9494 15.4774 20.7954V34.5151C15.4774 36.361 17.0112 37.8633 18.8959 37.8633H20.5469C20.9551 37.8633 21.2857 38.1871 21.2857 38.5869V44.7137L27.4697 38.0976C27.6101 37.9474 27.8077 37.8624 28.0145 37.8624H39.5405C41.4252 37.8624 42.9589 36.3601 42.9589 34.5141V20.7954C42.9589 18.9494 41.4252 17.4471 39.5405 17.4471H18.8959Z" fill="#231F20"/>
          <path d="M47.1041 24.4567C46.696 24.4567 46.3654 24.7805 46.3654 25.1802V37.3867C46.3654 37.4111 46.3663 37.4347 46.3691 37.4591C46.3709 37.4754 46.5011 39.0735 45.4522 40.2095C44.6922 41.0317 43.4761 41.4486 41.837 41.4486C36.1516 41.4486 30.8559 41.3835 30.8023 41.3835C30.5927 41.379 30.3896 41.4667 30.2474 41.6196L25.6516 46.5561C25.454 46.7677 25.4032 47.0734 25.5214 47.3357C25.6396 47.598 25.9046 47.7671 26.1973 47.7671H37.6882L45.1908 54.8001C45.3312 54.9313 45.5149 55.0009 45.7015 55.0009C45.803 55.0009 45.9065 54.9801 46.0025 54.9376C46.2768 54.8173 46.4494 54.5469 46.4393 54.253L46.2158 47.7671H47.1032C49.8023 47.7671 51.9991 45.6163 51.9991 42.9717V29.2521C51.9991 26.6084 49.8032 24.4567 47.1032 24.4567H47.1041Z" fill="#231F20"/>
          <path d="M23.4243 28.7374C24.2035 28.7374 24.8352 28.1187 24.8352 27.3554C24.8352 26.5921 24.2035 25.9734 23.4243 25.9734C22.645 25.9734 22.0133 26.5921 22.0133 27.3554C22.0133 28.1187 22.645 28.7374 23.4243 28.7374Z" fill="#231F20"/>
          <path d="M29.5307 28.7374C30.31 28.7374 30.9417 28.1187 30.9417 27.3554C30.9417 26.5921 30.31 25.9734 29.5307 25.9734C28.7515 25.9734 28.1198 26.5921 28.1198 27.3554C28.1198 28.1187 28.7515 28.7374 29.5307 28.7374Z" fill="#231F20"/>
          <path d="M35.6373 28.7374C36.4165 28.7374 37.0482 28.1187 37.0482 27.3554C37.0482 26.5921 36.4165 25.9734 35.6373 25.9734C34.858 25.9734 34.2263 26.5921 34.2263 27.3554C34.2263 28.1187 34.858 28.7374 35.6373 28.7374Z" fill="#231F20"/>
          </svg>
        </button>
  
        <!-- Popup -->
        <div id="chatbase-message-bubbles">
          <div class="close-popup">&times;</div>
          <div class="message-content">
            <div class="message-box" id="popup-message-box">
              <!-- Will be replaced dynamically for new/returning user -->
            </div>
          </div>
        </div>
      </div>
  
      <!-- Chat Iframe -->
      <iframe
        id="chat-iframe"
        src="https://skalerbartprodukt.onrender.com"
        style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;">
      </iframe>
  `;
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  /**
   * 4. COOKIE FUNCTIONS
   */
  function setCookie(name, value, days, domain) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days*24*60*60*1000);
      expires = "; expires=" + date.toUTCString();
    }
    var domainStr = domain ? "; domain=" + domain : "";
    document.cookie = name + "=" + (value || "") + expires + domainStr + "; path=/";
  }
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i=0; i<ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function getCurrentTimestamp() {
    return new Date().getTime();
  }

  /**
   * 5. CHAT IFRAME LOGIC
   */
  function sendMessageToIframe() {
    var iframe = document.getElementById("chat-iframe");
    var iframeWindow = iframe.contentWindow;

    var messageData = {
      action: 'integrationOptions',
      chatbotID: "dillingus",
      pagePath: window.location.href,
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/740370a9-f01d-493e-bbe4-ec374aa9e5d8",
      SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/",
      apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/75ae5c08-459e-4a2e-915c-a6df55b5dcd6",
      fordelingsflowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/61d3da9c-fea8-41b8-ae9e-bed791666cf2",
      flow2Key: "product",
      flow2API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/7a6747f1-7aa4-489f-b0a9-79aa5d1f0c98",
      flow3Key: "productnofilter",
      flow3API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/7a6747f1-7aa4-489f-b0a9-79aa5d1f0c98",
      flow4API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/eebcb827-cf5b-4ee2-8279-71b8639c3d06",
      flow4Key: "category",
      
      imageAPI: "",
  
      metaDataAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/11751a16-1c96-4710-8d18-2987f8b4e21c",
      metaDataKey: "product",
  
      apiFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/4becf9f7-6eca-4ec7-a793-595b2cadb90e",
      apiVarFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/a4a1f49f-2060-4030-8b50-53ad3a1e4d6f",
      apiFlowKey: "order",
      
     // Order tracking URL with placeholders
  orderTrackingUrl: 'https://api.europe-west1.gcp.commercetools.com/dilling--production/orders?where=orderNumber="ORDER_NUMBER_PLACEHOLDER" and shippingAddress(email="EMAIL_PLACEHOLDER")',
  
  // Authentication settings remain the same
  trackingAuthUrl: 'https://auth.europe-west1.gcp.commercetools.com/oauth/token',
  trackingClientId: 'PpRchVoadh-EOZVSM93udjN2',
  trackingClientSecret: 'oF43LNYPaAgJkg-qqabTaDIQge1uIyfA',
  trackingAuthGrantType: 'client_credentials',
  trackingAuthScope: 'view_orders:dilling--production view_published_products:dilling--production view_states:dilling--production',
  trackingAuthMethod: 'basic',
  
  // Request configuration
  trackingRequestMethod: 'GET',
  trackingCustomHeaders: {},
  
  // Required fields
  trackingRequiredFields: ['order_number', 'email'],
  
  // State configuration
  trackingStateUrl: 'https://api.europe-west1.gcp.commercetools.com/dilling--production/states/STATE_ID_PLACEHOLDER',
  trackingStateNameLocale: 'da-DK',
  
  // Auth is required
  trackingNeedsAuth: true,

      useThumbsRating: true,
      ratingTimerDuration: 10000,

      pineconeApiKey: "pcsk_GNBAU_9Y2fpBkz3mhEpx6EYLZjov7rJd4DuMNg76vpm8fZqsvPK6rkFCdEPTwRh5YuRUh",
      knowledgebaseIndexApiEndpoint: "dillingus-faq",
      flow2KnowledgebaseIndex: "dillingus-pro",
      flow3KnowledgebaseIndex: "dillingus-pro",
      flow4KnowledgebaseIndex: "dillingus-kat",
      apiFlowKnowledgebaseIndex: "dillingus-faq",
      websiteOverride: "dilling.us",
      languageOverride: "English",
      valutaOverride: "$",
      customVar1: "",
      dillingProductsKatOverride: "Whenever there is a category link in the context, and if it matches the user's request, add it in the end as a hyperlink to the category. Do this often. They look like this: https://us.dilling.com/category/example, but never create your own links, you must find them in the content, and if there is none, add the matching broad category from here and always say that they can use the productfilter to try to find their product: https://us.dilling.com/category/women, https://us.dilling.com/category/men, https://us.dilling.com/category/children and https://us.dilling.com/category/baby, https://us.dilling.com/category/new (if no gender or age is provided). The hyperlink name should match the URL end, e.g. category/lady hyperlink name should be category lady. It's fine to send a broad link and always explain that they can try use the product filter on the category page you sent.",
      dillingColors: "Aqua blue,  Apricot,  Arctic blue,  Arctic blue/ nature,  Aubergine,  Azure blue,  Bark,  Beige,  Beige melange,  Beige/natur,  Black,  Black melange,  Black/nature,  Blue,  Blue granite melange,  Blue wild rye,  Blush,  Bordeaux,  Bright blue,  Brown,  Brown check,  Brown melange,  Bubblegum,  Burgundy,  Butter,  Candyfloss,  Cappuccino/beige,  Caramel,  Caramel melange,  Chestnut brown,  Chocolate brown,  Christmas heart,  Cobalt blue,  Cocoa,  Copper brown,  Corten red,  Croissant,  Dark blue,  Dark brown,  Dark cherry,  Dark chocolate brown,  Dark green,  Dark green melange,  Dark grey melange,  Dark navy,  Dark nutmeg,  Dark Pink,  Dark plum,  Dark red,  Deep rose,  Deep sea blue,  Deep teal,  Desert grass,  Dusty black,  Dusty blue,  Dusty blue/stormy blue,  Dusty green,  Dusty lavender,  Eggnog,  Elderberry,  Forest green,  Forest night,  Frappé,  Frosty green,  Fudge,  Grape,  Green,  Grey,  Grey melange,  Grey striped,  Grey/green,  Hazelnut,  Icy blue,  Ivory,  Jade green,  Jade green/nature,  Jungle green,  Lavender,  Lemongrass,  Light blue melange,  Light brown melange,  Light grey melange,  Light grey melange/nature,  Light orchid,  Light yellow/nature,  Lilac,  Lilac melange,  Mahogany rose,  Mahogany rose/ nature,  Mauve Orchid,  Merlot,  Midnight blue,  Misty pink,  Mocha,  Moonstone,  Moss,  Mottled blue,  Mustard,  Nature,  Navy,  Navy blue,  Navy check,  Nordic blue,  Nordic blue/nature,  Nordic lilac melange,  Nordic navy,  Nordic soil,  Oatmeal,  Old rose,  Olive green,  Orange,  Pear green,  Pear green/ nature,  Pearl white,  Peonies pink,  Petrol blue,  Pine green,  Pink,  Pink blush,  Pink carnation,  Pomegranate,  Pomegranate/nordic blue/nature,  Pomegranate/strawberry milkshake,  Powder,  Purple plum,  Rasberry frosting,  Raspberry,  Red,  Red melange,  Rose powder,  Rose quartz,  Rouge,  Royal Blue,  Sand,  Seamist,  Silver sage,  Steel,  Strawberry milkshake,  Strawberry red,  Taupe,  Thunder blue,  Turquoise,  Undyed cotton,  Vintage ballerina,  Vintage grey,  Walnut,  Walnut/nature,  Warm grey,  White,  White/navy,  Winter sky",      
      
      replaceExclamationWithPeriod: true,
      fontFamily: "Montserrat, sans-serif",
      productButtonText: "VIEW PRODUCT",
      
      // Set FreshdeskForm text
      freshdeskEmailLabel: "Your email:",
      freshdeskMessageLabel: "Message to customer service:",
      freshdeskImageLabel: "Upload image (optional):",
      freshdeskChooseFileText: "Choose file",
      freshdeskNoFileText: "No file chosen",
      freshdeskSendingText: "Sending...",
      freshdeskSubmitText: "Send inquiry",
        
      // Set FreshdeskForm validation error messages
      freshdeskEmailRequiredError: "Email is required",
      freshdeskEmailInvalidError: "Please enter a valid email address",
      freshdeskFormErrorText: "Please correct the errors in the form",
      freshdeskMessageRequiredError: "Message is required",
      freshdeskSubmitErrorText: "An error occurred while sending the inquiry. Please try again.",
      productImageHeightMultiplier: 1.1,  
      // Set confirmation messages
      contactConfirmationText: "Thank you for your inquiry, we will get back to you as soon as possible.",
      freshdeskConfirmationText: "Thank you for your inquiry, we will get back to you as soon as possible.",

      freshdeskNameRequiredError: "Name is required",
      freshdeskNameLabel: "Name:",

      
      freshdeskGroupId: 22000168002,

      inputPlaceholder: "Type your question here...",
      ratingMessage: "Did you get your question answered?",
      privacyLink: "https://image-hosting-pi.vercel.app/Privacy_Policy_Dilling_English.pdf",
      titleLogoG: "http://dialogintelligens.dk/wp-content/uploads/2025/01/Dilling_whitemessagelogo-1.png",
      headerLogoG: "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/chatbot_logo/logo-1741613117737.png",
      messageIcon: "https://image-hosting-pi.vercel.app/messageicon.png",
      themeColor: "#000000",
      headerTitleG: "I am DILLING's AI chatbot",
      headerSubtitleG: "You are chatting with an AI chatbot. By doing so, you accept that the conversation may be stored and processed to improve your experience. Read more in our privacy policy. Note: the chatbot may occasionally provide incorrect information.",
      titleG: "DILLING's chat",
      firstMessage: "Hello 🙂 I am new at DILLING and still in training. But I will do my best if you have questions about DILLING or our products. How can I help you?",
      isTabletView: (window.innerWidth < 1000 && window.innerWidth > 800),
      isPhoneView: (window.innerWidth < 800)
    };

    // If the iframe is already visible, post the message immediately.
    if (iframe.style.display !== 'none') {
      try {
        iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
      } catch (e) {
        console.error("Error posting message to iframe:", e);
      }
    } else {
      // If not visible, assign onload to post the message when it appears.
      iframe.onload = function() {
        try {
          iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
        } catch (e) {
          console.error("Error posting message on iframe load:", e);
        }
      };
    }
  }

  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    if (event.origin !== "https://skalerbartprodukt.onrender.com") return;
    if (event.data.action === 'toggleSize') {
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === 'closeChat') {
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
    } else if (event.data.action === 'navigate') {
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
      window.location.href = event.data.url;
    }
  });

  /**
   * 6. TOGGLE CHAT WINDOW
   */
  function toggleChatWindow() {
    var iframe = document.getElementById('chat-iframe');
    var button = document.getElementById('chat-button');
    var popup = document.getElementById("chatbase-message-bubbles");
  
    // Determine if the chat is currently open
    var isCurrentlyOpen = iframe.style.display !== 'none';
  
    // Toggle the display of the iframe and button
    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    button.style.display = isCurrentlyOpen ? 'block' : 'none';
    localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
  
    // Close the popup when the chat is opened
    if (!isCurrentlyOpen) {
      popup.style.display = "none";
    //  localStorage.setItem("popupClosed", "true");  // Save that the popup has been closed
    }
  
    // Adjust the iframe size
    adjustIframeSize();
  
    // When opening, let the iframe know after a short delay
    if (!isCurrentlyOpen) {
      setTimeout(function() {
        iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
      }, 100);
    }
  }
  
  // If the popup is open at DOM load, hide it
  var popup = document.getElementById("chatbase-message-bubbles");
  if (popup && popup.style.display === "flex") {
    popup.style.display = "none";
  }
  
  /**
   * 7. SHOW/HIDE POPUP
   */
  function showPopup() {
    // Prevent popup on mobile devices (window width < 800px)
    if (window.innerWidth < 800) {
      return;
    }
  
    var iframe = document.getElementById("chat-iframe");
    // If the iframe is visible, do not show the popup
    if (iframe.style.display !== "none") {
      return;
    }
          
    var popup = document.getElementById("chatbase-message-bubbles");
    var messageBox = document.getElementById("popup-message-box");
    
    const popupText = "Do you need help?";
    messageBox.innerHTML = `${popupText} <span id="funny-smiley">😊</span>`;
    
    // Determine popup width based on character count (excluding any HTML tags)
    var charCount = messageBox.textContent.trim().length;
    var popupElem = document.getElementById("chatbase-message-bubbles");
    if (charCount < 25) {
      popupElem.style.width = "380px";
    } else if (charCount < 60) {
      popupElem.style.width = "405px";
    } else {
      popupElem.style.width = "460px";
    }
    
    popup.style.display = "flex";
    
    // Blink after 2s
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('blink');
        setTimeout(function() {
          smiley.classList.remove('blink');
        }, 1000);
      }
    }, 2000);
    
    // Jump after 12s
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('jump');
        setTimeout(function() {
          smiley.classList.remove('jump');
        }, 1000);
      }
    }, 12000);
  }
  
  // Close the popup and save the state in LocalStorage
  var closePopupButton = document.querySelector("#chatbase-message-bubbles .close-popup");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", function() {
      document.getElementById("chatbase-message-bubbles").style.display = "none";
      localStorage.setItem("popupClosed", "true");  // Save popup closed state
    });
  }

  // Add event listener to popup so clicking on it (except the close button) toggles the chat window
var popupContainer = document.getElementById("chatbase-message-bubbles");
popupContainer.addEventListener("click", function(e) {
  // Ensure that clicking on the close button does not trigger toggling the chat
  if (e.target.closest(".close-popup") === null) {
    toggleChatWindow();
  }
});

    
  // Check if the popup has been closed previously
  // var popupClosed = localStorage.getItem("popupClosed");
  // if (!popupClosed || popupClosed === "false") {
  //   setTimeout(showPopup, 7000);
  // }
  setTimeout(showPopup, 1000);
    
  /**
   * 9. ADJUST IFRAME SIZE
   */
  function adjustIframeSize() {
    var iframe = document.getElementById('chat-iframe');
    //console.log("Adjusting iframe size. Window width:", window.innerWidth);
  
    // Keep 'isIframeEnlarged' logic if toggled from the iframe
    if (isIframeEnlarged) {
      iframe.style.width = 'calc(2 * 45vh + 6vw)';
      iframe.style.height = (window.innerHeight < 720) ? '87vh' : '88vh';
    } else {
      if (window.innerWidth < 1000) {
        iframe.style.width = '95vw';
        iframe.style.height = (window.innerHeight < 720) ? '87vh' : '90vh';
      } else {
        iframe.style.width = 'calc(45vh + 6vw)';
        iframe.style.height = (window.innerHeight < 720) ? '87vh' : '88vh';
      }
    }
  
    // Always position fixed
    iframe.style.position = 'fixed';
  
    // Center if mobile, else bottom-right
    if (window.innerWidth < 1000) {
      iframe.style.left = '50%';
      iframe.style.top = '50%';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.bottom = '';
      iframe.style.right = '';
    } else {
      iframe.style.left = 'auto';
      iframe.style.top = 'auto';
      iframe.style.transform = 'none';
      iframe.style.bottom = '0vh';
      iframe.style.right = '2vw';
    }
  
    sendMessageToIframe();
  }
  // Adjust size on page load + on resize
  adjustIframeSize();
  window.addEventListener('resize', adjustIframeSize);
  
  // Attach event listener to chat-button
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);
  
  // Modify the initial chat window state logic
  var savedState = localStorage.getItem('chatWindowState');
  var iframe = document.getElementById('chat-iframe');
  var button = document.getElementById('chat-button');
  
  if (savedState === 'open') {
    iframe.style.display = 'block';
    button.style.display = 'none';
    sendMessageToIframe();
  } else {
    iframe.style.display = 'none';
    button.style.display = 'block';
  }
  
  // Chat button click
  document.getElementById("chat-button").addEventListener("click", toggleChatWindow);
} // end of initChatbot

// Initial attempt to load the chatbot.
initChatbot();

// After 2 seconds, check if a key element is present; if not, reinitialize.
setTimeout(function() {
  if (!document.getElementById('chat-container')) {
   // console.log("Chatbot not loaded after 2 seconds, retrying...");
    initChatbot();
  }
}, 5000);

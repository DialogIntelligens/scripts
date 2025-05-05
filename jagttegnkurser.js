document.addEventListener('DOMContentLoaded', function() {

  function initChatbot() {
    // Check if already initialized
    if (document.getElementById('chat-container')) {
      console.log("Chatbot already loaded.");
      return;
    }

    /**
     * PURCHASE TRACKING FUNCTIONS
     */
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    function getOrCreateWebsiteUserId() {
      let websiteUserId = localStorage.getItem('websiteUserId');
      if (!websiteUserId) {
        websiteUserId = generateUUID();
        localStorage.setItem('websiteUserId', websiteUserId);
        console.log("Generated new websiteUserId:", websiteUserId);
      } else {
        console.log("Using existing websiteUserId:", websiteUserId);
      }
      return websiteUserId;
    }

    function isCheckoutPage() {
      const isCheckout = window.location.href.includes('/checkout/'); // Ensure this path is correct
      console.log("Is checkout page:", isCheckout);
      return isCheckout;
    }

    // Track initial visit and purchase status
    function trackPurchaseStatus() {
      const websiteUserId = getOrCreateWebsiteUserId();
      const madePurchase = isCheckoutPage();
      const chatbotId = "jagttegnkurser"; // Make sure this matches your chatbotID in messageData

      console.log("Tracking initial visit/purchase status for:", websiteUserId, "Purchase:", madePurchase);

      // Only track initial visit and purchase status.
      // usedchatbot will be set later by the chatbot app if interaction occurs.
      fetch('https://egendatabasebackend.onrender.com/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteuserid: websiteUserId,
          // user_id is handled by backend (uses websiteuserid)
          // usedchatbot is handled by backend (defaults false, updated later)
          madePurchase: madePurchase, // Send boolean directly
          chatbot_id: chatbotId
        })
      })
      .then(response => {
        if (!response.ok) {
            // Log error response text for debugging
            response.text().then(text => {
                console.error('Error updating tracking - Response status:', response.status, 'Text:', text);
            });
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => console.log('Initial tracking updated:', data))
      .catch(error => {
          console.error('Error during initial tracking fetch:', error);
          // Optional: retry logic if needed
          // setTimeout(() => trackPurchaseStatus(), 5000);
      });
    }

    // --- Call tracking function right after defining it ---
    trackPurchaseStatus();

    // 1. Create a unique container for your widget
    var widgetContainer = document.createElement('div');
    widgetContainer.id = 'my-chat-widget'; // Use a more specific ID if needed
    document.body.appendChild(widgetContainer);

    /**
     * 1. GLOBAL & FONT SETUP
     */
    var isIframeEnlarged = false;
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;600;900&display=swap';
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
    #chat-container { /* This is the parent div added by script */
      position: fixed;
      bottom: 20px;
      right: 10px;
      z-index: 200; /* Lower than iframe */
    }
    #chat-button { /* The button itself */
      cursor: pointer;
      background: none;
      border: none;
      position: fixed;
      z-index: 20; /* Ensure button is above popup but below iframe */
      right: 10px;
      bottom: 20px;
    }
    #chat-button svg {
      width: 60px;
      height: 60px;
      transition: opacity 0.3s, transform 0.3s;
    }
    #chat-button:hover svg {
      opacity: 0.7;
      transform: scale(1.1);
    }

    /* Popup rise animation */
    @keyframes rise-from-bottom {
      0% {
        transform: translateY(50px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }

    /* Popup container */
    #chatbase-message-bubbles {
      position: absolute; /* Position relative to #chat-container */
      bottom: 70px; /* Position above the button */
      right: 7px;
      border-radius: 10px;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 20px;
      z-index: 18; /* Below button */
      scale: 0.55;
      cursor: pointer;
      display: none; /* hidden by default */
      flex-direction: column;
      gap: 50px; /* Check if needed */
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
    /* Triangle pointing down */
    #chatbase-message-bubbles::after {
      content: '';
      position: absolute;
      bottom: -10px; /* Position below the bubble */
      right: 30px; /* Align with bubble edge */
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 10px 0 10px; /* Make triangle point down */
      border-color: white transparent transparent transparent;
      /* Adjust shadow if needed */
      /* box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px; */
    }

    /* Close button is hidden by default; becomes visible/enlarged on hover */
    #chatbase-message-bubbles .close-popup {
      position: absolute;
      top: 8px;
      right: 9px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      background-color: rgba(224, 224, 224, 0);
      color: black;
      opacity: 0;
      transform: scale(0.7);
      transition: background-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;
      z-index: 1000000; /* High z-index within bubble */
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
        bottom: 69px; /* Adjust if needed */
        right: 0vw;
      }
       #chatbase-message-bubbles::after {
          right: 15px; /* Adjust triangle position for mobile */
       }
    }

    :root {
      --icon-color: #626b4e; /* Jagt specific color */
    }

    /* The main message content area */
    #chatbase-message-bubbles .message-content {
      display: flex;
      justify-content: flex-end; /* Or start if needed */
      padding: 0;
    }
    #chatbase-message-bubbles .message-box {
      background-color: white;
      color: black;
      border-radius: 10px;
      padding: 12px 24px 12px 20px;
      margin: 8px;
      font-size: 28px; /* Check if this is too large */
      font-family: 'Source Sans 3', sans-serif;
      font-weight: 400;
      line-height: 1em;
      opacity: 1;
      transform: scale(1);
      transition: opacity 1s, transform 1s;
      width: 100%;
      box-sizing: border-box;
      word-wrap: break-word;
      max-width: 100%;
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
           <!-- Jagttegn SVG (Replace with actual SVG if needed, using theme color) -->
           <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M5.211 16.563C4.784 16.814 4.5 17.257 4.5 17.75V19.5C4.5 20.329 5.172 21 6 21H18C18.828 21 19.5 20.329 19.5 19.5V17.75C19.5 17.257 19.216 16.814 18.789 16.563L15.05 14.525L15.5 11.5H17.25C17.664 11.5 18 11.164 18 10.75V4.75C18 4.336 17.664 4 17.25 4H15.5V3.75C15.5 3.336 15.164 3 14.75 3H9.25C8.836 3 8.5 3.336 8.5 3.75V4H6.75C6.336 4 6 4.336 6 4.75V10.75C6 11.164 6.336 11.5 6.75 11.5H8.5L8.95 14.525L5.211 16.563ZM12.75 5.5H11.25V7H9.75V8.5H11.25V10H12.75V8.5H14.25V7H12.75V5.5Z" fill="var(--icon-color)"/>
           </svg>
        </button>

        <!-- Popup -->
        <div id="chatbase-message-bubbles">
          <div class="close-popup">&times;</div>
          <div class="message-content">
            <div class="message-box" id="popup-message-box">
              <!-- Will be replaced dynamically -->
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
    // Inject into the specific container, not just body
    widgetContainer.innerHTML = chatbotHTML;

    /**
     * 4. COOKIE FUNCTIONS (Consider if still needed, localStorage is used for userId)
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

    /**
     * 5. CHAT IFRAME LOGIC
     */
    function sendMessageToIframe() {
      var iframe = document.getElementById("chat-iframe");
      if (!iframe || !iframe.contentWindow) {
          console.error("Iframe not ready to receive messages.");
          return; // Exit if iframe isn't ready
      }
      var iframeWindow = iframe.contentWindow;

      // Retrieve or create websiteuserid in parent domain's localStorage
      let websiteUserId = getOrCreateWebsiteUserId();

      // Ensure all chatbot-specific configurations are correct
      var messageData = {
        action: 'integrationOptions',
        chatbotID: "jagttegnkurser", // <<< CONFIRM THIS IS CORRECT
        pagePath: window.location.href,
        statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/14ac2aa7-8ad3-474e-99d8-59ff691bb77b",
        // SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/", // Likely not needed if using HTTP API
        apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/3b8a2716-85de-45ae-b3c9-0522f13d4c0f",
        fordelingsflowAPI: "", // Add value if needed
        flow2Key: "",
        flow2API: "",
        flow3Key: "",
        flow3API: "",
        // SOCKET_SERVER_URL_Backup: "", // Remove if not used
        // apiEndpointBackup: "",
        // fordelingsflowAPIBackup: "",
        // flow2APIBackup: "",
        // flow3APIBackup: "",
        leadGen: "%%",
        leadMail: "info@jagttegnkurser.dk",
        leadField1: "Navn",
        leadField2: "Telefon nummer",
        imageAPI: '', // Add value if needed
        privacyLink: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Privatlivspolitik_jagttegnkurser.pdf",
        // titleLogoG: "http://dialogintelligens.dk/wp-content/uploads/2024/12/jagttegnkurserWhiteMessageLogo.png", // Likely not needed, App.js uses headerLogoG
        headerLogoG: "http://dialogintelligens.dk/wp-content/uploads/2024/12/jagttegnkurserLogo.png",
        messageIcon: "http://dialogintelligens.dk/wp-content/uploads/2024/12/jagttegnkurserWhiteMessageLogo.png", // Use this for the AI message icon
        themeColor: "#626b4e",
        headerTitleG: "Jagttegn kursers Virtuelle Assistent",
        headerSubtitleG: "Du skriver med en kunstig intelligens. Ved at brug denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.",
        titleG: "Jagttegn kurser", // Browser tab title
        firstMessage: "Hej😊 Hvad kan jeg hjælpe dig med?🫎",
        fontFamily: "'Source Sans 3', sans-serif", // Pass font family

        // Pass the generated/retrieved ID to the iframe
        parentWebsiteUserId: websiteUserId,

        // Send device info for responsive design in iframe
        isTabletView: window.innerWidth < 1000 && window.innerWidth >= 800, // Adjusted breakpoint
        isPhoneView: window.innerWidth < 800
      };

      // If the iframe is already visible, post the message immediately.
      if (iframe.style.display !== 'none') {
        try {
          console.log("Posting messageData to visible iframe:", messageData);
          iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
        } catch (e) {
          console.error("Error posting message to iframe:", e);
        }
      } else {
        // If not visible, assign onload to post the message when it appears.
        iframe.onload = function() {
          try {
             console.log("Posting messageData to iframe on load:", messageData);
            iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
          } catch (e) {
            console.error("Error posting message on iframe load:", e);
          }
        };
      }
    }

    // Listen for messages from the iframe
    window.addEventListener('message', function(event) {
      // IMPORTANT: Always verify the origin for security
      if (event.origin !== "https://skalerbartprodukt.onrender.com") {
        // console.log("Ignoring message from origin:", event.origin); // Uncomment for debugging
        return;
      }

      // console.log("Received message from iframe:", event.data); // Uncomment for debugging

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
        window.location.href = event.data.url; // Navigate parent window
      } else if (event.data.action === 'conversationStarted') {
        // This event is now just informational for the parent page.
        // The actual tracking update (setting usedchatbot=true)
        // is initiated by the chatbot application (App.js) itself
        // when it receives the parentWebsiteUserId.
        console.log("Conversation started event received from iframe (tracking update initiated by App.js).");
        // --- FETCH CALL PREVIOUSLY HERE IS REMOVED ---
      }
    });

    /**
     * 6. TOGGLE CHAT WINDOW
     */
    function toggleChatWindow() {
      var iframe = document.getElementById('chat-iframe');
      var button = document.getElementById('chat-button');
      var popup = document.getElementById("chatbase-message-bubbles");

      if (!iframe || !button || !popup) {
          console.error("Chat elements not found for toggling.");
          return;
      }

      var isCurrentlyOpen = iframe.style.display !== 'none';

      iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
      button.style.display = isCurrentlyOpen ? 'block' : 'none';
      localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');

      if (!isCurrentlyOpen) {
        popup.style.display = "none";
        localStorage.setItem("popupClosed", "true");
      }

      adjustIframeSize(); // Adjust size *after* display change

      if (!isCurrentlyOpen) {
         // Ensure message is sent *after* iframe is potentially loaded/displayed
         setTimeout(function() {
             sendMessageToIframe(); // Send config data when opening
             iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
         }, 150); // Small delay
      }
    }


    // If the popup is open at DOM load, hide it (unlikely but safe check)
    var initialPopup = document.getElementById("chatbase-message-bubbles");
    if (initialPopup && initialPopup.style.display === "flex") {
      initialPopup.style.display = "none";
    }

    /**
     * 7. SHOW/HIDE POPUP LOGIC
     */
    function showPopup() {
      var iframe = document.getElementById("chat-iframe");
      // If the iframe is visible OR the popup has been manually closed via 'x', do not show.
      if ((iframe && iframe.style.display !== "none") || localStorage.getItem("popupClosed") === "true") {
        console.log("Popup suppressed (chat open or previously closed).");
        return;
      }

      var popup = document.getElementById("chatbase-message-bubbles");
      var messageBox = document.getElementById("popup-message-box");
      if (!popup || !messageBox) {
          console.error("Popup elements not found for showing.");
          return;
      }

      // Dynamic popup text (Example)
      const popupText = "Hej! Jeg kan svare på spørgsmål omkring jagt og vores kurser🦌 Har du brug for hjælp? ";
      messageBox.innerHTML = `${popupText} <span id="funny-smiley">😊</span>`;

      // Adjust width based on text length
      var charCount = messageBox.textContent.trim().length;
      if (charCount < 25) {
        popup.style.width = "380px";
      } else if (charCount < 60) {
        popup.style.width = "405px";
      } else {
        popup.style.width = "460px";
      }

      popup.style.display = "flex";
      console.log("Showing popup.");

      // Make the whole popup clickable to open chat
      popup.removeEventListener("click", toggleChatWindow); // Remove previous listener if any
      popup.addEventListener("click", function(event) {
         // Prevent closing if clicking the close button itself
         if (event.target.classList.contains('close-popup')) return;
         toggleChatWindow();
      });

      // Add animations after short delay
      setTimeout(function() {
        var smiley = document.getElementById('funny-smiley');
        if (smiley && popup.style.display === "flex") {
          smiley.classList.add('blink');
          setTimeout(() => smiley.classList.remove('blink'), 1000); // Blink duration
        }
      }, 2000);

      setTimeout(function() {
        var smiley = document.getElementById('funny-smiley');
        if (smiley && popup.style.display === "flex") {
          smiley.classList.add('jump');
          setTimeout(() => smiley.classList.remove('jump'), 1000); // Jump duration
        }
      }, 12000);
    }

    // Setup close button for popup
    var closePopupButton = document.querySelector("#chatbase-message-bubbles .close-popup");
    if (closePopupButton) {
      closePopupButton.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent popup click listener from firing
        document.getElementById("chatbase-message-bubbles").style.display = "none";
        localStorage.setItem("popupClosed", "true"); // Save state: user manually closed
        console.log("Popup closed manually.");
      });
    }

    // Check if popup should be shown after a delay
    var popupClosed = localStorage.getItem("popupClosed");
    if (!popupClosed || popupClosed === "false") {
        console.log("Scheduling popup to show.");
        setTimeout(showPopup, 7000); // Show popup after 7 seconds if not manually closed
    } else {
        console.log("Popup was previously closed manually, not scheduling.")
    }

    /**
     * 9. ADJUST IFRAME SIZE
     */
    function adjustIframeSize() {
      var iframe = document.getElementById('chat-iframe');
      if (!iframe) return; // Guard clause

      console.log("Adjusting iframe size. Window width:", window.innerWidth, "Enlarged:", isIframeEnlarged);

      // Determine size based on screen width and enlarged state
      let targetWidth = 'calc(45vh + 6vw)'; // Default desktop width
      let targetHeight = '90vh'; // Default height

      if (isIframeEnlarged) {
          targetWidth = 'calc(2 * 45vh + 6vw)'; // Enlarged width
      } else if (window.innerWidth < 800) { // Phone View
          targetWidth = '95vw';
          targetHeight = '90vh'; // Adjust height for mobile if needed
      } else if (window.innerWidth < 1000) { // Tablet View
          targetWidth = '80vw'; // Example tablet width
          targetHeight = '85vh'; // Example tablet height
      }
      // Else: Use default desktop size

      iframe.style.width = targetWidth;
      iframe.style.height = targetHeight;

      // Positioning
      iframe.style.position = 'fixed';
      if (window.innerWidth < 1000) { // Centered for Tablet/Phone
        iframe.style.left = '50%';
        iframe.style.top = '50%';
        iframe.style.transform = 'translate(-50%, -50%)';
        iframe.style.bottom = 'auto';
        iframe.style.right = 'auto';
      } else { // Bottom-right for Desktop
        iframe.style.left = 'auto';
        iframe.style.top = 'auto';
        iframe.style.transform = 'none';
        iframe.style.bottom = '3vh';
        iframe.style.right = '2vw';
      }

      // Re-send data to iframe in case layout changes (optional, might cause loops if iframe resizes parent)
      // sendMessageToIframe();
    }

    // Adjust size on initial load and resize
    adjustIframeSize();
    window.addEventListener('resize', adjustIframeSize);

    // Attach event listener to chat-button
    var chatButton = document.getElementById('chat-button');
    if (chatButton) {
      chatButton.addEventListener('click', toggleChatWindow);
    } else {
        console.error("Chat button not found.");
    }

    // Set initial chat window state based on localStorage
    var savedState = localStorage.getItem('chatWindowState');
    var iframe = document.getElementById('chat-iframe');
    var button = document.getElementById('chat-button');

    if (iframe && button) { // Check if elements exist
      if (savedState === 'open') {
        iframe.style.display = 'block';
        button.style.display = 'none';
        // Send message data when restoring open state
        setTimeout(sendMessageToIframe, 100); // Delay slightly
      } else {
        iframe.style.display = 'none';
        button.style.display = 'block';
      }
    } else {
        console.error("Iframe or button not found for initial state setting.");
    }

  } // end of initChatbot

  // Initial attempt to load the chatbot.
  initChatbot();

  // Fallback check: After 5 seconds, if key elements aren't present, try again.
  setTimeout(function() {
    if (!document.getElementById('chat-iframe') || !document.getElementById('chat-button')) {
      console.warn("Chatbot elements not found after 5 seconds, retrying initialization...");
      initChatbot();
    } else {
      console.log("Chatbot elements confirmed present after 5 seconds.");
    }
  }, 5000);

});

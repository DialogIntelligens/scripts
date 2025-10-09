// Enhanced GTM-compatible initialization
function initWithDebug() {
    // Force immediate initialization for GTM context
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initChatbotSafely, 100);
      });
    } else {
      setTimeout(initChatbotSafely, 100);
    }
  }
  
  // Try multiple initialization strategies for GTM
  if (document.readyState === 'complete') {
    initWithDebug();
  } else if (document.readyState === 'interactive') {
    initWithDebug();
  } else {
    document.addEventListener('DOMContentLoaded', initWithDebug);
  }
  
  // Fallback for GTM context
  setTimeout(function() {
    if (!window.chatbotInitialized) {
      initWithDebug();
    }
  }, 2000);
  
  // Build a unique local-storage key for the current chatbot user
  function purchaseKey(userId) {
    return `purchaseReported_${userId}`;
  }
  
  function initChatbotSafely() {
    // Prevent multiple initializations
    if (window.chatbotInitialized) {
      return;
    }
    
    if (!document.body) {
      setTimeout(initChatbotSafely, 500);
      return;
    }
    
    const urlFlag = new URLSearchParams(window.location.search).get('chat');
    if (urlFlag === 'open') {
      // remember the preference so refreshes or internal navigation keep it open
      localStorage.setItem('chatWindowState', 'open');
      // optional: scrub the parameter from the address bar
      history.replaceState(null, '', window.location.pathname);
    }
      
    // Check if already initialized
    if (document.getElementById('chat-container')) {
      return;
    }
    
    // Mark as initialized
    window.chatbotInitialized = true;            
        // 1. Create a unique container for your widget (GTM-safe)
      var widgetContainer = document.createElement('div');
      widgetContainer.id = 'my-chat-widget';
      
      // Use requestAnimationFrame for smoother DOM manipulation
      requestAnimationFrame(function() {
        try {
          document.body.appendChild(widgetContainer);
        } catch (error) {
          // Silent error handling
        }
      });
  
        /**
     * PURCHASE TRACKING
     */
  let chatbotUserId = localStorage.getItem('chatbotUserId') || null;
  let hasReportedPurchase = false;  // <-- add this line
  
  
    // Check if on checkout page
    function isCheckoutPage() {
    return window.location.href.includes('/ordre') || 
           window.location.href.includes('/order-complete/') ||
           window.location.href.includes('/thank-you/') ||
           window.location.href.includes('/order-received/') ||
           document.querySelector('.order-complete') ||
           document.querySelector('.thank-you') ||
           document.querySelector('.order-confirmation');
  }
  
    //Extract total price from the page
    function extractTotalPrice() {
      let totalPrice = null;
      let highestValue = 0;
    
    // Price extraction logic
      
      // Method 1: Try common selectors for price elements
      const priceSelectors = [
        '.total-price', '.order-total', '.cart-total', '.grand-total',
        '[data-testid="order-summary-total"]', '.order-summary-total',
        '.checkout-total', '.woocommerce-Price-amount', '.amount',
        '.product-subtotal', '.order-summary__price', '[data-price-value]'
      ];
      
      
      // Loop through each selector
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector);
      // Check elements for selector
        
        if (elements && elements.length > 0) {
          
          // Check each element that matches the selector
          for (const element of elements) {
            const priceText = element.textContent.trim();
          // Extract price from element text
          
          // Extract Danish currency format (100,00 kr.) and other formats
          const danishMatches = priceText.match(/(\d{1,3}(?:\.\d{3})*),(\d{2})\s*kr/gi);
          const regularMatches = priceText.match(/\d[\d.,]*/g);
          
          let allMatches = [];
          if (danishMatches) {
            allMatches = allMatches.concat(danishMatches);
          }
          if (regularMatches) {
            allMatches = allMatches.concat(regularMatches);
          }
          
          // Process found matches
          
          if (allMatches && allMatches.length > 0) {
              // Process each potential price number
            for (const match of allMatches) {
              let cleanedMatch = match;
              
              // Handle Danish format (100,00 kr)
              if (match.includes('kr')) {
                cleanedMatch = match.replace(/\s*kr\.?/gi, '').trim();
                // Convert Danish decimal comma to period
                cleanedMatch = cleanedMatch.replace(',', '.');
              } else {
                // Handle other formats
                cleanedMatch = match.replace(/[^\d.,]/g, '');
                // If it has both comma and period, assume comma is thousands separator
                if (cleanedMatch.includes(',') && cleanedMatch.includes('.')) {
                  cleanedMatch = cleanedMatch.replace(/,/g, '');
                } else if (cleanedMatch.includes(',')) {
                  // If only comma, could be decimal separator (European style)
                  const parts = cleanedMatch.split(',');
                  if (parts.length === 2 && parts[1].length <= 2) {
                    cleanedMatch = cleanedMatch.replace(',', '.');
                  } else {
                    cleanedMatch = cleanedMatch.replace(/,/g, '');
                  }
                }
              }
              
              // Clean price match
                
                // Convert to number
                const numValue = parseFloat(cleanedMatch);
              // Parse number value
                
                // Keep the highest value found
                if (!isNaN(numValue) && numValue > highestValue) {
                  highestValue = numValue;
                  totalPrice = numValue;
                // Update highest price
                }
              }
            }
          }
        }
      }
      
    // Return final extracted price
      return totalPrice;
    }
  
  function reportPurchase(totalPrice) {
  
    /* Abort if we already stored a flag for this user
       (covers page refreshes & navigation).           */
    if (localStorage.getItem(purchaseKey(chatbotUserId))) {   // ★ NEW
      hasReportedPurchase = true;                             // ★ NEW
      return;
    }
  
    fetch('https://egendatabasebackend.onrender.com/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:   chatbotUserId,
        chatbot_id:'storcenternord',
        amount:    totalPrice
      })
    })
    .then(res => {
      if (res.ok) {
        hasReportedPurchase = true;
        localStorage.setItem(purchaseKey(chatbotUserId), 'true');
      }
    })
    .catch(err => {/* Silent error handling */});
  }
  
  // -------------------------------------------------------
  // 4. Main purchase detector (small tweak)
  // -------------------------------------------------------
  function checkForPurchase() {
    if (!chatbotUserId) return;
  
    if (isCheckoutPage() && !hasReportedPurchase) {
      const totalPrice = extractTotalPrice();
      if (totalPrice && totalPrice > 0) reportPurchase(totalPrice);
    }
  }
  
  // Check for purchase immediately and then periodically
  setTimeout(checkForPurchase, 1000); // Check after 1 second
  setTimeout(checkForPurchase, 3000); // Check again after 3 seconds  
  setTimeout(checkForPurchase, 5000); // Check again after 5 seconds
  setInterval(checkForPurchase, 15000); // Check every 15 seconds
  
  
        
      /**
       * 1. GLOBAL & FONT SETUP
       */
      var isIframeEnlarged = false;
      var chatbotID = "storcenternord";
      var fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;600;900&display=swap';
      document.head.appendChild(fontLink);
    
      /**
       * 2. CONFIGURATION SETTINGS (Easy to find and modify)
       * 
       * QUICK EDIT SECTION - Change these values as needed:
       * - POPUP_TEXT: The message shown in the popup bubble
       * - ICON_COLOR: Main chatbot button color
       * - BADGE_COLOR: Notification badge color
       */
      

      
      // Color configuration - modify these as needed

      /**
       * 3. INJECT CSS (with configuration variables)
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
        right: 10px;
        z-index: 200;
      }
      #chat-button {
        cursor: pointer;
        background: none;
        border: none;
        position: fixed;
        z-index: 20;
        right: 10px;
        bottom: 20px;
      }
      #chat-button img {
        width: 70px;             /* same size as old SVG */
        height: 70px;
        border-radius: 50%;      /* makes it round */
        object-fit: cover;       /* ensures correct crop */
        transition: transform 0.3s ease, opacity 0.3s ease;
        display: block;
      }
      #chat-button:hover img {
        transform: scale(1.1);   /* same hover zoom */
        opacity: 1;
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
        position: absolute;
          bottom: 17px;
          right: 55px;
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
      
      /* Longer message styling */
      #chatbase-message-bubbles.long-message {
        bottom: 10.5px;
        right: 36px;
        scale: 0.52;
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
        left: 8px;
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
          bottom: 18px;
          right: 60px;
        }
        
        #chatbase-message-bubbles.long-message {
          bottom: 13px;
          right: 32px;
          scale: 0.50;
        }
        
        /* Always show close button on mobile as simple X */
        #chatbase-message-bubbles .close-popup {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
          background-color: transparent;
        }
        
        #chatbase-message-bubbles .close-popup:hover {
          background-color: transparent;
          color: black;
        }
      }
  
    
      :root {
        --icon-color: #000000;
        --badge-color: #CC2B20;
      }
   
      
      /* Notification badge styles */
      .notification-badge {
        fill: var(--badge-color);
      }
      .notification-badge-text {
        fill: white;
        font-size: 100px;
        font-weight: bold;
        text-anchor: middle;
        dominant-baseline: central;
      }
      .notification-badge.hidden {
        display: none;
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
        line-height: 1.3em;
        opacity: 1;
        transform: scale(1);
        transition: opacity 1s, transform 1s;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        max-width: 100%;
        text-align: center;
      }
      
      /* Short message padding */
      #chatbase-message-bubbles:not(.long-message) .message-box {
        padding: 12px 12px 12px 20px;
      }
      
      /* Long message padding */
      #chatbase-message-bubbles.long-message .message-box {
        padding: 12px 55px 12px 20px;
      }
      `;
      // CSS injection moved to after configuration variables
    
      /**
       * 3. INJECT HTML
       */
      var chatbotHTML = `
        <div id="chat-container">
          <!-- Chat Button -->
          <button id="chat-button">
            <img src="https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Concierge.png" alt="Support agent" />
          </button>
    
          <!-- Popup -->
          <div id="chatbase-message-bubbles">
            <div class="close-popup">−</div>
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
      // GTM-safe DOM insertion - try immediate insertion first
      function insertChatbotHTML() {
        try {
          document.body.insertAdjacentHTML('beforeend', chatbotHTML);
          
          // Verify elements were created
          setTimeout(function() {
            var chatContainer = document.getElementById('chat-container');
            var chatButton = document.getElementById('chat-button');
            var chatIframe = document.getElementById('chat-iframe');
            
            // Silent verification - no logging needed
          }, 100);
          
        } catch (error) {
          // Silent error handling
        }
      }
      
      // Try immediate insertion for GTM context
      if (document.body) {
        insertChatbotHTML();
      } else {
        // Fallback to requestAnimationFrame if body not ready
        requestAnimationFrame(function() {
          if (document.body) {
            insertChatbotHTML();
          } else {
            setTimeout(insertChatbotHTML, 100);
          }
        });
      }
    
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
    
            // Inject CSS with configuration variables
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
  
      /**
       * 6. CHAT IFRAME LOGIC
       */
      function sendMessageToIframe() {
        var iframe = document.getElementById("chat-iframe");
        var iframeWindow = iframe.contentWindow;
  
  
        var messageData = {
        action: 'integrationOptions',
        chatbotID: "storcenternord",
        pagePath: window.location.href,
          
        leadGen: "%%",
        leadMail: "Team@dialogintelligens.dk",
        leadField1: "Navn",
        leadField2: "Tlf nummer",
  
        useThumbsRating: false,
        ratingTimerDuration: 15000,
        replaceExclamationWithPeriod: false,
        
        privacyLink: "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf",
  
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
  
        freshdeskSubjectText: 'Din henvendelse',
  
        inputPlaceholder: "Skriv dit spørgsmål her...",
        ratingMessage: "Fik du besvaret dit spørgsmål?",
  
        productButtonText: "SE PRODUKT",
        productButtonColor: "",
        productButtonPadding: "",
        productImageHeightMultiplier: 1,
          
        headerLogoG: "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/chatbot_logo/logo-1759740088236.png",
        messageIcon: "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/chatbot_message_icon/logo-1759740031411.png",
        themeColor: "#000000",
        aiMessageColor: "#f5f5f0",
        aiMessageTextColor: "#000000",
        headerTitleG: "",
        headerSubtitleG: "Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.",
        subtitleLinkText: "",
        subtitleLinkUrl: "",
  
        fontFamily: "",
  
        enableLivechat: true,
          
        titleG: "Storcenter Nord AI Assistent",
        purchaseTrackingEnabled: false,
        isTabletView: false,
        isPhoneView: window.innerWidth < 1000
      };
  
    
        // If the iframe is already visible, post the message immediately.
        if (iframe.style.display !== 'none') {
          try {
            iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
          } catch (e) {
            // Silent error handling
          }
        } else {
          // If not visible, assign onload to post the message when it appears.
          iframe.onload = function() {
            try {
              iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
            } catch (e) {
              // Silent error handling
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
        } else if (event.data.action === 'setChatbotUserId') {
      // Handle the new message from the iframe
      chatbotUserId = event.data.userId;
      localStorage.setItem('chatbotUserId', chatbotUserId);
      
      // If we're on a checkout page, immediately check for purchase
      if (isCheckoutPage()) {
        setTimeout(checkForPurchase, 1000);
      }
      }
      });
  
      /**
       * 6. BADGE MANAGEMENT
       */
      function hideBadge() {
        var badge = document.getElementById('notification-badge');
        if (badge) {
          badge.classList.add('hidden');
          localStorage.setItem('chatBadgeHidden', 'true');
        }
      }
  
      function showBadge() {
        var badge = document.getElementById('notification-badge');
        if (badge) {
          badge.classList.remove('hidden');
        }
      }
  
      function checkBadgeVisibility() {
        var hasOpenedChat = localStorage.getItem('chatBadgeHidden');
        if (hasOpenedChat === 'true') {
          hideBadge();
        } else {
          showBadge();
        }
      }
  
      /**
   * 10. TRACK CHATBOT OPEN FOR GREETING RATE STATISTICS
   */
  function trackChatbotOpen() {
    // If chatbotID is not available yet, try to get it from the URL or try again later
    var currentChatbotID = chatbotID;
    if (!currentChatbotID) {
      // Try to extract from any existing localStorage keys
      var allKeys = Object.keys(localStorage);
      for (var i = 0; i < allKeys.length; i++) {
        if (allKeys[i].startsWith('userId_')) {
          currentChatbotID = allKeys[i].replace('userId_', '');
          break;
        }
      }
    }
    
    // Only track once per session to avoid duplicate entries
    var sessionKey = 'chatbotOpened_' + currentChatbotID;
    if (sessionStorage.getItem(sessionKey)) {
      return; // Already tracked in this session
    }
  
    var userId = localStorage.getItem('userId_' + currentChatbotID);
    
    // If userId doesn't exist, create one (same pattern as the iframe does)
    if (!userId && currentChatbotID) {
      userId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
      localStorage.setItem('userId_' + currentChatbotID, userId);
    }
    
    if (!userId || !currentChatbotID) {
      // If we still don't have the data, try again in a short while
      if (!currentChatbotID) {
        setTimeout(trackChatbotOpen, 1000);
      }
      return; // No user ID or chatbot ID available
    }
    
    // Send tracking data to backend
    fetch('https://egendatabasebackend.onrender.com/track-chatbot-open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatbot_id: currentChatbotID,
        user_id: userId
      })
    })
    .then(function(response) {
      if (response.ok) {
        // Mark as tracked in this session
        sessionStorage.setItem(sessionKey, 'true');
      }
    })
    .catch(function(error) {
      // Silent error handling
    });
  }
    
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
          // Hide the badge when user first opens the chat
          hideBadge();
          localStorage.setItem("popupClosed", "true");  // Save that the popup has been closed
          
          // Track chatbot open for greeting rate statistics
          trackChatbotOpen();
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
        var iframe = document.getElementById("chat-iframe");
          // If the iframe is visible, do not show the popup
          if (iframe.style.display !== "none") {
          return;
        }
        
        // Check if popup was previously closed/minimized
        if (localStorage.getItem("popupClosed") === "true") {
          return;
        }
          
        var popup = document.getElementById("chatbase-message-bubbles");
        var messageBox = document.getElementById("popup-message-box");
              // Popup message text - modify this as needed

        const popupText = "Hej! Jeg kan hjælpe med butikker & åbningstid ";
        messageBox.innerHTML = `${popupText} <span id="funny-smiley">😊</span>`;   
          
        
        // Determine popup width based on character count (excluding any HTML tags)
        var charCount = messageBox.textContent.trim().length;
        var popupElem = document.getElementById("chatbase-message-bubbles");
        
        // Remove any existing long-message class
        popupElem.classList.remove('long-message');
        
        // Apply long-message class if more than 26 characters
        if (charCount > 26) {
          popupElem.classList.add('long-message');
        }
        
        if (charCount < 25) {
          popupElem.style.width = "40px";
        } else if (charCount < 60) {
          popupElem.style.width = "460px";
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
          localStorage.setItem("popupClosed", "true");  // Save popup closed state permanently
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
      
      // Show popup after 1 second (matching function initChatbot() {.js timing)
      setTimeout(showPopup, 1000);
  
  
      /**
       * 9. ADJUST IFRAME SIZE
       */
      function adjustIframeSize() {
        var iframe = document.getElementById('chat-iframe');
      
        // Keep 'isIframeEnlarged' logic if toggled from the iframe
        if (isIframeEnlarged) {
          // A bigger version if user toggles enlarge
          iframe.style.width = 'calc(2 * 45vh + 6vw)';
          iframe.style.height = '90vh';
        } else {
          // Default sizing:
          // For phone/tablet (< 1000px), use 95vw
          // For larger screens, use 50vh x 90vh
          if (window.innerWidth < 1000) {
              iframe.style.width = '95vw';
              iframe.style.height = '90vh';
          } else {
              iframe.style.width = 'calc(50vh + 8vw)'; // Restoring your old width calculation
              iframe.style.height = '90vh';
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
          iframe.style.bottom = '3vh';
          iframe.style.right = '2vw';
        }
      
        // Re-send data to iframe in case layout changes
        sendMessageToIframe();
      }
      // Adjust size on page load + on resize
      adjustIframeSize();
      window.addEventListener('resize', adjustIframeSize);
      
      // GTM-friendly single retry mechanism
      function ensureChatbotLoads() {
        // Only retry if not already loaded and GTM has had time to initialize
        if (!document.getElementById('chat-container')) {
          adjustIframeSize();
          sendMessageToIframe();
        }
      }
      
      // Single retry after GTM has initialized
      setTimeout(ensureChatbotLoads, 2000);  // Single retry after 2s
    
      // Attach event listener to chat-button
      document.getElementById('chat-button').addEventListener('click', toggleChatWindow);
  
    const isPhoneView = window.innerWidth < 800;
      // Modify the initial chat window state logic
      var savedState = localStorage.getItem('chatWindowState');
      var iframe = document.getElementById('chat-iframe');
      var button = document.getElementById('chat-button');
    
    if (savedState === 'open' && !isPhoneView) {
      iframe.style.display = 'block';
      button.style.display = 'none';
      sendMessageToIframe();
      trackChatbotOpen();          // keep your analytics
    } else {
      iframe.style.display = 'none';
      button.style.display = 'block';
    
      /* clear any stale “open” flag so page-to-page nav on phone never re-opens */
      if (isPhoneView) localStorage.setItem('chatWindowState', 'closed');
    }
  
     
      // Chat button click
      document.getElementById("chat-button").addEventListener("click", toggleChatWindow);
      
      // Initialize badge visibility
      checkBadgeVisibility();
  
    } // end of initChatbotSafely
  
  // Manual trigger function for testing (no logging)
  window.forceChatbotInit = function() {
    window.chatbotInitialized = false; // Reset flag
    initChatbotSafely();
  };
  
  // Global debug function (no logging)
  window.debugChatbot = function() {
    return {
      initialized: !!window.chatbotInitialized,
      chatContainer: !!document.getElementById('chat-container'),
      chatButton: !!document.getElementById('chat-button'),
      chatIframe: !!document.getElementById('chat-iframe'),
      widgetContainer: !!document.getElementById('my-chat-widget'),
      bodyExists: !!document.body,
      documentState: document.readyState
    };
  };  

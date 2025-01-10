document.addEventListener('DOMContentLoaded', function() {
  // ----------------------------
  // Inject CSS into the head
  // ----------------------------
  var css = `
    /* Container for chat button */
    #chat-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 401;
    }

    /* Chat button styles */
    #chat-button {
      cursor: pointer;
      background: none;
      border: none;
    }

    #chat-button img {
      width: 60px;
      height: 60px;
      transition: opacity 0.3s, transform 0.3s;
    }

    #chat-button:hover img {
      opacity: 0.7;
      transform: scale(1.1);
    }

    /* Chat iframe styles */
    #chat-iframe {
      display: none;
      position: fixed;
      bottom: 3vh;
      right: 2vw;
      width: 50vh;
      height: 90vh;
      border: none;
      z-index: 40000;
    }

    /* Popup bubble styles */
    #chatbase-message-bubbles {
      position: fixed;
      bottom: 100px; /* Space above chat button */
      right: 30px; /* Align with chat button */
      max-width: 280px;
      padding: 20px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      font-size: 15px;
      background-color: white;
      color: black;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
      display: none;
      z-index: 2147483647;
    }

    /* Popup close button (the small "✕") */
    #close-popup {
      position: absolute;
      top: -7px;
      right: -7px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2147483643;
      width: 23px;
      height: 23px;
      border-radius: 50%;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
      background-color: rgb(224, 224, 224);
      color: black;
      box-shadow: rgba(150, 150, 150, 0.15) 0px 6px 24px 0px,
                  rgba(150, 150, 150, 0.15) 0px 0px 0px 1px;
    }

    #close-popup:hover {
      background-color: #ccc;
    }
  `;
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // ----------------------------
  // Inject HTML into the body
  // ----------------------------
  var chatbotHTML = `
    <div id="chat-container">
      <!-- Chat Button -->
      <button id="chat-button">
        <img src="https://image-hosting-pi.vercel.app/haengekoejerMessageLogo2.png" alt="Chat with us">
      </button>
    </div>

    <!-- Chat Iframe -->
    <iframe id="chat-iframe" src="https://skalerbartprodukt.onrender.com"></iframe>
  `;
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // ----------------------------
  // Inject the Popup HTML
  // ----------------------------
  var popupHTML = `
    <div id="chatbase-message-bubbles">
      <!-- Close Button (the small "✕") -->
      <div id="close-popup">✕</div>
      <div style="display: flex; justify-content: flex-end;">
        <div style="
            background-color: white; 
            color: black; 
            box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, 
                        rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; 
            border-radius: 10px; 
            padding: 15px; 
            margin: 8px; 
            font-size: 15px; 
            transform: scale(1); 
            transition: opacity 1s, transform 1s;">
          Hej, det er Buddy! 😊 Jeg er her for at hjælpe med produktspørgsmål, træningstips og meget mere. 💪😄 Spørg mig om alt, hvad du vil vide! 🚀
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);
});

  // ----------------------------
  // Inject the Popup HTML
  // ----------------------------
  var popupHTML = `
    <div id="chatbase-message-bubbles">
      <!-- Close Button (the small "✕") -->
      <div id="close-popup">✕</div>
      <div style="display: flex; justify-content: flex-end;">
        <div style="
            background-color: white; 
            color: black; 
            box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px, 
                        rgba(150, 150, 150, 0.2) 0px 0px 0px 1px; 
            border-radius: 10px; 
            padding: 15px; 
            margin: 8px; 
            font-size: 15px; 
            transform: scale(1); 
            transition: opacity 1s, transform 1s;">
          Hej, det er Buddy! 😊 Jeg er her for at hjælpe med produktspørgsmål, træningstips og meget mere. 💪😄 Spørg mig om alt, hvad du vil vide! 🚀
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);
  // ----------------------------
  // Cookie functions
  // ----------------------------
  function setCookie(name, value, days, domain) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    var domainStr = domain ? "; domain=" + domain : "";
    document.cookie = name + "=" + (value || "") + expires + domainStr + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // ----------------------------
  // Chat iframe logic
  // ----------------------------
  var isIframeEnlarged = false;
  var maxRetryAttempts = 5;
  var retryDelay = 500;
  var retryAttempts = 0;

  var autoOpenOnNavigate = false; // Set to true or false to control auto-open behavior

  function sendMessageToIframe() {
    var iframe = document.getElementById('chat-iframe');
    var iframeWindow = iframe.contentWindow;

    var messageData = {
      action: 'integrationOptions',
      chatbotID: "haengekoejer",
      pagePath: window.location.href,
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/af218a0a-4bda-44e1-9b6e-ba6d433744ba",
      SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/",
      apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/6204dd54-dcc5-42f5-8b36-4b1e6af52413",
      fordelingsflowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/21630bb9-34e9-48c7-a0f6-b63fd43cd7e0",
      flow2Key: "",
      flow2API: "",
      flow3Key: "product",
      flow3API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/53b4cf00-9347-4fcb-b77c-3770e9b72c7a",
      SOCKET_SERVER_URL_Backup: "",
      apiEndpointBackup: "",
      fordelingsflowAPIBackup: "",
      flow2APIBackup: "",
      flow3APIBackup: "",

      imageAPI: '',
      
      privacyLink: "https://image-hosting-pi.vercel.app/Privatlivspolitik_haengekoejer.pdf",
      titleLogoG: "https://image-hosting-pi.vercel.app/haengekoejerWhiteMessageLogo2.png",
      headerLogoG: "http://dialogintelligens.dk/wp-content/uploads/2024/12/haengekoejerLogo.png",
      themeColor: "#4b9e33",
      headerTitleG: "Tropical Hængekøjers Virtuelle Assistent",
      headerSubtitleG: "Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.",
      titleG: "Tropical Hængekøjer",
      firstMessage: "Hej😊 Jeg kan besvare spørgsmål og anbefale produkter. Hvad kan jeg hjælpe dig med?",
      isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
      isPhoneView: window.innerWidth < 800
    };

    function trySendingMessage() {
      if (retryAttempts < maxRetryAttempts) {
        iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
        retryAttempts++;
      } else {
        console.error("Failed to send message to iframe after multiple attempts");
      }
    }

    // Listen for ack from the iframe
    window.addEventListener('message', function(event) {
      if (event.origin === "https://skalerbartprodukt.onrender.com" && event.data.ack === 'integrationOptionsReceived') {
        console.log("Iframe acknowledged receiving integration options");
        retryAttempts = maxRetryAttempts;
      }
    });

    // Reset and try to send when iframe loads
    iframe.onload = function() {
      retryAttempts = 0;
      trySendingMessage();
    };

    // Keep trying to send a few times in case of slow load
    setTimeout(function retrySending() {
      if (retryAttempts < maxRetryAttempts) {
        trySendingMessage();
        setTimeout(retrySending, retryDelay);
      }
    }, retryDelay);
  }

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
      // Before navigating, close chat and set state to 'closed'
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');

      // Now navigate
      window.location.href = event.data.url;
    }
  });

  // ----------------------------
  // Toggle chat window
  // ----------------------------
  function toggleChatWindow() {
    var iframe = document.getElementById('chat-iframe');
    var button = document.getElementById('chat-button');
    
    var isCurrentlyOpen = (iframe.style.display !== 'none');
    
    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    button.style.display = isCurrentlyOpen ? 'block' : 'none';
    
    localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
    
    adjustIframeSize();
    sendMessageToIframe();

    // Notify iframe if chat was just opened
    if (!isCurrentlyOpen) {
      iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
    }
  }

  // ----------------------------
  // Adjust Iframe Size
  // ----------------------------
  function adjustIframeSize() {
    var iframe = document.getElementById('chat-iframe');
    console.log("Adjusting iframe size. Window width: ", window.innerWidth);

    if (isIframeEnlarged) {
      iframe.style.width = 'calc(2 * 45vh + 6vw)';
      iframe.style.height = '90vh';
    } else {
      iframe.style.width = window.innerWidth < 1000 ? '95vw' : 'calc(45vh + 6vw)';
      iframe.style.height = '90vh';
    }

    iframe.style.position = 'fixed';
    if (window.innerWidth < 1000) {
      // Centered for mobile
      iframe.style.left = '50%';
      iframe.style.top = '50%';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.bottom = '';
      iframe.style.right = '';
    } else {
      // Bottom-right for desktop
      iframe.style.left = 'auto';
      iframe.style.top = 'auto';
      iframe.style.transform = 'none';
      iframe.style.bottom = '3vh';
      iframe.style.right = '3vh';
    }

    sendMessageToIframe(); // re-send integration data if needed
  }

  // ----------------------------
  // On window resize
  // ----------------------------
  window.addEventListener('resize', adjustIframeSize);

  // Attach event listener to the chat-button
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);

  // ----------------------------
  // Initialize the chat window state
  // ----------------------------
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

  // ----------------------------
  // Handle the popup logic
  // ----------------------------
  // Show the popup after 10 seconds if it hasn't been shown (cookie not set)
  // and hide it automatically after 200 seconds.  
  // Also, if user closes it via the "✕", set the cookie so it won't reopen.
  if (!getCookie("popupShown")) {
    setTimeout(function() {
      // Show popup
      document.getElementById("chatbase-message-bubbles").style.display = "block";
      // Mark as shown for 7 days
      setCookie("popupShown", "true", 7);

      // Hide it automatically after 200 seconds
      setTimeout(function() {
        document.getElementById("chatbase-message-bubbles").style.display = "none";
      }, 2000000);

    }, 10000);
  }

  // ----------------------------
  // Close button on the popup
  // ----------------------------
  var closePopupBtn = document.getElementById('close-popup');
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function() {
      document.getElementById("chatbase-message-bubbles").style.display = "none";
      // Also set cookie so it won’t show again for 7 days
      setCookie("popupShown", "true", 7);
    });
  }

  // ----------------------------
  // Final initial sizing
  // ----------------------------
  adjustIframeSize();
});

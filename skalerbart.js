
document.addEventListener('DOMContentLoaded', function() {
  // Inject CSS into the head
  var css = `
    /* Add these to existing styles */

    /* Blinking animation */
    @keyframes blink {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }

    /* Moving animation */
    @keyframes move {
      0% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(10px);
      }
      100% {
        transform: translateX(0);
      }
    }

    /* Apply animations to the funny smiley */
    #funny-smiley.blink {
      animation: blink 1s infinite;
    }

    #funny-smiley.move {
      animation: move 1s infinite;
    }
  
  
    /* Container for chat button (fixed to bottom-right) */
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
      transition: opacity 0.3s;
    }

    #chat-button:hover img {
      opacity: 0.7;
      transform: scale(1.1);
    }

    /*
      Popup Message Styles
      Positioned absolutely inside #chat-container so it moves with the button.
    */
    #chatbase-message-bubbles {
      position: absolute;
      /* Adjust these offsets so the popup is above/near the button */
      bottom: 70px;  /* Distance above the chat button */
      right: 30px;      /* Align to the right edge of #chat-container */
      border-radius: 10px;
      font-family: sans-serif;
      font-size: 20px;
      z-index: 2147483644;
      cursor: pointer;
      display: none; /* hidden by default */
      flex-direction: column;
      gap: 50px;
      min-width: 669px;
      transform: scale(0.6);
      transform-origin: bottom right;
      background-color: white;
      box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px,
                  rgba(150, 150, 150, 0.2) 0px 0px 0px 1px;
    }

    #chatbase-message-bubbles::after {
      content: '';
      position: absolute;
      bottom: -10px; /* Position tail below the balloon */
      right: 30px; /* Align with the chat button */
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 10px 0 20px; /* Creates the triangle */
      border-color: white transparent transparent transparent; /* Match balloon background */
      box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px; /* Add shadow for consistency */
    }

    /* Close button styles within the popup */
    #chatbase-message-bubbles .close-popup {
      position: absolute;
      top: 10px;
      right: 15px;
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
      background-color: rgba(224, 224, 224, 0); /* transparent */
      color: black;
      transition: background-color 0.3s, color 0.3s, opacity 0.3s;
      opacity: 0.5;
      z-index: 1000000; /* Ensures the close button is above popup content */
    }

    #chatbase-message-bubbles .close-popup:hover {
      background-color: rgba(255, 0, 0, 0.8);
      color: white;
      opacity: 1; /* More visible on hover */
    }

    /* Message content styles */
    #chatbase-message-bubbles .message-content {
      display: flex;
      justify-content: flex-end;
      padding: 0px 0px 0px 0px;
    }

    #chatbase-message-bubbles .message-box {
      background-color: white;
      color: black;
      border-radius: 10px;
      padding: 15px;
      margin: 8px;
      font-size: 25px;
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

  // Inject HTML for chat container (including the chat button)
  var chatbotHTML = `
    <div id="chat-container">
      <!-- Chat Button -->
      <button id="chat-button">
        <img src="https://image-hosting-pi.vercel.app/haengekoejerMessageLogo2.png" alt="Chat with us">
      </button>
      <!-- Popup placed here so it moves with the chat button -->
      <div id="chatbase-message-bubbles">
        <div class="close-popup">&times;</div>
        <div class="message-content">
          <div class="message-box">
            Hej, det er Buddy! 😊 Jeg er her for at hjælpe med produktspørgsmål, træningstips og meget mere. 💪<span id="funny-smiley">😄</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Iframe -->
    <iframe id="chat-iframe" src="https://skalerbartprodukt.onrender.com"
      style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;">
    </iframe>
  `;
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // -- Cookie functions --
  function setCookie(name, value, days, domain) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
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
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function getCurrentTimestamp() {
    return new Date().getTime();
  }

  // Popup timing
  var popupDuration = 200000; // 200 seconds
  var popupShownTimestamp = parseInt(getCookie("popupShownTimestamp")) || 0;

  // Chat iframe state
  var isIframeEnlarged = false;
  var maxRetryAttempts = 5;
  var retryDelay = 500;
  var retryAttempts = 0;

  var autoOpenOnNavigate = false; // Set true/false to control auto-open on navigation

  // -- Iframe messaging --
  function sendMessageToIframe() {
    var iframe = document.getElementById("chat-iframe");
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
      imageAPI: "",
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

    window.addEventListener("message", function(event) {
      if (event.origin === "https://skalerbartprodukt.onrender.com" &&
          event.data.ack === "integrationOptionsReceived") {
        console.log("Iframe acknowledged receiving integration options");
        retryAttempts = maxRetryAttempts; // stop retrying
      }
    });

    iframe.onload = function() {
      retryAttempts = 0;
      trySendingMessage();
    };

    setTimeout(function retrySending() {
      if (retryAttempts < maxRetryAttempts) {
        trySendingMessage();
        setTimeout(retrySending, retryDelay);
      }
    }, retryDelay);
  }

  window.addEventListener("message", function(event) {
    if (event.origin !== "https://skalerbartprodukt.onrender.com") return;

    if (event.data.action === "toggleSize") {
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === "closeChat") {
      document.getElementById("chat-iframe").style.display = "none";
      document.getElementById("chat-button").style.display = "block";
      localStorage.setItem("chatWindowState", "closed");
    } else if (event.data.action === "navigate") {
      // Before navigating, close the chat window
      document.getElementById("chat-iframe").style.display = "none";
      document.getElementById("chat-button").style.display = "block";
      localStorage.setItem("chatWindowState", "closed");
      window.location.href = event.data.url;
    }
  });

  // Toggle chat window
  function toggleChatWindow() {
    var iframe = document.getElementById("chat-iframe");
    var button = document.getElementById("chat-button");
    var isCurrentlyOpen = iframe.style.display !== "none";

    iframe.style.display = isCurrentlyOpen ? "none" : "block";
    button.style.display = isCurrentlyOpen ? "block" : "none";
    localStorage.setItem("chatWindowState", isCurrentlyOpen ? "closed" : "open");

    adjustIframeSize();
    sendMessageToIframe();

    if (!isCurrentlyOpen) {
      iframe.contentWindow.postMessage({ action: "chatOpened" }, "*");
    }
  }

  function adjustIframeSize() {
    var iframe = document.getElementById("chat-iframe");
    console.log("Adjusting iframe size. Window width:", window.innerWidth);

    var isTabletView = window.innerWidth < 1000 && window.innerWidth > 800;
    var isPhoneView = window.innerWidth < 800;

    if (window.innerWidth >= 1500) {
      iframe.style.width = "500px";
      iframe.style.height = "700px";
    } else if (isIframeEnlarged) {
      iframe.style.width = "calc(2 * 45vh + 6vw)";
      iframe.style.height = "90vh";
    } else {
      iframe.style.width = window.innerWidth < 1000 ? "95vw" : "calc(45vh + 6vw)";
      iframe.style.height = "90vh";
    }

    iframe.style.position = "fixed";
    iframe.style.left = window.innerWidth < 1000 ? "50%" : "auto";
    iframe.style.top = window.innerWidth < 1000 ? "50%" : "auto";
    iframe.style.transform =
      window.innerWidth < 1000 ? "translate(-50%, -50%)" : "none";
    iframe.style.bottom = window.innerWidth < 1000 ? "" : "3vh";
    iframe.style.right = window.innerWidth < 1000 ? "" : "3vh";

    sendMessageToIframe();
  }

  // Manage popup display
  function showPopup() {
    var popup = document.getElementById("chatbase-message-bubbles");
    popup.style.display = "flex";

    var currentTimestamp = getCurrentTimestamp();
    setCookie("popupShownTimestamp", currentTimestamp, 1, ".yourdomain.com"); // replace domain as needed

    // Auto-hide after 200s
    setTimeout(function() {
      popup.style.display = "none";
    }, popupDuration);
  }

  function shouldShowPopup() {
    var shownTimestamp = parseInt(getCookie("popupShownTimestamp")) || 0;
    var currentTime = getCurrentTimestamp();

    // if never shown or if duration elapsed
    if (shownTimestamp === 0 || (currentTime - shownTimestamp) > popupDuration) {
      return true;
    }
    return false;
  }

  if (shouldShowPopup()) {
    setTimeout(function() {
      showPopup();
    }, 10000); // appear after 10s
  }

  setTimeout(function() {
    var smiley = document.getElementById('funny-smiley');

    // Add a blinking animation
    smiley.classList.add('blink');

    // Optionally, switch to moving after 5 more seconds
    setTimeout(function() {
      smiley.classList.remove('blink');
      smiley.classList.add('move');
    }, 5000);
  }, 10000); // Start after 10 seconds

  // Close button for popup
  var closePopupButton = document.querySelector("#chatbase-message-bubbles .close-popup");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", function() {
      var popup = document.getElementById("chatbase-message-bubbles");
      popup.style.display = "none";
      var currentTimestamp = getCurrentTimestamp();
      setCookie("popupShownTimestamp", currentTimestamp, 1, ".yourdomain.com");
    });
  }

  // Initialize chat window state
  var savedState = localStorage.getItem("chatWindowState");
  var iframe = document.getElementById("chat-iframe");
  var button = document.getElementById("chat-button");

  if (savedState === "open") {
    iframe.style.display = "block";
    button.style.display = "none";
    sendMessageToIframe();
  } else {
    iframe.style.display = "none";
    button.style.display = "block";
  }

  // Attach event listener to chat-button
  document.getElementById("chat-button").addEventListener("click", toggleChatWindow);

  // On window resize
  window.addEventListener("resize", function() {
    adjustIframeSize();
  });
});

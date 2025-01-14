
document.addEventListener('DOMContentLoaded', function() {
  /* -----------------------------------------------------------
   * 1. Inject CSS into <head>
   * ----------------------------------------------------------- */
  var css = `
    /* ----------------------------------------
       A) ANIMATIONS
       ---------------------------------------- */
    /* Blinking animation (blinks twice) */
    @keyframes blink-eye {
      0%, 100% {
        transform: scaleY(1);
      }
      50% {
        transform: scaleY(0.1); /* Squash vertically for blink effect */
      }
    }

    /* Jumping animation (up and down) */
    @keyframes jump {
      0%, 100% {
        transform: translateY(0); /* Normal position */
      }
      50% {
        transform: translateY(-10px); /* Jump up */
      }
    }

    /* Blink animation class: runs 2 times at 0.5s each = 1s total */
    #funny-smiley.blink {
      display: inline-block;
      animation: blink-eye 0.5s ease-in-out 2;
    }

    /* Jump animation class: runs 2 times at 0.5s each = 1s total */
    #funny-smiley.jump {
      display: inline-block;
      animation: jump 0.5s ease-in-out 2;
    }

    /* ----------------------------------------
       B) MEDIA QUERY FOR SMALL SCREENS
       ---------------------------------------- */
    @media (max-width: 500px) {
      #chatbase-message-bubbles {
        min-width: 90vw;       /* Make popup fill most of the screen width */
        transform: scale(1);   /* Don’t shrink the popup */
        right: 5px;            /* Keep some margin on small screens */
        bottom: 60px;          /* Adjust bottom so it doesn't overlap the button */
      }
      #chatbase-message-bubbles::after {
        right: 20px;           /* Reposition the tail closer in */
      }
    }

    /* ----------------------------------------
       C) CHAT BUTTON + POPUP STYLES
       ---------------------------------------- */
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
      Popup message styles
      Positioned absolutely inside #chat-container so it moves with the button.
    */
    #chatbase-message-bubbles {
      position: absolute;
      bottom: 70px; /* Distance above the chat button */
      right: 30px;  /* Align to the right edge of #chat-container */
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

    /* Speech balloon "tail" */
    #chatbase-message-bubbles::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 30px; /* Align tail with chat button */
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 10px 0 20px;
      border-color: white transparent transparent transparent;
      box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px;
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
      background-color: rgba(224, 224, 224, 0);
      color: black;
      transition: background-color 0.3s, color 0.3s, opacity 0.3s;
      opacity: 0.5;
      z-index: 1000000;
    }

    #chatbase-message-bubbles .close-popup:hover {
      background-color: rgba(255, 0, 0, 0.8);
      color: white;
      opacity: 1;
    }

    /* Message content styles */
    #chatbase-message-bubbles .message-content {
      display: flex;
      justify-content: flex-end;
      padding: 0;
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

  /* -----------------------------------------------------------
   * 2. Inject HTML for chat container (including the chat button)
   * ----------------------------------------------------------- */
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
            Hej, det er Buddy! 😊 Jeg er her for at hjælpe med produktspørgsmål, træningstips og meget mere. 💪
            <span id="funny-smiley">😄</span>
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

  /* -----------------------------------------------------------
   * 3. Cookie functions
   * ----------------------------------------------------------- */
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

  /* -----------------------------------------------------------
   * 4. Popup & Chat Iframe Logic
   * ----------------------------------------------------------- */
  var popupDuration = 200000; // 200 seconds
  var popupShownTimestamp = parseInt(getCookie("popupShownTimestamp")) || 0;

  var isIframeEnlarged = false;
  var maxRetryAttempts = 5;
  var retryDelay = 500;
  var retryAttempts = 0;

  var autoOpenOnNavigate = false; // Set true/false to control auto-open on navigation

  // Send integration options to iframe
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

  // Listen for messages from the iframe
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
    var popup = document.getElementById("chatbase-message-bubbles");

    var isCurrentlyOpen = (iframe.style.display !== "none");

    // If we are about to open the chat, hide the popup
    if (!isCurrentlyOpen && popup.style.display === "flex") {
      popup.style.display = "none";
    }

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
      iframe.style.width = isPhoneView ? "95vw" : "calc(45vh + 6vw)";
      iframe.style.height = "90vh";
    }

    iframe.style.position = "fixed";
    iframe.style.left = isPhoneView ? "50%" : "auto";
    iframe.style.top = isPhoneView ? "50%" : "auto";
    iframe.style.transform =
      isPhoneView ? "translate(-50%, -50%)" : "none";
    iframe.style.bottom = isPhoneView ? "" : "3vh";
    iframe.style.right = isPhoneView ? "" : "3vh";

    sendMessageToIframe();
  }

  /* -----------------------------------------------------------
   * 5. Show/Hide Popup with Timed Animations
   * ----------------------------------------------------------- */
  function showPopup() {
    var popup = document.getElementById("chatbase-message-bubbles");
    popup.style.display = "flex";

    // Mark the time the popup was shown in a cookie
    var currentTimestamp = getCurrentTimestamp();
    setCookie("popupShownTimestamp", currentTimestamp, 1, ".yourdomain.com"); // replace domain as needed

    // Auto-hide the popup after 200s
    setTimeout(function() {
      popup.style.display = "none";
    }, popupDuration);

    // --- ANIMATION TRIGGERS ---
    // Blink after 2 seconds (2 times)
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('blink');
        // Remove blink class after 1s (0.5s x 2)
        setTimeout(function() {
          smiley.classList.remove('blink');
        }, 1000);
      }
    }, 2000);

    // Jump after 12 seconds (2 times)
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('jump');
        // Remove jump class after 1s (0.5s x 2)
        setTimeout(function() {
          smiley.classList.remove('jump');
        }, 1000);
      }
    }, 12000);
  }

  function shouldShowPopup() {
    var shownTimestamp = parseInt(getCookie("popupShownTimestamp")) || 0;
    var currentTime = getCurrentTimestamp();

    // If never shown or if duration has elapsed
    if (shownTimestamp === 0 || (currentTime - shownTimestamp) > popupDuration) {
      return true;
    }
    return false;
  }

  // If we should show the popup, do so after 10s
  if (shouldShowPopup()) {
    setTimeout(function() {
      showPopup();
    }, 10000);
  }

  /* -----------------------------------------------------------
   * 6. Close Button Logic
   * ----------------------------------------------------------- */
  var closePopupButton = document.querySelector("#chatbase-message-bubbles .close-popup");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", function() {
      var popup = document.getElementById("chatbase-message-bubbles");
      popup.style.display = "none";
      var currentTimestamp = getCurrentTimestamp();
      setCookie("popupShownTimestamp", currentTimestamp, 1, ".yourdomain.com");
    });
  }

  /* -----------------------------------------------------------
   * 7. Initialize Chat Window State
   * ----------------------------------------------------------- */
  var savedState = localStorage.getItem("chatWindowState");
  var iframe = document.getElementById("chat-iframe");
  var button = document.getElementById("chat-button");

  if (savedState === "open") {
    // Chat iframe open on page load
    iframe.style.display = "block";
    button.style.display = "none";
    sendMessageToIframe();
  } else {
    // Chat iframe closed on page load
    iframe.style.display = "none";
    button.style.display = "block";
  }

  // Attach event listener to chat-button (toggles chat window)
  document.getElementById("chat-button").addEventListener("click", toggleChatWindow);

  // Adjust iframe size on window resize
  window.addEventListener("resize", function() {
    adjustIframeSize();
  });
});

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Inject CSS into the head
  var css = `
    /* Container for chat button and speech balloon */
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

    /* Speech balloon styles */
    #speech-balloon {
      display: none;
      position: absolute;
      bottom: 52px; /* Position it above the chat button */
      right: 52px;
      width: 220px;
      height: 95px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 1500;
    }

    /* Close button styles */
    #close-balloon {
      position: absolute;
      top: 6px;
      right: 20px;
      background-color: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: white;
      font-weight: bold;
    }

    #close-balloon:hover {
      color: red;
    }
  `;

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Inject HTML into the body
  var chatbotHTML = `
    <div id="chat-container">
      <!-- Chat Button -->
      <button id="chat-button">
        <img src="https://dialogintelligens.dk/wp-content/uploads/2024/09/messageIcon.png" alt="Chat with us">
      </button>

      <!-- Speech Balloon GIF with Close Button -->
      <div id="speech-balloon">
        <button id="close-balloon">&times;</button>
      </div>
    </div>

    <!-- Chat Iframe -->
    <iframe id="chat-iframe" src="https://skalerbartprodukt.onrender.com" style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;"></iframe>
  `;

  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // Cookie functions
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
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

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
      chatbotID: "skadedyrshop",
      pagePath: "https://skadedyrshop.dk/",
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/770b080d-aae7-4fb4-bacb-bca088c83a32",
      SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/",
      apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/de8a623e-a5cc-4792-8789-5486f587dcc0",
      fordelingsflowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/d7334623-3f5a-46bc-874f-23ff77912fc3",
      flow2Key: "category",
      flow2API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/2eb50e09-56ed-45d3-9885-4e28108f9360",
      flow3Key: "product",
      flow3API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/27ed7773-f94f-43b3-acfb-5d7480b6ccca",
      SOCKET_SERVER_URL_Backup: "",
      apiEndpointBackup: "",
      fordelingsflowAPIBackup: "",
      flow2APIBackup: "",
      flow3APIBackup: "",

      imageAPI: 'https://den-utrolige-snebold.onrender.com/api/v1/prediction/f8e3b40d-65b3-4888-8b0e-bae757411f1b', // Ensure this is true in your integrationOptions data
      
      privacyLink: "http://dialogintelligens.dk/wp-content/uploads/2024/10/Privatlivspolitik_Skadedyrshop.pdf",
      titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/09/WhiteMessageIcon.png",
      headerLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/09/Logo.png",
      themeColor: "#2a803c",
      headerTitleG: "SkadedyrShops Virtuelle Assistent",
      headerSubtitleG: "Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.",
      titleG: "SkadedyrShop",
      firstMessage: "Hej😊 Hvad kan jeg hjælpe dig med?🐝 (Du kan stille et spørgsmål eller uploade et billede📷)",
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

    window.addEventListener('message', function(event) {
      if (event.origin === "https://skalerbartprodukt.onrender.com" && event.data.ack === 'integrationOptionsReceived') {
        console.log("Iframe acknowledged receiving integration options");
        retryAttempts = maxRetryAttempts;
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
      // Before navigating, close the chat window and set state to 'closed'
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');

      // Navigate to the new URL
      window.location.href = event.data.url;
    }
  });

function toggleChatWindow() {
  var iframe = document.getElementById('chat-iframe');
  var button = document.getElementById('chat-button');
  
  var isCurrentlyOpen = iframe.style.display !== 'none';
  
  iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
  button.style.display = isCurrentlyOpen ? 'block' : 'none';
  
  localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
  
  adjustIframeSize();
  sendMessageToIframe();

  // Send a message to the iframe when the chat is opened
  if (!isCurrentlyOpen) {
    iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
  }
}


  function adjustIframeSize() {
    var iframe = document.getElementById('chat-iframe');
    console.log("Adjusting iframe size. Window width: ", window.innerWidth);

    var isTabletView = window.innerWidth < 1000 && window.innerWidth > 800;
    var isPhoneView = window.innerWidth < 800;

    if (isIframeEnlarged) {
      iframe.style.width = 'calc(2 * 45vh + 6vw)';
      iframe.style.height = '90vh';
    } else {
      iframe.style.width = window.innerWidth < 1000 ? '95vw' : 'calc(45vh + 6vw)';
      iframe.style.height = '90vh';
    }

    iframe.style.position = 'fixed';
    iframe.style.left = window.innerWidth < 1000 ? '50%' : 'auto';
    iframe.style.top = window.innerWidth < 1000 ? '50%' : 'auto';
    iframe.style.transform = window.innerWidth < 1000 ? 'translate(-50%, -50%)' : 'none';
    iframe.style.bottom = window.innerWidth < 1000 ? '' : '3vh';
    iframe.style.right = window.innerWidth < 1000 ? '' : '3vh';

    sendMessageToIframe(); // Ensure message data is updated and sent
  }

  var gifUrls = [
    'http://dialogintelligens.dk/wp-content/uploads/2024/10/Findprodukthhs.gif',
    'http://dialogintelligens.dk/wp-content/uploads/2024/10/hhs-hjaelp.gif'
    // Add new GIF URLs here
  ];

  // Speech balloon management
  function manageSpeechBalloon() {
    var hasClosedBalloon = getCookie("hasClosedBalloon");
    if (hasClosedBalloon) {
      document.getElementById('speech-balloon').style.display = 'none';
      return;
    }
  
    var nextShowTime = getCookie("nextSpeechBalloonShowTime");
    var now = new Date().getTime();
    var delay = 0;
  
    if (nextShowTime && parseInt(nextShowTime) > now) {
      delay = parseInt(nextShowTime) - now;
    }
  
    setTimeout(function showBalloon() {
      // Add this code at the beginning of showBalloon()
      var hasClosedBalloon = getCookie("hasClosedBalloon");
      if (hasClosedBalloon) {
        return; // User has closed the balloon; do not show it again
      }
  
      // Randomly select a GIF URL
      var randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
      // Set the background-image style
      document.getElementById('speech-balloon').style.backgroundImage = 'url(' + randomGifUrl + ')';
  
      document.getElementById("speech-balloon").style.display = "block";
      setTimeout(function hideBalloon() {
        document.getElementById("speech-balloon").style.display = "none";
        var nextTime = new Date().getTime() + 300000;
        var domain = window.location.hostname;
        var domainParts = domain.split(".");
        if (domainParts.length > 2) {
          domain = "." + domainParts.slice(-2).join(".");
        } else {
          domain = "." + domain;
        }
        setCookie("nextSpeechBalloonShowTime", nextTime, 1, domain);
        setTimeout(showBalloon, 300000);
      }, 10000);
    }, delay || 25000);
  }


  // Initial load and resize adjustments
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

  // Close button functionality for the speech balloon
  var closeBalloonButton = document.getElementById('close-balloon');
  if (closeBalloonButton) {
    closeBalloonButton.addEventListener('click', function() {
      var domain = window.location.hostname;
      var domainParts = domain.split(".");
      if (domainParts.length > 2) {
        domain = "." + domainParts.slice(-2).join(".");
      } else {
        domain = "." + domain;
      }
      document.getElementById('speech-balloon').style.display = 'none';
      setCookie("hasClosedBalloon", "true", 365, domain);
    });
  }

  // Start the speech balloon management when the page loads
  manageSpeechBalloon();
});

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
        <img src="https://image-hosting-pi.vercel.app/Pecus_messageLogo.png" alt="Chat with us">
      </button>
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
      chatbotID: "pecus",
      pagePath: window.location.href,
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/75e15c17-52e2-43bd-9408-01180ff25c7f",
      apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/099e82cf-19f6-4cde-857c-6f8dff44d1d4",
      fordelingsflowAPI: "",
      flow2Key: "",
      flow2API: "",
      flow3Key: "",
      flow3API: "",
      SOCKET_SERVER_URL_Backup: "",
      apiEndpointBackup: "",
      fordelingsflowAPIBackup: "",
      flow2APIBackup: "",
      flow3APIBackup: "",
      imageAPI: "",
      privacyLink: "https://image-hosting-pi.vercel.app/Privatlivspolitikk_Pecus.pdf",
      titleLogoG: "https://image-hosting-pi.vercel.app/Pecus_whiteMessageLogo.png",
      headerLogoG: "https://image-hosting-pi.vercel.app/Pecus_logo.png",
      themeColor: "#f68f00",
      headerTitleG: "Pecus Virtuell Agent",
      headerSubtitleG: "Du skriver med en kunstig intelligens. Ved å bruke denne chatboten godtar du at det kan oppstå feil, og at samtalen kan lagres og behandles. Les mer i vår personvernerklæring.",
      titleG: "Pecus",
      firstMessage: "Hei😊 Hvordan kan jeg hjelpe deg?",
      leadGen: "%%",
      leadMail: "team@dialogintelligens.dk",
      leadField1: "Firmanavn",
      leadField2: "Email",
         
      isTabletView: (window.innerWidth < 1000 && window.innerWidth > 800),
      isPhoneView: (window.innerWidth < 800)
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

});

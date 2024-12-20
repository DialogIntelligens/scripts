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
    
    
    
    #BeaconFabButtonPulse {
      position: absolute;
      width: 60px;
      height: 60px;
      top: -10px;
      left: -10px;
      fill: var(--pulse-background);
      fill: #FF5733;
      z-index: -1;
      pointer-events: none;
      display: none;
    }
    
    #BeaconFabButtonPulse.is-visible {
      display: block !important;
      opacity: 0.2;
      animation: 
        1.03s cubic-bezier(0.28, 0.53, 0.7, 1) pulse-scale 0.13s both,
        0.76s cubic-bezier(0.42, 0, 0.58, 1) pulse-fade-out 0.4s both;
    }
    
    @keyframes pulse-scale {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(4);
      }
    }
    
    @keyframes pulse-fade-out {
      0% {
        opacity: 0.2;
      }
      100% {
        opacity: 0;
      }
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
        <img src="http://dialogintelligens.dk/wp-content/uploads/2024/12/jagttegnkurserMessageLogo.png" alt="Chat with us">
      </button>
      <!-- Pulse Animation -->
      <div id="BeaconFabButtonPulse" class="is-visible">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M60 30C60 51.25 51.25 60 30 60C8.75 60 0 51.25 0 30C0 8.75 8.75 0 30 0C51.25 0 60 8.75 60 30Z"></path>
        </svg>
      </div>
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

// Function to toggle the pulse animation
  function togglePulseAnimation(show) {
    const pulseElement = document.querySelector('#BeaconFabButtonPulse'); // Use # for ID
    if (show) {
      pulseElement.classList.add('is-visible');
    } else {
      pulseElement.classList.remove('is-visible');
    }
  }
  
  // Trigger animation when the chat button is hovered
  document.getElementById('chat-button').addEventListener('mouseenter', () => {
    togglePulseAnimation(true);
  });
  
  // Hide animation when mouse leaves
  document.getElementById('chat-button').addEventListener('mouseleave', () => {
    togglePulseAnimation(false);
  });



  
  function sendMessageToIframe() {
    var iframe = document.getElementById('chat-iframe');
    var iframeWindow = iframe.contentWindow;

    var messageData = {
      action: 'integrationOptions',
      chatbotID: "egenhjemmeside",
      pagePath: window.location.href,
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/14ac2aa7-8ad3-474e-99d8-59ff691bb77b",
      SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/",
      apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/17540c39-bd50-4686-89fc-919b13581b8f",
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

      imageAPI: '',
      
      privacyLink: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Privatlivspolitik_jagttegnkurser.pdf",
      titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/04/DIlogo.png",
      headerLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/04/DIlogo.png",
      themeColor: "#47E076",
      headerTitleG: "Virtuel assistent",
      headerSubtitleG: "Vores virtuelle assistent er trænet med information omkring vores virksomhed, og kan hjælpe dig med at besvare dine spørgsmål.",
      titleG: "Dialog Intelligens",
      firstMessage: "Hej😊 Vil du have et tilbud til din virksomhed?",
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

  //var gifUrls = [
    //'https://image-hosting-pi.vercel.app/jagttegn.gif',
    //'https://image-hosting-pi.vercel.app/jagttegn.gif'
    // Add new GIF URLs here
  ///];

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
        var nextTime = new Date().getTime() + 250000;
        var domain = window.location.hostname;
        var domainParts = domain.split(".");
        if (domainParts.length > 2) {
          domain = "." + domainParts.slice(-2).join(".");
        } else {
          domain = "." + domain;
        }
        setCookie("nextSpeechBalloonShowTime", nextTime, 1, domain);
        setTimeout(showBalloon, 250000);
      }, 12000);
    }, delay || 11000);
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

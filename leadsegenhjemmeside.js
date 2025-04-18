// Wait until the DOM is fully loaded

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KV5ZHMDX');</script>
<!-- End Google Tag Manager -->


document.addEventListener('DOMContentLoaded', function() {
  // Inject CSS into the head
  var css = `
  #chat-button:hover {
    opacity: 0.7;
    transform: scale(1.1);
  }

  /* Speech balloon GIF with updated position and size */
  #speech-balloon {
      display: none;
      position: fixed;
      bottom: 90px; /* Adjusted to be further down */
      right: 100px;  /* Adjusted to be further right */
      width: 250px;   /* Updated width */
      height: 110px;  /* Updated height */
      background-image: url('https://dialogintelligens.dk/wp-content/uploads/2024/10/trafiktoeri.gif');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 1500;
  }

  #close-balloon {
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
  <!-- Chat Button -->
  <button id="chat-button" style="cursor: pointer; position: fixed; bottom: 30px; right: 30px; background: none; border: none; z-index: 401;">
    <img src="https://dialogintelligens.dk/wp-content/uploads/2024/10/billogo.png" alt="Chat with us" style="width: 70px; height: 70px; transition: opacity 0.3s;">
  </button>

  <!-- Speech Balloon GIF with Close Button -->
  <div id="speech-balloon">
    <button id="close-balloon" style="position: absolute; top: 5px; right: 5px; background-color: transparent; border: none; font-size: 16px; cursor: pointer;">&times;</button>
  </div>

  <!-- Chat Iframe -->
  <iframe id="chat-iframe" src="https://skalerbartproduktchatbottrafik.onrender.com" style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;"></iframe>
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

  function sendMessageToIframe() {
    var iframe = document.getElementById('chat-iframe');
    var iframeWindow = iframe.contentWindow;

 function sendMessageToIframe() {
    var iframeWindow = document.getElementById('chat-iframe').contentWindow;
    iframeWindow.postMessage({
    action: 'integrationOptions',
		chatbotID: "egenhjemmeside",
		pagePath: "https://dialogintelligens.dk/",
		SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/",
    		apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/6119a88d-60dd-4b2e-98e3-6dabfa4fa06f",
		fordelingsflowAPI: "",
		flow2Key: "shhdsahfdshfds",
		flow2API: "",
		flow3Key: "sdfdsfds",
		flow3API: ""


		privacyLink: "",
		titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/04/DIlogo.png",
		headerLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/04/DIlogo.png",
		themeColor: "#5083e3",
		headerTitleG: "Virtuel assistent",
		headerSubtitleG: "Vores virtuelle assistent er trænet med information omkring vores virksomhed, og kan hjælpe dig med at besvare dine spørgsmål.",
		titleG: "Dialog Intelligens",
		firstMessage: "Hej😊 Hvad kan jeg hjælpe dig med?🤖",
    isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
    isPhoneView: window.innerWidth < 800
      
    }, "https://skalerbartprodukt.onrender.com");
  }




    function trySendingMessage() {
      if (retryAttempts < maxRetryAttempts) {
        iframeWindow.postMessage(messageData, "https://skalerbartproduktchatbottrafik.onrender.com");
        retryAttempts++;
      } else {
        console.error("Failed to send message to iframe after multiple attempts");
      }
    }

    window.addEventListener('message', function(event) {
      if (event.origin === "https://skalerbartproduktchatbottrafik.onrender.com" && event.data.ack === 'integrationOptionsReceived') {
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
    if (event.origin !== "https://skalerbartproduktchatbottrafik.onrender.com") return;

    if (event.data.action === 'toggleSize') {
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === 'closeChat') {
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
    } else if (event.data.action === 'navigate') {
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

  // Replaced manageSpeechBalloon function with the one from the first code
  function manageSpeechBalloon() {
    var hasClosedBalloon = getCookie("hasClosedBalloon");
    if (hasClosedBalloon) {
      document.getElementById('speech-balloon').style.display = 'none';
      return;
    }

    // Get next scheduled show time from cookie
    var nextShowTime = getCookie("nextSpeechBalloonShowTime");
    var now = new Date().getTime();
    var delay = 0;

    if (nextShowTime && parseInt(nextShowTime) > now) {
      // Balloon is scheduled to be shown in the future
      delay = parseInt(nextShowTime) - now;
    }

    // Schedule the balloon to be shown after 'delay' or initial 10-second delay
    setTimeout(function showBalloon() {
      document.getElementById("speech-balloon").style.display = "block"; // Show the balloon
      // Hide the balloon after 10 seconds
      setTimeout(function hideBalloon() {
        document.getElementById("speech-balloon").style.display = "none"; // Hide balloon after 10 seconds
        // Update the next scheduled show time to 10 minutes from now
        var nextTime = new Date().getTime() + 600000; // 10 minutes in milliseconds
        var domain = window.location.hostname;
        var domainParts = domain.split(".");
        if (domainParts.length > 2) {
          // Assume domain is in the format subdomain.domain.tld
          domain = "." + domainParts.slice(-2).join(".");
        } else {
          domain = "." + domain;
        }
        setCookie("nextSpeechBalloonShowTime", nextTime, 1, domain); // Set cookie with domain covering subdomains
        // Call showBalloon function again after 10 minutes (without needing to reload)
        setTimeout(showBalloon, 600000); // 10 minutes wait before showing the balloon again
      }, 10000); // 10 seconds open duration
    }, delay || 25000); // Initial 25-second delay before first show
  }

  // Initial load and resize adjustments
  adjustIframeSize();
  window.addEventListener('resize', adjustIframeSize);

  // Attach event listener to chat-button
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);

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

  // Close button functionality
  var closeBalloonButton = document.getElementById('close-balloon');
  if (closeBalloonButton) {
    closeBalloonButton.addEventListener('click', function() {
      var domain = window.location.hostname;
      var domainParts = domain.split(".");
      if (domainParts.length > 2) {
        // Assume domain is in the format subdomain.domain.tld
        domain = "." + domainParts.slice(-2).join(".");
      } else {
        domain = "." + domain;
      }
      document.getElementById('speech-balloon').style.display = 'none';
      setCookie("hasClosedBalloon", "true", 365, domain); // Store state in cookie for 1 year
    });
  }

  // Start the speech balloon management when the page loads
  manageSpeechBalloon();
});


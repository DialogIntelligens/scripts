<script>
document.addEventListener('DOMContentLoaded', function() {

  /********************************************************
   * 1) CREATE OR GET THE STABLE USER ID
   ********************************************************/
  function getOrCreateUserId() {
    let userId = localStorage.getItem('websiteuserid');
    if (!userId) {
      userId = 'cbt-' + Math.random().toString(36).substr(2, 12);
      localStorage.setItem('websiteuserid', userId);
    }
    return userId;
  }

  /********************************************************
   * 2) TRACK SITE VISIT ONCE PER SESSION
   ********************************************************/
  function trackSiteVisitIfNeeded() {
    // If we've already tracked a visit this session, skip
    if (localStorage.getItem('visitTracked') === 'true') return;
    localStorage.setItem('visitTracked', 'true');

    const userId = getOrCreateUserId();

    // Call CRM with usedChatbot=false, madePurchase=false
    fetch('https://egendatabasebackend.onrender.com/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        websiteuserid: userId,
        usedChatbot: 'false',
        madePurchase: 'false',
        chatbot_id: 'jagttegnkurser'
      })
    })
    .then(r => r.json())
    .then(resp => console.log('CRM site visit recorded:', resp))
    .catch(e => console.error('CRM site visit error:', e));
  }

  /********************************************************
   * 3) CHECK FOR CHECKOUT => track madePurchase=true
   ********************************************************/
  const checkoutUrlPattern = '/checkout/';

  function isOnCheckoutPage() {
    return window.location.href.toLowerCase().includes(checkoutUrlPattern.toLowerCase());
  }

  function trackCheckoutIfAny() {
    if (localStorage.getItem('purchaseTracked') === 'true') return;
    if (isOnCheckoutPage()) {
      localStorage.setItem('purchaseTracked', 'true');
      const userId = getOrCreateUserId();
      fetch('https://egendatabasebackend.onrender.com/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteuserid: userId,
          usedChatbot: 'true',   // safe to mark usedChatbot as well
          madePurchase: 'true',
          chatbot_id: 'jagttegnkurser'
        })
      })
      .then(r => r.json())
      .then(resp => console.log('Purchase tracked in CRM:', resp))
      .catch(e => console.error('Error tracking purchase:', e));
    }
  }
  // Check every 8 seconds
  setInterval(trackCheckoutIfAny, 8000);

  /********************************************************
   * 4) MARK WHEN USER OPENS THE CHATBOT => usedChatbot=true
   ********************************************************/
  let hasAlreadyNotifiedChatUse = false;
  function notifyChatUsed() {
    if (hasAlreadyNotifiedChatUse) return;
    hasAlreadyNotifiedChatUse = true;

    const userId = getOrCreateUserId();
    fetch('https://egendatabasebackend.onrender.com/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        websiteuserid: userId,
        usedChatbot: 'true',
        madePurchase: 'false',
        chatbot_id: 'jagttegnkurser'
      })
    })
    .then(r => r.json())
    .then(resp => console.log('CRM usage recorded:', resp))
    .catch(e => console.error('CRM usage error:', e));
  }

  /********************************************************
   * 5) MAIN INIT: load chatbot container, styles, popup
   ********************************************************/
  function initChatbot() {
    // (a) Check if already loaded
    if (document.getElementById('chat-container')) {
      console.log("Chatbot already loaded.");
      return;
    }

    // (b) Track the site visit once per session
    trackSiteVisitIfNeeded();

    // (c) Insert the chatbot container
    var widgetContainer = document.createElement('div');
    widgetContainer.id = 'my-chat-widget';
    document.body.appendChild(widgetContainer);

    // Your existing code:
    var isIframeEnlarged = false; 
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;600;900&display=swap';
    document.head.appendChild(fontLink);

    var css = `
    /* Your existing CSS, unchanged */
    @keyframes blink-eye {
      /* ... */
    }
    /* etc. */
    `;
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Full HTML injection
    var chatbotHTML = `
      <div id="chat-container">
        <!-- Chat Button -->
        <button id="chat-button">
          <svg version="1.1" ...> 
            <!-- Your existing chatbot SVG paths -->
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
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    /********************************************
     * 6) PASS userId TO THE IFRAME & LOAD LOGIC
     ********************************************/
    function sendMessageToIframe() {
      var iframe = document.getElementById("chat-iframe");
      var iframeWindow = iframe.contentWindow;
      // Reuse the same stable ID from localStorage
      const userId = getOrCreateUserId();

      var messageData = {
        action: 'integrationOptions',
        chatbotID: "jagttegnkurser",
        pagePath: window.location.href,
        statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/14ac2aa7-8ad3-474e-99d8-59ff691bb77b",
        SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/",
        apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/3b8a2716-85de-45ae-b3c9-0522f13d4c0f",
        // ...
        parentWebsiteUserId: userId,

        // everything else is the same...
        leadGen: "%%",
        leadMail: "info@jagttegnkurser.dk",
        leadField1: "Navn",
        leadField2: "Telefon nummer",
        imageAPI: "",
        privacyLink: "...",
        titleLogoG: "...",
        headerLogoG: "...",
        themeColor: "#626b4e",
        headerTitleG: "Jagttegn kursers Virtuelle Assistent",
        headerSubtitleG: "...",
        titleG: "Jagttegn kurser",
        firstMessage: "Hej😊 Hvad kan jeg hjælpe dig med?🫎",
        isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
        isPhoneView: window.innerWidth < 800
      };

      // Post message now or on iframe onload
      if (iframe.style.display !== 'none') {
        try {
          iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
        } catch (e) {
          console.error("Error posting message to iframe:", e);
        }
      } else {
        iframe.onload = function() {
          try {
            iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
          } catch (e) {
            console.error("Error posting message on iframe load:", e);
          }
        };
      }
    }

    // Listen for messages from the iFrame
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

    /********************************************
     * 7) TOGGLE + USAGE LOGIC
     ********************************************/
    function toggleChatWindow() {
      var iframe = document.getElementById('chat-iframe');
      var button = document.getElementById('chat-button');
      var popup = document.getElementById("chatbase-message-bubbles");

      // Determine if the chat is currently open
      var isCurrentlyOpen = (iframe.style.display !== 'none');

      // Toggle
      iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
      button.style.display = isCurrentlyOpen ? 'block' : 'none';
      localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');

      // Close popup
      if (!isCurrentlyOpen) {
        popup.style.display = "none";
        localStorage.setItem("popupClosed", "true");
      }

      // Adjust size
      adjustIframeSize();

      // If opening, mark usedChatbot=true
      if (!isCurrentlyOpen) {
        notifyChatUsed();
        setTimeout(function() {
          iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
        }, 100);
      }
    }

    /********************************************
     * 8) POPUP LOGIC (show/hide)
     ********************************************/
    var popup = document.getElementById("chatbase-message-bubbles");
    if (popup && popup.style.display === "flex") {
      popup.style.display = "none";
    }

    function showPopup() {
      var iframe = document.getElementById("chat-iframe");
      if (iframe.style.display !== "none" || localStorage.getItem("popupClosed") === "true") {
        return;
      }
      var popup = document.getElementById("chatbase-message-bubbles");
      var messageBox = document.getElementById("popup-message-box");
      var userHasVisited = getCookie("userHasVisited");

      if (!userHasVisited) {
        setCookie("userHasVisited", "true", 1, ".yourdomain.com");
        messageBox.innerHTML = `Hej! Jeg kan svare på spørgsmål omkring jagt og vores kurser🦌 Har du brug for hjælp? <span id="funny-smiley">😄</span>`;
      } else {
        messageBox.innerHTML = `Velkommen tilbage! Har du brug for hjælp? <span id="funny-smiley">😄</span>`;
      }

      // Adjust width based on length
      var charCount = messageBox.textContent.trim().length;
      if (charCount < 25) {
        popup.style.width = "380px";
      } else if (charCount < 60) {
        popup.style.width = "405px";
      } else {
        popup.style.width = "460px";
      }

      popup.style.display = "flex";

      // small blink/jump animations...
      var enablePulseAnimation = false; 
      // etc. your existing logic
    }

    var closePopupButton = document.querySelector("#chatbase-message-bubbles .close-popup");
    if (closePopupButton) {
      closePopupButton.addEventListener("click", function() {
        document.getElementById("chatbase-message-bubbles").style.display = "none";
        localStorage.setItem("popupClosed", "true");
      });
    }

    var popupClosed = localStorage.getItem("popupClosed");
    if (!popupClosed || popupClosed === "false") {
      setTimeout(showPopup, 7000);
    }

    /********************************************
     * 9) ADJUST IFRAME SIZE
     ********************************************/
    function adjustIframeSize() {
      var iframe = document.getElementById('chat-iframe');
      console.log("Adjusting iframe size. Window width:", window.innerWidth);

      if (isIframeEnlarged) {
        iframe.style.width = 'calc(2 * 45vh + 6vw)';
        iframe.style.height = '90vh';
      } else {
        if (window.innerWidth < 1000) {
          iframe.style.width = '95vw';
          iframe.style.height = '90vh';
        } else {
          iframe.style.width = 'calc(45vh + 6vw)';
          iframe.style.height = '90vh';
        }
      }

      iframe.style.position = 'fixed';

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

      // Re-send data in case layout changed
      sendMessageToIframe();
    }

    // Hook up events
    adjustIframeSize();
    window.addEventListener('resize', adjustIframeSize);
    document.getElementById('chat-button').addEventListener('click', toggleChatWindow);

    // Restore chat open/closed state
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
  } // end initChatbot

  // 10) Actually load the chatbot
  initChatbot();

  // 11) Retry logic
  [2000, 5000, 10000].forEach(function(delay) {
    setTimeout(function() {
      if (!document.getElementById('chat-container')) {
        console.log(`Chatbot not loaded after ${delay / 1000} seconds, retrying...`);
        initChatbot();
      }
    }, delay);
  });

});
</script>

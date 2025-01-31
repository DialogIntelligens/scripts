document.addEventListener('DOMContentLoaded', function () {
  // Inject Google Tag Manager
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-N3MZDZ65');

  var css = `
  /* ----------------------------------------
     GLOBAL STYLES
     ---------------------------------------- */
  :root {
    --icon-color: #13B981; /* Change this for different button color */
    --popup-background: white;
    --popup-text-color: black;
  }

  /* ----------------------------------------
     CHAT BUTTON & CONTAINER
     ---------------------------------------- */
  #chat-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 401;
  }

  #chat-button {
    cursor: pointer;
    background: none;
    border: none;
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

  /* ----------------------------------------
     POPUP STYLES (ADDED FROM OLD CODE)
     ---------------------------------------- */
  #chatbase-message-bubbles {
    position: absolute;
    bottom: 70px;
    right: 7px;
    border-radius: 10px;
    font-family: 'Source Sans 3', sans-serif;
    font-size: 20px;
    z-index: 18;
    cursor: pointer;
    display: none;
    flex-direction: column;
    gap: 50px;
    background-color: var(--popup-background);
    min-width: 460px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
    animation: rise-from-bottom 0.6s ease-out;
  }

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

  #chatbase-message-bubbles .close-popup {
    position: absolute;
    top: 8px;
    right: 9px;
    font-weight: bold;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
    background-color: rgba(224, 224, 224, 0);
    color: var(--popup-text-color);
    opacity: 0;
    transform: scale(0.7);
    transition: all 0.3s;
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

  /* ----------------------------------------
     CHAT IFRAME
     ---------------------------------------- */
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
  `;

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Inject HTML
  var chatbotHTML = `
    <div id="chat-container">
      <!-- Chat Button -->
      <button id="chat-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="30" fill="var(--icon-color)" />
          <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" font-size="30px" fill="white">💬</text>
        </svg>
      </button>

      <!-- Popup -->
      <div id="chatbase-message-bubbles">
        <div class="close-popup">&times;</div>
        <div class="message-content">
          <div class="message-box" id="popup-message-box"></div>
        </div>
      </div>
    </div>

    <!-- Chat Iframe -->
    <iframe id="chat-iframe" src="https://skalerbartprodukt.onrender.com"></iframe>
  `;

  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  /********** Cookie Functions **********/
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
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  /********** Chat Toggle **********/
  function toggleChatWindow() {
    var iframe = document.getElementById("chat-iframe");
    var popup = document.getElementById("chatbase-message-bubbles");
    var isIframeOpen = iframe.style.display !== "none";

    if (!isIframeOpen) {
      iframe.style.display = "block";
      localStorage.setItem("chatWindowState", "open");
      sendMessageToIframe();
    } else {
      iframe.style.display = "none";
      localStorage.setItem("chatWindowState", "closed");
    }

    if (popup.style.display === "flex") {
      setTimeout(() => (popup.style.display = "none"), 0);
    }
  }

  /********** Send Message to Iframe **********/
  function sendMessageToIframe() {
    var iframe = document.getElementById("chat-iframe");
    var iframeWindow = iframe.contentWindow;

    var messageData = {
      action: 'integrationOptions',
      chatbotID: "SkadedjursStopp",
      pagePath: window.location.href,
      firstMessage: "Hej 😊 Vad kan jag hjälpa dig med?",
      isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
      isPhoneView: window.innerWidth < 800
    };

    if (iframeWindow) {
      iframeWindow.postMessage(messageData, "*");
    }
  }

  /********** Initialize Chat Window **********/
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

  document.getElementById("chat-button").addEventListener("click", toggleChatWindow);

  /********** Show Popup Once **********/
  setTimeout(() => {
    if (!getCookie("popupClosed")) {
      document.getElementById("chatbase-message-bubbles").style.display = "flex";
    }
  }, 7000);

  document.querySelector("#chatbase-message-bubbles .close-popup").addEventListener("click", function () {
    document.getElementById("chatbase-message-bubbles").style.display = "none";
    setCookie("popupClosed", "true", 1);
  });
});

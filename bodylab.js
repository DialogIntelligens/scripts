window.onload = function() {
  // Inject CSS into the head
  var css = "/* Container for chat button and speech balloon */" +
    "#chat-container {" +
    "position: fixed; bottom: 30px; right: 30px; z-index: 150;" +
    "}" +
    "/* Chat button styles */" +
    "#chat-button {" +
    "cursor: pointer; background: none; border: none;" +
    "}" +
    "#chat-button img {" +
    "width: 60px; height: 60px; transition: opacity 0.3s;" +
    "}" +
    "#chat-button:hover img {" +
    "opacity: 0.5; transform: scale(1.1);" +
    "}" +
    "/* Speech balloon styles */" +
    "#speech-balloon {" +
    "display: none; position: absolute; bottom: 78px; right: 78px; width: 220px; height: 95px; background-size: cover; background-repeat: no-repeat; background-position: center; z-index: 150;" +
    "}" +
    "/* Close button styles */" +
    "#close-balloon {" +
    "position: absolute; top: -5px; right: -4px; background-color: transparent; border: none; font-size: 16px; cursor: pointer; color: white; font-weight: bold;" +
    "}" +
    "#close-balloon:hover {" +
    "color: red;" +
    "}";

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Inject HTML into the body
  var chatbotHTML = '<div id="chat-container">' +
    '<button id="chat-button">' +
    '<img src="https://dialogintelligens.dk/wp-content/uploads/2024/06/chatIcon.png" alt="Chat with us">' +
    '</button>' +
    '<div id="speech-balloon">' +
    '<button id="close-balloon">&times;</button>' +
    '</div>' +
    '</div>' +
    '<iframe id="chat-iframe" src="https://bodylab.onrender.com" style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 3000;"></iframe>';

  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  var isIframeEnlarged = false;
  var iframeWindow;

  function sendMessageToIframe() {
    var iframe = document.getElementById('chat-iframe');
    iframeWindow = iframe.contentWindow;

    var messageData = {
      action: 'integrationOptions',
      titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/06/messageIcon.png",
      headerLogoG: "http://dialogintelligens.dk/wp-content/uploads/2024/10/customLogo.png",
      themeColor: "#75bddc",
      pagePath: window.location.href,
      headerTitleG: "Buddy",
      titleG: "Buddy",
      isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
      isPhoneView: window.innerWidth < 800
    };

    iframe.onload = function() {
      iframeWindow = iframe.contentWindow;
      iframeWindow.postMessage(messageData, "*");
    };

    // Try to send message immediately in case the iframe is already loaded
    try {
      iframeWindow.postMessage(messageData, "*");
    } catch (e) {
      // Ignore errors; message will be sent on iframe load
    }
  }

  // Global message event listener
  window.addEventListener('message', function(event) {
    // Only process messages from our iframe
    if (event.origin !== "https://bodylab.onrender.com") {
      return;
    }

    // Handle the 'toggleSize' and 'closeChat' actions
    if (event.data.action === 'toggleSize') {
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === 'closeChat') {
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      // Use try...catch in case localStorage is not available
      try {
        localStorage.setItem('chatWindowState', 'closed');
      } catch (e) {
        // Handle or log the error if necessary
      }
    }
  });

  function toggleChatWindow() {
    var iframe = document.getElementById('chat-iframe');
    var button = document.getElementById('chat-button');

    var isCurrentlyOpen = iframe.style.display !== 'none';

    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    button.style.display = isCurrentlyOpen ? 'block' : 'none';

    // Use try...catch in case localStorage is not available
    try {
      localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
    } catch (e) {
      // Handle or log the error if necessary
    }

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
      // Wrap setCookie in try...catch in case cookies are not available
      try {
        setCookie("hasClosedBalloon", "true", 365, domain);
      } catch (e) {
        // Handle or log the error if necessary
      }
    });
  }

  // Function definitions for setCookie and getCookie (wrap in try...catch)
  function setCookie(name, value, days, domain) {
    try {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      var domainStr = domain ? "; domain=" + domain : "";
      document.cookie = name + "=" + (value || "") + expires + domainStr + "; path=/";
    } catch (e) {
      // Handle or log the error if necessary
    }
  }

  function getCookie(name) {
    try {
      var nameEQ = name + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
    } catch (e) {
      // Handle or log the error if necessary
    }
    return null;
  }

  // Initial load and resize adjustments
  adjustIframeSize();
  window.addEventListener('resize', adjustIframeSize);

  // Initialize the chat window state
  var iframe = document.getElementById('chat-iframe');
  var button = document.getElementById('chat-button');
  var savedState = null;

  // Wrap localStorage access in try...catch
  try {
    savedState = localStorage.getItem('chatWindowState');
  } catch (e) {
    // Handle or log the error if necessary
  }

  if (savedState === 'open') {
    iframe.style.display = 'block';
    button.style.display = 'none';
    sendMessageToIframe();
  } else {
    iframe.style.display = 'none';
    button.style.display = 'block';
  }

  // Attach event listener to the chat button
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);
};

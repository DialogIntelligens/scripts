<script>
  window.onload = function() {
    // Inject CSS into the head
    var css = "/* Container for chat button and speech balloon */" +
      "#chat-container {" +
      "position: fixed; bottom: 30px; right: 30px; z-index: 401;" +
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
      "display: none; position: absolute; bottom: 78px; right: 78px; width: 220px; height: 95px; background-size: cover; background-repeat: no-repeat; background-position: center; z-index: 1500;" +
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
      '<iframe id="chat-iframe" src="https://bodylab.onrender.com" style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;"></iframe>';

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    var isIframeEnlarged = false;
    var iframeWindow;

    function sendMessageToIframe() {
      var iframe = document.getElementById('chat-iframe');
      iframeWindow = iframe.contentWindow;

      var messageData = {
        action: 'integrationOptions',
        titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/06/messageIcon.png",
        headerLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/06/customLogo.png",
        themeColor: "#75bddc",
        pagePath: "https://www.bodylab.dk/",
        headerTitleG: "Buddy",
        titleG: "Buddy",
        isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
        isPhoneView: window.innerWidth < 800
      };

      iframe.onload = function() {
        iframeWindow = iframe.contentWindow;
        iframeWindow.postMessage(messageData, "https://bodylab.onrender.com");
      };

      // Try to send message immediately in case the iframe is already loaded
      try {
        iframeWindow.postMessage(messageData, "https://bodylab.onrender.com");
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
        localStorage.setItem('chatWindowState', 'closed');
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

    // Start the speech balloon management
    manageSpeechBalloon();
  };

  // Speech balloon management function
  function manageSpeechBalloon() {
    var gifUrls = [
      'https://dialogintelligens.dk/wp-content/uploads/2024/10/Hjaelp-stong.gif',
      'https://dialogintelligens.dk/wp-content/uploads/2024/10/produktanbefaldning.gif',
      'https://dialogintelligens.dk/wp-content/uploads/2024/10/kostplan.gif'
    ];

    var gifIndex = 0;

    // Additional logic for speech balloon management
  }
</script>

<!-- Chatbot Container -->
<div id="chat-container">
  <!-- Chat Button -->
  <button id="chat-button">
    <img src="http://dialogintelligens.dk/wp-content/uploads/2024/12/padelRackMessageLogo.png" alt="Chat with us">
  </button>

  <!-- Speech Balloon -->
  <div id="speech-balloon">
    <button id="close-balloon">&times;</button>
  </div>
</div>

<!-- Chatbot Iframe -->
<iframe id="chat-iframe" src="https://skalerbartprodukt.onrender.com" 
  style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;" 
  sandbox="allow-scripts allow-same-origin"></iframe>

<script>
  var isIframeEnlarged = false;
  var maxRetryAttempts = 5;
  var retryAttempts = 0;

  // Message Data with New Variables
  function sendMessageToIframe() {
    var iframe = document.getElementById('chat-iframe');
    var iframeWindow = iframe.contentWindow;

    var messageData = {
      action: 'integrationOptions',
      chatbotID: 'egenhjemmeside',
      pagePath: 'https://dialogintelligens.dk/',
      SOCKET_SERVER_URL: 'https://den-utrolige-snebold.onrender.com/',
      apiEndpoint: 'https://den-utrolige-snebold.onrender.com/api/v1/prediction/17540c39-bd50-4686-89fc-919b13581b8f',
      fordelingsflowAPI: '',
      flow2Key: 'shhdsahfdshfds',
      flow2API: '',
      flow3Key: 'sdfdsfds',
      flow3API: '',
      privacyLink: '',
      titleLogoG: 'https://dialogintelligens.dk/wp-content/uploads/2024/04/DIlogo.png',
      headerLogoG: 'https://dialogintelligens.dk/wp-content/uploads/2024/04/DIlogo.png',
      themeColor: '#47E076',
      headerTitleG: 'Virtuel assistent',
      headerSubtitleG: 'Vores virtuelle assistent er trænet med information omkring vores virksomhed, og kan hjælpe dig med at besvare dine spørgsmål.',
      titleG: 'Dialog Intelligens',
      firstMessage: 'Hej😊 Vil du have et tilbud til din virksomhed?',
      preloadedMessage: 'Ja tak😀',
      isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
      isPhoneView: window.innerWidth < 800
    };

    // Retry Logic for Sending Messages
    function trySendingMessage() {
      if (retryAttempts < maxRetryAttempts) {
        iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
        retryAttempts++;
      } else {
        console.error("Failed to send message after multiple attempts");
      }
    }

    // Iframe Load Handler
    iframe.onload = function () {
      retryAttempts = 0;
      trySendingMessage();
    };

    setTimeout(function retrySending() {
      if (retryAttempts < maxRetryAttempts) {
        trySendingMessage();
        setTimeout(retrySending, 500);
      }
    }, 500);
  }

  // Toggle Chat Window
  function toggleChatWindow() {
    var iframe = document.getElementById('chat-iframe');
    var button = document.getElementById('chat-button');
    var isCurrentlyOpen = iframe.style.display !== 'none';

    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    button.style.display = isCurrentlyOpen ? 'block' : 'none';

    localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
    adjustIframeSize();

    if (!isCurrentlyOpen) {
      sendMessageToIframe();
      iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
    }
  }

  // Adjust Iframe Size
  function adjustIframeSize() {
    var iframe = document.getElementById('chat-iframe');
    iframe.style.width = isIframeEnlarged ? 'calc(2 * 45vh + 6vw)' : 'calc(45vh + 6vw)';
    iframe.style.height = '90vh';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '3vh';
    iframe.style.right = '2vw';
  }

  // Event Listeners
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);
  window.addEventListener('resize', adjustIframeSize);

  // Handle Message Events from Iframe
  window.addEventListener('message', function (event) {
    if (event.origin !== 'https://skalerbartprodukt.onrender.com') return;

    if (event.data.action === 'toggleSize') {
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === 'closeChat') {
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
    }
  });

  // Speech Balloon Management

  function manageSpeechBalloon() {
    var balloon = document.getElementById('speech-balloon');
    if (localStorage.getItem('hasClosedBalloon')) return;

    balloon.style.backgroundImage = 'url(' + gifUrls[Math.floor(Math.random() * gifUrls.length)] + ')';
    balloon.style.display = 'block';

    setTimeout(() => {
      balloon.style.display = 'none';
      localStorage.setItem('nextShowTime', Date.now() + 250000);
    }, 12000);
  }

  document.getElementById('close-balloon').addEventListener('click', function () {
    document.getElementById('speech-balloon').style.display = 'none';
    localStorage.setItem('hasClosedBalloon', 'true');
  });

  // Initial Load
  adjustIframeSize();
  if (localStorage.getItem('chatWindowState') === 'open') {
    toggleChatWindow();
  }
  manageSpeechBalloon();
</script>

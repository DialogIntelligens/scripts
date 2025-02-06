<script>
// Define the onDOMReady function
function onDOMReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

// Make sure everything runs after DOM is ready
onDOMReady(function() {
  // Inject CSS
  var css = "/* Container for chat button and speech balloon */" +
    "#chat-container { position: fixed; bottom: 30px; right: 30px; z-index: 150; }" +
    "/* Chat button styles */" +
    "#chat-button { cursor: pointer; background: none; border: none; }" +
    "#chat-button img { width: 60px; height: 60px; transition: opacity 0.3s; }" +
    "#chat-button:hover img { opacity: 0.5; transform: scale(1.1); }" +
    "/* Speech balloon styles */" +
    "#speech-balloon { display: none; position: absolute; bottom: 78px; right: 78px; width: 220px; height: 95px; background-size: cover; background-repeat: no-repeat; background-position: center; z-index: 150; }" +
    "/* Close button styles */" +
    "#close-balloon { position: absolute; top: -5px; right: -4px; background-color: transparent; border: none; font-size: 16px; cursor: pointer; color: white; font-weight: bold; }" +
    "#close-balloon:hover { color: red; }";

  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  // Inject HTML for chat button & balloon
  var chatContainerHTML = '<div id="chat-container">' +
    '<button id="chat-button">' +
      '<img src="https://dialogintelligens.dk/wp-content/uploads/2024/06/chatIcon.png" alt="Chat with us">' +
    '</button>' +
    '<div id="speech-balloon">' +
      '<button id="close-balloon">&times;</button>' +
    '</div>' +
  '</div>';
  document.body.insertAdjacentHTML('beforeend', chatContainerHTML);

  // Create the iframe
  var iframe = document.createElement('iframe');
  iframe.id = 'chat-iframe';
  iframe.style.display = 'none';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '3vh';
  iframe.style.right = '2vw';
  iframe.style.width = '50vh';
  iframe.style.height = '90vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = '3000';
  document.body.appendChild(iframe);

  // Initialize some variables
  var isIframeEnlarged = false;
  var iframeWindow;
  var chatButton = document.getElementById('chat-button');

  // Load the iframe, set its src, handle onload
  iframe.onload = onIframeLoad;
  iframe.src = 'https://bodylab.onrender.com'; // <-- Set your chatbot URL here

  // Once iframe is loaded, set up communication
  function onIframeLoad() {
    iframeWindow = iframe.contentWindow;
    adjustIframeSize();
    sendMessageToIframe();
  }

  // As a backup, check if iframe loaded from cache
  setTimeout(function() {
    if (!iframeWindow) {
      try {
        if (iframe.contentWindow && iframe.contentWindow.location.href !== 'about:blank') {
          onIframeLoad();
        }
      } catch (e) {
        // Ignore cross-origin errors
      }
    }
  }, 500);

  // Send the integration data to the iframe
  function sendMessageToIframe() {
    var messageData = {
      action: 'integrationOptions',
      titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/06/messageIcon.png",
      headerLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/10/customLogo.png",
      themeColor: "#65bddb",
      pagePath: window.location.href,
      headerTitleG: "Buddy",
      titleG: "Buddy",
      headerSubtitleG: "Du chatter med Buddy. Jeg ved det meste om træning og Bodylab-produkter ...",
      contactLink: "https://www.bodylab.dk/shop/cms-contact.html",
      contactTitle: "kundeservice",
      privacyLink: "http://dialogintelligens.dk/wp-content/uploads/2024/08/Privatlivspolitik-bodylab.pdf",
      inputText: "Skriv dit spørgsmål her...",

      // Example API endpoints
      placeholderAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/19576769-c4c7-4183-9c4a-6c9fbd0d4519",
      weightLossAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/f8bece82-8b6b-4acf-900e-83f1415b713d",
      productAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/fe4ea863-86ca-40b6-a17b-d52a60da4a6b",
      recipeAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/34b30c22-d938-4701-b644-d8da7755ad29",
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/8cf402f5-4796-4929-8853-e078f93bf7fe",

      chatbotID: "bodylab",

      // Example meal plan URLs
      mealplan1500: "http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-1500-kcal.pdf",
      mealplan2000: "http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-2000-kcal.pdf",
      mealplan2500: "http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-2500-kcal.pdf",
      mealplan3000: "http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-3000-kcal.pdf",
      mealplan3500: "http://dialogintelligens.dk/wp-content/uploads/2024/12/diet-plan-3500-kcal.pdf",
      vægttabmealplan1500: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-1500-kcal.pdf",
      vægttabmealplan2000: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-2000-kcal.pdf",
      vægttabmealplan2500: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-2500-kcal.pdf",
      vægttabmealplan3000: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-3000-kcal.pdf",
      vægttabmealplan3500: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Tabdiet-plan-3500-kcal.pdf",

      firstMessage1: "Hej",
      firstMessage2: "Mit navn er Buddy. Jeg er din virtuelle træningsmakker ...",

      isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
      isPhoneView: window.innerWidth < 800
    };

    // Send or retry if iframeWindow not yet available
    function postMessage() {
      if (iframeWindow) {
        iframeWindow.postMessage(messageData, "*");
      } else {
        setTimeout(postMessage, 200);
      }
    }
    postMessage();
  }

  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    if (event.origin !== "https://bodylab.onrender.com") {
      return; // Only process if from our chatbot domain
    }
    if (event.data.action === 'toggleSize') {
      // Toggle large/small chat window
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === 'closeChat') {
      // Close the chat
      iframe.style.display = 'none';
      chatButton.style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
    }
  });

  // Toggles the chat window (attached to the default floating button)
  function toggleChatWindow() {
    var isCurrentlyOpen = (iframe.style.display !== 'none');
    // Show/hide the iframe
    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    // Show/hide the floating chat button
    chatButton.style.display = isCurrentlyOpen ? 'block' : 'none';
    // Save state in localStorage
    localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
    // Adjust & notify iframe
    adjustIframeSize();
    sendMessageToIframe();
  }

  // Adjust the size/position of the iframe based on screen size or "enlarged" state
  function adjustIframeSize() {
    var width = window.innerWidth;
    // Desktop vs. tablet vs. phone
    if (width >= 1500) {
      // Large desktop, fixed size
      iframe.style.width = '500px';
      iframe.style.height = '700px';
    } else if (isIframeEnlarged) {
      iframe.style.width = 'calc(2 * 45vh + 6vw)';
      iframe.style.height = '90vh';
    } else {
      iframe.style.width = width < 1000 ? '95vw' : 'calc(45vh + 6vw)';
      iframe.style.height = '90vh';
    }
    // Position fixed or centered
    if (width < 1000) {
      iframe.style.position = 'fixed';
      iframe.style.left = '50%';
      iframe.style.top = '50%';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.bottom = '';
      iframe.style.right = '';
    } else {
      iframe.style.position = 'fixed';
      iframe.style.left = 'auto';
      iframe.style.top = 'auto';
      iframe.style.transform = 'none';
      iframe.style.bottom = '3vh';
      iframe.style.right = '3vh';
    }
  }

  // Close balloon button
  var closeBalloonButton = document.getElementById('close-balloon');
  if (closeBalloonButton) {
    closeBalloonButton.addEventListener('click', function() {
      var domain = window.location.hostname;
      var domainParts = domain.split(".");
      if (domainParts.length > 2) {
        // e.g. subdomain.domain.com => .domain.com
        domain = "." + domainParts.slice(-2).join(".");
      } else {
        domain = "." + domain;
      }
      document.getElementById('speech-balloon').style.display = 'none';
      setCookie("hasClosedBalloon", "true", 365, domain);
    });
  }

  // Helper: set a cookie
  function setCookie(name, value, days, domain) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    var domainString = domain ? "; domain=" + domain : "";
    document.cookie = name + "=" + (value || "") + expires + "; path=/" + domainString;
  }

  // Check localStorage to see if chat was open or closed
  var savedState = localStorage.getItem('chatWindowState');
  if (savedState === 'open') {
    // If previously open, show the chat
    iframe.style.display = 'block';
    chatButton.style.display = 'none';
    adjustIframeSize();
    sendMessageToIframe();
  } else {
    // Otherwise, keep it hidden
    iframe.style.display = 'none';
    chatButton.style.display = 'block';
  }

  // Attach event to the floating chat button
  chatButton.addEventListener('click', toggleChatWindow);

  // Handle window resize
  window.addEventListener('resize', adjustIframeSize);

  // --------------------------------------------------
  // EXPOSE A GLOBAL FUNCTION TO OPEN THE CHAT ON DEMAND
  // --------------------------------------------------
  window.openChat = function() {
    // If iframe is not visible, open it (same as pressing the floating button)
    if (iframe.style.display === 'none') {
      toggleChatWindow();
    }
  };
});
</script>

// Define the onDOMReady function
function onDOMReady(callback) {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

// Use onDOMReady to execute your code after the DOM is ready
onDOMReady(function() {
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

  // Inject HTML into the body (without the iframe)
  var chatContainerHTML = '<div id="chat-container">' +
    '<button id="chat-button">' +
    '<img src="https://dialogintelligens.dk/wp-content/uploads/2024/06/chatIcon.png" alt="Chat with us">' +
    '</button>' +
    '<div id="speech-balloon">' +
    '<button id="close-balloon">&times;</button>' +
    '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', chatContainerHTML);

  var isIframeEnlarged = false;
  var iframeWindow;

  // Create the iframe element
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

  // Set the onload event handler before setting the src
  iframe.onload = onIframeLoad;

  // Now set the src
  iframe.src = 'https://bodylab.onrender.com';

  // Append the iframe to the body
  document.body.appendChild(iframe);

  // Function to handle iframe load
  function onIframeLoad() {
    iframeWindow = iframe.contentWindow;
    adjustIframeSize();
    sendMessageToIframe();
  }

  // As a backup, check if iframe is already loaded (for cached iframes)
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
  }, 500); // Delay slightly longer

  function sendMessageToIframe() {
    var messageData = {
      action: 'integrationOptions',
      titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/06/messageIcon.png",
      headerLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/10/customLogo.png",
      themeColor: "#65bddb",
      pagePath: window.location.href,
      headerTitleG: "Buddy",
      titleG: "Buddy",
      headerSubtitleG: "Du chattar med Buddy. Jag vet det mesta om träning och Bodylab-produkter, om jag får säga det själv. Så om du har en fråga kan jag med stor sannolikhet hjälpa dig. Jag är dock bara en robot, och precis som människor kan jag också göra fel. Om du tycker att jag pratar strunt kan du bara kontakta vår",
      contactLink: "https://www.bodylab.se/shop/cms-contact.html",
      contactTitle: "kundtjänst",
      privacyLink: "http://dialogintelligens.dk/wp-content/uploads/2024/12/Integritetspolicy_BodylabSverige.docx",
      inputText: "Skriv din fråga här...",
      
      placeholderAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/bd6a3a34-cab6-4fbc-865e-a908f838ac87",
      weightLossAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/9f3f29e6-d5d8-400f-850f-c63f2bcee8fa",
      productAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/47340237-0736-4392-9c6a-d559b34f54aa",
      recipeAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/b5b78a1a-1e48-4cda-bece-6903c4ddc476",
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/28a65501-95e9-4e68-8895-30f9dc1c3754",
      chatbotID: "bodylabsverige",

      firstMessage1: "Hej",
      firstMessage2: "Mitt namn är Buddy. Jag är din virtuella träningspartner som kan hjälpa dig med allt från produktrekommendationer till träningstips. Ställ en fråga till mig – så hittar vi en lösning tillsammans! När du skriver accepterar du samtidigt att vår konversation behandlas och sparas 🤖",
      
      isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
      isPhoneView: window.innerWidth < 800
    };

    // Function to send message when iframeWindow is available
    function postMessage() {
      if (iframeWindow) {
        iframeWindow.postMessage(messageData, "*");
      } else {
        // Retry after 200ms if iframeWindow is not yet available
        setTimeout(postMessage, 200);
      }
    }

    postMessage();
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
      iframe.style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
    }
  });

  function toggleChatWindow() {
    var isCurrentlyOpen = iframe.style.display !== 'none';

    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    document.getElementById('chat-button').style.display = isCurrentlyOpen ? 'block' : 'none';

    localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');

    adjustIframeSize();
    sendMessageToIframe();
  }

  function adjustIframeSize() {
    console.log("Adjusting iframe size. Window width: ", window.innerWidth);

    var isTabletView = window.innerWidth < 1000 && window.innerWidth > 800;
    var isPhoneView = window.innerWidth < 800;

    if (window.innerWidth >= 1500) {
      // Fixed size for monitor screens
      iframe.style.width = '500px';
      iframe.style.height = '700px';
    } else if (isIframeEnlarged) {
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

  // Initialize the chat window state
  var savedState = localStorage.getItem('chatWindowState');
  var button = document.getElementById('chat-button');

  if (savedState === 'open') {
    iframe.style.display = 'block';
    button.style.display = 'none';
    // Adjust size and send message (will wait if iframeWindow is not ready)
    adjustIframeSize();
    sendMessageToIframe();
  } else {
    iframe.style.display = 'none';
    button.style.display = 'block';
  }

  // Attach event listener to the chat button
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);

  // Handle window resize
  window.addEventListener('resize', function() {
    adjustIframeSize();
  });
});

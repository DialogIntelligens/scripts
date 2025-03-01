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

  /*** STEP 1: FONT LINK INJECTION (NEW) ***/
  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;600;900&display=swap';
  document.head.appendChild(fontLink);

  /*** STEP 2: CSS INJECTION ***/
  // --- Remove old speech balloon CSS and add new popup CSS ---
  var css = "/* Container for chat button */" +
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
    // ===== REMOVE OLD POPUP (speech balloon) CSS =====
    // "/* Speech balloon styles */" +
    // "#speech-balloon {" +
    // "display: none; position: absolute; bottom: 78px; right: 78px; width: 220px; height: 95px; background-size: cover; background-repeat: no-repeat; background-position: center; z-index: 150;" +
    // "}" +
    // "/* Close button styles */" +
    // "#close-balloon {" +
    // "position: absolute; top: -5px; right: -4px; background-color: transparent; border: none; font-size: 16px; cursor: pointer; color: white; font-weight: bold;" +
    // "}" +
    // "#close-balloon:hover {" +
    // "color: red;" +
    // "}" +
    // ===== ADD NEW POPUP CSS =====
    "/* Popup rise animation */" +
    "@keyframes rise-from-bottom {" +
      "0% { transform: translateY(50px); opacity: 0; }" +
      "100% { transform: translateY(0); opacity: 1; }" +
    "}" +
    "/* Popup container */" +
    "#chatbase-message-bubbles {" +
      "position: absolute;" +
      "bottom: 70px;" +
      "right: 7px;" +
      "border-radius: 10px;" +
      "font-family: 'Source Sans 3', sans-serif;" +
      "font-size: 20px;" +
      "z-index: 18;" +
      "scale: 0.55;" +
      "cursor: pointer;" +
      "display: none;" +  // hidden by default
      "flex-direction: column;" +
      "gap: 50px;" +
      "background-color: white;" +
      "transform-origin: bottom right;" +
      "box-shadow: 0px 0.6px 0.54px -1.33px rgba(0, 0, 0, 0.15), " +
                  "0px 2.29px 2.06px -2.67px rgba(0, 0, 0, 0.13), " +
                  "0px 10px 9px -4px rgba(0, 0, 0, 0.04), " +
                  "rgba(0, 0, 0, 0.125) 0px 0.362176px 0.941657px -1px, " +
                  "rgba(0, 0, 0, 0.18) 0px 3px 7.8px -2px;" +
      "animation: rise-from-bottom 0.6s ease-out;" +
    "}" +
    "#chatbase-message-bubbles::after {" +
      "content: '';" +
      "position: absolute;" +
      "bottom: 0px;" +
      "right: 30px;" +
      "width: 0;" +
      "height: 0;" +
      "border-style: solid;" +
      "border-width: 10px 10px 0 20px;" +
      "border-color: white transparent transparent transparent;" +
      "box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px;" +
    "}" +
    "/* Close button in popup */" +
    "#chatbase-message-bubbles .close-popup {" +
      "position: absolute;" +
      "top: 8px;" +
      "right: 9px;" +
      "font-weight: bold;" +
      "display: flex;" +
      "justify-content: center;" +
      "align-items: center;" +
      "width: 25px;" +
      "height: 25px;" +
      "border-radius: 50%;" +
      "text-align: center;" +
      "font-size: 18px;" +
      "cursor: pointer;" +
      "background-color: rgba(224, 224, 224, 0);" +
      "color: black;" +
      "opacity: 0;" +
      "transform: scale(0.7);" +
      "transition: background-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;" +
      "z-index: 1000000;" +
      "pointer-events: none;" +
    "}" +
    "#chatbase-message-bubbles:hover .close-popup {" +
      "opacity: 1;" +
      "transform: scale(1.2);" +
      "pointer-events: auto;" +
    "}" +
    "#chatbase-message-bubbles .close-popup:hover {" +
      "background-color: black;" +
      "color: white;" +
    "}" +
    "@media (max-width: 600px) {" +
      "#chatbase-message-bubbles {" +
        "width: 90vw;" +
        "max-width: 90vw;" +
        "bottom: 69px;" +
        "right: 0vw;" +
      "}" +
    "}";
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  /*** STEP 3: HTML INJECTION ***/
  // --- Replace the old speech-balloon markup with the new popup markup ---
  var chatContainerHTML = '<div id="chat-container">' +
    '<button id="chat-button">' +
    '<img src="https://dialogintelligens.dk/wp-content/uploads/2024/06/chatIcon.png" alt="Chat with us">' +
    '</button>' +
    // ===== DELETE OLD SPEECH BALLOON =====
    // '<div id="speech-balloon">' +
    // '<button id="close-balloon">&times;</button>' +
    // '</div>' +
    // ===== ADD NEW POPUP MARKUP =====
    '<div id="chatbase-message-bubbles">' +
      '<div class="close-popup">&times;</div>' +
      '<div class="message-content">' +
        '<div class="message-box" id="popup-message-box"></div>' +
      '</div>' +
    '</div>' +
    '</div>';
  document.body.insertAdjacentHTML('beforeend', chatContainerHTML);

  /*** Existing iframe creation & integration (keep unchanged) ***/
  var isIframeEnlarged = false;
  var iframeWindow;
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
  iframe.onload = onIframeLoad;
  iframe.src = 'https://bodylab.onrender.com';
  document.body.appendChild(iframe);

  function onIframeLoad() {
    iframeWindow = iframe.contentWindow;
    adjustIframeSize();
    sendMessageToIframe();
  }
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

  function sendMessageToIframe() {
    var messageData = {
      action: 'integrationOptions',
      titleLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/06/messageIcon.png",
      headerLogoG: "https://dialogintelligens.dk/wp-content/uploads/2024/10/customLogo.png",
      themeColor: "#65bddb",
      pagePath: window.location.href,
      headerTitleG: "Buddy",
      titleG: "Buddy",
      headerSubtitleG: "Du chatter med Buddy. Jeg ved det meste om træning og Bodylab-produkter, hvis jeg selv skal sige det. Så hvis du har et spørgsmål, kan jeg med stor sandsynlighed hjælpe dig. Jeg er dog kun en robot, og ligesom mennesker kan jeg også fejle. Hvis du synes, jeg sludrer, tager du bare fat i vores",
      contactLink: "https://www.bodylab.dk/shop/cms-contact.html",
      contactTitle: "kundeservice",
      privacyLink: "http://dialogintelligens.dk/wp-content/uploads/2024/08/Privatlivspolitik-bodylab.pdf",
      inputText: "Skriv dit spørgsmål her...",
      
      placeholderAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/19576769-c4c7-4183-9c4a-6c9fbd0d4519",
      weightLossAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/f8bece82-8b6b-4acf-900e-83f1415b713d",
      productAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/fe4ea863-86ca-40b6-a17b-d52a60da4a6b",
      recipeAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/34b30c22-d938-4701-b644-d8da7755ad29",
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/8cf402f5-4796-4929-8853-e078f93bf7fe",
      
      chatbotID: "bodylab",

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
      firstMessage2: "Mit navn er Buddy. Jeg er din virtuelle træningsmakker, som kan hjælpe dig med alt fra produktanbefalinger til træningstips. Stil mig et spørgsmål – så finder vi en løsning sammen! Når du skriver, accepterer du samtidig, at vores samtale behandles og gemmes 🤖",
      
      isTabletView: window.innerWidth < 1000 && window.innerWidth > 800,
      isPhoneView: window.innerWidth < 800
    };

    function postMessage() {
      if (iframeWindow) {
        iframeWindow.postMessage(messageData, "*");
      } else {
        setTimeout(postMessage, 200);
      }
    }
    postMessage();
  }

  // Global message event listener
  window.addEventListener('message', function(event) {
    if (event.origin !== "https://bodylab.onrender.com") {
      return;
    }
    if (event.data.action === 'toggleSize') {
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === 'closeChat') {
      iframe.style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
    }
  });

  /*** STEP 4: UPDATE toggleChatWindow() FUNCTION ***/
  // --- Modify toggleChatWindow to hide the popup when opening chat ---
  function toggleChatWindow() {
    var isCurrentlyOpen = iframe.style.display !== 'none';
    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    document.getElementById('chat-button').style.display = isCurrentlyOpen ? 'block' : 'none';
    localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');

    // NEW: Hide the popup when the chat is opened
    if (!isCurrentlyOpen) {
      var popup = document.getElementById("chatbase-message-bubbles");
      if (popup) {
        popup.style.display = "none";
        localStorage.setItem("popupClosed", "true");
      }
    }

    adjustIframeSize();
    sendMessageToIframe();
  }

  function adjustIframeSize() {
    console.log("Adjusting iframe size. Window width: ", window.innerWidth);
    var isTabletView = window.innerWidth < 1000 && window.innerWidth > 800;
    var isPhoneView = window.innerWidth < 800;

    if (window.innerWidth >= 1500) {
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

  // Initialize chat window state
  var savedState = localStorage.getItem('chatWindowState');
  var button = document.getElementById('chat-button');
  if (savedState === 'open') {
    iframe.style.display = 'block';
    button.style.display = 'none';
    adjustIframeSize();
    sendMessageToIframe();
  } else {
    iframe.style.display = 'none';
    button.style.display = 'block';
  }

  // Attach event listener to chat button
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);

  // Handle window resize
  window.addEventListener('resize', function() {
    adjustIframeSize();
  });

  window.openChat = function() {
    var isCurrentlyOpen = iframe.style.display !== 'none';
    if (!isCurrentlyOpen) {
      toggleChatWindow();
    }
  };

  /*** STEP 5: ADD COOKIE FUNCTIONS (NEW) ***/
  function setCookie(name, value, days, domain) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days*24*60*60*1000);
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
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  /*** STEP 6: ADD POPUP FUNCTIONALITY (NEW) ***/
  function showPopup() {
    var iframeElem = document.getElementById("chat-iframe");
    // Do not show popup if chat is open or popup was closed before
    if (iframeElem.style.display !== "none" || localStorage.getItem("popupClosed") === "true") {
      return;
    }
    var popup = document.getElementById("chatbase-message-bubbles");
    var messageBox = document.getElementById("popup-message-box");
    var userHasVisited = getCookie("userHasVisited");
    if (!userHasVisited) {
      setCookie("userHasVisited", "true", 1, ".yourdomain.com");
      messageBox.innerHTML = "Har du brug for hjælp? Jeg kan svare på spørgsmål og anbefale fag <span id=\"funny-smiley\">😊</span>";
    } else {
      messageBox.innerHTML = "Velkommen tilbage! Har du brug for hjælp? <span id=\"funny-smiley\">😄</span>";
    }
    var charCount = messageBox.textContent.trim().length;
    if (charCount < 25) {
      popup.style.width = "380px";
    } else if (charCount < 60) {
      popup.style.width = "405px";
    } else {
      popup.style.width = "460px";
    }
    popup.style.display = "flex";

    // Blink animation after 2 seconds
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('blink');
        setTimeout(function() {
          smiley.classList.remove('blink');
        }, 1000);
      }
    }, 2000);
    // Jump animation after 12 seconds
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('jump');
        setTimeout(function() {
          smiley.classList.remove('jump');
        }, 1000);
      }
    }, 12000);
  }

  // Attach event listener to popup's close button
  var closePopupButton = document.querySelector("#chatbase-message-bubbles .close-popup");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", function() {
      document.getElementById("chatbase-message-bubbles").style.display = "none";
      localStorage.setItem("popupClosed", "true");
    });
  }
  // Show popup after 7 seconds if not already closed
  var popupClosed = localStorage.getItem("popupClosed");
  if (!popupClosed || popupClosed === "false") {
    setTimeout(showPopup, 7000);
  }

});

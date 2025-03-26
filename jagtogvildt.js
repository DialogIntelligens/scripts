<script>
  document.addEventListener('DOMContentLoaded', function() {
    
    // Toggle this to 'true' if you want to use the alternate SVG:
    var useAlternateSvg = false; 
    
    // 1) Define your two SVGs as strings:
    var originalSvg = `
      <!-- ORIGINAL SVG CODE HERE -->
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 651">
        <path d="M0 0 C1.18013672..." fill="var(--icon-color, #f7941d)"/>
        <!-- etc. your existing large path(s) ... -->
      </svg>
    `;

    var alternateSvg = `
      <!-- ALTERNATE SVG CODE HERE -->
      <!-- Put your newly attached SVG content here, but keep fill as var(--icon-color, #f7941d) or whichever color variable you want -->
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="...">
        <path d="..." fill="var(--icon-color, #f7941d)"/>
        <!-- etc. rest of new SVG path(s) ... -->
      </svg>
    `;

    function initChatbot() {
      // If already initialized, do nothing
      if (document.getElementById('chat-container')) {
        console.log("Chatbot already loaded.");
        return;
      }

      // 2) Create a container
      var widgetContainer = document.createElement('div');
      widgetContainer.id = 'my-chat-widget';
      document.body.appendChild(widgetContainer);

      // 3) Font link, etc.
      var fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;600;900&display=swap';
      document.head.appendChild(fontLink);

      // 4) Inject CSS
      var css = `
        :root {
          --icon-color: #f7941d;
        }
        #chat-container {
          position: fixed;
          bottom: 20px;
          right: 10px;
          z-index: 200;
        }
        #chat-button {
          cursor: pointer;
          background: none;
          border: none;
          position: fixed;
          z-index: 20;
          right: 10px;
          bottom: 20px;
        }
        #chat-button svg {
          width: 60px;
          height: 60px;
          transition: opacity 0.3s;
        }
        #chat-button:hover svg {
          opacity: 0.7;
          transform: scale(1.1);
        }
        /* ... keep the rest of your CSS as-is ... */
      `;
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);

      // 5) Inject HTML
      // We'll conditionally use originalSvg or alternateSvg in the #chat-button
      var chatbotHTML = `
        <div id="chat-container">
          <!-- Chat Button -->
          <button id="chat-button">
            ${ useAlternateSvg ? alternateSvg : originalSvg }
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
        <iframe
          id="chat-iframe"
          src="https://skalerbartprodukt.onrender.com"
          style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;">
        </iframe>
      `;

      document.body.insertAdjacentHTML('beforeend', chatbotHTML);

      // 6) The rest of your existing JavaScript code for cookies, show/hide logic, adjustIframeSize, etc.
      //    (unchanged except for the updated ‘chatbotHTML’ snippet above)
      //    ----------------------------------------------------------
      var isIframeEnlarged = false; 
      
      // Example: the rest of your existing code...
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
        for (var i=0; i<ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      }
      function getCurrentTimestamp() {
        return new Date().getTime();
      }
      function sendMessageToIframe() {
        var iframe = document.getElementById("chat-iframe");
        var iframeWindow = iframe.contentWindow;
        var messageData = {
          action: 'integrationOptions',
          // ... your existing data ...
        };
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
      function toggleChatWindow() {
        var iframe = document.getElementById('chat-iframe');
        var button = document.getElementById('chat-button');
        var popup = document.getElementById("chatbase-message-bubbles");
        var isCurrentlyOpen = iframe.style.display !== 'none';
        iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
        button.style.display = isCurrentlyOpen ? 'block' : 'none';
        localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
        if (!isCurrentlyOpen) {
          popup.style.display = "none";
          localStorage.setItem("popupClosed", "true");
        }
        adjustIframeSize();
        if (!isCurrentlyOpen) {
          setTimeout(function() {
            iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
          }, 100);
        }
      }
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
          messageBox.innerHTML = `Har du brug for hjælp? Jeg kan svare på spørgsmål og produkter <span id="funny-smiley">😊</span>` ;
        } else {
          messageBox.innerHTML = `Velkommen tilbage! Har du brug for hjælp? <span id="funny-smiley">😄</span>`;
        }
        var charCount = messageBox.textContent.trim().length;
        var popupElem = document.getElementById("chatbase-message-bubbles");
        if (charCount < 25) {
          popupElem.style.width = "380px";
        } else if (charCount < 60) {
          popupElem.style.width = "405px";
        } else {
          popupElem.style.width = "460px";
        }
        popup.style.display = "flex";
        setTimeout(function() {
          var smiley = document.getElementById('funny-smiley');
          if (smiley && popup.style.display === "flex") {
            smiley.classList.add('blink');
            setTimeout(function() {
              smiley.classList.remove('blink');
            }, 1000);
          }
        }, 2000);
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
        sendMessageToIframe();
      }
      adjustIframeSize();
      window.addEventListener('resize', adjustIframeSize);
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
      document.getElementById("chat-button").addEventListener("click", toggleChatWindow);
    } // end of initChatbot

    // Attempt to load the chatbot
    initChatbot();

    // After 5 seconds, re-check if container was loaded
    setTimeout(function() {
      if (!document.getElementById('chat-container')) {
        console.log("Chatbot not loaded after 5 seconds, retrying...");
        initChatbot();
      }
    }, 5000);

  });
</script>

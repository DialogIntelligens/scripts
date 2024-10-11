// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Inject CSS into the head
    var css = `
      /* Container for chat button and speech balloon */
      #chat-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 401;
      }

      /* Chat button styles */
      #chat-button {
        cursor: pointer;
        background: none;
        border: none;
      }

      #chat-button img {
        width: 60px;
        height: 60px;
        transition: opacity 0.3s;
      }

      #chat-button:hover img {
        opacity: 0.5;
        transform: scale(1.1);
      }

      /* Speech balloon styles */
      #speech-balloon {
        display: none;
        position: absolute;
        bottom: 70px; /* Adjust this value to position the balloon above the chat button */
        right: 0;
        width: 220px;
        height: 95px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 1500;
      }

      /* Close button styles */
      #close-balloon {
        position: absolute;
        top: -4px;
        right: -5px;
        background-color: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
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
      <div id="chat-container">
        <button id="chat-button">
          <img src="https://dialogintelligens.dk/wp-content/uploads/2024/06/chatIcon.png" alt="Chat with us">
        </button>
        
        <!-- Speech Balloon GIF with Close Button -->
        <div id="speech-balloon">
          <button id="close-balloon">&times;</button>
        </div>
      </div>
      
      <iframe id="chat-iframe" src="https://bodylab.onrender.com" style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;"></iframe>
    `;

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

    // --- Added Speech Balloon Functionality Below ---

    // Array of GIF URLs
    var gifUrls = [
        'https://dialogintelligens.dk/wp-content/uploads/2024/10/Hjaelp-stong.gif',
        'https://dialogintelligens.dk/wp-content/uploads/2024/10/produktanbefaldning.gif',
        'https://dialogintelligens.dk/wp-content/uploads/2024/10/kostplan.gif'
        // Add new GIF URLs here
    ];

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

    function manageSpeechBalloon() {
        var hasClosedBalloon = getCookie("hasClosedBalloon");
        if (hasClosedBalloon) {
            document.getElementById('speech-balloon').style.display = 'none';
            return;
        }
    
        var nextShowTime = getCookie("nextSpeechBalloonShowTime");
        var now = new Date().getTime();
        var delay = 0;
    
        if (nextShowTime && parseInt(nextShowTime) > now) {
            delay = parseInt(nextShowTime) - now;
        }
    
        setTimeout(function showBalloon() {
            // Get current GIF index from cookie
            var gifIndex = parseInt(getCookie("gifIndex")) || 0;
            // Get the GIF URL at the current index
            var gifUrl = gifUrls[gifIndex];
            // Set the background-image style
            document.getElementById('speech-balloon').style.backgroundImage = 'url(' + gifUrl + ')';
    
            document.getElementById("speech-balloon").style.display = "block";
    
            // Increment the index, wrapping around
            gifIndex = (gifIndex + 1) % gifUrls.length;
            // Save the updated index in cookie
            var domain = window.location.hostname;
            var domainParts = domain.split(".");
            if (domainParts.length > 2) {
                domain = "." + domainParts.slice(-2).join(".");
            } else {
                domain = "." + domain;
            }
            setCookie("gifIndex", gifIndex, 1, domain);
    
            setTimeout(function hideBalloon() {
                document.getElementById("speech-balloon").style.display = "none";
                var nextTime = new Date().getTime() + 10000;
                setCookie("nextSpeechBalloonShowTime", nextTime, 1, domain);
                setTimeout(showBalloon, 10000);
            }, 10000);
        }, delay || 20000);
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

    // --- End of Added Speech Balloon Functionality ---

    // Initial load and resize adjustments
    adjustIframeSize();
    window.addEventListener('resize', adjustIframeSize);

    // Initialize the chat window state
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

    // Attach event listener to the chat button
    document.getElementById('chat-button').addEventListener('click', toggleChatWindow);

    // Start the speech balloon management when the page loads
    manageSpeechBalloon();
});

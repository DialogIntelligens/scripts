// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Inject CSS into the head
    var css = `
      #chat-button:hover {
        opacity: 0.4;
        transform: scale(1.1);
      }
    `;

    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Inject HTML into the body
    var chatbotHTML = `
      <button id="chat-button" style="cursor: pointer; position: fixed; bottom: 30px; right: 30px; background: none; border: none; z-index: 401;">
        <img src="https://dialogintelligens.dk/wp-content/uploads/2024/06/chatIcon.png" alt="Chat with us" style="width: 60px; height: 60px; transition: opacity 0.3s;">
      </button>
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
            headerTitleG: "Bodylab AI",
            titleG: "Bodylab AI",
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
        if (event.source !== iframeWindow) {
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
});

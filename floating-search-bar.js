/**
 * Floating Search Bar Snippet
 *
 * Creates a floating search bar in the bottom middle of the screen
 * When user types a question and clicks send, it opens the chatbot and sends the question
 *
 * Usage: Include this script after the universal-chatbot.js script
 * <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"></script>
 * <script src="floating-search-bar.js"></script>
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    placeholder: "Ask me anything...",
    sendIconColor: "#007bff",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#e0e0e0",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "25px",
    width: "400px",
    maxWidth: "90vw",
    bottom: "20px",
    zIndex: "9999"
  };

  // Create the search bar container
  function createSearchBar() {
    const container = document.createElement('div');
    container.id = 'floating-search-container';
    container.style.cssText = `
      position: fixed;
      bottom: ${CONFIG.bottom};
      left: 50%;
      transform: translateX(-50%);
      width: ${CONFIG.width};
      max-width: ${CONFIG.maxWidth};
      z-index: ${CONFIG.zIndex};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create the search input container
    const searchContainer = document.createElement('div');
    searchContainer.style.cssText = `
      position: relative;
      background: ${CONFIG.backgroundColor};
      border: 1px solid ${CONFIG.borderColor};
      border-radius: ${CONFIG.borderRadius};
      box-shadow: 0 4px 12px ${CONFIG.shadowColor};
      display: flex;
      align-items: center;
      padding: 8px 16px;
      transition: all 0.3s ease;
    `;

    // Create the input field
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = CONFIG.placeholder;
    input.style.cssText = `
      flex: 1;
      border: none;
      outline: none;
      padding: 8px 12px;
      font-size: 16px;
      background: transparent;
      color: #333;
      font-family: inherit;
    `;

    // Create the send button
    const sendButton = document.createElement('button');
    sendButton.style.cssText = `
      border: none;
      background: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${CONFIG.sendIconColor};
      transition: all 0.2s ease;
      border-radius: 50%;
      width: 32px;
      height: 32px;
    `;

    // Add hover effect to send button
    sendButton.onmouseover = function() {
      this.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
      this.style.transform = 'scale(1.1)';
    };
    sendButton.onmouseout = function() {
      this.style.backgroundColor = 'transparent';
      this.style.transform = 'scale(1)';
    };

    // Create the send icon (same as the one used in the chat)
    const sendIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sendIcon.setAttribute('viewBox', '0 0 20 20');
    sendIcon.setAttribute('width', '20');
    sendIcon.setAttribute('height', '20');
    sendIcon.setAttribute('fill', 'none');
    sendIcon.style.cssText = 'transition: all 0.3s ease;';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('clip-rule', 'evenodd');
    path.setAttribute('d', 'M3.3493 4.2817L5.78124 9.142H9.28453C9.75788 9.142 10.1416 9.52572 10.1416 9.99907C10.1416 10.4724 9.75788 10.8561 9.28453 10.8561H5.78124H5.77767L3.3493 15.7164L14.6912 10.8561L16.9982 10.0026L14.6912 9.142L3.3493 4.2817ZM1.31019 2.35686C1.63873 2.01046 2.15297 1.90333 2.59222 2.0926V2.09617L18.5909 8.95273C19.0123 9.13129 19.2837 9.54554 19.2837 10.0026C19.2837 10.4597 19.0123 10.874 18.5909 11.0526L2.59222 17.9091C2.1494 18.0948 1.63873 17.9913 1.31019 17.6413C0.981643 17.2913 0.906649 16.7735 1.12092 16.345L4.29208 9.99907L1.12092 3.65318C0.906649 3.22464 0.981643 2.70326 1.31019 2.35686Z');
    path.setAttribute('fill', 'currentColor');

    sendIcon.appendChild(path);
    sendButton.appendChild(sendIcon);

    // Handle send button click
    sendButton.onclick = function() {
      const message = input.value.trim();
      if (message) {
        sendMessageToChatbot(message);
        input.value = ''; // Clear the input
      }
    };

    // Handle Enter key press
    input.onkeypress = function(e) {
      if (e.key === 'Enter') {
        const message = input.value.trim();
        if (message) {
          sendMessageToChatbot(message);
          input.value = ''; // Clear the input
        }
      }
    };

    // Assemble the elements
    searchContainer.appendChild(input);
    searchContainer.appendChild(sendButton);
    container.appendChild(searchContainer);

    // Add focus/blur effects
    input.onfocus = function() {
      searchContainer.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.15)';
      searchContainer.style.borderColor = CONFIG.sendIconColor;
    };

    input.onblur = function() {
      searchContainer.style.boxShadow = `0 4px 12px ${CONFIG.shadowColor}`;
      searchContainer.style.borderColor = CONFIG.borderColor;
    };

    return container;
  }

  // Function to send message to chatbot
  function sendMessageToChatbot(message) {
    // First, try to open the chatbot if it's not already open
    const chatIframe = document.getElementById('chat-iframe');
    const chatButton = document.getElementById('chat-button');

    if (chatIframe && chatButton) {
      // Check if chat is closed (iframe is hidden)
      if (chatIframe.style.display === 'none' || !chatIframe.style.display) {
        // Simulate clicking the chat button to open it
        if (typeof toggleChatWindow === 'function') {
          toggleChatWindow();
        } else {
          // Fallback: manually toggle the elements
          chatIframe.style.display = 'block';
          chatButton.style.display = 'none';
          const minimizeBtn = document.getElementById('minimize-button');
          if (minimizeBtn) minimizeBtn.style.display = 'block';
          const container = document.getElementById('chat-container');
          if (container) {
            container.classList.add('chat-open');
            container.classList.remove('minimized');
          }
        }
      }

      // Wait for the chat to open, then try to inject the message
      setTimeout(() => {
        try {
          if (chatIframe && chatIframe.contentDocument) {
            // Try to access the iframe's input field and send button
            const iframeDoc = chatIframe.contentDocument;

            // Find the input field (it might have different selectors, try common ones)
            const inputSelectors = [
              'textarea[placeholder*="spørgsmål"]',
              'textarea',
              'input[type="text"]',
              '[contenteditable="true"]',
              '.chat-input',
              '#message-input'
            ];

            let inputField = null;
            for (const selector of inputSelectors) {
              inputField = iframeDoc.querySelector(selector);
              if (inputField) break;
            }

            // Find the send button
            const sendButtonSelectors = [
              'button:has(svg)',
              '.send-button',
              'button[type="submit"]',
              '[aria-label*="Send"]'
            ];

            let sendButton = null;
            for (const selector of sendButtonSelectors) {
              sendButton = iframeDoc.querySelector(selector);
              if (sendButton) break;
            }

            if (inputField && sendButton) {
              // Set the message in the input field
              if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
                inputField.value = message;
                // Trigger input event to notify React
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
              } else if (inputField.contentEditable === 'true') {
                inputField.textContent = message;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
              }

              // Wait a bit then click the send button
              setTimeout(() => {
                sendButton.click();
              }, 100);
            } else {
              console.warn('Could not find input field or send button in iframe');
              // Fallback: try postMessage approach
              if (chatIframe.contentWindow) {
                chatIframe.contentWindow.postMessage({
                  action: 'externalMessage',
                  message: message,
                  source: 'floating-search-bar'
                }, '*');
              }
            }
          } else {
            console.warn('Cannot access iframe content (likely due to same-origin policy)');
            // Fallback: try postMessage approach
            if (chatIframe.contentWindow) {
              chatIframe.contentWindow.postMessage({
                action: 'externalMessage',
                message: message,
                source: 'floating-search-bar'
              }, '*');
            }
          }
        } catch (e) {
          console.warn('Error accessing iframe content:', e);
          // Fallback: try postMessage approach
          if (chatIframe.contentWindow) {
            chatIframe.contentWindow.postMessage({
              action: 'externalMessage',
              message: message,
              source: 'floating-search-bar'
            }, '*');
          }
        }
      }, 1000); // Increased timeout to ensure chat is fully loaded
    } else {
      console.warn('Chatbot elements not found. Make sure universal-chatbot.js is loaded first.');
    }
  }

  // Initialize the search bar when DOM is ready
  function init() {
    // Wait for the chatbot to be initialized first
    const checkChatbotReady = () => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton) {
        // Chatbot is ready, create and add the search bar
        const searchBar = createSearchBar();
        document.body.appendChild(searchBar);
      } else {
        // Chatbot not ready yet, check again in 100ms
        setTimeout(checkChatbotReady, 100);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkChatbotReady);
    } else {
      checkChatbotReady();
    }
  }

  // Start initialization
  init();

})();

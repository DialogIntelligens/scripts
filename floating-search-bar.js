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
    placeholder: "Stil et spørgsmål...",
    sendIconColor: "#636a8b",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#d0d4e0",
    shadowColor: "rgba(99, 106, 139, 0.15)",
    focusShadowColor: "rgba(99, 106, 139, 0.25)",
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

    // Create close button (similar to popup close button)
    const closeButton = document.createElement('button');
    closeButton.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      background-color: rgba(224, 224, 224, 0);
      color: black;
      border: none;
      opacity: 0;
      transform: scale(0.7);
      transition: background-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;
      z-index: 10;
      pointer-events: none;
    `;
    closeButton.innerHTML = '×';

    // Show close button on hover (desktop) or always on mobile
    searchContainer.onmouseenter = function() {
      closeButton.style.opacity = '1';
      closeButton.style.transform = 'scale(1.2)';
      closeButton.style.pointerEvents = 'auto';
    };
    searchContainer.onmouseleave = function() {
      // On mobile, keep it visible
      if (window.innerWidth >= 768) {
        closeButton.style.opacity = '0';
        closeButton.style.transform = 'scale(0.7)';
        closeButton.style.pointerEvents = 'none';
      }
    };

    // On mobile, always show close button
    if (window.innerWidth < 768) {
      closeButton.style.opacity = '1';
      closeButton.style.transform = 'scale(1)';
      closeButton.style.pointerEvents = 'auto';
      closeButton.style.backgroundColor = 'rgba(224, 224, 224, 0.8)';
    }

    // Close button hover effect
    closeButton.onmouseover = function() {
      this.style.backgroundColor = 'black';
      this.style.color = 'white';
    };
    closeButton.onmouseout = function() {
      this.style.backgroundColor = window.innerWidth < 768 ? 'rgba(224, 224, 224, 0.8)' : 'rgba(224, 224, 224, 0)';
      this.style.color = 'black';
    };

    // Handle close button click
    closeButton.onclick = function(e) {
      e.stopPropagation();
      container.style.display = 'none';
      // Remember that user closed it
      localStorage.setItem('floatingSearchBarClosed', 'true');
    };

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
      this.style.backgroundColor = 'rgba(99, 106, 139, 0.1)';
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
    searchContainer.appendChild(closeButton);
    searchContainer.appendChild(input);
    searchContainer.appendChild(sendButton);
    container.appendChild(searchContainer);

    // Add focus/blur effects
    input.onfocus = function() {
      searchContainer.style.boxShadow = `0 6px 20px ${CONFIG.focusShadowColor}`;
      searchContainer.style.borderColor = CONFIG.sendIconColor;
    };

    input.onblur = function() {
      searchContainer.style.boxShadow = `0 4px 12px ${CONFIG.shadowColor}`;
      searchContainer.style.borderColor = CONFIG.borderColor;
    };

    return container;
  }

  // Function to hide search bar with animation
  function hideSearchBar() {
    const container = document.getElementById('floating-search-container');
    if (container) {
      container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      container.style.opacity = '0';
      container.style.transform = 'translateX(-50%) translateY(20px)';
      
      setTimeout(() => {
        container.style.display = 'none';
        localStorage.setItem('floatingSearchBarClosed', 'true');
      }, 400);
    }
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

      // Hide the search bar with animation
      hideSearchBar();

      // Wait for the chat to open, then send message via postMessage
      setTimeout(() => {
        if (chatIframe && chatIframe.contentWindow) {
          console.log('📤 Sending external message to chatbot iframe:', message);
          // Send postMessage with wildcard origin since iframe can be on different domains
          chatIframe.contentWindow.postMessage({
            action: 'externalMessage',
            message: message,
            source: 'floating-search-bar'
          }, '*');
        } else {
          console.warn('Chatbot iframe contentWindow not available');
        }
      }, 1000); // Wait for chat to be fully loaded
    } else {
      console.warn('Chatbot elements not found. Make sure universal-chatbot.js is loaded first.');
    }
  }

  // Initialize the search bar when DOM is ready
  function init() {
    // Check if user has previously closed the search bar
    if (localStorage.getItem('floatingSearchBarClosed') === 'true') {
      console.log('🔍 Floating search bar was closed by user, not showing');
      return;
    }

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

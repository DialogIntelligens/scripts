/**
 * Floating Search Bar Snippet (Expandable Chatbot Version)
 *
 * Creates a floating search bar in the bottom middle of the screen
 * When user types a question and clicks send, it expands into a full chatbot
 *
 * Usage: Include this script after the universal-chatbot.js script
 * <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"></script>
 * <script src="floating-search-bar.js"></script>
 */

(function() {
  'use strict';

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
    zIndex: "9999",
    expandedHeight: "600px",
    expandedWidth: "400px",
    expandedMaxWidth: "90vw",
    expandedMaxHeight: "85vh",
    animationDuration: "300ms"
  };

  let isExpanded = false;
  let chatIframe = null;
  let chatbotId = null;

  function getChatbotId() {
    if (chatbotId) return chatbotId;
    
    const scripts = document.querySelectorAll('script[src*="universal-chatbot"]');
    for (const script of scripts) {
      const src = script.getAttribute('src');
      const match = src.match(/[?&]id=([^&]+)/);
      if (match) {
        chatbotId = match[1];
        return chatbotId;
      }
    }
    return null;
  }

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
      transition: all ${CONFIG.animationDuration} cubic-bezier(0.4, 0, 0.2, 1);
    `;

    const innerContainer = document.createElement('div');
    innerContainer.id = 'floating-search-inner';
    innerContainer.style.cssText = `
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: ${CONFIG.backgroundColor};
      border: 1px solid ${CONFIG.borderColor};
      border-radius: ${CONFIG.borderRadius};
      box-shadow: 0 4px 12px ${CONFIG.shadowColor};
      transition: all ${CONFIG.animationDuration} ease;
      overflow: hidden;
    `;

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

    innerContainer.onmouseenter = function() {
      closeButton.style.opacity = '1';
      closeButton.style.transform = 'scale(1.2)';
      closeButton.style.pointerEvents = 'auto';
    };
    innerContainer.onmouseleave = function() {
      if (window.innerWidth >= 768 && !isExpanded) {
        closeButton.style.opacity = '0';
        closeButton.style.transform = 'scale(0.7)';
        closeButton.style.pointerEvents = 'none';
      }
    };

    if (window.innerWidth < 768) {
      closeButton.style.opacity = '1';
      closeButton.style.transform = 'scale(1)';
      closeButton.style.pointerEvents = 'auto';
      closeButton.style.backgroundColor = 'rgba(224, 224, 224, 0.8)';
    }

    closeButton.onmouseover = function() {
      this.style.backgroundColor = 'black';
      this.style.color = 'white';
    };
    closeButton.onmouseout = function() {
      this.style.backgroundColor = window.innerWidth < 768 ? 'rgba(224, 224, 224, 0.8)' : 'rgba(224, 224, 224, 0)';
      this.style.color = 'black';
    };

    closeButton.onclick = function(e) {
      e.stopPropagation();
      container.style.display = 'none';
      localStorage.setItem('floatingSearchBarClosed', 'true');
    };

    const chatHeaderContainer = document.createElement('div');
    chatHeaderContainer.id = 'floating-chat-header';
    chatHeaderContainer.style.cssText = `
      display: none;
      padding: 12px 16px;
      border-bottom: 1px solid ${CONFIG.borderColor};
      background: white;
      align-items: center;
      justify-content: space-between;
      border-radius: ${CONFIG.borderRadius} ${CONFIG.borderRadius} 0 0;
    `;

    const headerTitle = document.createElement('div');
    headerTitle.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: #333;
      flex: 1;
    `;
    headerTitle.textContent = 'Chat';

    const headerButtons = document.createElement('div');
    headerButtons.style.cssText = `
      display: flex;
      gap: 8px;
    `;

    const minimizeButton = document.createElement('button');
    minimizeButton.style.cssText = `
      border: none;
      background: none;
      cursor: pointer;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${CONFIG.sendIconColor};
      transition: all 0.2s ease;
      border-radius: 4px;
      font-size: 18px;
      line-height: 1;
    `;
    minimizeButton.innerHTML = '−';
    minimizeButton.title = 'Minimér til søgefelt';
    
    minimizeButton.onmouseover = function() {
      this.style.backgroundColor = 'rgba(99, 106, 139, 0.1)';
    };
    minimizeButton.onmouseout = function() {
      this.style.backgroundColor = 'transparent';
    };
    minimizeButton.onclick = function() {
      collapseToSearchBar();
    };

    headerButtons.appendChild(minimizeButton);
    chatHeaderContainer.appendChild(headerTitle);
    chatHeaderContainer.appendChild(headerButtons);

    const chatIframeContainer = document.createElement('div');
    chatIframeContainer.id = 'floating-chat-iframe-container';
    chatIframeContainer.style.cssText = `
      display: none;
      flex: 1;
      overflow: hidden;
      background: white;
    `;

    const searchContainer = document.createElement('div');
    searchContainer.id = 'floating-search-input-container';
    searchContainer.style.cssText = `
      position: relative;
      display: flex;
      align-items: center;
      padding: 8px 16px;
      transition: all 0.3s ease;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = CONFIG.placeholder;
    input.id = 'floating-search-input';
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

    const sendButton = document.createElement('button');
    sendButton.id = 'floating-search-send-button';
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

    sendButton.onmouseover = function() {
      this.style.backgroundColor = 'rgba(99, 106, 139, 0.1)';
      this.style.transform = 'scale(1.1)';
    };
    sendButton.onmouseout = function() {
      this.style.backgroundColor = 'transparent';
      this.style.transform = 'scale(1)';
    };

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

    sendButton.onclick = function() {
      const message = input.value.trim();
      if (message) {
        expandToChatbot(message);
        input.value = '';
      }
    };

    input.onkeypress = function(e) {
      if (e.key === 'Enter') {
        const message = input.value.trim();
        if (message) {
          expandToChatbot(message);
          input.value = '';
        }
      }
    };

    input.onfocus = function() {
      innerContainer.style.boxShadow = `0 6px 20px ${CONFIG.focusShadowColor}`;
      innerContainer.style.borderColor = CONFIG.sendIconColor;
    };

    input.onblur = function() {
      innerContainer.style.boxShadow = `0 4px 12px ${CONFIG.shadowColor}`;
      innerContainer.style.borderColor = CONFIG.borderColor;
    };

    searchContainer.appendChild(input);
    searchContainer.appendChild(sendButton);

    innerContainer.appendChild(closeButton);
    innerContainer.appendChild(chatHeaderContainer);
    innerContainer.appendChild(chatIframeContainer);
    innerContainer.appendChild(searchContainer);
    container.appendChild(innerContainer);

    return container;
  }

  function expandToChatbot(initialMessage) {
    if (isExpanded) {
      if (chatIframe && chatIframe.contentWindow) {
        chatIframe.contentWindow.postMessage({
          action: 'externalMessage',
          message: initialMessage,
          source: 'floating-search-bar'
        }, '*');
      }
      return;
    }

    const container = document.getElementById('floating-search-container');
    const innerContainer = document.getElementById('floating-search-inner');
    const searchContainer = document.getElementById('floating-search-input-container');
    const chatHeaderContainer = document.getElementById('floating-chat-header');
    const chatIframeContainer = document.getElementById('floating-chat-iframe-container');
    
    if (!container || !innerContainer) return;

    isExpanded = true;

    container.style.width = CONFIG.expandedWidth;
    container.style.maxWidth = CONFIG.expandedMaxWidth;
    container.style.height = CONFIG.expandedHeight;
    container.style.maxHeight = CONFIG.expandedMaxHeight;
    container.style.bottom = CONFIG.bottom;

    innerContainer.style.borderRadius = '12px';

    searchContainer.style.display = 'none';
    chatHeaderContainer.style.display = 'flex';
    chatIframeContainer.style.display = 'block';

    if (!chatIframe) {
      const id = getChatbotId();
      if (!id) {
        console.error('Could not find chatbot ID');
        return;
      }

      chatIframe = document.createElement('iframe');
      chatIframe.id = 'floating-chatbot-iframe';
      chatIframe.src = `${window.location.origin}/chatbot?id=${id}`;
      chatIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        background: white;
      `;
      chatIframeContainer.appendChild(chatIframe);

      chatIframe.onload = function() {
        setTimeout(() => {
          if (chatIframe && chatIframe.contentWindow) {
            console.log('📤 Sending initial message to expanded chatbot:', initialMessage);
            chatIframe.contentWindow.postMessage({
              action: 'externalMessage',
              message: initialMessage,
              source: 'floating-search-bar'
            }, '*');
          }
        }, 1000);
      };
    } else {
      if (chatIframe.contentWindow) {
        chatIframe.contentWindow.postMessage({
          action: 'externalMessage',
          message: initialMessage,
          source: 'floating-search-bar'
        }, '*');
      }
    }

    localStorage.setItem('floatingSearchBarExpanded', 'true');
  }

  function collapseToSearchBar() {
    if (!isExpanded) return;

    const container = document.getElementById('floating-search-container');
    const innerContainer = document.getElementById('floating-search-inner');
    const searchContainer = document.getElementById('floating-search-input-container');
    const chatHeaderContainer = document.getElementById('floating-chat-header');
    const chatIframeContainer = document.getElementById('floating-chat-iframe-container');
    
    if (!container || !innerContainer) return;

    isExpanded = false;

    container.style.width = CONFIG.width;
    container.style.maxWidth = CONFIG.maxWidth;
    container.style.height = 'auto';
    container.style.maxHeight = 'none';

    innerContainer.style.borderRadius = CONFIG.borderRadius;

    chatHeaderContainer.style.display = 'none';
    chatIframeContainer.style.display = 'none';
    searchContainer.style.display = 'flex';

    localStorage.setItem('floatingSearchBarExpanded', 'false');
  }

  function init() {
    if (localStorage.getItem('floatingSearchBarClosed') === 'true') {
      console.log('🔍 Floating search bar was closed by user, not showing');
      return;
    }

    const checkChatbotReady = () => {
      const existingChatButton = document.getElementById('chat-button');
      if (existingChatButton) {
        existingChatButton.style.display = 'none';
        
        const existingMinimizeBtn = document.getElementById('minimize-button');
        if (existingMinimizeBtn) {
          existingMinimizeBtn.style.display = 'none';
        }
        
        const existingIframe = document.getElementById('chat-iframe');
        if (existingIframe) {
          existingIframe.style.display = 'none';
        }
      }

      const searchBar = createSearchBar();
      document.body.appendChild(searchBar);

      const wasExpanded = localStorage.getItem('floatingSearchBarExpanded') === 'true';
      if (wasExpanded) {
        expandToChatbot('');
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkChatbotReady);
    } else {
      checkChatbotReady();
    }
  }

  init();

})();

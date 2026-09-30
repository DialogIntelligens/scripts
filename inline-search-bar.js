/**
 * Inline Search Bar Widget
 *
 * Creates an inline search bar that can be placed anywhere on the page
 * When user types a question and clicks send, it opens the chatbot and sends the question
 *
 * Usage: 
 * 1. Include this script after the universal-chatbot.js script
 * 2. Add a container element where you want the search bar to appear:
 *    <div id="chatbot-search-widget"></div>
 * 3. The widget will automatically initialize in elements with class "chatbot-search-widget" or id "chatbot-search-widget"
 * 
 * Custom placement:
 *    <div class="chatbot-search-widget" data-placeholder="Ask us anything..."></div>
 *
 * Wrapping the search word in a fixed sentence before it is sent to the chatbot:
 *    <div class="chatbot-search-widget"
 *         data-message-template='Jeg leder efter størrelseshjælp til "{query}", kan du hjælpe mig?'></div>
 *
 * Or only add text before/after the search word:
 *    <div class="chatbot-search-widget"
 *         data-message-prefix="Jeg leder efter "
 *         data-message-suffix=" - kan du hjælpe mig?"></div>
 *
 * If none of the attributes are set, the raw search word is sent (default behavior).
 */

(function() {
  'use strict';

  // Placeholder that is replaced with whatever the user typed
  const QUERY_PLACEHOLDER = '{query}';

  // Default configuration
  const DEFAULT_CONFIG = {
    placeholder: "Stil et spørgsmål...",
    messageTemplate: "",
    messagePrefix: "",
    messageSuffix: "",
    sendIconColor: "#636a8b",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#d0d4e0",
    shadowColor: "rgba(99, 106, 139, 0.15)",
    focusShadowColor: "rgba(99, 106, 139, 0.25)",
    borderRadius: "25px",
    width: "100%",
    maxWidth: "600px"
  };

  // Read a data-attribute from the container, falling back to the config value
  function readDataAttribute(targetElement, attributeName, datasetKey, fallback) {
    const fromAttribute =
      targetElement && targetElement.getAttribute && targetElement.getAttribute(attributeName);
    if (fromAttribute !== null && fromAttribute !== undefined && fromAttribute !== '') {
      return fromAttribute;
    }

    const fromDataset =
      targetElement && targetElement.dataset && targetElement.dataset[datasetKey];
    if (fromDataset !== null && fromDataset !== undefined && fromDataset !== '') {
      return fromDataset;
    }

    return fallback;
  }

  /**
   * Build the message that is sent to the chatbot.
   *
   * - If a template is configured, every {query} placeholder is replaced with the search word.
   * - Otherwise an optional prefix/suffix is added around the search word.
   * - If nothing is configured, the raw search word is returned (backwards compatible default).
   */
  function buildMessage(query, messageOptions) {
    const template = (messageOptions && messageOptions.template) || '';

    if (template) {
      if (template.indexOf(QUERY_PLACEHOLDER) === -1) {
        console.warn(
          `Chatbot search widget: data-message-template is missing the ${QUERY_PLACEHOLDER} placeholder. Sending the raw search word instead.`
        );
        return query;
      }
      return template.split(QUERY_PLACEHOLDER).join(query);
    }

    const prefix = (messageOptions && messageOptions.prefix) || '';
    const suffix = (messageOptions && messageOptions.suffix) || '';

    if (!prefix && !suffix) {
      return query;
    }

    return `${prefix}${query}${suffix}`;
  }

  // Create the search bar widget
  function createSearchWidget(targetElement, customConfig = {}) {
    const config = { ...DEFAULT_CONFIG, ...customConfig };

    const placeholder = readDataAttribute(
      targetElement,
      'data-placeholder',
      'placeholder',
      config.placeholder
    );

    // Optional wrapping of the search word before it is sent to the chatbot
    const messageOptions = {
      template: readDataAttribute(
        targetElement,
        'data-message-template',
        'messageTemplate',
        config.messageTemplate
      ),
      prefix: readDataAttribute(
        targetElement,
        'data-message-prefix',
        'messagePrefix',
        config.messagePrefix
      ),
      suffix: readDataAttribute(
        targetElement,
        'data-message-suffix',
        'messageSuffix',
        config.messageSuffix
      )
    };

    // Create the search input container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'chatbot-search-widget-container';
    searchContainer.style.cssText = `
      position: relative;
      background: ${config.backgroundColor};
      border: 1px solid ${config.borderColor};
      border-radius: ${config.borderRadius};
      box-shadow: 0 4px 12px ${config.shadowColor};
      display: flex;
      align-items: center;
      padding: 8px 16px;
      transition: all 0.3s ease;
      width: ${config.width};
      max-width: ${config.maxWidth};
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('placeholder', placeholder);
    input.className = 'chatbot-search-widget-input';
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
    sendButton.className = 'chatbot-search-widget-button';
    sendButton.style.cssText = `
      border: none;
      background: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${config.sendIconColor};
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

    // Create the send icon
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
      const query = input.value.trim();
      if (query) {
        sendMessageToChatbot(buildMessage(query, messageOptions));
        input.value = '';
      }
    };

    // Handle Enter key press
    input.onkeypress = function(e) {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          sendMessageToChatbot(buildMessage(query, messageOptions));
          input.value = '';
        }
      }
    };

    // Assemble the elements
    searchContainer.appendChild(input);
    searchContainer.appendChild(sendButton);

    // Add focus/blur effects
    input.onfocus = function() {
      searchContainer.style.boxShadow = `0 6px 20px ${config.focusShadowColor}`;
      searchContainer.style.borderColor = config.sendIconColor;
    };

    input.onblur = function() {
      searchContainer.style.boxShadow = `0 4px 12px ${config.shadowColor}`;
      searchContainer.style.borderColor = config.borderColor;
    };

    // Clear the target element and append the search widget
    targetElement.innerHTML = '';
    targetElement.appendChild(searchContainer);
  }

  // Function to send message to chatbot
  function sendMessageToChatbot(message) {
    // universal-chatbot.js no longer exposes toggleChatWindow globally, and the
    // manual fallback below never assigns the iframe src — it hid the launcher and
    // showed an empty window, so the chatbot looked like it had disappeared.
    // The public API loads the src, opens the window and delivers the message.
    if (window.DialogIntelligens && typeof window.DialogIntelligens.open === 'function') {
      window.DialogIntelligens.open(message, 'inline-search-widget');
      return;
    }

    const chatIframe = document.getElementById('chat-iframe');
    const chatButton = document.getElementById('chat-button');

    if (chatIframe && chatButton) {
      // Check if chat is closed (iframe is hidden)
      if (chatIframe.style.display === 'none' || !chatIframe.style.display) {
        // Simulate clicking the chat button to open it
        if (typeof toggleChatWindow === 'function') {
          toggleChatWindow();
        } else {
          console.warn(
            'DialogIntelligens.open is unavailable and toggleChatWindow is not global. ' +
              'Load universal-chatbot.js before inline-search-bar.js.'
          );
          return;
        }
      }

      // Wait for the chat to open, then send message via postMessage
      setTimeout(() => {
        if (chatIframe && chatIframe.contentWindow) {
          console.log('📤 Sending external message to chatbot iframe:', message);
          chatIframe.contentWindow.postMessage({
            action: 'externalMessage',
            message: message,
            source: 'inline-search-widget'
          }, '*');
        } else {
          console.warn('Chatbot iframe contentWindow not available');
        }
      }, 1000);
    } else {
      console.warn('Chatbot elements not found. Make sure universal-chatbot.js is loaded first.');
    }
  }

  // Initialize all search widgets on the page
  function initWidgets() {
    const widgets = document.querySelectorAll('.chatbot-search-widget, #chatbot-search-widget');
    
    if (widgets.length === 0) {
      console.log('No chatbot search widget containers found. Add an element with class "chatbot-search-widget" or id "chatbot-search-widget"');
      return;
    }

    widgets.forEach(widget => {
      createSearchWidget(widget);
    });

  }

  // Wait for chatbot and DOM to be ready
  function init() {
    const checkReady = () => {
      const chatButton = document.getElementById('chat-button');
      if (chatButton && document.readyState === 'complete') {
        initWidgets();
      } else {
        setTimeout(checkReady, 100);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkReady);
    } else {
      checkReady();
    }
  }

  // Start initialization
  init();

  // Expose global function for manual initialization if needed
  window.initChatbotSearchWidget = function(elementIdOrClass, customConfig) {
    const element = document.querySelector(elementIdOrClass);
    if (element) {
      createSearchWidget(element, customConfig);
    } else {
      console.warn(`Element not found: ${elementIdOrClass}`);
    }
  };

})();


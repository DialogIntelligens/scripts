/**
 * Universal Chatbot Integration Script
 * 
 * Single integration script for all chatbots - loads configuration from database
 * Usage: <script src="universal-chatbot.js?id=CHATBOT_ID"></script>
 * 
 * Features:
 * - Dynamic configuration loading from backend
 * - Split test support built-in
 * - Purchase tracking support
 * - Responsive design
 * - GTM compatible
 */

(async function() {
  'use strict';

  // Extract chatbot ID from script URL parameter
  let chatbotID = null;
  try {
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const url = new URL(currentScript.src);
    chatbotID = url.searchParams.get('id');
    
    if (!chatbotID) {
      console.error('❌ Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"></script>');
      return;
    }
  } catch (error) {
    console.error('❌ Failed to extract chatbot ID from script URL:', error);
    return;
  }

  console.log(`🤖 Initializing universal chatbot: ${chatbotID}`);

  // Global variables
  let config = null;
  let isIframeEnlarged = false;
  let chatbotUserId = null;
  let hasReportedPurchase = false;

  /**
   * Load chatbot configuration from backend
   */
  async function loadChatbotConfig() {
    try {
      console.log(`📡 Loading configuration for chatbot: ${chatbotID}`);
      const response = await fetch(
        `http://localhost:3000/api/integration-config/${chatbotID}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
      }

      const configData = await response.json();
      console.log(`✅ Configuration loaded successfully`);
      return configData;
    } catch (error) {
      console.error('❌ Error loading chatbot config:', error);
      
      // Return minimal fallback configuration
      return {
        chatbotID: chatbotID,
        iframeUrl: 'http://localhost:3002/',
        themeColor: '#1a1d56',
        headerTitleG: '',
        headerSubtitleG: 'Vores virtuelle assistent er her for at hjælpe dig.',
        titleG: 'Chat Assistent',
        enableMinimizeButton: true,
        enablePopupMessage: true
      };
    }
  }

  /**
   * Get default configuration (used as fallback)
   */
  function getDefaultConfig() {
    return {
      chatbotID: chatbotID,
      iframeUrl: 'http://localhost:3002/',
      pagePath: window.location.href,
      leadGen: '%%',
      leadMail: '',
      leadField1: 'Navn',
      leadField2: 'Email',
      useThumbsRating: false,
      ratingTimerDuration: 18000,
      replaceExclamationWithPeriod: false,
      privacyLink: 'https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf',
      freshdeskEmailLabel: 'Din email:',
      freshdeskMessageLabel: 'Besked til kundeservice:',
      freshdeskImageLabel: 'Upload billede (valgfrit):',
      freshdeskChooseFileText: 'Vælg fil',
      freshdeskNoFileText: 'Ingen fil valgt',
      freshdeskSendingText: 'Sender...',
      freshdeskSubmitText: 'Send henvendelse',
      freshdeskEmailRequiredError: 'Email er påkrævet',
      freshdeskEmailInvalidError: 'Indtast venligst en gyldig email adresse',
      freshdeskFormErrorText: 'Ret venligst fejlene i formularen',
      freshdeskMessageRequiredError: 'Besked er påkrævet',
      freshdeskSubmitErrorText: 'Der opstod en fejl',
      contactConfirmationText: 'Tak for din henvendelse',
      freshdeskConfirmationText: 'Tak for din henvendelse',
      freshdeskSubjectText: 'Din henvendelse',
      inputPlaceholder: 'Skriv dit spørgsmål her...',
      ratingMessage: 'Fik du besvaret dit spørgsmål?',
      productButtonText: 'SE PRODUKT',
      productButtonColor: '',
      productButtonPadding: '',
      productImageHeightMultiplier: 1,
      headerLogoG: '',
      messageIcon: '',
      themeColor: '#1a1d56',
      aiMessageColor: '#e5eaf5',
      aiMessageTextColor: '#262641',
      headerTitleG: '',
      headerSubtitleG: 'Vores virtuelle assistent er her for at hjælpe dig.',
      subtitleLinkText: '',
      subtitleLinkUrl: '',
      fontFamily: '',
      enableLivechat: false,
      titleG: 'Chat Assistent',
      purchaseTrackingEnabled: false,
      splitTestId: null,
      isTabletView: false,
      isPhoneView: window.innerWidth < 1000
    };
  }

  /**
   * Split Test Functions
   */
  function generateVisitorKey() {
    const storageKey = `visitorKey_${chatbotID}`;
    let visitorKey = localStorage.getItem(storageKey);
    if (!visitorKey) {
      visitorKey = `visitor-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem(storageKey, visitorKey);
    }
    return visitorKey;
  }

  async function getSplitAssignmentOnce() {
    try {
      const visitorKey = generateVisitorKey();
      const resp = await fetch(`http://localhost:3000/api/split-assign?chatbot_id=${encodeURIComponent(chatbotID)}&visitor_key=${encodeURIComponent(visitorKey)}`);
      if (!resp.ok) return null;
      const data = await resp.json();
      return (data && data.enabled) ? data : null;
    } catch (e) {
      console.warn('Split test assignment failed:', e);
      return null;
    }
  }

  async function logSplitImpression(variantId) {
    try {
      const visitorKey = generateVisitorKey();
      await fetch('http://localhost:3000/api/split-impression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbot_id: chatbotID,
          variant_id: variantId,
          visitor_key: visitorKey,
          user_id: chatbotUserId
        })
      });
    } catch (e) {
      console.warn('Failed to log split impression:', e);
    }
  }

  async function fetchPopupFromBackend() {
    try {
      const visitorKey = generateVisitorKey();
      const resp = await fetch(`http://localhost:3000/api/popup-message?chatbot_id=${encodeURIComponent(chatbotID)}&visitor_key=${encodeURIComponent(visitorKey)}`);
      if (!resp.ok) return null;
      const data = await resp.json();
      return (data && data.popup_text) ? String(data.popup_text) : null;
    } catch (e) {
      console.warn('Popup fetch failed:', e);
      return null;
    }
  }

  /**
   * Initialize chatbot
   */
  async function initChatbot() {
    // Prevent multiple initializations
    if (window.chatbotInitialized) {
      return;
    }

    if (!document.body) {
      setTimeout(initChatbot, 500);
      return;
    }

    // Check URL parameter for auto-open
    const urlFlag = new URLSearchParams(window.location.search).get('chat');
    if (urlFlag === 'open') {
      localStorage.setItem('chatWindowState', 'open');
      history.replaceState(null, '', window.location.pathname);
    }

    // Check if already initialized
    if (document.getElementById('chat-container')) {
      return;
    }

    // Mark as initialized
    window.chatbotInitialized = true;

    // Load configuration from backend
    config = await loadChatbotConfig();
    
    // Merge with defaults
    config = { ...getDefaultConfig(), ...config };
    config.pagePath = window.location.href;
    config.isPhoneView = window.innerWidth < 1000;

    // Get user ID
    const userIdKey = `userId_${chatbotID}`;
    chatbotUserId = localStorage.getItem(userIdKey);
    if (!chatbotUserId) {
      chatbotUserId = `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem(userIdKey, chatbotUserId);
    }

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'my-chat-widget';
    
    requestAnimationFrame(function() {
      try {
        document.body.appendChild(widgetContainer);
      } catch (error) {
        console.error('Failed to append widget container:', error);
      }
    });

    // Load font if specified
    if (config.fontFamily) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = `https://fonts.googleapis.com/css2?family=${config.fontFamily.replace(/ /g, '+')}:wght@200;300;400;600;900&display=swap`;
      document.head.appendChild(fontLink);
    }

    // Generate and inject HTML
    const chatbotHTML = generateChatbotHTML();
    widgetContainer.innerHTML = chatbotHTML;

    // Inject CSS
    injectStyles();

    // Initialize event handlers
    initializeEventHandlers();

    // Show popup after delay
    if (config.enablePopupMessage !== false) {
      setTimeout(showPopup, 2000);
    }

    // Track chatbot open
    trackChatbotOpen();

    // Handle purchase tracking
    if (config.purchaseTrackingEnabled) {
      initializePurchaseTracking();
    }

    console.log('✅ Chatbot initialized successfully');
  }

  /**
   * Generate chatbot HTML structure
   */
  function generateChatbotHTML() {
    const themeColor = config.themeColor || '#1a1d56';
    const enableMinimize = config.enableMinimizeButton !== false;
    
    return `
      <div id="chat-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 999998; font-family: ${config.fontFamily || 'inherit'};">
        <!-- Popup Message Bubble -->
        <div id="chatbase-message-bubbles" class="message-bubble" style="display: none;">
          <button class="close-popup" aria-label="Close popup" style="background: transparent; border: none; cursor: pointer; position: absolute; right: 8px; top: 8px; font-size: 18px; color: #666;">×</button>
          <div id="popup-message-box" style="padding: 12px 28px 12px 12px; font-size: 14px; color: #333;"></div>
        </div>

        <!-- Chat Button -->
        <button id="chat-button" aria-label="Open chat" style="width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: ${themeColor}; display: flex; align-items: center; justify-content: center;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        <!-- Chat Iframe -->
        <iframe
          id="chat-iframe"
          src="${config.iframeUrl}"
          style="display: none; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
          allow="microphone; camera"
        ></iframe>

        <!-- Minimize Button (conditional) -->
        ${enableMinimize ? `
        <button id="minimize-button" class="minimize-btn" aria-label="Minimize chat" style="display: none; position: absolute; top: 10px; right: 70px; background: white; border: 2px solid ${themeColor}; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 999999;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${themeColor}" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        ` : ''}
      </div>
    `;
  }

  /**
   * Inject CSS styles
   */
  function injectStyles() {
    const themeColor = config.themeColor || '#1a1d56';
    
    const css = `
      #chat-container {
        font-family: ${config.fontFamily || 'inherit'};
      }

      .message-bubble {
        position: absolute;
        bottom: 75px;
        right: 0;
        background: white;
        padding: 12px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .message-bubble:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      }

      .message-bubble.long-message {
        max-width: 460px;
      }

      #funny-smiley {
        animation: none;
      }

      #funny-smiley.blink {
        animation: blink 0.5s;
      }

      #funny-smiley.jump {
        animation: jump 0.5s;
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }

      @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      #chat-button {
        transition: transform 0.2s ease;
      }

      #chat-button:hover {
        transform: scale(1.1);
      }

      #chat-button:active {
        transform: scale(0.95);
      }

      .minimize-btn {
        transition: all 0.2s ease;
      }

      .minimize-btn:hover {
        transform: scale(1.1);
      }

      @media (max-width: 1000px) {
        #chat-container {
          bottom: 0;
          right: 0;
        }

        #chat-iframe {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw !important;
          height: 100vh !important;
          border-radius: 0 !important;
          z-index: 999999;
        }

        .message-bubble {
          max-width: 250px;
        }
      }
    `;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  /**
   * Initialize event handlers
   */
  function initializeEventHandlers() {
    const chatButton = document.getElementById('chat-button');
    const chatIframe = document.getElementById('chat-iframe');
    const popup = document.getElementById('chatbase-message-bubbles');
    const closePopupBtn = document.querySelector('.close-popup');
    const minimizeBtn = document.getElementById('minimize-button');

    // Chat button click
    if (chatButton) {
      chatButton.addEventListener('click', toggleChatWindow);
    }

    // Popup click
    if (popup) {
      popup.addEventListener('click', function(e) {
        if (!e.target.closest('.close-popup')) {
          toggleChatWindow();
        }
      });
    }

    // Close popup button
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        popup.style.display = 'none';
        localStorage.setItem('popupClosed', 'true');
      });
    }

    // Minimize button
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', function() {
        chatIframe.style.display = 'none';
        chatButton.style.display = 'block';
        minimizeBtn.style.display = 'none';
        document.getElementById('chat-container').classList.remove('chat-open');
      });
    }

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
      if (event.origin !== config.iframeUrl.replace(/\/$/, '')) return;

      if (event.data.action === 'toggleSize') {
        isIframeEnlarged = !isIframeEnlarged;
        adjustIframeSize();
      } else if (event.data.action === 'closeChat') {
        chatIframe.style.display = 'none';
        chatButton.style.display = 'block';
        if (minimizeBtn) minimizeBtn.style.display = 'none';
      } else if (event.data.action === 'setChatbotUserId' && event.data.userId) {
        chatbotUserId = event.data.userId;
        localStorage.setItem(`userId_${chatbotID}`, chatbotUserId);
      }
    });

    // Handle window resize
    window.addEventListener('resize', adjustIframeSize);

    // Initial size adjustment
    adjustIframeSize();

    // Send configuration to iframe after load
    chatIframe.onload = function() {
      sendMessageToIframe();
    };

    // Ensure iframe loads after initialization
    setTimeout(function() {
      if (chatIframe && chatIframe.style.display === 'none') {
        sendMessageToIframe();
      }
    }, 2000);
  }

  /**
   * Toggle chat window
   */
  function toggleChatWindow() {
    const chatButton = document.getElementById('chat-button');
    const chatIframe = document.getElementById('chat-iframe');
    const popup = document.getElementById('chatbase-message-bubbles');
    const minimizeBtn = document.getElementById('minimize-button');
    const container = document.getElementById('chat-container');

    if (chatIframe.style.display === 'none' || !chatIframe.style.display) {
      // Open chat
      chatIframe.style.display = 'block';
      chatButton.style.display = 'none';
      if (popup) popup.style.display = 'none';
      if (minimizeBtn) minimizeBtn.style.display = 'block';
      if (container) container.classList.add('chat-open');
      
      adjustIframeSize();
      sendMessageToIframe();

      // Notify iframe that chat was opened
      try {
        chatIframe.contentWindow.postMessage({ action: 'chatOpened' }, config.iframeUrl);
      } catch (e) {
        // Silent error handling
      }
    } else {
      // Close chat
      chatIframe.style.display = 'none';
      chatButton.style.display = 'block';
      if (minimizeBtn) minimizeBtn.style.display = 'none';
      if (container) container.classList.remove('chat-open');
    }
  }

  /**
   * Adjust iframe size based on screen and state
   */
  function adjustIframeSize() {
    const iframe = document.getElementById('chat-iframe');
    if (!iframe) return;

    const isMobile = window.innerWidth < 1000;

    if (isMobile) {
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.borderRadius = '0';
    } else {
      if (isIframeEnlarged) {
        iframe.style.width = '500px';
        iframe.style.height = '700px';
      } else {
        iframe.style.width = '400px';
        iframe.style.height = '600px';
      }
      iframe.style.position = 'relative';
      iframe.style.top = 'auto';
      iframe.style.left = 'auto';
      iframe.style.borderRadius = '12px';
    }
  }

  /**
   * Send configuration message to iframe
   */
  async function sendMessageToIframe() {
    const iframe = document.getElementById('chat-iframe');
    if (!iframe) return;

    try {
      // Get split test assignment
      let splitTestId = null;
      const splitAssignment = await getSplitAssignmentOnce();
      if (splitAssignment && splitAssignment.variant_id) {
        splitTestId = splitAssignment.variant_id;
      }

      const messageData = {
        ...config,
        splitTestId: splitTestId,
        pagePath: window.location.href,
        isPhoneView: window.innerWidth < 1000
      };

      iframe.contentWindow.postMessage(messageData, config.iframeUrl);
    } catch (e) {
      console.warn('Failed to send message to iframe:', e);
    }
  }

  /**
   * Show popup message
   */
  async function showPopup() {
    const iframe = document.getElementById('chat-iframe');
    if (iframe && iframe.style.display !== 'none') {
      return;
    }

    if (localStorage.getItem('popupClosed') === 'true') {
      return;
    }

    const isMobile = window.innerWidth < 1000;
    if (isMobile && config.enablePopupMessage === false) {
      return;
    }

    const popup = document.getElementById('chatbase-message-bubbles');
    const messageBox = document.getElementById('popup-message-box');
    if (!popup || !messageBox) return;

    // Fetch popup text from backend with split test support
    let finalPopupText = await fetchPopupFromBackend() || 'Har du brug for hjælp?';

    // Check for split test assignment
    let splitAssignment = null;
    try {
      splitAssignment = await getSplitAssignmentOnce();
      if (splitAssignment && splitAssignment.variant && splitAssignment.variant.config && splitAssignment.variant.config.popup_text) {
        finalPopupText = splitAssignment.variant.config.popup_text;
      }
    } catch (e) {
      console.warn('Split test check failed:', e);
    }

    messageBox.innerHTML = `${finalPopupText} <span id="funny-smiley">😊</span>`;

    // Log impression if this is a split test
    if (splitAssignment && splitAssignment.variant_id) {
      logSplitImpression(splitAssignment.variant_id);
    }

    // Adjust popup width based on text length
    const charCount = messageBox.textContent.trim().length;
    popup.classList.remove('long-message');
    if (charCount > 26) {
      popup.classList.add('long-message');
    }

    popup.style.display = 'flex';

    // Animate smiley
    setTimeout(function() {
      const smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === 'flex') {
        smiley.classList.add('blink');
        setTimeout(() => smiley.classList.remove('blink'), 1000);
      }
    }, 2000);

    setTimeout(function() {
      const smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === 'flex') {
        smiley.classList.add('jump');
        setTimeout(() => smiley.classList.remove('jump'), 1000);
      }
    }, 12000);
  }

  /**
   * Track chatbot open event
   */
  function trackChatbotOpen() {
    const sessionKey = `chatbotOpened_${chatbotID}`;
    if (sessionStorage.getItem(sessionKey)) {
      return; // Already tracked in this session
    }

    if (!chatbotUserId || !chatbotID) {
      return;
    }

    fetch('http://localhost:3000/track-chatbot-open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: chatbotUserId,
        chatbot_id: chatbotID
      })
    })
    .then(resp => {
      if (resp.ok) {
        sessionStorage.setItem(sessionKey, 'true');
      }
    })
    .catch(err => {
      console.warn('Failed to track chatbot open:', err);
    });
  }

  /**
   * Purchase Tracking Functions
   */
  function initializePurchaseTracking() {
    // Check immediately and periodically
    setTimeout(checkForPurchase, 1000);
    setTimeout(checkForPurchase, 3000);
    setTimeout(checkForPurchase, 5000);
    setInterval(checkForPurchase, 15000);
  }

  function purchaseKey(userId) {
    return `purchaseReported_${userId}`;
  }

  function isCheckoutPage() {
    return window.location.href.includes('/ordre') ||
           window.location.href.includes('/order-complete/') ||
           window.location.href.includes('/thank-you/') ||
           window.location.href.includes('/order-received/') ||
           document.querySelector('.order-complete') ||
           document.querySelector('.thank-you') ||
           document.querySelector('.order-confirmation');
  }

  function extractTotalPrice() {
    let highestValue = 0;

    const priceSelectors = [
      '.total-price', '.order-total', '.cart-total', '.grand-total',
      '[data-testid="order-summary-total"]', '.order-summary-total',
      '.checkout-total', '.woocommerce-Price-amount', '.amount',
      '.product-subtotal', '.order-summary__price', '[data-price-value]'
    ];

    for (const selector of priceSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const priceText = element.textContent.trim();
        const matches = priceText.match(/\d[\d.,]*/g);
        
        if (matches) {
          for (let match of matches) {
            match = match.replace(/[^\d.,]/g, '');
            if (match.includes(',') && match.includes('.')) {
              match = match.replace(/,/g, '');
            } else if (match.includes(',')) {
              const parts = match.split(',');
              if (parts.length === 2 && parts[1].length <= 2) {
                match = match.replace(',', '.');
              } else {
                match = match.replace(/,/g, '');
              }
            }
            
            const numValue = parseFloat(match);
            if (!isNaN(numValue) && numValue > highestValue) {
              highestValue = numValue;
            }
          }
        }
      }
    }

    return highestValue > 0 ? highestValue : null;
  }

  function reportPurchase(totalPrice) {
    if (localStorage.getItem(purchaseKey(chatbotUserId))) {
      hasReportedPurchase = true;
      return;
    }

    fetch('http://localhost:3000/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: chatbotUserId,
        chatbot_id: chatbotID,
        amount: totalPrice
      })
    })
    .then(res => {
      if (res.ok) {
        hasReportedPurchase = true;
        localStorage.setItem(purchaseKey(chatbotUserId), 'true');
      }
    })
    .catch(err => {
      console.warn('Failed to report purchase:', err);
    });
  }

  function checkForPurchase() {
    if (!chatbotUserId || hasReportedPurchase) return;

    if (isCheckoutPage()) {
      const totalPrice = extractTotalPrice();
      if (totalPrice && totalPrice > 0) {
        reportPurchase(totalPrice);
      }
    }
  }

  /**
   * Enhanced GTM-compatible initialization
   */
  function initWithDebug() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initChatbot, 100);
      });
    } else {
      setTimeout(initChatbot, 100);
    }
  }

  // Try multiple initialization strategies for GTM
  if (document.readyState === 'complete') {
    initWithDebug();
  } else if (document.readyState === 'interactive') {
    initWithDebug();
  } else {
    document.addEventListener('DOMContentLoaded', initWithDebug);
  }

  // Fallback for GTM context
  setTimeout(function() {
    if (!window.chatbotInitialized) {
      initWithDebug();
    }
  }, 2000);

})();


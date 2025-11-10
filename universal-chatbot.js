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

  // Check if running in preview mode
  const isPreviewMode = window.CHATBOT_PREVIEW_MODE === true;
  
  // Extract chatbot ID from script URL parameter
  let chatbotID = null;
  try {
    // Use document.currentScript for reliable script reference
    // Fallback to scanning all script tags if currentScript is not available
    let currentScript = document.currentScript;
    
    if (!currentScript) {
      // Fallback: find script with 'universal-chatbot.js' in its src
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.includes('universal-chatbot.js')) {
          currentScript = scripts[i];
          break;
        }
      }
    }
    
    if (!currentScript || !currentScript.src) {
      console.error('❌ Could not find script reference. Make sure script is loaded correctly.');
      return;
    }
    
    const url = new URL(currentScript.src);
    chatbotID = url.searchParams.get('id');
    
    if (!chatbotID) {
      console.error('❌ Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"></script>');
      console.error('Script URL:', currentScript.src);
      return;
    }
  } catch (error) {
    console.error('❌ Failed to extract chatbot ID from script URL:', error);
    return;
  }

  if (isPreviewMode) {
    console.log(`🔍 Preview Mode: Initializing chatbot preview`);
  } else {
    console.log(`🤖 Initializing universal chatbot: ${chatbotID}`);
  }

  // Global variables
  let config = null;
  let isIframeEnlarged = false;
  let chatbotUserId = null;
  let hasReportedPurchase = false;
  let hasInteractedWithChatbot = false; // Only track purchases for users who opened the chatbot

  /**
   * Load chatbot configuration from backend
   */
  async function loadChatbotConfig() {
    // In preview mode, use the config provided by the preview window, but ensure leadFields are included
    if (isPreviewMode && window.CHATBOT_PREVIEW_CONFIG) {
      console.log('🔍 Preview Mode: Using provided configuration');

      // If preview config doesn't have leadFields, try to fetch from backend to get them
      if (!window.CHATBOT_PREVIEW_CONFIG.leadFields) {
        console.log('🔍 Preview Mode: Missing leadFields, fetching from backend...');
        try {
          const backendUrl = (isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.backendUrl)
            ? window.CHATBOT_PREVIEW_CONFIG.backendUrl
            : 'https://egendatabasebackend.onrender.com';

          const response = await fetch(`${backendUrl}/api/integration-config/${chatbotID}`);
      if (response.ok) {
        const backendConfig = await response.json();
        // Merge backend config with preview config
        return { ...window.CHATBOT_PREVIEW_CONFIG, ...backendConfig };
      }
        } catch (error) {
          console.warn('🔍 Preview Mode: Failed to fetch leadFields from backend:', error);
        }
      }

      return window.CHATBOT_PREVIEW_CONFIG;
    }
    
    // Get backend URL from preview config (for development dashboard) or use production URL
    const backendUrl = (isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.backendUrl) 
      ? window.CHATBOT_PREVIEW_CONFIG.backendUrl 
      : 'https://egendatabasebackend.onrender.com';
    
    try {
      console.log(`📡 Loading configuration for chatbot: ${chatbotID}`);
      const response = await fetch(
        `${backendUrl}/api/integration-config/${chatbotID}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load configuration: ${response.status} ${response.statusText}`);
      }

      const configData = await response.json();
      console.log(`✅ Configuration loaded successfully`);
      return configData;
    } catch (error) {
      console.error('❌ Error loading chatbot config:', error);
      
      // Get iframe URL from preview config (for development dashboard) or use production URL
      const iframeUrl = (isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.iframeUrl) 
        ? window.CHATBOT_PREVIEW_CONFIG.iframeUrl 
        : 'https://skalerbartprodukt.onrender.com';
      
      // Return minimal fallback configuration
      return {
        chatbotID: chatbotID,
        iframeUrl: iframeUrl,
        themeColor: '#1a1d56',
        borderRadiusMultiplier: 1.0,
        headerTitleG: '',
        headerSubtitleG: 'Vores virtuelle assistent er här for at hjælpe dig.',
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
    // Get iframe URL from preview config (for development dashboard) or use production URL
    const iframeUrl = (isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.iframeUrl) 
      ? window.CHATBOT_PREVIEW_CONFIG.iframeUrl 
      : 'https://skalerbartprodukt.onrender.com';
    
    return {
      chatbotID: chatbotID,
      iframeUrl: iframeUrl,
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
      borderRadiusMultiplier: 1.0,
      headerTitleG: '',
      headerSubtitleG: 'Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.',
      subtitleLinkText: '',
      subtitleLinkUrl: '',
      fontFamily: '',
      enableLivechat: false,
      titleG: 'Chat Assistent',
      purchaseTrackingEnabled: false,
      require_email_before_conversation: false,
      splitTestId: null,
      isTabletView: false,  // Always false to match legacy behavior
      isPhoneView: window.innerWidth < 1000,
      // CSS Positioning defaults (popup uses button positioning)
      buttonBottom: '20px',
      buttonRight: '10px'
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

  /**
   * Get backend URL for API calls (supports preview mode with local backend)
   */
  function getBackendUrl() {
    // In preview mode, use the backend URL from preview config
    if (isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.backendUrl) {
      return window.CHATBOT_PREVIEW_CONFIG.backendUrl;
    }
    // Otherwise use production URL
    return 'https://egendatabasebackend.onrender.com';
  }

  async function getSplitAssignmentOnce() {
    try {
      const visitorKey = generateVisitorKey();
      const backendUrl = getBackendUrl();
      const resp = await fetch(`${backendUrl}/api/split-assign?chatbot_id=${encodeURIComponent(chatbotID)}&visitor_key=${encodeURIComponent(visitorKey)}`);
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
      const backendUrl = getBackendUrl();
      await fetch(`${backendUrl}/api/split-impression`, {
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
      const backendUrl = getBackendUrl();
      const resp = await fetch(`${backendUrl}/api/popup-message?chatbot_id=${encodeURIComponent(chatbotID)}&visitor_key=${encodeURIComponent(visitorKey)}`);
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

    // Get user ID from localStorage (will be set by postMessage from iframe)
    const userIdKey = `userId_${chatbotID}`;
    chatbotUserId = localStorage.getItem(userIdKey) || null;
    
    // Check if user has previously interacted with the chatbot (for purchase tracking)
    const hasInteractedKey = `hasInteracted_${chatbotID}`;
    const hasInteractedStored = localStorage.getItem(hasInteractedKey);
    hasInteractedWithChatbot = hasInteractedStored === 'true';
    
    console.log('🆔 Initial userId from localStorage:', chatbotUserId || 'none (waiting for iframe)');
    console.log('🆔 Has interacted with chatbot:', hasInteractedWithChatbot);

    // Load font if specified
    if (config.fontFamily) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = `https://fonts.googleapis.com/css2?family=${config.fontFamily.replace(/ /g, '+')}:wght@200;300;400;600;900&display=swap`;
      document.head.appendChild(fontLink);
    }

    // Generate HTML with config
    const chatbotHTML = generateChatbotHTML();
    
    // GTM-safe DOM insertion - insert HTML directly into body
    function insertChatbotHTML() {
      try {
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Apply minimize button setting after DOM ready
        setTimeout(function() {
          const chatContainer = document.getElementById('chat-container');
          if (!config.enableMinimizeButton && chatContainer) {
            chatContainer.classList.add('minimize-disabled');
          }
        }, 100);
      } catch (error) {
        console.error('Failed to insert chatbot HTML:', error);
      }
    }
    
    // Try immediate insertion for GTM context
    if (document.body) {
      insertChatbotHTML();
    } else {
      // Fallback to requestAnimationFrame if body not ready
      requestAnimationFrame(function() {
        if (document.body) {
          insertChatbotHTML();
        } else {
          setTimeout(insertChatbotHTML, 100);
        }
      });
    }

    // Inject CSS AFTER HTML
    injectStyles();

    // Initialize event handlers
    initializeEventHandlers();

    // Restore chat window state on desktop (if it was open before)
    const isDesktop = window.innerWidth >= 1000;
    const savedChatState = localStorage.getItem('chatWindowState');
    
    if (isDesktop && savedChatState === 'open') {
      // Auto-open chat on desktop if it was previously open
      console.log('🔄 Restoring chat window state on desktop');
      setTimeout(function() {
        const chatButton = document.getElementById('chat-button');
        if (chatButton) {
          toggleChatWindow();
        }
      }, 500); // Small delay to ensure DOM is ready
    } else if (!isDesktop) {
      // Clear saved state on mobile/tablet to prevent auto-opening
      localStorage.removeItem('chatWindowState');
    }

    // Show popup after delay (only if chat is not being auto-opened)
    if (config.enablePopupMessage !== false && !(isDesktop && savedChatState === 'open')) {
      setTimeout(showPopup, 2000);
    }

    // Preview mode handles tracking during config update.
    if (!isPreviewMode) {
      handlePurchaseTracking();
    }

    console.log('✅ Chatbot initialized successfully');
  }

  function handlePurchaseTracking() {
    // Handle purchase tracking
    console.log('🛒 Purchase tracking check:', {
      enabled: config.purchaseTrackingEnabled,
      isCheckoutPage: isCheckoutPage(),
      userId: chatbotUserId || 'waiting for iframe...'
    });

    if (config.purchaseTrackingEnabled && isCheckoutPage()) {
      console.log('🛒 On checkout page - will check for purchase after iframe loads and sends userId...');
      // Give iframe time to load and send userId (2-6 seconds with retries)
      // The postMessage listener will update chatbotUserId when received
      setTimeout(checkForPurchase, 2000); // Wait for iframe to load
      setTimeout(checkForPurchase, 4000); // Retry in case price loads dynamically
      setTimeout(checkForPurchase, 6000); // Final retry
    } else if (config.purchaseTrackingEnabled) {
      console.log('🛒 Not checkout page.');
    } else {
      console.log('🛒 Purchase tracking disabled');
    }
  }

  /**
   * Update chat button HTML dynamically (for preview mode)
   */
  function updateChatButtonHTML() {
    const chatButton = document.getElementById('chat-button');
    if (!chatButton) return;

    // Generate new button content
    const buttonContent = config.chatButtonImageUrl
      ? `<img src="${config.chatButtonImageUrl}" alt="Chat" />`
      : `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 651">
            <path d="M0 0 C1.18013672 0.19335938 2.36027344 0.38671875 3.57617188 0.5859375 C59.5538758 10.10655486 113.52671101 33.42516318 157.42724609 69.70361328 C158.96654476 70.97242358 160.52414335 72.21892833 162.08203125 73.46484375 C170.48246311 80.31135664 178.13814279 87.92667924 185.8125 95.5625 C186.61646713 96.35856659 186.61646713 96.35856659 187.43667603 97.17071533 C194.4282304 104.10912388 200.90456545 111.24413176 207 119 C207.85759874 120.06027954 208.71557379 121.12025504 209.57421875 122.1796875 C243.74294324 165.75902188 265.49246848 216.56825559 275 271 C275.18079102 272.03382813 275.36158203 273.06765625 275.54785156 274.1328125 C280.79965418 306.12391236 280.53979773 342.07591201 275 374 C274.80664062 375.13598633 274.61328125 376.27197266 274.4140625 377.44238281 C263.53963247 439.24874978 235.2590019 496.61201036 192.3828125 542.42578125 C190.32466446 544.64925594 188.36675656 546.91531996 186.4375 549.25 C185.633125 550.1575 184.82875 551.065 184 552 C183.34 552 182.68 552 182 552 C182 552.66 182 553.32 182 554 C180.671875 555.33984375 180.671875 555.33984375 178.75 556.9375 C175.24889003 559.90091769 171.89656086 562.97488733 168.5625 566.125 C102.31951852 627.5707075 12.3232672 650.95326951 -76 648 C-85.41882655 647.59353945 -94.70187709 646.53577614 -104 645 C-105.18013672 644.80664062 -106.36027344 644.61328125 -107.57617188 644.4140625 C-184.7741212 631.28433254 -261.89597425 590.08881155 -310 527 C-310.7940625 526.03449219 -311.588125 525.06898438 -312.40625 524.07421875 C-325.77273216 507.77131255 -337.42154229 489.77313074 -347 471 C-347.61367432 469.80141357 -347.61367432 469.80141357 -348.23974609 468.57861328 C-363.35816113 438.71901813 -373.24976624 406.9207696 -379 374 C-379.27118652 372.44925781 -379.27118652 372.44925781 -379.54785156 370.8671875 C-384.79965418 338.87608764 -384.53979773 302.92408799 -379 271 C-378.80664062 269.86401367 -378.61328125 268.72802734 -378.4140625 267.55761719 C-373.76087535 241.11056741 -365.97792782 215.50596918 -355 191 C-354.57992676 190.05962891 -354.15985352 189.11925781 -353.72705078 188.15039062 C-342.14115426 162.49559862 -327.35427257 138.39713257 -309 117 C-308.21753906 116.03449219 -307.43507813 115.06898437 -306.62890625 114.07421875 C-299.87385447 105.82225862 -292.45411117 98.23904328 -284.9375 90.6875 C-284.43088837 90.17571198 -283.92427673 89.66392395 -283.40231323 89.1366272 C-276.6083393 82.28800378 -269.59514163 75.96976514 -262 70 C-261.29625244 69.43692139 -260.59250488 68.87384277 -259.86743164 68.29370117 C-187.84667734 10.91605894 -91.12983552 -15.05196565 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(382,3)"/>
            <path d="M0 0 C0.85706543 0.14985352 1.71413086 0.29970703 2.59716797 0.45410156 C17.0170868 2.98787577 30.77750998 6.55507562 44 13 C45.78664063 13.84691406 45.78664063 13.84691406 47.609375 14.7109375 C87.07502571 33.69100547 119.07180587 65.16520401 134.30859375 106.5546875 C138.9352944 119.76206443 141.53838908 132.98381376 142 147 C142.02723145 147.78149414 142.05446289 148.56298828 142.08251953 149.36816406 C143.37847843 191.86583503 126.64289485 227.83108864 98.3828125 258.875 C80.24181982 277.84308961 58.06574921 290.20862839 34 300 C33.09185547 300.37092773 32.18371094 300.74185547 31.24804688 301.12402344 C-3.93069611 315.36427475 -46.66009235 316.09851389 -83 306 C-84.32462235 305.66053702 -85.65015398 305.32460278 -86.9765625 304.9921875 C-95.63984495 302.80482715 -103.67492263 300.07073573 -111.734375 296.2265625 C-112.39695312 295.91178955 -113.05953125 295.5970166 -113.7421875 295.27270508 C-115.04829648 294.64807878 -116.35064216 294.01550037 -117.6484375 293.3737793 C-123.85344318 290.38101924 -128.12278393 289.36545867 -134.78379822 291.58804321 C-135.84794701 291.96598526 -135.84794701 291.96598526 -136.93359375 292.3515625 C-137.68858658 292.60747162 -138.44357941 292.86338074 -139.22145081 293.12704468 C-141.63134825 293.94705175 -144.03432541 294.78552001 -146.4375 295.625 C-148.01714778 296.16662131 -149.59722321 296.70699707 -151.17773438 297.24609375 C-154.2894114 298.30897685 -157.39837654 299.37929374 -160.50561523 300.45507812 C-165.92871704 302.3276149 -171.37655302 304.12298322 -176.828125 305.91064453 C-179.78869474 306.92742888 -182.67355203 308.04652931 -185.5625 309.25 C-189.0293238 310.68534608 -192.24039325 311.60425192 -196 312 C-194.89219427 305.97755272 -192.99406134 300.21763575 -191.1875 294.375 C-190.67219727 292.68697266 -190.67219727 292.68697266 -190.14648438 290.96484375 C-188.22230087 284.7193701 -186.14744249 278.56607533 -183.87719727 272.43847656 C-182.71912963 269.2192226 -181.78069506 265.98681774 -180.875 262.6875 C-179.95652158 259.35896456 -179.04686551 256.12337112 -177.8203125 252.89453125 C-176.90677616 249.67105301 -176.8933762 248.14055735 -178 245 C-179.52979046 242.81242302 -179.52979046 242.81242302 -181.5 240.6875 C-190.49063046 229.81510967 -196.3134459 216.98660623 -201.28613281 203.87792969 C-201.89813607 202.26796763 -202.53634767 200.66801075 -203.1796875 199.0703125 C-215.64398732 165.73555717 -212.04036962 127.09414809 -197.68359375 95.06298828 C-192.76044566 84.75207878 -187.27888413 74.84643409 -180 66 C-179.58782227 65.49065918 -179.17564453 64.98131836 -178.75097656 64.45654297 C-157.23696408 37.93726169 -129.07892276 16.59824284 -96 7 C-94.51829248 6.48643968 -93.03875988 5.96651621 -91.5625 5.4375 C-61.96364451 -4.2464139 -30.53405019 -5.6251629 0 0 Z " fill="#FEFEFE" transform="translate(364,171)"/>
            <path d="M0 0 C2.23673916 -0.37473011 2.23673916 -0.37473011 5.07969666 -0.3742218 C6.15512222 -0.38123611 7.23054779 -0.38825043 8.33856201 -0.39547729 C9.52355286 -0.38783356 10.7085437 -0.38018982 11.92944336 -0.37231445 C13.17337357 -0.37596512 14.41730377 -0.37961578 15.69892883 -0.38337708 C19.11645637 -0.39010858 22.53344236 -0.38334747 25.95091701 -0.37004495 C29.52363945 -0.35874731 33.09634748 -0.36283671 36.66908264 -0.36479187 C42.67063068 -0.3656755 48.67206591 -0.35458113 54.67358398 -0.33618164 C61.61502757 -0.31502254 68.55630573 -0.31150166 75.49777502 -0.3177436 C82.16985508 -0.32343649 88.84187679 -0.31779188 95.51394844 -0.30657005 C98.35559733 -0.30192207 101.19721057 -0.30105109 104.03886223 -0.3031559 C108.00635829 -0.30538757 111.97369672 -0.29093638 115.94116211 -0.2746582 C117.12412872 -0.27713562 118.30709534 -0.27961304 119.52590942 -0.28216553 C121.14327751 -0.27153831 121.14327751 -0.27153831 122.7933197 -0.26069641 C124.2011492 -0.25761711 124.2011492 -0.25761711 125.6374197 -0.25447559 C128 0 128 0 131 2 C131.30400756 4.7390485 131.41829599 7.20263633 131.375 9.9375 C131.38660156 10.66646484 131.39820313 11.39542969 131.41015625 12.14648438 C131.38094932 17.4572772 131.38094932 17.4572772 129.80051517 19.70885658 C127.3670332 21.45389838 125.77646716 21.37735585 122.7933197 21.38095093 C121.71507431 21.3894104 120.63682892 21.39786987 119.52590942 21.40658569 C118.34294281 21.400513 117.1599762 21.39444031 115.94116211 21.38818359 C114.69547958 21.39344055 113.44979706 21.39869751 112.16636658 21.40411377 C108.74897219 21.41506662 105.33212159 21.41248392 101.91475749 21.40297651 C98.34156604 21.39538848 94.76839804 21.40242298 91.19520569 21.40713501 C85.19544291 21.41259437 79.19579089 21.40539554 73.19604492 21.39111328 C66.25394891 21.3747789 59.31211711 21.38008011 52.37002748 21.3965925 C46.41412335 21.41019343 40.45829888 21.41213411 34.50238425 21.40427649 C30.94315957 21.39959321 27.38405921 21.39899308 23.82484245 21.40888596 C19.85960438 21.41913744 15.89466388 21.40494096 11.92944336 21.38818359 C10.74445251 21.39425629 9.55946167 21.40032898 8.33856201 21.40658569 C7.26313644 21.39812622 6.18771088 21.38966675 5.07969666 21.38095093 C4.14152068 21.37981985 3.20334471 21.37868877 2.23673916 21.37752342 C1.12955328 21.19064933 1.12955328 21.19064933 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(234,301)"/>
            <path d="M0 0 C2.42222595 -0.3742218 2.42222595 -0.3742218 5.50366211 -0.37231445 C6.65503159 -0.37854324 7.80640106 -0.38477203 8.99266052 -0.39118958 C10.24160599 -0.38197983 11.49055145 -0.37277008 12.77734375 -0.36328125 C14.05476944 -0.36377975 15.33219513 -0.36427826 16.64833069 -0.36479187 C19.35464344 -0.36244729 22.06017943 -0.35426448 24.76635742 -0.33618164 C28.23451479 -0.3135166 31.70223634 -0.31294556 35.17044735 -0.31969929 C38.47694563 -0.32384598 41.78336662 -0.31186453 45.08984375 -0.30078125 C46.33676498 -0.30169266 47.58368622 -0.30260406 48.86839294 -0.30354309 C50.6001754 -0.28924507 50.6001754 -0.28924507 52.36694336 -0.2746582 C53.38461288 -0.27005081 54.40228241 -0.26544342 55.45079041 -0.26069641 C58 0 58 0 61 2 C61.30400756 4.7390485 61.41829599 7.20263633 61.375 9.9375 C61.38660156 10.66646484 61.39820313 11.39542969 61.41015625 12.14648438 C61.38101687 17.44499419 61.38101687 17.44499419 59.8271637 19.70840454 C57.27876677 21.50982929 55.47369442 21.38089721 52.36694336 21.38818359 C51.21242172 21.39764008 50.05790009 21.40709656 48.86839294 21.4168396 C47.62147171 21.41076691 46.37455048 21.40469421 45.08984375 21.3984375 C43.81146133 21.40130768 42.53307892 21.40417786 41.21595764 21.40713501 C38.51141991 21.4091782 35.80769347 21.40513451 33.10327148 21.39111328 C29.63381046 21.37400378 26.16504473 21.38387422 22.69560909 21.40183067 C19.38949547 21.41526339 16.08346643 21.40586585 12.77734375 21.3984375 C10.90392555 21.40754654 10.90392555 21.40754654 8.99266052 21.4168396 C7.84129105 21.40738312 6.68992157 21.39792664 5.50366211 21.38818359 C3.97835121 21.38460342 3.97835121 21.38460342 2.42222595 21.38095093 C1.62289139 21.25523712 0.82355682 21.12952332 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #00FF00)" transform="translate(234,344)"/>
            <!-- Notification badge -->
            <g id="notification-badge" class="notification-badge">
              <circle cx="605" cy="105" r="115"/>
              <text x="605" y="105" class="notification-badge-text">1</text>
            </g>
          </svg>`;

    // Update the button inner HTML
    chatButton.innerHTML = buttonContent;
  }

  /**
   * Generate chatbot HTML structure (copied from legacy scripts to preserve exact styling)
   */
  function generateChatbotHTML() {
    // Use custom button image if provided, otherwise use default SVG
    const buttonContent = config.chatButtonImageUrl
      ? `<img src="${config.chatButtonImageUrl}" alt="Chat" />`
      : `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 651">
            <path d="M0 0 C1.18013672 0.19335938 2.36027344 0.38671875 3.57617188 0.5859375 C59.5538758 10.10655486 113.52671101 33.42516318 157.42724609 69.70361328 C158.96654476 70.97242358 160.52414335 72.21892833 162.08203125 73.46484375 C170.48246311 80.31135664 178.13814279 87.92667924 185.8125 95.5625 C186.61646713 96.35856659 186.61646713 96.35856659 187.43667603 97.17071533 C194.4282304 104.10912388 200.90456545 111.24413176 207 119 C207.85759874 120.06027954 208.71557379 121.12025504 209.57421875 122.1796875 C243.74294324 165.75902188 265.49246848 216.56825559 275 271 C275.18079102 272.03382813 275.36158203 273.06765625 275.54785156 274.1328125 C280.79965418 306.12391236 280.53979773 342.07591201 275 374 C274.80664062 375.13598633 274.61328125 376.27197266 274.4140625 377.44238281 C263.53963247 439.24874978 235.2590019 496.61201036 192.3828125 542.42578125 C190.32466446 544.64925594 188.36675656 546.91531996 186.4375 549.25 C185.633125 550.1575 184.82875 551.065 184 552 C183.34 552 182.68 552 182 552 C182 552.66 182 553.32 182 554 C180.671875 555.33984375 180.671875 555.33984375 178.75 556.9375 C175.24889003 559.90091769 171.89656086 562.97488733 168.5625 566.125 C102.31951852 627.5707075 12.3232672 650.95326951 -76 648 C-85.41882655 647.59353945 -94.70187709 646.53577614 -104 645 C-105.18013672 644.80664062 -106.36027344 644.61328125 -107.57617188 644.4140625 C-184.7741212 631.28433254 -261.89597425 590.08881155 -310 527 C-310.7940625 526.03449219 -311.588125 525.06898438 -312.40625 524.07421875 C-325.77273216 507.77131255 -337.42154229 489.77313074 -347 471 C-347.61367432 469.80141357 -347.61367432 469.80141357 -348.23974609 468.57861328 C-363.35816113 438.71901813 -373.24976624 406.9207696 -379 374 C-379.27118652 372.44925781 -379.27118652 372.44925781 -379.54785156 370.8671875 C-384.79965418 338.87608764 -384.53979773 302.92408799 -379 271 C-378.80664062 269.86401367 -378.61328125 268.72802734 -378.4140625 267.55761719 C-373.76087535 241.11056741 -365.97792782 215.50596918 -355 191 C-354.57992676 190.05962891 -354.15985352 189.11925781 -353.72705078 188.15039062 C-342.14115426 162.49559862 -327.35427257 138.39713257 -309 117 C-308.21753906 116.03449219 -307.43507813 115.06898437 -306.62890625 114.07421875 C-299.87385447 105.82225862 -292.45411117 98.23904328 -284.9375 90.6875 C-284.43088837 90.17571198 -283.92427673 89.66392395 -283.40231323 89.1366272 C-276.6083393 82.28800378 -269.59514163 75.96976514 -262 70 C-261.29625244 69.43692139 -260.59250488 68.87384277 -259.86743164 68.29370117 C-187.84667734 10.91605894 -91.12983552 -15.05196565 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(382,3)"/>
            <path d="M0 0 C0.85706543 0.14985352 1.71413086 0.29970703 2.59716797 0.45410156 C17.0170868 2.98787577 30.77750998 6.55507562 44 13 C45.78664063 13.84691406 45.78664063 13.84691406 47.609375 14.7109375 C87.07502571 33.69100547 119.07180587 65.16520401 134.30859375 106.5546875 C138.9352944 119.76206443 141.53838908 132.98381376 142 147 C142.02723145 147.78149414 142.05446289 148.56298828 142.08251953 149.36816406 C143.37847843 191.86583503 126.64289485 227.83108864 98.3828125 258.875 C80.24181982 277.84308961 58.06574921 290.20862839 34 300 C33.09185547 300.37092773 32.18371094 300.74185547 31.24804688 301.12402344 C-3.93069611 315.36427475 -46.66009235 316.09851389 -83 306 C-84.32462235 305.66053702 -85.65015398 305.32460278 -86.9765625 304.9921875 C-95.63984495 302.80482715 -103.67492263 300.07073573 -111.734375 296.2265625 C-112.39695312 295.91178955 -113.05953125 295.5970166 -113.7421875 295.27270508 C-115.04829648 294.64807878 -116.35064216 294.01550037 -117.6484375 293.3737793 C-123.85344318 290.38101924 -128.12278393 289.36545867 -134.78379822 291.58804321 C-135.84794701 291.96598526 -135.84794701 291.96598526 -136.93359375 292.3515625 C-137.68858658 292.60747162 -138.44357941 292.86338074 -139.22145081 293.12704468 C-141.63134825 293.94705175 -144.03432541 294.78552001 -146.4375 295.625 C-148.01714778 296.16662131 -149.59722321 296.70699707 -151.17773438 297.24609375 C-154.2894114 298.30897685 -157.39837654 299.37929374 -160.50561523 300.45507812 C-165.92871704 302.3276149 -171.37655302 304.12298322 -176.828125 305.91064453 C-179.78869474 306.92742888 -182.67355203 308.04652931 -185.5625 309.25 C-189.0293238 310.68534608 -192.24039325 311.60425192 -196 312 C-194.89219427 305.97755272 -192.99406134 300.21763575 -191.1875 294.375 C-190.67219727 292.68697266 -190.67219727 292.68697266 -190.14648438 290.96484375 C-188.22230087 284.7193701 -186.14744249 278.56607533 -183.87719727 272.43847656 C-182.71912963 269.2192226 -181.78069506 265.98681774 -180.875 262.6875 C-179.95652158 259.35896456 -179.04686551 256.12337112 -177.8203125 252.89453125 C-176.90677616 249.67105301 -176.8933762 248.14055735 -178 245 C-179.52979046 242.81242302 -179.52979046 242.81242302 -181.5 240.6875 C-190.49063046 229.81510967 -196.3134459 216.98660623 -201.28613281 203.87792969 C-201.89813607 202.26796763 -202.53634767 200.66801075 -203.1796875 199.0703125 C-215.64398732 165.73555717 -212.04036962 127.09414809 -197.68359375 95.06298828 C-192.76044566 84.75207878 -187.27888413 74.84643409 -180 66 C-179.58782227 65.49065918 -179.17564453 64.98131836 -178.75097656 64.45654297 C-157.23696408 37.93726169 -129.07892276 16.59824284 -96 7 C-94.51829248 6.48643968 -93.03875988 5.96651621 -91.5625 5.4375 C-61.96364451 -4.2464139 -30.53405019 -5.6251629 0 0 Z " fill="#FEFEFE" transform="translate(364,171)"/>
            <path d="M0 0 C2.23673916 -0.37473011 2.23673916 -0.37473011 5.07969666 -0.3742218 C6.15512222 -0.38123611 7.23054779 -0.38825043 8.33856201 -0.39547729 C9.52355286 -0.38783356 10.7085437 -0.38018982 11.92944336 -0.37231445 C13.17337357 -0.37596512 14.41730377 -0.37961578 15.69892883 -0.38337708 C19.11645637 -0.39010858 22.53344236 -0.38334747 25.95091701 -0.37004495 C29.52363945 -0.35874731 33.09634748 -0.36283671 36.66908264 -0.36479187 C42.67063068 -0.3656755 48.67206591 -0.35458113 54.67358398 -0.33618164 C61.61502757 -0.31502254 68.55630573 -0.31150166 75.49777502 -0.3177436 C82.16985508 -0.32343649 88.84187679 -0.31779188 95.51394844 -0.30657005 C98.35559733 -0.30192207 101.19721057 -0.30105109 104.03886223 -0.3031559 C108.00635829 -0.30538757 111.97369672 -0.29093638 115.94116211 -0.2746582 C117.12412872 -0.27713562 118.30709534 -0.27961304 119.52590942 -0.28216553 C121.14327751 -0.27153831 121.14327751 -0.27153831 122.7933197 -0.26069641 C124.2011492 -0.25761711 124.2011492 -0.25761711 125.6374197 -0.25447559 C128 0 128 0 131 2 C131.30400756 4.7390485 131.41829599 7.20263633 131.375 9.9375 C131.38660156 10.66646484 131.39820313 11.39542969 131.41015625 12.14648438 C131.38094932 17.4572772 131.38094932 17.4572772 129.80051517 19.70885658 C127.3670332 21.45389838 125.77646716 21.37735585 122.7933197 21.38095093 C121.71507431 21.3894104 120.63682892 21.39786987 119.52590942 21.40658569 C118.34294281 21.400513 117.1599762 21.39444031 115.94116211 21.38818359 C114.69547958 21.39344055 113.44979706 21.39869751 112.16636658 21.40411377 C108.74897219 21.41506662 105.33212159 21.41248392 101.91475749 21.40297651 C98.34156604 21.39538848 94.76839804 21.40242298 91.19520569 21.40713501 C85.19544291 21.41259437 79.19579089 21.40539554 73.19604492 21.39111328 C66.25394891 21.3747789 59.31211711 21.38008011 52.37002748 21.3965925 C46.41412335 21.41019343 40.45829888 21.41213411 34.50238425 21.40427649 C30.94315957 21.39959321 27.38405921 21.39899308 23.82484245 21.40888596 C19.85960438 21.41913744 15.89466388 21.40494096 11.92944336 21.38818359 C10.74445251 21.39425629 9.55946167 21.40032898 8.33856201 21.40658569 C7.26313644 21.39812622 6.18771088 21.38966675 5.07969666 21.38095093 C4.14152068 21.37981985 3.20334471 21.37868877 2.23673916 21.37752342 C1.12955328 21.19064933 1.12955328 21.19064933 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(234,301)"/>
            <path d="M0 0 C2.42222595 -0.3742218 2.42222595 -0.3742218 5.50366211 -0.37231445 C6.65503159 -0.37854324 7.80640106 -0.38477203 8.99266052 -0.39118958 C10.24160599 -0.38197983 11.49055145 -0.37277008 12.77734375 -0.36328125 C14.05476944 -0.36377975 15.33219513 -0.36427826 16.64833069 -0.36479187 C19.35464344 -0.36244729 22.06017943 -0.35426448 24.76635742 -0.33618164 C28.23451479 -0.3135166 31.70223634 -0.31294556 35.17044735 -0.31969929 C38.47694563 -0.32384598 41.78336662 -0.31186453 45.08984375 -0.30078125 C46.33676498 -0.30169266 47.58368622 -0.30260406 48.86839294 -0.30354309 C50.6001754 -0.28924507 50.6001754 -0.28924507 52.36694336 -0.2746582 C53.38461288 -0.27005081 54.40228241 -0.26544342 55.45079041 -0.26069641 C58 0 58 0 61 2 C61.30400756 4.7390485 61.41829599 7.20263633 61.375 9.9375 C61.38660156 10.66646484 61.39820313 11.39542969 61.41015625 12.14648438 C61.38101687 17.44499419 61.38101687 17.44499419 59.8271637 19.70840454 C57.27876677 21.50982929 55.47369442 21.38089721 52.36694336 21.38818359 C51.21242172 21.39764008 50.05790009 21.40709656 48.86839294 21.4168396 C47.62147171 21.41076691 46.37455048 21.40469421 45.08984375 21.3984375 C43.81146133 21.40130768 42.53307892 21.40417786 41.21595764 21.40713501 C38.51141991 21.4091782 35.80769347 21.40513451 33.10327148 21.39111328 C29.63381046 21.37400378 26.16504473 21.38387422 22.69560909 21.40183067 C19.38949547 21.41526339 16.08346643 21.40586585 12.77734375 21.3984375 C10.90392555 21.40754654 10.90392555 21.40754654 8.99266052 21.4168396 C7.84129105 21.40738312 6.68992157 21.39792664 5.50366211 21.38818359 C3.97835121 21.38460342 3.97835121 21.38460342 2.42222595 21.38095093 C1.62289139 21.25523712 0.82355682 21.12952332 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #00FF00)" transform="translate(234,344)"/>
            <!-- Notification badge -->
            <g id="notification-badge" class="notification-badge">
              <circle cx="605" cy="105" r="115"/>
              <text x="605" y="105" class="notification-badge-text">1</text>
            </g>
          </svg>`;
    
    return `
      <div id="chat-container">
        <!-- Chat Button -->
        <button id="chat-button">
          ${buttonContent}
        </button>
      
        <!-- Minimize button (shown on mobile only) -->
        <button id="minimize-button">−</button>
        
        <!-- Plus overlay (shown when minimized) -->
        <div id="plus-overlay">+</div>

        <!-- Popup -->
        <div id="chatbase-message-bubbles">
          <div class="close-popup">−</div>
          <div class="message-content">
            <div class="message-box" id="popup-message-box">
              <!-- Will be replaced dynamically -->
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Iframe -->
      <iframe
        id="chat-iframe"
        src="${config.iframeUrl || 'https://skalerbartprodukt.onrender.com'}"
        style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: calc(${config.zIndex || 190} + 39810);">
      </iframe>
    `;
  }

  /**
   * Inject CSS styles (copied from legacy scripts to preserve exact styling)
   */
  function injectStyles() {
    const themeColor = config.themeColor || '#1a1d56';
    const buttonColor = config.productButtonColor || config.themeColor || '#1a1d56';
    
    const css = `
      /* ----------------------------------------
         A) ANIMATIONS
         ---------------------------------------- */
      @keyframes blink-eye {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(0.1); }
      }
      @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      #funny-smiley.blink {
        display: inline-block;
        animation: blink-eye 0.5s ease-in-out 2;
      }
      #funny-smiley.jump {
        display: inline-block;
        animation: jump 0.5s ease-in-out 2;
      }
    
      /* ----------------------------------------
         C) CHAT BUTTON + POPUP STYLES
         ---------------------------------------- */
      #chat-container {
        position: fixed;
        bottom: 20px;
        right: 10px;
        z-index: ${config.zIndex || 190};
        transition: all 0.3s ease;
      }
      #chat-container #chat-button {
        cursor: pointer !important;
        background: none !important;
        border: none !important;
        position: fixed !important;
        z-index: calc(${config.zIndex || 190} + 10) !important;
        right: calc(${(config.buttonRight || '10px').replace(/\s*!important/g, '')} + 5px) !important;
        bottom: calc(${(config.buttonBottom || '27px').replace(/\s*!important/g, '')} + 15px) !important;
        padding: 5px !important;
        margin: 0 !important;
        min-height: unset !important;
        max-height: none !important;
        width: auto !important;
        height: auto !important;
        display: block !important;
        transition: all 0.3s ease !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
      }
      #chat-container #chat-button svg {
        width: 74px !important;
        height: 71px !important;
        display: block !important;
        transition: opacity 0.3s, transform 0.3s !important;
      }
      #chat-container #chat-button:hover svg {
        opacity: 1 !important;
        transform: scale(1.1) !important;
      }
      #chat-container #chat-button img {
        width: 74px;             /* same size as old SVG */
        height: 71px;
        border-radius: 50%;      /* makes it round */
        object-fit: cover;       /* ensures correct crop */
        transition: transform 0.3s ease, opacity 0.3s ease;
        display: block;
      }
     #chat-container #chat-button:hover img {
        transform: scale(1.1);   /* same hover zoom */
        opacity: 1;
      }     
      /* Minimize button - positioned at top right of the icon */
      #minimize-button {
        position: absolute !important;
        top: -10px !important;
        right: -5px !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
        max-width: 24px !important;
        max-height: 24px !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 50% !important;
        background: rgba(0, 0, 0, 0.6) !important;
        color: white !important;
        border: 2px solid white !important;
        font-size: 18px !important;
        font-weight: bold !important;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: calc(${config.zIndex || 190} + 9) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        transition: all 0.3s ease !important;
        line-height: 1 !important;
      }
      
      #minimize-button:hover {
        transform: scale(1.1);
        background: rgba(0, 0, 0, 0.8);
      }
      
      /* Minimized state - shrink the entire chat button */
      #chat-container.minimized #chat-button {
        transform: scale(0.55);
        transform-origin: bottom right;
        right: calc(10px + -2px) !important;
        bottom: calc(20px + -15px) !important;
      }
      
      #chat-container.minimized #minimize-button {
        display: none;
      }
      
      /* Plus overlay when minimized - greyed out and hovering over small icon */
      #plus-overlay {
        position: absolute !important;
        bottom: -4.5px !important;
        right: 10px !important;
        font-size: 15px !important;
        font-weight: bold !important;
        color: white !important;
        background: rgba(100, 100, 100, 0.7) !important;
        width: 20px !important;
        height: 20px !important;
        min-width: 20px !important;
        min-height: 20px !important;
        max-width: 20px !important;
        max-height: 20px !important;
        padding: 0 !important;
        scale: 1.15 !important;
        margin: 0 !important;
        border-radius: 50% !important;
        border: none !important;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer !important;
        z-index: calc(${config.zIndex || 190} + 20) !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.4) !important;
        transition: all 0.3s ease !important;
        line-height: 1 !important;
      }
      
      #plus-overlay:hover {
        background: rgba(80, 80, 80, 0.85) !important;
        transform: scale(1.1) !important;
      }
      
      #chat-container.minimized #plus-overlay {
        display: flex;
      }
      
      /* Show minimize button only on mobile */
      @media (max-width: 1000px) {
        #chat-container #minimize-button {
          display: flex;
        }
      }

      /* Hide minimize feature when disabled */
      #chat-container.minimize-disabled #minimize-button,
      #chat-container.minimize-disabled #plus-overlay {
        display: none !important;
      }

      /* Show chat button when chat is NOT open */
      #chat-container:not(.chat-open) #chat-button {
        display: block !important;
      }

      /* Hide chat button when chat is open */
      #chat-container.chat-open #chat-button {
        display: none !important;
      }

      /* Hide minimize elements when chat is open */
      #chat-container.chat-open #minimize-button,
      #chat-container.chat-open #plus-overlay {
        display: none !important;
      }
    
      /* Popup rise animation */
      @keyframes rise-from-bottom {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    
      /* Popup container */
      #chatbase-message-bubbles {
        position: absolute;
        bottom: calc(${(config.buttonBottom || '20px').replace(/\s*!important/g, '')} + 5px);
        right: calc(${(config.buttonRight || '10px').replace(/\s*!important/g, '')} + 45px);
        border-radius: 20px;
        font-family: 'Montserrat', sans-serif;
        font-size: 20px;
        z-index: calc(${config.zIndex || 190} + 8);
        scale: 0.58;
        cursor: pointer;
        display: none; /* hidden by default */
        flex-direction: column;
        gap: 50px;
        background-color: white;
        transform-origin: bottom right;
        max-width: 700px;
        min-width: 380px;
        box-shadow:
          0px 0.6px 0.54px -1.33px rgba(0, 0, 0, 0.15),
          0px 2.29px 2.06px -2.67px rgba(0, 0, 0, 0.13),
          0px 10px 9px -4px rgba(0, 0, 0, 0.04),
          rgba(0, 0, 0, 0.125) 0px 0.362176px 0.941657px -1px,
          rgba(0, 0, 0, 0.18) 0px 3px 7.8px -2px;
      }
      
      /* Apply animation only when animate class is present */
      #chatbase-message-bubbles.animate {
        animation: rise-from-bottom 0.6s ease-out;
      }
      
      #chatbase-message-bubbles::after {
        content: '';
        position: absolute;
        bottom: 0px;
        right: 30px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 0 20px;
        border-color: white transparent transparent transparent;
        box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px;
      }
    
      /* Close button is hidden by default; becomes visible/enlarged on hover */
      #chatbase-message-bubbles .close-popup {
        position: absolute;
        top: 8px;
        left: 8px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
        background-color: rgba(224, 224, 224, 0);
        color: black;
        opacity: 0;
        transform: scale(0.7);
        transition: background-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;
        z-index: calc(${config.zIndex || 190} + 999810);
        pointer-events: none;
      }
      #chatbase-message-bubbles:hover .close-popup {
        opacity: 1;
        transform: scale(1.2);
        pointer-events: auto;
      }
      #chatbase-message-bubbles .close-popup:hover {
        background-color: black;
        color: white;
      }
     
      @media (max-width: 1000px) {
        #chatbase-message-bubbles {
          bottom: 18px;
          right: 50px;
          bottom: calc(${(config.buttonBottom || '20px').replace(/\s*!important/g, '')} + -20px);
          right: calc(${(config.buttonRight || '10px').replace(/\s*!important/g, '')} + 25px);
          scale: 0.52;
          z-index: calc(${config.zIndex} + 7);

        }

        #chat-container #chat-button {
          z-index: calc(${config.zIndex || 190} + 8) !important;
          right: calc(${(config.buttonRight || '10px').replace(/\s*!important/g, '')} + -8px) !important;
          bottom: calc(${(config.buttonBottom || '27px').replace(/\s*!important/g, '')} + -10px) !important;
        }
        
        #chat-container #chat-button svg {
            width: 65px !important;
            height: 65px !important;
        }
        
        /* Always show close button on mobile as simple X */
        #chatbase-message-bubbles .close-popup {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
          background-color: transparent;
        }
        
        #chatbase-message-bubbles .close-popup:hover {
          background-color: transparent;
          color: black;
        }
      }
  
    
      :root {
        --icon-color: ${buttonColor};
        --badge-color: #CC2B20;
      }
   
      
      /* Notification badge styles */
      .notification-badge {
        fill: var(--badge-color);
      }
      .notification-badge-text {
        fill: white;
        font-size: 100px;
        font-weight: bold;
        text-anchor: middle;
        dominant-baseline: central;
      }
      .notification-badge.hidden {
        display: none;
      }
    
      /* The main message content area */
      #chatbase-message-bubbles .message-content {
        display: flex;
        justify-content: flex-end;
        padding: 0;
      }
      #chatbase-message-bubbles .message-box {
        background-color: white;
        color: black;
        border-radius: 10px;
        padding: 12px 45px 12px 15px;
        margin: 8px;
        font-size: 25px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        line-height: 1.3em;
        opacity: 1;
        transform: scale(1);
        transition: opacity 1s, transform 1s;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        max-width: 100%;
        text-align: center;
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

    // Safety check - ensure critical elements exist
    if (!chatButton || !chatIframe) {
      console.error('❌ Critical chatbot elements not found. Retrying in 100ms...');
      setTimeout(initializeEventHandlers, 100);
      return;
    }

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

    // Close popup button (mobile only - manually closes popup)
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        popup.style.display = 'none';
        // On mobile, closing popup dismisses it forever
        const isMobile = window.innerWidth < 1000;
        if (isMobile) {
          const popupStateKey = `popupState_${chatbotID}`;
          localStorage.setItem(popupStateKey, 'dismissed');
        }
      });
    }

    // Minimize button
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const container = document.getElementById('chat-container');
        const popup = document.getElementById('chatbase-message-bubbles');
        
        chatIframe.style.display = 'none';
        chatButton.style.display = 'block';
        minimizeBtn.style.display = 'none';
        container.classList.remove('chat-open');
        container.classList.add('minimized');
        
        // Hide popup when minimizing
        if (popup) {
          popup.style.display = 'none';
        }
        
        // Remember minimized state
        const minimizedStateKey = `chatMinimized_${chatbotID}`;
        localStorage.setItem(minimizedStateKey, 'true');
      });
    }
    
    // Plus overlay (un-minimize)
    const plusOverlay = document.getElementById('plus-overlay');
    if (plusOverlay) {
      plusOverlay.addEventListener('click', function(e) {
        e.stopPropagation();
        const container = document.getElementById('chat-container');
        container.classList.remove('minimized');
        
        // Restore minimize button visibility (remove inline style so CSS takes over)
        if (minimizeBtn) {
          minimizeBtn.style.display = '';
        }
        
        // Clear minimized state
        const minimizedStateKey = `chatMinimized_${chatbotID}`;
        localStorage.removeItem(minimizedStateKey);
        
        // Show popup again when un-minimizing (if not permanently dismissed)
        const popupStateKey = `popupState_${chatbotID}`;
        const popupState = localStorage.getItem(popupStateKey);
        if (popupState !== 'dismissed') {
          setTimeout(showPopup, 500);
        }
      });
    }
    
    // Restore minimized state on page load
    const minimizedStateKey = `chatMinimized_${chatbotID}`;
    if (localStorage.getItem(minimizedStateKey) === 'true') {
      const container = document.getElementById('chat-container');
      if (container) {
        container.classList.add('minimized');
      }
    }

    // In preview mode, listen for config updates
    if (window.CHATBOT_PREVIEW_MODE) {
      window.addEventListener('previewConfigUpdate', function(event) {
        console.log('🔄 Preview: Received config update event', event.detail);
        // Update the global config
        config = { ...config, ...event.detail };
        chatbotID = event.detail.chatbotID;

        // Regenerate button HTML if button image changed
        if (event.detail.chatButtonImageUrl !== undefined) {
          updateChatButtonHTML();
        }

        // Re-adjust iframe size with new config
        adjustIframeSize();

        // Handle purchase tracking with new config
        handlePurchaseTracking();
      });
    }

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
      if (event.origin !== config.iframeUrl.replace(/\/$/, '')) return;

      if (event.data.action === 'toggleSize') {
        isIframeEnlarged = !isIframeEnlarged;
        adjustIframeSize();
      } else if (event.data.action === 'closeChat') {
        const container = document.getElementById('chat-container');
        chatIframe.style.display = 'none';
        chatButton.style.display = 'block';
        if (minimizeBtn) minimizeBtn.style.display = 'none';
        if (container) container.classList.remove('chat-open');
        // Clear chat window state when closed via iframe
        localStorage.removeItem('chatWindowState');
      } else if (event.data.action === 'navigate' && event.data.url) {
        // Handle product button clicks - navigate to product URL
        window.location.href = event.data.url;
      } else if (event.data.action === 'setChatbotUserId' && event.data.userId) {
        // Handle userId from iframe (sent when user starts conversation)
        chatbotUserId = event.data.userId;
        hasInteractedWithChatbot = true; // Mark that user has interacted with the chatbot
        localStorage.setItem(`userId_${chatbotID}`, chatbotUserId);
        localStorage.setItem(`hasInteracted_${chatbotID}`, 'true'); // Persist interaction flag
        console.log("✅ Received chatbotUserId from iframe:", chatbotUserId);
        console.log("✅ User has interacted with chatbot, purchase tracking enabled");
      }
    });

    // Handle window resize
    window.addEventListener('resize', adjustIframeSize);

    // Initial size adjustment
    adjustIframeSize();
    
    // Force multiple resize events to ensure proper loading 100% of the time
    function triggerResizeEvents() {
      window.dispatchEvent(new Event('resize'));
    }
    
    // Trigger resize events at different intervals to catch lazy-loading elements
    setTimeout(triggerResizeEvents, 100);
    setTimeout(triggerResizeEvents, 300);
    setTimeout(triggerResizeEvents, 500);
    setTimeout(triggerResizeEvents, 800);
    setTimeout(triggerResizeEvents, 1200);

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
      if (container) {
        container.classList.add('chat-open');
        container.classList.remove('minimized');
      }
      
      // Clear minimized state when opening chat
      const minimizedStateKey = `chatMinimized_${chatbotID}`;
      localStorage.removeItem(minimizedStateKey);
      
      // Permanently dismiss popup when chatbot is opened
      const popupStateKey = `popupState_${chatbotID}`;
      localStorage.setItem(popupStateKey, 'dismissed');
      
      // Save chat window state (desktop only)
      const isDesktop = window.innerWidth >= 1000;
      if (isDesktop) {
        localStorage.setItem('chatWindowState', 'open');
      }
      
      adjustIframeSize();
      sendMessageToIframe();
      
      // Trigger resize events when opening chat to ensure proper rendering
      setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 50);
      setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 150);
      setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 300);

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
      
      // Clear chat window state when manually closed
      localStorage.removeItem('chatWindowState');
    }
  }

  /**
   * Adjust iframe size based on screen and state
   */
  function adjustIframeSize() {
    const iframe = document.getElementById('chat-iframe');
    if (!iframe) return;

    // In preview mode, use fixed sizes and don't respond to window resize
    const isPreview = window.CHATBOT_PREVIEW_MODE === true;
    
    if (isPreview) {
      // Check if this is mobile preview mode (passed from parent)
      const isMobilePreview = config && config.previewMode === 'mobile';
      
      if (isMobilePreview) {
        // Mobile preview: use 95% of preview window (responsive)
        iframe.style.width = '95vw';
        iframe.style.height = '90vh';
        iframe.style.position = 'fixed';
        iframe.style.left = '50%';
        iframe.style.top = '50%';
        iframe.style.transform = 'translate(-50%, -50%)';
        iframe.style.bottom = '';
        iframe.style.right = '';
      } else {
        // Desktop preview: fixed size (doesn't respond to preview window size)
        iframe.style.width = 'calc(375px + 6vw)';
        iframe.style.height = 'calc(450px + 20vh)';
        iframe.style.position = 'fixed';
        iframe.style.left = 'auto';
        iframe.style.top = 'auto';
        iframe.style.transform = 'none';
        iframe.style.bottom = '3vh';
        iframe.style.right = '2vw';
      }
      return;
    }
  
    // Keep 'isIframeEnlarged' logic if toggled from the iframe
    if (isIframeEnlarged) {
      // Enlarged dimensions (configurable)
      iframe.style.width = config.iframeWidthEnlarged || 'calc(2 * 45vh + 6vw)';
      iframe.style.height = config.iframeHeightEnlarged || '90vh';
    } else {
      // Default sizing:
      // For phone/tablet (< 1000px), use mobile dimensions
      // For larger screens, use desktop dimensions
      if (window.innerWidth < 1000) {
        iframe.style.width = config.iframeWidthMobile || '95vw';
        iframe.style.height = config.iframeHeightMobile || '90vh';
      } else {
        iframe.style.width = config.iframeWidthDesktop || 'calc(50vh + 8vw)';
        iframe.style.height = config.iframeHeightDesktop || '90vh';
      }
    }
  
    // Always position fixed
    iframe.style.position = 'fixed';
  
    // Center if mobile, else bottom-right
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
  
    // Re-send data to iframe in case layout changes
    sendMessageToIframe();
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
        action: 'integrationOptions', // CRITICAL: App.js requires this field to recognize the message
        ...config,
        splitTestId: splitTestId,
        pagePath: window.location.href,
        isTabletView: false,  // Always false to match legacy behavior
        isPhoneView: window.innerWidth < 1000,
        gptInterface: false
      };


      console.log('📤 Sending configuration to iframe:', {
        chatbotID: messageData.chatbotID,
        action: messageData.action,
        themeColor: messageData.themeColor,
        borderRadiusMultiplier: messageData.borderRadiusMultiplier,
        purchaseTrackingEnabled: messageData.purchaseTrackingEnabled,
        leadMail: messageData.leadMail,
        toHumanMail: messageData.toHumanMail,
        freshdeskGroupId: messageData.freshdeskGroupId
      });

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

    // Don't show popup if chat is minimized
    const minimizedStateKey = `chatMinimized_${chatbotID}`;
    if (localStorage.getItem(minimizedStateKey) === 'true') {
      return;
    }

    const isMobile = window.innerWidth < 1000;
    const popupStateKey = `popupState_${chatbotID}`;
    const pageVisitCountKey = `pageVisitCount_${chatbotID}`;
    const lastPageTimeKey = `lastPageTime_${chatbotID}`;
    
    // Get current popup state
    let popupState = localStorage.getItem(popupStateKey);
    
    // Desktop behavior: Show once and keep visible until chatbot opened
    if (!isMobile) {
      // If popup was already shown and not dismissed, just display it (no animation)
      if (popupState === 'shown') {
        displayPopupWithoutAnimation();
        return;
      }
      
      // If popup was permanently dismissed (user opened chatbot), don't show
      if (popupState === 'dismissed') {
        return;
      }
      
      // First time showing popup on desktop
      await displayPopupWithAnimation();
      localStorage.setItem(popupStateKey, 'shown');
      return;
    }
    
    // Mobile behavior: Show once after 2 page visits + 6s stay, then dismiss after 15s
    if (isMobile) {
      // Check if popup should be shown on mobile (configurable)
      if (config.popupShowOnMobile === false) {
        console.log('🔍 Popup disabled on mobile via config');
        return;
      }
      
      // If popup was permanently dismissed on mobile, don't show
      if (popupState === 'dismissed') {
        return;
      }
      
      // Track how many times popup has been shown on mobile
      const popupShowCountKey = `popupShowCount_${chatbotID}`;
      let popupShowCount = parseInt(localStorage.getItem(popupShowCountKey) || '0');
      
      // Maximum popup appearances on mobile (configurable, default 2)
      const maxDisplays = config.popupMaxDisplays || 2;
      if (popupShowCount >= maxDisplays) {
        localStorage.setItem(popupStateKey, 'dismissed');
        return;
      }
      
      // Track page visits
      let pageVisitCount = parseInt(localStorage.getItem(pageVisitCountKey) || '0');
      pageVisitCount++;
      localStorage.setItem(pageVisitCountKey, pageVisitCount.toString());
      
      // Track time on current page
      const pageLoadTime = Date.now();
      localStorage.setItem(lastPageTimeKey, pageLoadTime.toString());
      
      // Check if conditions are met: 2+ pages visited and stayed 6+ seconds
      if (pageVisitCount >= 2) {
        setTimeout(async function() {
          // Check if user is still on the page (hasn't navigated away)
          const savedLoadTime = localStorage.getItem(lastPageTimeKey);
          // Check if still not dismissed and not minimized
          const currentPopupState = localStorage.getItem(popupStateKey);
          const minimizedState = localStorage.getItem(`chatMinimized_${chatbotID}`);
          
          if (savedLoadTime === pageLoadTime.toString() && 
              currentPopupState !== 'dismissed' && 
              minimizedState !== 'true') {
            
            // Increment show count before showing
            popupShowCount++;
            localStorage.setItem(popupShowCountKey, popupShowCount.toString());
            
            // Show popup and auto-dismiss after 15 seconds
            await displayPopupWithAnimation();
            
            // Auto-dismiss after 15 seconds on mobile
            setTimeout(function() {
              const popup = document.getElementById('chatbase-message-bubbles');
              if (popup && popup.style.display === 'flex') {
                popup.style.display = 'none';
                // After showing max times, mark as permanently dismissed
                const maxDisplays = config.popupMaxDisplays || 2;
                if (popupShowCount >= maxDisplays) {
                  localStorage.setItem(popupStateKey, 'dismissed');
                }
              }
            }, 15000);
          }
        }, 6000); // Wait 6 seconds before showing
      }
    }
  }
  
  /**
   * Display popup with animation
   */
  async function displayPopupWithAnimation() {
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

    // Set popup width dynamically based on character count
    // Formula ensures text stays readable in 1-2 lines
    const charCount = messageBox.textContent.trim().length;
    const calculatedWidth = Math.max(380, Math.min(700, (charCount * 3.2) + 260));
    popup.style.width = calculatedWidth + 'px';

    // Add animation class for popup entrance
    popup.classList.add('animate');
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
   * Display popup without animation (for desktop on subsequent page loads)
   */
  async function displayPopupWithoutAnimation() {
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

    // Set popup width dynamically based on character count
    // Formula ensures text stays readable in 1-2 lines
    const charCount = messageBox.textContent.trim().length;
    const calculatedWidth = Math.max(380, Math.min(700, (charCount * 3.2) + 260));
    popup.style.width = calculatedWidth + 'px';

    popup.style.display = 'flex';
    // No animations on subsequent loads
  }

  function purchaseKey(userId) {
    return `purchaseReported_${userId}`;
  }

  function purchaseTotalPriceKey(userId) {
    return `purchaseTotalPriceKey_${userId}`;
  }

  function isConfirmationPage() {
    if (!config.checkoutConfirmationPagePatterns) {
      return false;
    }

    return matchesPagePattern(config.checkoutConfirmationPagePatterns)
  }

  function isCheckoutPage() {
    console.log('🔍 Checking if current page is checkout:', window.location.href);

    if (isPreviewMode && config.purchaseTrackingEnabled) {
      // In preview mode assume the checkout page is current page if purchase tracking is enabled
      return true;
    }

    // Use custom patterns from config if available
    if (matchesPagePattern(config.checkoutPagePatterns)) {
      return true;
    }

    // Default fallback patterns
    const defaultChecks = [
      window.location.href.includes('/checkout'),
      window.location.href.includes('/ordre'),
      window.location.href.includes('/order-complete/'),
      window.location.href.includes('/thank-you/'),
      window.location.href.includes('/order-received/'),
      !!document.querySelector('.order-complete'),
      !!document.querySelector('.thank-you'),
      !!document.querySelector('.order-confirmation')
    ];

    console.log('🔍 Default checkout checks:', defaultChecks);
    const result = defaultChecks.some(check => check);
    console.log('🔍 isCheckoutPage result:', result);
    return result;
  }

  function matchesPagePattern(pagePatterns) {
    if (pagePatterns) {
      try {
        const patterns = JSON.parse(pagePatterns);

        if (Array.isArray(patterns)) {
          return patterns.some(pattern => {
            // Support both URL substring matching and path matching
            if (pattern.startsWith('/') && pattern.endsWith('/')) {
              // Exact path match
              const path = window.location.pathname.replace(/\/$/, '');
              const result = path === pattern.replace(/\/$/, '');
              console.log(`🔍 Path match check: "${path}" === "${pattern}" ? ${result}`);
              return result;
            } else {
              // Substring match in URL
              const result = window.location.href.includes(pattern);
              console.log(`🔍 Substring match check: "${window.location.href}" includes "${pattern}" ? ${result}`);
              return result;
            }
          });
        }
      } catch (e) {
        return false;
      }
    }
  }

  // Helper function to parse price from text
  function parsePriceFromText(priceText, locale) {
    console.log(`🛒 Parsing price text: "${priceText}"`);

    // Handle Danish/European format (1.148,00 kr)
    const danishMatches = priceText.match(/(\d{1,3}(?:\.\d{3})*),(\d{2})\s*kr\.?/gi);
    const regularMatches = priceText.match(/\d[\d.,]*/g);

    console.log(`🛒 Danish matches:`, danishMatches);
    console.log(`🛒 Regular matches:`, regularMatches);

    let allMatches = [];
    if (danishMatches) allMatches = allMatches.concat(danishMatches);
    if (regularMatches) allMatches = allMatches.concat(regularMatches);

    let highestPrice = 0;

    if (allMatches && allMatches.length > 0) {
      for (const match of allMatches) {
        console.log(`🛒 Processing match: "${match}"`);
        let cleanedMatch = match;

        // Handle "kr" suffix (Danish currency)
        if (match.includes('kr')) {
          cleanedMatch = match.replace(/\s*kr\.?/gi, '').trim();

          if (cleanedMatch.includes('.') && cleanedMatch.includes(',')) {
            cleanedMatch = cleanedMatch.replace(/\./g, '').replace(',', '.');
          } else if (cleanedMatch.includes(',')) {
            cleanedMatch = cleanedMatch.replace(',', '.');
          }
        } else {
          // Locale-aware parsing
          cleanedMatch = match.replace(/[^\d.,]/g, '');

          if (cleanedMatch.includes('.') && cleanedMatch.includes(',')) {
            const lastCommaIndex = cleanedMatch.lastIndexOf(',');
            const lastPeriodIndex = cleanedMatch.lastIndexOf('.');

            if (lastPeriodIndex < lastCommaIndex && cleanedMatch.length - lastCommaIndex - 1 === 2) {
              // Danish format: 1.148,00
              cleanedMatch = cleanedMatch.replace(/\./g, '').replace(',', '.');
            } else {
              // US format: 1,148.00
              cleanedMatch = cleanedMatch.replace(/,/g, '');
            }
          } else if (cleanedMatch.includes(',')) {
            const parts = cleanedMatch.split(',');
            if (parts.length === 2 && parts[1].length <= 2) {
              cleanedMatch = cleanedMatch.replace(',', '.');
            } else {
              cleanedMatch = cleanedMatch.replace(/,/g, '');
            }
          }
        }

        console.log(`🛒 Cleaned match: "${cleanedMatch}"`);
        const numValue = parseFloat(cleanedMatch);
        console.log(`🛒 Parsed number: ${numValue}`);
        if (!isNaN(numValue) && numValue > highestPrice) {
          highestPrice = numValue;
        }
      }
    }

    return highestPrice > 0 ? highestPrice : null;
  }

  function checkForPurchase() {
    // Wait for userId from iframe (set by postMessage listener)
    if (!chatbotUserId) {
      console.log('🛒 No userId yet, waiting for iframe to send it...');
      return;
    }

    // CRITICAL: Only track purchases for users who actually interacted with the chatbot
    if (!hasInteractedWithChatbot) {
      console.log('🛒 User has not interacted with chatbot, skipping purchase tracking');
      return;
    }

    if (hasReportedPurchase) {
      console.log('🛒 Purchase already reported for user:', chatbotUserId);
      return;
    }

    if (isCheckoutPage()) {
      trackTotalPurchasePrice();
      trackPurchase();
    }

    if (isConfirmationPage()) {
      const amount = localStorage.getItem(purchaseTotalPriceKey(chatbotUserId));

      if (amount) {
        reportPurchase(amount);
      }
    }
  }

  function trackTotalPurchasePrice() {
    const { checkoutPriceSelector: basePriceSelector } = config;
    
    // PREVIEW_MODE_ONLY: If checkout price selector is set then override it to target element in preview.html with matching selector
    const checkoutPriceSelector =
      isPreviewMode && basePriceSelector
        ? "#purchase-tracking-checkout-price"
        : basePriceSelector;

    if (!checkoutPriceSelector) {
      return;
    }

    const priceElement = getSelectorElement(checkoutPriceSelector);

    if (!priceElement) {
      return;
    }

    const amount = parsePriceFromText(priceElement.textContent.trim());
    if (amount) {
      // Track amount in local storage incase confirmation page is used as tracking indicator (or any other page)
      localStorage.setItem(purchaseTotalPriceKey(chatbotUserId), amount);
    }
  }

  function trackPurchase() {
    const { checkoutPriceSelector: basePriceSelector } = config;

    const checkoutPurchaseSelectors = getCheckoutPurchaseSelectors();

    // PREVIEW_MODE_ONLY: If checkout price selector is set then override it to target element in preview.html with matching selector
    const checkoutPriceSelector =
      isPreviewMode && basePriceSelector
        ? "#purchase-tracking-checkout-price"
        : basePriceSelector;

    if (checkoutPurchaseSelectors && !checkoutPurchaseSelectors.length) {
      console.warn('⚠️ Missing purchase selector configuration');
      return;
    }

    if (!checkoutPriceSelector) {
      console.warn('⚠️ Missing price selector configuration');
      return;
    }

    const purchaseButtons = checkoutPurchaseSelectors
      .map(getSelectorElement)
      .filter(purchaseButton => !!purchaseButton);

    if (checkoutPurchaseSelectors.length !== purchaseButtons.length) {
        console.warn(`⚠️ Expected ${checkoutPurchaseSelectors.length} selectors found ${purchaseButtons.length} selectors`);
        return;
    }

    const priceElement = getSelectorElement(checkoutPriceSelector);

    if (!priceElement) {
      console.warn('⚠️ Price element not found for selector:', checkoutPriceSelector);
      return;
    }

    console.log(`✅ Tracking purchase button(s): ${checkoutPurchaseSelectors}`);
    console.log(`✅ Tracking price element: ${checkoutPriceSelector}`);

    purchaseButtons.forEach(purchaseButton => {
      purchaseButton.addEventListener("click", async () => {
          const amount = parsePriceFromText(priceElement.textContent.trim());
          console.log(`✅ Tracked purchase amount: ${amount}`);
          reportPurchase(amount);
      });
    });
  }

  function getSelectorElement(selector) {
    const cleanedSelector = selector ? selector.trim() : "";

    try {
      console.log("Searching for selector: ", cleanedSelector);
      return document.querySelector(cleanedSelector);
    } catch {
      console.warn('⚠️ Found invalid selector:', cleanedSelector);
      return null;
    }
  }

  function getCheckoutPurchaseSelectors() {
    const { checkoutPurchaseSelector: basePurchaseSelector } = config;
    
    if (isPreviewMode && basePurchaseSelector) {
      return ["#purchase-tracking-checkout-purchase", "#purchase-tracking-checkout-purchase-alternative"];
    }

    try {
      const checkoutPurchaseSelector = JSON.parse(basePurchaseSelector);

      if (!Array.isArray(checkoutPurchaseSelector)) {
        return [checkoutPurchaseSelector];
      }

      return checkoutPurchaseSelector;
    } catch {
      return [basePurchaseSelector];
    }
  }

  function reportPurchase(totalPrice) {
    if (localStorage.getItem(purchaseKey(chatbotUserId))) {
      hasReportedPurchase = true;
      console.log('🛒 Purchase already reported for user:', chatbotUserId);
      return;
    }

    const backendUrl = getBackendUrl();
    const currency = config.currency || 'DKK';
    console.log('🛒 Reporting purchase to backend:', {
      userId: chatbotUserId,
      chatbotId: chatbotID,
      amount: totalPrice,
      currency: currency,
      endpoint: `${backendUrl}/purchases`
    });

    try {
      const formData = new URLSearchParams({
        user_id: chatbotUserId,
        chatbot_id: chatbotID,
        amount: totalPrice,
        currency: currency
      });

      const success = navigator.sendBeacon(`${backendUrl}/purchases`, formData);

      if (success) {
        hasReportedPurchase = true;
        localStorage.setItem(purchaseKey(chatbotUserId), 'true');
        console.log('✅ Purchase reported successfully (queued via Beacon)');
      } else {
        console.error('❌ Failed to queue purchase beacon');
      }
    } catch (err) {
      console.error('❌ Failed to send purchase beacon:', err);
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

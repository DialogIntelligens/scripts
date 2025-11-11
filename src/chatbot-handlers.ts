import { generateVisitorKey } from "./handlers/generate-visitor-key";
import { getSplitAssignmentOnce, logSplitImpression } from "./handlers/split";
import { toggleChatWindow } from "./handlers/toggle-chat-window";
import { Context } from "./types";
import { Server } from "./utils";

export const ChatbotHandlers = {
    initializeEventHandlers
}

type UpdateConfigEvent = {
  detail: {
    chatbotID: string,
    chatButtonImageUrl: string,
  }
}

/**
 * Initialize event handlers
 */
function initializeEventHandlers({ ctx }: { ctx: Readonly<Context> }) {
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
        chatButton.addEventListener('click', () => toggleChatWindow({ ctx }));
    }

    // Popup click
    if (popup) {
        popup.addEventListener('click', function(e) {
        if (!(e.target as HTMLElement).closest('.close-popup')) {
            toggleChatWindow({ ctx });
        }
        });
    }

    // Close popup button (mobile only - manually closes popup)
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        if (popup) {
            popup.style.display = 'none';
        }

        // On mobile, closing popup dismisses it forever
        const isMobile = window.innerWidth < 1000;
        if (isMobile) {
            const popupStateKey = `popupState_${ctx.chatbotID}`;
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

        if (container) {
            container.classList.remove('chat-open');
            container.classList.add('minimized');
        }
        
        // Hide popup when minimizing
        if (popup) {
            popup.style.display = 'none';
        }
        
        // Remember minimized state
        const minimizedStateKey = `chatMinimized_${ctx.chatbotID}`;
        localStorage.setItem(minimizedStateKey, 'true');
        });
    }

    // Plus overlay (un-minimize)
    const plusOverlay = document.getElementById('plus-overlay');
    if (plusOverlay) {
        plusOverlay.addEventListener('click', function(e) {
        e.stopPropagation();
        const container = document.getElementById('chat-container');

        if (container) {
            container.classList.remove('minimized');
        }
        
        // Restore minimize button visibility (remove inline style so CSS takes over)
        if (minimizeBtn) {
            minimizeBtn.style.display = '';
        }
        
        // Clear minimized state
        const minimizedStateKey = `chatMinimized_${ctx.chatbotID}`;
        localStorage.removeItem(minimizedStateKey);
        
        // Show popup again when un-minimizing (if not permanently dismissed)
        const popupStateKey = `popupState_${ctx.chatbotID}`;
        const popupState = localStorage.getItem(popupStateKey);
        if (popupState !== 'dismissed') {
            setTimeout(showPopup, 500);
        }
        });
    }

    // Restore minimized state on page load
    const minimizedStateKey = `chatMinimized_${ctx.chatbotID}`;
    if (localStorage.getItem(minimizedStateKey) === 'true') {
        const container = document.getElementById('chat-container');
        if (container) {
        container.classList.add('minimized');
        }
    }

    // In preview mode, listen for config updates
    if (window.CHATBOT_PREVIEW_MODE) {
        window.addEventListener('previewConfigUpdate', (evt) => {
            const event = evt as unknown as UpdateConfigEvent;

            console.log('🔄 Preview: Received config update event', event.detail);
            // Update the global config
            config = { ...config, ...event.detail };
            chatbotID = event.detail.chatbotID;

            // Regenerate button HTML if button image changed
            if (event.detail.chatButtonImageUrl !== undefined) {
                updateChatButtonHTML();
            }

            // Re-adjust iframe size with new config
            adjustIframeSize({ ctx });

            // Handle purchase tracking with new config
            handlePurchaseTracking();
        });
    }

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
        if (event.origin !== ctx.config.iframeUrl?.replace(/\/$/, '')) return;

        if (event.data.action === 'toggleSize') {
            isIframeEnlarged = !isIframeEnlarged;
            adjustIframeSize({ ctx });
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
            localStorage.setItem(`userId_${ctx.chatbotID}`, ctx.chatbotUserId);
            localStorage.setItem(`hasInteracted_${ctx.chatbotID}`, 'true'); // Persist interaction flag
            console.log("✅ Received chatbotUserId from iframe:", ctx.chatbotUserId);
            console.log("✅ User has interacted with chatbot, purchase tracking enabled");
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => adjustIframeSize({ ctx }));

    // Initial size adjustment
    adjustIframeSize({ ctx });

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
        sendMessageToIframe({ ctx });
    };

    // Ensure iframe loads after initialization
    setTimeout(function() {
        if (chatIframe && chatIframe.style.display === 'none') {
            sendMessageToIframe({ ctx });
        }
    }, 2000);
}

/**
 * Adjust iframe size based on screen and state
 */
function adjustIframeSize({ ctx }: { ctx: Readonly<Context> }) {
    const { config } = ctx;

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
    if (ctx.isIframeEnlarged) {
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
    sendMessageToIframe({ ctx });
}

/**
 * Send configuration message to iframe
 */
async function sendMessageToIframe({ ctx }: { ctx: Readonly<Context> }) {
    const iframe = document.getElementById('chat-iframe') as HTMLIFrameElement;
    if (!iframe) return;

    try {
        // Get split test assignment
        let splitTestId = null;
        const splitAssignment = await getSplitAssignmentOnce({ ctx });
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

        if (ctx.config.iframeUrl) {
        iframe.contentWindow?.postMessage(messageData, ctx.config.iframeUrl);
        }
    } catch (e) {
        console.warn('Failed to send message to iframe:', e);
    }
}

/**
 * Show popup message
 */
async function showPopup({ ctx }: { ctx: Readonly<Context> }) {
    const iframe = document.getElementById('chat-iframe');
    if (iframe && iframe.style.display !== 'none') {
        return;
    }

    // Don't show popup if chat is minimized
    const minimizedStateKey = `chatMinimized_${ctx.chatbotID}`;
    if (localStorage.getItem(minimizedStateKey) === 'true') {
        return;
    }

    const isMobile = window.innerWidth < 1000;
    const popupStateKey = `popupState_${ctx.chatbotID}`;
    const pageVisitCountKey = `pageVisitCount_${ctx.chatbotID}`;
    const lastPageTimeKey = `lastPageTime_${ctx.chatbotID}`;

    // Get current popup state
    let popupState = localStorage.getItem(popupStateKey);

    // Desktop behavior: Show once and keep visible until chatbot opened
    if (!isMobile) {
        // If popup was already shown and not dismissed, just display it (no animation)
        if (popupState === 'shown') {
        displayPopupWithoutAnimation({ ctx });
        return;
        }
        
        // If popup was permanently dismissed (user opened chatbot), don't show
        if (popupState === 'dismissed') {
        return;
        }
        
        // First time showing popup on desktop
        await displayPopupWithAnimation({ ctx });
        localStorage.setItem(popupStateKey, 'shown');
        return;
    }

    // Mobile behavior: Show once after 2 page visits + 6s stay, then dismiss after 15s
    if (isMobile) {
        // Check if popup should be shown on mobile (configurable)
        if (ctx.config.popupShowOnMobile === false) {
        console.log('🔍 Popup disabled on mobile via config');
        return;
        }
        
        // If popup was permanently dismissed on mobile, don't show
        if (popupState === 'dismissed') {
        return;
        }
        
        // Track how many times popup has been shown on mobile
        const popupShowCountKey = `popupShowCount_${ctx.chatbotID}`;
        let popupShowCount = parseInt(localStorage.getItem(popupShowCountKey) || '0');
        
        // Maximum popup appearances on mobile (configurable, default 2)
        const maxDisplays = ctx.config.popupMaxDisplays || 2;
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
            const minimizedState = localStorage.getItem(`chatMinimized_${ctx.chatbotID}`);
            
            if (savedLoadTime === pageLoadTime.toString() && 
                currentPopupState !== 'dismissed' && 
                minimizedState !== 'true') {
            
            // Increment show count before showing
            popupShowCount++;
            localStorage.setItem(popupShowCountKey, popupShowCount.toString());
            
            // Show popup and auto-dismiss after 15 seconds
            await displayPopupWithAnimation({ ctx });
            
            // Auto-dismiss after 15 seconds on mobile
            setTimeout(function() {
                const popup = document.getElementById('chatbase-message-bubbles');
                if (popup && popup.style.display === 'flex') {
                popup.style.display = 'none';
                // After showing max times, mark as permanently dismissed
                const maxDisplays = ctx.config.popupMaxDisplays || 2;
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
async function displayPopupWithAnimation({ ctx }: { ctx: Readonly<Context> }) {
    const popup = document.getElementById('chatbase-message-bubbles');
    const messageBox = document.getElementById('popup-message-box');
    if (!popup || !messageBox) return;

    // Fetch popup text from backend with split test support
    let finalPopupText = await fetchPopupFromBackend({ ctx }) || 'Har du brug for hjælp?';

    // Check for split test assignment
    let splitAssignment = null;
    try {
        splitAssignment = await getSplitAssignmentOnce({ ctx });
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
async function displayPopupWithoutAnimation({ ctx }: { ctx: Readonly<Context>} ) {
    const popup = document.getElementById('chatbase-message-bubbles');
    const messageBox = document.getElementById('popup-message-box');
    if (!popup || !messageBox) return;

    // Fetch popup text from backend with split test support
    let finalPopupText = await fetchPopupFromBackend({ ctx }) || 'Har du brug for hjælp?';

    // Check for split test assignment
    let splitAssignment = null;
    try {
        splitAssignment = await getSplitAssignmentOnce({ ctx });
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

async function fetchPopupFromBackend({ ctx }: { ctx: Readonly<Context> }) {
    try {
        const visitorKey = generateVisitorKey({ ctx });
        const backendUrl = Server.getUrl({ ctx });
        const resp = await fetch(`${backendUrl}/api/popup-message?chatbot_id=${encodeURIComponent(ctx.chatbotID)}&visitor_key=${encodeURIComponent(visitorKey)}`);
        if (!resp.ok) return null;
        const data = await resp.json();
        return (data && data.popup_text) ? String(data.popup_text) : null;
    } catch (e) {
        console.warn('Popup fetch failed:', e);
        return null;
    }
}

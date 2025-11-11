import { ChatbotHandlers } from "./chatbot-handlers";
import { ChatbotHtml } from "./chatbot-html";
import { ChatbotStyles } from "./chatbot-styles";
import { Context } from "./types";

export const Chatbot = {
    initChatbot
}

/**
 * Initialize chatbot
 */
async function initChatbot({ ctx }: { ctx: Readonly<Context> }) {
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
    const chatbotHTML = ChatbotHtml.generateChatbotHTML({ ctx });
    
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
    ChatbotStyles.injectStyles({ ctx });

    // Initialize event handlers
    ChatbotHandlers.initializeEventHandlers({ ctx });

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
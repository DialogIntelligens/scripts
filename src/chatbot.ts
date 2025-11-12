import { ChatbotHandlers } from "./chatbot-handlers";
import { ChatbotHtml } from "./chatbot-html";
import { ChatbotStyles } from "./chatbot-styles";
import { removeNotificationBadgeOnClick } from "./handlers/notification-badge";
import { handlePurchaseTracking } from "./handlers/purchase-tracking";
import { showPopup } from "./handlers/show-popup";
import { toggleChatWindow } from "./handlers/toggle-chat-window";
import { GlobalStateStore } from "./state";
import { Context } from "./types";
import { Logger } from "./utils";

export const Chatbot = {
  init: initChatbot,
};

/**
 * Initialize chatbot
 */
async function initChatbot({ ctx }: { ctx: Readonly<Context> }) {
  // Prevent multiple initializations
  if (GlobalStateStore.chatbotInitialized) {
    return;
  }

  if (!document.body) {
    setTimeout(initChatbot, 500);
    return;
  }

  // Check URL parameter for auto-open
  const urlFlag = new URLSearchParams(window.location.search).get("chat");
  if (urlFlag === "open") {
    localStorage.setItem("chatWindowState", "open");
    history.replaceState(null, "", window.location.pathname);
  }

  // Check if already initialized
  if (document.getElementById("chat-container")) {
    return;
  }

  GlobalStateStore.setChatbotInitialized();

  Logger.log(
    "🆔 Initial userId from localStorage:",
    ctx.getChatbotUserId() || "none (waiting for iframe)",
  );
  Logger.log("🆔 Has interacted with chatbot:", ctx.hasInteractedWithChatbot());

  // Load font if specified
  const fontFamily = ctx.getConfig().fontFamily;
  if (fontFamily) {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}:wght@200;300;400;600;900&display=swap`;
    document.head.appendChild(fontLink);
  }

  const chatbotHTML = ChatbotHtml.generate({ ctx });

  // GTM-safe DOM insertion - insert HTML directly into body
  function insertChatbotHTML() {
    try {
      document.body.insertAdjacentHTML("beforeend", chatbotHTML);

      // Apply minimize button setting after DOM ready
      setTimeout(() => {
        const chatContainer = document.getElementById("chat-container");
        if (!ctx.getConfig().enableMinimizeButton && chatContainer) {
          chatContainer.classList.add("minimize-disabled");
        }
      }, 100);
    } catch (error) {
      Logger.error("Failed to insert chatbot HTML:", error);
    }
  }

  // Try immediate insertion for GTM context
  if (document.body) {
    insertChatbotHTML();
    removeNotificationBadgeOnClick();
  } else {
    // Fallback to requestAnimationFrame if body not ready
    requestAnimationFrame(() => {
      if (document.body) {
        insertChatbotHTML();
        removeNotificationBadgeOnClick();
      } else {
        setTimeout(insertChatbotHTML, 100);
      }
    });
  }

  // Inject CSS AFTER HTML
  ChatbotStyles.inject({ ctx });
  ChatbotHandlers.register({ ctx });

  // Restore chat window state on desktop (if it was open before)
  const isDesktop = window.innerWidth >= 1000;
  const savedChatState = localStorage.getItem("chatWindowState");

  if (isDesktop && savedChatState === "open") {
    // Auto-open chat on desktop if it was previously open
    Logger.log("🔄 Restoring chat window state on desktop");
    setTimeout(() => {
      const chatButton = document.getElementById("chat-button");
      if (chatButton) {
        toggleChatWindow({ ctx });
      }
    }, 500); // Small delay to ensure DOM is ready
  } else if (!isDesktop) {
    // Clear saved state on mobile/tablet to prevent auto-opening
    localStorage.removeItem("chatWindowState");
  }

  // Show popup after delay (only if chat is not being auto-opened)
  if (
    ctx.getConfig().enablePopupMessage !== false &&
    !(isDesktop && savedChatState === "open")
  ) {
    setTimeout(() => showPopup({ ctx }), 2000);
  }

  // Preview mode handles tracking during config update.
  if (!ctx.isPreviewMode) {
    handlePurchaseTracking({ ctx });
  }

  Logger.log("✅ Chatbot initialized successfully");
}

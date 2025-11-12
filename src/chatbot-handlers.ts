import { adjustIframeSize } from "./handlers/adjust-iframe-size";
import { sendMessageToIframe } from "./handlers/send-message-to-iframe";
import { showPopup } from "./handlers/show-popup";
import { toggleChatWindow } from "./handlers/toggle-chat-window";
import { GlobalStateStore } from "./state";
import { Context } from "./types";
import { Logger } from "./utils";

export const ChatbotHandlers = {
  register: initializeEventHandlers,
};

/**
 * Initialize event handlers
 */
function initializeEventHandlers({ ctx }: { ctx: Readonly<Context> }) {
  const chatButton = document.getElementById("chat-button");
  const chatIframe = document.getElementById("chat-iframe");
  const popup = document.getElementById("chatbase-message-bubbles");
  const closePopupBtn = document.querySelector(".close-popup");
  const minimizeBtn = document.getElementById("minimize-button");

  // Safety check - ensure critical elements exist
  if (!chatButton || !chatIframe) {
    Logger.error(
      "❌ Critical chatbot elements not found. Retrying in 100ms...",
    );
    setTimeout(initializeEventHandlers, 100);
    return;
  }

  // Chat button click
  if (chatButton) {
    chatButton.addEventListener("click", () => toggleChatWindow({ ctx }));
  }

  // Popup click
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (!(e.target as HTMLElement).closest(".close-popup")) {
        toggleChatWindow({ ctx });
      }
    });
  }

  // Close popup button (mobile only - manually closes popup)
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (popup) {
        popup.style.display = "none";
      }

      // On mobile, closing popup dismisses it forever
      const isMobile = window.innerWidth < 1000;
      if (isMobile) {
        const popupStateKey = `popupState_${ctx.getChatbotId()}`;
        localStorage.setItem(popupStateKey, "dismissed");
      }
    });
  }

  // Minimize button
  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = document.getElementById("chat-container");
      const popup = document.getElementById("chatbase-message-bubbles");

      chatIframe.style.display = "none";
      chatButton.style.display = "block";
      minimizeBtn.style.display = "none";

      if (container) {
        container.classList.remove("chat-open");
        container.classList.add("minimized");
      }

      // Hide popup when minimizing
      if (popup) {
        popup.style.display = "none";
      }

      // Remember minimized state
      const minimizedStateKey = `chatMinimized_${ctx.getChatbotId()}`;
      localStorage.setItem(minimizedStateKey, "true");
    });
  }

  // Plus overlay (un-minimize)
  const plusOverlay = document.getElementById("plus-overlay");
  if (plusOverlay) {
    plusOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      const container = document.getElementById("chat-container");

      if (container) {
        container.classList.remove("minimized");
      }

      // Restore minimize button visibility (remove inline style so CSS takes over)
      if (minimizeBtn) {
        minimizeBtn.style.display = "";
      }

      // Clear minimized state
      const minimizedStateKey = `chatMinimized_${ctx.getChatbotId()}`;
      localStorage.removeItem(minimizedStateKey);

      // Show popup again when un-minimizing (if not permanently dismissed)
      const popupStateKey = `popupState_${ctx.getChatbotId()}`;
      const popupState = localStorage.getItem(popupStateKey);
      if (popupState !== "dismissed") {
        setTimeout(showPopup, 500);
      }
    });
  }

  // Restore minimized state on page load
  const minimizedStateKey = `chatMinimized_${ctx.getChatbotId()}`;
  if (localStorage.getItem(minimizedStateKey) === "true") {
    const container = document.getElementById("chat-container");
    if (container) {
      container.classList.add("minimized");
    }
  }

  // Listen for messages from iframe
  window.addEventListener("message", (event) => {
    if (event.origin !== ctx.getConfig().iframeUrl?.replace(/\/$/, "")) return;

    if (event.data.action === "toggleSize") {
      GlobalStateStore.toggleIsIframeEnlarged();
      adjustIframeSize({ ctx });
    } else if (event.data.action === "closeChat") {
      const container = document.getElementById("chat-container");
      chatIframe.style.display = "none";
      chatButton.style.display = "block";
      if (minimizeBtn) minimizeBtn.style.display = "none";
      if (container) container.classList.remove("chat-open");
      // Clear chat window state when closed via iframe
      localStorage.removeItem("chatWindowState");
    } else if (event.data.action === "navigate" && event.data.url) {
      // Handle product button clicks - navigate to product URL
      window.location.href = event.data.url;
    } else if (event.data.action === "setChatbotUserId" && event.data.userId) {
      // Handle userId from iframe (sent when user starts conversation)
      localStorage.setItem(`userId_${ctx.getChatbotId()}`, event.data.userId);
      localStorage.setItem(`hasInteracted_${ctx.getChatbotId()}`, "true"); // Persist interaction flag
      Logger.log(
        "✅ Received chatbotUserId from iframe:",
        ctx.getChatbotUserId(),
      );
      Logger.log(
        "✅ User has interacted with chatbot, purchase tracking enabled",
      );
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => adjustIframeSize({ ctx }));

  // Initial size adjustment
  adjustIframeSize({ ctx });

  // Force multiple resize events to ensure proper loading 100% of the time
  function triggerResizeEvents() {
    window.dispatchEvent(new Event("resize"));
  }

  // Trigger resize events at different intervals to catch lazy-loading elements
  setTimeout(triggerResizeEvents, 100);
  setTimeout(triggerResizeEvents, 300);
  setTimeout(triggerResizeEvents, 500);
  setTimeout(triggerResizeEvents, 800);
  setTimeout(triggerResizeEvents, 1200);

  // Send configuration to iframe after load
  chatIframe.onload = () => {
    sendMessageToIframe({ ctx });
  };

  // Ensure iframe loads after initialization
  setTimeout(() => {
    if (chatIframe && chatIframe.style.display === "none") {
      sendMessageToIframe({ ctx });
    }
  }, 2000);
}

import { Context } from "../types";
import { adjustIframeSize } from "./adjust-iframe-size";
import { sendMessageToIframe } from "./send-message-to-iframe";

/**
 * Toggle chat window
 */
export function toggleChatWindow({ ctx }: { ctx: Readonly<Context> }) {
  const chatButton = document.getElementById("chat-button");
  const chatIframe = document.getElementById(
    "chat-iframe",
  ) as HTMLIFrameElement;
  const popup = document.getElementById("chatbase-message-bubbles");
  const minimizeBtn = document.getElementById("minimize-button");
  const container = document.getElementById("chat-container");

  if (chatIframe.style.display === "none" || !chatIframe.style.display) {
    // Open chat
    chatIframe.style.display = "block";

    if (chatButton) {
      chatButton.style.display = "none";
    }

    if (popup) popup.style.display = "none";
    if (minimizeBtn) minimizeBtn.style.display = "block";
    if (container) {
      container.classList.add("chat-open");
      container.classList.remove("minimized");
    }

    // Clear minimized state when opening chat
    const minimizedStateKey = `chatMinimized_${ctx.getChatbotId()}`;
    localStorage.removeItem(minimizedStateKey);

    // Permanently dismiss popup when chatbot is opened
    const popupStateKey = `popupState_${ctx.getChatbotId()}`;
    localStorage.setItem(popupStateKey, "dismissed");

    // Save chat window state (desktop only)
    const isDesktop = window.innerWidth >= 1000;
    if (isDesktop) {
      localStorage.setItem("chatWindowState", "open");
    }

    adjustIframeSize({ ctx });
    sendMessageToIframe({ ctx });

    // Trigger resize events when opening chat to ensure proper rendering
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 150);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);

    // Notify iframe that chat was opened
    try {
      const iframeUrl = ctx.getConfig().iframeUrl;
      if (iframeUrl) {
        chatIframe.contentWindow?.postMessage(
          { action: "chatOpened" },
          iframeUrl,
        );
      }
    } catch (e) {
      // Silent error handling
    }
  } else {
    // Close chat
    chatIframe.style.display = "none";

    if (chatButton) {
      chatButton.style.display = "block";
    }

    if (minimizeBtn) minimizeBtn.style.display = "none";
    if (container) container.classList.remove("chat-open");

    // Clear chat window state when manually closed
    localStorage.removeItem("chatWindowState");
  }
}

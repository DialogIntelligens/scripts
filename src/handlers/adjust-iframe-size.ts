import { GlobalStateStore } from "../state";
import { Context } from "../types";
import { sendMessageToIframe } from "./send-message-to-iframe";

/**
 * Adjust iframe size based on screen and state
 */
export function adjustIframeSize({ ctx }: { ctx: Readonly<Context> }) {
  const config = ctx.getConfig();

  const iframe = document.getElementById("chat-iframe");
  if (!iframe) return;

  // In preview mode, use fixed sizes and don't respond to window resize
  const isPreview = window.CHATBOT_PREVIEW_MODE === true;

  if (isPreview) {
    // Check if this is mobile preview mode (passed from parent)
    const isMobilePreview = config && config.previewMode === "mobile";

    if (isMobilePreview) {
      // Mobile preview: use 95% of preview window (responsive)
      iframe.style.width = "95vw";
      iframe.style.height = "90vh";
      iframe.style.position = "fixed";
      iframe.style.left = "50%";
      iframe.style.top = "50%";
      iframe.style.transform = "translate(-50%, -50%)";
      iframe.style.bottom = "";
      iframe.style.right = "";
    } else {
      // Desktop preview: fixed size (doesn't respond to preview window size)
      iframe.style.width = "calc(375px + 6vw)";
      iframe.style.height = "calc(450px + 20vh)";
      iframe.style.position = "fixed";
      iframe.style.left = "auto";
      iframe.style.top = "auto";
      iframe.style.transform = "none";
      iframe.style.bottom = "3vh";
      iframe.style.right = "2vw";
    }
    return;
  }

  // Keep 'isIframeEnlarged' logic if toggled from the iframe
  if (GlobalStateStore.isIframeEnlarged) {
    // Enlarged dimensions (configurable)
    iframe.style.width = config.iframeWidthEnlarged || "calc(2 * 45vh + 6vw)";
    iframe.style.height = config.iframeHeightEnlarged || "90vh";
  } else {
    // Default sizing:
    // For phone/tablet (< 1000px), use mobile dimensions
    // For larger screens, use desktop dimensions
    if (window.innerWidth < 1000) {
      iframe.style.width = config.iframeWidthMobile || "95vw";
      iframe.style.height = config.iframeHeightMobile || "90vh";
    } else {
      iframe.style.width = config.iframeWidthDesktop || "calc(50vh + 8vw)";
      iframe.style.height = config.iframeHeightDesktop || "90vh";
    }
  }

  // Always position fixed
  iframe.style.position = "fixed";

  // Center if mobile, else bottom-right
  if (window.innerWidth < 1000) {
    iframe.style.left = "50%";
    iframe.style.top = "50%";
    iframe.style.transform = "translate(-50%, -50%)";
    iframe.style.bottom = "";
    iframe.style.right = "";
  } else {
    iframe.style.left = "auto";
    iframe.style.top = "auto";
    iframe.style.transform = "none";
    iframe.style.bottom = "3vh";
    iframe.style.right = "2vw";
  }

  // Re-send data to iframe in case layout changes
  sendMessageToIframe({ ctx });
}

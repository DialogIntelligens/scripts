import { Context } from "../types";
import { Logger, Server } from "../utils";
import { generateVisitorKey } from "./generate-visitor-key";
import { getSplitAssignmentOnce, logSplitImpression } from "./split";

/**
 * Show popup message
 */
export async function showPopup({ ctx }: { ctx: Readonly<Context> }) {
  const iframe = document.getElementById("chat-iframe");
  if (iframe && iframe.style.display !== "none") {
    return;
  }

  // Don't show popup if chat is minimized
  const minimizedStateKey = `chatMinimized_${ctx.getChatbotId()}`;
  if (localStorage.getItem(minimizedStateKey) === "true") {
    return;
  }

  const isMobile = window.innerWidth < 1000;
  const popupStateKey = `popupState_${ctx.getChatbotId()}`;
  const pageVisitCountKey = `pageVisitCount_${ctx.getChatbotId()}`;
  const lastPageTimeKey = `lastPageTime_${ctx.getChatbotId()}`;

  // Get current popup state
  let popupState = localStorage.getItem(popupStateKey);

  // Desktop behavior: Show once and keep visible until chatbot opened
  if (!isMobile) {
    // If popup was already shown and not dismissed, just display it (no animation)
    if (popupState === "shown") {
      displayPopupWithoutAnimation({ ctx });
      return;
    }

    // If popup was permanently dismissed (user opened chatbot), don't show
    if (popupState === "dismissed") {
      return;
    }

    // First time showing popup on desktop
    await displayPopupWithAnimation({ ctx });
    localStorage.setItem(popupStateKey, "shown");
    return;
  }

  // Mobile behavior: Show once after 2 page visits + 6s stay, then dismiss after 15s
  if (isMobile) {
    // Check if popup should be shown on mobile (configurable)
    if (ctx.getConfig().popupShowOnMobile === false) {
      Logger.log("🔍 Popup disabled on mobile via config");
      return;
    }

    // If popup was permanently dismissed on mobile, don't show
    if (popupState === "dismissed") {
      return;
    }

    // Track how many times popup has been shown on mobile
    const popupShowCountKey = `popupShowCount_${ctx.getChatbotId()}`;
    let popupShowCount = parseInt(
      localStorage.getItem(popupShowCountKey) || "0",
    );

    // Maximum popup appearances on mobile (configurable, default 2)
    const maxDisplays = ctx.getConfig().popupMaxDisplays || 2;
    if (popupShowCount >= maxDisplays) {
      localStorage.setItem(popupStateKey, "dismissed");
      return;
    }

    // Track page visits
    let pageVisitCount = parseInt(
      localStorage.getItem(pageVisitCountKey) || "0",
    );
    pageVisitCount++;
    localStorage.setItem(pageVisitCountKey, pageVisitCount.toString());

    // Track time on current page
    const pageLoadTime = Date.now();
    localStorage.setItem(lastPageTimeKey, pageLoadTime.toString());

    // Check if conditions are met: 2+ pages visited and stayed 6+ seconds
    if (pageVisitCount >= 2) {
      setTimeout(async () => {
        // Check if user is still on the page (hasn't navigated away)
        const savedLoadTime = localStorage.getItem(lastPageTimeKey);
        // Check if still not dismissed and not minimized
        const currentPopupState = localStorage.getItem(popupStateKey);
        const minimizedState = localStorage.getItem(
          `chatMinimized_${ctx.getChatbotId()}`,
        );

        if (
          savedLoadTime === pageLoadTime.toString() &&
          currentPopupState !== "dismissed" &&
          minimizedState !== "true"
        ) {
          // Increment show count before showing
          popupShowCount++;
          localStorage.setItem(popupShowCountKey, popupShowCount.toString());

          // Show popup and auto-dismiss after 15 seconds
          await displayPopupWithAnimation({ ctx });

          // Auto-dismiss after 15 seconds on mobile
          setTimeout(() => {
            const popup = document.getElementById("chatbase-message-bubbles");
            if (popup && popup.style.display === "flex") {
              popup.style.display = "none";
              // After showing max times, mark as permanently dismissed
              const maxDisplays = ctx.getConfig().popupMaxDisplays || 2;
              if (popupShowCount >= maxDisplays) {
                localStorage.setItem(popupStateKey, "dismissed");
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
  const popup = document.getElementById("chatbase-message-bubbles");
  const messageBox = document.getElementById("popup-message-box");
  if (!popup || !messageBox) return;

  // Fetch popup text from backend with split test support
  let finalPopupText =
    (await fetchPopupFromBackend({ ctx })) || "Har du brug for hjælp?";

  // Check for split test assignment
  let splitAssignment = null;
  try {
    splitAssignment = await getSplitAssignmentOnce({ ctx });
    if (
      splitAssignment &&
      splitAssignment.variant &&
      splitAssignment.variant.config &&
      splitAssignment.variant.config.popup_text
    ) {
      finalPopupText = splitAssignment.variant.config.popup_text;
    }
  } catch (e) {
    Logger.warn("Split test check failed:", e);
  }

  messageBox.innerHTML = `${finalPopupText} <span id="funny-smiley">😊</span>`;

  // Log impression if this is a split test
  if (splitAssignment && splitAssignment.variant_id) {
    logSplitImpression(splitAssignment.variant_id);
  }

  // Set popup width dynamically based on character count
  // Formula ensures text stays readable in 1-2 lines
  const charCount = messageBox.textContent.trim().length;
  const calculatedWidth = Math.max(380, Math.min(700, charCount * 3.2 + 260));
  popup.style.width = calculatedWidth + "px";

  // Add animation class for popup entrance
  popup.classList.add("animate");
  popup.style.display = "flex";

  // Animate smiley
  setTimeout(() => {
    const smiley = document.getElementById("funny-smiley");
    if (smiley && popup.style.display === "flex") {
      smiley.classList.add("blink");
      setTimeout(() => smiley.classList.remove("blink"), 1000);
    }
  }, 2000);

  setTimeout(() => {
    const smiley = document.getElementById("funny-smiley");
    if (smiley && popup.style.display === "flex") {
      smiley.classList.add("jump");
      setTimeout(() => smiley.classList.remove("jump"), 1000);
    }
  }, 12000);
}

/**
 * Display popup without animation (for desktop on subsequent page loads)
 */
async function displayPopupWithoutAnimation({
  ctx,
}: {
  ctx: Readonly<Context>;
}) {
  const popup = document.getElementById("chatbase-message-bubbles");
  const messageBox = document.getElementById("popup-message-box");
  if (!popup || !messageBox) return;

  // Fetch popup text from backend with split test support
  let finalPopupText =
    (await fetchPopupFromBackend({ ctx })) || "Har du brug for hjælp?";

  // Check for split test assignment
  let splitAssignment = null;
  try {
    splitAssignment = await getSplitAssignmentOnce({ ctx });
    if (
      splitAssignment &&
      splitAssignment.variant &&
      splitAssignment.variant.config &&
      splitAssignment.variant.config.popup_text
    ) {
      finalPopupText = splitAssignment.variant.config.popup_text;
    }
  } catch (e) {
    Logger.warn("Split test check failed:", e);
  }

  messageBox.innerHTML = `${finalPopupText} <span id="funny-smiley">😊</span>`;

  // Set popup width dynamically based on character count
  // Formula ensures text stays readable in 1-2 lines
  const charCount = messageBox.textContent.trim().length;
  const calculatedWidth = Math.max(380, Math.min(700, charCount * 3.2 + 260));
  popup.style.width = calculatedWidth + "px";

  popup.style.display = "flex";
  // No animations on subsequent loads
}

async function fetchPopupFromBackend({ ctx }: { ctx: Readonly<Context> }) {
  try {
    const visitorKey = generateVisitorKey({ ctx });
    const backendUrl = Server.getUrl({ ctx });
    const resp = await fetch(
      `${backendUrl}/api/popup-message?chatbot_id=${encodeURIComponent(ctx.getChatbotId())}&visitor_key=${encodeURIComponent(visitorKey)}`,
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    return data && data.popup_text ? String(data.popup_text) : null;
  } catch (e) {
    Logger.warn("Popup fetch failed:", e);
    return null;
  }
}

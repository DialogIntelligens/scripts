import { Logger } from "../utils";

export function removeNotificationBadgeOnClick() {
  const chatButton = document.getElementById("chat-button");
  if (!chatButton) return;

  chatButton.addEventListener("click", () => {
    // Remove notification badge if present
    const badge = document.getElementById("notification-badge");
    if (badge) badge.remove();

    Logger.log("💬 Chatbot opened — notification badge removed.");
  });
}

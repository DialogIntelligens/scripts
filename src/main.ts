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
import { Chatbot } from "./chatbot";
import { Config } from "./config";
import { setupPreviewEventListener } from "./handlers/preview-listener";
import { GlobalStateStore } from "./state";
import { Context } from "./types";
import { Logger } from "./utils";

(async function () {
  "use strict";
  await main();
})();

async function main() {
  const config = {
    purchaseTrackingEnabled: false,
    enableMinimizeButton: false,
    enablePopupMessage: false,
    pagePath: window.location.href,
    isPhoneView: window.innerWidth < 1000,
  };

  const defaultCtx: Context = {
    isPreviewMode: !!window.CHATBOT_PREVIEW_MODE,
    getChatbotId: () => getChatbotIdFromScriptParams() ?? "",
    getChatbotUserId: () => getChatbotUserId() ?? "",
    hasInteractedWithChatbot: () =>
      localStorage.getItem(
        `hasInteracted_${getChatbotIdFromScriptParams() ?? ""}`,
      ) === "true",
    getConfig: () =>
      window.CHATBOT_PREVIEW_MODE && window.CHATBOT_PREVIEW_CONFIG
        ? { ...config, ...window.CHATBOT_PREVIEW_CONFIG }
        : config,
  };

  const ctx = await Config.get({ ctx: defaultCtx });

  if (ctx.isPreviewMode) {
    Logger.log({ ctx }, `🔍 Preview Mode: Initializing chatbot preview`);
    setupPreviewEventListener({ ctx });
  } else {
    Logger.log(
      { ctx },
      `🤖 Initializing universal chatbot: ${ctx.getChatbotId()}`,
    );
  }

  // Try multiple initialization strategies for GTM
  if (document.readyState === "complete") {
    initWithDebug({ ctx });
  } else if (document.readyState === "interactive") {
    initWithDebug({ ctx });
  } else {
    document.addEventListener("DOMContentLoaded", () => initWithDebug({ ctx }));
  }

  // Fallback for GTM context
  setTimeout(() => {
    if (!GlobalStateStore.chatbotInitialized) {
      initWithDebug({ ctx });
    }
  }, 2000);
}

function getChatbotUserId(): string | null {
  const userIdKey = `userId_${getChatbotIdFromScriptParams()}`;
  return localStorage.getItem(userIdKey) || null;
}

function getChatbotIdFromScriptParams(): string | null {
  try {
    // Use document.currentScript for reliable script reference
    // Fallback to scanning all script tags if currentScript is not available
    let currentScript: HTMLScriptElement =
      document.currentScript as HTMLScriptElement;

    if (!currentScript) {
      const scripts = Array.from(document.scripts);
      currentScript = scripts.find((s) =>
        s.src?.includes("/universal-chatbot.js"),
      ) as HTMLScriptElement;
    }

    if (!currentScript || !currentScript.src) {
      Logger.error(
        "❌ Could not find script reference. Make sure script is loaded correctly.",
      );
      return null;
    }

    const url = new URL(currentScript.src);
    const chatbotID = url.searchParams.get("id");

    if (!chatbotID) {
      Logger.error(
        '❌ Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"></script>',
      );
      Logger.error("Script URL:", currentScript.src);
      return null;
    }

    return chatbotID;
  } catch (error) {
    Logger.error("❌ Failed to extract chatbot ID from script URL:", error);
    return null;
  }
}

function initWithDebug({ ctx }: { ctx: Context }) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(async () => await Chatbot.init({ ctx }), 100);
    });
  } else {
    setTimeout(async () => await Chatbot.init({ ctx }), 100);
  }
}

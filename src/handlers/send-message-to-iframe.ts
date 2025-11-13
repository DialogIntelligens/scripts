import { Config, Context } from "../types";
import { Logger } from "../utils";
import { getSplitAssignmentOnce } from "./split";

type MessageData = {
  chatbotID: string;
  action: string;
  splitTestId: string;
  pagePath: string;
  isTabletView: boolean;
  isPhoneView: boolean;
  gptInterface: boolean;
} & Config;

/**
 * Send configuration message to iframe
 */
export async function sendMessageToIframe({ ctx }: { ctx: Readonly<Context> }) {
  const iframe = document.getElementById("chat-iframe") as HTMLIFrameElement;
  if (!iframe) return;

  try {
    // Get split test assignment
    let splitTestId = null;
    const splitAssignment = await getSplitAssignmentOnce({ ctx });
    if (splitAssignment && splitAssignment.variant_id) {
      splitTestId = splitAssignment.variant_id;
    }

    const config = ctx.getConfig();
    const messageData: MessageData = {
      action: "integrationOptions", // CRITICAL: App.js requires this field to recognize the message
      chatbotID: ctx.getChatbotId(),
      ...config,
      splitTestId: splitTestId,
      pagePath: window.location.href,
      isTabletView: false, // Always false to match legacy behavior
      isPhoneView: window.innerWidth < 1000,
      gptInterface: false,
    };

    Logger.log("📤 Sending configuration to iframe:", {
      chatbotID: messageData.chatbotID,
      action: messageData.action,
      themeColor: messageData.themeColor,
      borderRadiusMultiplier: messageData.borderRadiusMultiplier,
      purchaseTrackingEnabled: messageData.purchaseTrackingEnabled,
      leadMail: messageData.leadMail,
      toHumanMail: messageData.toHumanMail,
      freshdeskGroupId: messageData.freshdeskGroupId,
    });

    const iframeUrl = config.iframeUrl;
    if (iframeUrl) {
      iframe.contentWindow?.postMessage(messageData, iframeUrl);
    }
  } catch (e) {
    Logger.warn("Failed to send message to iframe:", e);
  }
}

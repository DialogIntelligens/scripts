import { Context } from "../types";
import { getSplitAssignmentOnce } from "./split";

/**
 * Send configuration message to iframe
 */
export async function sendMessageToIframe({ ctx }: { ctx: Readonly<Context> }) {
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
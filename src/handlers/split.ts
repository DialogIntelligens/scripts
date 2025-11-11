import { Context } from "../types";
import { Server } from "../utils";
import { generateVisitorKey } from "./generate-visitor-key";

export async function getSplitAssignmentOnce({ ctx }: { ctx: Readonly<Context> }) {
    try {
        const visitorKey = generateVisitorKey({ ctx });
        const backendUrl = Server.getUrl({ ctx });
        const resp = await fetch(`${backendUrl}/api/split-assign?chatbot_id=${encodeURIComponent(ctx.chatbotID)}&visitor_key=${encodeURIComponent(visitorKey)}`);
        if (!resp.ok) return null;
        const data = await resp.json();
        return (data && data.enabled) ? data : null;
    } catch (e) {
        console.warn('Split test assignment failed:', e);
        return null;
    }
    }

export async function logSplitImpression({ variantId, ctx }: { variantId: string, ctx: Readonly<Context> }) {
    try {
        const visitorKey = generateVisitorKey({ ctx });
        const backendUrl = Server.getUrl({ ctx });
        await fetch(`${backendUrl}/api/split-impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chatbot_id: ctx.chatbotID,
            variant_id: variantId,
            visitor_key: visitorKey,
            user_id: ctx.chatbotUserId
        })
        });
    } catch (e) {
        console.warn('Failed to log split impression:', e);
    }
}
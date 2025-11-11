import { Context } from "../types";

export function generateVisitorKey({ ctx }: { ctx: Readonly<Context> }) {
    const storageKey = `visitorKey_${ctx.chatbotID}`;
    let visitorKey = localStorage.getItem(storageKey);
    if (!visitorKey) {
        visitorKey = `visitor-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem(storageKey, visitorKey);
    }
    return visitorKey;
}

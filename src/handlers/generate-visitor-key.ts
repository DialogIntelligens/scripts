import { Context } from "../types";

export function generateVisitorKey({ ctx }: { ctx: Readonly<Context> }) {
  const storageKey = `visitorKey_${ctx.getChatbotId()}`;
  const visitorKey = localStorage.getItem(storageKey);

  if (!visitorKey) {
    const key = `visitor-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem(storageKey, key);
    return key;
  }

  return visitorKey;
}

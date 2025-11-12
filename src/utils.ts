import { Context } from "./types";

export const Logger = {
  log,
  error,
  warn,
  isEnabled,
};

function log(...args: Parameters<typeof console.log>) {
  if (isEnabled()) console.log(...args);
}

function warn(...args: Parameters<typeof console.warn>) {
  if (isEnabled()) console.warn(...args);
}

function error(...args: Parameters<typeof console.error>) {
  if (isEnabled()) console.error(...args);
}

function isEnabled() {
  return Boolean(
    (window.localStorage.getItem("CHATBOT_LOGGING_ENABLED") === "true" ||
      window.CHATBOT_LOGGING_ENABLED) ??
      window.CHATBOT_PREVIEW_MODE,
  );
}

export const Server = {
  getUrl,
};

function getUrl({ ctx }: { ctx: Readonly<Context> }) {
  if (ctx.isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.backendUrl) {
    return window.CHATBOT_PREVIEW_CONFIG.backendUrl;
  }

  return "https://egendatabasebackend.onrender.com";
}

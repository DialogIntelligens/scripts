import { Context } from "./types";

export const Console = {
  log,
  error,
  warn
}

function error(
  { ctx }: { ctx: Readonly<Context> },
  ...args: Parameters<typeof console.error>
) {
  if (ctx.isPreviewMode) {
    console.error(...args);
  }
}

function warn(
  { ctx }: { ctx: Readonly<Context> },
  ...args: Parameters<typeof console.warn>
) {
  if (ctx.isPreviewMode) {
    console.warn(...args);
  }
}

function log(
  { ctx }: { ctx: Readonly<Context> },
  ...args: Parameters<typeof console.log>
) {
  if (ctx.isPreviewMode) {
    console.log(...args);
  }
}


export const Server = {
    getUrl,
}

function getUrl({ ctx }: { ctx: Readonly<Context>}) {
  if (ctx.isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.backendUrl) {
    return window.CHATBOT_PREVIEW_CONFIG.backendUrl;
  }

  return 'https://egendatabasebackend.onrender.com';
}

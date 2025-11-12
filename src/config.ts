import { Config as ContextConfig, Context } from "./types";
import { Logger, Server } from "./utils";

export const Config = {
  get,
};

async function get({
  ctx,
}: {
  ctx: Readonly<Context>;
}): Promise<Readonly<Context>> {
  if (ctx.isPreviewMode) {
    return ctx;
  }

  const config = await loadChatbotConfig({ ctx });

  return {
    isPreviewMode: ctx.isPreviewMode,
    getChatbotId: ctx.getChatbotId,
    getChatbotUserId: ctx.getChatbotUserId,
    hasInteractedWithChatbot: ctx.hasInteractedWithChatbot,
    getConfig: () => config,
  };
}

async function loadChatbotConfig({
  ctx,
}: {
  ctx: Readonly<Context>;
}): Promise<ContextConfig> {
  try {
    Logger.log(`📡 Loading configuration for chatbot: ${ctx.getChatbotId()}`);
    const response = await fetch(
      `${Server.getUrl({ ctx })}/api/integration-config/${ctx.getChatbotId()}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load configuration: ${response.status} ${response.statusText}`,
      );
    }

    const configData = await response.json();
    Logger.log(`✅ Configuration loaded successfully`);
    return { ...ctx.getConfig(), ...configData };
  } catch (error) {
    Logger.error("❌ Error loading chatbot config:", error);

    return {
      ...ctx.getConfig(),
      themeColor: "#1a1d56",
      borderRadiusMultiplier: 1.0,
      headerTitleG: "",
      headerSubtitleG: "Vores virtuelle assistent er här for at hjælpe dig.",
      titleG: "Chat Assistent",
      enableMinimizeButton: true,
      enablePopupMessage: true,
    };
  }
}

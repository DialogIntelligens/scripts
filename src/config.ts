import { Context } from "./types";
import { Logger, Server } from "./utils";

export const Config = {
  get,
};

async function get({
  ctx,
}: {
  ctx: Readonly<Context>;
}): Promise<Readonly<Context>> {
  const configFromServer = await loadChatbotConfig({ ctx });
  const config = { ...getDefault({ ctx }), ...configFromServer };

  return {
    isPreviewMode: ctx.isPreviewMode,
    getChatbotId: ctx.getChatbotId,
    getChatbotUserId: ctx.getChatbotUserId,
    hasInteractedWithChatbot: ctx.hasInteractedWithChatbot,
    getConfig: () =>
      window.CHATBOT_PREVIEW_MODE && window.CHATBOT_PREVIEW_CONFIG
        ? { ...config, ...window.CHATBOT_PREVIEW_CONFIG }
        : config,
  };
}

async function loadChatbotConfig({ ctx }: { ctx: Readonly<Context> }) {
  // In preview mode, use the config provided by the preview window, but ensure leadFields are included
  if (ctx.isPreviewMode && window.CHATBOT_PREVIEW_CONFIG) {
    Logger.log("🔍 Preview Mode: Using provided configuration");

    // If preview config doesn't have leadFields, try to fetch from backend to get them
    if (!window.CHATBOT_PREVIEW_CONFIG.leadFields) {
      Logger.log(
        "🔍 Preview Mode: Missing leadFields, fetching from backend...",
      );
      try {
        const backendUrl =
          ctx.isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.backendUrl
            ? window.CHATBOT_PREVIEW_CONFIG.backendUrl
            : "https://egendatabasebackend.onrender.com";

        const response = await fetch(
          `${backendUrl}/api/integration-config/${ctx.getChatbotId()}`,
        );
        if (response.ok) {
          const backendConfig = await response.json();
          // Merge backend config with preview config
          return { ...window.CHATBOT_PREVIEW_CONFIG, ...backendConfig };
        }
      } catch (error) {
        Logger.warn(
          "🔍 Preview Mode: Failed to fetch leadFields from backend:",
          error,
        );
      }
    }

    return window.CHATBOT_PREVIEW_CONFIG;
  }

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
    return configData;
  } catch (error) {
    Logger.error("❌ Error loading chatbot config:", error);

    // Get iframe URL from preview config (for development dashboard) or use production URL
    const iframeUrl =
      ctx.isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.iframeUrl
        ? window.CHATBOT_PREVIEW_CONFIG.iframeUrl
        : "https://skalerbartprodukt.onrender.com";

    // Return minimal fallback configuration
    return {
      chatbotID: ctx.getChatbotId(),
      iframeUrl: iframeUrl,
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

function getDefault({ ctx }: { ctx: Readonly<Context> }) {
  // Get iframe URL from preview config (for development dashboard) or use production URL
  const iframeUrl =
    ctx.isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.iframeUrl
      ? window.CHATBOT_PREVIEW_CONFIG.iframeUrl
      : "https://skalerbartprodukt.onrender.com";

  return {
    chatbotID: ctx.getChatbotId(),
    iframeUrl: iframeUrl,
    pagePath: window.location.href,
    leadGen: "%%",
    leadMail: "",
    leadField1: "Navn",
    leadField2: "Email",
    useThumbsRating: false,
    ratingTimerDuration: 18000,
    replaceExclamationWithPeriod: false,
    privacyLink:
      "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf",
    freshdeskEmailLabel: "Din email:",
    freshdeskMessageLabel: "Besked til kundeservice:",
    freshdeskImageLabel: "Upload billede (valgfrit):",
    freshdeskChooseFileText: "Vælg fil",
    freshdeskNoFileText: "Ingen fil valgt",
    freshdeskSendingText: "Sender...",
    freshdeskSubmitText: "Send henvendelse",
    freshdeskEmailRequiredError: "Email er påkrævet",
    freshdeskEmailInvalidError: "Indtast venligst en gyldig email adresse",
    freshdeskFormErrorText: "Ret venligst fejlene i formularen",
    freshdeskMessageRequiredError: "Besked er påkrævet",
    freshdeskSubmitErrorText: "Der opstod en fejl",
    contactConfirmationText: "Tak for din henvendelse",
    freshdeskConfirmationText: "Tak for din henvendelse",
    freshdeskSubjectText: "Din henvendelse",
    inputPlaceholder: "Skriv dit spørgsmål her...",
    ratingMessage: "Fik du besvaret dit spørgsmål?",
    productButtonText: "SE PRODUKT",
    productButtonColor: "",
    productButtonPadding: "",
    productImageHeightMultiplier: 1,
    headerLogoG: "",
    messageIcon: "",
    themeColor: "#1a1d56",
    aiMessageColor: "#e5eaf5",
    aiMessageTextColor: "#262641",
    borderRadiusMultiplier: 1.0,
    headerTitleG: "",
    headerSubtitleG:
      "Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.",
    subtitleLinkText: "",
    subtitleLinkUrl: "",
    fontFamily: "",
    enableLivechat: false,
    titleG: "Chat Assistent",
    purchaseTrackingEnabled: false,
    require_email_before_conversation: false,
    splitTestId: null,
    isTabletView: false, // Always false to match legacy behavior
    isPhoneView: window.innerWidth < 1000,
    // CSS Positioning defaults (popup uses button positioning)
    buttonBottom: "20px",
    buttonRight: "10px",
  };
}

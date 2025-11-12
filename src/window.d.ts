export {};

declare global {
  interface Window {
    chatbotInitialized: boolean;
    CHATBOT_PREVIEW_MODE: boolean;
    CHATBOT_LOGGING_ENABLED: boolean;
    CHATBOT_PREVIEW_CONFIG?: {
      leadFields?: string;
      backendUrl?: string;
      iframeUrl?: string;
    };
  }
}

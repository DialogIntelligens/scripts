export const GlobalStateStore = {
  isIframeEnlarged: false,
  chatbotInitialized: Boolean(window.chatbotInitialized),
  setChatbotInitialized() {
    window.chatbotInitialized = true;
    this.chatbotInitialized = true;
  },
  toggleIsIframeEnlarged() {
    this.isIframeEnlarged = !this.isIframeEnlarged;
  },
  getState() {
    return {
      isIframeEnlarged: this.isIframeEnlarged,
      chatbotInitialized: this.chatbotInitialized,
    };
  },
};

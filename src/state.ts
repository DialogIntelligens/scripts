export const GlobalStateStore = {
  isIframeEnlarged: false,
  chatbotInitialized: window.chatbotInitialized,
  setChatbotInitialized() {
    this.chatbotInitialized = true;
    window.chatbotInitialized = true;
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

export type UpdateConfigEvent = {
  detail: {
    chatbotID: string,
    chatButtonImageUrl: string,
  }
}

export type Context = {
  readonly isPreviewMode: boolean,
  readonly chatbotID: string,
  readonly chatbotUserId: string,
  readonly config: {
    readonly purchaseTrackingEnabled: boolean,
    readonly checkoutConfirmationPagePatterns?: string,
    readonly checkoutPagePatterns?: string,
    readonly checkoutPriceSelector?: string,
    readonly checkoutPurchaseSelector?: string,
    readonly currency?: string;
  },
}

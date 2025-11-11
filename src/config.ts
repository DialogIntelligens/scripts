import { Context } from "./types";

export const Config = {
    getDefault,
}

function getDefault({ ctx }: { ctx: Readonly<Context>} ) {
    // Get iframe URL from preview config (for development dashboard) or use production URL
    const iframeUrl = (ctx.isPreviewMode && window.CHATBOT_PREVIEW_CONFIG?.iframeUrl) 
        ? window.CHATBOT_PREVIEW_CONFIG.iframeUrl 
        : 'https://skalerbartprodukt.onrender.com';

    return {
        chatbotID: ctx.chatbotID,
        iframeUrl: iframeUrl,
        pagePath: window.location.href,
        leadGen: '%%',
        leadMail: '',
        leadField1: 'Navn',
        leadField2: 'Email',
        useThumbsRating: false,
        ratingTimerDuration: 18000,
        replaceExclamationWithPeriod: false,
        privacyLink: 'https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf',
        freshdeskEmailLabel: 'Din email:',
        freshdeskMessageLabel: 'Besked til kundeservice:',
        freshdeskImageLabel: 'Upload billede (valgfrit):',
        freshdeskChooseFileText: 'Vælg fil',
        freshdeskNoFileText: 'Ingen fil valgt',
        freshdeskSendingText: 'Sender...',
        freshdeskSubmitText: 'Send henvendelse',
        freshdeskEmailRequiredError: 'Email er påkrævet',
        freshdeskEmailInvalidError: 'Indtast venligst en gyldig email adresse',
        freshdeskFormErrorText: 'Ret venligst fejlene i formularen',
        freshdeskMessageRequiredError: 'Besked er påkrævet',
        freshdeskSubmitErrorText: 'Der opstod en fejl',
        contactConfirmationText: 'Tak for din henvendelse',
        freshdeskConfirmationText: 'Tak for din henvendelse',
        freshdeskSubjectText: 'Din henvendelse',
        inputPlaceholder: 'Skriv dit spørgsmål her...',
        ratingMessage: 'Fik du besvaret dit spørgsmål?',
        productButtonText: 'SE PRODUKT',
        productButtonColor: '',
        productButtonPadding: '',
        productImageHeightMultiplier: 1,
        headerLogoG: '',
        messageIcon: '',
        themeColor: '#1a1d56',
        aiMessageColor: '#e5eaf5',
        aiMessageTextColor: '#262641',
        borderRadiusMultiplier: 1.0,
        headerTitleG: '',
        headerSubtitleG: 'Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opstå fejl, og at samtalen kan gemmes og behandles. Læs mere i vores privatlivspolitik.',
        subtitleLinkText: '',
        subtitleLinkUrl: '',
        fontFamily: '',
        enableLivechat: false,
        titleG: 'Chat Assistent',
        purchaseTrackingEnabled: false,
        require_email_before_conversation: false,
        splitTestId: null,
        isTabletView: false,  // Always false to match legacy behavior
        isPhoneView: window.innerWidth < 1000,
        // CSS Positioning defaults (popup uses button positioning)
        buttonBottom: '20px',
        buttonRight: '10px'
    };
}

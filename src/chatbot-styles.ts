import { Context } from "./types";

export const ChatbotStyles = {
  inject: injectStyles,
};

function injectStyles({ ctx }: { ctx: Readonly<Context> }) {
  const config = ctx.getConfig();

  const buttonColor =
    config.productButtonColor || config.themeColor || "#1a1d56";

  const css = `
        /* ----------------------------------------
            A) ANIMATIONS
            ---------------------------------------- */
        @keyframes blink-eye {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(0.1); }
        }
        @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        }
        #funny-smiley.blink {
        display: inline-block;
        animation: blink-eye 0.5s ease-in-out 2;
        }
        #funny-smiley.jump {
        display: inline-block;
        animation: jump 0.5s ease-in-out 2;
        }

        /* ----------------------------------------
            C) CHAT BUTTON + POPUP STYLES
            ---------------------------------------- */
        #chat-container {
        position: fixed;
        bottom: 20px;
        right: 10px;
        z-index: ${config.zIndex || 190};
        transition: all 0.3s ease;
        }
        #chat-container #chat-button {
        cursor: pointer !important;
        background: none !important;
        border: none !important;
        position: fixed !important;
        z-index: calc(${config.zIndex || 190} + 10) !important;
        right: calc(${(config.buttonRight || "10px").replace(/\s*!important/g, "")} + 5px) !important;
        bottom: calc(${(config.buttonBottom || "27px").replace(/\s*!important/g, "")} + 15px) !important;
        padding: 5px !important;
        margin: 0 !important;
        min-height: unset !important;
        max-height: none !important;
        width: auto !important;
        height: auto !important;
        display: block !important;
        transition: all 0.3s ease !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        }
        #chat-container #chat-button svg {
        width: 74px !important;
        height: 71px !important;
        display: block !important;
        transition: opacity 0.3s, transform 0.3s !important;
        }
        #chat-container #chat-button:hover svg {
        opacity: 1 !important;
        transform: scale(1.1) !important;
        }
        #chat-container #chat-button img {
        width: 74px;             /* same size as old SVG */
        height: 71px;
        border-radius: 50%;      /* makes it round */
        object-fit: cover;       /* ensures correct crop */
        transition: transform 0.3s ease, opacity 0.3s ease;
        display: block;
        }
        #chat-container #chat-button:hover img {
        transform: scale(1.1);   /* same hover zoom */
        opacity: 1;
        }     
        /* Minimize button - positioned at top right of the icon */
        #minimize-button {
        position: absolute !important;
        top: -10px !important;
        right: -5px !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
        max-width: 24px !important;
        max-height: 24px !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 50% !important;
        background: rgba(0, 0, 0, 0.6) !important;
        color: white !important;
        border: 2px solid white !important;
        font-size: 18px !important;
        font-weight: bold !important;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: calc(${config.zIndex || 190} + 9) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        transition: all 0.3s ease !important;
        line-height: 1 !important;
        }
        
        #minimize-button:hover {
        transform: scale(1.1);
        background: rgba(0, 0, 0, 0.8);
        }
        
        /* Minimized state - shrink the entire chat button */
        #chat-container.minimized #chat-button {
        transform: scale(0.55);
        transform-origin: bottom right;
        right: calc(10px + -2px) !important;
        bottom: calc(20px + -15px) !important;
        }
        
        #chat-container.minimized #minimize-button {
        display: none;
        }
        
        /* Plus overlay when minimized - greyed out and hovering over small icon */
        #plus-overlay {
        position: absolute !important;
        bottom: -4.5px !important;
        right: 10px !important;
        font-size: 15px !important;
        font-weight: bold !important;
        color: white !important;
        background: rgba(100, 100, 100, 0.7) !important;
        width: 20px !important;
        height: 20px !important;
        min-width: 20px !important;
        min-height: 20px !important;
        max-width: 20px !important;
        max-height: 20px !important;
        padding: 0 !important;
        scale: 1.15 !important;
        margin: 0 !important;
        border-radius: 50% !important;
        border: none !important;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer !important;
        z-index: calc(${config.zIndex || 190} + 20) !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.4) !important;
        transition: all 0.3s ease !important;
        line-height: 1 !important;
        }
        
        #plus-overlay:hover {
        background: rgba(80, 80, 80, 0.85) !important;
        transform: scale(1.1) !important;
        }
        
        #chat-container.minimized #plus-overlay {
        display: flex;
        }
        
        /* Show minimize button only on mobile */
        @media (max-width: 1000px) {
        #chat-container #minimize-button {
            display: flex;
        }
        }

        /* Hide minimize feature when disabled */
        #chat-container.minimize-disabled #minimize-button,
        #chat-container.minimize-disabled #plus-overlay {
        display: none !important;
        }

        /* Show chat button when chat is NOT open */
        #chat-container:not(.chat-open) #chat-button {
        display: block !important;
        }

        /* Hide chat button when chat is open */
        #chat-container.chat-open #chat-button {
        display: none !important;
        }

        /* Hide minimize elements when chat is open */
        #chat-container.chat-open #minimize-button,
        #chat-container.chat-open #plus-overlay {
        display: none !important;
        }

        /* Popup rise animation */
        @keyframes rise-from-bottom {
        0% {
            transform: translateY(50px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
        }

        /* Popup container */
        #chatbase-message-bubbles {
        position: absolute;
        bottom: calc(${(config.buttonBottom || "20px").replace(/\s*!important/g, "")} + 5px);
        right: calc(${(config.buttonRight || "10px").replace(/\s*!important/g, "")} + 45px);
        border-radius: 20px;
        font-family: 'Montserrat', sans-serif;
        font-size: 20px;
        z-index: calc(${config.zIndex || 190} + 8);
        scale: 0.58;
        cursor: pointer;
        display: none; /* hidden by default */
        flex-direction: column;
        gap: 50px;
        background-color: white;
        transform-origin: bottom right;
        max-width: 700px;
        min-width: 380px;
        box-shadow:
            0px 0.6px 0.54px -1.33px rgba(0, 0, 0, 0.15),
            0px 2.29px 2.06px -2.67px rgba(0, 0, 0, 0.13),
            0px 10px 9px -4px rgba(0, 0, 0, 0.04),
            rgba(0, 0, 0, 0.125) 0px 0.362176px 0.941657px -1px,
            rgba(0, 0, 0, 0.18) 0px 3px 7.8px -2px;
        }
        
        /* Apply animation only when animate class is present */
        #chatbase-message-bubbles.animate {
        animation: rise-from-bottom 0.6s ease-out;
        }
        
        #chatbase-message-bubbles::after {
        content: '';
        position: absolute;
        bottom: 0px;
        right: 30px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 10px 0 20px;
        border-color: white transparent transparent transparent;
        box-shadow: rgba(150, 150, 150, 0.2) 0px 10px 30px 0px;
        }

        /* Close button is hidden by default; becomes visible/enlarged on hover */
        #chatbase-message-bubbles .close-popup {
        position: absolute;
        top: 8px;
        left: 8px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
        background-color: rgba(224, 224, 224, 0);
        color: black;
        opacity: 0;
        transform: scale(0.7);
        transition: background-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;
        z-index: calc(${config.zIndex || 190} + 999810);
        pointer-events: none;
        }
        #chatbase-message-bubbles:hover .close-popup {
        opacity: 1;
        transform: scale(1.2);
        pointer-events: auto;
        }
        #chatbase-message-bubbles .close-popup:hover {
        background-color: black;
        color: white;
        }
        
        @media (max-width: 1000px) {
        #chatbase-message-bubbles {
            bottom: 18px;
            right: 50px;
            bottom: calc(${(config.buttonBottom || "20px").replace(/\s*!important/g, "")} + -20px);
            right: calc(${(config.buttonRight || "10px").replace(/\s*!important/g, "")} + 25px);
            scale: 0.52;
            z-index: calc(${config.zIndex} + 7);

        }

        #chat-container #chat-button {
            z-index: calc(${config.zIndex || 190} + 8) !important;
            right: calc(${(config.buttonRight || "10px").replace(/\s*!important/g, "")} + -8px) !important;
            bottom: calc(${(config.buttonBottom || "27px").replace(/\s*!important/g, "")} + -10px) !important;
        }
        
        #chat-container #chat-button svg {
            width: 65px !important;
            height: 65px !important;
        }
        
        /* Always show close button on mobile as simple X */
        #chatbase-message-bubbles .close-popup {
            opacity: 1;
            transform: scale(1);
            pointer-events: auto;
            background-color: transparent;
        }
        
        #chatbase-message-bubbles .close-popup:hover {
            background-color: transparent;
            color: black;
        }
        }


        :root {
        --icon-color: ${buttonColor};
        --badge-color: #CC2B20;
        }

        
        /* Notification badge styles */
        .notification-badge {
        fill: var(--badge-color);
        }
        .notification-badge-text {
        fill: white;
        font-size: 100px;
        font-weight: bold;
        text-anchor: middle;
        dominant-baseline: central;
        }
        .notification-badge.hidden {
        display: none;
        }

        /* The main message content area */
        #chatbase-message-bubbles .message-content {
        display: flex;
        justify-content: flex-end;
        padding: 0;
        }
        #chatbase-message-bubbles .message-box {
        background-color: white;
        color: black;
        border-radius: 10px;
        padding: 12px 45px 12px 15px;
        margin: 8px;
        font-size: 25px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 400;
        line-height: 1.3em;
        opacity: 1;
        transform: scale(1);
        transition: opacity 1s, transform 1s;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        max-width: 100%;
        text-align: center;
        }
    `;

  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

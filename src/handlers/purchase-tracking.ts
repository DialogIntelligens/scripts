import { Context } from "../types";
import { Console, Server } from "../utils";

export function handlePurchaseTracking({ ctx }: { ctx: Readonly<Context> }) {
  // Handle purchase tracking
  Console.log({ ctx },{ ctx },'🛒 Purchase tracking check:', {
    enabled: ctx.config.purchaseTrackingEnabled,
    isCheckoutPage: isCheckoutPage({ ctx }),
    isCheckoutConfirmationPage: isCheckoutConfirmationPage({ ctx }),
    userId: ctx.chatbotUserId || 'waiting for iframe...'
  });

  if (ctx.config.purchaseTrackingEnabled && (isCheckoutPage({ ctx }) || isCheckoutConfirmationPage({ ctx }))) {
    Console.log({ ctx },{ ctx },'🛒 On checkout page - will check for purchase after iframe loads and sends userId...');
    // Give iframe time to load and send userId (2-6 seconds with retries)
    // The postMessage listener will update chatbotUserId when received
    setTimeout(checkForPurchase, 2000); // Wait for iframe to load
    setTimeout(checkForPurchase, 4000); // Retry in case price loads dynamically
    setTimeout(checkForPurchase, 6000); // Final retry
  } else if (ctx.config.purchaseTrackingEnabled) {
    Console.log({ ctx },{ ctx },'🛒 Not checkout page.');
  } else {
    Console.log({ ctx },{ ctx },'🛒 Purchase tracking disabled');
  }
}

function isCheckoutConfirmationPage({ ctx }: { ctx: Readonly<Context> }) {
  Console.log({ ctx },{ ctx },'🔍 Checking if current page is confirmation page:', window.location.href);

  if (ctx.isPreviewMode && ctx.config.purchaseTrackingEnabled && ctx.config.checkoutConfirmationPagePatterns) {
    // In preview mode assume the checkout confirmation page is current page if purchase tracking is enabled
    return true;
  }

  if (!ctx.config.checkoutConfirmationPagePatterns) {
    return false;
  }

  return matchesPagePattern({ pagePatterns: ctx.config.checkoutConfirmationPagePatterns, ctx });
}

function isCheckoutPage({ ctx }: { ctx: Readonly<Context> }) {
  Console.log({ ctx },{ ctx },'🔍 Checking if current page is checkout:', window.location.href);

  if (ctx.isPreviewMode && ctx.config.purchaseTrackingEnabled) {
    // In preview mode assume the checkout page is current page if purchase tracking is enabled
    return true;
  }

  // Use custom patterns from config if available
  if (matchesPagePattern({ pagePatterns: ctx.config.checkoutPagePatterns ?? "", ctx })) {
    return true;
  }

  // Default fallback patterns
  const defaultChecks = [
    window.location.href.includes('/checkout'),
    window.location.href.includes('/ordre'),
    window.location.href.includes('/order-complete/'),
    window.location.href.includes('/thank-you/'),
    window.location.href.includes('/order-received/'),
    !!document.querySelector('.order-complete'),
    !!document.querySelector('.thank-you'),
    !!document.querySelector('.order-confirmation')
  ];

  Console.log({ ctx },{ ctx },'🔍 Default checkout checks:', defaultChecks);
  const result = defaultChecks.some(check => check);
  Console.log({ ctx },{ ctx },'🔍 isCheckoutPage result:', result);
  return result;
}

function matchesPagePattern({ pagePatterns, ctx }: { pagePatterns: string, ctx: Readonly<Context> }) {
  if (pagePatterns) {
    try {
      const patterns = JSON.parse(pagePatterns);

      if (Array.isArray(patterns)) {
        return patterns.some(pattern => {
          // Support both URL substring matching and path matching
          if (pattern.startsWith('/') && pattern.endsWith('/')) {
            // Exact path match
            const path = window.location.pathname.replace(/\/$/, '');
            const result = path === pattern.replace(/\/$/, '');
            Console.log({ ctx },{ ctx },`🔍 Path match check: "${path}" === "${pattern}" ? ${result}`);
            return result;
          } else {
            // Substring match in URL
            const result = window.location.href.includes(pattern);
            Console.log({ ctx },{ ctx },`🔍 Substring match check: "${window.location.href}" includes "${pattern}" ? ${result}`);
            return result;
          }
        });
      }
    } catch (e) {
      return false;
    }
  }
}

function checkForPurchase({ ctx }: { ctx: Readonly<Context> }) {
  // Wait for userId from iframe (set by postMessage listener)
  if (!ctx.chatbotUserId) {
    Console.log({ ctx },{ ctx },'🛒 No userId yet, waiting for iframe to send it...');
    return;
  }

  // CRITICAL: Only track purchases for users who actually interacted with the chatbot
  if (!ctx.hasInteractedWithChatbot) {
    Console.log({ ctx },{ ctx },'🛒 User has not interacted with chatbot, skipping purchase tracking');
    return;
  }

  if (ctx.hasReportedPurchase) {
    Console.log({ ctx },{ ctx },'🛒 Purchase already reported for user:', ctx.chatbotUserId);
    return;
  }

  if (isCheckoutPage({ ctx })) {
    trackTotalPurchasePrice({ ctx });
  }

  // If checkout confirmation page patterns is set use that instead of checkout page patterns to track purchase
  if (isCheckoutPage({ ctx }) && !ctx.config.checkoutConfirmationPagePatterns) {
    trackPurchase({ ctx });
  }

  if (isCheckoutConfirmationPage({ ctx })) {
    Console.log({ ctx },{ ctx },'Track purchase at checkout confirmation');
    const amount = localStorage.getItem(purchaseTotalPriceKey(ctx.chatbotUserId));

    if (amount) {
      reportPurchase({ amount, ctx });
    }
  }
}

function trackTotalPurchasePrice({ ctx }: { ctx: Readonly<Context> }) {
  const { checkoutPriceSelector: basePriceSelector } = ctx.config;
  
  // PREVIEW_MODE_ONLY: If checkout price selector is set then override it to target element in preview.html with matching selector
  const checkoutPriceSelector =
    ctx.isPreviewMode && basePriceSelector
      ? "#purchase-tracking-checkout-price"
      : basePriceSelector;

  if (!checkoutPriceSelector) {
    return;
  }

  const priceElement = getSelectorElement({ selector: checkoutPriceSelector, ctx });

  if (!priceElement) {
    return;
  }

  const amount = parsePriceFromText({ priceText: priceElement.textContent.trim(), ctx });
  if (amount) {
    // Track amount in local storage incase confirmation page is used as tracking indicator (or any other page)
    localStorage.setItem(purchaseTotalPriceKey(ctx.chatbotUserId), String(amount));
  }
}

function trackPurchase({ ctx }: { ctx: Readonly<Context> }) {
  Console.log({ ctx },{ ctx },'Track purchase at checkout');

  const checkoutPurchaseSelectors = getCheckoutPurchaseSelectors({ ctx });

  if (checkoutPurchaseSelectors && !checkoutPurchaseSelectors.length) {
    Console.warn({ ctx },'⚠️ Missing purchase selector configuration');
    return;
  }

  const purchaseButtons = checkoutPurchaseSelectors
    .map(selector => getSelectorElement({ selector, ctx }))
    .filter(purchaseButton => !!purchaseButton);

  if (checkoutPurchaseSelectors.length !== purchaseButtons.length) {
      Console.warn({ ctx },`⚠️ Expected ${checkoutPurchaseSelectors.length} selectors found ${purchaseButtons.length} selectors`);
      return;
  }

  Console.log({ ctx },{ ctx },`✅ Tracking purchase button(s): ${checkoutPurchaseSelectors}`);

  purchaseButtons.forEach(purchaseButton => {
    purchaseButton.addEventListener("click", async () => {
        const amount = localStorage.getItem(purchaseTotalPriceKey(ctx.chatbotUserId));
        Console.log({ ctx },{ ctx },`✅ Tracked purchase amount: ${amount}`);

        if (amount) {
          reportPurchase({amount, ctx});
        }
    });
  });
}

function getSelectorElement({ selector, ctx }: { selector: string, ctx: Readonly<Context>}): ReturnType<typeof document.querySelector> {
  const cleanedSelector = selector ? selector.trim() : "";

  try {
    Console.log({ ctx },{ ctx },"Searching for selector: ", cleanedSelector);
    return document.querySelector(cleanedSelector);
  } catch {
    Console.warn({ ctx }, '⚠️ Found invalid selector:', cleanedSelector);
    return null;
  }
}

function getCheckoutPurchaseSelectors({ ctx }: { ctx: Readonly<Context> }): string[] {
  const { checkoutPurchaseSelector: basePurchaseSelector } = ctx.config;
  
  if (!basePurchaseSelector) {
    return [""];
  }

  if (ctx.isPreviewMode && basePurchaseSelector) {
    return ["#purchase-tracking-checkout-purchase", "#purchase-tracking-checkout-purchase-alternative"];
  }

  try {
    const checkoutPurchaseSelector = JSON.parse(basePurchaseSelector);

    if (!Array.isArray(checkoutPurchaseSelector)) {
      return [checkoutPurchaseSelector];
    }

    return checkoutPurchaseSelector;
  } catch {
    return [basePurchaseSelector];
  }
}

function reportPurchase({ amount, ctx }: { amount: string, ctx: Readonly<Context> }) {
  if (localStorage.getItem(purchaseKey(ctx.chatbotUserId))) {
    hasReportedPurchase = true;
    Console.log({ ctx },{ ctx },'🛒 Purchase already reported for user:', ctx.chatbotUserId);
    return;
  }

  const backendUrl = Server.getUrl({ ctx });
  const currency = ctx.config.currency || 'DKK';
  Console.log({ ctx },{ ctx },'🛒 Reporting purchase to backend:', {
    userId: ctx.chatbotUserId,
    chatbotId: ctx.chatbotID,
    amount: amount,
    currency: currency,
    endpoint: `${backendUrl}/purchases`
  });

  try {
    const formData = new URLSearchParams({
      user_id: ctx.chatbotUserId,
      chatbot_id: ctx.chatbotID,
      amount: amount,
      currency: currency
    });

    const success = navigator.sendBeacon(`${backendUrl}/purchases`, formData);

    if (success) {
      hasReportedPurchase = true;
      localStorage.setItem(purchaseKey(ctx.chatbotUserId), 'true');
      Console.log({ ctx },{ ctx },'✅ Purchase reported successfully (queued via Beacon)');
    } else {
      Console.error({ ctx }, '❌ Failed to queue purchase beacon');
    }
  } catch (err) {
    Console.error({ ctx },'❌ Failed to send purchase beacon:', err);
  }
}

function parsePriceFromText({ priceText, ctx }: { priceText: string, ctx: Readonly<Context> }) {
  Console.log({ ctx },`🛒 Parsing price text: "${priceText}"`);

  // Handle Danish/European format (1.148,00 kr)
  const danishMatches = priceText.match(/(\d{1,3}(?:\.\d{3})*),(\d{2})\s*kr\.?/gi);
  const regularMatches = priceText.match(/\d[\d.,]*/g);

  Console.log({ ctx },`🛒 Danish matches:`, danishMatches);
  Console.log({ ctx },`🛒 Regular matches:`, regularMatches);

  let allMatches: string[] = [];
  if (danishMatches) allMatches = allMatches.concat(danishMatches);
  if (regularMatches) allMatches = allMatches.concat(regularMatches);

  let highestPrice = 0;

  if (allMatches && allMatches.length > 0) {
    for (const match of allMatches) {
      Console.log({ ctx },`🛒 Processing match: "${match}"`);
      let cleanedMatch = match;

      // Handle "kr" suffix (Danish currency)
      if (match.includes('kr')) {
        cleanedMatch = match.replace(/\s*kr\.?/gi, '').trim();

        if (cleanedMatch.includes('.') && cleanedMatch.includes(',')) {
          cleanedMatch = cleanedMatch.replace(/\./g, '').replace(',', '.');
        } else if (cleanedMatch.includes(',')) {
          cleanedMatch = cleanedMatch.replace(',', '.');
        }
      } else {
        // Locale-aware parsing
        cleanedMatch = match.replace(/[^\d.,]/g, '');

        if (cleanedMatch.includes('.') && cleanedMatch.includes(',')) {
          const lastCommaIndex = cleanedMatch.lastIndexOf(',');
          const lastPeriodIndex = cleanedMatch.lastIndexOf('.');

          if (lastPeriodIndex < lastCommaIndex && cleanedMatch.length - lastCommaIndex - 1 === 2) {
            // Danish format: 1.148,00
            cleanedMatch = cleanedMatch.replace(/\./g, '').replace(',', '.');
          } else {
            // US format: 1,148.00
            cleanedMatch = cleanedMatch.replace(/,/g, '');
          }
        } else if (cleanedMatch.includes(',')) {
          const parts = cleanedMatch.split(',');
          if (parts.length === 2 && parts[1].length <= 2) {
            cleanedMatch = cleanedMatch.replace(',', '.');
          } else {
            cleanedMatch = cleanedMatch.replace(/,/g, '');
          }
        }
      }

      Console.log({ ctx },`🛒 Cleaned match: "${cleanedMatch}"`);
      const numValue = parseFloat(cleanedMatch);
      Console.log({ ctx },`🛒 Parsed number: ${numValue}`);
      if (!isNaN(numValue) && numValue > highestPrice) {
        highestPrice = numValue;
      }
    }
  }

  return highestPrice > 0 ? highestPrice : null;
}

function purchaseKey(userId: string) {
  return `purchaseReported_${userId}`;
}

function purchaseTotalPriceKey(userId: string) {
  return `purchaseTotalPriceKey_${userId}`;
}
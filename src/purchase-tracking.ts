function handlePurchaseTracking({ ctx }: { ctx: Readonly<Context> }) {
  // Handle purchase tracking
  console.log('🛒 Purchase tracking check:', {
    enabled: ctx.config.purchaseTrackingEnabled,
    isCheckoutPage: isCheckoutPage({ ctx }),
    isCheckoutConfirmationPage: isCheckoutConfirmationPage({ ctx }),
    userId: ctx.chatbotUserId || 'waiting for iframe...'
  });

  if (ctx.config.purchaseTrackingEnabled && (isCheckoutPage({ ctx }) || isCheckoutConfirmationPage({ ctx }))) {
    console.log('🛒 On checkout page - will check for purchase after iframe loads and sends userId...');
    // Give iframe time to load and send userId (2-6 seconds with retries)
    // The postMessage listener will update chatbotUserId when received
    setTimeout(checkForPurchase, 2000); // Wait for iframe to load
    setTimeout(checkForPurchase, 4000); // Retry in case price loads dynamically
    setTimeout(checkForPurchase, 6000); // Final retry
  } else if (ctx.config.purchaseTrackingEnabled) {
    console.log('🛒 Not checkout page.');
  } else {
    console.log('🛒 Purchase tracking disabled');
  }
}


function purchaseKey(userId) {
  return `purchaseReported_${userId}`;
}

function purchaseTotalPriceKey(userId) {
  return `purchaseTotalPriceKey_${userId}`;
}

function isCheckoutConfirmationPage({ ctx }: { ctx: Readonly<Context> }) {
  console.log('🔍 Checking if current page is confirmation page:', window.location.href);

  if (ctx.isPreviewMode && ctx.config.purchaseTrackingEnabled && ctx.config.checkoutConfirmationPagePatterns) {
    // In preview mode assume the checkout confirmation page is current page if purchase tracking is enabled
    return true;
  }


  if (!ctx.config.checkoutConfirmationPagePatterns) {
    return false;
  }

  return matchesPagePattern(ctx.config.checkoutConfirmationPagePatterns)
}

function isCheckoutPage({ ctx }: { ctx: Readonly<Context> }) {
  console.log('🔍 Checking if current page is checkout:', window.location.href);

  if (ctx.isPreviewMode && ctx.config.purchaseTrackingEnabled) {
    // In preview mode assume the checkout page is current page if purchase tracking is enabled
    return true;
  }

  // Use custom patterns from config if available
  if (matchesPagePattern(ctx.config.checkoutPagePatterns)) {
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

  console.log('🔍 Default checkout checks:', defaultChecks);
  const result = defaultChecks.some(check => check);
  console.log('🔍 isCheckoutPage result:', result);
  return result;
}

function matchesPagePattern(pagePatterns) {
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
            console.log(`🔍 Path match check: "${path}" === "${pattern}" ? ${result}`);
            return result;
          } else {
            // Substring match in URL
            const result = window.location.href.includes(pattern);
            console.log(`🔍 Substring match check: "${window.location.href}" includes "${pattern}" ? ${result}`);
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
    console.log('🛒 No userId yet, waiting for iframe to send it...');
    return;
  }

  // CRITICAL: Only track purchases for users who actually interacted with the chatbot
  if (!hasInteractedWithChatbot) {
    console.log('🛒 User has not interacted with chatbot, skipping purchase tracking');
    return;
  }

  if (hasReportedPurchase) {
    console.log('🛒 Purchase already reported for user:', ctx.chatbotUserId);
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
    console.log('Track purchase at checkout confirmation');
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

  const priceElement = getSelectorElement(checkoutPriceSelector);

  if (!priceElement) {
    return;
  }

  const amount = parsePriceFromText(priceElement.textContent.trim());
  if (amount) {
    // Track amount in local storage incase confirmation page is used as tracking indicator (or any other page)
    localStorage.setItem(purchaseTotalPriceKey(ctx.chatbotUserId), String(amount));
  }
}

function trackPurchase({ ctx }: { ctx: Readonly<Context> }) {
  console.log('Track purchase at checkout');

  const checkoutPurchaseSelectors = getCheckoutPurchaseSelectors({ ctx });

  if (checkoutPurchaseSelectors && !checkoutPurchaseSelectors.length) {
    console.warn('⚠️ Missing purchase selector configuration');
    return;
  }

  const purchaseButtons = checkoutPurchaseSelectors
    .map(getSelectorElement)
    .filter(purchaseButton => !!purchaseButton);

  if (checkoutPurchaseSelectors.length !== purchaseButtons.length) {
      console.warn(`⚠️ Expected ${checkoutPurchaseSelectors.length} selectors found ${purchaseButtons.length} selectors`);
      return;
  }

  console.log(`✅ Tracking purchase button(s): ${checkoutPurchaseSelectors}`);

  purchaseButtons.forEach(purchaseButton => {
    purchaseButton.addEventListener("click", async () => {
        const amount = localStorage.getItem(purchaseTotalPriceKey(ctx.chatbotUserId));
        console.log(`✅ Tracked purchase amount: ${amount}`);

        if (amount) {
          reportPurchase({amount, ctx});
        }
    });
  });
}

function getSelectorElement(selector: string): ReturnType<typeof document.querySelector> {
  const cleanedSelector = selector ? selector.trim() : "";

  try {
    console.log("Searching for selector: ", cleanedSelector);
    return document.querySelector(cleanedSelector);
  } catch {
    console.warn('⚠️ Found invalid selector:', cleanedSelector);
    return null;
  }
}

function getCheckoutPurchaseSelectors({ ctx }: { ctx: Readonly<Context> }): string[] {
  const { checkoutPurchaseSelector: basePurchaseSelector } = ctx.config;
  
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
    console.log('🛒 Purchase already reported for user:', ctx.chatbotUserId);
    return;
  }

  const backendUrl = getBackendUrl();
  const currency = ctx.config.currency || 'DKK';
  console.log('🛒 Reporting purchase to backend:', {
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
      console.log('✅ Purchase reported successfully (queued via Beacon)');
    } else {
      Console.error({ ctx }, '❌ Failed to queue purchase beacon');
    }
  } catch (err) {
    console.error('❌ Failed to send purchase beacon:', err);
  }
}
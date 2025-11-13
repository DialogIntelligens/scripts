import { Context } from "../types";
import { Logger, Server } from "../utils";

export function handlePurchaseTracking({ ctx }: { ctx: Readonly<Context> }) {
  // Handle purchase tracking
  Logger.log("🛒 Purchase tracking check:", {
    enabled: ctx.getConfig().purchaseTrackingEnabled,
    isCheckoutPage: isCheckoutPage({ ctx }),
    isCheckoutConfirmationPage: isCheckoutConfirmationPage({ ctx }),
    userId: ctx.getChatbotUserId() || "waiting for iframe...",
  });

  if (
    ctx.getConfig().purchaseTrackingEnabled &&
    (isCheckoutPage({ ctx }) || isCheckoutConfirmationPage({ ctx }))
  ) {
    Logger.log(
      "🛒 On checkout page - will check for purchase after iframe loads and sends userId...",
    );
    // Give iframe time to load and send userId (2-6 seconds with retries)
    // The postMessage listener will update chatbotUserId when received
    setTimeout(() => checkForPurchase({ ctx }), 2000); // Wait for iframe to load
    setTimeout(() => checkForPurchase({ ctx }), 4000); // Retry in case price loads dynamically
    setTimeout(() => checkForPurchase({ ctx }), 6000); // Final retry
  } else if (
    ctx.getConfig().purchaseTrackingEnabled &&
    ctx.hasInteractedWithChatbot()
  ) {
    Logger.log("🛒 Not checkout page. Tracking cart price every 5 seconds.");
    setInterval(() => trackTotalPurchasePrice({ ctx }), 5000);
  } else {
    Logger.log("🛒 Purchase tracking disabled");
  }
}

function isCheckoutConfirmationPage({ ctx }: { ctx: Readonly<Context> }) {
  Logger.log(
    "🔍 Checking if current page is confirmation page:",
    window.location.href,
  );

  if (
    ctx.isPreviewMode &&
    ctx.getConfig().purchaseTrackingEnabled &&
    ctx.getConfig().checkoutConfirmationPagePatterns
  ) {
    // In preview mode assume the checkout confirmation page is current page if purchase tracking is enabled
    return true;
  }

  const checkoutConfirmationPagePatterns =
    ctx.getConfig().checkoutConfirmationPagePatterns;

  if (!checkoutConfirmationPagePatterns) {
    Logger.log("Confirmation page not set: ", checkoutConfirmationPagePatterns);
    return false;
  }

  return matchesPagePattern({
    pagePatterns: checkoutConfirmationPagePatterns,
  });
}

function isCheckoutPage({ ctx }: { ctx: Readonly<Context> }) {
  Logger.log("🔍 Checking if current page is checkout:", window.location.href);

  if (ctx.isPreviewMode && ctx.getConfig().purchaseTrackingEnabled) {
    // In preview mode assume the checkout page is current page if purchase tracking is enabled
    return true;
  }

  if (
    matchesPagePattern({
      pagePatterns: ctx.getConfig().checkoutPagePatterns ?? "",
    })
  ) {
    Logger.log("Is checkout page check: true");
    return true;
  }

  Logger.log("Is checkout page check: false");
  return false;
}

function matchesPagePattern({ pagePatterns }: { pagePatterns: string }) {
  if (!pagePatterns) {
    return false;
  }

  Logger.log("Checking for page patterns match: ", pagePatterns);
  const patterns = pagePatterns
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (patterns) {
    try {
      return patterns.some((pattern) => {
        // Support both URL substring matching and path matching
        if (pattern.startsWith("/") && pattern.endsWith("/")) {
          const path = window.location.pathname.replace(/\/$/, "");
          const result = path === pattern.replace(/\/$/, "");

          Logger.log(
            `🔍 Path match check: "${path}" === "${pattern}" ? ${result}`,
          );

          return result;
        } else {
          const result = window.location.href.includes(pattern);

          Logger.log(
            `🔍 Substring match check: "${window.location.href}" includes "${pattern}" ? ${result}`,
          );

          return result;
        }
      });
    } catch (error) {
      Logger.error("Error checking page patterns: ", error);
    }
  }

  return false;
}

function checkForPurchase({ ctx }: { ctx: Readonly<Context> }) {
  // Wait for userId from iframe (set by postMessage listener)
  if (!ctx.getChatbotUserId()) {
    Logger.log("🛒 No userId yet, waiting for iframe to send it...");
    return;
  }

  // CRITICAL: Only track purchases for users who actually interacted with the chatbot
  if (!ctx.hasInteractedWithChatbot()) {
    Logger.log(
      "🛒 User has not interacted with chatbot, skipping purchase tracking",
    );
    return;
  }

  if (hasReportedPuchase({ ctx })) {
    Logger.log(
      "🛒 Purchase already reported for user:",
      ctx.getChatbotUserId(),
    );
    return;
  }

  if (isCheckoutPage({ ctx })) {
    trackTotalPurchasePrice({ ctx });
  }

  // If checkout confirmation page patterns is set use that instead of checkout page patterns to track purchase
  if (
    isCheckoutPage({ ctx }) &&
    !ctx.getConfig().checkoutConfirmationPagePatterns
  ) {
    trackPurchase({ ctx });
  }

  if (isCheckoutConfirmationPage({ ctx })) {
    Logger.log("Track purchase at checkout confirmation");
    const amount = localStorage.getItem(
      purchaseTotalPriceKey(ctx.getChatbotUserId()),
    );

    if (amount) {
      reportPurchase({ amount, ctx });
    }
  }
}

function trackTotalPurchasePrice({ ctx }: { ctx: Readonly<Context> }) {
  const { checkoutPriceSelector: basePriceSelector } = ctx.getConfig();

  // PREVIEW_MODE_ONLY: If checkout price selector is set then override it to target element in preview.html with matching selector
  const checkoutPriceSelector =
    ctx.isPreviewMode && basePriceSelector
      ? "#purchase-tracking-checkout-price"
      : basePriceSelector;

  if (!checkoutPriceSelector) {
    return;
  }

  const priceElement = getSelectorElement({
    selector: checkoutPriceSelector,
    ctx,
  });

  if (!priceElement) {
    return;
  }

  const amount = parsePriceFromText({
    priceText: priceElement.textContent.trim(),
    ctx,
  });
  if (amount) {
    // Track amount in local storage incase confirmation page is used as tracking indicator (or any other page)
    localStorage.setItem(
      purchaseTotalPriceKey(ctx.getChatbotUserId()),
      String(amount),
    );
  }
}

function trackPurchase({ ctx }: { ctx: Readonly<Context> }) {
  Logger.log("Track purchase at checkout");

  const checkoutPurchaseSelectors = getCheckoutPurchaseSelectors({ ctx });

  if (checkoutPurchaseSelectors && !checkoutPurchaseSelectors.length) {
    Logger.warn("⚠️ Missing purchase selector configuration");
    return;
  }

  const purchaseButtons = checkoutPurchaseSelectors
    .map((selector) => getSelectorElement({ selector, ctx }))
    .filter((purchaseButton) => !!purchaseButton);

  if (checkoutPurchaseSelectors.length !== purchaseButtons.length) {
    Logger.warn(
      `⚠️ Expected ${checkoutPurchaseSelectors.length} selectors found ${purchaseButtons.length} selectors`,
    );
    return;
  }

  Logger.log(`✅ Tracking purchase button(s): ${checkoutPurchaseSelectors}`);

  purchaseButtons.forEach((purchaseButton) => {
    purchaseButton.addEventListener("click", async () => {
      const amount = localStorage.getItem(
        purchaseTotalPriceKey(ctx.getChatbotUserId()),
      );
      Logger.log(`✅ Tracked purchase amount: ${amount}`);

      if (amount) {
        reportPurchase({ amount, ctx });
      }
    });
  });
}

function getSelectorElement({
  selector,
  ctx,
}: {
  selector: string;
  ctx: Readonly<Context>;
}): ReturnType<typeof document.querySelector> {
  const cleanedSelector = selector ? selector.trim() : "";

  try {
    Logger.log("Searching for selector: ", cleanedSelector);
    return document.querySelector(cleanedSelector);
  } catch {
    Logger.warn("⚠️ Found invalid selector:", cleanedSelector);
    return null;
  }
}

function getCheckoutPurchaseSelectors({
  ctx,
}: {
  ctx: Readonly<Context>;
}): string[] {
  const { checkoutPurchaseSelector: basePurchaseSelector } = ctx.getConfig();

  if (!basePurchaseSelector) {
    return [""];
  }

  if (ctx.isPreviewMode && basePurchaseSelector) {
    return [
      "#purchase-tracking-checkout-purchase",
      "#purchase-tracking-checkout-purchase-alternative",
    ];
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

function reportPurchase({
  amount,
  ctx,
}: {
  amount: string;
  ctx: Readonly<Context>;
}) {
  if (hasReportedPuchase({ ctx })) {
    Logger.log(
      "🛒 Purchase already reported for user:",
      ctx.getChatbotUserId(),
    );
    return;
  }

  const backendUrl = Server.getUrl({ ctx });
  const currency = ctx.getConfig().currency || "DKK";
  Logger.log("🛒 Reporting purchase to backend:", {
    userId: ctx.getChatbotUserId(),
    chatbotId: ctx.getChatbotId(),
    amount: amount,
    currency: currency,
    endpoint: `${backendUrl}/purchases`,
  });

  try {
    const formData = new URLSearchParams({
      user_id: ctx.getChatbotUserId(),
      chatbot_id: ctx.getChatbotId(),
      amount: amount,
      currency: currency,
    });

    const success = navigator.sendBeacon(`${backendUrl}/purchases`, formData);

    if (success) {
      localStorage.setItem(purchaseKey(ctx.getChatbotUserId()), "true");
      Logger.log(
        { ctx },
        "✅ Purchase reported successfully (queued via Beacon)",
      );
    } else {
      Logger.error("❌ Failed to queue purchase beacon");
    }
  } catch (err) {
    Logger.error("❌ Failed to send purchase beacon:", err);
  }
}

function parsePriceFromText({
  priceText,
  ctx,
}: {
  priceText: string;
  ctx: Readonly<Context>;
}) {
  Logger.log(`🛒 Parsing price text: "${priceText}"`);

  // Handle Danish/European format (1.148,00 kr)
  const danishMatches = priceText.match(
    /(\d{1,3}(?:\.\d{3})*),(\d{2})\s*kr\.?/gi,
  );
  const regularMatches = priceText.match(/\d[\d.,]*/g);

  Logger.log(`🛒 Danish matches:`, danishMatches);
  Logger.log(`🛒 Regular matches:`, regularMatches);

  let allMatches: string[] = [];
  if (danishMatches) allMatches = allMatches.concat(danishMatches);
  if (regularMatches) allMatches = allMatches.concat(regularMatches);

  let highestPrice = 0;

  if (allMatches && allMatches.length > 0) {
    for (const match of allMatches) {
      Logger.log(`🛒 Processing match: "${match}"`);
      let cleanedMatch = match;

      // Handle "kr" suffix (Danish currency)
      if (match.includes("kr")) {
        cleanedMatch = match.replace(/\s*kr\.?/gi, "").trim();

        if (cleanedMatch.includes(".") && cleanedMatch.includes(",")) {
          cleanedMatch = cleanedMatch.replace(/\./g, "").replace(",", ".");
        } else if (cleanedMatch.includes(",")) {
          cleanedMatch = cleanedMatch.replace(",", ".");
        }
      } else {
        // Locale-aware parsing
        cleanedMatch = match.replace(/[^\d.,]/g, "");

        if (cleanedMatch.includes(".") && cleanedMatch.includes(",")) {
          const lastCommaIndex = cleanedMatch.lastIndexOf(",");
          const lastPeriodIndex = cleanedMatch.lastIndexOf(".");

          if (
            lastPeriodIndex < lastCommaIndex &&
            cleanedMatch.length - lastCommaIndex - 1 === 2
          ) {
            // Danish format: 1.148,00
            cleanedMatch = cleanedMatch.replace(/\./g, "").replace(",", ".");
          } else {
            // US format: 1,148.00
            cleanedMatch = cleanedMatch.replace(/,/g, "");
          }
        } else if (cleanedMatch.includes(",")) {
          const parts = cleanedMatch.split(",");
          if (parts.length === 2 && parts[1].length <= 2) {
            cleanedMatch = cleanedMatch.replace(",", ".");
          } else {
            cleanedMatch = cleanedMatch.replace(/,/g, "");
          }
        }
      }

      Logger.log(`🛒 Cleaned match: "${cleanedMatch}"`);
      const numValue = parseFloat(cleanedMatch);
      Logger.log(`🛒 Parsed number: ${numValue}`);
      if (!isNaN(numValue) && numValue > highestPrice) {
        highestPrice = numValue;
      }
    }
  }

  return highestPrice > 0 ? highestPrice : null;
}

function hasReportedPuchase({ ctx }: { ctx: Readonly<Context> }) {
  return !!localStorage.getItem(purchaseKey(ctx.getChatbotUserId()));
}

function purchaseKey(userId: string) {
  let today = new Date();

  let year = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");

  let date = `${year}-${month}-${day}`;

  return `purchaseReported_${date}_${userId}`;
}

function purchaseTotalPriceKey(userId: string) {
  return `purchaseTotalPriceKey_${userId}`;
}

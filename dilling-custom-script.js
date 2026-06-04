(function () {
  "use strict";

  var SCRIPT_NAME = "dilling-custom-script.js";
  var INIT_FLAG = "__DI_DILLING_CUSTOM_SCRIPT_INIT__";
  var UNIVERSAL_SCRIPT_ID = "di-dilling-hidden-universal-chatbot";
  var STYLE_ID = "di-dilling-custom-launcher-styles";
  var ROOT_ID = "di-dilling-custom-launcher";
  var MESSAGE = "Do you need any help?";
  var MESSAGE_TRANSLATIONS = {
    danish: "Har du brug for hjælp?",
    english: MESSAGE,
    swedish: "Behöver du hjälp?",
    norwegian: "Trenger du hjelp?",
    german: "Brauchen Sie Hilfe?",
    dutch: "Heb je hulp nodig?",
    french: "Avez-vous besoin d'aide ?",
    italian: "Hai bisogno di aiuto?",
    finnish: "Tarvitsetko apua?",
    polish: "Czy potrzebujesz pomocy?",
    icelandic: "Þarftu hjálp?",
    estonian: "Kas vajad abi?",
    lithuanian: "Ar reikia pagalbos?",
    latvian: "Vai jums nepieciešama palīdzība?",
  };
  var LANGUAGE_ALIASES = {
    da: "danish",
    dk: "danish",
    en: "english",
    gb: "english",
    uk: "english",
    us: "english",
    sv: "swedish",
    se: "swedish",
    nb: "norwegian",
    nn: "norwegian",
    no: "norwegian",
    de: "german",
    ch: "german",
    nl: "dutch",
    fr: "french",
    it: "italian",
    fi: "finnish",
    pl: "polish",
    is: "icelandic",
    et: "estonian",
    lt: "lithuanian",
    lv: "latvian",
  };
  var CHATBOT_ID_LANGUAGES = {
    dillingdk: "danish",
    dillingch: "german",
    dillingus: "english",
    dillingfi: "finnish",
    dillinguk: "english",
    dillingse: "swedish",
    dillingnl: "dutch",
    dillingno: "norwegian",
    dillingfr: "french",
    dillingeu: "english",
    dillingde: "german",
  };
  var EXPAND_DELAY_MS = 5000;
  var COLLAPSE_DELAY_MS = 5000;
  var BASE_LAUNCHER_BG = "#262524";
  var DARK_LAUNCHER_FG = "#ffffff";
  var LIGHT_LAUNCHER_FG = "#262524";

  var iconSvg =
    '<svg class="di-dilling-custom-launcher__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.33 59.33" aria-hidden="true" focusable="false">' +
    '<rect fill="var(--di-dilling-custom-launcher-bg,#262524)" width="59.33" height="59.33" rx="5.67" ry="5.67"/>' +
    "<g>" +
    '<path fill="var(--di-dilling-custom-launcher-fg,#fff)" d="M44.13,46.22c-.26,0-.51-.1-.7-.29l-5.67-5.71h-18.3c-1.53,0-2.77-1.24-2.77-2.77v-8.18c0-.55.44-.99.99-.99s.99.44.99.99v8.18c0,.43.35.79.78.79h18.72c.26,0,.52.11.7.29l4.26,4.29v-21.03c0-.43-.35-.79-.78-.79h-15.46c-.55,0-.99-.44-.99-.99s.44-.99.99-.99h15.46c1.53,0,2.77,1.24,2.77,2.77v23.43c0,.4-.24.76-.61.92-.12.05-.25.08-.38.08Z"/>' +
    '<path fill="var(--di-dilling-custom-launcher-fg,#fff)" d="M17.69,25.24c-.39,0-.71-.32-.71-.71,0-2.21-1.59-3.81-3.78-3.81-.39,0-.71-.32-.71-.71h0c0-.4.32-.71.71-.71,2.19,0,3.78-1.6,3.78-3.81,0-.39.32-.71.71-.71s.71.32.71.71c0,2.21,1.59,3.81,3.78,3.81.39,0,.71.32.71.71s-.32.71-.71.71c-2.19,0-3.78,1.6-3.78,3.81,0,.39-.32.71-.71.71ZM15.89,20.01c.75.44,1.37,1.06,1.8,1.81.44-.75,1.05-1.37,1.8-1.81-.75-.44-1.37-1.06-1.8-1.81-.44.75-1.05,1.37-1.8,1.81Z"/>' +
    '<path fill="var(--di-dilling-custom-launcher-fg,#fff)" d="M23.46,14.9h-.79v-.79c0-.23-.19-.42-.42-.42s-.42.19-.42.42v.79h-.79c-.23,0-.42.19-.42.42s.19.42.42.42h.79v.79c0,.23.19.42.42.42s.42-.19.42-.42v-.79h.79c.23,0,.42-.19.42-.42s-.19-.42-.42-.42Z"/>' +
    "</g>" +
    "</svg>";

  var notificationSvg =
    '<svg class="di-dilling-custom-launcher__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.33 59.33" aria-hidden="true" focusable="false">' +
    '<rect fill="var(--di-dilling-custom-launcher-bg,#262524)" width="59.33" height="59.33" rx="5.67" ry="5.67"/>' +
    "<g>" +
    '<path fill="var(--di-dilling-custom-launcher-fg,#fff)" d="M42.35,19.02h-15.46c-.55,0-.99.44-.99.99s.44.99.99.99h15.46c.43,0,.79.35.79.79v21.03l-4.26-4.29c-.19-.19-.44-.29-.7-.29h-18.72c-.43,0-.78-.35-.78-.79v-8.18c0-.55-.44-.99-.99-.99s-.99.44-.99.99v8.18c0,1.53,1.24,2.77,2.77,2.77h18.3l5.67,5.71c.19.19.45.29.7.29.13,0,.26-.02.38-.08.37-.15.61-.51.61-.92v-23.43c0-1.53-1.24-2.77-2.77-2.77Z"/>' +
    '<path fill="var(--di-dilling-custom-launcher-fg,#fff)" d="M16.99,24.53c0,.39.32.71.71.71s.71-.32.71-.71c0-.02,0-.05,0-.07.03-2.17,1.61-3.74,3.78-3.74.39,0,.71-.32.71-.71s-.32-.71-.71-.71c-1.04,0-1.99-.37-2.68-1.04-.72-.7-1.1-1.66-1.1-2.77h0c0-.39-.32-.71-.71-.71s-.71.32-.71.71c0,.02,0,.05,0,.07-.03,2.17-1.61,3.74-3.78,3.74-.39,0-.71.32-.71.71h0c0,.4.32.71.71.71,1.04,0,1.99.37,2.68,1.04.72.7,1.1,1.66,1.1,2.77h0ZM15.9,20.01c.35-.21.68-.45.98-.74.32-.32.6-.67.82-1.06.44.75,1.05,1.36,1.8,1.8-.35.21-.68.45-.98.74-.32.32-.6.67-.82,1.06-.43-.75-1.05-1.36-1.8-1.8Z"/>' +
    '<path fill="var(--di-dilling-custom-launcher-fg,#fff)" d="M21.03,15.75h.79v.79c0,.23.19.42.42.42s.42-.19.42-.42v-.79h.79c.23,0,.42-.19.42-.42s-.19-.42-.42-.42h-.79v-.79c0-.23-.19-.42-.42-.42s-.42.19-.42.42v.79h-.79c-.23,0-.42.19-.42.42s.19.42.42.42Z"/>' +
    "</g>" +
    '<rect fill="var(--di-dilling-custom-launcher-fg,#fff)" x="37.49" y="14.95" width="12.93" height="12.93" rx="2.83" ry="2.83"/>' +
    '<path fill="var(--di-dilling-custom-launcher-bg,#262524)" d="M43.81,19.93c-.33.37-.97.65-1.5.69v-.94c.77-.11,1.46-.64,1.68-1.06h.86v5.6h-1.04v-4.29Z"/>' +
    "</svg>";

  var closeSvg =
    '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">' +
    '<path d="M3 3l8 8M11 3l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    "</svg>";

  var css =
    "#chat-container #chat-button,#chat-container[data-di-hidden-universal='true'] #chat-button,.di-hidden-universal-chatbot #chat-container #chat-button,#chatbase-message-bubbles,#chat-container #minimize-button,#chat-container #plus-overlay,#chat-container .notification-badge{display:none!important;pointer-events:none!important}" +
    "#di-dilling-custom-launcher{--di-dilling-custom-launcher-bg:#262524;--di-dilling-custom-launcher-fg:#fff;--di-dilling-launcher-size:52px;--di-dilling-bar-width:min(208px,calc(100vw - 32px));position:fixed;right:22px;bottom:34px;z-index:2147483000;display:flex;align-items:center;justify-content:flex-end;font-family:Montserrat,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}" +
    ".di-dilling-custom-launcher__button{position:relative;display:inline-flex;align-items:center;justify-content:center;width:var(--di-dilling-launcher-size);height:var(--di-dilling-launcher-size);padding:0;border:0;border-radius:6px;background:transparent;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.18);transform-origin:right center;transition:transform 220ms cubic-bezier(.22,1,.36,1),box-shadow 220ms ease,color 180ms ease}" +
    ".di-dilling-custom-launcher__button.is-entering{animation:di-dilling-icon-enter 360ms cubic-bezier(.22,1,.36,1) forwards}" +
    ".di-dilling-custom-launcher__button:hover{transform:translateY(-1px);box-shadow:0 14px 32px rgba(0,0,0,.24)}" +
    ".di-dilling-custom-launcher__button:focus-visible,.di-dilling-custom-launcher__bar:focus-visible,.di-dilling-custom-launcher__close:focus-visible{outline:2px solid var(--di-dilling-custom-launcher-bg,#262524);outline-offset:3px}" +
    ".di-dilling-custom-launcher__icon{display:block;width:var(--di-dilling-launcher-size);height:var(--di-dilling-launcher-size)}" +
    ".di-dilling-custom-launcher__icon rect,.di-dilling-custom-launcher__icon path{transition:fill 180ms ease}" +
    ".di-dilling-custom-launcher__bar{position:relative;display:inline-flex;align-items:center;justify-content:flex-start;width:var(--di-dilling-launcher-size);height:var(--di-dilling-launcher-size);max-width:var(--di-dilling-bar-width);overflow:hidden;padding:0;border:0;border-radius:6px;color:var(--di-dilling-custom-launcher-fg,#fff);background-color:var(--di-dilling-custom-launcher-bg,#262524);cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.18);transform-origin:right center;transition:background-color 180ms ease,color 180ms ease;animation:di-dilling-expand 560ms cubic-bezier(.22,1,.36,1) forwards}" +
    ".di-dilling-custom-launcher__bar.is-collapsing{animation:di-dilling-collapse 900ms cubic-bezier(.22,1,.36,1) forwards;pointer-events:none}" +
    ".di-dilling-custom-launcher__close{display:inline-flex;align-items:center;justify-content:center;flex:0 0 22px;width:22px;height:22px;margin-left:14px;margin-right:16px;padding:0;border:0;border-radius:50%;color:currentColor;background:transparent;cursor:pointer;opacity:0;transform:translateX(8px);animation:di-dilling-bar-content 260ms ease 150ms forwards}" +
    ".di-dilling-custom-launcher__close svg{width:12px;height:12px}.di-dilling-custom-launcher__message{display:block;overflow:hidden;font-size:13px;line-height:1.2;white-space:nowrap;text-overflow:ellipsis;opacity:0;transform:translateX(8px);animation:di-dilling-bar-content 260ms ease 170ms forwards}" +
    ".di-dilling-custom-launcher__collapse-icon{position:absolute;top:0;right:0;bottom:0;z-index:2;display:flex;align-items:center;justify-content:center;width:var(--di-dilling-launcher-size);opacity:0;transform:scale(.96);pointer-events:none}" +
    ".di-dilling-custom-launcher__bar.is-collapsing .di-dilling-custom-launcher__close,.di-dilling-custom-launcher__bar.is-collapsing .di-dilling-custom-launcher__message{animation:di-dilling-bar-content-out 160ms ease forwards}" +
    ".di-dilling-custom-launcher__bar.is-collapsing .di-dilling-custom-launcher__collapse-icon{animation:di-dilling-collapse-icon 540ms ease 180ms forwards}" +
    "@keyframes di-dilling-expand{from{width:var(--di-dilling-launcher-size)}to{width:var(--di-dilling-bar-width)}}" +
    "@keyframes di-dilling-collapse{from{width:var(--di-dilling-bar-width)}to{width:var(--di-dilling-launcher-size)}}" +
    "@keyframes di-dilling-bar-content{to{opacity:1;transform:translateX(0)}}" +
    "@keyframes di-dilling-bar-content-out{to{opacity:0;transform:translateX(8px)}}" +
    "@keyframes di-dilling-collapse-icon{to{opacity:1;transform:scale(1)}}" +
    "@keyframes di-dilling-icon-enter{from{opacity:0;transform:translateX(0) scale(.96)}to{opacity:1;transform:translateX(0) scale(1)}}" +
    "@media(max-width:640px){#di-dilling-custom-launcher{right:14px;bottom:26px;--di-dilling-bar-width:min(208px,calc(100vw - 28px))}}";

  var ownScript = getOwnScript();
  var chatbotId = getRequiredChatbotId(ownScript);
  if (!chatbotId) {
    return;
  }
  if (window[INIT_FLAG]) {
    return;
  }
  window[INIT_FLAG] = true;

  loadUniversalChatbot(ownScript, chatbotId);
  onReady(function () {
    injectStyles();
    initLauncher();
  });

  function getOwnScript() {
    var currentScript = document.currentScript;
    if (currentScript instanceof HTMLScriptElement && isOwnScriptUrl(currentScript.src)) {
      return currentScript;
    }
    var scripts = Array.prototype.slice.call(document.scripts);
    for (var i = scripts.length - 1; i >= 0; i -= 1) {
      if (isOwnScriptUrl(scripts[i].src)) {
        return scripts[i];
      }
    }
    return null;
  }

  function isOwnScriptUrl(src) {
    try {
      return new URL(src, window.location.href).pathname.endsWith("/" + SCRIPT_NAME);
    } catch (error) {
      return typeof src === "string" && src.indexOf(SCRIPT_NAME) !== -1;
    }
  }

  function getRequiredChatbotId(script) {
    try {
      var value = script ? new URL(script.src, window.location.href).searchParams.get("id") : "";
      var id = value ? value.trim() : "";
      if (id) {
        return id;
      }
    } catch (error) {}
    console.error(
      "[dilling-custom-script] Missing required id. Usage: dilling-custom-script.js?id=<chatbot_id>",
    );
    return "";
  }

  function loadUniversalChatbot(script, id) {
    if (document.getElementById(UNIVERSAL_SCRIPT_ID)) {
      return;
    }
    var universalScript = document.createElement("script");
    universalScript.id = UNIVERSAL_SCRIPT_ID;
    universalScript.async = true;
    universalScript.src = buildUniversalScriptUrl(script, id);
    (document.head || document.documentElement).appendChild(universalScript);
  }

  function buildUniversalScriptUrl(script, id) {
    var src = script && script.src ? script.src : window.location.href;
    var url = new URL("universal-chatbot.js", src);
    url.searchParams.set("id", id);
    url.searchParams.set("hidden", "true");
    return url.toString();
  }

  function normalizeLanguage(value) {
    var raw = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/_/g, "-");
    if (!raw) {
      return "";
    }
    if (MESSAGE_TRANSLATIONS[raw]) {
      return raw;
    }
    var primary = raw.split("-")[0];
    return LANGUAGE_ALIASES[primary] || LANGUAGE_ALIASES[raw] || "";
  }

  function getConfiguredUiLanguage() {
    try {
      if (
        window.DialogIntelligens &&
        typeof window.DialogIntelligens.getUiLanguage === "function"
      ) {
        return window.DialogIntelligens.getUiLanguage();
      }
    } catch (error) {}
    return "";
  }

  function getLauncherMessage() {
    var configuredLanguage = getConfiguredUiLanguage();
    if (configuredLanguage) {
      return MESSAGE_TRANSLATIONS[normalizeLanguage(configuredLanguage)] || MESSAGE;
    }

    var chatbotLanguage = CHATBOT_ID_LANGUAGES[String(chatbotId || "").toLowerCase()];
    return MESSAGE_TRANSLATIONS[chatbotLanguage] || MESSAGE;
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function clamp(n, lo, hi) {
    return Math.min(hi, Math.max(lo, n));
  }

  function clamp01(n) {
    return clamp(n, 0, 1);
  }

  function parseCssRgbColor(cssColor) {
    var value = (cssColor || "").trim().toLowerCase();
    if (!value || value === "transparent") return null;

    var hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
    if (hex) {
      var raw = hex[1];
      var short = raw.length === 3 || raw.length === 4;
      function expand(part) {
        return part.length === 1 ? part + part : part;
      }
      var channelLength = short ? 1 : 2;
      var r = parseInt(expand(raw.slice(0, channelLength)), 16);
      var gStart = short ? 1 : 2;
      var bStart = short ? 2 : 4;
      var aStart = raw.length === 4 ? 3 : raw.length === 8 ? 6 : -1;
      var a =
        aStart >= 0 ? parseInt(expand(raw.slice(aStart, aStart + channelLength)), 16) / 255 : 1;
      return {
        r: r,
        g: parseInt(expand(raw.slice(gStart, gStart + channelLength)), 16),
        b: parseInt(expand(raw.slice(bStart, bStart + channelLength)), 16),
        a: a,
      };
    }

    var rgb = value.match(
      /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/,
    );
    if (rgb) {
      return {
        r: Number(rgb[1]),
        g: Number(rgb[2]),
        b: Number(rgb[3]),
        a: rgb[4] === undefined ? 1 : clamp(Number(rgb[4]), 0, 1),
      };
    }

    rgb = value.match(
      /^rgba?\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/,
    );
    if (!rgb) return null;

    function channel(part) {
      return part.endsWith("%") ? (Number(part.slice(0, -1)) / 100) * 255 : Number(part);
    }
    function alpha(part) {
      if (part === undefined) return 1;
      return part.endsWith("%") ? Number(part.slice(0, -1)) / 100 : Number(part);
    }
    return {
      r: channel(rgb[1]),
      g: channel(rgb[2]),
      b: channel(rgb[3]),
      a: clamp(alpha(rgb[4]), 0, 1),
    };
  }

  function compositeColor(backdrop, foreground) {
    return {
      r: (1 - foreground.a) * backdrop.r + foreground.a * foreground.r,
      g: (1 - foreground.a) * backdrop.g + foreground.a * foreground.g,
      b: (1 - foreground.a) * backdrop.b + foreground.a * foreground.b,
    };
  }

  function gradientPositionForPoint(backgroundImage, element, x, y) {
    var rect = element.getBoundingClientRect();
    var rx = rect.width > 0 ? clamp01((x - rect.left) / rect.width) : 0.5;
    var ry = rect.height > 0 ? clamp01((y - rect.top) / rect.height) : 0.5;
    var angleMatch = backgroundImage.match(/linear-gradient\(\s*([\d.]+)deg/i);
    var angle = angleMatch ? Number(angleMatch[1]) : NaN;
    if (!Number.isFinite(angle)) return (rx + ry) / 2;
    var normalized = ((angle % 360) + 360) % 360;
    if (normalized >= 45 && normalized < 135) return rx;
    if (normalized >= 135 && normalized < 225) return ry;
    if (normalized >= 225 && normalized < 315) return 1 - rx;
    return 1 - ry;
  }

  function parseGradientStops(backgroundImage) {
    if (!/linear-gradient\(/i.test(backgroundImage)) return [];
    var matches = Array.from(
      backgroundImage.matchAll(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})\s*(?:([\d.]+)%|([\d.]+))?/g),
    );
    return matches
      .map(function (match, index) {
        var color = parseCssRgbColor(match[1]);
        if (!color) return null;
        var rawPosition = match[2] || match[3];
        var fallbackPosition = matches.length <= 1 ? 0 : (index / (matches.length - 1)) * 100;
        return {
          color: color,
          position: clamp01(
            (rawPosition === undefined ? fallbackPosition : Number(rawPosition)) / 100,
          ),
        };
      })
      .filter(function (stop) {
        return stop !== null;
      })
      .sort(function (a, b) {
        return a.position - b.position;
      });
  }

  function gradientColorAtPoint(backgroundImage, element, x, y) {
    var stops = parseGradientStops(backgroundImage);
    if (stops.length === 0) return null;
    if (stops.length === 1) return stops[0].color;
    var position = gradientPositionForPoint(backgroundImage, element, x, y);
    var before = stops[0];
    var after = stops[stops.length - 1];
    for (var i = 0; i < stops.length - 1; i += 1) {
      if (position >= stops[i].position && position <= stops[i + 1].position) {
        before = stops[i];
        after = stops[i + 1];
        break;
      }
    }
    var span = after.position - before.position;
    var mixAmount = span <= 0 ? 0 : clamp01((position - before.position) / span);
    function lerp(a, b) {
      return a + (b - a) * mixAmount;
    }
    return {
      r: lerp(before.color.r, after.color.r),
      g: lerp(before.color.g, after.color.g),
      b: lerp(before.color.b, after.color.b),
      a: lerp(before.color.a, after.color.a),
    };
  }

  function relativeLuminance(color) {
    function channel(value) {
      value /= 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
  }

  function normalizeHex(hex) {
    var h = String(hex || "").trim();
    if (!h) return null;
    if (!h.startsWith("#")) h = "#" + h;
    if (/^#[0-9a-fA-F]{3}$/.test(h)) {
      return ("#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]).toLowerCase();
    }
    if (/^#[0-9a-fA-F]{6}$/.test(h)) return h.toLowerCase();
    return null;
  }

  function hexToRgb(hex) {
    var normalized = normalizeHex(hex);
    if (!normalized) return null;
    return {
      r: parseInt(normalized.slice(1, 3), 16),
      g: parseInt(normalized.slice(3, 5), 16),
      b: parseInt(normalized.slice(5, 7), 16),
    };
  }

  function rgbToHex(r, g, b) {
    function channel(value) {
      return Math.round(clamp(value, 0, 255))
        .toString(16)
        .padStart(2, "0");
    }
    return "#" + channel(r) + channel(g) + channel(b);
  }

  function withLuminance(color) {
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      luminance: relativeLuminance(color),
    };
  }

  function rgbToHsl(r, g, b) {
    var rn = r / 255;
    var gn = g / 255;
    var bn = b / 255;
    var max = Math.max(rn, gn, bn);
    var min = Math.min(rn, gn, bn);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    var d = max - min;
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn:
          h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
          break;
        case gn:
          h = ((bn - rn) / d + 2) / 6;
          break;
        default:
          h = ((rn - gn) / d + 4) / 6;
          break;
      }
    }
    return { h: h, s: s, l: l };
  }

  function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    if (s === 0) {
      r = l;
      g = l;
      b = l;
    } else {
      function hue2rgb(p, q, t) {
        var tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 1 / 2) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function mix(a, b, amount) {
    return a + (b - a) * clamp01(amount);
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function colorWithLightness(h, s, l) {
    var color = hslToRgb(h, s, clamp01(l));
    var sampled = withLuminance(color);
    sampled.lightness = clamp01(l);
    return sampled;
  }

  function keepVisibleLightnessGap(h, s, initialL, background, baseLightness) {
    var backgroundLightness = rgbToHsl(background.r, background.g, background.b).l;
    var midToneAmount = 1 - clamp01(Math.abs(backgroundLightness - 0.5) / 0.28);
    var minimumGap = mix(0.18, 0.3, midToneAmount);
    var currentGap = initialL - backgroundLightness;
    if (Math.abs(currentGap) >= minimumGap) return colorWithLightness(h, s, initialL);
    var side =
      Math.abs(currentGap) > 0.001
        ? Math.sign(currentGap)
        : baseLightness > backgroundLightness
          ? 1
          : -1;
    return colorWithLightness(h, s, clamp01(backgroundLightness + side * minimumGap));
  }

  function adjustIconHexForBackground(baseHex, background) {
    var fallback = BASE_LAUNCHER_BG;
    var hex = normalizeHex(baseHex) || normalizeHex(fallback) || fallback;
    var rgb = hexToRgb(hex);
    if (!rgb) return fallback;
    var bg =
      typeof background === "number"
        ? withLuminance({ r: background * 255, g: background * 255, b: background * 255 })
        : background;
    var baseHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    var backgroundLightness = rgbToHsl(bg.r, bg.g, bg.b).l;
    var darkBackgroundAmount = 1 - smoothstep(0.04, 0.46, backgroundLightness);
    var lightBackgroundAmount = smoothstep(0.54, 0.96, backgroundLightness);
    var invertedBackgroundL = mix(0.92, 0.08, backgroundLightness);
    var lightenedL = Math.max(baseHsl.l, mix(baseHsl.l, 0.94, darkBackgroundAmount));
    var darkenedL = Math.min(baseHsl.l, mix(baseHsl.l, 0.08, lightBackgroundAmount));
    var adjustedL = mix(baseHsl.l, invertedBackgroundL, 0.82);
    adjustedL = mix(adjustedL, lightenedL, darkBackgroundAmount * 0.62);
    adjustedL = mix(adjustedL, darkenedL, lightBackgroundAmount * 0.62);
    var saturationTrim = 0.16 * Math.max(darkBackgroundAmount, lightBackgroundAmount);
    var adjustedS = clamp01(baseHsl.s * (1 - saturationTrim));
    var adjusted = keepVisibleLightnessGap(baseHsl.h, adjustedS, adjustedL, bg, baseHsl.l);
    return rgbToHex(adjusted.r, adjusted.g, adjusted.b);
  }

  function foregroundForBackground(hex) {
    var rgb = hexToRgb(hex);
    if (!rgb) return DARK_LAUNCHER_FG;
    return relativeLuminance(rgb) > 0.48 ? LIGHT_LAUNCHER_FG : DARK_LAUNCHER_FG;
  }

  function backgroundFromAncestors(start, x, y) {
    var chain = [];
    var el = start;
    while (el) {
      chain.push(el);
      if (el === document.documentElement) break;
      el = el.parentElement;
    }
    var backdrop = { r: 255, g: 255, b: 255 };
    for (var i = chain.length - 1; i >= 0; i -= 1) {
      var style = window.getComputedStyle(chain[i]);
      var parsed = parseCssRgbColor(style.backgroundColor);
      if (parsed && parsed.a >= 0.02) backdrop = compositeColor(backdrop, parsed);
      if (x !== undefined && y !== undefined) {
        var gradient = gradientColorAtPoint(style.backgroundImage, chain[i], x, y);
        if (gradient && gradient.a >= 0.02) backdrop = compositeColor(backdrop, gradient);
      }
    }
    return withLuminance(backdrop);
  }

  function backgroundAtViewportPoint(x, y, root) {
    var stack = document.elementsFromPoint
      ? document.elementsFromPoint(x, y)
      : [document.elementFromPoint(x, y)];
    for (var i = 0; i < stack.length; i += 1) {
      var el = stack[i];
      if (el && !root.contains(el)) return backgroundFromAncestors(el, x, y);
    }
    return backgroundFromAncestors(document.body, x, y);
  }

  function averageColor(samples) {
    var total = samples.reduce(
      function (acc, sample) {
        acc.r += sample.r;
        acc.g += sample.g;
        acc.b += sample.b;
        return acc;
      },
      { r: 0, g: 0, b: 0 },
    );
    return withLuminance({
      r: total.r / samples.length,
      g: total.g / samples.length,
      b: total.b / samples.length,
    });
  }

  function sampleBackgroundBehindLauncher(root) {
    var rect = root.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return null;
    var points = [
      [0.5, 0.5],
      [0.18, 0.18],
      [0.82, 0.18],
      [0.18, 0.82],
      [0.82, 0.82],
    ];
    var samples = [];
    points.forEach(function (point) {
      var x = Math.max(
        0,
        Math.min(window.innerWidth - 1, Math.floor(rect.left + rect.width * point[0])),
      );
      var y = Math.max(
        0,
        Math.min(window.innerHeight - 1, Math.floor(rect.top + rect.height * point[1])),
      );
      samples.push(backgroundAtViewportPoint(x, y, root));
    });
    return averageColor(samples);
  }

  function applyAdaptiveLauncherColor(root) {
    var background = sampleBackgroundBehindLauncher(root);
    if (!background) return;
    var adjusted = adjustIconHexForBackground(BASE_LAUNCHER_BG, background);
    root.style.setProperty("--di-dilling-custom-launcher-bg", adjusted);
    root.style.setProperty("--di-dilling-custom-launcher-fg", foregroundForBackground(adjusted));
  }

  function startAdaptiveLauncherColor(root) {
    var rafId = 0;
    function schedule() {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(function () {
        rafId = 0;
        applyAdaptiveLauncherColor(root);
      });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return schedule;
  }

  function startUniversalUiSuppression() {
    var suppressTimer = 0;
    function schedule() {
      if (suppressTimer) window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(function () {
        suppressTimer = 0;
        suppressUniversalLauncherUi();
      }, 0);
    }
    suppressUniversalLauncherUi();
    if (window.MutationObserver && document.body) {
      var observer = new MutationObserver(schedule);
      observer.observe(document.body, { childList: true, subtree: true });
    }
    return schedule;
  }

  function initLauncher() {
    var root = createRoot();
    var scheduleAdaptiveColor = startAdaptiveLauncherColor(root);
    var scheduleUniversalUiSuppression = startUniversalUiSuppression();
    var expandTimer = 0;
    var collapseTimer = 0;
    var chatStateTimer = 0;

    function clearTimers() {
      if (expandTimer) window.clearTimeout(expandTimer);
      if (collapseTimer) window.clearTimeout(collapseTimer);
      expandTimer = 0;
      collapseTimer = 0;
    }

    function openChat() {
      clearTimers();
      waitForApi(function (api) {
        suppressUniversalLauncherUi();
        api.open();
        waitForIframe(function () {
          suppressUniversalLauncherUi();
          root.style.display = "none";
          watchForChatClose();
        });
      });
    }

    function watchForChatClose() {
      if (chatStateTimer) window.clearInterval(chatStateTimer);
      chatStateTimer = window.setInterval(function () {
        if (isChatClosed()) {
          window.clearInterval(chatStateTimer);
          chatStateTimer = 0;
          suppressUniversalLauncherUi();
          root.style.display = "";
          renderIcon(notificationSvg, "Open chat, 1 new message", { animateEnter: true });
        }
      }, 300);
    }

    function renderIcon(icon, label, options) {
      var animateEnter = options && options.animateEnter;
      root.innerHTML =
        '<button class="di-dilling-custom-launcher__button" type="button" aria-label="' +
        escapeAttribute(label) +
        '">' +
        icon +
        "</button>";
      var button = root.querySelector("button");
      if (animateEnter) {
        button.classList.add("is-entering");
        button.addEventListener(
          "animationend",
          function () {
            button.classList.remove("is-entering");
          },
          { once: true },
        );
      }
      button.addEventListener("click", openChat);
      scheduleAdaptiveColor();
      scheduleUniversalUiSuppression();
    }

    function renderExpanded() {
      root.innerHTML =
        '<button class="di-dilling-custom-launcher__bar" type="button">' +
        '<span class="di-dilling-custom-launcher__close" role="button" tabindex="0" aria-label="Close welcome message">' +
        closeSvg +
        "</span>" +
        '<span class="di-dilling-custom-launcher__message"></span>' +
        '<span class="di-dilling-custom-launcher__collapse-icon" aria-hidden="true">' +
        notificationSvg +
        "</span>" +
        "</button>";
      root.querySelector(".di-dilling-custom-launcher__message").textContent = getLauncherMessage();
      root.querySelector(".di-dilling-custom-launcher__bar").addEventListener("click", openChat);
      root.querySelector(".di-dilling-custom-launcher__close").addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (collapseTimer) window.clearTimeout(collapseTimer);
        collapseTimer = 0;
        collapseToIcon();
      });
      root.querySelector(".di-dilling-custom-launcher__close").addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          if (collapseTimer) window.clearTimeout(collapseTimer);
          collapseTimer = 0;
          collapseToIcon();
        }
      });
      collapseTimer = window.setTimeout(collapseToIcon, COLLAPSE_DELAY_MS);
      scheduleAdaptiveColor();
      scheduleUniversalUiSuppression();
    }

    function collapseToIcon() {
      var bar = root.querySelector(".di-dilling-custom-launcher__bar");
      if (!bar || bar.classList.contains("is-collapsing")) {
        renderIcon(notificationSvg, "Open chat, 1 new message", { animateEnter: true });
        return;
      }
      bar.classList.add("is-collapsing");
      bar.addEventListener(
        "animationend",
        function (event) {
          if (event.target !== bar || event.animationName !== "di-dilling-collapse") {
            return;
          }
          renderIcon(notificationSvg, "Open chat, 1 new message");
        },
      );
    }

    renderIcon(iconSvg, "Open chat");
    expandTimer = window.setTimeout(renderExpanded, EXPAND_DELAY_MS);
  }

  function createRoot() {
    var existing = document.getElementById(ROOT_ID);
    if (existing) {
      return existing;
    }
    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "di-dilling-custom-launcher";
    document.body.appendChild(root);
    return root;
  }

  function waitForApi(callback) {
    var startedAt = Date.now();
    (function tick() {
      if (window.DialogIntelligens && typeof window.DialogIntelligens.open === "function") {
        callback(window.DialogIntelligens);
        return;
      }
      if (Date.now() - startedAt > 30000) {
        console.warn("[dilling-custom-script] Timed out waiting for DialogIntelligens API.");
        return;
      }
      window.setTimeout(tick, 50);
    })();
  }

  function waitForIframe(callback) {
    var startedAt = Date.now();
    (function tick() {
      var iframe = document.getElementById("chat-iframe");
      if (iframe && window.getComputedStyle(iframe).display !== "none") {
        callback();
        return;
      }
      if (Date.now() - startedAt > 30000) {
        console.warn("[dilling-custom-script] Chat iframe did not mount after open().");
        return;
      }
      window.setTimeout(tick, 50);
    })();
  }

  function isChatClosed() {
    var iframe = document.getElementById("chat-iframe");
    return !iframe || window.getComputedStyle(iframe).display === "none";
  }

  function suppressUniversalLauncherUi() {
    document.documentElement.classList.add("di-hidden-universal-chatbot");
    if (document.body) {
      document.body.classList.add("di-hidden-universal-chatbot");
    }
    var container = document.getElementById("chat-container");
    if (container) {
      container.dataset.diHiddenUniversal = "true";
    }
    ["chat-button", "chatbase-message-bubbles", "minimize-button", "plus-overlay"].forEach(
      function (id) {
        var element = document.getElementById(id);
        if (element) {
          element.style.setProperty("display", "none", "important");
          element.style.setProperty("pointer-events", "none", "important");
        }
      },
    );
    var notificationBadge = document.querySelector("#chat-container .notification-badge");
    if (notificationBadge) {
      notificationBadge.style.setProperty("display", "none", "important");
      notificationBadge.style.setProperty("pointer-events", "none", "important");
    }
  }

  function escapeAttribute(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
})();

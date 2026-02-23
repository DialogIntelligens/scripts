"use strict";(()=>{var s={log:Et,error:Mt,warn:Pt,isEnabled:R};function Et(...t){R()&&console.log(...t)}function Pt(...t){R()&&console.warn(...t)}function Mt(...t){R()&&console.error(...t)}function R(){return!!(window.localStorage.getItem("CHATBOT_LOGGING_ENABLED")==="true"||window.CHATBOT_LOGGING_ENABLED)}var h={getUrl:kt};function kt({ctx:t}){var o;return t.isPreviewMode&&((o=window.CHATBOT_PREVIEW_CONFIG)!=null&&o.backendUrl)?window.CHATBOT_PREVIEW_CONFIG.backendUrl:"https://api.dialogintelligens.dk"}var C={isLottieUrl:zt,ensurePlayerLoaded:Lt,getPlayerHtml:_t};function zt(t){if(!t)return!1;let o=t.split("?")[0].toLowerCase();return o.endsWith(".json")||o.endsWith(".lottie")}var it=!1;function Lt(){if(it)return;it=!0;let t=document.createElement("script");t.type="module",t.src="https://unpkg.com/@dotlottie/player-component@2/dist/dotlottie-player.mjs",document.head.appendChild(t)}function _t(t){return`<dotlottie-player src="${t}" autoplay loop style="width:100%;height:100%;"></dotlottie-player>`}var u={getTargetOrigin:Bt};function Bt(t){if(!t)return"";if(t.startsWith("/"))return window.location.origin;try{return new URL(t).origin}catch(o){return t.replace(/\/$/,"")}}var d={isIframeEnlarged:!1,chatbotInitialized:!!window.chatbotInitialized,hasReportedPurchase:!1,splitTestId:null,_config:null,_chatbotId:null,_ctx:null,setChatbotInitialized(){window.chatbotInitialized=!0,this.chatbotInitialized=!0},toggleIsIframeEnlarged(){this.isIframeEnlarged=!this.isIframeEnlarged},setHasReportedPurchase(t){this.hasReportedPurchase=t},setSplitTestId(t){this.splitTestId=t},setConfig(t){this._config=t},getConfig(){return this._config},setChatbotId(t){this._chatbotId=t},getChatbotId(){return this._chatbotId},setCtx(t){this._ctx=t},getCtx(){return this._ctx},updateConfig(t){this._config&&(this._config={...this._config,...t})},getState(){return{isIframeEnlarged:this.isIframeEnlarged,chatbotInitialized:this.chatbotInitialized,hasReportedPurchase:this.hasReportedPurchase,splitTestId:this.splitTestId}},reset(){this.isIframeEnlarged=!1,this.chatbotInitialized=!1,this.hasReportedPurchase=!1,this.splitTestId=null,this._config=null,this._chatbotId=null,this._ctx=null,window.chatbotInitialized=!1}};async function b({ctx:t}){var e,n;let o=document.getElementById("chat-iframe");if(o)try{let i=t.getConfig(),a=t.getChatbotId();s.log("sendMessageToIframe - chatbotID:",a,"iframeUrl:",i.iframeUrl),s.log("sendMessageToIframe - full config:",JSON.stringify(i,null,2));let l;if(i.raptorEnabled&&i.raptorCookieName){let m=document.cookie.match(new RegExp("(?:^|;\\s*)"+i.raptorCookieName+"=([^;]*)"));m&&(l=decodeURIComponent(m[1]))}let p={action:"integrationOptions",chatbotID:a,...i,splitTestId:d.splitTestId,pagePath:t.isPreviewMode&&((e=window.CHATBOT_PREVIEW_CONFIG)!=null&&e.parentPageUrl)?window.CHATBOT_PREVIEW_CONFIG.parentPageUrl:window.location.href,isTabletView:window.innerWidth>=768&&window.innerWidth<1e3,isPhoneView:window.innerWidth<768,gptInterface:!1,raptorCookieId:l},c=i.iframeUrl,r=u.getTargetOrigin(c);r?(n=o.contentWindow)==null||n.postMessage(p,r):s.warn("No iframeUrl configured, cannot send message to iframe")}catch(i){s.warn("Failed to send message to iframe:",i)}}function H(t){return typeof CSS!="undefined"&&CSS.supports("height","1dvh")?`${t}dvh`:`${t}vh`}function y({ctx:t}){let o=t.getConfig(),e=document.getElementById("chat-iframe");if(!e)return;if(window.CHATBOT_PREVIEW_MODE===!0){let i=o&&o.previewMode==="mobile";o&&o.fullscreenMode||i?(e.style.width="100vw",e.style.height=H(100),e.style.position="fixed",e.style.left="0",e.style.top="0",e.style.transform="none",e.style.bottom="0",e.style.right="0"):(e.style.width="calc(375px + 6vw)",e.style.height="calc(450px + 20vh)",e.style.position="fixed",e.style.left="auto",e.style.top="auto",e.style.transform="none",e.style.bottom="3vh",e.style.right="2vw");return}d.isIframeEnlarged?(e.style.width=o.iframeWidthEnlarged||"calc(2 * 45vh + 6vw)",e.style.height=H(90)):window.innerWidth<1e3?(e.style.width="100vw",e.style.height=H(100)):(e.style.width=o.iframeWidthDesktop||"calc(50vh + 8vw)",e.style.height=H(90)),e.style.position="fixed",window.innerWidth<1e3?(e.style.left="0",e.style.top="0",e.style.transform="none",e.style.bottom="0",e.style.right="0"):(e.style.left="auto",e.style.top="auto",e.style.transform="none",e.style.bottom="3vh",e.style.right="2vw"),b({ctx:t})}function I({ctx:t}){var p;let o=document.getElementById("chat-button"),e=document.getElementById("chat-iframe"),n=document.getElementById("chatbase-message-bubbles"),i=document.getElementById("minimize-button"),a=document.getElementById("chat-container");if(!e){s.error("Chat iframe not found");return}let l=e.style.display;if(s.log(`toggleChatWindow called. Current display: "${l}"`),l==="none"||!l){s.log("Opening chat..."),e.style.display="block",o&&(o.style.display="none"),n&&(n.style.display="none"),i&&(i.style.display="block"),a&&(a.classList.add("chat-open"),a.classList.remove("minimized"));let c=`chatMinimized_${t.getChatbotId()}`;localStorage.removeItem(c);let r=`popupState_${t.getChatbotId()}`;localStorage.setItem(r,"dismissed"),window.innerWidth>=1e3&&localStorage.setItem("chatWindowState","open"),y({ctx:t}),s.log("After adjustIframeSize - iframe display:",e.style.display,"dimensions:",e.style.width,"x",e.style.height),b({ctx:t}),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},50),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},150),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},300);try{let f=t.getConfig().iframeUrl,g=u.getTargetOrigin(f);g&&((p=e.contentWindow)==null||p.postMessage({action:"chatOpened"},g))}catch(f){}}else s.log("Closing chat..."),e.style.display="none",o&&(o.style.display="block"),i&&(i.style.display="none"),a&&a.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}function nt(){return{hide(){let t=document.getElementById("chat-container"),o=document.getElementById("chat-iframe");t&&(t.style.display="none"),o&&(o.style.display="none")},show(){let t=document.getElementById("chat-container"),o=document.getElementById("chat-button"),e=document.getElementById("chat-iframe");t&&(t.style.display="",t.classList.remove("chat-open")),o&&(o.style.display="block"),e&&(e.style.display="none")},open(){let t=d.getCtx();if(!t)return;let o=document.getElementById("chat-container");o&&(o.style.display="",o.classList.remove("chat-open"));let e=document.getElementById("chat-iframe");(!e||e.style.display==="none"||!e.style.display)&&I({ctx:t})},destroy(){let t=document.getElementById("chat-container");t&&t.remove();let o=document.getElementById("chat-iframe");o&&o.remove();let e=document.getElementById("di-chatbot-styles");e&&e.remove(),d.reset()}}}function O(t,o){let e=o?new CustomEvent(t,{detail:o}):new CustomEvent(t);window.dispatchEvent(e)}var E={open(){O("chat_open",{chat_type:"shopping_assistant"})},recommendation(){O("chat_recommendation",{chat_type:"shopping_assistant"})},response(t){O("chat_response",{chat_type:"shopping_assistant",response_latency_ms:t})},productClick(){O("chat_product_click",{chat_type:"shopping_assistant"})}};function at(){let t=null;return{start(){t=performance.now()},stop(){if(t===null)return null;let o=Math.round(performance.now()-t);return t=null,o}}}function P({ctx:t}){t.getConfig().purchaseTrackingEnabled&&t.hasSentMessageToChatbot()&&(setInterval(()=>Rt({ctx:t}),2e3),setInterval(()=>Ht({ctx:t}),2e3))}function Rt({ctx:t}){var e,n;let o=Ut({ctx:t});if(!(!o||!o.length))for(let i of o){let a=rt(i);if(a){let l=Ft((n=(e=a.textContent)==null?void 0:e.trim())!=null?n:"",t);if(l){localStorage.setItem(st(t.getChatbotId()),String(l));break}}}}function Ht({ctx:t}){if(!t.hasSentMessageToChatbot()||d.hasReportedPurchase)return;let o=Ot({ctx:t});if(!o||!o.length)return;let e=o.map(n=>rt(n)).filter(n=>!!n);e.length&&e.forEach(n=>{n.hasAttribute("data-purchase-tracked")||(n.setAttribute("data-purchase-tracked","true"),n.addEventListener("click",async()=>{let i=localStorage.getItem(st(t.getChatbotId()));i&&await $t(parseFloat(i),t)}))})}function rt(t){let o=t?t.trim():"";try{return document.querySelector(o)}catch(e){return null}}function Ot({ctx:t}){let{checkoutPurchaseSelector:o}=t.getConfig();return t.isPreviewMode&&o?["#purchase-tracking-checkout-purchase","#purchase-tracking-checkout-purchase-alternative"]:typeof o=="string"?o.split(",").map(e=>e.trim()).filter(Boolean):[]}function Ut({ctx:t}){let{checkoutPriceSelector:o}=t.getConfig();return t.isPreviewMode&&o?["#purchase-tracking-checkout-price"]:typeof o=="string"?o.split(",").map(e=>e.trim()).filter(Boolean):[]}async function $t(t,o){if(localStorage.getItem(V(o.getChatbotId()))){d.setHasReportedPurchase(!0);return}let e=o.getConfig().currency||"DKK",n=document.getElementById("chat-iframe");if(n&&n.contentWindow){let i=o.getConfig().iframeUrl,a=u.getTargetOrigin(i);n.contentWindow.postMessage({action:"reportPurchase",chatbotID:o.getChatbotId(),totalPrice:t,currency:e},a)}}function Ft(t,o){let e=o.getConfig().priceExtractionLocale||"comma",n=t.match(/\d[\d.,]*/g);if(!n||n.length===0)return null;let i=0;for(let a of n){let l=a.replace(/[^\d.,]/g,"");e==="comma"?l=l.replace(/\./g,"").replace(",","."):l=l.replace(/,/g,"");let p=parseFloat(l);!isNaN(p)&&p>i&&(i=p)}return i>0?i:null}function V(t){let o=new Date,e=o.getFullYear(),n=String(o.getMonth()+1).padStart(2,"0"),i=String(o.getDate()).padStart(2,"0");return`purchaseReported_${`${e}-${n}-${i}`}_${t}`}function st(t){return`purchaseTotalPriceKey_${t}`}function x({ctx:t}){let o=`visitorKey_${t.getChatbotId()}`,e=localStorage.getItem(o);if(!e){let n=`visitor-${Date.now()}-${Math.floor(Math.random()*1e4)}`;return localStorage.setItem(o,n),n}return e}async function k({ctx:t}){try{let o=x({ctx:t}),e=h.getUrl({ctx:t}),n=await fetch(`${e}/api/split-assign?chatbot_id=${encodeURIComponent(t.getChatbotId())}&visitor_key=${encodeURIComponent(o)}`);if(!n.ok)return null;let i=await n.json();return i&&i.enabled?i:null}catch(o){return s.warn("Split test assignment failed:",o),null}}async function N({variantId:t,ctx:o}){try{let e=x({ctx:o}),n=h.getUrl({ctx:o});await fetch(`${n}/api/split-impression`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:o.getChatbotId(),variant_id:t,visitor_key:e})})}catch(e){s.warn("Failed to log split impression:",e)}}var lt=!1;function U(t){return getComputedStyle(t).display!=="none"}function At(t){let o=getComputedStyle(t),e=o.getPropertyValue("scale");if(e&&e!=="none"){let i=parseFloat(e);if(!Number.isNaN(i)&&i>0)return i}let n=o.transform;if(n&&n!=="none"){let i=n.match(/^matrix\((.+)\)$/);if(i){let a=i[1].split(",").map(l=>parseFloat(l.trim()));if(a.length>=6&&!Number.isNaN(a[0]))return a[0]}}return 1}function Wt(t){let o=t.getBoundingClientRect(),e=getComputedStyle(t),n=parseFloat(e.paddingLeft||"0")||0,i=parseFloat(e.paddingRight||"0")||0,a=parseFloat(e.paddingTop||"0")||0,l=parseFloat(e.paddingBottom||"0")||0;return{left:o.left+n,right:o.right-i,top:o.top+a,bottom:o.bottom-l,width:Math.max(0,o.width-n-i),height:Math.max(0,o.height-a-l)}}function j(){let t=document.getElementById("chatbase-message-bubbles"),o=document.getElementById("chat-button");if(!t||!o||!U(t))return;let e=8,n=Wt(o),i=window.innerWidth,a=window.innerHeight,l=getComputedStyle(o),p=parseFloat(l.paddingLeft||"0")||0,c=parseFloat(l.paddingRight||"0")||0,r=parseFloat(l.paddingTop||"0")||0,m=parseFloat(l.paddingBottom||"0")||0,f=Math.max(p,c,r,m),g=At(t)||.58,v=f/g,z=Math.max(18,Math.min(60,Math.round(n.width*.55))),L=Math.ceil(z/g),S=t.querySelector(".message-box");if(S){let ot=`${v}px`;S.style.padding=ot}let wt=n.height/g;t.style.maxHeight=`${wt}px`,t.style.overflow="hidden";let A=t.offsetWidth,_=t.offsetHeight,w=g;t.style.scale=String(w);let Y=A*w,X=_*w,W=18*w,J=W+z,M=n.top+n.height/2,D=n.left-W+J,Z=n.right+W-J,It=D-Y,xt=Z+Y,St=It>=e,Tt=xt<=i-e,B,T,Q=!1;St?(t.classList.remove("tail-left"),B=D-A,T=M-_/2):Tt?(t.classList.add("tail-left"),B=Z,T=M-_/2,Q=!0):(t.classList.remove("tail-left"),B=Math.max(e/w,D-A),T=M-_/2),Q?(t.style.paddingLeft=`${L}px`,t.style.paddingRight="0"):(t.style.paddingLeft="0",t.style.paddingRight=`${L}px`);let tt=M-X/2,et=M+X/2;tt<e?T+=(e-tt)/w:et>a-e&&(T-=(et-(a-e))/w),t.style.left=`${B}px`,t.style.top=`${T}px`}function Dt(){if(lt)return;lt=!0;let t=()=>{j()};window.addEventListener("resize",t,{passive:!0}),window.addEventListener("scroll",t,{passive:!0}),window.visualViewport&&(window.visualViewport.addEventListener("resize",t,{passive:!0}),window.visualViewport.addEventListener("scroll",t,{passive:!0}));let o=document.getElementById("chatbase-message-bubbles");o&&new ResizeObserver(t).observe(o)}function dt(t){t.style.display="flex",t.style.visibility="hidden",Dt(),requestAnimationFrame(()=>{j(),t.style.visibility="visible",requestAnimationFrame(()=>{j()})})}async function $({ctx:t}){let o=document.getElementById("chat-iframe");if(o&&o.style.display!=="none")return;let e=`chatMinimized_${t.getChatbotId()}`;if(localStorage.getItem(e)==="true")return;let n=window.innerWidth<1e3,i=`popupState_${t.getChatbotId()}`,a=`pageVisitCount_${t.getChatbotId()}`,l=`lastPageTime_${t.getChatbotId()}`,p=localStorage.getItem(i);if(!n){if(p==="shown"){Vt({ctx:t});return}if(p==="dismissed")return;await ct({ctx:t}),localStorage.setItem(i,"shown");return}if(t.getConfig().popupShowOnMobile===!1||p==="dismissed")return;let c=`popupShowCount_${t.getChatbotId()}`,r=parseInt(localStorage.getItem(c)||"0"),m=t.getConfig().popupMaxDisplays||2;if(r>=m){localStorage.setItem(i,"dismissed");return}let f=parseInt(localStorage.getItem(a)||"0");f++,localStorage.setItem(a,f.toString());let g=Date.now();localStorage.setItem(l,g.toString()),f>=2&&setTimeout(()=>{let v=localStorage.getItem(l),z=localStorage.getItem(i),L=localStorage.getItem(`chatMinimized_${t.getChatbotId()}`);v===g.toString()&&z!=="dismissed"&&L!=="true"&&(r++,localStorage.setItem(c,r.toString()),ct({ctx:t}).then(()=>{setTimeout(()=>{let S=document.getElementById("chatbase-message-bubbles");S&&U(S)&&(S.style.display="none",r>=m&&localStorage.setItem(i,"dismissed"))},15e3)}))},6e3)}async function ct({ctx:t}){var p,c;let o=document.getElementById("chatbase-message-bubbles"),e=document.getElementById("popup-message-box");if(!o||!e)return;let n=await pt({ctx:t})||"Har du brug for hj\xE6lp?",i=null;try{i=await k({ctx:t}),i&&i.variant&&i.variant.config&&i.variant.config.popup_text&&(n=i.variant.config.popup_text)}catch(r){s.warn("Split test check failed:",r)}e.innerHTML=`${n} <span id="funny-smiley">\u{1F60A}</span>`,i&&i.variant_id&&N({variantId:i.variant_id,ctx:t});let a=(c=(p=e.textContent)==null?void 0:p.trim().length)!=null?c:0,l=Math.max(380,Math.min(700,a*3.2+260));o.style.width=`${l}px`,o.classList.add("animate"),dt(o),setTimeout(()=>{let r=document.getElementById("funny-smiley");r&&U(o)&&(r.classList.add("blink"),setTimeout(()=>{r.classList.remove("blink")},1e3))},2e3),setTimeout(()=>{let r=document.getElementById("funny-smiley");r&&U(o)&&(r.classList.add("jump"),setTimeout(()=>{r.classList.remove("jump")},1e3))},12e3)}async function Vt({ctx:t}){var p,c;let o=document.getElementById("chatbase-message-bubbles"),e=document.getElementById("popup-message-box");if(!o||!e)return;let n=await pt({ctx:t})||"Har du brug for hj\xE6lp?",i=null;try{i=await k({ctx:t}),i&&i.variant&&i.variant.config&&i.variant.config.popup_text&&(n=i.variant.config.popup_text)}catch(r){s.warn("Split test check failed:",r)}e.innerHTML=`${n} <span id="funny-smiley">\u{1F60A}</span>`,i&&i.variant_id&&N({variantId:i.variant_id,ctx:t});let a=(c=(p=e.textContent)==null?void 0:p.trim().length)!=null?c:0,l=Math.max(380,Math.min(700,a*3.2+260));o.style.width=`${l}px`,o.classList.remove("animate"),dt(o)}async function pt({ctx:t}){try{let o=x({ctx:t}),e=h.getUrl({ctx:t}),n=window.location.href,i=await fetch(`${e}/api/popup-message?chatbot_id=${encodeURIComponent(t.getChatbotId())}&visitor_key=${encodeURIComponent(o)}&url=${encodeURIComponent(n)}`);if(!i.ok)return null;let a=await i.json();return a&&a.popup_text?String(a.popup_text):null}catch(o){return s.warn("Popup fetch failed:",o),null}}function G({ctx:t}){let o=t.getChatbotId(),e=`chatOpenTracked_${o}`;if(localStorage.getItem(e))return;let n=x({ctx:t});localStorage.setItem(e,"true"),fetch(`${h.getUrl({ctx:t})}/chatbot-opens`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:o,visitor_key:n})}).catch(()=>{localStorage.removeItem(e)})}var gt={register:ft},mt=at();function ft({ctx:t}){let o=document.getElementById("chat-button"),e=document.getElementById("chat-iframe"),n=document.getElementById("chatbase-message-bubbles"),i=document.querySelector(".close-popup"),a=document.getElementById("minimize-button");if(!o||!e){s.error("Chatbot elements not found. Retrying in 100ms..."),setTimeout(()=>{ft({ctx:t})},100);return}o&&e&&o.addEventListener("click",()=>{window.getComputedStyle(e).display!=="none"||(E.open(),G({ctx:t})),I({ctx:t})}),n&&e&&n.addEventListener("click",r=>{if(r.target.closest(".close-popup"))return;window.getComputedStyle(e).display!=="none"||(E.open(),G({ctx:t})),I({ctx:t})}),i&&i.addEventListener("click",r=>{if(r.stopPropagation(),n&&(n.style.display="none"),window.innerWidth<1e3){let f=`popupState_${t.getChatbotId()}`;localStorage.setItem(f,"dismissed")}}),a&&a.addEventListener("click",r=>{r.stopPropagation(),s.log("Minimize button clicked");let m=document.getElementById("chat-container"),f=document.getElementById("chatbase-message-bubbles");e.style.display="none",o.style.display="block",a.style.display="none",m&&(m.classList.remove("chat-open"),m.classList.add("minimized")),f&&(f.style.display="none");let g=`chatMinimized_${t.getChatbotId()}`;localStorage.setItem(g,"true")});let l=document.getElementById("plus-overlay");l&&l.addEventListener("click",r=>{r.stopPropagation();let m=document.getElementById("chat-container");m&&m.classList.remove("minimized"),a&&(a.style.display="");let f=`chatMinimized_${t.getChatbotId()}`;localStorage.removeItem(f);let g=`popupState_${t.getChatbotId()}`;localStorage.getItem(g)!=="dismissed"&&setTimeout(()=>{$({ctx:t})},500)});let p=`chatMinimized_${t.getChatbotId()}`;if(localStorage.getItem(p)==="true"){let r=document.getElementById("chat-container");r&&r.classList.add("minimized")}window.addEventListener("message",r=>{let m=t.getConfig().iframeUrl,f=u.getTargetOrigin(m);if(r.origin!==f)return;let g=r.data;if(g.action==="purchaseReported"&&(d.setHasReportedPurchase(!0),localStorage.setItem(V(t.getChatbotId()),"true")),g.action==="toggleSize")d.toggleIsIframeEnlarged(),y({ctx:t});else if(g.action==="closeChat"){s.log("Received closeChat message from iframe");let v=document.getElementById("chat-container");e.style.display="none",o.style.display="block",a&&(a.style.display="none"),v&&v.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}else if(g.action==="navigate"&&g.url)window.location.href=g.url;else if(g.action==="productClick")E.productClick();else if(g.action==="firstMessageSent")localStorage.setItem(`hasSentMessage_${t.getChatbotId()}`,"true"),P({ctx:t});else if(g.action==="userMessageSubmitted")mt.start();else if(g.action==="assistantFirstToken"){let v=mt.stop();v!==null&&E.response(v)}else g.action==="productRecommendation"&&E.recommendation()}),window.addEventListener("resize",()=>{y({ctx:t})}),y({ctx:t});function c(){window.dispatchEvent(new Event("resize"))}setTimeout(c,100),setTimeout(c,300),setTimeout(c,500),setTimeout(c,800),setTimeout(c,1200),e.onload=()=>{b({ctx:t})},setTimeout(()=>{e&&e.style.display==="none"&&b({ctx:t})},2e3)}var ht={generate:Nt};function Nt({ctx:t}){let o=t.getConfig(),e=o.iframeUrl||"https://chatbot.dialogintelligens.dk";s.log("generateChatbotHTML - iframeUrl:",e,"chatbotID:",t.getChatbotId());let n;return o.chatButtonImageUrl&&C.isLottieUrl(o.chatButtonImageUrl)?(C.ensurePlayerLoaded(),n=C.getPlayerHtml(o.chatButtonImageUrl)):o.chatButtonImageUrl?n=`<img src="${o.chatButtonImageUrl}" alt="Chat" />`:n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 790" overflow="visible">
            <defs>
              <clipPath id="circle-clip"><path d="M375 0C167.9 0 0 167.9 0 375s167.9 375 375 375 375-167.9 375-375S582.1 0 375 0z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bubble-clip"><path d="M139 146.4h454v440.6H139z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bar-clip"><path d="M245.7 312h255.6v110.7H245.7z" clip-rule="nonzero"/></clipPath>
              <clipPath id="star-lg-clip"><path d="M266.2 228.1h234.8v234.7H266.2z" clip-rule="nonzero"/></clipPath>
            </defs>
            <g transform="translate(34.5,0) scale(0.868)">
            <g clip-path="url(#circle-clip)"><rect x="-165" width="1080" height="1080" y="-165" fill="var(--icon-color, #1a1d56)"/></g>
            <g clip-path="url(#bubble-clip)"><path fill="#ffffff" d="M529.1 546.6H248.7c-2 0-3.8.9-4.9 2.5l-26.7 37.2H139l57.5-80.2 3.4-4L212 490c12-12 28-18.5 44.9-18.5h272.2V209.4H245.7v112.1h246.5v63H245.7c-35.1 0-63.6-28.2-63.6-63V209.4c0-34.7 28.5-63 63.6-63h283.4c35.1 0 63.6 28.2 63.6 63v274.2c0 34.7-28.5 63-63.6 63z"/></g>
            <g clip-path="url(#bar-clip)"><rect x="245.7" y="312" width="255.8" height="110.7" fill="var(--icon-color, #1a1d56)"/></g>
            <path fill="#ffffff" d="M357.3 400.2c-14.8 3.5-17.6 6.3-21 21.1-3.5-14.8-6.3-17.6-21-21.1 14.7-3.5 17.5-6.3 21-21 3.5 14.7 6.3 17.5 21 21z"/>
            <g clip-path="url(#star-lg-clip)"><path fill="#ffffff" d="M501.3 345.6c-108.7 4.9-112.7 8.9-117.6 117.6-4.9-108.7-8.8-112.7-117.5-117.6 108.7-4.9 112.6-8.8 117.5-117.5 4.9 108.7 8.9 112.6 117.6 117.5z"/></g>
            <path fill="#ffffff" d="M357.2 283.5c-24.3 1.1-25.2 2-26.3 26.3-1.1-24.3-2-25.2-26.2-26.3 24.3-1.1 25.1-2 26.2-26.2 1.1 24.3 2 25.1 26.3 26.2z"/>
            <path fill="#ffffff" d="M489 281.3c-35.6 1.6-36.9 2.9-38.5 38.6-1.6-35.7-2.9-37-38.6-38.6 35.7-1.6 37-2.9 38.6-38.5 1.6 35.6 2.9 36.9 38.5 38.5z"/>
            <path fill="#ffffff" d="M489 255.1c-9.7.4-10.1.8-10.5 10.5-.4-9.7-.8-10.1-10.5-10.5 9.7-.4 10.1-.8 10.5-10.5.4 9.7.8 10.1 10.5 10.5z"/>
            <path fill="#ffffff" d="M428.4 242.8c-9.7.4-10.1.8-10.5 10.5-.4-9.7-.8-10.1-10.5-10.5 9.7-.4 10.1-.8 10.5-10.5.4 9.7.8 10.1 10.5 10.5z"/>
            <ellipse cx="477.2" cy="256.3" rx="13.5" ry="12.3" fill="var(--icon-color, #1a1d56)"/>
            <ellipse cx="419.6" cy="244" rx="13.5" ry="12.3" fill="var(--icon-color, #1a1d56)"/>
            <rect x="182.1" y="248.7" width="63.6" height="136.9" fill="#ffffff"/>
            <ellipse cx="325.9" cy="283" rx="30.6" ry="29.1" fill="var(--icon-color, #1a1d56)"/>
            <ellipse cx="335.4" cy="404.1" rx="30.6" ry="29.1" fill="var(--icon-color, #1a1d56)"/>
            </g>
            </svg>`,o.fullscreenMode===!0?`
        <div id="chat-container" class="chat-open">
        <button id="chat-button" style="display: none;"></button>
        <button id="minimize-button" style="display: none;">\u2212</button>
        <div id="plus-overlay" style="display: none;">+</div>
        <div id="chatbase-message-bubbles" style="display: none;"></div>
        </div>

        <iframe
        id="chat-iframe"
        src="${e}"
        style="display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; border: none; z-index: ${o.iframeZIndex||3e3};">
        </iframe>
    `:`
        <div id="chat-container">
        <!-- Chat Button -->
        <button id="chat-button">
            ${n}
            <span id="notification-badge" class="notification-badge">1</span>
        </button>
        
        <!-- Minimize button (shown on mobile only) -->
        <button id="minimize-button">\u2212</button>
        
        <!-- Plus overlay (shown when minimized) -->
        <div id="plus-overlay">+</div>

        <!-- Popup -->
        <div id="chatbase-message-bubbles">
            <div class="close-popup">\u2212</div>
            <div class="message-content">
            <div class="message-box" id="popup-message-box">
                <!-- Will be replaced dynamically -->
            </div>
            </div>
        </div>
        </div>

        <!-- Chat Iframe -->
        <iframe
        id="chat-iframe"
        src="${e}"
        style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: ${o.iframeZIndex||3e3};">
        </iframe>
    `}var ut={inject:jt};function jt({ctx:t}){let o=t.getConfig(),e=o.productButtonColor||o.themeColor||"#1a1d56",n=`
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
  z-index: ${o.zIndex||190};
  transition: all 0.3s ease;
}
#chat-container #chat-button {
  cursor: pointer !important;
  background: none !important;
  border: none !important;
  position: fixed !important;
  z-index: calc(${o.zIndex||190} + 10) !important;
  right: calc(${(o.buttonRight||"10px").replace(/\s*!important/g,"")} + 5px) !important;
  bottom: calc(${(o.buttonBottom||"27px").replace(/\s*!important/g,"")} + 15px) !important;
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
  width: 74px;
  height: 71px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: block;
}
#chat-container #chat-button:hover img {
  transform: scale(1.1);
  opacity: 1;
}
#chat-container #chat-button dotlottie-player {
  width: 74px !important;
  height: 74px !important;
  display: block !important;
  transition: opacity 0.3s, transform 0.3s !important;
}
#chat-container #chat-button:hover dotlottie-player {
  opacity: 1 !important;
  transform: scale(1.1) !important;
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
  z-index: calc(${o.zIndex||190} + 9) !important;
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

/* Plus overlay when minimized */
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
  margin: 0 !important;
  border-radius: 50% !important;
  border: none !important;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer !important;
  z-index: calc(${o.zIndex||190} + 20) !important;
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
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* Popup container */
#chatbase-message-bubbles {
  position: fixed;
  left: 0;
  top: 0;
  border-radius: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  z-index: calc(${o.zIndex||190} + 5);
  cursor: pointer;
  display: none;
  flex-direction: column;
  gap: 50px;
  background-color: white;
  max-width: 700px;
  min-width: 380px;
  box-shadow:
    0px 0.6px 0.54px -1.33px rgba(0, 0, 0, 0.15),
    0px 2.29px 2.06px -2.67px rgba(0, 0, 0, 0.13),
    0px 10px 9px -4px rgba(0, 0, 0, 0.04),
    rgba(0, 0, 0, 0.125) 0px 0.362176px 0.941657px -1px,
    rgba(0, 0, 0, 0.18) 0px 3px 7.8px -2px;

  scale: 0.58;
  transform-origin: right center;
}

/* When popup is on right side of button, anchor from left center */
#chatbase-message-bubbles.tail-left {
  transform-origin: left center;
}

/* Apply animation only when animate class is present */
#chatbase-message-bubbles.animate {
  animation: rise-from-bottom 0.6s ease-out;
}


/* Flip tail when popup is placed on the right side of the button */
#chatbase-message-bubbles.tail-left::after {
  right: auto;
  left: -18px;
  border-width: 12px 18px 12px 0;
  border-color: transparent white transparent transparent;
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
  z-index: calc(${o.zIndex||190} + 999810);
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
  #chat-container #chat-button {
    z-index: calc(${o.zIndex||190} + 8) !important;
    right: calc(${(o.buttonRight||"10px").replace(/\s*!important/g,"")} + -8px) !important;
    bottom: calc(${(o.buttonBottom||"27px").replace(/\s*!important/g,"")} + -10px) !important;
  }

  #chat-container #chat-button svg {
    width: 65px !important;
    height: 65px !important;
  }
     #chat-container #chat-button img {
            width: 65px !important;
            height: 65px !important;
        }

        #chat-container #chat-button img {
            width: 65px !important;
            height: 65px !important;
        }
        #chat-container #chat-button dotlottie-player {
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

  #chatbase-message-bubbles {
    min-width: 380px;
    max-width: calc(100vw - 120px);
    scale: 0.52;
    transform-origin: right center;
  }

  #chatbase-message-bubbles.tail-left {
    transform-origin: left center;
  }

  #chatbase-message-bubbles .message-box {
    font-size: 18px;
    padding: 10px;
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
  --icon-color: ${e};
  --badge-color: #CC2B20;
}

/* Notification badge styles */
.notification-badge {
  position: absolute;
  top: 1px;
  right: 9px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 50%;
  background-color: var(--badge-color, #CC2B20);
  color: white;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  text-align: center;
  pointer-events: none;
  box-sizing: border-box;
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
  padding: 10px;
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

`,i=document.createElement("style");i.id="di-chatbot-styles",i.appendChild(document.createTextNode(n)),document.head.appendChild(i),document.documentElement.style.setProperty("--icon-color",e)}var bt={get:Gt};async function Gt({ctx:t}){var a,l;let e=(typeof __CHATBOT_URL__!="undefined"?__CHATBOT_URL__:void 0)||(t.isPreviewMode&&((a=window.CHATBOT_PREVIEW_CONFIG)!=null&&a.iframeUrl)?window.CHATBOT_PREVIEW_CONFIG.iframeUrl:"https://chatbot.dialogintelligens.dk");if(s.log("Config.get - defaultIframeUrl:",e),t.isPreviewMode){let p=t.getConfig(),c=(l=window.CHATBOT_PREVIEW_CONFIG)!=null?l:{},r={...p,...c,iframeUrl:c.iframeUrl||p.iframeUrl||e};if(!c.leadFields)try{let m=await fetch(`${h.getUrl({ctx:t})}/api/integration-config/${t.getChatbotId()}`);if(m.ok){let f=await m.json();r={...p,...f,...c,iframeUrl:c.iframeUrl||p.iframeUrl||f.iframeUrl||e}}}catch(m){s.warn("Failed to fetch leadFields for preview mode:",m)}return d.setConfig(r),d.setChatbotId(t.getChatbotId()),{isPreviewMode:t.isPreviewMode,getChatbotId:t.getChatbotId,hasSentMessageToChatbot:t.hasSentMessageToChatbot,getConfig:()=>{var m;return(m=d.getConfig())!=null?m:r}}}let n=await Kt({ctx:t}),i={...n,iframeUrl:n.iframeUrl||e};return d.setConfig(i),d.setChatbotId(t.getChatbotId()),{isPreviewMode:t.isPreviewMode,getChatbotId:t.getChatbotId,hasSentMessageToChatbot:t.hasSentMessageToChatbot,getConfig:()=>{var p;return(p=d.getConfig())!=null?p:i}}}async function Kt({ctx:t}){try{s.log(`Loading configuration for chatbot: ${t.getChatbotId()}`);let o=await fetch(`${h.getUrl({ctx:t})}/api/integration-config/${t.getChatbotId()}`);if(o.status===403)return s.warn("Domain not authorized for this chatbot. Widget will not load."),{...t.getConfig(),_domainBlocked:!0};if(!o.ok)throw new Error(`Failed to load configuration: ${o.status} ${o.statusText}`);let e=await o.json();return{...t.getConfig(),...e}}catch(o){return s.error("Error loading chatbot config:",o),{...t.getConfig(),themeColor:"#1a1d56",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Vores virtuelle assistent er h\xE4r for at hj\xE6lpe dig.",titleG:"Chat Assistent",enableMinimizeButton:!0,enablePopupMessage:!0}}}function K(){let t=document.getElementById("chat-button");t&&t.addEventListener("click",()=>{let o=document.getElementById("notification-badge");o&&o.remove(),s.log("Chatbot opened \u2014 notification badge removed.")})}function yt({ctx:t}){window.CHATBOT_PREVIEW_CONFIG&&(d.updateConfig(window.CHATBOT_PREVIEW_CONFIG),y({ctx:t})),window.addEventListener("previewConfigUpdate",o=>{let e=o,n=d.getChatbotId(),i=e.detail.chatbotID,a=i&&i!==n;i&&d.setChatbotId(i),d.updateConfig(e.detail),e.detail.chatButtonImageUrl!==void 0&&Yt({chatButtonImageUrl:e.detail.chatButtonImageUrl}),y({ctx:t}),Xt({config:e.detail}),P({ctx:t}),a?(s.log("Preview: Switching chatbot from",n,"to",i),b({ctx:t}),setTimeout(()=>{qt({ctx:t})},100)):b({ctx:t})})}function qt({ctx:t}){var e;let o=document.getElementById("chat-iframe");if(o)try{let n=t.getConfig(),i=n.iframeUrl,a=u.getTargetOrigin(i);a&&(s.log("Sending resetConversation to iframe with firstMessage:",n.firstMessage),(e=o.contentWindow)==null||e.postMessage({action:"resetConversation",firstMessage:n.firstMessage},a))}catch(n){s.warn("Failed to send reset to iframe:",n)}}function Yt({chatButtonImageUrl:t}){let o=document.getElementById("chat-button");if(!o)return;let e;t&&C.isLottieUrl(t)?(C.ensurePlayerLoaded(),e=C.getPlayerHtml(t)):t?e=`<img src="${t}" alt="Chat" />`:e=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 790" overflow="visible">
            <defs>
              <clipPath id="circle-clip"><path d="M375 0C167.9 0 0 167.9 0 375s167.9 375 375 375 375-167.9 375-375S582.1 0 375 0z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bubble-clip"><path d="M139 146.4h454v440.6H139z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bar-clip"><path d="M245.7 312h255.6v110.7H245.7z" clip-rule="nonzero"/></clipPath>
              <clipPath id="star-lg-clip"><path d="M266.2 228.1h234.8v234.7H266.2z" clip-rule="nonzero"/></clipPath>
            </defs>
            <g transform="translate(34.5,0) scale(0.868)">
            <g clip-path="url(#circle-clip)"><rect x="-165" width="1080" height="1080" y="-165" fill="var(--icon-color, #1a1d56)"/></g>
            <g clip-path="url(#bubble-clip)"><path fill="#ffffff" d="M529.1 546.6H248.7c-2 0-3.8.9-4.9 2.5l-26.7 37.2H139l57.5-80.2 3.4-4L212 490c12-12 28-18.5 44.9-18.5h272.2V209.4H245.7v112.1h246.5v63H245.7c-35.1 0-63.6-28.2-63.6-63V209.4c0-34.7 28.5-63 63.6-63h283.4c35.1 0 63.6 28.2 63.6 63v274.2c0 34.7-28.5 63-63.6 63z"/></g>
            <g clip-path="url(#bar-clip)"><rect x="245.7" y="312" width="255.8" height="110.7" fill="var(--icon-color, #1a1d56)"/></g>
            <path fill="#ffffff" d="M357.3 400.2c-14.8 3.5-17.6 6.3-21 21.1-3.5-14.8-6.3-17.6-21-21.1 14.7-3.5 17.5-6.3 21-21 3.5 14.7 6.3 17.5 21 21z"/>
            <g clip-path="url(#star-lg-clip)"><path fill="#ffffff" d="M501.3 345.6c-108.7 4.9-112.7 8.9-117.6 117.6-4.9-108.7-8.8-112.7-117.5-117.6 108.7-4.9 112.6-8.8 117.5-117.5 4.9 108.7 8.9 112.6 117.6 117.5z"/></g>
            <path fill="#ffffff" d="M357.2 283.5c-24.3 1.1-25.2 2-26.3 26.3-1.1-24.3-2-25.2-26.2-26.3 24.3-1.1 25.1-2 26.2-26.2 1.1 24.3 2 25.1 26.3 26.2z"/>
            <path fill="#ffffff" d="M489 281.3c-35.6 1.6-36.9 2.9-38.5 38.6-1.6-35.7-2.9-37-38.6-38.6 35.7-1.6 37-2.9 38.6-38.5 1.6 35.6 2.9 36.9 38.5 38.5z"/>
            <path fill="#ffffff" d="M489 255.1c-9.7.4-10.1.8-10.5 10.5-.4-9.7-.8-10.1-10.5-10.5 9.7-.4 10.1-.8 10.5-10.5.4 9.7.8 10.1 10.5 10.5z"/>
            <path fill="#ffffff" d="M428.4 242.8c-9.7.4-10.1.8-10.5 10.5-.4-9.7-.8-10.1-10.5-10.5 9.7-.4 10.1-.8 10.5-10.5.4 9.7.8 10.1 10.5 10.5z"/>
            <ellipse cx="477.2" cy="256.3" rx="13.5" ry="12.3" fill="var(--icon-color, #1a1d56)"/>
            <ellipse cx="419.6" cy="244" rx="13.5" ry="12.3" fill="var(--icon-color, #1a1d56)"/>
            <rect x="182.1" y="248.7" width="63.6" height="136.9" fill="#ffffff"/>
            <ellipse cx="325.9" cy="283" rx="30.6" ry="29.1" fill="var(--icon-color, #1a1d56)"/>
            <ellipse cx="335.4" cy="404.1" rx="30.6" ry="29.1" fill="var(--icon-color, #1a1d56)"/>
            </g>
            </svg>`;let n=o.querySelector("#notification-badge");o.innerHTML=e,n&&o.appendChild(n)}function Xt({config:t}){let o=t.fullscreenMode===!0,e=document.getElementById("chat-button"),n=document.getElementById("chatbase-message-bubbles"),i=document.getElementById("minimize-button"),a=document.getElementById("chat-container"),l=document.getElementById("chat-iframe");o?(e&&(e.style.display="none"),n&&(n.style.display="none"),i&&(i.style.display="none"),a&&a.classList.add("chat-open"),l&&(l.style.display="block")):(e&&(e.style.display=""),l&&l.style.display)}var q={init:vt};async function vt({ctx:t}){if(d.chatbotInitialized)return;if(!document.body){setTimeout(()=>{vt({ctx:t})},500);return}if(new URLSearchParams(window.location.search).get("chat")==="open"&&(localStorage.setItem("chatWindowState","open"),history.replaceState(null,"",window.location.pathname)),document.getElementById("chat-container"))return;d.setChatbotInitialized();let e=await bt.get({ctx:t});if(d.setCtx(e),e.getConfig()._domainBlocked){s.warn("Chatbot initialization aborted: domain not authorized");return}let n=await k({ctx:e});n&&n.variant_id&&d.setSplitTestId(n.variant_id),e.isPreviewMode&&yt({ctx:e});let i=e.getConfig().fontFamily;if(i){let c=document.createElement("link");c.rel="stylesheet",c.href=`https://fonts.googleapis.com/css2?family=${i.replace(/ /g,"+")}:wght@200;300;400;600;900&display=swap`,document.head.appendChild(c)}let a=ht.generate({ctx:e});function l(){try{document.body.insertAdjacentHTML("beforeend",a),setTimeout(()=>{let c=document.getElementById("chat-container");!e.getConfig().enableMinimizeButton&&c&&c.classList.add("minimize-disabled")},100)}catch(c){s.error("Failed to insert chatbot HTML:",c)}}if(document.body?(l(),K()):requestAnimationFrame(()=>{document.body?(l(),K()):setTimeout(l,100)}),ut.inject({ctx:e}),gt.register({ctx:e}),e.getConfig().fullscreenMode===!0)setTimeout(()=>{let c=document.getElementById("chat-iframe");if(c!=null&&c.contentWindow)try{let r=e.getConfig().iframeUrl,m=u.getTargetOrigin(r);m&&c.contentWindow.postMessage({action:"chatOpened"},m)}catch(r){}y({ctx:e}),b({ctx:e})},500);else{let c=window.innerWidth>=1e3,r=localStorage.getItem("chatWindowState");c&&r==="open"?setTimeout(()=>{document.getElementById("chat-button")&&I({ctx:e})},500):c||localStorage.removeItem("chatWindowState"),e.getConfig().enablePopupMessage&&!(c&&r==="open")&&setTimeout(()=>{$({ctx:e})},2e3)}e.isPreviewMode||P({ctx:e})}window.DialogIntelligens=nt();(async function(){await Jt()})();async function Jt(){let t={purchaseTrackingEnabled:!1,enableMinimizeButton:!1,enablePopupMessage:!1,pagePath:window.location.href,isPhoneView:window.innerWidth<1e3,leadGen:"%%",leadMail:"",leadField1:"Navn",leadField2:"Email",useThumbsRating:!1,ratingTimerDuration:18e3,replaceExclamationWithPeriod:!1,privacyLink:"https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf",freshdeskEmailLabel:"Din email:",freshdeskMessageLabel:"Besked til kundeservice:",freshdeskImageLabel:"Upload billede (valgfrit):",freshdeskChooseFileText:"V\xE6lg fil",freshdeskNoFileText:"Ingen fil valgt",freshdeskSendingText:"Sender...",freshdeskSubmitText:"Send henvendelse",freshdeskEmailRequiredError:"Email er p\xE5kr\xE6vet",freshdeskEmailInvalidError:"Indtast venligst en gyldig email adresse",freshdeskFormErrorText:"Ret venligst fejlene i formularen",freshdeskMessageRequiredError:"Besked er p\xE5kr\xE6vet",freshdeskSubmitErrorText:"Der opstod en fejl",contactConfirmationText:"Tak for din henvendelse",freshdeskConfirmationText:"Tak for din henvendelse",freshdeskSubjectText:"Din henvendelse",inputPlaceholder:"Skriv dit sp\xF8rgsm\xE5l her...",ratingMessage:"Fik du besvaret dit sp\xF8rgsm\xE5l?",productButtonText:"SE PRODUKT",productButtonColor:"",productDiscountPriceColor:"",productButtonPadding:"",productImageHeightMultiplier:1,headerLogoG:"",messageIcon:"",themeColor:"#1a1d56",aiMessageColor:"#e5eaf5",aiMessageTextColor:"#262641",userMessageColor:"",userMessageTextColor:"#ffffff",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opst\xE5 fejl, og at samtalen kan gemmes og behandles. L\xE6s mere i vores privatlivspolitik.",subtitleLinkText:"",subtitleLinkUrl:"",fontFamily:"",enableLivechat:!1,titleG:"Chat Assistent",require_email_before_conversation:!1,splitTestId:null,isTabletView:!1,buttonBottom:"20px",buttonRight:"10px"};d.setConfig(t);let o={isPreviewMode:!!window.CHATBOT_PREVIEW_MODE,getChatbotId:Ct,hasSentMessageToChatbot:()=>localStorage.getItem(`hasSentMessage_${Ct()}`)==="true",getConfig:()=>Zt(t)},e=o.getChatbotId();if(e)try{if((await fetch(`${h.getUrl({ctx:o})}/api/integration-config/${e}`)).status===403){s.warn("Domain not authorized for this chatbot. Chatbot will not load.");return}}catch(n){s.warn("Failed to check domain authorization:",n)}o.isPreviewMode?s.log("Preview Mode: Initializing chatbot preview"):s.log(`Initializing universal chatbot: ${o.getChatbotId()}`),document.readyState==="complete"?F({ctx:o}):document.readyState==="interactive"?F({ctx:o}):document.addEventListener("DOMContentLoaded",()=>{F({ctx:o})}),setTimeout(()=>{d.chatbotInitialized||F({ctx:o})},2e3)}function Zt(t){var e;let o=d.getConfig();return o||(window.CHATBOT_PREVIEW_MODE&&window.CHATBOT_PREVIEW_CONFIG?{...t,...window.CHATBOT_PREVIEW_CONFIG,iframeUrl:(e=window.CHATBOT_PREVIEW_CONFIG.iframeUrl)!=null?e:"https://chatbot.dialogintelligens.dk"}:t)}function Ct(){var o,e;let t=d.getChatbotId();return t||(window.CHATBOT_PREVIEW_MODE&&((o=window.CHATBOT_PREVIEW_CONFIG)!=null&&o.chatbotID)?window.CHATBOT_PREVIEW_CONFIG.chatbotID:(e=Qt())!=null?e:"")}function Qt(){try{let t=document.currentScript;if(t||(t=Array.from(document.scripts).find(i=>{var a;return(a=i.src)==null?void 0:a.includes("/universal-chatbot.js")})),!t||!t.src)return s.error("Could not find script reference. Make sure script is loaded correctly."),null;let e=new URL(t.src).searchParams.get("id");return e||(s.error('Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"><\/script>'),s.error("Script URL:",t.src),null)}catch(t){return s.error("Failed to extract chatbot ID from script URL:",t),null}}function F({ctx:t}){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{q.init({ctx:t})},100)}):setTimeout(()=>{q.init({ctx:t})},100)}})();

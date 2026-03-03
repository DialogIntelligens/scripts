"use strict";(()=>{var d={log:kt,error:Lt,warn:_t,isEnabled:F};function kt(...e){F()&&console.log(...e)}function _t(...e){F()&&console.warn(...e)}function Lt(...e){F()&&console.error(...e)}function F(){return!!(window.localStorage.getItem("CHATBOT_LOGGING_ENABLED")==="true"||window.CHATBOT_LOGGING_ENABLED)}var b={getUrl:Rt};function Rt({ctx:e}){var o;if(e.isPreviewMode&&((o=window.CHATBOT_PREVIEW_CONFIG)!=null&&o.backendUrl))return window.CHATBOT_PREVIEW_CONFIG.backendUrl;let t=typeof __CHATBOT_API_URL__!="undefined"&&__CHATBOT_API_URL__.trim().length>0?__CHATBOT_API_URL__:void 0;return t||"https://api.dialogintelligens.dk"}var w={isLottieUrl:Ht,ensurePlayerLoaded:Ot,getPlayerHtml:Ut};function Ht(e){if(!e)return!1;let t=e.split("?")[0].toLowerCase();return t.endsWith(".json")||t.endsWith(".lottie")}var ct=!1;function Ot(){if(ct)return;ct=!0;let e=document.createElement("script");e.type="module",e.src="https://unpkg.com/@dotlottie/player-component@2/dist/dotlottie-player.mjs",document.head.appendChild(e)}function Ut(e){return`<dotlottie-player src="${e}" autoplay loop style="width:100%;height:100%;"></dotlottie-player>`}var y={getTargetOrigin:Ft};function Ft(e){if(!e)return"";if(e.startsWith("/"))return window.location.origin;try{return new URL(e).origin}catch(t){return e.replace(/\/$/,"")}}var m={isIframeEnlarged:!1,chatbotInitialized:!!window.chatbotInitialized,hasReportedPurchase:!1,splitTestId:null,_config:null,_chatbotId:null,_ctx:null,setChatbotInitialized(){window.chatbotInitialized=!0,this.chatbotInitialized=!0},toggleIsIframeEnlarged(){this.isIframeEnlarged=!this.isIframeEnlarged},setHasReportedPurchase(e){this.hasReportedPurchase=e},setSplitTestId(e){this.splitTestId=e},setConfig(e){this._config=e},getConfig(){return this._config},setChatbotId(e){this._chatbotId=e},getChatbotId(){return this._chatbotId},setCtx(e){this._ctx=e},getCtx(){return this._ctx},updateConfig(e){this._config&&(this._config={...this._config,...e})},getState(){return{isIframeEnlarged:this.isIframeEnlarged,chatbotInitialized:this.chatbotInitialized,hasReportedPurchase:this.hasReportedPurchase,splitTestId:this.splitTestId}},reset(){this.isIframeEnlarged=!1,this.chatbotInitialized=!1,this.hasReportedPurchase=!1,this.splitTestId=null,this._config=null,this._chatbotId=null,this._ctx=null,window.chatbotInitialized=!1}};async function v({ctx:e}){var o,n;let t=document.getElementById("chat-iframe");if(t)try{let i=e.getConfig(),a=e.getChatbotId();d.log("sendMessageToIframe - chatbotID:",a,"iframeUrl:",i.iframeUrl),d.log("sendMessageToIframe - full config:",JSON.stringify(i,null,2));let r;if(i.raptorEnabled&&i.raptorCookieName){let c=document.cookie.match(new RegExp("(?:^|;\\s*)"+i.raptorCookieName+"=([^;]*)"));c&&(r=decodeURIComponent(c[1]))}let p={action:"integrationOptions",chatbotID:a,...i,splitTestId:m.splitTestId,pagePath:e.isPreviewMode&&((o=window.CHATBOT_PREVIEW_CONFIG)!=null&&o.parentPageUrl)?window.CHATBOT_PREVIEW_CONFIG.parentPageUrl:window.location.href,isTabletView:window.innerWidth>=768&&window.innerWidth<1e3,isPhoneView:window.innerWidth<768,gptInterface:!1,raptorCookieId:r},l=i.iframeUrl,s=y.getTargetOrigin(l);s?(n=t.contentWindow)==null||n.postMessage(p,s):d.warn("No iframeUrl configured, cannot send message to iframe")}catch(i){d.warn("Failed to send message to iframe:",i)}}function A(e){return typeof CSS!="undefined"&&CSS.supports("height","1dvh")?`${e}dvh`:`${e}vh`}function f({ctx:e}){let t=e.getConfig(),o=document.getElementById("chat-iframe");if(!o)return;if(window.CHATBOT_PREVIEW_MODE===!0){let a=t&&t.previewMode==="mobile";t&&t.fullscreenMode||a?(o.style.width="100vw",o.style.height=A(100),o.style.position="fixed",o.style.left="0",o.style.top="0",o.style.transform="none",o.style.bottom="0",o.style.right="0"):(o.style.width="calc(375px + 6vw)",o.style.height="calc(450px + 20vh)",o.style.position="fixed",o.style.left="auto",o.style.top="auto",o.style.transform="none",o.style.bottom="3vh",o.style.right="2vw");return}let i=t&&t.fullscreenMode===!0;i?(o.style.width="100%",o.style.height="100%",o.style.position="fixed",o.style.inset="0",o.style.left="0",o.style.top="0",o.style.right="0",o.style.bottom="0",o.style.transform="none"):m.isIframeEnlarged?(o.style.width=t.iframeWidthEnlarged||"calc(2 * 45vh + 6vw)",o.style.height=A(90)):window.innerWidth<1e3?(o.style.width="100vw",o.style.height=A(100)):(o.style.width=t.iframeWidthDesktop||"calc(50vh + 8vw)",o.style.height=A(90)),o.style.position="fixed",i||window.innerWidth<1e3?(o.style.left="0",o.style.top="0",o.style.transform="none",o.style.bottom="0",o.style.right="0"):(o.style.left="auto",o.style.top="auto",o.style.transform="none",o.style.bottom="3vh",o.style.right="2vw"),v({ctx:e})}function T({ctx:e}){var p;let t=document.getElementById("chat-button"),o=document.getElementById("chat-iframe"),n=document.getElementById("chatbase-message-bubbles"),i=document.getElementById("minimize-button"),a=document.getElementById("chat-container");if(!o){d.error("Chat iframe not found");return}let r=o.style.display;if(d.log(`toggleChatWindow called. Current display: "${r}"`),r==="none"||!r){d.log("Opening chat..."),o.style.display="block",t&&(t.style.display="none"),n&&(n.style.display="none"),i&&(i.style.display="block"),a&&(a.classList.add("chat-open"),a.classList.remove("minimized"));let l=`chatMinimized_${e.getChatbotId()}`;localStorage.removeItem(l);let s=`popupState_${e.getChatbotId()}`;localStorage.setItem(s,"dismissed"),window.innerWidth>=1e3&&localStorage.setItem("chatWindowState","open"),f({ctx:e}),d.log("After adjustIframeSize - iframe display:",o.style.display,"dimensions:",o.style.width,"x",o.style.height),v({ctx:e}),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},50),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},150),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},300);try{let h=e.getConfig().iframeUrl,u=y.getTargetOrigin(h);u&&((p=o.contentWindow)==null||p.postMessage({action:"chatOpened"},u))}catch(h){}}else d.log("Closing chat..."),o.style.display="none",t&&(t.style.display="block"),i&&(i.style.display="none"),a&&a.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}function dt(){return{hide(){let e=document.getElementById("chat-container"),t=document.getElementById("chat-iframe");e&&(e.style.display="none"),t&&(t.style.display="none")},show(){let e=document.getElementById("chat-container"),t=document.getElementById("chat-button"),o=document.getElementById("chat-iframe");e&&(e.style.display="",e.classList.remove("chat-open")),t&&(t.style.display="block"),o&&(o.style.display="none")},open(){let e=m.getCtx();if(!e)return;let t=document.getElementById("chat-container");t&&(t.style.display="",t.classList.remove("chat-open"));let o=document.getElementById("chat-iframe");(!o||o.style.display==="none"||!o.style.display)&&T({ctx:e})},destroy(){let e=document.getElementById("chat-container");e&&e.remove();let t=document.getElementById("chat-iframe");t&&t.remove();let o=document.getElementById("di-chatbot-styles");o&&o.remove(),m.reset()}}}function k(e,t){let o=t?new CustomEvent(e,{detail:t}):new CustomEvent(e);window.dispatchEvent(o)}var B={open(){k("chat_open",{chat_type:"shopping_assistant"})},recommendation(){k("chat_recommendation",{chat_type:"shopping_assistant"})},response(e){k("chat_response",{chat_type:"shopping_assistant",response_latency_ms:e})},productClick(){k("chat_product_click",{chat_type:"shopping_assistant"})},conversationClassified(e){k("chat_conversation_classified",{chat_type:"shopping_assistant",classification:e})}};function pt(){let e=null;return{start(){e=performance.now()},stop(){if(e===null)return null;let t=Math.round(performance.now()-e);return e=null,t}}}function M({ctx:e}){e.getConfig().purchaseTrackingEnabled&&e.hasSentMessageToChatbot()&&(setInterval(()=>At({ctx:e}),2e3),setInterval(()=>Wt({ctx:e}),2e3))}function At({ctx:e}){var o,n;let t=Vt({ctx:e});if(!(!t||!t.length))for(let i of t){let a=mt(i);if(a){let r=jt((n=(o=a.textContent)==null?void 0:o.trim())!=null?n:"",e);if(r){localStorage.setItem(ut(e.getChatbotId()),String(r));break}}}}function Wt({ctx:e}){if(!e.hasSentMessageToChatbot()||m.hasReportedPurchase)return;let t=Dt({ctx:e});if(!t||!t.length)return;let o=t.map(n=>mt(n)).filter(n=>!!n);o.length&&o.forEach(n=>{n.hasAttribute("data-purchase-tracked")||(n.setAttribute("data-purchase-tracked","true"),n.addEventListener("click",async()=>{let i=localStorage.getItem(ut(e.getChatbotId()));i&&await Nt(parseFloat(i),e)}))})}function mt(e){let t=e?e.trim():"";try{return document.querySelector(t)}catch(o){return null}}function Dt({ctx:e}){let{checkoutPurchaseSelector:t}=e.getConfig();return e.isPreviewMode&&t?["#purchase-tracking-checkout-purchase","#purchase-tracking-checkout-purchase-alternative"]:typeof t=="string"?t.split(",").map(o=>o.trim()).filter(Boolean):[]}function Vt({ctx:e}){let{checkoutPriceSelector:t}=e.getConfig();return e.isPreviewMode&&t?["#purchase-tracking-checkout-price"]:typeof t=="string"?t.split(",").map(o=>o.trim()).filter(Boolean):[]}async function Nt(e,t){if(localStorage.getItem(J(t.getChatbotId()))){m.setHasReportedPurchase(!0);return}let o=t.getConfig().currency||"DKK",n=document.getElementById("chat-iframe");if(n&&n.contentWindow){let i=t.getConfig().iframeUrl,a=y.getTargetOrigin(i);n.contentWindow.postMessage({action:"reportPurchase",chatbotID:t.getChatbotId(),totalPrice:e,currency:o},a)}}function jt(e,t){let o=t.getConfig().priceExtractionLocale||"comma",n=e.match(/\d[\d.,]*/g);if(!n||n.length===0)return null;let i=0;for(let a of n){let r=a.replace(/[^\d.,]/g,"");o==="comma"?r=r.replace(/\./g,"").replace(",","."):r=r.replace(/,/g,"");let p=parseFloat(r);!isNaN(p)&&p>i&&(i=p)}return i>0?i:null}function J(e){let t=new Date,o=t.getFullYear(),n=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0");return`purchaseReported_${`${o}-${n}-${i}`}_${e}`}function ut(e){return`purchaseTotalPriceKey_${e}`}function P({ctx:e}){let t=`visitorKey_${e.getChatbotId()}`,o=localStorage.getItem(t);if(!o){let n=`visitor-${Date.now()}-${Math.floor(Math.random()*1e4)}`;return localStorage.setItem(t,n),n}return o}async function _({ctx:e}){try{let t=P({ctx:e}),o=b.getUrl({ctx:e}),n=await fetch(`${o}/api/split-assign?chatbot_id=${encodeURIComponent(e.getChatbotId())}&visitor_key=${encodeURIComponent(t)}`);if(!n.ok)return null;let i=await n.json();return i&&i.enabled?i:null}catch(t){return d.warn("Split test assignment failed:",t),null}}async function X({variantId:e,ctx:t}){try{let o=P({ctx:t}),n=b.getUrl({ctx:t});await fetch(`${n}/api/split-impression`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:t.getChatbotId(),variant_id:e,visitor_key:o})})}catch(o){d.warn("Failed to log split impression:",o)}}var ht=!1;function W(e){return getComputedStyle(e).display!=="none"}function Gt(e){let t=getComputedStyle(e),o=t.getPropertyValue("scale");if(o&&o!=="none"){let i=parseFloat(o);if(!Number.isNaN(i)&&i>0)return i}let n=t.transform;if(n&&n!=="none"){let i=n.match(/^matrix\((.+)\)$/);if(i){let a=i[1].split(",").map(r=>parseFloat(r.trim()));if(a.length>=6&&!Number.isNaN(a[0]))return a[0]}}return 1}function Kt(e){let t=e.getBoundingClientRect(),o=getComputedStyle(e),n=parseFloat(o.paddingLeft||"0")||0,i=parseFloat(o.paddingRight||"0")||0,a=parseFloat(o.paddingTop||"0")||0,r=parseFloat(o.paddingBottom||"0")||0;return{left:t.left+n,right:t.right-i,top:t.top+a,bottom:t.bottom-r,width:Math.max(0,t.width-n-i),height:Math.max(0,t.height-a-r)}}function Z(){let e=document.getElementById("chatbase-message-bubbles"),t=document.getElementById("chat-button");if(!e||!t||!W(e))return;let o=8,n=Kt(t),i=window.innerWidth,a=window.innerHeight,r=getComputedStyle(t),p=parseFloat(r.paddingLeft||"0")||0,l=parseFloat(r.paddingRight||"0")||0,s=parseFloat(r.paddingTop||"0")||0,c=parseFloat(r.paddingBottom||"0")||0,h=Math.max(p,l,s,c),u=Gt(e)||.58,x=h/u,C=Math.max(18,Math.min(60,Math.round(n.width*.55))),I=Math.ceil(C/u),g=e.querySelector(".message-box");if(g){let z=x,K=30,O=12,q=14;g.style.paddingTop=`${Math.min(z,O)}px`,g.style.paddingRight=`${Math.min(z,q)}px`,g.style.paddingBottom=`${Math.min(z,O)}px`,g.style.paddingLeft=`${Math.max(z,K)}px`}let L=n.height/u;if(g&&!e.dataset.measured){e.style.maxHeight="none",e.style.maxWidth="none",e.style.paddingRight=`${I}px`,e.style.paddingLeft="0";let z=g.style.whiteSpace,K=g.style.width;g.style.whiteSpace="nowrap",g.style.width="auto";let O=g.scrollWidth;g.style.whiteSpace=z,g.style.width=K;let q=700+I,U=Math.max(280,Math.min(450,O+8))+I;for(e.style.width=`${U}px`;e.scrollHeight>L&&U<q;)U+=20,e.style.width=`${U}px`;if(e.scrollHeight>L&&window.innerWidth<1e3){let Y=parseFloat(getComputedStyle(g).fontSize)||18;for(;e.scrollHeight>L&&Y>12;)Y-=1,g.style.fontSize=`${Y}px`}e.style.maxWidth="",e.dataset.measured="1"}e.style.maxHeight=`${L}px`,e.style.overflow="hidden";let N=e.offsetWidth,R=e.offsetHeight,S=u;e.style.scale=String(S);let ot=N*S,it=R*S,j=18*S,nt=j+C,$=n.top+n.height/2,G=n.left-j+nt,at=n.right+j-nt,Pt=G-ot,Et=at+ot,Mt=Pt>=o,$t=Et<=i-o,H,E,rt=!1;Mt?(e.classList.remove("tail-left"),H=G-N,E=$-R/2):$t?(e.classList.add("tail-left"),H=at,E=$-R/2,rt=!0):(e.classList.remove("tail-left"),H=Math.max(o/S,G-N),E=$-R/2),rt?(e.style.paddingLeft=`${I}px`,e.style.paddingRight="0"):(e.style.paddingLeft="0",e.style.paddingRight=`${I}px`);let st=$-it/2,lt=$+it/2;st<o?E+=(o-st)/S:lt>a-o&&(E-=(lt-(a-o))/S),e.style.left=`${H}px`,e.style.top=`${E}px`}function qt(){if(ht)return;ht=!0;let e=()=>{Z()};window.addEventListener("resize",e,{passive:!0}),window.addEventListener("scroll",e,{passive:!0}),window.visualViewport&&(window.visualViewport.addEventListener("resize",e,{passive:!0}),window.visualViewport.addEventListener("scroll",e,{passive:!0}));let t=document.getElementById("chatbase-message-bubbles");t&&new ResizeObserver(e).observe(t)}function ft(e){e.style.display="flex",e.style.visibility="hidden",delete e.dataset.measured,qt(),requestAnimationFrame(()=>{Z(),e.style.visibility="visible",requestAnimationFrame(()=>{Z()})})}async function D({ctx:e}){let t=document.getElementById("chat-iframe");if(t&&t.style.display!=="none")return;let o=`chatMinimized_${e.getChatbotId()}`;if(localStorage.getItem(o)==="true")return;let n=window.innerWidth<1e3,i=`popupState_${e.getChatbotId()}`,a=`pageVisitCount_${e.getChatbotId()}`,r=`lastPageTime_${e.getChatbotId()}`,p=localStorage.getItem(i);if(!n){if(p==="shown"){Yt({ctx:e});return}if(p==="dismissed")return;await gt({ctx:e}),localStorage.setItem(i,"shown");return}if(e.getConfig().popupShowOnMobile===!1||p==="dismissed")return;let l=`popupShowCount_${e.getChatbotId()}`,s=parseInt(localStorage.getItem(l)||"0"),c=e.getConfig().popupMaxDisplays||2;if(s>=c){localStorage.setItem(i,"dismissed");return}let h=parseInt(localStorage.getItem(a)||"0");h++,localStorage.setItem(a,h.toString());let u=Date.now();localStorage.setItem(r,u.toString()),h>=2&&setTimeout(()=>{let x=localStorage.getItem(r),C=localStorage.getItem(i),I=localStorage.getItem(`chatMinimized_${e.getChatbotId()}`);x===u.toString()&&C!=="dismissed"&&I!=="true"&&(s++,localStorage.setItem(l,s.toString()),gt({ctx:e}).then(()=>{setTimeout(()=>{let g=document.getElementById("chatbase-message-bubbles");g&&W(g)&&(g.style.display="none",s>=c&&localStorage.setItem(i,"dismissed"))},15e3)}))},6e3)}async function gt({ctx:e}){let t=document.getElementById("chatbase-message-bubbles"),o=document.getElementById("popup-message-box");if(!t||!o)return;let n=await bt({ctx:e})||"Har du brug for hj\xE6lp?",i=null;try{i=await _({ctx:e}),i&&i.variant&&i.variant.config&&i.variant.config.popup_text&&(n=i.variant.config.popup_text)}catch(a){d.warn("Split test check failed:",a)}o.innerHTML=`${n} <span id="funny-smiley">\u{1F60A}</span>`,i&&i.variant_id&&X({variantId:i.variant_id,ctx:e}),t.classList.add("animate"),ft(t),setTimeout(()=>{let a=document.getElementById("funny-smiley");a&&W(t)&&(a.classList.add("blink"),setTimeout(()=>{a.classList.remove("blink")},1e3))},2e3),setTimeout(()=>{let a=document.getElementById("funny-smiley");a&&W(t)&&(a.classList.add("jump"),setTimeout(()=>{a.classList.remove("jump")},1e3))},12e3)}async function Yt({ctx:e}){let t=document.getElementById("chatbase-message-bubbles"),o=document.getElementById("popup-message-box");if(!t||!o)return;let n=await bt({ctx:e})||"Har du brug for hj\xE6lp?",i=null;try{i=await _({ctx:e}),i&&i.variant&&i.variant.config&&i.variant.config.popup_text&&(n=i.variant.config.popup_text)}catch(a){d.warn("Split test check failed:",a)}o.innerHTML=`${n} <span id="funny-smiley">\u{1F60A}</span>`,i&&i.variant_id&&X({variantId:i.variant_id,ctx:e}),t.classList.remove("animate"),ft(t)}async function bt({ctx:e}){try{let t=P({ctx:e}),o=b.getUrl({ctx:e}),n=window.location.href,i=await fetch(`${o}/api/popup-message?chatbot_id=${encodeURIComponent(e.getChatbotId())}&visitor_key=${encodeURIComponent(t)}&url=${encodeURIComponent(n)}`);if(!i.ok)return null;let a=await i.json();return a&&a.popup_text?String(a.popup_text):null}catch(t){return d.warn("Popup fetch failed:",t),null}}function Q({ctx:e}){let t=e.getChatbotId(),o=`chatOpenTracked_${t}`;if(localStorage.getItem(o))return;let n=P({ctx:e});localStorage.setItem(o,"true"),fetch(`${b.getUrl({ctx:e})}/chatbot-opens`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:t,visitor_key:n})}).catch(()=>{localStorage.removeItem(o)})}var vt={register:Ct},yt=pt();function Ct({ctx:e}){let t=document.getElementById("chat-button"),o=document.getElementById("chat-iframe"),n=document.getElementById("chatbase-message-bubbles"),i=document.querySelector(".close-popup"),a=document.getElementById("minimize-button");if(!t||!o){d.error("Chatbot elements not found. Retrying in 100ms..."),setTimeout(()=>{Ct({ctx:e})},100);return}t&&o&&t.addEventListener("click",()=>{window.getComputedStyle(o).display!=="none"||(B.open(),Q({ctx:e})),T({ctx:e})}),n&&o&&n.addEventListener("click",s=>{if(s.target.closest(".close-popup"))return;window.getComputedStyle(o).display!=="none"||(B.open(),Q({ctx:e})),T({ctx:e})}),i&&i.addEventListener("click",s=>{if(s.stopPropagation(),n&&(n.style.display="none"),window.innerWidth<1e3){let h=`popupState_${e.getChatbotId()}`;localStorage.setItem(h,"dismissed")}}),a&&a.addEventListener("click",s=>{s.stopPropagation(),d.log("Minimize button clicked");let c=document.getElementById("chat-container"),h=document.getElementById("chatbase-message-bubbles");o.style.display="none",t.style.display="block",a.style.display="none",c&&(c.classList.remove("chat-open"),c.classList.add("minimized")),h&&(h.style.display="none");let u=`chatMinimized_${e.getChatbotId()}`;localStorage.setItem(u,"true")});let r=document.getElementById("plus-overlay");r&&r.addEventListener("click",s=>{s.stopPropagation();let c=document.getElementById("chat-container");c&&c.classList.remove("minimized"),a&&(a.style.display="");let h=`chatMinimized_${e.getChatbotId()}`;localStorage.removeItem(h);let u=`popupState_${e.getChatbotId()}`;localStorage.getItem(u)!=="dismissed"&&setTimeout(()=>{D({ctx:e})},500)});let p=`chatMinimized_${e.getChatbotId()}`;if(localStorage.getItem(p)==="true"){let s=document.getElementById("chat-container");s&&s.classList.add("minimized")}window.addEventListener("message",s=>{var x;let c=e.getConfig().iframeUrl,h=y.getTargetOrigin(c);if(s.origin!==h)return;let u=s.data;if(u.action==="purchaseReported"&&(m.setHasReportedPurchase(!0),localStorage.setItem(J(e.getChatbotId()),"true")),u.action==="expandChat")f({ctx:e});else if(u.action==="collapseChat")f({ctx:e});else if(u.action==="toggleSize")m.toggleIsIframeEnlarged(),f({ctx:e});else if(u.action==="closeChat"){d.log("Received closeChat message from iframe");let C=document.getElementById("chat-container");o.style.display="none",t.style.display="block",a&&(a.style.display="none"),C&&C.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}else if(u.action==="openInNewTab"&&u.url)window.open(u.url,"_blank","noopener,noreferrer");else if(u.action==="navigate"&&u.url)window.location.href=u.url;else if(u.action==="productClick")B.productClick();else if(u.action==="firstMessageSent")localStorage.setItem(`hasSentMessage_${e.getChatbotId()}`,"true"),M({ctx:e});else if(u.action==="userMessageSubmitted")yt.start();else if(u.action==="assistantFirstToken"){let C=yt.stop();C!==null&&B.response(C)}else u.action==="productRecommendation"&&B.recommendation();u.action==="conversationClassified"&&B.conversationClassified((x=u.emne)!=null?x:null)}),window.addEventListener("resize",()=>{f({ctx:e})}),f({ctx:e});function l(){window.dispatchEvent(new Event("resize"))}setTimeout(l,100),setTimeout(l,300),setTimeout(l,500),setTimeout(l,800),setTimeout(l,1200),o.onload=()=>{v({ctx:e})},setTimeout(()=>{o&&o.style.display==="none"&&v({ctx:e})},2e3)}var wt={generate:Jt};function Jt({ctx:e}){let t=e.getConfig(),o=t.iframeUrl||"https://chatbot.dialogintelligens.dk";d.log("generateChatbotHTML - iframeUrl:",o,"chatbotID:",e.getChatbotId());let n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 750">
            <defs>
              <clipPath id="circle-clip"><path d="M375 0C167.9 0 0 167.9 0 375s167.9 375 375 375 375-167.9 375-375S582.1 0 375 0z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bubble-clip"><path d="M139 146.4h454v440.6H139z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bar-clip"><path d="M245.7 312h255.6v110.7H245.7z" clip-rule="nonzero"/></clipPath>
              <clipPath id="star-lg-clip"><path d="M266.2 228.1h234.8v234.7H266.2z" clip-rule="nonzero"/></clipPath>
            </defs>
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
            </svg>`;function i(s){return s&&w.isLottieUrl(s)?(w.ensurePlayerLoaded(),w.getPlayerHtml(s)):s?`<img src="${s}" alt="Chat" />`:n}let a=i(t.chatButtonImageUrl),r=!!t.mobileChatButtonImageUrl,p;if(r){let s=i(t.mobileChatButtonImageUrl);p=`<span class="desktop-button-content">${a}</span><span class="mobile-button-content">${s}</span>`}else p=a;return t.fullscreenMode===!0?`
        <div id="chat-container" class="chat-open">
        <button id="chat-button" style="display: none;"></button>
        <button id="minimize-button" style="display: none;">\u2212</button>
        <div id="plus-overlay" style="display: none;">+</div>
        <div id="chatbase-message-bubbles" style="display: none;"></div>
        </div>

        <iframe
        id="chat-iframe"
        src="${o}"
        allow="microphone"
        style="display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; border: none; z-index: ${t.iframeZIndex||3e3};">
        </iframe>
    `:`
        <div id="chat-container">
        <!-- Chat Button -->
        <button id="chat-button">
            ${p}
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
        src="${o}"
        allow="microphone"
        style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: ${t.iframeZIndex||3e3};">
        </iframe>
    `}var xt={inject:Xt};function Xt({ctx:e}){let t=e.getConfig(),o=t.productButtonColor||t.themeColor||"#1a1d56",n=`
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
  bottom: calc(${(t.buttonBottom||"27px").replace(/\s*!important/g,"")} + 15px);
  right: calc(${(t.buttonRight||"10px").replace(/\s*!important/g,"")} + 5px);
  z-index: ${t.zIndex||190};
  transition: all 0.3s ease;
}
#chat-container #chat-button {
  cursor: pointer !important;
  background: none !important;
  border: none !important;
  position: fixed !important;
  z-index: calc(${t.zIndex||190} + 10) !important;
  right: calc(${(t.buttonRight||"10px").replace(/\s*!important/g,"")} + 5px) !important;
  bottom: calc(${(t.buttonBottom||"27px").replace(/\s*!important/g,"")} + 15px) !important;
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
  width: ${t.buttonSize||"74"}px !important;
  height: ${t.buttonSize||"74"}px !important;
  display: block !important;
  transition: opacity 0.3s, transform 0.3s !important;
}
#chat-container #chat-button:hover svg {
  opacity: 1 !important;
  transform: scale(1.1) !important;
}
#chat-container #chat-button img {
  width: ${t.buttonSize||"74"}px;
  height: ${t.buttonSize||"74"}px;
  object-fit: contain;
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: block;
}
#chat-container #chat-button:hover img {
  transform: scale(1.1);
  opacity: 1;
}
#chat-container #chat-button dotlottie-player {
  width: ${t.buttonSize||"74"}px !important;
  height: ${t.buttonSize||"74"}px !important;
  display: block !important;
  transition: opacity 0.3s, transform 0.3s !important;
}
#chat-container #chat-button:hover dotlottie-player {
  opacity: 1 !important;
  transform: scale(1.1) !important;
}

/* Mobile/desktop button content switching */
#chat-container #chat-button .mobile-button-content {
  display: none !important;
}
#chat-container #chat-button .desktop-button-content {
  display: contents !important;
}

/* Minimize button - positioned at bottom right of the icon */
#minimize-button {
  position: absolute !important;
  top: calc(${t.buttonSize||"74"}px * -0.154) !important;
  right: calc(${t.buttonSize||"74"}px * -0.077) !important;
  width: calc(${t.buttonSize||"74"}px * 0.37) !important;
  height: calc(${t.buttonSize||"74"}px * 0.37) !important;
  min-width: calc(${t.buttonSize||"74"}px * 0.37) !important;
  min-height: calc(${t.buttonSize||"74"}px * 0.37) !important;
  max-width: calc(${t.buttonSize||"74"}px * 0.37) !important;
  max-height: calc(${t.buttonSize||"74"}px * 0.37) !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 50% !important;
  background: rgba(0, 0, 0, 0.6) !important;
  color: white !important;
  border: 2px solid white !important;
  font-size: calc(${t.buttonSize||"74"}px * 0.277) !important;
  font-weight: bold !important;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: calc(${t.zIndex||190} + 9) !important;
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
  right: calc(${(t.buttonRight||"10px").replace(/\s*!important/g,"")} + -2px) !important;
  bottom: calc(${(t.buttonBottom||"20px").replace(/\s*!important/g,"")} + -15px) !important;
}
@media (max-width: 1000px) {
  #chat-container.minimized #chat-button {
    right: calc(${(t.mobileButtonRight||t.buttonRight||"10px").replace(/\s*!important/g,"")} + -2px) !important;
    bottom: calc(${(t.mobileButtonBottom||t.buttonBottom||"20px").replace(/\s*!important/g,"")} + -15px) !important;
  }
}
#chat-container.minimized #minimize-button {
  display: none;
}

/* Plus overlay when minimized */
#plus-overlay {
  position: absolute !important;
  bottom: calc(${t.buttonSize||"74"}px * -0.069) !important;
  right: calc(${t.buttonSize||"74"}px * 0.154) !important;
  font-size: calc(${t.buttonSize||"74"}px * 0.23) !important;
  font-weight: bold !important;
  color: white !important;
  background: rgba(100, 100, 100, 0.7) !important;
  width: calc(${t.buttonSize||"74"}px * 0.308) !important;
  height: calc(${t.buttonSize||"74"}px * 0.308) !important;
  min-width: calc(${t.buttonSize||"74"}px * 0.308) !important;
  min-height: calc(${t.buttonSize||"74"}px * 0.308) !important;
  max-width: calc(${t.buttonSize||"74"}px * 0.308) !important;
  max-height: calc(${t.buttonSize||"74"}px * 0.308) !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 50% !important;
  border: none !important;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer !important;
  z-index: calc(${t.zIndex||190} + 20) !important;
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
  z-index: calc(${t.zIndex||190} + 5);
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
  z-index: calc(${t.zIndex||190} + 999810);
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
  #chat-container {
    right: ${(t.mobileButtonRight||t.buttonRight||"10px").replace(/\s*!important/g,"")} !important;
    bottom: ${(t.mobileButtonBottom||t.buttonBottom||"20px").replace(/\s*!important/g,"")} !important;
  }

  #chat-container #chat-button {
    z-index: calc(${t.zIndex||190} + 8) !important;
    right: calc(${(t.mobileButtonRight||t.buttonRight||"10px").replace(/\s*!important/g,"")} + -8px) !important;
    bottom: calc(${(t.mobileButtonBottom||t.buttonBottom||"27px").replace(/\s*!important/g,"")} + -10px) !important;
  }

  #chat-container #chat-button .mobile-button-content {
    display: contents !important;
  }
  #chat-container #chat-button .desktop-button-content {
    display: none !important;
  }

  #chat-container #chat-button svg {
    width: ${t.mobileButtonSize||"50"}px !important;
    height: ${t.mobileButtonSize||"50"}px !important;
  }
  #chat-container #chat-button img {
    width: ${t.mobileButtonSize||"50"}px !important;
    height: ${t.mobileButtonSize||"50"}px !important;
  }
  #chat-container #chat-button dotlottie-player {
    width: ${t.mobileButtonSize||"50"}px !important;
    height: ${t.mobileButtonSize||"50"}px !important;
  }

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

  #chatbase-message-bubbles {
    min-width: 280px;
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

  #minimize-button {
    top: calc(${t.mobileButtonSize||"50"}px * -0.154) !important;
    right: calc(${t.mobileButtonSize||"50"}px * -0.077) !important;
    width: calc(${t.mobileButtonSize||"50"}px * 0.37) !important;
    height: calc(${t.mobileButtonSize||"50"}px * 0.37) !important;
    min-width: calc(${t.mobileButtonSize||"50"}px * 0.37) !important;
    min-height: calc(${t.mobileButtonSize||"50"}px * 0.37) !important;
    max-width: calc(${t.mobileButtonSize||"50"}px * 0.37) !important;
    max-height: calc(${t.mobileButtonSize||"50"}px * 0.37) !important;
    font-size: calc(${t.mobileButtonSize||"50"}px * 0.277) !important;
  }

  #plus-overlay {
    bottom: calc(${t.mobileButtonSize||"50"}px * -0.069) !important;
    right: calc(${t.mobileButtonSize||"50"}px * 0.154) !important;
    font-size: calc(${t.mobileButtonSize||"50"}px * 0.23) !important;
    width: calc(${t.mobileButtonSize||"50"}px * 0.308) !important;
    height: calc(${t.mobileButtonSize||"50"}px * 0.308) !important;
    min-width: calc(${t.mobileButtonSize||"50"}px * 0.308) !important;
    min-height: calc(${t.mobileButtonSize||"50"}px * 0.308) !important;
    max-width: calc(${t.mobileButtonSize||"50"}px * 0.308) !important;
    max-height: calc(${t.mobileButtonSize||"50"}px * 0.308) !important;
  }

  .notification-badge {
    top: calc(${t.mobileButtonSize||"50"}px * 0.014) !important;
    right: calc(${t.mobileButtonSize||"50"}px * 0.05) !important;
    min-width: calc(${t.mobileButtonSize||"50"}px * 0.27) !important;
    height: calc(${t.mobileButtonSize||"50"}px * 0.27) !important;
    padding: 0 calc(${t.mobileButtonSize||"50"}px * 0.068) !important;
    font-size: calc(${t.mobileButtonSize||"50"}px * 0.162) !important;
    line-height: calc(${t.mobileButtonSize||"50"}px * 0.27) !important;
  }
}

:root {
  --icon-color: ${o};
  --badge-color: #CC2B20;
}

/* Notification badge styles - scale relative to button size (default 74px) */
.notification-badge {
  position: absolute;
  top: calc(${t.buttonSize||"74"}px * 0.014);
  right: calc(${t.buttonSize||"74"}px * 0.12);
  min-width: calc(${t.buttonSize||"74"}px * 0.27);
  height: calc(${t.buttonSize||"74"}px * 0.27);
  padding: 0 calc(${t.buttonSize||"74"}px * 0.068);
  border-radius: 50%;
  background-color: var(--badge-color, #CC2B20);
  color: white;
  font-size: calc(${t.buttonSize||"74"}px * 0.162);
  font-weight: bold;
  line-height: calc(${t.buttonSize||"74"}px * 0.27);
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

`,i=document.createElement("style");i.id="di-chatbot-styles",i.appendChild(document.createTextNode(n)),document.head.appendChild(i),document.documentElement.style.setProperty("--icon-color",o)}var It={get:Zt};async function Zt({ctx:e}){var a,r;let o=(typeof __CHATBOT_URL__!="undefined"&&__CHATBOT_URL__.trim().length>0?__CHATBOT_URL__:void 0)||(e.isPreviewMode&&((a=window.CHATBOT_PREVIEW_CONFIG)!=null&&a.iframeUrl)?window.CHATBOT_PREVIEW_CONFIG.iframeUrl:"https://chatbot.dialogintelligens.dk");if(d.log("Config.get - defaultIframeUrl:",o),e.isPreviewMode){let p=e.getConfig(),l=(r=window.CHATBOT_PREVIEW_CONFIG)!=null?r:{},s={...p,...l,iframeUrl:l.iframeUrl||p.iframeUrl||o};if(!l.leadFields)try{let c=await fetch(`${b.getUrl({ctx:e})}/api/integration-config/${e.getChatbotId()}`);if(c.ok){let h=await c.json();s={...p,...h,...l,iframeUrl:l.iframeUrl||p.iframeUrl||h.iframeUrl||o}}}catch(c){d.warn("Failed to fetch leadFields for preview mode:",c)}return m.setConfig(s),m.setChatbotId(e.getChatbotId()),{isPreviewMode:e.isPreviewMode,getChatbotId:e.getChatbotId,hasSentMessageToChatbot:e.hasSentMessageToChatbot,getConfig:()=>{var c;return(c=m.getConfig())!=null?c:s}}}let n=await Qt({ctx:e}),i={...n,iframeUrl:n.iframeUrl||o};return m.setConfig(i),m.setChatbotId(e.getChatbotId()),{isPreviewMode:e.isPreviewMode,getChatbotId:e.getChatbotId,hasSentMessageToChatbot:e.hasSentMessageToChatbot,getConfig:()=>{var p;return(p=m.getConfig())!=null?p:i}}}async function Qt({ctx:e}){try{d.log(`Loading configuration for chatbot: ${e.getChatbotId()}`);let t=await fetch(`${b.getUrl({ctx:e})}/api/integration-config/${e.getChatbotId()}`);if(t.status===403)return d.warn("Domain not authorized for this chatbot. Widget will not load."),{...e.getConfig(),_domainBlocked:!0};if(!t.ok)throw new Error(`Failed to load configuration: ${t.status} ${t.statusText}`);let o=await t.json();return{...e.getConfig(),...o}}catch(t){return d.error("Error loading chatbot config:",t),{...e.getConfig(),themeColor:"#1a1d56",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Vores virtuelle assistent er h\xE4r for at hj\xE6lpe dig.",titleG:"Chat Assistent",enableMinimizeButton:!0,enablePopupMessage:!0}}}function tt(){let e=document.getElementById("chat-button");e&&e.addEventListener("click",()=>{let t=document.getElementById("notification-badge");t&&t.remove(),d.log("Chatbot opened \u2014 notification badge removed.")})}function zt({ctx:e}){window.CHATBOT_PREVIEW_CONFIG&&(m.updateConfig(window.CHATBOT_PREVIEW_CONFIG),f({ctx:e})),window.addEventListener("previewConfigUpdate",t=>{var r,p,l,s,c,h;let o=t,n=m.getChatbotId(),i=o.detail.chatbotID,a=i&&i!==n;i&&m.setChatbotId(i),m.updateConfig(o.detail),(o.detail.chatButtonImageUrl!==void 0||o.detail.mobileChatButtonImageUrl!==void 0)&&ie({chatButtonImageUrl:(l=(p=o.detail.chatButtonImageUrl)!=null?p:(r=m.getConfig())==null?void 0:r.chatButtonImageUrl)!=null?l:"",mobileChatButtonImageUrl:(h=(c=o.detail.mobileChatButtonImageUrl)!=null?c:(s=m.getConfig())==null?void 0:s.mobileChatButtonImageUrl)!=null?h:""}),(o.detail.mobileButtonBottom!==void 0||o.detail.mobileButtonRight!==void 0||o.detail.buttonBottom!==void 0||o.detail.buttonRight!==void 0)&&ee(),(o.detail.buttonSize!==void 0||o.detail.mobileButtonSize!==void 0)&&oe(),f({ctx:e}),ne({config:o.detail}),M({ctx:e}),a?(d.log("Preview: Switching chatbot from",n,"to",i),v({ctx:e}),setTimeout(()=>{te({ctx:e})},100)):v({ctx:e})})}function te({ctx:e}){var o;let t=document.getElementById("chat-iframe");if(t)try{let n=e.getConfig(),i=n.iframeUrl,a=y.getTargetOrigin(i);a&&(d.log("Sending resetConversation to iframe with firstMessage:",n.firstMessage),(o=t.contentWindow)==null||o.postMessage({action:"resetConversation",firstMessage:n.firstMessage},a))}catch(n){d.warn("Failed to send reset to iframe:",n)}}function ee(){let e=document.getElementById("chat-button");if(!e)return;let t=m.getConfig(),o=window.innerWidth<=1e3,n=(o?(t==null?void 0:t.mobileButtonRight)||(t==null?void 0:t.buttonRight)||"10px":(t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),i=(o?(t==null?void 0:t.mobileButtonBottom)||(t==null?void 0:t.buttonBottom)||"27px":(t==null?void 0:t.buttonBottom)||"27px").replace(/\s*!important/g,""),a=o?"-8px":"5px",r=o?"-10px":"15px";e.style.setProperty("right",`calc(${n} + ${a})`,"important"),e.style.setProperty("bottom",`calc(${i} + ${r})`,"important");let p=document.getElementById("chat-container");if(p&&o){let l=((t==null?void 0:t.mobileButtonRight)||(t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),s=((t==null?void 0:t.mobileButtonBottom)||(t==null?void 0:t.buttonBottom)||"20px").replace(/\s*!important/g,"");p.style.setProperty("right",l,"important"),p.style.setProperty("bottom",s,"important")}}function oe(){let e=document.getElementById("chat-button");if(!e)return;let t=m.getConfig(),o=window.innerWidth<=1e3,n=o?(t==null?void 0:t.mobileButtonSize)||"65":(t==null?void 0:t.buttonSize)||"74",i=parseFloat(n)||74;e.querySelectorAll("svg, img, dotlottie-player").forEach(c=>{c.style.setProperty("width",`${n}px`,"important"),c.style.setProperty("height",`${n}px`,"important")});let r=e.querySelector(".notification-badge");if(r){r.style.setProperty("top",`${i*.014}px`,"important");let c=o?i*.05:i*.12;r.style.setProperty("right",`${c}px`,"important"),r.style.setProperty("min-width",`${i*.27}px`,"important"),r.style.setProperty("height",`${i*.27}px`,"important"),r.style.setProperty("font-size",`${i*.162}px`,"important"),r.style.setProperty("line-height",`${i*.27}px`,"important")}let p=parseFloat(o?(t==null?void 0:t.mobileButtonSize)||"65":(t==null?void 0:t.buttonSize)||"65")||65,l=document.getElementById("minimize-button");if(l){l.style.setProperty("top",`${p*-.154}px`,"important"),l.style.setProperty("right",`${p*-.077}px`,"important");let c=`${p*.37}px`;l.style.setProperty("width",c,"important"),l.style.setProperty("height",c,"important"),l.style.setProperty("min-width",c,"important"),l.style.setProperty("min-height",c,"important"),l.style.setProperty("max-width",c,"important"),l.style.setProperty("max-height",c,"important"),l.style.setProperty("font-size",`${p*.277}px`,"important")}let s=document.getElementById("plus-overlay");if(s){s.style.setProperty("bottom",`${p*-.069}px`,"important"),s.style.setProperty("right",`${p*.154}px`,"important");let c=`${p*.308}px`;s.style.setProperty("width",c,"important"),s.style.setProperty("height",c,"important"),s.style.setProperty("min-width",c,"important"),s.style.setProperty("min-height",c,"important"),s.style.setProperty("max-width",c,"important"),s.style.setProperty("max-height",c,"important"),s.style.setProperty("font-size",`${p*.23}px`,"important")}}function St(e){let t=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 750">
            <defs>
              <clipPath id="circle-clip"><path d="M375 0C167.9 0 0 167.9 0 375s167.9 375 375 375 375-167.9 375-375S582.1 0 375 0z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bubble-clip"><path d="M139 146.4h454v440.6H139z" clip-rule="nonzero"/></clipPath>
              <clipPath id="bar-clip"><path d="M245.7 312h255.6v110.7H245.7z" clip-rule="nonzero"/></clipPath>
              <clipPath id="star-lg-clip"><path d="M266.2 228.1h234.8v234.7H266.2z" clip-rule="nonzero"/></clipPath>
            </defs>
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
            </svg>`;return e&&w.isLottieUrl(e)?(w.ensurePlayerLoaded(),w.getPlayerHtml(e)):e?`<img src="${e}" alt="Chat" />`:t}function ie({chatButtonImageUrl:e,mobileChatButtonImageUrl:t}){let o=document.getElementById("chat-button");if(!o)return;let n=St(e||void 0),i;if(t){let r=St(t);i=`<span class="desktop-button-content">${n}</span><span class="mobile-button-content">${r}</span>`}else i=n;let a=o.querySelector("#notification-badge");o.innerHTML=i,a&&o.appendChild(a)}function ne({config:e}){let t=e.fullscreenMode===!0,o=document.getElementById("chat-button"),n=document.getElementById("chatbase-message-bubbles"),i=document.getElementById("minimize-button"),a=document.getElementById("chat-container"),r=document.getElementById("chat-iframe");t?(o&&(o.style.display="none"),n&&(n.style.display="none"),i&&(i.style.display="none"),a&&a.classList.add("chat-open"),r&&(r.style.display="block")):(o&&(o.style.display=""),r&&r.style.display)}var et={init:Tt};async function Tt({ctx:e}){if(m.chatbotInitialized)return;if(!document.body){setTimeout(()=>{Tt({ctx:e})},500);return}if(new URLSearchParams(window.location.search).get("chat")==="open"&&(localStorage.setItem("chatWindowState","open"),history.replaceState(null,"",window.location.pathname)),document.getElementById("chat-container"))return;m.setChatbotInitialized();let o=await It.get({ctx:e});if(m.setCtx(o),o.getConfig()._domainBlocked){d.warn("Chatbot initialization aborted: domain not authorized");return}let n=await _({ctx:o});n&&n.variant_id&&m.setSplitTestId(n.variant_id),o.isPreviewMode&&zt({ctx:o});let i=o.getConfig().fontFamily;if(i){let l=document.createElement("link");l.rel="stylesheet",l.href=`https://fonts.googleapis.com/css2?family=${i.replace(/ /g,"+")}:wght@200;300;400;600;900&display=swap`,document.head.appendChild(l)}let a=wt.generate({ctx:o});function r(){try{document.body.insertAdjacentHTML("beforeend",a),setTimeout(()=>{let l=document.getElementById("chat-container");!o.getConfig().enableMinimizeButton&&l&&l.classList.add("minimize-disabled")},100)}catch(l){d.error("Failed to insert chatbot HTML:",l)}}if(document.body?(r(),tt()):requestAnimationFrame(()=>{document.body?(r(),tt()):setTimeout(r,100)}),xt.inject({ctx:o}),vt.register({ctx:o}),o.getConfig().fullscreenMode===!0)setTimeout(()=>{let l=document.getElementById("chat-iframe");if(l!=null&&l.contentWindow)try{let s=o.getConfig().iframeUrl,c=y.getTargetOrigin(s);c&&l.contentWindow.postMessage({action:"chatOpened"},c)}catch(s){}f({ctx:o}),v({ctx:o})},500);else{let l=window.innerWidth>=1e3,s=localStorage.getItem("chatWindowState");l&&s==="open"?setTimeout(()=>{document.getElementById("chat-button")&&T({ctx:o})},500):l||localStorage.removeItem("chatWindowState"),o.getConfig().enablePopupMessage&&!(l&&s==="open")&&setTimeout(()=>{D({ctx:o})},2e3)}o.isPreviewMode||M({ctx:o})}window.DialogIntelligens=dt();(async function(){await ae()})();async function ae(){let e={purchaseTrackingEnabled:!1,enableMinimizeButton:!1,enablePopupMessage:!1,pagePath:window.location.href,isPhoneView:window.innerWidth<1e3,leadGen:"%%",leadMail:"",leadField1:"Navn",leadField2:"Email",useThumbsRating:!1,ratingTimerDuration:18e3,replaceExclamationWithPeriod:!1,privacyLink:"https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf",freshdeskEmailLabel:"Din email:",freshdeskMessageLabel:"Besked til kundeservice:",freshdeskImageLabel:"Upload billede (valgfrit):",freshdeskChooseFileText:"V\xE6lg fil",freshdeskNoFileText:"Ingen fil valgt",freshdeskSendingText:"Sender...",freshdeskSubmitText:"Send henvendelse",freshdeskEmailRequiredError:"Email er p\xE5kr\xE6vet",freshdeskEmailInvalidError:"Indtast venligst en gyldig email adresse",freshdeskFormErrorText:"Ret venligst fejlene i formularen",freshdeskMessageRequiredError:"Besked er p\xE5kr\xE6vet",freshdeskSubmitErrorText:"Der opstod en fejl",contactConfirmationText:"Tak for din henvendelse",freshdeskConfirmationText:"Tak for din henvendelse",freshdeskSubjectText:"Din henvendelse",inputPlaceholder:"Skriv dit sp\xF8rgsm\xE5l her...",ratingMessage:"Fik du besvaret dit sp\xF8rgsm\xE5l?",productButtonText:"SE PRODUKT",productButtonColor:"",productDiscountPriceColor:"",productButtonPadding:"",productImageHeightMultiplier:1,headerLogoG:"",messageIcon:"",themeColor:"#1a1d56",aiMessageColor:"#e5eaf5",aiMessageTextColor:"#262641",userMessageColor:"",userMessageTextColor:"#ffffff",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opst\xE5 fejl, og at samtalen kan gemmes og behandles. L\xE6s mere i vores privatlivspolitik.",subtitleLinkText:"",subtitleLinkUrl:"",fontFamily:"",enableLivechat:!1,titleG:"Chat Assistent",require_email_before_conversation:!1,splitTestId:null,isTabletView:!1,buttonBottom:"20px",buttonRight:"10px"};m.setConfig(e);let t={isPreviewMode:!!window.CHATBOT_PREVIEW_MODE,getChatbotId:Bt,hasSentMessageToChatbot:()=>localStorage.getItem(`hasSentMessage_${Bt()}`)==="true",getConfig:()=>re(e)},o=t.getChatbotId();if(o)try{if((await fetch(`${b.getUrl({ctx:t})}/api/integration-config/${o}`)).status===403){d.warn("Domain not authorized for this chatbot. Chatbot will not load.");return}}catch(n){d.warn("Failed to check domain authorization:",n)}t.isPreviewMode?d.log("Preview Mode: Initializing chatbot preview"):d.log(`Initializing universal chatbot: ${t.getChatbotId()}`),document.readyState==="complete"?V({ctx:t}):document.readyState==="interactive"?V({ctx:t}):document.addEventListener("DOMContentLoaded",()=>{V({ctx:t})}),setTimeout(()=>{m.chatbotInitialized||V({ctx:t})},2e3)}function re(e){var o;let t=m.getConfig();return t||(window.CHATBOT_PREVIEW_MODE&&window.CHATBOT_PREVIEW_CONFIG?{...e,...window.CHATBOT_PREVIEW_CONFIG,iframeUrl:(o=window.CHATBOT_PREVIEW_CONFIG.iframeUrl)!=null?o:"https://chatbot.dialogintelligens.dk"}:e)}function Bt(){var t,o;let e=m.getChatbotId();return e||(window.CHATBOT_PREVIEW_MODE&&((t=window.CHATBOT_PREVIEW_CONFIG)!=null&&t.chatbotID)?window.CHATBOT_PREVIEW_CONFIG.chatbotID:(o=se())!=null?o:"")}function se(){try{let e=document.currentScript;if(e||(e=Array.from(document.scripts).find(i=>{var a;return(a=i.src)==null?void 0:a.includes("/universal-chatbot.js")})),!e||!e.src)return d.error("Could not find script reference. Make sure script is loaded correctly."),null;let o=new URL(e.src).searchParams.get("id");return o||(d.error('Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"><\/script>'),d.error("Script URL:",e.src),null)}catch(e){return d.error("Failed to extract chatbot ID from script URL:",e),null}}function V({ctx:e}){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{et.init({ctx:e})},100)}):setTimeout(()=>{et.init({ctx:e})},100)}})();

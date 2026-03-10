"use strict";(()=>{var fo=/^(javascript:|data:|vbscript:|file:|blob:)/i,go=/^(\/|\.\/|\.\.\/|\?|#)/,ho=/[\u0000-\u001F\u007F]/,bo=/["'<>`]/,yo=/\s/;function Xt(e){if(!e||typeof e!="string")return null;let t=e.trim();if(!t||t.startsWith("//")||ho.test(t)||bo.test(t)||yo.test(t))return null;let n=t.replace(/[\u0000-\u001F\u007F\s]+/g,"");if(fo.test(n))return null;if(go.test(t))return t;try{let o=new URL(t),r=o.protocol.toLowerCase();return r!=="http:"&&r!=="https:"?null:o.href}catch(o){return null}}function Ce(e){let t=Xt(e);return!t||t.startsWith("#")||t.startsWith("?")?null:t}function rn(e){if(!e)return null;let t=Xt(e);return!t||t.startsWith("#")||t.startsWith("?")?null:t}function M(e){return rn(e)}function st(e){return rn(e)}var d={log:To,error:Eo,warn:Co,isEnabled:Zt};function To(...e){Zt()&&console.log(...e)}function Co(...e){Zt()&&console.warn(...e)}function Eo(...e){Zt()&&console.error(...e)}function Zt(){return!!(window.localStorage.getItem("CHATBOT_LOGGING_ENABLED")==="true"||window.CHATBOT_LOGGING_ENABLED)}var H={getUrl:Io};function Io({ctx:e}){var n;if(e.isPreviewMode&&((n=window.CHATBOT_PREVIEW_CONFIG)!=null&&n.backendUrl))return window.CHATBOT_PREVIEW_CONFIG.backendUrl;let t="https://backend-development-k1o9.onrender.com".trim().length>0?"https://backend-development-k1o9.onrender.com":void 0;return t||"https://api.dialogintelligens.dk"}var Ee={isLottieUrl:cn,ensurePlayerLoaded:dn,createPlayerElement:wo,destroyPlayerElement:xo};function cn(e){if(!e)return!1;let t=e.split("?")[0].toLowerCase();return t.endsWith(".json")||t.endsWith(".lottie")}var an="https://assets.dialogintelligens.dk/@dotlottie/dotlottie-player.mjs",sn="di-dotlottie-player-script",ln=!1;function So(){let e="".trim().length>0?"".trim():an,t=Xt(e);return t||an}function dn(){if(typeof document=="undefined"||typeof customElements!="undefined"&&customElements.get("dotlottie-player")||document.getElementById(sn)||ln)return;ln=!0;let e=document.createElement("script");e.id=sn,e.type="module",e.src=So(),e.crossOrigin="anonymous",e.onerror=()=>{d.warn("Failed to load dotlottie-player module",e.src)},document.head.appendChild(e)}function wo(e){let t=st(e);if(!t||!cn(t))return null;dn();let n=document.createElement("dotlottie-player");return n.className="di-lottie-player",n.setAttribute("src",t),n.setAttribute("autoplay",""),n.setAttribute("loop",""),n.style.width="100%",n.style.height="100%",n.style.display="block",n}function xo(e){var n,o,r;if(!e)return;let t=e;if(t.tagName.toLowerCase()==="dotlottie-player")try{(n=t.pause)==null||n.call(t),(o=t.stop)==null||o.call(t),(r=t.destroy)==null||r.call(t)}catch(a){d.warn("Failed to destroy dotlottie-player",a)}}var D={getTargetOrigin:un,canPostToIframe:pn,postToIframe:_o};function un(e){if(!e)return"";if(e.startsWith("/"))return window.location.origin;try{return new URL(e).origin}catch(t){return e.replace(/\/$/,"")}}function pn({iframe:e,targetOrigin:t}){if(!(e!=null&&e.contentWindow)||!t)return!1;try{return e.contentWindow.location.origin===t}catch(n){return!0}}function _o({iframe:e,iframeUrl:t,data:n,reason:o}){var a;let r=un(t);if(!r)return!1;if(!pn({iframe:e,targetOrigin:r}))return d.log("Skipping iframe postMessage until iframe is ready",o||"unknown","targetOrigin:",r),!1;try{return(a=e==null?void 0:e.contentWindow)==null||a.postMessage(n,r),!0}catch(l){return d.warn("Failed to postMessage to iframe",o||"unknown",l),!1}}var h={isIframeEnlarged:!1,chatbotInitialized:!!window.chatbotInitialized,hasReportedPurchase:!1,splitTestId:null,_config:null,_chatbotId:null,_ctx:null,setChatbotInitialized(){window.chatbotInitialized=!0,this.chatbotInitialized=!0},toggleIsIframeEnlarged(){this.isIframeEnlarged=!this.isIframeEnlarged},setHasReportedPurchase(e){this.hasReportedPurchase=e},setSplitTestId(e){this.splitTestId=e},setConfig(e){this._config=e},getConfig(){return this._config},setChatbotId(e){this._chatbotId=e},getChatbotId(){return this._chatbotId},setCtx(e){this._ctx=e},getCtx(){return this._ctx},updateConfig(e){this._config&&(this._config={...this._config,...e})},getState(){return{isIframeEnlarged:this.isIframeEnlarged,chatbotInitialized:this.chatbotInitialized,hasReportedPurchase:this.hasReportedPurchase,splitTestId:this.splitTestId}},reset(){this.isIframeEnlarged=!1,this.chatbotInitialized=!1,this.hasReportedPurchase=!1,this.splitTestId=null,this._config=null,this._chatbotId=null,this._ctx=null,window.chatbotInitialized=!1}};async function W({ctx:e}){var n;let t=document.getElementById("chat-iframe");if(t)try{let o=e.getConfig(),r=e.getChatbotId();d.log("sendMessageToIframe - chatbotID:",r,"iframeUrl:",o.iframeUrl),d.log("sendMessageToIframe - full config:",JSON.stringify(o,null,2));let a;if(o.raptorEnabled&&o.raptorCookieName){let u=document.cookie.match(new RegExp("(?:^|;\\s*)"+o.raptorCookieName+"=([^;]*)"));u&&(a=decodeURIComponent(u[1]))}let l;if(o.externalApiEnabled&&o.externalApiTokenSourceKey)try{l=Ao(o.externalApiTokenSource||"localStorage",o.externalApiTokenSourceKey,o.externalApiTokenJsonPath||null)}catch(u){d.warn("Failed to extract external API token:",u)}let p={action:"integrationOptions",chatbotID:r,...o,splitTestId:h.splitTestId,pagePath:e.isPreviewMode&&((n=window.CHATBOT_PREVIEW_CONFIG)!=null&&n.parentPageUrl)?window.CHATBOT_PREVIEW_CONFIG.parentPageUrl:window.location.href,isTabletView:window.innerWidth>=768&&window.innerWidth<1e3,isPhoneView:window.innerWidth<768,gptInterface:!1,raptorCookieId:a,externalApiToken:l},m=M(o.iframeUrl)||void 0;if(!m){d.warn("No iframeUrl configured, cannot send message to iframe");return}D.postToIframe({iframe:t,iframeUrl:m,data:p,reason:"integrationOptions"})}catch(o){d.warn("Failed to send message to iframe:",o)}}function vo(e,t){let n=t.split("."),o=e;for(let r of n){if(o==null)return;if(typeof o=="string")try{o=JSON.parse(o)}catch(a){return}if(typeof o=="object"&&o!==null)o=o[r];else return}if(typeof o=="string"){try{let r=JSON.parse(o);if(typeof r=="string")return r}catch(r){}return o}return o!=null?String(o):void 0}function Ao(e,t,n){let o=null;switch(e){case"localStorage":o=localStorage.getItem(t);break;case"sessionStorage":o=sessionStorage.getItem(t);break;case"cookie":{let r=document.cookie.match(new RegExp("(?:^|;\\s*)"+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"=([^;]*)"));o=r?decodeURIComponent(r[1]):null;break}default:return}if(o)return n?vo(o,n):o}function Jt(e){return typeof CSS!="undefined"&&CSS.supports("height","1dvh")?`${e}dvh`:`${e}vh`}function N({ctx:e}){let t=e.getConfig(),n=document.getElementById("chat-iframe");if(!n)return;if(window.CHATBOT_PREVIEW_MODE===!0){let a=t&&t.previewMode==="mobile";t&&t.fullscreenMode||a?(n.style.width="100vw",n.style.height=Jt(100),n.style.position="fixed",n.style.left="0",n.style.top="0",n.style.transform="none",n.style.bottom="0",n.style.right="0"):(n.style.width="calc(375px + 6vw)",n.style.height="calc(450px + 20vh)",n.style.position="fixed",n.style.left="auto",n.style.top="auto",n.style.transform="none",n.style.bottom="3vh",n.style.right="2vw");return}let r=t&&t.fullscreenMode===!0;r?(n.style.width="100%",n.style.height="100%",n.style.position="fixed",n.style.inset="0",n.style.left="0",n.style.top="0",n.style.right="0",n.style.bottom="0",n.style.transform="none"):h.isIframeEnlarged?(n.style.width=t.iframeWidthEnlarged||"calc(2 * 45vh + 6vw)",n.style.height=Jt(90)):window.innerWidth<1e3?(n.style.width="100vw",n.style.height=Jt(100)):(n.style.width=t.iframeWidthDesktop||"calc(50vh + 8vw)",n.style.height=Jt(90)),n.style.position="fixed",r||window.innerWidth<1e3?(n.style.left="0",n.style.top="0",n.style.transform="none",n.style.bottom="0",n.style.right="0"):(n.style.left="auto",n.style.top="auto",n.style.transform="none",n.style.bottom="3vh",n.style.right="2vw"),W({ctx:e})}function lt({ctx:e}){let t=document.getElementById("chat-button"),n=document.getElementById("chat-iframe"),o=document.getElementById("chatbase-message-bubbles"),r=document.getElementById("minimize-button"),a=document.getElementById("chat-container");if(!n){d.error("Chat iframe not found");return}let l=n.style.display;if(d.log(`toggleChatWindow called. Current display: "${l}"`),l==="none"||!l){d.log("Opening chat..."),n.style.display="block",t&&(t.style.display="none"),o&&(o.style.display="none"),r&&(r.style.display="block"),a&&(a.classList.add("chat-open"),a.classList.remove("minimized"));let p=`chatMinimized_${e.getChatbotId()}`;localStorage.removeItem(p);let m=`popupState_${e.getChatbotId()}`;localStorage.setItem(m,"dismissed"),window.innerWidth>=1e3&&localStorage.setItem("chatWindowState","open"),N({ctx:e}),d.log("After adjustIframeSize - iframe display:",n.style.display,"dimensions:",n.style.width,"x",n.style.height),W({ctx:e}),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},50),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},150),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},300);try{let g=M(e.getConfig().iframeUrl)||void 0;D.postToIframe({iframe:n,iframeUrl:g,data:{action:"chatOpened"},reason:"chatOpened"})}catch(g){}}else d.log("Closing chat..."),n.style.display="none",t&&(t.style.display="block"),r&&(r.style.display="none"),a&&a.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}function mn(){return{hide(){let e=document.getElementById("chat-container"),t=document.getElementById("chat-iframe");e&&(e.style.display="none"),t&&(t.style.display="none")},show(){let e=document.getElementById("chat-container"),t=document.getElementById("chat-button"),n=document.getElementById("chat-iframe");e&&(e.style.display="",e.classList.remove("chat-open")),t&&(t.style.display="block"),n&&(n.style.display="none")},open(){let e=h.getCtx();if(!e)return;let t=document.getElementById("chat-container");t&&(t.style.display="",t.classList.remove("chat-open"));let n=document.getElementById("chat-iframe");(!n||n.style.display==="none"||!n.style.display)&&lt({ctx:e})},destroy(){let e=document.getElementById("chat-container");e&&e.remove();let t=document.getElementById("chat-iframe");t&&t.remove();let n=document.getElementById("di-chatbot-styles");n&&n.remove(),h.reset()}}}function Mt(e,t){let n=t?new CustomEvent(e,{detail:t}):new CustomEvent(e);window.dispatchEvent(n)}var ct={open(){Mt("chat_open",{chat_type:"shopping_assistant"})},recommendation(){Mt("chat_recommendation",{chat_type:"shopping_assistant"})},response(e){Mt("chat_response",{chat_type:"shopping_assistant",response_latency_ms:e})},productClick(){Mt("chat_product_click",{chat_type:"shopping_assistant"})},conversationClassified(e){Mt("chat_conversation_classified",{chat_type:"shopping_assistant",classification:e})}};function fn(){let e=null;return{start(){e=performance.now()},stop(){if(e===null)return null;let t=Math.round(performance.now()-e);return e=null,t}}}function wt({ctx:e}){e.getConfig().purchaseTrackingEnabled&&e.hasSentMessageToChatbot()&&(setInterval(()=>Lo({ctx:e}),2e3),setInterval(()=>Po({ctx:e}),2e3))}function Lo({ctx:e}){var n,o;let t=Mo({ctx:e});if(!(!t||!t.length))for(let r of t){let a=gn(r);if(a){let l=Bo((o=(n=a.textContent)==null?void 0:n.trim())!=null?o:"",e);if(l){localStorage.setItem(hn(e.getChatbotId()),String(l));break}}}}function Po({ctx:e}){if(!e.hasSentMessageToChatbot()||h.hasReportedPurchase)return;let t=Ro({ctx:e});if(!t||!t.length)return;let n=t.map(o=>gn(o)).filter(o=>!!o);n.length&&n.forEach(o=>{o.hasAttribute("data-purchase-tracked")||(o.setAttribute("data-purchase-tracked","true"),o.addEventListener("click",async()=>{let r=localStorage.getItem(hn(e.getChatbotId()));r&&await Oo(parseFloat(r),e)}))})}function gn(e){let t=e?e.trim():"";try{return document.querySelector(t)}catch(n){return null}}function Ro({ctx:e}){let{checkoutPurchaseSelector:t}=e.getConfig();return e.isPreviewMode&&t?["#purchase-tracking-checkout-purchase","#purchase-tracking-checkout-purchase-alternative"]:typeof t=="string"?t.split(",").map(n=>n.trim()).filter(Boolean):[]}function Mo({ctx:e}){let{checkoutPriceSelector:t}=e.getConfig();return e.isPreviewMode&&t?["#purchase-tracking-checkout-price"]:typeof t=="string"?t.split(",").map(n=>n.trim()).filter(Boolean):[]}async function Oo(e,t){if(localStorage.getItem(Ie(t.getChatbotId()))){h.setHasReportedPurchase(!0);return}let n=t.getConfig().currency||"DKK",o=document.getElementById("chat-iframe");if(!o)return;let r=t.getConfig().iframeUrl;D.postToIframe({iframe:o,iframeUrl:r,data:{action:"reportPurchase",chatbotID:t.getChatbotId(),totalPrice:e,currency:n},reason:"reportPurchase"})}function Bo(e,t){let n=t.getConfig().priceExtractionLocale||"comma",o=e.match(/\d[\d.,]*/g);if(!o||o.length===0)return null;let r=0;for(let a of o){let l=a.replace(/[^\d.,]/g,"");n==="comma"?l=l.replace(/\./g,"").replace(",","."):l=l.replace(/,/g,"");let p=parseFloat(l);!isNaN(p)&&p>r&&(r=p)}return r>0?r:null}function Ie(e){let t=new Date,n=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`purchaseReported_${`${n}-${o}-${r}`}_${e}`}function hn(e){return`purchaseTotalPriceKey_${e}`}function dt({ctx:e}){let t=`visitorKey_${e.getChatbotId()}`,n=localStorage.getItem(t);if(!n){let o=`visitor-${Date.now()}-${Math.floor(Math.random()*1e4)}`;return localStorage.setItem(t,o),o}return n}async function Ot({ctx:e}){try{let t=dt({ctx:e}),n=H.getUrl({ctx:e}),o=await fetch(`${n}/api/split-assign?chatbot_id=${encodeURIComponent(e.getChatbotId())}&visitor_key=${encodeURIComponent(t)}`);if(!o.ok)return null;let r=await o.json();return r&&r.enabled?r:null}catch(t){return d.warn("Split test assignment failed:",t),null}}async function Se({variantId:e,ctx:t}){try{let n=dt({ctx:t}),o=H.getUrl({ctx:t});await fetch(`${o}/api/split-impression`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:t.getChatbotId(),variant_id:e,visitor_key:n})})}catch(n){d.warn("Failed to log split impression:",n)}}var bn=!1;function Qt(e){return getComputedStyle(e).display!=="none"}function zo(e){let t=getComputedStyle(e),n=t.getPropertyValue("scale");if(n&&n!=="none"){let r=parseFloat(n);if(!Number.isNaN(r)&&r>0)return r}let o=t.transform;if(o&&o!=="none"){let r=o.match(/^matrix\((.+)\)$/);if(r){let a=r[1].split(",").map(l=>parseFloat(l.trim()));if(a.length>=6&&!Number.isNaN(a[0]))return a[0]}}return 1}function ko(e){let t=e.getBoundingClientRect(),n=getComputedStyle(e),o=parseFloat(n.paddingLeft||"0")||0,r=parseFloat(n.paddingRight||"0")||0,a=parseFloat(n.paddingTop||"0")||0,l=parseFloat(n.paddingBottom||"0")||0;return{left:t.left+o,right:t.right-r,top:t.top+a,bottom:t.bottom-l,width:Math.max(0,t.width-o-r),height:Math.max(0,t.height-a-l)}}function we(){let e=document.getElementById("chatbase-message-bubbles"),t=document.getElementById("chat-button");if(!e||!t||!Qt(e))return;let n=8,o=ko(t),r=window.innerWidth,a=window.innerHeight,l=getComputedStyle(t),p=parseFloat(l.paddingLeft||"0")||0,m=parseFloat(l.paddingRight||"0")||0,u=parseFloat(l.paddingTop||"0")||0,g=parseFloat(l.paddingBottom||"0")||0,b=Math.max(p,m,u,g),T=zo(e)||.58,$=b/T,S=Math.max(18,Math.min(60,Math.round(o.width*.55))),q=Math.ceil(S/T),w=e.querySelector(".message-box");if(w){let U=$,_=14,ot=12,C=14;w.style.paddingTop=`${Math.min(U,ot)}px`,w.style.paddingRight=`${Math.min(U,C)}px`,w.style.paddingBottom=`${Math.min(U,ot)}px`,w.style.paddingLeft=`${Math.max(U,_)}px`}let ut=o.height/T;if(w&&!e.dataset.measured){let U=e.querySelector(".close-popup");U&&(U.style.display="none"),e.style.maxHeight="none",e.style.maxWidth="none",e.style.paddingRight=`${q}px`,e.style.paddingLeft="0";let _=w.style.whiteSpace,ot=w.style.width;w.style.whiteSpace="nowrap",w.style.width="auto";let C=w.scrollWidth;w.style.whiteSpace=_,w.style.width=ot;let ht=window.innerWidth<1e3?100:280,V=700+q,it=Math.max(ht,Math.min(450,C+8))+q;for(e.style.width=`${it}px`;e.scrollHeight>ut&&it<V;)it+=20,e.style.width=`${it}px`;if(e.scrollHeight>ut&&window.innerWidth<1e3){let bt=parseFloat(getComputedStyle(w).fontSize)||18;for(;e.scrollHeight>ut&&bt>9;)bt-=1,w.style.fontSize=`${bt}px`,w.style.lineHeight="1.2em"}U&&(U.style.display=""),e.style.maxWidth="",e.dataset.measured="1"}e.style.maxHeight=`${ut}px`,e.style.overflow="hidden";let xt=e.offsetWidth,X=e.offsetHeight,I=T;e.style.scale=String(I);let et=xt*I,pt=X*I,_t=18*I,Ft=_t+S,nt=o.top+o.height/2,A=o.left-_t+Ft,mt=o.right+_t-Ft,vt=A-et,At=mt+et,le=vt>=n,ce=At<=r-n,ft,Z,$t=!1;le?(e.classList.remove("tail-left"),ft=A-xt,Z=nt-X/2):ce?(e.classList.add("tail-left"),ft=mt,Z=nt-X/2,$t=!0):(e.classList.remove("tail-left"),ft=Math.max(n/I,A-xt),Z=nt-X/2),$t?(e.style.paddingLeft=`${q}px`,e.style.paddingRight="0"):(e.style.paddingLeft="0",e.style.paddingRight=`${q}px`);let Lt=nt-pt/2,x=nt+pt/2;Lt<n?Z+=(n-Lt)/I:x>a-n&&(Z-=(x-(a-n))/I),e.style.left=`${ft}px`,e.style.top=`${Z}px`}function Uo(){if(bn)return;bn=!0;let e=()=>{we()};window.addEventListener("resize",e,{passive:!0}),window.addEventListener("scroll",e,{passive:!0}),window.visualViewport&&(window.visualViewport.addEventListener("resize",e,{passive:!0}),window.visualViewport.addEventListener("scroll",e,{passive:!0}));let t=document.getElementById("chatbase-message-bubbles");t&&new ResizeObserver(e).observe(t)}function Tn(e){e.style.display="flex",e.style.visibility="hidden",delete e.dataset.measured,Uo(),requestAnimationFrame(()=>{we(),e.style.visibility="visible",requestAnimationFrame(()=>{we()})})}async function te({ctx:e}){let t=document.getElementById("chat-iframe");if(t&&t.style.display!=="none")return;let n=`chatMinimized_${e.getChatbotId()}`;if(localStorage.getItem(n)==="true")return;let o=window.innerWidth<1e3,r=`popupState_${e.getChatbotId()}`,a=`pageVisitCount_${e.getChatbotId()}`,l=`lastPageTime_${e.getChatbotId()}`,p=localStorage.getItem(r);if(!o){if(p==="shown"){Do({ctx:e});return}if(p==="dismissed")return;await yn({ctx:e}),localStorage.setItem(r,"shown");return}if(e.getConfig().popupShowOnMobile===!1||p==="dismissed")return;let m=`popupShowCount_${e.getChatbotId()}`,u=parseInt(localStorage.getItem(m)||"0"),g=e.getConfig().popupMaxDisplays||2;if(u>=g){localStorage.setItem(r,"dismissed");return}let b=parseInt(localStorage.getItem(a)||"0");b++,localStorage.setItem(a,b.toString());let T=Date.now();localStorage.setItem(l,T.toString()),b>=2&&setTimeout(()=>{let $=localStorage.getItem(l),S=localStorage.getItem(r),q=localStorage.getItem(`chatMinimized_${e.getChatbotId()}`);$===T.toString()&&S!=="dismissed"&&q!=="true"&&(u++,localStorage.setItem(m,u.toString()),yn({ctx:e}).then(()=>{setTimeout(()=>{let w=document.getElementById("chatbase-message-bubbles");w&&Qt(w)&&(w.style.display="none",u>=g&&localStorage.setItem(r,"dismissed"))},15e3)}))},6e3)}function Cn({messageBox:e,text:t}){e.textContent=t,e.append(document.createTextNode(" "));let n=document.createElement("span");n.id="funny-smiley",n.textContent="\u{1F60A}",e.appendChild(n)}async function yn({ctx:e}){let t=document.getElementById("chatbase-message-bubbles"),n=document.getElementById("popup-message-box");if(!t||!n)return;let o=await En({ctx:e})||"Har du brug for hj\xE6lp?",r=null;try{r=await Ot({ctx:e}),r&&r.variant&&r.variant.config&&r.variant.config.popup_text&&(o=r.variant.config.popup_text)}catch(a){d.warn("Split test check failed:",a)}Cn({messageBox:n,text:o}),r&&r.variant_id&&Se({variantId:r.variant_id,ctx:e}),t.classList.add("animate"),Tn(t),setTimeout(()=>{let a=document.getElementById("funny-smiley");a&&Qt(t)&&(a.classList.add("blink"),setTimeout(()=>{a.classList.remove("blink")},1e3))},2e3),setTimeout(()=>{let a=document.getElementById("funny-smiley");a&&Qt(t)&&(a.classList.add("jump"),setTimeout(()=>{a.classList.remove("jump")},1e3))},12e3)}async function Do({ctx:e}){let t=document.getElementById("chatbase-message-bubbles"),n=document.getElementById("popup-message-box");if(!t||!n)return;let o=await En({ctx:e})||"Har du brug for hj\xE6lp?",r=null;try{r=await Ot({ctx:e}),r&&r.variant&&r.variant.config&&r.variant.config.popup_text&&(o=r.variant.config.popup_text)}catch(a){d.warn("Split test check failed:",a)}Cn({messageBox:n,text:o}),r&&r.variant_id&&Se({variantId:r.variant_id,ctx:e}),t.classList.remove("animate"),Tn(t)}async function En({ctx:e}){try{let t=dt({ctx:e}),n=H.getUrl({ctx:e}),o=window.location.href,r=await fetch(`${n}/api/popup-message?chatbot_id=${encodeURIComponent(e.getChatbotId())}&visitor_key=${encodeURIComponent(t)}&url=${encodeURIComponent(o)}`);if(!r.ok)return null;let a=await r.json();return a&&a.popup_text?String(a.popup_text):null}catch(t){return d.warn("Popup fetch failed:",t),null}}function xe({ctx:e}){let t=e.getChatbotId(),n=`chatOpenTracked_${t}`;if(localStorage.getItem(n))return;let o=dt({ctx:e});localStorage.setItem(n,"true"),fetch(`${H.getUrl({ctx:e})}/chatbot-opens`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:t,visitor_key:o})}).catch(()=>{localStorage.removeItem(n)})}var Sn={register:wn},In=fn();function wn({ctx:e}){let t=document.getElementById("chat-button"),n=document.getElementById("chat-iframe"),o=document.getElementById("chatbase-message-bubbles"),r=document.querySelector(".close-popup"),a=document.getElementById("minimize-button");if(!t||!n){d.error("Chatbot elements not found. Retrying in 100ms..."),setTimeout(()=>{wn({ctx:e})},100);return}t&&n&&t.addEventListener("click",()=>{window.getComputedStyle(n).display!=="none"||(ct.open(),xe({ctx:e})),lt({ctx:e})}),o&&n&&o.addEventListener("click",u=>{if(u.target.closest(".close-popup"))return;window.getComputedStyle(n).display!=="none"||(ct.open(),xe({ctx:e})),lt({ctx:e})}),r&&r.addEventListener("click",u=>{if(u.stopPropagation(),o&&(o.style.display="none"),window.innerWidth<1e3){let b=`popupState_${e.getChatbotId()}`;localStorage.setItem(b,"dismissed")}}),a&&a.addEventListener("click",u=>{u.stopPropagation(),d.log("Minimize button clicked");let g=document.getElementById("chat-container"),b=document.getElementById("chatbase-message-bubbles");n.style.display="none",t.style.display="block",a.style.display="none",g&&(g.classList.remove("chat-open"),g.classList.add("minimized")),b&&(b.style.display="none");let T=`chatMinimized_${e.getChatbotId()}`;localStorage.setItem(T,"true")});let l=document.getElementById("plus-overlay");l&&l.addEventListener("click",u=>{u.stopPropagation();let g=document.getElementById("chat-container");g&&g.classList.remove("minimized"),a&&(a.style.display="");let b=`chatMinimized_${e.getChatbotId()}`;localStorage.removeItem(b);let T=`popupState_${e.getChatbotId()}`;localStorage.getItem(T)!=="dismissed"&&setTimeout(()=>{te({ctx:e})},500)});let p=`chatMinimized_${e.getChatbotId()}`;if(localStorage.getItem(p)==="true"){let u=document.getElementById("chat-container");u&&u.classList.add("minimized")}window.addEventListener("message",u=>{var $;let g=M(e.getConfig().iframeUrl)||void 0,b=D.getTargetOrigin(g);if(u.origin!==b)return;let T=u.data;if(T.action==="purchaseReported"&&(h.setHasReportedPurchase(!0),localStorage.setItem(Ie(e.getChatbotId()),"true")),T.action==="expandChat")N({ctx:e});else if(T.action==="collapseChat")N({ctx:e});else if(T.action==="toggleSize")h.toggleIsIframeEnlarged(),N({ctx:e});else if(T.action==="closeChat"){d.log("Received closeChat message from iframe");let S=document.getElementById("chat-container");n.style.display="none",t.style.display="block",a&&(a.style.display="none"),S&&S.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}else if(T.action==="openInNewTab"&&T.url){let S=Ce(T.url);S?window.open(S,"_blank","noopener,noreferrer"):d.warn("Blocked unsafe openInNewTab URL",T.url)}else if(T.action==="navigate"&&T.url){let S=Ce(T.url);S?window.location.assign(S):d.warn("Blocked unsafe navigate URL",T.url)}else if(T.action==="productClick")ct.productClick();else if(T.action==="firstMessageSent")localStorage.setItem(`hasSentMessage_${e.getChatbotId()}`,"true"),wt({ctx:e});else if(T.action==="userMessageSubmitted")In.start();else if(T.action==="assistantFirstToken"){let S=In.stop();S!==null&&ct.response(S)}else T.action==="productRecommendation"&&ct.recommendation();T.action==="conversationClassified"&&ct.conversationClassified(($=T.emne)!=null?$:null)}),window.addEventListener("resize",()=>{N({ctx:e})}),N({ctx:e});function m(){window.dispatchEvent(new Event("resize"))}setTimeout(m,100),setTimeout(m,300),setTimeout(m,500),setTimeout(m,800),setTimeout(m,1200),n.onload=()=>{W({ctx:e});let u=M(e.getConfig().iframeUrl)||void 0;window.getComputedStyle(n).display!=="none"&&D.postToIframe({iframe:n,iframeUrl:u,data:{action:"chatOpened"},reason:"chatOpened"})},setTimeout(()=>{n&&n.style.display==="none"&&W({ctx:e})},2e3)}var{entries:On,setPrototypeOf:xn,isFrozen:No,getPrototypeOf:Fo,getOwnPropertyDescriptor:$o}=Object,{freeze:B,seal:G,create:oe}=Object,{apply:Me,construct:Oe}=typeof Reflect!="undefined"&&Reflect;B||(B=function(t){return t});G||(G=function(t){return t});Me||(Me=function(t,n){for(var o=arguments.length,r=new Array(o>2?o-2:0),a=2;a<o;a++)r[a-2]=arguments[a];return t.apply(n,r)});Oe||(Oe=function(t){for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return new t(...o)});var ee=z(Array.prototype.forEach),Ho=z(Array.prototype.lastIndexOf),_n=z(Array.prototype.pop),Bt=z(Array.prototype.push),Wo=z(Array.prototype.splice),ie=z(String.prototype.toLowerCase),_e=z(String.prototype.toString),ve=z(String.prototype.match),zt=z(String.prototype.replace),Go=z(String.prototype.indexOf),Vo=z(String.prototype.trim),F=z(Object.prototype.hasOwnProperty),O=z(RegExp.prototype.test),kt=jo(TypeError);function z(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return Me(e,t,o)}}function jo(e){return function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return Oe(e,n)}}function y(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ie;xn&&xn(e,null);let o=t.length;for(;o--;){let r=t[o];if(typeof r=="string"){let a=n(r);a!==r&&(No(t)||(t[o]=a),r=a)}e[r]=!0}return e}function Yo(e){for(let t=0;t<e.length;t++)F(e,t)||(e[t]=null);return e}function K(e){let t=oe(null);for(let[n,o]of On(e))F(e,n)&&(Array.isArray(o)?t[n]=Yo(o):o&&typeof o=="object"&&o.constructor===Object?t[n]=K(o):t[n]=o);return t}function Ut(e,t){for(;e!==null;){let o=$o(e,t);if(o){if(o.get)return z(o.get);if(typeof o.value=="function")return z(o.value)}e=Fo(e)}function n(){return null}return n}var vn=B(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ae=B(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Le=B(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Ko=B(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Pe=B(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),qo=B(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),An=B(["#text"]),Ln=B(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Re=B(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Pn=B(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),ne=B(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Xo=G(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Zo=G(/<%[\w\W]*|[\w\W]*%>/gm),Jo=G(/\$\{[\w\W]*/gm),Qo=G(/^data-[\-\w.\u00B7-\uFFFF]+$/),ti=G(/^aria-[\-\w]+$/),Bn=G(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ei=G(/^(?:\w+script|data):/i),ni=G(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),zn=G(/^html$/i),oi=G(/^[a-z][.\w]*(-[.\w]+)+$/i),Rn=Object.freeze({__proto__:null,ARIA_ATTR:ti,ATTR_WHITESPACE:ni,CUSTOM_ELEMENT:oi,DATA_ATTR:Qo,DOCTYPE_NAME:zn,ERB_EXPR:Zo,IS_ALLOWED_URI:Bn,IS_SCRIPT_OR_DATA:ei,MUSTACHE_EXPR:Xo,TMPLIT_EXPR:Jo}),Dt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},ii=function(){return typeof window=="undefined"?null:window},ri=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let o=null,r="data-tt-policy-suffix";n&&n.hasAttribute(r)&&(o=n.getAttribute(r));let a="dompurify"+(o?"#"+o:"");try{return t.createPolicy(a,{createHTML(l){return l},createScriptURL(l){return l}})}catch(l){return console.warn("TrustedTypes policy "+a+" could not be created."),null}},Mn=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function kn(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:ii(),t=f=>kn(f);if(t.version="3.3.2",t.removed=[],!e||!e.document||e.document.nodeType!==Dt.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e,o=n,r=o.currentScript,{DocumentFragment:a,HTMLTemplateElement:l,Node:p,Element:m,NodeFilter:u,NamedNodeMap:g=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:b,DOMParser:T,trustedTypes:$}=e,S=m.prototype,q=Ut(S,"cloneNode"),w=Ut(S,"remove"),ut=Ut(S,"nextSibling"),xt=Ut(S,"childNodes"),X=Ut(S,"parentNode");if(typeof l=="function"){let f=n.createElement("template");f.content&&f.content.ownerDocument&&(n=f.content.ownerDocument)}let I,et="",{implementation:pt,createNodeIterator:Ne,createDocumentFragment:_t,getElementsByTagName:Ft}=n,{importNode:nt}=o,A=Mn();t.isSupported=typeof On=="function"&&typeof X=="function"&&pt&&pt.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:mt,ERB_EXPR:vt,TMPLIT_EXPR:At,DATA_ATTR:le,ARIA_ATTR:ce,IS_SCRIPT_OR_DATA:ft,ATTR_WHITESPACE:Z,CUSTOM_ELEMENT:$t}=Rn,{IS_ALLOWED_URI:Lt}=Rn,x=null,U=y({},[...vn,...Ae,...Le,...Pe,...An]),_=null,ot=y({},[...Ln,...Re,...Pn,...ne]),C=Object.seal(oe(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),gt=null,ht=null,V=Object.seal(oe(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),it=!0,Ht=!0,bt=!1,Fe=!0,yt=!1,Wt=!0,rt=!1,de=!1,ue=!1,Tt=!1,Gt=!1,Vt=!1,$e=!0,He=!1,ro="user-content-",pe=!0,Pt=!1,Ct={},j=null,me=y({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),We=null,Ge=y({},["audio","video","img","source","image","track"]),fe=null,Ve=y({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),jt="http://www.w3.org/1998/Math/MathML",Yt="http://www.w3.org/2000/svg",J="http://www.w3.org/1999/xhtml",Et=J,ge=!1,he=null,ao=y({},[jt,Yt,J],_e),Kt=y({},["mi","mo","mn","ms","mtext"]),qt=y({},["annotation-xml"]),so=y({},["title","style","font","a","script"]),Rt=null,lo=["application/xhtml+xml","text/html"],co="text/html",L=null,It=null,uo=n.createElement("form"),je=function(i){return i instanceof RegExp||i instanceof Function},be=function(){let i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(It&&It===i)){if((!i||typeof i!="object")&&(i={}),i=K(i),Rt=lo.indexOf(i.PARSER_MEDIA_TYPE)===-1?co:i.PARSER_MEDIA_TYPE,L=Rt==="application/xhtml+xml"?_e:ie,x=F(i,"ALLOWED_TAGS")?y({},i.ALLOWED_TAGS,L):U,_=F(i,"ALLOWED_ATTR")?y({},i.ALLOWED_ATTR,L):ot,he=F(i,"ALLOWED_NAMESPACES")?y({},i.ALLOWED_NAMESPACES,_e):ao,fe=F(i,"ADD_URI_SAFE_ATTR")?y(K(Ve),i.ADD_URI_SAFE_ATTR,L):Ve,We=F(i,"ADD_DATA_URI_TAGS")?y(K(Ge),i.ADD_DATA_URI_TAGS,L):Ge,j=F(i,"FORBID_CONTENTS")?y({},i.FORBID_CONTENTS,L):me,gt=F(i,"FORBID_TAGS")?y({},i.FORBID_TAGS,L):K({}),ht=F(i,"FORBID_ATTR")?y({},i.FORBID_ATTR,L):K({}),Ct=F(i,"USE_PROFILES")?i.USE_PROFILES:!1,it=i.ALLOW_ARIA_ATTR!==!1,Ht=i.ALLOW_DATA_ATTR!==!1,bt=i.ALLOW_UNKNOWN_PROTOCOLS||!1,Fe=i.ALLOW_SELF_CLOSE_IN_ATTR!==!1,yt=i.SAFE_FOR_TEMPLATES||!1,Wt=i.SAFE_FOR_XML!==!1,rt=i.WHOLE_DOCUMENT||!1,Tt=i.RETURN_DOM||!1,Gt=i.RETURN_DOM_FRAGMENT||!1,Vt=i.RETURN_TRUSTED_TYPE||!1,ue=i.FORCE_BODY||!1,$e=i.SANITIZE_DOM!==!1,He=i.SANITIZE_NAMED_PROPS||!1,pe=i.KEEP_CONTENT!==!1,Pt=i.IN_PLACE||!1,Lt=i.ALLOWED_URI_REGEXP||Bn,Et=i.NAMESPACE||J,Kt=i.MATHML_TEXT_INTEGRATION_POINTS||Kt,qt=i.HTML_INTEGRATION_POINTS||qt,C=i.CUSTOM_ELEMENT_HANDLING||{},i.CUSTOM_ELEMENT_HANDLING&&je(i.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(C.tagNameCheck=i.CUSTOM_ELEMENT_HANDLING.tagNameCheck),i.CUSTOM_ELEMENT_HANDLING&&je(i.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(C.attributeNameCheck=i.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),i.CUSTOM_ELEMENT_HANDLING&&typeof i.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(C.allowCustomizedBuiltInElements=i.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),yt&&(Ht=!1),Gt&&(Tt=!0),Ct&&(x=y({},An),_=oe(null),Ct.html===!0&&(y(x,vn),y(_,Ln)),Ct.svg===!0&&(y(x,Ae),y(_,Re),y(_,ne)),Ct.svgFilters===!0&&(y(x,Le),y(_,Re),y(_,ne)),Ct.mathMl===!0&&(y(x,Pe),y(_,Pn),y(_,ne))),F(i,"ADD_TAGS")||(V.tagCheck=null),F(i,"ADD_ATTR")||(V.attributeCheck=null),i.ADD_TAGS&&(typeof i.ADD_TAGS=="function"?V.tagCheck=i.ADD_TAGS:(x===U&&(x=K(x)),y(x,i.ADD_TAGS,L))),i.ADD_ATTR&&(typeof i.ADD_ATTR=="function"?V.attributeCheck=i.ADD_ATTR:(_===ot&&(_=K(_)),y(_,i.ADD_ATTR,L))),i.ADD_URI_SAFE_ATTR&&y(fe,i.ADD_URI_SAFE_ATTR,L),i.FORBID_CONTENTS&&(j===me&&(j=K(j)),y(j,i.FORBID_CONTENTS,L)),i.ADD_FORBID_CONTENTS&&(j===me&&(j=K(j)),y(j,i.ADD_FORBID_CONTENTS,L)),pe&&(x["#text"]=!0),rt&&y(x,["html","head","body"]),x.table&&(y(x,["tbody"]),delete gt.tbody),i.TRUSTED_TYPES_POLICY){if(typeof i.TRUSTED_TYPES_POLICY.createHTML!="function")throw kt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof i.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw kt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');I=i.TRUSTED_TYPES_POLICY,et=I.createHTML("")}else I===void 0&&(I=ri($,r)),I!==null&&typeof et=="string"&&(et=I.createHTML(""));B&&B(i),It=i}},Ye=y({},[...Ae,...Le,...Ko]),Ke=y({},[...Pe,...qo]),po=function(i){let s=X(i);(!s||!s.tagName)&&(s={namespaceURI:Et,tagName:"template"});let c=ie(i.tagName),E=ie(s.tagName);return he[i.namespaceURI]?i.namespaceURI===Yt?s.namespaceURI===J?c==="svg":s.namespaceURI===jt?c==="svg"&&(E==="annotation-xml"||Kt[E]):!!Ye[c]:i.namespaceURI===jt?s.namespaceURI===J?c==="math":s.namespaceURI===Yt?c==="math"&&qt[E]:!!Ke[c]:i.namespaceURI===J?s.namespaceURI===Yt&&!qt[E]||s.namespaceURI===jt&&!Kt[E]?!1:!Ke[c]&&(so[c]||!Ye[c]):!!(Rt==="application/xhtml+xml"&&he[i.namespaceURI]):!1},Y=function(i){Bt(t.removed,{element:i});try{X(i).removeChild(i)}catch(s){w(i)}},at=function(i,s){try{Bt(t.removed,{attribute:s.getAttributeNode(i),from:s})}catch(c){Bt(t.removed,{attribute:null,from:s})}if(s.removeAttribute(i),i==="is")if(Tt||Gt)try{Y(s)}catch(c){}else try{s.setAttribute(i,"")}catch(c){}},qe=function(i){let s=null,c=null;if(ue)i="<remove></remove>"+i;else{let v=ve(i,/^[\r\n\t ]+/);c=v&&v[0]}Rt==="application/xhtml+xml"&&Et===J&&(i='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+i+"</body></html>");let E=I?I.createHTML(i):i;if(Et===J)try{s=new T().parseFromString(E,Rt)}catch(v){}if(!s||!s.documentElement){s=pt.createDocument(Et,"template",null);try{s.documentElement.innerHTML=ge?et:E}catch(v){}}let R=s.body||s.documentElement;return i&&c&&R.insertBefore(n.createTextNode(c),R.childNodes[0]||null),Et===J?Ft.call(s,rt?"html":"body")[0]:rt?s.documentElement:R},Xe=function(i){return Ne.call(i.ownerDocument||i,i,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},ye=function(i){return i instanceof b&&(typeof i.nodeName!="string"||typeof i.textContent!="string"||typeof i.removeChild!="function"||!(i.attributes instanceof g)||typeof i.removeAttribute!="function"||typeof i.setAttribute!="function"||typeof i.namespaceURI!="string"||typeof i.insertBefore!="function"||typeof i.hasChildNodes!="function")},Ze=function(i){return typeof p=="function"&&i instanceof p};function Q(f,i,s){ee(f,c=>{c.call(t,i,s,It)})}let Je=function(i){let s=null;if(Q(A.beforeSanitizeElements,i,null),ye(i))return Y(i),!0;let c=L(i.nodeName);if(Q(A.uponSanitizeElement,i,{tagName:c,allowedTags:x}),Wt&&i.hasChildNodes()&&!Ze(i.firstElementChild)&&O(/<[/\w!]/g,i.innerHTML)&&O(/<[/\w!]/g,i.textContent)||i.nodeType===Dt.progressingInstruction||Wt&&i.nodeType===Dt.comment&&O(/<[/\w]/g,i.data))return Y(i),!0;if(!(V.tagCheck instanceof Function&&V.tagCheck(c))&&(!x[c]||gt[c])){if(!gt[c]&&tn(c)&&(C.tagNameCheck instanceof RegExp&&O(C.tagNameCheck,c)||C.tagNameCheck instanceof Function&&C.tagNameCheck(c)))return!1;if(pe&&!j[c]){let E=X(i)||i.parentNode,R=xt(i)||i.childNodes;if(R&&E){let v=R.length;for(let k=v-1;k>=0;--k){let tt=q(R[k],!0);tt.__removalCount=(i.__removalCount||0)+1,E.insertBefore(tt,ut(i))}}}return Y(i),!0}return i instanceof m&&!po(i)||(c==="noscript"||c==="noembed"||c==="noframes")&&O(/<\/no(script|embed|frames)/i,i.innerHTML)?(Y(i),!0):(yt&&i.nodeType===Dt.text&&(s=i.textContent,ee([mt,vt,At],E=>{s=zt(s,E," ")}),i.textContent!==s&&(Bt(t.removed,{element:i.cloneNode()}),i.textContent=s)),Q(A.afterSanitizeElements,i,null),!1)},Qe=function(i,s,c){if(ht[s]||$e&&(s==="id"||s==="name")&&(c in n||c in uo))return!1;if(!(Ht&&!ht[s]&&O(le,s))){if(!(it&&O(ce,s))){if(!(V.attributeCheck instanceof Function&&V.attributeCheck(s,i))){if(!_[s]||ht[s]){if(!(tn(i)&&(C.tagNameCheck instanceof RegExp&&O(C.tagNameCheck,i)||C.tagNameCheck instanceof Function&&C.tagNameCheck(i))&&(C.attributeNameCheck instanceof RegExp&&O(C.attributeNameCheck,s)||C.attributeNameCheck instanceof Function&&C.attributeNameCheck(s,i))||s==="is"&&C.allowCustomizedBuiltInElements&&(C.tagNameCheck instanceof RegExp&&O(C.tagNameCheck,c)||C.tagNameCheck instanceof Function&&C.tagNameCheck(c))))return!1}else if(!fe[s]){if(!O(Lt,zt(c,Z,""))){if(!((s==="src"||s==="xlink:href"||s==="href")&&i!=="script"&&Go(c,"data:")===0&&We[i])){if(!(bt&&!O(ft,zt(c,Z,"")))){if(c)return!1}}}}}}}return!0},tn=function(i){return i!=="annotation-xml"&&ve(i,$t)},en=function(i){Q(A.beforeSanitizeAttributes,i,null);let{attributes:s}=i;if(!s||ye(i))return;let c={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:_,forceKeepAttr:void 0},E=s.length;for(;E--;){let R=s[E],{name:v,namespaceURI:k,value:tt}=R,St=L(v),Te=tt,P=v==="value"?Te:Vo(Te);if(c.attrName=St,c.attrValue=P,c.keepAttr=!0,c.forceKeepAttr=void 0,Q(A.uponSanitizeAttribute,i,c),P=c.attrValue,He&&(St==="id"||St==="name")&&(at(v,i),P=ro+P),Wt&&O(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,P)){at(v,i);continue}if(St==="attributename"&&ve(P,"href")){at(v,i);continue}if(c.forceKeepAttr)continue;if(!c.keepAttr){at(v,i);continue}if(!Fe&&O(/\/>/i,P)){at(v,i);continue}yt&&ee([mt,vt,At],on=>{P=zt(P,on," ")});let nn=L(i.nodeName);if(!Qe(nn,St,P)){at(v,i);continue}if(I&&typeof $=="object"&&typeof $.getAttributeType=="function"&&!k)switch($.getAttributeType(nn,St)){case"TrustedHTML":{P=I.createHTML(P);break}case"TrustedScriptURL":{P=I.createScriptURL(P);break}}if(P!==Te)try{k?i.setAttributeNS(k,v,P):i.setAttribute(v,P),ye(i)?Y(i):_n(t.removed)}catch(on){at(v,i)}}Q(A.afterSanitizeAttributes,i,null)},mo=function f(i){let s=null,c=Xe(i);for(Q(A.beforeSanitizeShadowDOM,i,null);s=c.nextNode();)Q(A.uponSanitizeShadowNode,s,null),Je(s),en(s),s.content instanceof a&&f(s.content);Q(A.afterSanitizeShadowDOM,i,null)};return t.sanitize=function(f){let i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=null,c=null,E=null,R=null;if(ge=!f,ge&&(f="<!-->"),typeof f!="string"&&!Ze(f))if(typeof f.toString=="function"){if(f=f.toString(),typeof f!="string")throw kt("dirty is not a string, aborting")}else throw kt("toString is not a function");if(!t.isSupported)return f;if(de||be(i),t.removed=[],typeof f=="string"&&(Pt=!1),Pt){if(f.nodeName){let tt=L(f.nodeName);if(!x[tt]||gt[tt])throw kt("root node is forbidden and cannot be sanitized in-place")}}else if(f instanceof p)s=qe("<!---->"),c=s.ownerDocument.importNode(f,!0),c.nodeType===Dt.element&&c.nodeName==="BODY"||c.nodeName==="HTML"?s=c:s.appendChild(c);else{if(!Tt&&!yt&&!rt&&f.indexOf("<")===-1)return I&&Vt?I.createHTML(f):f;if(s=qe(f),!s)return Tt?null:Vt?et:""}s&&ue&&Y(s.firstChild);let v=Xe(Pt?f:s);for(;E=v.nextNode();)Je(E),en(E),E.content instanceof a&&mo(E.content);if(Pt)return f;if(Tt){if(Gt)for(R=_t.call(s.ownerDocument);s.firstChild;)R.appendChild(s.firstChild);else R=s;return(_.shadowroot||_.shadowrootmode)&&(R=nt.call(o,R,!0)),R}let k=rt?s.outerHTML:s.innerHTML;return rt&&x["!doctype"]&&s.ownerDocument&&s.ownerDocument.doctype&&s.ownerDocument.doctype.name&&O(zn,s.ownerDocument.doctype.name)&&(k="<!DOCTYPE "+s.ownerDocument.doctype.name+`>
`+k),yt&&ee([mt,vt,At],tt=>{k=zt(k,tt," ")}),I&&Vt?I.createHTML(k):k},t.setConfig=function(){let f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};be(f),de=!0},t.clearConfig=function(){It=null,de=!1},t.isValidAttribute=function(f,i,s){It||be({});let c=L(f),E=L(i);return Qe(c,E,s)},t.addHook=function(f,i){typeof i=="function"&&Bt(A[f],i)},t.removeHook=function(f,i){if(i!==void 0){let s=Ho(A[f],i);return s===-1?void 0:Wo(A[f],s,1)[0]}return _n(A[f])},t.removeHooks=function(f){A[f]=[]},t.removeAllHooks=function(){A=Mn()},t}var Un=kn();var ai=["svg","defs","clipPath","clippath","path","g","rect","ellipse"],si=["xmlns","viewBox","viewbox","id","d","clip-rule","clip-path","x","y","width","height","fill","cx","cy","rx","ry"],li="di-chatbot-script",re=null,Dn=!1;function Nn(){return{createPolicy:(e,t)=>t}}function ci(e){return typeof e.trustedTypes=="undefined"&&(e.trustedTypes=Nn()),e.trustedTypes}function di(){if(typeof window=="undefined")return null;let e=window;return e.__DI_FORCE_TRUSTED_TYPES_TINYFILL__===!0?Nn():typeof e.trustedTypes=="undefined"?ci(e):e.trustedTypes}function Fn(){if(Dn)return re;Dn=!0;let e=di();if(!e)return null;try{re=e.createPolicy(li,{createHTML:t=>t,createScriptURL:t=>t})}catch(t){re=null}return re}function ui(e){if(!e||typeof e!="string")return"";let t=Fn(),n={ALLOWED_TAGS:[...ai],ALLOWED_ATTR:[...si],USE_PROFILES:{svg:!0,svgFilters:!1,html:!1},KEEP_CONTENT:!1,RETURN_TRUSTED_TYPE:!1};t&&typeof t.createScriptURL=="function"&&(n.TRUSTED_TYPES_POLICY=t);let o=Un.sanitize(e,n);if(typeof o!="string")return"";let r=o.trim();return!/^<svg[\s>]/i.test(r)||!/<\/svg>\s*$/i.test(r)?"":r}function $n(e){let t=ui(e);if(!t)return null;let n=Fn();if(!n)return null;let o=n.createHTML(t);if(!o)return null;let r=new DOMParser().parseFromString(o,"image/svg+xml");if(r.querySelector("parsererror"))return null;let a=r.documentElement;if(!a||a.tagName.toLowerCase()!=="svg")return null;try{let l=document.importNode(a,!0);return l instanceof SVGElement?l:null}catch(l){return null}}var pi=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 750">
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
            </svg>`;function mi(){let e=$n(pi);if(!e){let t=document.createElement("span");return t.textContent="Chat",t}return e}function Be(e){if(e&&e.trim().length>0){let t=Ee.createPlayerElement(e);if(t)return t;let n=st(e);if(n){let o=document.createElement("img");return o.src=n,o.alt="Chat",o}}return mi()}function ze({chatButtonImageUrl:e,mobileChatButtonImageUrl:t}){let n=document.createDocumentFragment();if(typeof t=="string"&&t.trim().length>0){let r=document.createElement("span");r.className="desktop-button-content",r.appendChild(Be(e));let a=document.createElement("span");return a.className="mobile-button-content",a.appendChild(Be(t)),n.appendChild(r),n.appendChild(a),n}return n.appendChild(Be(e)),n}function Hn({chatButton:e,chatButtonImageUrl:t,mobileChatButtonImageUrl:n}){let o=e.querySelector("#notification-badge");e.querySelectorAll("dotlottie-player, .di-lottie-player").forEach(a=>{Ee.destroyPlayerElement(a)}),e.replaceChildren(),e.appendChild(ze({chatButtonImageUrl:t,mobileChatButtonImageUrl:n})),o&&e.appendChild(o)}var Wn={build:Ii};function fi(e){try{let t=new URL(e,window.location.href);return t.searchParams.set("parentOrigin",window.location.origin),t.toString()}catch(t){return e}}function gi({isFullscreen:e}){let t=document.createElement("div");return t.id="chat-container",e&&t.classList.add("chat-open"),t}function hi({isFullscreen:e,chatButtonImageUrl:t,mobileChatButtonImageUrl:n}){let o=document.createElement("button");if(o.id="chat-button",e)return o.style.display="none",o;o.appendChild(ze({chatButtonImageUrl:t,mobileChatButtonImageUrl:n}));let r=document.createElement("span");return r.id="notification-badge",r.className="notification-badge",r.textContent="1",o.appendChild(r),o}function bi(){let e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"svg");t.setAttribute("xmlns",e),t.setAttribute("width","18"),t.setAttribute("height","18"),t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2.5"),t.setAttribute("stroke-linecap","round"),t.setAttribute("stroke-linejoin","round");let n=document.createElementNS(e,"line");n.setAttribute("x1","18"),n.setAttribute("y1","6"),n.setAttribute("x2","6"),n.setAttribute("y2","18");let o=document.createElementNS(e,"line");return o.setAttribute("x1","6"),o.setAttribute("y1","6"),o.setAttribute("x2","18"),o.setAttribute("y2","18"),t.appendChild(n),t.appendChild(o),t}function yi({isFullscreen:e}){let t=document.createElement("button");return t.id="minimize-button",t.textContent="\u2212",e&&(t.style.display="none"),t}function Ti({isFullscreen:e}){let t=document.createElement("div");return t.id="plus-overlay",t.textContent="+",e&&(t.style.display="none"),t}function Ci({isFullscreen:e}){let t=document.createElement("div");if(t.id="chatbase-message-bubbles",e)return t.style.display="none",t;let n=document.createElement("div");n.className="close-popup",n.appendChild(bi());let o=document.createElement("div");o.className="message-content";let r=document.createElement("div");return r.className="message-box",r.id="popup-message-box",o.appendChild(r),t.appendChild(o),t.appendChild(n),t}function Ei({iframeUrl:e,isFullscreen:t,iframeZIndex:n}){let o=document.createElement("iframe");return o.id="chat-iframe",o.src=fi(e),o.allow=`microphone ${new URL(e,window.location.href).origin}`,o.style.border="none",o.style.zIndex=String(n||3e3),t?(o.style.display="block",o.style.position="fixed",o.style.top="0",o.style.left="0",o.style.right="0",o.style.bottom="0",o.style.width="100vw",o.style.height="100vh"):(o.style.display="none",o.style.position="fixed",o.style.bottom="3vh",o.style.right="2vw",o.style.width="50vh",o.style.height="90vh"),o}function Ii({ctx:e}){let t=e.getConfig(),o=M(t.iframeUrl||"https://chatbot.dialogintelligens.dk");if(!o)return d.warn("Blocked chatbot render due to invalid iframe URL",t.iframeUrl),null;d.log("buildChatbotDOM - iframeUrl:",o,"chatbotID:",e.getChatbotId());let r=t.fullscreenMode===!0,a=document.createDocumentFragment(),l=gi({isFullscreen:r});l.appendChild(hi({isFullscreen:r,chatButtonImageUrl:t.chatButtonImageUrl,mobileChatButtonImageUrl:t.mobileChatButtonImageUrl})),l.appendChild(yi({isFullscreen:r})),l.appendChild(Ti({isFullscreen:r})),l.appendChild(Ci({isFullscreen:r}));let p=Ei({iframeUrl:o,isFullscreen:r,iframeZIndex:t.iframeZIndex});return a.appendChild(l),a.appendChild(p),a}var Gn={inject:Si};function Si({ctx:e}){let t=e.getConfig(),n=t.productButtonColor||t.themeColor||"#1a1d56",o=`
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
#chat-container #chat-button .di-lottie-player,
#chat-container #chat-button dotlottie-player {
  width: ${t.buttonSize||"74"}px !important;
  height: ${t.buttonSize||"74"}px !important;
  display: block !important;
  transition: opacity 0.3s, transform 0.3s !important;
}
#chat-container #chat-button:hover .di-lottie-player,
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

/* Plus overlay when minimized \u2014 position: fixed, centered on minimized button */
#plus-overlay {
  position: fixed !important;
  right: calc(${(t.buttonRight||"10px").replace(/\s*!important/g,"")} + ${t.buttonSize||"74"}px * 0.121 + 0.75px) !important;
  bottom: calc(${(t.buttonBottom||"20px").replace(/\s*!important/g,"")} + ${t.buttonSize||"74"}px * 0.121 - 12.25px) !important;
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
  gap: 0;
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

/* Close button - hidden on desktop until popup is hovered */
#chatbase-message-bubbles .close-popup {
  position: absolute;
  bottom: 6px;
  left: 6px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  color: #555;
  transition: color 0.2s, background 0.2s, opacity 0.2s;
  z-index: calc(${t.zIndex||190} + 999810);
  pointer-events: auto;
  line-height: 0;
  padding: 4px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
}
#chatbase-message-bubbles:hover .close-popup {
  opacity: 1;
  pointer-events: auto;
}
#chatbase-message-bubbles .close-popup svg {
  display: block;
}
#chatbase-message-bubbles .close-popup:hover {
  color: #000;
  background: rgba(230, 230, 230, 0.95);
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
  #chat-container #chat-button .di-lottie-player,
  #chat-container #chat-button dotlottie-player {
    width: ${t.mobileButtonSize||"50"}px !important;
    height: ${t.mobileButtonSize||"50"}px !important;
  }

  #chatbase-message-bubbles {
    min-width: unset;
    max-width: 420px;
    scale: 0.52;
    transform-origin: right center;
  }

  #chatbase-message-bubbles.tail-left {
    transform-origin: left center;
  }

  #chatbase-message-bubbles .message-box {
    font-size: 16px;
    padding: 8px;
    text-wrap: balance;
  }

  #chatbase-message-bubbles .close-popup {
    opacity: 1;
    pointer-events: auto;
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
    right: calc(${(t.mobileButtonRight||t.buttonRight||"10px").replace(/\s*!important/g,"")} + ${t.mobileButtonSize||"50"}px * 0.121 + 0.75px) !important;
    bottom: calc(${(t.mobileButtonBottom||t.buttonBottom||"20px").replace(/\s*!important/g,"")} + ${t.mobileButtonSize||"50"}px * 0.121 - 12.25px) !important;
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
  --icon-color: ${n};
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

`,r=document.createElement("style");r.id="di-chatbot-styles",r.appendChild(document.createTextNode(o)),document.head.appendChild(r),document.documentElement.style.setProperty("--icon-color",n)}var Vn=/[\u0000-\u001F\u007F]/,jn=/[;{}]/,wi=/\s*!important/gi,xi=/^-?\d+(\.\d+)?(px|em|rem|vw|vh|%)$/i,_i="10px",vi="20px",Ai="10px",Li="20px",Pi="74",Ri="50",Mi=190,Oi=3e3,Yn="#1a1d56";function ke(e){if(typeof e!="string")return null;let t=e.trim();if(!t||Vn.test(t)||jn.test(t))return null;let n=t.replace(wi,"").trim();return!n||Vn.test(n)||jn.test(n)?null:n}function ae(e,t){let n=ke(e);return!n||!xi.test(n)?t:n.toLowerCase()}function Kn(e,t,{min:n,max:o}){let r=ke(e);if(!r)return t;let a=Number.parseFloat(r);if(!Number.isFinite(a))return t;let l=Math.min(o,Math.max(n,a));return String(Math.round(l))}function qn(e,t){if(e==null)return t;let n=typeof e=="number"?e:typeof e=="string"?Number.parseInt(e,10):Number.NaN;if(!Number.isFinite(n))return t;let o=Math.trunc(n);return o<1?t:Math.min(o,2147483647)}function Xn(e,t){let n=ke(e);if(!n)return t;let o=document.createElement("span");return o.style.color="",o.style.color=n,o.style.color?n:t}function Zn(e){let t={};return"buttonRight"in e&&(t.buttonRight=ae(e.buttonRight,_i)),"buttonBottom"in e&&(t.buttonBottom=ae(e.buttonBottom,vi)),"mobileButtonRight"in e&&(t.mobileButtonRight=ae(e.mobileButtonRight,Ai)),"mobileButtonBottom"in e&&(t.mobileButtonBottom=ae(e.mobileButtonBottom,Li)),"buttonSize"in e&&(t.buttonSize=Kn(e.buttonSize,Pi,{min:24,max:200})),"mobileButtonSize"in e&&(t.mobileButtonSize=Kn(e.mobileButtonSize,Ri,{min:24,max:160})),"zIndex"in e&&(t.zIndex=qn(e.zIndex,Mi)),"iframeZIndex"in e&&(t.iframeZIndex=qn(e.iframeZIndex,Oi)),"themeColor"in e&&(t.themeColor=Xn(e.themeColor,Yn)),"productButtonColor"in e&&(t.productButtonColor=Xn(e.productButtonColor,Yn)),t}var Jn={get:zi},Bi="https://chatbot.dialogintelligens.dk";function Nt({config:e,fallbackIframeUrl:t}){let n={...e};if("chatButtonImageUrl"in e){let r=e.chatButtonImageUrl;typeof r=="string"&&r.trim().length>0?n.chatButtonImageUrl=st(r)||void 0:n.chatButtonImageUrl=void 0}if("mobileChatButtonImageUrl"in e){let r=e.mobileChatButtonImageUrl;typeof r=="string"&&r.trim().length>0?n.mobileChatButtonImageUrl=st(r)||void 0:n.mobileChatButtonImageUrl=void 0}if("iframeUrl"in e||t){let r=typeof e.iframeUrl=="string"?e.iframeUrl:t,a=M(r);a?(n.iframeUrl=a,n._invalidIframeUrl=!1):(n.iframeUrl=void 0,n._invalidIframeUrl=!0)}return Object.assign(n,Zn(e)),n}async function zi({ctx:e}){var a,l;let n=("https://chatbot-development-hla7.onrender.com".trim().length>0?"https://chatbot-development-hla7.onrender.com":void 0)||(e.isPreviewMode&&((a=window.CHATBOT_PREVIEW_CONFIG)!=null&&a.iframeUrl)?window.CHATBOT_PREVIEW_CONFIG.iframeUrl:Bi);if(d.log("Config.get - defaultIframeUrl:",n),e.isPreviewMode){let p=e.getConfig(),m=(l=window.CHATBOT_PREVIEW_CONFIG)!=null?l:{},u={...p,...m,iframeUrl:m.iframeUrl||p.iframeUrl||n};if(!m.leadFields)try{let g=await fetch(`${H.getUrl({ctx:e})}/api/integration-config/${e.getChatbotId()}`);if(g.ok){let b=await g.json();u={...p,...b,...m,iframeUrl:m.iframeUrl||p.iframeUrl||b.iframeUrl||n}}}catch(g){d.warn("Failed to fetch leadFields for preview mode:",g)}return u=Nt({config:u,fallbackIframeUrl:n}),h.setConfig(u),h.setChatbotId(e.getChatbotId()),{isPreviewMode:e.isPreviewMode,getChatbotId:e.getChatbotId,hasSentMessageToChatbot:e.hasSentMessageToChatbot,getConfig:()=>{var g;return(g=h.getConfig())!=null?g:u}}}let o=await ki({ctx:e}),r={...o,iframeUrl:o.iframeUrl||n};return r=Nt({config:r,fallbackIframeUrl:n}),h.setConfig(r),h.setChatbotId(e.getChatbotId()),{isPreviewMode:e.isPreviewMode,getChatbotId:e.getChatbotId,hasSentMessageToChatbot:e.hasSentMessageToChatbot,getConfig:()=>{var p;return(p=h.getConfig())!=null?p:r}}}async function ki({ctx:e}){try{d.log(`Loading configuration for chatbot: ${e.getChatbotId()}`);let t=await fetch(`${H.getUrl({ctx:e})}/api/integration-config/${e.getChatbotId()}`);if(t.status===403)return d.warn("Domain not authorized for this chatbot. Widget will not load."),{...e.getConfig(),_domainBlocked:!0};if(!t.ok)throw new Error(`Failed to load configuration: ${t.status} ${t.statusText}`);let n=await t.json();return{...e.getConfig(),...n}}catch(t){return d.error("Error loading chatbot config:",t),{...e.getConfig(),themeColor:"#1a1d56",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Vores virtuelle assistent er h\xE4r for at hj\xE6lpe dig.",titleG:"Chat Assistent",enableMinimizeButton:!0,enablePopupMessage:!0}}}function Ue(){let e=document.getElementById("chat-button");e&&e.addEventListener("click",()=>{let t=document.getElementById("notification-badge");t&&t.remove(),d.log("Chatbot opened \u2014 notification badge removed.")})}function to({ctx:e}){var t;if(window.CHATBOT_PREVIEW_CONFIG){let n=Nt({config:window.CHATBOT_PREVIEW_CONFIG,fallbackIframeUrl:(t=h.getConfig())==null?void 0:t.iframeUrl});h.updateConfig(n);let o=h.getConfig(),r=(o==null?void 0:o._invalidIframeUrl)===!0;Qn(r),r||N({ctx:e})}window.addEventListener("previewConfigUpdate",n=>{var b;let o=n,r=h.getChatbotId(),a=o.detail.chatbotID,l=a&&a!==r;a&&h.setChatbotId(a);let p=Nt({config:o.detail,fallbackIframeUrl:(b=h.getConfig())==null?void 0:b.iframeUrl});h.updateConfig(p);let m=h.getConfig(),u=(m==null?void 0:m._invalidIframeUrl)===!0;if(Qn(u),u)return;(o.detail.chatButtonImageUrl!==void 0||o.detail.mobileChatButtonImageUrl!==void 0)&&Fi({chatButtonImageUrl:m==null?void 0:m.chatButtonImageUrl,mobileChatButtonImageUrl:m==null?void 0:m.mobileChatButtonImageUrl}),(o.detail.mobileButtonBottom!==void 0||o.detail.mobileButtonRight!==void 0||o.detail.buttonBottom!==void 0||o.detail.buttonRight!==void 0||o.detail.previewMode!==void 0)&&Di(),(o.detail.buttonSize!==void 0||o.detail.mobileButtonSize!==void 0||o.detail.previewMode!==void 0)&&Ni(),N({ctx:e}),$i({config:o.detail}),wt({ctx:e}),l?(d.log("Preview: Switching chatbot from",r,"to",a),W({ctx:e}),setTimeout(()=>{Ui({ctx:e})},100)):W({ctx:e})})}function Qn(e){let t=document.getElementById("chat-container"),n=document.getElementById("chat-iframe");!t||!n||(e?(t.style.display="none",n.style.display="none",d.warn("Preview update blocked due to invalid iframe URL")):t.style.display="")}function Ui({ctx:e}){let t=document.getElementById("chat-iframe");if(t)try{let n=e.getConfig(),o=M(n.iframeUrl)||void 0;d.log("Sending resetConversation to iframe with firstMessage:",n.firstMessage),D.postToIframe({iframe:t,iframeUrl:o,data:{action:"resetConversation",firstMessage:n.firstMessage},reason:"resetConversation"})}catch(n){d.warn("Failed to send reset to iframe:",n)}}function Di(){let e=document.getElementById("chat-button");if(!e)return;let t=h.getConfig(),o=window.CHATBOT_PREVIEW_MODE===!0?(t==null?void 0:t.previewMode)==="mobile":window.innerWidth<=1e3,r=(o?(t==null?void 0:t.mobileButtonRight)||(t==null?void 0:t.buttonRight)||"10px":(t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),a=(o?(t==null?void 0:t.mobileButtonBottom)||(t==null?void 0:t.buttonBottom)||"27px":(t==null?void 0:t.buttonBottom)||"27px").replace(/\s*!important/g,""),l=o?"-8px":"5px",p=o?"-10px":"15px";e.style.setProperty("right",`calc(${r} + ${l})`,"important"),e.style.setProperty("bottom",`calc(${a} + ${p})`,"important");let m=document.getElementById("chat-container");if(m&&o){let u=((t==null?void 0:t.mobileButtonRight)||(t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),g=((t==null?void 0:t.mobileButtonBottom)||(t==null?void 0:t.buttonBottom)||"20px").replace(/\s*!important/g,"");m.style.setProperty("right",u,"important"),m.style.setProperty("bottom",g,"important")}else if(m){let u=((t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),g=((t==null?void 0:t.buttonBottom)||"20px").replace(/\s*!important/g,"");m.style.setProperty("right",u,"important"),m.style.setProperty("bottom",g,"important")}}function Ni(){let e=document.getElementById("chat-button");if(!e)return;let t=h.getConfig(),o=window.CHATBOT_PREVIEW_MODE===!0?(t==null?void 0:t.previewMode)==="mobile":window.innerWidth<=1e3,r=o?(t==null?void 0:t.mobileButtonSize)||"65":(t==null?void 0:t.buttonSize)||"74",a=parseFloat(r)||74;e.querySelectorAll("svg, img, dotlottie-player, .di-lottie-player").forEach(b=>{let T=b;T.style.setProperty("width",`${r}px`,"important"),T.style.setProperty("height",`${r}px`,"important")});let p=e.querySelector(".notification-badge");if(p){p.style.setProperty("top",`${a*.014}px`,"important");let b=o?a*.05:a*.12;p.style.setProperty("right",`${b}px`,"important"),p.style.setProperty("min-width",`${a*.27}px`,"important"),p.style.setProperty("height",`${a*.27}px`,"important"),p.style.setProperty("font-size",`${a*.162}px`,"important"),p.style.setProperty("line-height",`${a*.27}px`,"important")}let m=parseFloat(o?(t==null?void 0:t.mobileButtonSize)||"65":(t==null?void 0:t.buttonSize)||"65")||65,u=document.getElementById("minimize-button");if(u){u.style.setProperty("top",`${m*-.154}px`,"important"),u.style.setProperty("right",`${m*-.077}px`,"important");let b=`${m*.37}px`;u.style.setProperty("width",b,"important"),u.style.setProperty("height",b,"important"),u.style.setProperty("min-width",b,"important"),u.style.setProperty("min-height",b,"important"),u.style.setProperty("max-width",b,"important"),u.style.setProperty("max-height",b,"important"),u.style.setProperty("font-size",`${m*.277}px`,"important")}let g=document.getElementById("plus-overlay");if(g){g.style.setProperty("bottom",`${m*-.069}px`,"important"),g.style.setProperty("right",`${m*.154}px`,"important");let b=`${m*.308}px`;g.style.setProperty("width",b,"important"),g.style.setProperty("height",b,"important"),g.style.setProperty("min-width",b,"important"),g.style.setProperty("min-height",b,"important"),g.style.setProperty("max-width",b,"important"),g.style.setProperty("max-height",b,"important"),g.style.setProperty("font-size",`${m*.23}px`,"important")}}function Fi({chatButtonImageUrl:e,mobileChatButtonImageUrl:t}){let n=document.getElementById("chat-button");n&&Hn({chatButton:n,chatButtonImageUrl:e,mobileChatButtonImageUrl:t})}function $i({config:e}){let t=e.fullscreenMode===!0,n=document.getElementById("chat-button"),o=document.getElementById("chatbase-message-bubbles"),r=document.getElementById("minimize-button"),a=document.getElementById("chat-container"),l=document.getElementById("chat-iframe");t?(n&&(n.style.display="none"),o&&(o.style.display="none"),r&&(r.style.display="none"),a&&a.classList.add("chat-open"),l&&(l.style.display="block")):(n&&(n.style.display=""),l&&l.style.display)}var Hi=["Roboto","Open Sans","Montserrat","Barlow Semi Condensed","Lato"],Wi=new Map(Hi.map(e=>[e.toLowerCase(),e]));function eo(e){if(!e||typeof e!="string")return null;let t=e.trim().toLowerCase();return t&&Wi.get(t)||null}function no(e){let t=new URL("https://fonts.googleapis.com/css2");return t.searchParams.set("family",`${e}:wght@200;300;400;600;900`),t.searchParams.set("display","swap"),t.toString()}var De={init:oo};async function oo({ctx:e}){if(h.chatbotInitialized)return;if(!document.body){setTimeout(()=>{oo({ctx:e})},500);return}if(new URLSearchParams(window.location.search).get("chat")==="open"&&(localStorage.setItem("chatWindowState","open"),history.replaceState(null,"",window.location.pathname)),document.getElementById("chat-container"))return;h.setChatbotInitialized();let n=await Jn.get({ctx:e});if(h.setCtx(n),n.getConfig()._domainBlocked){d.warn("Chatbot initialization aborted: domain not authorized");return}if(n.getConfig()._invalidIframeUrl){d.warn("Chatbot initialization aborted: invalid iframe URL");return}let o=await Ot({ctx:n});o&&o.variant_id&&h.setSplitTestId(o.variant_id),n.isPreviewMode&&to({ctx:n});let r=eo(n.getConfig().fontFamily);if(r){let p=document.createElement("link");p.rel="stylesheet",p.href=no(r),document.head.appendChild(p)}function a(){try{let p=Wn.build({ctx:n});if(!p){d.warn("Chatbot DOM build returned null. Skipping render.");return}document.body.appendChild(p),setTimeout(()=>{let m=document.getElementById("chat-container");!n.getConfig().enableMinimizeButton&&m&&m.classList.add("minimize-disabled")},100)}catch(p){d.error("Failed to insert chatbot HTML:",p)}}if(document.body?(a(),Ue()):requestAnimationFrame(()=>{document.body?(a(),Ue()):setTimeout(a,100)}),Gn.inject({ctx:n}),Sn.register({ctx:n}),n.getConfig().fullscreenMode===!0)setTimeout(()=>{let p=document.getElementById("chat-iframe");if(p!=null&&p.contentWindow)try{let m=M(n.getConfig().iframeUrl)||void 0;D.postToIframe({iframe:p,iframeUrl:m,data:{action:"chatOpened"},reason:"chatOpened"})}catch(m){}N({ctx:n}),W({ctx:n})},500);else if(!n.isPreviewMode){let p=window.innerWidth>=1e3,m=localStorage.getItem("chatWindowState");p&&m==="open"?setTimeout(()=>{document.getElementById("chat-button")&&lt({ctx:n})},500):p||localStorage.removeItem("chatWindowState"),n.getConfig().enablePopupMessage&&!(p&&m==="open")&&setTimeout(()=>{te({ctx:n})},2e3)}n.isPreviewMode||wt({ctx:n})}window.DialogIntelligens=mn();(async function(){await Gi()})();async function Gi(){let e={purchaseTrackingEnabled:!1,enableMinimizeButton:!1,enablePopupMessage:!1,pagePath:window.location.href,isPhoneView:window.innerWidth<1e3,leadGen:"%%",leadMail:"",leadField1:"Navn",leadField2:"Email",useThumbsRating:!1,ratingTimerDuration:18e3,replaceExclamationWithPeriod:!1,privacyLink:"https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf",freshdeskEmailLabel:"Din email:",freshdeskMessageLabel:"Besked til kundeservice:",freshdeskImageLabel:"Upload billede (valgfrit):",freshdeskChooseFileText:"V\xE6lg fil",freshdeskNoFileText:"Ingen fil valgt",freshdeskSendingText:"Sender...",freshdeskSubmitText:"Send henvendelse",freshdeskEmailRequiredError:"Email er p\xE5kr\xE6vet",freshdeskEmailInvalidError:"Indtast venligst en gyldig email adresse",freshdeskFormErrorText:"Ret venligst fejlene i formularen",freshdeskMessageRequiredError:"Besked er p\xE5kr\xE6vet",freshdeskSubmitErrorText:"Der opstod en fejl",contactConfirmationText:"Tak for din henvendelse",freshdeskConfirmationText:"Tak for din henvendelse",freshdeskSubjectText:"Din henvendelse",inputPlaceholder:"Skriv dit sp\xF8rgsm\xE5l her...",ratingMessage:"Fik du besvaret dit sp\xF8rgsm\xE5l?",productButtonText:"SE PRODUKT",productButtonColor:"",productDiscountPriceColor:"",productButtonPadding:"",productImageHeightMultiplier:1,headerLogoG:"",messageIcon:"",themeColor:"#1a1d56",aiMessageColor:"#e5eaf5",aiMessageTextColor:"#262641",userMessageColor:"",userMessageTextColor:"#ffffff",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opst\xE5 fejl, og at samtalen kan gemmes og behandles. L\xE6s mere i vores privatlivspolitik.",subtitleLinkText:"",subtitleLinkUrl:"",fontFamily:"",enableLivechat:!1,titleG:"Chat Assistent",require_email_before_conversation:!1,splitTestId:null,isTabletView:!1,buttonBottom:"20px",buttonRight:"10px"};h.setConfig(e);let t={isPreviewMode:!!window.CHATBOT_PREVIEW_MODE,getChatbotId:io,hasSentMessageToChatbot:()=>localStorage.getItem(`hasSentMessage_${io()}`)==="true",getConfig:()=>Vi(e)},n=t.getChatbotId();if(n)try{let o=await fetch(`${H.getUrl({ctx:t})}/api/integration-config/${n}`);if(o.status===403){d.warn("Domain not authorized for this chatbot. Chatbot will not load.");return}if(o.status===404){d.warn("Chatbot not found or disabled. Chatbot will not load.");return}if(o.status>=500){d.warn("Server error loading chatbot config. Chatbot will not load.");return}}catch(o){d.warn("Failed to check domain authorization:",o)}t.isPreviewMode?d.log("Preview Mode: Initializing chatbot preview"):d.log(`Initializing universal chatbot: ${t.getChatbotId()}`),document.readyState==="complete"?se({ctx:t}):document.readyState==="interactive"?se({ctx:t}):document.addEventListener("DOMContentLoaded",()=>{se({ctx:t})}),setTimeout(()=>{h.chatbotInitialized||se({ctx:t})},2e3)}function Vi(e){var n;let t=h.getConfig();return t||(window.CHATBOT_PREVIEW_MODE&&window.CHATBOT_PREVIEW_CONFIG?{...e,...window.CHATBOT_PREVIEW_CONFIG,iframeUrl:(n=window.CHATBOT_PREVIEW_CONFIG.iframeUrl)!=null?n:"https://chatbot.dialogintelligens.dk"}:e)}function io(){var t,n;let e=h.getChatbotId();return e||(window.CHATBOT_PREVIEW_MODE&&((t=window.CHATBOT_PREVIEW_CONFIG)!=null&&t.chatbotID)?window.CHATBOT_PREVIEW_CONFIG.chatbotID:(n=ji())!=null?n:"")}function ji(){try{let e=document.currentScript;if(e||(e=Array.from(document.scripts).find(r=>{var a;return(a=r.src)==null?void 0:a.includes("/universal-chatbot.js")})),!e||!e.src)return d.error("Could not find script reference. Make sure script is loaded correctly."),null;let n=new URL(e.src).searchParams.get("id");return n||(d.error('Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"><\/script>'),d.error("Script URL:",e.src),null)}catch(e){return d.error("Failed to extract chatbot ID from script URL:",e),null}}function se({ctx:e}){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{De.init({ctx:e})},100)}):setTimeout(()=>{De.init({ctx:e})},100)}})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.2 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.2/LICENSE *)
*/

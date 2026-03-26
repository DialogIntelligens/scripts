"use strict";(()=>{var ho=/^(javascript:|data:|vbscript:|file:|blob:)/i,bo=/^(\/|\.\/|\.\.\/|\?|#)/,yo=/[\u0000-\u001F\u007F]/,To=/["'<>`]/,Co=/\s/;function Xt(e){if(!e||typeof e!="string")return null;let t=e.trim();if(!t||t.startsWith("//")||yo.test(t)||To.test(t)||Co.test(t))return null;let n=t.replace(/[\u0000-\u001F\u007F\s]+/g,"");if(ho.test(n))return null;if(bo.test(t))return t;try{let o=new URL(t),i=o.protocol.toLowerCase();return i!=="http:"&&i!=="https:"?null:o.href}catch(o){return null}}function ye(e){let t=Xt(e);return!t||t.startsWith("#")||t.startsWith("?")?null:t}function nn(e){if(!e)return null;let t=Xt(e);return!t||t.startsWith("#")||t.startsWith("?")?null:t}function M(e){return nn(e)}function st(e){return nn(e)}var u={log:Eo,error:So,warn:Io,isEnabled:Zt};function Eo(...e){Zt()&&console.log(...e)}function Io(...e){Zt()&&console.warn(...e)}function So(...e){Zt()&&console.error(...e)}function Zt(){return!!(window.localStorage.getItem("CHATBOT_LOGGING_ENABLED")==="true"||window.CHATBOT_LOGGING_ENABLED)}var W={getUrl:wo};function wo({ctx:e}){var t;if(e.isPreviewMode&&((t=window.CHATBOT_PREVIEW_CONFIG)!=null&&t.backendUrl))return window.CHATBOT_PREVIEW_CONFIG.backendUrl;if(typeof __CHATBOT_API_URL__!="undefined"){let n=__CHATBOT_API_URL__.trim();if(n.length===0)return n;try{let o=new URL(n);if(o.hostname==="api"&&window.location.hostname&&window.location.hostname!=="api"){let i=o.port||"3000";return`${o.protocol}//${window.location.hostname}:${i}`}}catch(o){}return n}return"https://api.dialogintelligens.dk"}var Te={isLottieUrl:sn,ensurePlayerLoaded:ln,createPlayerElement:vo,destroyPlayerElement:_o};function sn(e){if(!e)return!1;let t=e.split("?")[0].toLowerCase();return t.endsWith(".json")||t.endsWith(".lottie")}var on="https://assets.dialogintelligens.dk/@dotlottie/dotlottie-player.mjs",rn="di-dotlottie-player-script",an=!1;function xo(){let e="$DOTLOTTIE_PLAYER_URL".trim().length>0?"$DOTLOTTIE_PLAYER_URL".trim():on,t=Xt(e);return t||on}function ln(){if(typeof document=="undefined"||typeof customElements!="undefined"&&customElements.get("dotlottie-player")||document.getElementById(rn)||an)return;an=!0;let e=document.createElement("script");e.id=rn,e.type="module",e.src=xo(),e.crossOrigin="anonymous",e.onerror=()=>{u.warn("Failed to load dotlottie-player module",e.src)},document.head.appendChild(e)}function vo(e){let t=st(e);if(!t||!sn(t))return null;ln();let n=document.createElement("dotlottie-player");return n.className="di-lottie-player",n.setAttribute("src",t),n.setAttribute("autoplay",""),n.setAttribute("loop",""),n.style.width="100%",n.style.height="100%",n.style.display="block",n}function _o(e){var n,o,i;if(!e)return;let t=e;if(t.tagName.toLowerCase()==="dotlottie-player")try{(n=t.pause)==null||n.call(t),(o=t.stop)==null||o.call(t),(i=t.destroy)==null||i.call(t)}catch(a){u.warn("Failed to destroy dotlottie-player",a)}}var B={getTargetOrigin:cn,canPostToIframe:dn,postToIframe:Ao};function cn(e){if(!e)return"";if(e.startsWith("/"))return window.location.origin;try{return new URL(e).origin}catch(t){return e.replace(/\/$/,"")}}function dn({iframe:e,targetOrigin:t}){if(!(e!=null&&e.contentWindow)||!t)return!1;try{return e.contentWindow.location.origin===t}catch(n){return!0}}function Ao({iframe:e,iframeUrl:t,data:n,reason:o}){var a;let i=cn(t);if(!i)return!1;if(!dn({iframe:e,targetOrigin:i}))return u.log("Skipping iframe postMessage until iframe is ready",o||"unknown","targetOrigin:",i),!1;try{return(a=e==null?void 0:e.contentWindow)==null||a.postMessage(n,i),!0}catch(l){return u.warn("Failed to postMessage to iframe",o||"unknown",l),!1}}var b={isIframeEnlarged:!1,chatbotInitialized:!!window.chatbotInitialized,hasReportedPurchase:!1,splitTestId:null,pendingMessage:null,_config:null,_chatbotId:null,_ctx:null,setChatbotInitialized(){window.chatbotInitialized=!0,this.chatbotInitialized=!0},toggleIsIframeEnlarged(){this.isIframeEnlarged=!this.isIframeEnlarged},setHasReportedPurchase(e){this.hasReportedPurchase=e},setSplitTestId(e){this.splitTestId=e},setPendingMessage(e){this.pendingMessage=e},consumePendingMessage(){let e=this.pendingMessage;return this.pendingMessage=null,e},setConfig(e){this._config=e},getConfig(){return this._config},setChatbotId(e){this._chatbotId=e},getChatbotId(){return this._chatbotId},setCtx(e){this._ctx=e},getCtx(){return this._ctx},updateConfig(e){this._config&&(this._config={...this._config,...e})},getState(){return{isIframeEnlarged:this.isIframeEnlarged,chatbotInitialized:this.chatbotInitialized,hasReportedPurchase:this.hasReportedPurchase,splitTestId:this.splitTestId}},reset(){this.isIframeEnlarged=!1,this.chatbotInitialized=!1,this.hasReportedPurchase=!1,this.splitTestId=null,this.pendingMessage=null,this._config=null,this._chatbotId=null,this._ctx=null,window.chatbotInitialized=!1}};async function G({ctx:e}){var n;let t=document.getElementById("chat-iframe");if(t)try{let o=e.getConfig(),i=e.getChatbotId();u.log("sendMessageToIframe - chatbotID:",i,"iframeUrl:",o.iframeUrl),u.log("sendMessageToIframe - full config:",JSON.stringify(o,null,2));let a;if(o.raptorEnabled&&o.raptorCookieName){let c=document.cookie.match(new RegExp("(?:^|;\\s*)"+o.raptorCookieName+"=([^;]*)"));c&&(a=decodeURIComponent(c[1]))}let l;if(o.externalApiEnabled&&o.externalApiTokenSourceKey)try{l=Po(o.externalApiTokenSource||"localStorage",o.externalApiTokenSourceKey,o.externalApiTokenJsonPath||null)}catch(c){u.warn("Failed to extract external API token:",c)}let h={action:"integrationOptions",chatbotID:i,...o,splitTestId:b.splitTestId,pagePath:e.isPreviewMode&&((n=window.CHATBOT_PREVIEW_CONFIG)!=null&&n.parentPageUrl)?window.CHATBOT_PREVIEW_CONFIG.parentPageUrl:window.location.href,isTabletView:window.innerWidth>=768&&window.innerWidth<1e3,isPhoneView:window.innerWidth<768,gptInterface:!1,raptorCookieId:a,externalApiToken:l},g=M(o.iframeUrl)||void 0;if(!g){u.warn("No iframeUrl configured, cannot send message to iframe");return}B.postToIframe({iframe:t,iframeUrl:g,data:h,reason:"integrationOptions"})}catch(o){u.warn("Failed to send message to iframe:",o)}}function Lo(e,t){let n=t.split("."),o=e;for(let i of n){if(o==null)return;if(typeof o=="string")try{o=JSON.parse(o)}catch(a){return}if(typeof o=="object"&&o!==null)o=o[i];else return}if(typeof o=="string"){try{let i=JSON.parse(o);if(typeof i=="string")return i}catch(i){}return o}return o!=null?String(o):void 0}function Po(e,t,n){let o=null;switch(e){case"localStorage":o=localStorage.getItem(t);break;case"sessionStorage":o=sessionStorage.getItem(t);break;case"cookie":{let i=document.cookie.match(new RegExp("(?:^|;\\s*)"+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"=([^;]*)"));o=i?decodeURIComponent(i[1]):null;break}default:return}if(o)return n?Lo(o,n):o}function Mt(e){return typeof CSS!="undefined"&&CSS.supports("height","1dvh")?`${e}dvh`:`${e}vh`}function F({ctx:e}){let t=e.getConfig(),n=document.getElementById("chat-iframe");if(!n)return;if(window.CHATBOT_PREVIEW_MODE===!0){let a=t&&t.previewMode==="mobile",l=t&&t.fullscreenMode;l||a?(l?(n.style.width="100%",n.style.height="100%"):(n.style.width="100vw",n.style.height=Mt(100)),n.style.position="fixed",n.style.left="0",n.style.top="0",n.style.transform="none",n.style.bottom="0",n.style.right="0"):(n.style.width=(t==null?void 0:t.iframeWidthDesktop)||"calc(50vh + 8vw)",n.style.height=(t==null?void 0:t.iframeHeightDesktop)||Mt(90),n.style.position="fixed",n.style.left="auto",n.style.top="auto",n.style.transform="none",n.style.bottom="3vh",n.style.right="2vw");return}let i=t&&t.fullscreenMode===!0;i?(n.style.width="100%",n.style.height="100%",n.style.position="fixed",n.style.inset="0",n.style.left="0",n.style.top="0",n.style.right="0",n.style.bottom="0",n.style.transform="none"):b.isIframeEnlarged?(n.style.width=t.iframeWidthDesktop||"calc(50vh + 8vw)",n.style.height=t.iframeHeightDesktop||Mt(90)):window.innerWidth<1e3?(n.style.width="100vw",n.style.height=Mt(100)):(n.style.width=t.iframeWidthDesktop||"calc(50vh + 8vw)",n.style.height=t.iframeHeightDesktop||Mt(90)),n.style.position="fixed",i||window.innerWidth<1e3?(n.style.left="0",n.style.top="0",n.style.transform="none",n.style.bottom="0",n.style.right="0"):(n.style.left="auto",n.style.top="auto",n.style.transform="none",n.style.bottom="3vh",n.style.right="2vw"),G({ctx:e})}function lt({ctx:e}){let t=document.getElementById("chat-button"),n=document.getElementById("chat-iframe"),o=document.getElementById("chatbase-message-bubbles"),i=document.getElementById("minimize-button"),a=document.getElementById("chat-container");if(!n){u.error("Chat iframe not found");return}let l=n.style.display;if(u.log(`toggleChatWindow called. Current display: "${l}"`),l==="none"||!l){u.log("Opening chat..."),n.style.display="block",t&&(t.style.display="none"),o&&(o.style.display="none"),a&&(a.classList.add("chat-open"),a.classList.remove("minimized"));let h=`chatMinimized_${e.getChatbotId()}`;localStorage.removeItem(h);let g=`popupState_${e.getChatbotId()}`;localStorage.setItem(g,"dismissed"),window.innerWidth>=1e3&&localStorage.setItem("chatWindowState","open"),F({ctx:e}),u.log("After adjustIframeSize - iframe display:",n.style.display,"dimensions:",n.style.width,"x",n.style.height),G({ctx:e}),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},50),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},150),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},300);try{let f=M(e.getConfig().iframeUrl)||void 0;B.postToIframe({iframe:n,iframeUrl:f,data:{action:"chatOpened"},reason:"chatOpened"})}catch(f){}}else u.log("Closing chat..."),n.style.display="none",t&&(t.style.display="block"),i&&(i.style.display=""),a&&a.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}function un(){let e=b.getCtx(),t=e==null?void 0:e.getChatbotId();return t?`chatHidden_${t}`:null}function mn(){return{hide(){let e=document.getElementById("chat-container"),t=document.getElementById("chat-iframe");e&&(e.style.display="none"),t&&(t.style.display="none")},show(){let e=document.getElementById("chat-container"),t=document.getElementById("chat-button"),n=document.getElementById("chat-iframe");e&&(e.style.display="",e.classList.remove("chat-open")),t&&(t.style.display="block"),n&&(n.style.display="none");let o=un();o&&localStorage.removeItem(o)},open(e){let t=b.getCtx();if(!t)return;let n=un();n&&localStorage.removeItem(n);let o=document.getElementById("chat-container");o&&(o.style.display="",o.classList.remove("chat-open"));let i=document.getElementById("chat-iframe");(!i||i.style.display==="none"||!i.style.display)&&lt({ctx:t}),e&&i&&setTimeout(()=>{let a=M(t.getConfig().iframeUrl)||void 0;B.postToIframe({iframe:i,iframeUrl:a,data:{action:"externalMessage",message:e,source:"public-api"},reason:"open(message)"})},1e3)},destroy(){let e=document.getElementById("chat-container");e&&e.remove();let t=document.getElementById("chat-iframe");t&&t.remove();let n=document.getElementById("di-chatbot-styles");n&&n.remove(),b.reset()}}}function Rt(e,t){let n=t?new CustomEvent(e,{detail:t}):new CustomEvent(e);window.dispatchEvent(n)}function pn(e){let t=()=>e.getConfig().analyticsUrlsEnabled===!0;return{open(){Rt("chat_open",{chat_type:"shopping_assistant"})},recommendation(n){let o={chat_type:"shopping_assistant",...t()&&n&&n.length>0?{urls:n}:{}};Rt("chat_recommendation",o)},response(n){Rt("chat_response",{chat_type:"shopping_assistant",response_latency_ms:n})},productClick(n){let o={chat_type:"shopping_assistant",...t()&&n?{url:n}:{}};Rt("chat_product_click",o)},conversationClassified(n){Rt("chat_conversation_classified",{chat_type:"shopping_assistant",classification:n})}}}function fn(){let e=null;return{start(){e=performance.now()},stop(){if(e===null)return null;let t=Math.round(performance.now()-e);return e=null,t}}}function St({ctx:e}){e.getConfig().purchaseTrackingEnabled&&e.hasSentMessageToChatbot()&&(setInterval(()=>Mo({ctx:e}),2e3),setInterval(()=>Ro({ctx:e}),2e3))}function Mo({ctx:e}){var n,o;let t=Bo({ctx:e});if(!(!t||!t.length))for(let i of t){let a=gn(i);if(a){let l=Uo((o=(n=a.textContent)==null?void 0:n.trim())!=null?o:"",e);if(l){localStorage.setItem(hn(e.getChatbotId()),String(l));break}}}}function Ro({ctx:e}){if(!e.hasSentMessageToChatbot()||b.hasReportedPurchase)return;let t=Oo({ctx:e});if(!t||!t.length)return;let n=t.map(o=>gn(o)).filter(o=>!!o);n.length&&n.forEach(o=>{o.hasAttribute("data-purchase-tracked")||(o.setAttribute("data-purchase-tracked","true"),o.addEventListener("click",async()=>{if(!zo({ctx:e}))return;let i=localStorage.getItem(hn(e.getChatbotId()));i&&await ko(parseFloat(i),e)}))})}function gn(e){let t=e?e.trim():"";try{return document.querySelector(t)}catch(n){return null}}function Oo({ctx:e}){let{checkoutPurchaseSelector:t}=e.getConfig();return e.isPreviewMode&&t?["#purchase-tracking-checkout-purchase","#purchase-tracking-checkout-purchase-alternative"]:typeof t=="string"?t.split(",").map(n=>n.trim()).filter(Boolean):[]}function Bo({ctx:e}){let{checkoutPriceSelector:t}=e.getConfig();return e.isPreviewMode&&t?["#purchase-tracking-checkout-price"]:typeof t=="string"?t.split(",").map(n=>n.trim()).filter(Boolean):[]}function zo({ctx:e}){var i;if(e.isPreviewMode)return!0;let t=(i=e.getConfig().checkoutPurchaseTrackingUrl)==null?void 0:i.trim();if(!t)return!0;let n=window.location.href,o=window.location.pathname;return t.startsWith("/")?o.startsWith(t):n.startsWith(t)}async function ko(e,t){if(localStorage.getItem(Ce(t.getChatbotId()))){b.setHasReportedPurchase(!0);return}let n=t.getConfig().currency||"DKK",o=document.getElementById("chat-iframe");if(!o)return;let i=t.getConfig().iframeUrl;B.postToIframe({iframe:o,iframeUrl:i,data:{action:"reportPurchase",chatbotID:t.getChatbotId(),totalPrice:e,currency:n},reason:"reportPurchase"})}function Uo(e,t){let n=t.getConfig().priceExtractionLocale||"comma",o=e.match(/\d[\d.,]*/g);if(!o||o.length===0)return null;let i=0;for(let a of o){let l=a.replace(/[^\d.,]/g,"");n==="comma"?l=l.replace(/\./g,"").replace(",","."):l=l.replace(/,/g,"");let h=parseFloat(l);!isNaN(h)&&h>i&&(i=h)}return i>0?i:null}function Ce(e){let t=new Date,n=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),i=String(t.getDate()).padStart(2,"0");return`purchaseReported_${`${n}-${o}-${i}`}_${e}`}function hn(e){return`purchaseTotalPriceKey_${e}`}function ct({ctx:e}){let t=`visitorKey_${e.getChatbotId()}`,n=localStorage.getItem(t);if(!n){let o=`visitor-${Date.now()}-${Math.floor(Math.random()*1e4)}`;return localStorage.setItem(t,o),o}return n}async function Ot({ctx:e}){try{let t=ct({ctx:e}),n=W.getUrl({ctx:e}),o=await fetch(`${n}/api/split-assign?chatbot_id=${encodeURIComponent(e.getChatbotId())}&visitor_key=${encodeURIComponent(t)}`);if(!o.ok)return null;let i=await o.json();return i&&i.enabled?i:null}catch(t){return u.warn("Split test assignment failed:",t),null}}async function Ee({variantId:e,ctx:t}){try{let n=ct({ctx:t}),o=W.getUrl({ctx:t});await fetch(`${o}/api/split-impression`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:t.getChatbotId(),variant_id:e,visitor_key:n})})}catch(n){u.warn("Failed to log split impression:",n)}}var bn=!1;function Tn(e){return getComputedStyle(e).display!=="none"}function Do(e){let t=getComputedStyle(e),n=t.getPropertyValue("scale");if(n&&n!=="none"){let i=parseFloat(n);if(!Number.isNaN(i)&&i>0)return i}let o=t.transform;if(o&&o!=="none"){let i=o.match(/^matrix\((.+)\)$/);if(i){let a=i[1].split(",").map(l=>parseFloat(l.trim()));if(a.length>=6&&!Number.isNaN(a[0]))return a[0]}}return 1}function No(e){let t=e.getBoundingClientRect(),n=getComputedStyle(e),o=parseFloat(n.paddingLeft||"0")||0,i=parseFloat(n.paddingRight||"0")||0,a=parseFloat(n.paddingTop||"0")||0,l=parseFloat(n.paddingBottom||"0")||0;return{left:t.left+o,right:t.right-i,top:t.top+a,bottom:t.bottom-l,width:Math.max(0,t.width-o-i),height:Math.max(0,t.height-a-l)}}function Ie(){let e=document.getElementById("chatbase-message-bubbles"),t=document.getElementById("chat-button");if(!e||!t||!Tn(e))return;let n=8,o=No(t),i=window.innerWidth,a=window.innerHeight,l=getComputedStyle(t),h=parseFloat(l.paddingLeft||"0")||0,g=parseFloat(l.paddingRight||"0")||0,c=parseFloat(l.paddingTop||"0")||0,f=parseFloat(l.paddingBottom||"0")||0,p=Math.max(h,g,c,f),E=Do(e)||.58,A=p/E,T=Math.max(18,Math.min(60,Math.round(o.width*.55))),$=Math.ceil(T/E),C=e.querySelector(".message-box");if(C){let N=A,v=14,ot=12,I=14;C.style.paddingTop=`${Math.min(N,ot)}px`,C.style.paddingRight=`${Math.min(N,I)}px`,C.style.paddingBottom=`${Math.min(N,ot)}px`,C.style.paddingLeft=`${Math.max(N,v)}px`}let dt=o.height/E;if(C&&!e.dataset.measured){let N=e.querySelector(".close-popup");N&&(N.style.display="none"),e.style.maxHeight="none",e.style.maxWidth="none",e.style.paddingRight=`${$}px`,e.style.paddingLeft="0";let v=C.style.whiteSpace,ot=C.style.width;C.style.whiteSpace="nowrap",C.style.width="auto";let I=C.scrollWidth;C.style.whiteSpace=v,C.style.width=ot;let gt=window.innerWidth<1e3?100:280,j=700+$,it=Math.max(gt,Math.min(450,I+8))+$;for(e.style.width=`${it}px`;e.scrollHeight>dt&&it<j;)it+=20,e.style.width=`${it}px`;if(e.scrollHeight>dt&&window.innerWidth<1e3){let ht=parseFloat(getComputedStyle(C).fontSize)||18;for(;e.scrollHeight>dt&&ht>9;)ht-=1,C.style.fontSize=`${ht}px`,C.style.lineHeight="1.2em"}N&&(N.style.display=""),e.style.maxWidth="",e.dataset.measured="1"}e.style.maxHeight=`${dt}px`,e.style.overflow="hidden";let wt=e.offsetWidth,X=e.offsetHeight,w=E;e.style.scale=String(w);let et=wt*w,ut=X*w,xt=18*w,Ft=xt+T,nt=o.top+o.height/2,L=o.left-xt+Ft,mt=o.right+xt-Ft,vt=L-et,_t=mt+et,ae=vt>=n,se=_t<=i-n,pt,Z,Ht=!1;ae?(e.classList.remove("tail-left"),pt=L-wt,Z=nt-X/2):se?(e.classList.add("tail-left"),pt=mt,Z=nt-X/2,Ht=!0):(e.classList.remove("tail-left"),pt=Math.max(n/w,L-wt),Z=nt-X/2),Ht?(e.style.paddingLeft=`${$}px`,e.style.paddingRight="0"):(e.style.paddingLeft="0",e.style.paddingRight=`${$}px`);let At=nt-ut/2,x=nt+ut/2;At<n?Z+=(n-At)/w:x>a-n&&(Z-=(x-(a-n))/w),e.style.left=`${pt}px`,e.style.top=`${Z}px`}function Fo(){if(bn)return;bn=!0;let e=()=>{Ie()};window.addEventListener("resize",e,{passive:!0}),window.addEventListener("scroll",e,{passive:!0}),window.visualViewport&&(window.visualViewport.addEventListener("resize",e,{passive:!0}),window.visualViewport.addEventListener("scroll",e,{passive:!0}));let t=document.getElementById("chatbase-message-bubbles");t&&new ResizeObserver(e).observe(t)}function Cn(e){e.style.display="flex",e.style.visibility="hidden",delete e.dataset.measured,Fo(),requestAnimationFrame(()=>{Ie(),e.style.visibility="visible",requestAnimationFrame(()=>{Ie()})})}async function Jt({ctx:e}){let t=document.getElementById("chat-iframe");if(t&&t.style.display!=="none")return;let n=`chatMinimized_${e.getChatbotId()}`;if(localStorage.getItem(n)==="true")return;let o=window.innerWidth<1e3,i=`popupState_${e.getChatbotId()}`,a=`pageVisitCount_${e.getChatbotId()}`,l=`lastPageTime_${e.getChatbotId()}`,h=localStorage.getItem(i);if(!o){if(h==="shown"){Ho({ctx:e});return}if(h==="dismissed")return;await yn({ctx:e}),localStorage.setItem(i,"shown");return}if(e.getConfig().popupShowOnMobile===!1||h==="dismissed")return;let g=`popupShowCount_${e.getChatbotId()}`,c=parseInt(localStorage.getItem(g)||"0"),f=e.getConfig().popupMaxDisplays||2;if(c>=f){localStorage.setItem(i,"dismissed");return}let p=parseInt(localStorage.getItem(a)||"0");p++,localStorage.setItem(a,p.toString());let E=Date.now();localStorage.setItem(l,E.toString()),p>=2&&setTimeout(()=>{let A=localStorage.getItem(l),T=localStorage.getItem(i),$=localStorage.getItem(`chatMinimized_${e.getChatbotId()}`);A===E.toString()&&T!=="dismissed"&&$!=="true"&&(c++,localStorage.setItem(g,c.toString()),yn({ctx:e}).then(()=>{setTimeout(()=>{let C=document.getElementById("chatbase-message-bubbles");C&&Tn(C)&&(C.style.display="none",c>=f&&localStorage.setItem(i,"dismissed"))},15e3)}))},6e3)}function En({messageBox:e,text:t}){e.textContent=t}async function yn({ctx:e}){let t=document.getElementById("chatbase-message-bubbles"),n=document.getElementById("popup-message-box");if(!t||!n)return;let o=await In({ctx:e})||"Har du brug for hj\xE6lp?",i=null;try{i=await Ot({ctx:e}),i&&i.variant&&i.variant.config&&i.variant.config.popup_text&&(o=i.variant.config.popup_text)}catch(a){u.warn("Split test check failed:",a)}En({messageBox:n,text:o}),i&&i.variant_id&&Ee({variantId:i.variant_id,ctx:e}),t.classList.add("animate"),Cn(t)}async function Ho({ctx:e}){let t=document.getElementById("chatbase-message-bubbles"),n=document.getElementById("popup-message-box");if(!t||!n)return;let o=await In({ctx:e})||"Har du brug for hj\xE6lp?",i=null;try{i=await Ot({ctx:e}),i&&i.variant&&i.variant.config&&i.variant.config.popup_text&&(o=i.variant.config.popup_text)}catch(a){u.warn("Split test check failed:",a)}En({messageBox:n,text:o}),i&&i.variant_id&&Ee({variantId:i.variant_id,ctx:e}),t.classList.remove("animate"),Cn(t)}async function In({ctx:e}){try{let t=ct({ctx:e}),n=W.getUrl({ctx:e}),o=window.location.href,i=await fetch(`${n}/api/popup-message?chatbot_id=${encodeURIComponent(e.getChatbotId())}&visitor_key=${encodeURIComponent(t)}&url=${encodeURIComponent(o)}`);if(!i.ok)return null;let a=await i.json();return a&&a.popup_text?String(a.popup_text):null}catch(t){return u.warn("Popup fetch failed:",t),null}}function Se({ctx:e}){let t=e.getChatbotId(),n=`chatOpenTracked_${t}`;if(localStorage.getItem(n))return;let o=ct({ctx:e});localStorage.setItem(n,"true"),fetch(`${W.getUrl({ctx:e})}/chatbot-opens`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:t,visitor_key:o})}).catch(()=>{localStorage.removeItem(n)})}var wn={register:xn},Sn=fn();function xn({ctx:e}){let t=pn(e),n=document.getElementById("chat-button"),o=document.getElementById("chat-iframe"),i=document.getElementById("chatbase-message-bubbles"),a=document.querySelector(".close-popup"),l=document.getElementById("minimize-button");if(!n||!o){u.error("Chatbot elements not found. Retrying in 100ms..."),setTimeout(()=>{xn({ctx:e})},100);return}let h=`chatMinimized_${e.getChatbotId()}`,g=`chatHidden_${e.getChatbotId()}`;n&&o&&n.addEventListener("click",()=>{window.getComputedStyle(o).display!=="none"||(t.open(),Se({ctx:e})),lt({ctx:e})}),i&&o&&i.addEventListener("click",p=>{if(p.target.closest(".close-popup"))return;window.getComputedStyle(o).display!=="none"||(t.open(),Se({ctx:e})),lt({ctx:e})}),a&&a.addEventListener("click",p=>{if(p.stopPropagation(),i&&(i.style.display="none"),window.innerWidth<1e3){let A=`popupState_${e.getChatbotId()}`;localStorage.setItem(A,"dismissed")}}),l&&l.addEventListener("click",p=>{p.stopPropagation(),u.log("Minimize button clicked");let E=document.getElementById("chat-container"),A=document.getElementById("chatbase-message-bubbles");if(e.getConfig().hideChatbotOnMinimize===!0){o.style.display="none",n.style.display="none",l.style.display="none",E&&(E.classList.remove("chat-open"),E.classList.remove("minimized"),E.style.display="none"),A&&(A.style.display="none"),localStorage.removeItem(h),localStorage.setItem(g,"true"),localStorage.removeItem("chatWindowState");return}o.style.display="none",n.style.display="block",l.style.display="none",E&&(E.classList.remove("chat-open"),E.classList.add("minimized")),A&&(A.style.display="none"),localStorage.setItem(h,"true")});let c=document.getElementById("plus-overlay");if(c&&c.addEventListener("click",p=>{p.stopPropagation();let E=document.getElementById("chat-container");E&&E.classList.remove("minimized"),l&&(l.style.display=""),localStorage.removeItem(h);let A=`popupState_${e.getChatbotId()}`;localStorage.getItem(A)!=="dismissed"&&setTimeout(()=>{Jt({ctx:e})},500)}),localStorage.getItem(h)==="true"){let p=document.getElementById("chat-container");p&&p.classList.add("minimized")}if(e.getConfig().hideChatbotOnMinimize===!0&&localStorage.getItem(g)==="true"){let p=document.getElementById("chat-container"),E=document.getElementById("chatbase-message-bubbles");p&&(p.style.display="none",p.classList.remove("chat-open"),p.classList.remove("minimized")),o.style.display="none",n.style.display="none",l&&(l.style.display="none"),E&&(E.style.display="none")}else e.getConfig().hideChatbotOnMinimize!==!0&&localStorage.removeItem(g);window.addEventListener("message",p=>{var $;let E=M(e.getConfig().iframeUrl)||void 0,A=B.getTargetOrigin(E);if(p.origin!==A)return;let T=p.data;if(T.action==="purchaseReported"&&(b.setHasReportedPurchase(!0),localStorage.setItem(Ce(e.getChatbotId()),"true")),T.action==="expandChat")F({ctx:e});else if(T.action==="collapseChat")F({ctx:e});else if(T.action==="toggleSize")b.toggleIsIframeEnlarged(),F({ctx:e});else if(T.action==="closeChat"){u.log("Received closeChat message from iframe");let C=document.getElementById("chat-container");o.style.display="none",n.style.display="block",l&&(l.style.display=""),C&&C.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}else if(T.action==="openInNewTab"&&T.url){let C=ye(T.url);C?window.open(C,"_blank","noopener,noreferrer"):u.warn("Blocked unsafe openInNewTab URL",T.url)}else if(T.action==="navigate"&&T.url){let C=ye(T.url);C?window.location.assign(C):u.warn("Blocked unsafe navigate URL",T.url)}else if(T.action==="productClick")t.productClick(T.url);else if(T.action==="firstMessageSent")localStorage.setItem(`hasSentMessage_${e.getChatbotId()}`,"true"),St({ctx:e});else if(T.action==="userMessageSubmitted")Sn.start();else if(T.action==="assistantFirstToken"){let C=Sn.stop();C!==null&&t.response(C)}else T.action==="productRecommendation"&&t.recommendation(T.urls);T.action==="conversationClassified"&&t.conversationClassified(($=T.emne)!=null?$:null)}),window.addEventListener("resize",()=>{F({ctx:e})}),F({ctx:e});function f(){window.dispatchEvent(new Event("resize"))}setTimeout(f,100),setTimeout(f,300),setTimeout(f,500),setTimeout(f,800),setTimeout(f,1200),o.onload=()=>{G({ctx:e});let p=M(e.getConfig().iframeUrl)||void 0;window.getComputedStyle(o).display!=="none"&&B.postToIframe({iframe:o,iframeUrl:p,data:{action:"chatOpened"},reason:"chatOpened"})},setTimeout(()=>{o&&o.style.display==="none"&&G({ctx:e})},2e3)}var{entries:Bn,setPrototypeOf:vn,isFrozen:$o,getPrototypeOf:Wo,getOwnPropertyDescriptor:Go}=Object,{freeze:k,seal:V,create:ee}=Object,{apply:Pe,construct:Me}=typeof Reflect!="undefined"&&Reflect;k||(k=function(t){return t});V||(V=function(t){return t});Pe||(Pe=function(t,n){for(var o=arguments.length,i=new Array(o>2?o-2:0),a=2;a<o;a++)i[a-2]=arguments[a];return t.apply(n,i)});Me||(Me=function(t){for(var n=arguments.length,o=new Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];return new t(...o)});var Qt=U(Array.prototype.forEach),Vo=U(Array.prototype.lastIndexOf),_n=U(Array.prototype.pop),Bt=U(Array.prototype.push),jo=U(Array.prototype.splice),ne=U(String.prototype.toLowerCase),we=U(String.prototype.toString),xe=U(String.prototype.match),zt=U(String.prototype.replace),Yo=U(String.prototype.indexOf),Ko=U(String.prototype.trim),H=U(Object.prototype.hasOwnProperty),z=U(RegExp.prototype.test),kt=qo(TypeError);function U(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,o=new Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];return Pe(e,t,o)}}function qo(e){return function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return Me(e,n)}}function y(e,t){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ne;vn&&vn(e,null);let o=t.length;for(;o--;){let i=t[o];if(typeof i=="string"){let a=n(i);a!==i&&($o(t)||(t[o]=a),i=a)}e[i]=!0}return e}function Xo(e){for(let t=0;t<e.length;t++)H(e,t)||(e[t]=null);return e}function q(e){let t=ee(null);for(let[n,o]of Bn(e))H(e,n)&&(Array.isArray(o)?t[n]=Xo(o):o&&typeof o=="object"&&o.constructor===Object?t[n]=q(o):t[n]=o);return t}function Ut(e,t){for(;e!==null;){let o=Go(e,t);if(o){if(o.get)return U(o.get);if(typeof o.value=="function")return U(o.value)}e=Wo(e)}function n(){return null}return n}var An=k(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ve=k(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),_e=k(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Zo=k(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ae=k(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Jo=k(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Ln=k(["#text"]),Pn=k(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Le=k(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Mn=k(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),te=k(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Qo=V(/\{\{[\w\W]*|[\w\W]*\}\}/gm),ti=V(/<%[\w\W]*|[\w\W]*%>/gm),ei=V(/\$\{[\w\W]*/gm),ni=V(/^data-[\-\w.\u00B7-\uFFFF]+$/),oi=V(/^aria-[\-\w]+$/),zn=V(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ii=V(/^(?:\w+script|data):/i),ri=V(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),kn=V(/^html$/i),ai=V(/^[a-z][.\w]*(-[.\w]+)+$/i),Rn=Object.freeze({__proto__:null,ARIA_ATTR:oi,ATTR_WHITESPACE:ri,CUSTOM_ELEMENT:ai,DATA_ATTR:ni,DOCTYPE_NAME:kn,ERB_EXPR:ti,IS_ALLOWED_URI:zn,IS_SCRIPT_OR_DATA:ii,MUSTACHE_EXPR:Qo,TMPLIT_EXPR:ei}),Dt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},si=function(){return typeof window=="undefined"?null:window},li=function(t,n){if(typeof t!="object"||typeof t.createPolicy!="function")return null;let o=null,i="data-tt-policy-suffix";n&&n.hasAttribute(i)&&(o=n.getAttribute(i));let a="dompurify"+(o?"#"+o:"");try{return t.createPolicy(a,{createHTML(l){return l},createScriptURL(l){return l}})}catch(l){return console.warn("TrustedTypes policy "+a+" could not be created."),null}},On=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Un(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:si(),t=m=>Un(m);if(t.version="3.3.2",t.removed=[],!e||!e.document||e.document.nodeType!==Dt.document||!e.Element)return t.isSupported=!1,t;let{document:n}=e,o=n,i=o.currentScript,{DocumentFragment:a,HTMLTemplateElement:l,Node:h,Element:g,NodeFilter:c,NamedNodeMap:f=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:p,DOMParser:E,trustedTypes:A}=e,T=g.prototype,$=Ut(T,"cloneNode"),C=Ut(T,"remove"),dt=Ut(T,"nextSibling"),wt=Ut(T,"childNodes"),X=Ut(T,"parentNode");if(typeof l=="function"){let m=n.createElement("template");m.content&&m.content.ownerDocument&&(n=m.content.ownerDocument)}let w,et="",{implementation:ut,createNodeIterator:Ue,createDocumentFragment:xt,getElementsByTagName:Ft}=n,{importNode:nt}=o,L=On();t.isSupported=typeof Bn=="function"&&typeof X=="function"&&ut&&ut.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:mt,ERB_EXPR:vt,TMPLIT_EXPR:_t,DATA_ATTR:ae,ARIA_ATTR:se,IS_SCRIPT_OR_DATA:pt,ATTR_WHITESPACE:Z,CUSTOM_ELEMENT:Ht}=Rn,{IS_ALLOWED_URI:At}=Rn,x=null,N=y({},[...An,...ve,..._e,...Ae,...Ln]),v=null,ot=y({},[...Pn,...Le,...Mn,...te]),I=Object.seal(ee(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ft=null,gt=null,j=Object.seal(ee(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),it=!0,$t=!0,ht=!1,De=!0,bt=!1,Wt=!0,rt=!1,le=!1,ce=!1,yt=!1,Gt=!1,Vt=!1,Ne=!0,Fe=!1,so="user-content-",de=!0,Lt=!1,Tt={},Y=null,ue=y({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),He=null,$e=y({},["audio","video","img","source","image","track"]),me=null,We=y({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),jt="http://www.w3.org/1998/Math/MathML",Yt="http://www.w3.org/2000/svg",J="http://www.w3.org/1999/xhtml",Ct=J,pe=!1,fe=null,lo=y({},[jt,Yt,J],we),Kt=y({},["mi","mo","mn","ms","mtext"]),qt=y({},["annotation-xml"]),co=y({},["title","style","font","a","script"]),Pt=null,uo=["application/xhtml+xml","text/html"],mo="text/html",P=null,Et=null,po=n.createElement("form"),Ge=function(r){return r instanceof RegExp||r instanceof Function},ge=function(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Et&&Et===r)){if((!r||typeof r!="object")&&(r={}),r=q(r),Pt=uo.indexOf(r.PARSER_MEDIA_TYPE)===-1?mo:r.PARSER_MEDIA_TYPE,P=Pt==="application/xhtml+xml"?we:ne,x=H(r,"ALLOWED_TAGS")?y({},r.ALLOWED_TAGS,P):N,v=H(r,"ALLOWED_ATTR")?y({},r.ALLOWED_ATTR,P):ot,fe=H(r,"ALLOWED_NAMESPACES")?y({},r.ALLOWED_NAMESPACES,we):lo,me=H(r,"ADD_URI_SAFE_ATTR")?y(q(We),r.ADD_URI_SAFE_ATTR,P):We,He=H(r,"ADD_DATA_URI_TAGS")?y(q($e),r.ADD_DATA_URI_TAGS,P):$e,Y=H(r,"FORBID_CONTENTS")?y({},r.FORBID_CONTENTS,P):ue,ft=H(r,"FORBID_TAGS")?y({},r.FORBID_TAGS,P):q({}),gt=H(r,"FORBID_ATTR")?y({},r.FORBID_ATTR,P):q({}),Tt=H(r,"USE_PROFILES")?r.USE_PROFILES:!1,it=r.ALLOW_ARIA_ATTR!==!1,$t=r.ALLOW_DATA_ATTR!==!1,ht=r.ALLOW_UNKNOWN_PROTOCOLS||!1,De=r.ALLOW_SELF_CLOSE_IN_ATTR!==!1,bt=r.SAFE_FOR_TEMPLATES||!1,Wt=r.SAFE_FOR_XML!==!1,rt=r.WHOLE_DOCUMENT||!1,yt=r.RETURN_DOM||!1,Gt=r.RETURN_DOM_FRAGMENT||!1,Vt=r.RETURN_TRUSTED_TYPE||!1,ce=r.FORCE_BODY||!1,Ne=r.SANITIZE_DOM!==!1,Fe=r.SANITIZE_NAMED_PROPS||!1,de=r.KEEP_CONTENT!==!1,Lt=r.IN_PLACE||!1,At=r.ALLOWED_URI_REGEXP||zn,Ct=r.NAMESPACE||J,Kt=r.MATHML_TEXT_INTEGRATION_POINTS||Kt,qt=r.HTML_INTEGRATION_POINTS||qt,I=r.CUSTOM_ELEMENT_HANDLING||{},r.CUSTOM_ELEMENT_HANDLING&&Ge(r.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(I.tagNameCheck=r.CUSTOM_ELEMENT_HANDLING.tagNameCheck),r.CUSTOM_ELEMENT_HANDLING&&Ge(r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(I.attributeNameCheck=r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),r.CUSTOM_ELEMENT_HANDLING&&typeof r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(I.allowCustomizedBuiltInElements=r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),bt&&($t=!1),Gt&&(yt=!0),Tt&&(x=y({},Ln),v=ee(null),Tt.html===!0&&(y(x,An),y(v,Pn)),Tt.svg===!0&&(y(x,ve),y(v,Le),y(v,te)),Tt.svgFilters===!0&&(y(x,_e),y(v,Le),y(v,te)),Tt.mathMl===!0&&(y(x,Ae),y(v,Mn),y(v,te))),H(r,"ADD_TAGS")||(j.tagCheck=null),H(r,"ADD_ATTR")||(j.attributeCheck=null),r.ADD_TAGS&&(typeof r.ADD_TAGS=="function"?j.tagCheck=r.ADD_TAGS:(x===N&&(x=q(x)),y(x,r.ADD_TAGS,P))),r.ADD_ATTR&&(typeof r.ADD_ATTR=="function"?j.attributeCheck=r.ADD_ATTR:(v===ot&&(v=q(v)),y(v,r.ADD_ATTR,P))),r.ADD_URI_SAFE_ATTR&&y(me,r.ADD_URI_SAFE_ATTR,P),r.FORBID_CONTENTS&&(Y===ue&&(Y=q(Y)),y(Y,r.FORBID_CONTENTS,P)),r.ADD_FORBID_CONTENTS&&(Y===ue&&(Y=q(Y)),y(Y,r.ADD_FORBID_CONTENTS,P)),de&&(x["#text"]=!0),rt&&y(x,["html","head","body"]),x.table&&(y(x,["tbody"]),delete ft.tbody),r.TRUSTED_TYPES_POLICY){if(typeof r.TRUSTED_TYPES_POLICY.createHTML!="function")throw kt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof r.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw kt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');w=r.TRUSTED_TYPES_POLICY,et=w.createHTML("")}else w===void 0&&(w=li(A,i)),w!==null&&typeof et=="string"&&(et=w.createHTML(""));k&&k(r),Et=r}},Ve=y({},[...ve,..._e,...Zo]),je=y({},[...Ae,...Jo]),fo=function(r){let s=X(r);(!s||!s.tagName)&&(s={namespaceURI:Ct,tagName:"template"});let d=ne(r.tagName),S=ne(s.tagName);return fe[r.namespaceURI]?r.namespaceURI===Yt?s.namespaceURI===J?d==="svg":s.namespaceURI===jt?d==="svg"&&(S==="annotation-xml"||Kt[S]):!!Ve[d]:r.namespaceURI===jt?s.namespaceURI===J?d==="math":s.namespaceURI===Yt?d==="math"&&qt[S]:!!je[d]:r.namespaceURI===J?s.namespaceURI===Yt&&!qt[S]||s.namespaceURI===jt&&!Kt[S]?!1:!je[d]&&(co[d]||!Ve[d]):!!(Pt==="application/xhtml+xml"&&fe[r.namespaceURI]):!1},K=function(r){Bt(t.removed,{element:r});try{X(r).removeChild(r)}catch(s){C(r)}},at=function(r,s){try{Bt(t.removed,{attribute:s.getAttributeNode(r),from:s})}catch(d){Bt(t.removed,{attribute:null,from:s})}if(s.removeAttribute(r),r==="is")if(yt||Gt)try{K(s)}catch(d){}else try{s.setAttribute(r,"")}catch(d){}},Ye=function(r){let s=null,d=null;if(ce)r="<remove></remove>"+r;else{let _=xe(r,/^[\r\n\t ]+/);d=_&&_[0]}Pt==="application/xhtml+xml"&&Ct===J&&(r='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+r+"</body></html>");let S=w?w.createHTML(r):r;if(Ct===J)try{s=new E().parseFromString(S,Pt)}catch(_){}if(!s||!s.documentElement){s=ut.createDocument(Ct,"template",null);try{s.documentElement.innerHTML=pe?et:S}catch(_){}}let O=s.body||s.documentElement;return r&&d&&O.insertBefore(n.createTextNode(d),O.childNodes[0]||null),Ct===J?Ft.call(s,rt?"html":"body")[0]:rt?s.documentElement:O},Ke=function(r){return Ue.call(r.ownerDocument||r,r,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},he=function(r){return r instanceof p&&(typeof r.nodeName!="string"||typeof r.textContent!="string"||typeof r.removeChild!="function"||!(r.attributes instanceof f)||typeof r.removeAttribute!="function"||typeof r.setAttribute!="function"||typeof r.namespaceURI!="string"||typeof r.insertBefore!="function"||typeof r.hasChildNodes!="function")},qe=function(r){return typeof h=="function"&&r instanceof h};function Q(m,r,s){Qt(m,d=>{d.call(t,r,s,Et)})}let Xe=function(r){let s=null;if(Q(L.beforeSanitizeElements,r,null),he(r))return K(r),!0;let d=P(r.nodeName);if(Q(L.uponSanitizeElement,r,{tagName:d,allowedTags:x}),Wt&&r.hasChildNodes()&&!qe(r.firstElementChild)&&z(/<[/\w!]/g,r.innerHTML)&&z(/<[/\w!]/g,r.textContent)||r.nodeType===Dt.progressingInstruction||Wt&&r.nodeType===Dt.comment&&z(/<[/\w]/g,r.data))return K(r),!0;if(!(j.tagCheck instanceof Function&&j.tagCheck(d))&&(!x[d]||ft[d])){if(!ft[d]&&Je(d)&&(I.tagNameCheck instanceof RegExp&&z(I.tagNameCheck,d)||I.tagNameCheck instanceof Function&&I.tagNameCheck(d)))return!1;if(de&&!Y[d]){let S=X(r)||r.parentNode,O=wt(r)||r.childNodes;if(O&&S){let _=O.length;for(let D=_-1;D>=0;--D){let tt=$(O[D],!0);tt.__removalCount=(r.__removalCount||0)+1,S.insertBefore(tt,dt(r))}}}return K(r),!0}return r instanceof g&&!fo(r)||(d==="noscript"||d==="noembed"||d==="noframes")&&z(/<\/no(script|embed|frames)/i,r.innerHTML)?(K(r),!0):(bt&&r.nodeType===Dt.text&&(s=r.textContent,Qt([mt,vt,_t],S=>{s=zt(s,S," ")}),r.textContent!==s&&(Bt(t.removed,{element:r.cloneNode()}),r.textContent=s)),Q(L.afterSanitizeElements,r,null),!1)},Ze=function(r,s,d){if(gt[s]||Ne&&(s==="id"||s==="name")&&(d in n||d in po))return!1;if(!($t&&!gt[s]&&z(ae,s))){if(!(it&&z(se,s))){if(!(j.attributeCheck instanceof Function&&j.attributeCheck(s,r))){if(!v[s]||gt[s]){if(!(Je(r)&&(I.tagNameCheck instanceof RegExp&&z(I.tagNameCheck,r)||I.tagNameCheck instanceof Function&&I.tagNameCheck(r))&&(I.attributeNameCheck instanceof RegExp&&z(I.attributeNameCheck,s)||I.attributeNameCheck instanceof Function&&I.attributeNameCheck(s,r))||s==="is"&&I.allowCustomizedBuiltInElements&&(I.tagNameCheck instanceof RegExp&&z(I.tagNameCheck,d)||I.tagNameCheck instanceof Function&&I.tagNameCheck(d))))return!1}else if(!me[s]){if(!z(At,zt(d,Z,""))){if(!((s==="src"||s==="xlink:href"||s==="href")&&r!=="script"&&Yo(d,"data:")===0&&He[r])){if(!(ht&&!z(pt,zt(d,Z,"")))){if(d)return!1}}}}}}}return!0},Je=function(r){return r!=="annotation-xml"&&xe(r,Ht)},Qe=function(r){Q(L.beforeSanitizeAttributes,r,null);let{attributes:s}=r;if(!s||he(r))return;let d={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:v,forceKeepAttr:void 0},S=s.length;for(;S--;){let O=s[S],{name:_,namespaceURI:D,value:tt}=O,It=P(_),be=tt,R=_==="value"?be:Ko(be);if(d.attrName=It,d.attrValue=R,d.keepAttr=!0,d.forceKeepAttr=void 0,Q(L.uponSanitizeAttribute,r,d),R=d.attrValue,Fe&&(It==="id"||It==="name")&&(at(_,r),R=so+R),Wt&&z(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,R)){at(_,r);continue}if(It==="attributename"&&xe(R,"href")){at(_,r);continue}if(d.forceKeepAttr)continue;if(!d.keepAttr){at(_,r);continue}if(!De&&z(/\/>/i,R)){at(_,r);continue}bt&&Qt([mt,vt,_t],en=>{R=zt(R,en," ")});let tn=P(r.nodeName);if(!Ze(tn,It,R)){at(_,r);continue}if(w&&typeof A=="object"&&typeof A.getAttributeType=="function"&&!D)switch(A.getAttributeType(tn,It)){case"TrustedHTML":{R=w.createHTML(R);break}case"TrustedScriptURL":{R=w.createScriptURL(R);break}}if(R!==be)try{D?r.setAttributeNS(D,_,R):r.setAttribute(_,R),he(r)?K(r):_n(t.removed)}catch(en){at(_,r)}}Q(L.afterSanitizeAttributes,r,null)},go=function m(r){let s=null,d=Ke(r);for(Q(L.beforeSanitizeShadowDOM,r,null);s=d.nextNode();)Q(L.uponSanitizeShadowNode,s,null),Xe(s),Qe(s),s.content instanceof a&&m(s.content);Q(L.afterSanitizeShadowDOM,r,null)};return t.sanitize=function(m){let r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},s=null,d=null,S=null,O=null;if(pe=!m,pe&&(m="<!-->"),typeof m!="string"&&!qe(m))if(typeof m.toString=="function"){if(m=m.toString(),typeof m!="string")throw kt("dirty is not a string, aborting")}else throw kt("toString is not a function");if(!t.isSupported)return m;if(le||ge(r),t.removed=[],typeof m=="string"&&(Lt=!1),Lt){if(m.nodeName){let tt=P(m.nodeName);if(!x[tt]||ft[tt])throw kt("root node is forbidden and cannot be sanitized in-place")}}else if(m instanceof h)s=Ye("<!---->"),d=s.ownerDocument.importNode(m,!0),d.nodeType===Dt.element&&d.nodeName==="BODY"||d.nodeName==="HTML"?s=d:s.appendChild(d);else{if(!yt&&!bt&&!rt&&m.indexOf("<")===-1)return w&&Vt?w.createHTML(m):m;if(s=Ye(m),!s)return yt?null:Vt?et:""}s&&ce&&K(s.firstChild);let _=Ke(Lt?m:s);for(;S=_.nextNode();)Xe(S),Qe(S),S.content instanceof a&&go(S.content);if(Lt)return m;if(yt){if(Gt)for(O=xt.call(s.ownerDocument);s.firstChild;)O.appendChild(s.firstChild);else O=s;return(v.shadowroot||v.shadowrootmode)&&(O=nt.call(o,O,!0)),O}let D=rt?s.outerHTML:s.innerHTML;return rt&&x["!doctype"]&&s.ownerDocument&&s.ownerDocument.doctype&&s.ownerDocument.doctype.name&&z(kn,s.ownerDocument.doctype.name)&&(D="<!DOCTYPE "+s.ownerDocument.doctype.name+`>
`+D),bt&&Qt([mt,vt,_t],tt=>{D=zt(D,tt," ")}),w&&Vt?w.createHTML(D):D},t.setConfig=function(){let m=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ge(m),le=!0},t.clearConfig=function(){Et=null,le=!1},t.isValidAttribute=function(m,r,s){Et||ge({});let d=P(m),S=P(r);return Ze(d,S,s)},t.addHook=function(m,r){typeof r=="function"&&Bt(L[m],r)},t.removeHook=function(m,r){if(r!==void 0){let s=Vo(L[m],r);return s===-1?void 0:jo(L[m],s,1)[0]}return _n(L[m])},t.removeHooks=function(m){L[m]=[]},t.removeAllHooks=function(){L=On()},t}var Dn=Un();var ci=["svg","defs","clipPath","clippath","path","g","rect","ellipse"],di=["xmlns","viewBox","viewbox","id","d","clip-rule","clip-path","x","y","width","height","fill","cx","cy","rx","ry"],ui="di-chatbot-script",oe=null,Nn=!1;function Fn(){return{createPolicy:(e,t)=>t}}function mi(e){return typeof e.trustedTypes=="undefined"&&(e.trustedTypes=Fn()),e.trustedTypes}function pi(){if(typeof window=="undefined")return null;let e=window;return e.__DI_FORCE_TRUSTED_TYPES_TINYFILL__===!0?Fn():typeof e.trustedTypes=="undefined"?mi(e):e.trustedTypes}function Hn(){if(Nn)return oe;Nn=!0;let e=pi();if(!e)return null;try{oe=e.createPolicy(ui,{createHTML:t=>t,createScriptURL:t=>t})}catch(t){oe=null}return oe}function fi(e){if(!e||typeof e!="string")return"";let t=Hn(),n={ALLOWED_TAGS:[...ci],ALLOWED_ATTR:[...di],USE_PROFILES:{svg:!0,svgFilters:!1,html:!1},KEEP_CONTENT:!1,RETURN_TRUSTED_TYPE:!1};t&&typeof t.createScriptURL=="function"&&(n.TRUSTED_TYPES_POLICY=t);let o=Dn.sanitize(e,n);if(typeof o!="string")return"";let i=o.trim();return!/^<svg[\s>]/i.test(i)||!/<\/svg>\s*$/i.test(i)?"":i}function $n(e){let t=fi(e);if(!t)return null;let n=Hn();if(!n)return null;let o=n.createHTML(t);if(!o)return null;let i=new DOMParser().parseFromString(o,"image/svg+xml");if(i.querySelector("parsererror"))return null;let a=i.documentElement;if(!a||a.tagName.toLowerCase()!=="svg")return null;try{let l=document.importNode(a,!0);return l instanceof SVGElement?l:null}catch(l){return null}}var gi=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 750">
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
            </svg>`;function hi(){let e=$n(gi);if(!e){let t=document.createElement("span");return t.textContent="Chat",t}return e}function Re(e){if(e&&e.trim().length>0){let t=Te.createPlayerElement(e);if(t)return t;let n=st(e);if(n){let o=document.createElement("img");return o.src=n,o.alt="Chat",o}}return hi()}function Oe({chatButtonImageUrl:e,mobileChatButtonImageUrl:t}){let n=document.createDocumentFragment();if(typeof t=="string"&&t.trim().length>0){let i=document.createElement("span");i.className="desktop-button-content",i.appendChild(Re(e));let a=document.createElement("span");return a.className="mobile-button-content",a.appendChild(Re(t)),n.appendChild(i),n.appendChild(a),n}return n.appendChild(Re(e)),n}function Wn({chatButton:e,chatButtonImageUrl:t,mobileChatButtonImageUrl:n}){let o=e.querySelector("#notification-badge");e.querySelectorAll("dotlottie-player, .di-lottie-player").forEach(a=>{Te.destroyPlayerElement(a)}),e.replaceChildren(),e.appendChild(Oe({chatButtonImageUrl:t,mobileChatButtonImageUrl:n})),o&&e.appendChild(o)}var Gn={build:xi};function bi(e){try{let t=new URL(e,window.location.href);return t.searchParams.set("parentOrigin",window.location.origin),t.toString()}catch(t){return e}}function yi({isFullscreen:e}){let t=document.createElement("div");return t.id="chat-container",e&&t.classList.add("chat-open"),t}function Ti({isFullscreen:e,chatButtonImageUrl:t,mobileChatButtonImageUrl:n}){let o=document.createElement("button");if(o.id="chat-button",e)return o.style.display="none",o;o.appendChild(Oe({chatButtonImageUrl:t,mobileChatButtonImageUrl:n}));let i=document.createElement("span");return i.id="notification-badge",i.className="notification-badge",i.textContent="1",o.appendChild(i),o}function Ci(){let e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"svg");t.setAttribute("xmlns",e),t.setAttribute("width","18"),t.setAttribute("height","18"),t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("fill","none"),t.setAttribute("stroke","currentColor"),t.setAttribute("stroke-width","2.5"),t.setAttribute("stroke-linecap","round"),t.setAttribute("stroke-linejoin","round");let n=document.createElementNS(e,"line");n.setAttribute("x1","18"),n.setAttribute("y1","6"),n.setAttribute("x2","6"),n.setAttribute("y2","18");let o=document.createElementNS(e,"line");return o.setAttribute("x1","6"),o.setAttribute("y1","6"),o.setAttribute("x2","18"),o.setAttribute("y2","18"),t.appendChild(n),t.appendChild(o),t}function Ei({isFullscreen:e}){let t=document.createElement("button");return t.id="minimize-button",t.textContent="\u2212",e&&(t.style.display="none"),t}function Ii({isFullscreen:e}){let t=document.createElement("div");return t.id="plus-overlay",t.textContent="+",e&&(t.style.display="none"),t}function Si({isFullscreen:e}){let t=document.createElement("div");if(t.id="chatbase-message-bubbles",e)return t.style.display="none",t;let n=document.createElement("div");n.className="close-popup",n.appendChild(Ci());let o=document.createElement("div");o.className="message-content";let i=document.createElement("div");return i.className="message-box",i.id="popup-message-box",o.appendChild(i),t.appendChild(o),t.appendChild(n),t}function wi({iframeUrl:e,isFullscreen:t,iframeZIndex:n}){let o=document.createElement("iframe");return o.id="chat-iframe",o.src=bi(e),o.allow="microphone",o.style.border="none",o.style.zIndex=String(n||3e3),t?(o.style.display="block",o.style.position="fixed",o.style.top="0",o.style.left="0",o.style.right="0",o.style.bottom="0",o.style.width="100vw",o.style.height="100vh"):(o.style.display="none",o.style.position="fixed",o.style.bottom="3vh",o.style.right="2vw",o.style.width="50vh",o.style.height="90vh"),o}function xi({ctx:e}){let t=e.getConfig(),o=M(t.iframeUrl||"https://chatbot.dialogintelligens.dk");if(!o)return u.warn("Blocked chatbot render due to invalid iframe URL",t.iframeUrl),null;u.log("buildChatbotDOM - iframeUrl:",o,"chatbotID:",e.getChatbotId());let i=t.fullscreenMode===!0,a=document.createDocumentFragment(),l=yi({isFullscreen:i});l.appendChild(Ti({isFullscreen:i,chatButtonImageUrl:t.chatButtonImageUrl,mobileChatButtonImageUrl:t.mobileChatButtonImageUrl})),l.appendChild(Ei({isFullscreen:i})),l.appendChild(Ii({isFullscreen:i})),l.appendChild(Si({isFullscreen:i}));let h=wi({iframeUrl:o,isFullscreen:i,iframeZIndex:t.iframeZIndex});return a.appendChild(l),a.appendChild(h),a}var Vn={inject:vi};function vi({ctx:e}){let t=e.getConfig(),n=t.productButtonColor||t.themeColor||"#1a1d56",o=`
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
  display: none !important;
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
  #chat-container:not(.chat-open):not(.minimized):not(.minimize-disabled) #minimize-button {
    display: flex !important;
  }

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

`,i=document.createElement("style");i.id="di-chatbot-styles",i.appendChild(document.createTextNode(o)),document.head.appendChild(i),document.documentElement.style.setProperty("--icon-color",n)}var jn=/[\u0000-\u001F\u007F]/,Yn=/[;{}]/,_i=/\s*!important/gi,Ai=/^-?\d+(\.\d+)?(px|em|rem|vw|vh|%)$/i,Li="10px",Pi="20px",Mi="10px",Ri="20px",Oi="74",Bi="50",zi=190,ki=3e3,Kn="#1a1d56";function Be(e){if(typeof e!="string")return null;let t=e.trim();if(!t||jn.test(t)||Yn.test(t))return null;let n=t.replace(_i,"").trim();return!n||jn.test(n)||Yn.test(n)?null:n}function ie(e,t){let n=Be(e);return!n||!Ai.test(n)?t:n.toLowerCase()}function qn(e,t,{min:n,max:o}){let i=Be(e);if(!i)return t;let a=Number.parseFloat(i);if(!Number.isFinite(a))return t;let l=Math.min(o,Math.max(n,a));return String(Math.round(l))}function Xn(e,t){if(e==null)return t;let n=typeof e=="number"?e:typeof e=="string"?Number.parseInt(e,10):Number.NaN;if(!Number.isFinite(n))return t;let o=Math.trunc(n);return o<1?t:Math.min(o,2147483647)}function Zn(e,t){let n=Be(e);if(!n)return t;let o=document.createElement("span");return o.style.color="",o.style.color=n,o.style.color?n:t}function Jn(e){let t={};return"buttonRight"in e&&(t.buttonRight=ie(e.buttonRight,Li)),"buttonBottom"in e&&(t.buttonBottom=ie(e.buttonBottom,Pi)),"mobileButtonRight"in e&&(t.mobileButtonRight=ie(e.mobileButtonRight,Mi)),"mobileButtonBottom"in e&&(t.mobileButtonBottom=ie(e.mobileButtonBottom,Ri)),"buttonSize"in e&&(t.buttonSize=qn(e.buttonSize,Oi,{min:24,max:200})),"mobileButtonSize"in e&&(t.mobileButtonSize=qn(e.mobileButtonSize,Bi,{min:24,max:160})),"zIndex"in e&&(t.zIndex=Xn(e.zIndex,zi)),"iframeZIndex"in e&&(t.iframeZIndex=Xn(e.iframeZIndex,ki)),"themeColor"in e&&(t.themeColor=Zn(e.themeColor,Kn)),"productButtonColor"in e&&(t.productButtonColor=Zn(e.productButtonColor,Kn)),t}var Qn={get:Di},Ui="https://chatbot.dialogintelligens.dk";function Nt({config:e,fallbackIframeUrl:t}){let n={...e};if("chatButtonImageUrl"in e){let i=e.chatButtonImageUrl;typeof i=="string"&&i.trim().length>0?n.chatButtonImageUrl=st(i)||void 0:n.chatButtonImageUrl=void 0}if("mobileChatButtonImageUrl"in e){let i=e.mobileChatButtonImageUrl;typeof i=="string"&&i.trim().length>0?n.mobileChatButtonImageUrl=st(i)||void 0:n.mobileChatButtonImageUrl=void 0}if("iframeUrl"in e||t){let i=typeof e.iframeUrl=="string"?e.iframeUrl:t,a=M(i);a?(n.iframeUrl=a,n._invalidIframeUrl=!1):(n.iframeUrl=void 0,n._invalidIframeUrl=!0)}return Object.assign(n,Jn(e)),n}async function Di({ctx:e}){var a,l;let n=(typeof __CHATBOT_URL__!="undefined"&&__CHATBOT_URL__.trim().length>0?__CHATBOT_URL__:void 0)||(e.isPreviewMode&&((a=window.CHATBOT_PREVIEW_CONFIG)!=null&&a.iframeUrl)?window.CHATBOT_PREVIEW_CONFIG.iframeUrl:Ui);if(u.log("Config.get - defaultIframeUrl:",n),e.isPreviewMode){let h=e.getConfig(),g=(l=window.CHATBOT_PREVIEW_CONFIG)!=null?l:{},c={...h,...g,iframeUrl:g.iframeUrl||h.iframeUrl||n};if(!g.leadFields)try{let f=await fetch(`${W.getUrl({ctx:e})}/api/integration-config/${e.getChatbotId()}`);if(f.ok){let p=await f.json();c={...h,...p,...g,iframeUrl:g.iframeUrl||h.iframeUrl||p.iframeUrl||n}}}catch(f){u.warn("Failed to fetch leadFields for preview mode:",f)}return c=Nt({config:c,fallbackIframeUrl:n}),b.setConfig(c),b.setChatbotId(e.getChatbotId()),{isPreviewMode:e.isPreviewMode,getChatbotId:e.getChatbotId,hasSentMessageToChatbot:e.hasSentMessageToChatbot,getConfig:()=>{var f;return(f=b.getConfig())!=null?f:c}}}let o=await Ni({ctx:e}),i={...o,iframeUrl:o.iframeUrl||n};return i=Nt({config:i,fallbackIframeUrl:n}),b.setConfig(i),b.setChatbotId(e.getChatbotId()),{isPreviewMode:e.isPreviewMode,getChatbotId:e.getChatbotId,hasSentMessageToChatbot:e.hasSentMessageToChatbot,getConfig:()=>{var h;return(h=b.getConfig())!=null?h:i}}}async function Ni({ctx:e}){try{u.log(`Loading configuration for chatbot: ${e.getChatbotId()}`);let t=await fetch(`${W.getUrl({ctx:e})}/api/integration-config/${e.getChatbotId()}`);if(t.status===403)return u.warn("Domain not authorized for this chatbot. Widget will not load."),{...e.getConfig(),_domainBlocked:!0};if(!t.ok)throw new Error(`Failed to load configuration: ${t.status} ${t.statusText}`);let n=await t.json();return{...e.getConfig(),...n}}catch(t){return u.error("Error loading chatbot config:",t),{...e.getConfig(),themeColor:"#1a1d56",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Vores virtuelle assistent er h\xE4r for at hj\xE6lpe dig.",titleG:"Chat Assistent",enableMinimizeButton:!0,hideChatbotOnMinimize:!1,enablePopupMessage:!0}}}function ze(){let e=document.getElementById("chat-button");e&&e.addEventListener("click",()=>{let t=document.getElementById("notification-badge");t&&t.remove(),u.log("Chatbot opened \u2014 notification badge removed.")})}function eo({ctx:e}){var t;if(window.CHATBOT_PREVIEW_CONFIG){let n=Nt({config:window.CHATBOT_PREVIEW_CONFIG,fallbackIframeUrl:(t=b.getConfig())==null?void 0:t.iframeUrl});b.updateConfig(n);let o=b.getConfig(),i=(o==null?void 0:o._invalidIframeUrl)===!0;to(i),i||F({ctx:e})}window.addEventListener("previewConfigUpdate",n=>{var p;let o=n,i=b.getChatbotId(),a=o.detail.chatbotID,l=a&&a!==i;a&&b.setChatbotId(a);let h=Nt({config:o.detail,fallbackIframeUrl:(p=b.getConfig())==null?void 0:p.iframeUrl});b.updateConfig(h);let g=b.getConfig(),c=(g==null?void 0:g._invalidIframeUrl)===!0;if(to(c),c)return;(o.detail.chatButtonImageUrl!==void 0||o.detail.mobileChatButtonImageUrl!==void 0)&&Wi({chatButtonImageUrl:g==null?void 0:g.chatButtonImageUrl,mobileChatButtonImageUrl:g==null?void 0:g.mobileChatButtonImageUrl}),(o.detail.mobileButtonBottom!==void 0||o.detail.mobileButtonRight!==void 0||o.detail.buttonBottom!==void 0||o.detail.buttonRight!==void 0||o.detail.previewMode!==void 0)&&Hi(),(o.detail.buttonSize!==void 0||o.detail.mobileButtonSize!==void 0||o.detail.previewMode!==void 0)&&$i(),F({ctx:e}),Gi({config:o.detail}),St({ctx:e}),l?(u.log("Preview: Switching chatbot from",i,"to",a),G({ctx:e}),setTimeout(()=>{Fi({ctx:e})},100)):G({ctx:e})})}function to(e){let t=document.getElementById("chat-container"),n=document.getElementById("chat-iframe");!t||!n||(e?(t.style.display="none",n.style.display="none",u.warn("Preview update blocked due to invalid iframe URL")):t.style.display="")}function Fi({ctx:e}){let t=document.getElementById("chat-iframe");if(t)try{let n=e.getConfig(),o=M(n.iframeUrl)||void 0;u.log("Sending resetConversation to iframe with firstMessage:",n.firstMessage),B.postToIframe({iframe:t,iframeUrl:o,data:{action:"resetConversation",firstMessage:n.firstMessage},reason:"resetConversation"})}catch(n){u.warn("Failed to send reset to iframe:",n)}}function Hi(){let e=document.getElementById("chat-button");if(!e)return;let t=b.getConfig(),o=window.CHATBOT_PREVIEW_MODE===!0?(t==null?void 0:t.previewMode)==="mobile":window.innerWidth<=1e3,i=(o?(t==null?void 0:t.mobileButtonRight)||(t==null?void 0:t.buttonRight)||"10px":(t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),a=(o?(t==null?void 0:t.mobileButtonBottom)||(t==null?void 0:t.buttonBottom)||"27px":(t==null?void 0:t.buttonBottom)||"27px").replace(/\s*!important/g,""),l=o?"-8px":"5px",h=o?"-10px":"15px";e.style.setProperty("right",`calc(${i} + ${l})`,"important"),e.style.setProperty("bottom",`calc(${a} + ${h})`,"important");let g=document.getElementById("chat-container");if(g&&o){let c=((t==null?void 0:t.mobileButtonRight)||(t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),f=((t==null?void 0:t.mobileButtonBottom)||(t==null?void 0:t.buttonBottom)||"20px").replace(/\s*!important/g,"");g.style.setProperty("right",c,"important"),g.style.setProperty("bottom",f,"important")}else if(g){let c=((t==null?void 0:t.buttonRight)||"10px").replace(/\s*!important/g,""),f=((t==null?void 0:t.buttonBottom)||"20px").replace(/\s*!important/g,"");g.style.setProperty("right",c,"important"),g.style.setProperty("bottom",f,"important")}}function $i(){let e=document.getElementById("chat-button");if(!e)return;let t=b.getConfig(),o=window.CHATBOT_PREVIEW_MODE===!0?(t==null?void 0:t.previewMode)==="mobile":window.innerWidth<=1e3,i=o?(t==null?void 0:t.mobileButtonSize)||"65":(t==null?void 0:t.buttonSize)||"74",a=parseFloat(i)||74;e.querySelectorAll("svg, img, dotlottie-player, .di-lottie-player").forEach(p=>{let E=p;E.style.setProperty("width",`${i}px`,"important"),E.style.setProperty("height",`${i}px`,"important")});let h=e.querySelector(".notification-badge");if(h){h.style.setProperty("top",`${a*.014}px`,"important");let p=o?a*.05:a*.12;h.style.setProperty("right",`${p}px`,"important"),h.style.setProperty("min-width",`${a*.27}px`,"important"),h.style.setProperty("height",`${a*.27}px`,"important"),h.style.setProperty("font-size",`${a*.162}px`,"important"),h.style.setProperty("line-height",`${a*.27}px`,"important")}let g=parseFloat(o?(t==null?void 0:t.mobileButtonSize)||"65":(t==null?void 0:t.buttonSize)||"65")||65,c=document.getElementById("minimize-button");if(c){c.style.setProperty("top",`${g*-.154}px`,"important"),c.style.setProperty("right",`${g*-.077}px`,"important");let p=`${g*.37}px`;c.style.setProperty("width",p,"important"),c.style.setProperty("height",p,"important"),c.style.setProperty("min-width",p,"important"),c.style.setProperty("min-height",p,"important"),c.style.setProperty("max-width",p,"important"),c.style.setProperty("max-height",p,"important"),c.style.setProperty("font-size",`${g*.277}px`,"important")}let f=document.getElementById("plus-overlay");if(f){f.style.setProperty("bottom",`${g*-.069}px`,"important"),f.style.setProperty("right",`${g*.154}px`,"important");let p=`${g*.308}px`;f.style.setProperty("width",p,"important"),f.style.setProperty("height",p,"important"),f.style.setProperty("min-width",p,"important"),f.style.setProperty("min-height",p,"important"),f.style.setProperty("max-width",p,"important"),f.style.setProperty("max-height",p,"important"),f.style.setProperty("font-size",`${g*.23}px`,"important")}}function Wi({chatButtonImageUrl:e,mobileChatButtonImageUrl:t}){let n=document.getElementById("chat-button");n&&Wn({chatButton:n,chatButtonImageUrl:e,mobileChatButtonImageUrl:t})}function Gi({config:e}){let t=e.fullscreenMode===!0,n=document.getElementById("chat-button"),o=document.getElementById("chatbase-message-bubbles"),i=document.getElementById("minimize-button"),a=document.getElementById("chat-container"),l=document.getElementById("chat-iframe");t?(n&&(n.style.display="none"),o&&(o.style.display="none"),i&&(i.style.display="none"),a&&a.classList.add("chat-open"),l&&(l.style.display="block")):(n&&(n.style.display=""),l&&l.style.display)}var Vi=["Roboto","Open Sans","Montserrat","Barlow Semi Condensed","Lato"],ji=new Map(Vi.map(e=>[e.toLowerCase(),e]));function no(e){if(!e||typeof e!="string")return null;let t=e.trim().toLowerCase();return t&&ji.get(t)||null}function oo(e){let t=new URL("https://fonts.googleapis.com/css2");return t.searchParams.set("family",`${e}:wght@200;300;400;600;900`),t.searchParams.set("display","swap"),t.toString()}var ke={init:ro};async function ro({ctx:e}){if(b.chatbotInitialized)return;if(!document.body){setTimeout(()=>{ro({ctx:e})},500);return}let t=new URLSearchParams(window.location.search),n=t.get("chat"),o=t.get("message");if(n==="open"||o){localStorage.setItem("chatWindowState","open"),o&&b.setPendingMessage(o),t.delete("chat"),t.delete("message");let c=t.toString(),f=window.location.pathname+(c?"?"+c:"");history.replaceState(null,"",f)}if(document.getElementById("chat-container"))return;b.setChatbotInitialized();let i=await Qn.get({ctx:e});if(b.setCtx(i),i.getConfig()._domainBlocked){u.warn("Chatbot initialization aborted: domain not authorized");return}if(i.getConfig()._invalidIframeUrl){u.warn("Chatbot initialization aborted: invalid iframe URL");return}let a=await Ot({ctx:i});a&&a.variant_id&&b.setSplitTestId(a.variant_id),i.isPreviewMode&&eo({ctx:i});let l=no(i.getConfig().fontFamily);if(l){let c=document.createElement("link");c.rel="stylesheet",c.href=oo(l),document.head.appendChild(c)}function h(){try{let c=Gn.build({ctx:i});if(!c){u.warn("Chatbot DOM build returned null. Skipping render.");return}document.body.appendChild(c),setTimeout(()=>{let f=document.getElementById("chat-container");!i.getConfig().enableMinimizeButton&&f&&f.classList.add("minimize-disabled")},100)}catch(c){u.error("Failed to insert chatbot HTML:",c)}}if(document.body?(h(),ze()):requestAnimationFrame(()=>{document.body?(h(),ze()):setTimeout(h,100)}),Vn.inject({ctx:i}),wn.register({ctx:i}),i.getConfig().fullscreenMode===!0)setTimeout(()=>{let c=document.getElementById("chat-iframe");if(c!=null&&c.contentWindow)try{let f=M(i.getConfig().iframeUrl)||void 0;B.postToIframe({iframe:c,iframeUrl:f,data:{action:"chatOpened"},reason:"chatOpened"})}catch(f){}F({ctx:i}),G({ctx:i}),io({ctx:i})},500);else if(!i.isPreviewMode){let c=window.innerWidth>=1e3,f=localStorage.getItem("chatWindowState");c&&f==="open"?setTimeout(()=>{document.getElementById("chat-button")&&(lt({ctx:i}),io({ctx:i}))},500):c||localStorage.removeItem("chatWindowState"),i.getConfig().enablePopupMessage&&!(c&&f==="open")&&setTimeout(()=>{Jt({ctx:i})},2e3)}i.isPreviewMode||St({ctx:i})}function io({ctx:e}){let t=b.consumePendingMessage();t&&setTimeout(()=>{let n=document.getElementById("chat-iframe");if(!n)return;let o=M(e.getConfig().iframeUrl)||void 0;B.postToIframe({iframe:n,iframeUrl:o,data:{action:"externalMessage",message:t,source:"url-parameter"},reason:"flushPendingMessage"})},1e3)}window.DialogIntelligens=mn();(async function(){await Yi()})();async function Yi(){let e={purchaseTrackingEnabled:!1,enableMinimizeButton:!1,hideChatbotOnMinimize:!1,enablePopupMessage:!1,pagePath:window.location.href,isPhoneView:window.innerWidth<1e3,leadGen:"%%",leadMail:"",leadField1:"Navn",leadField2:"Email",useThumbsRating:!1,ratingTimerDuration:18e3,replaceExclamationWithPeriod:!1,privacyLink:"https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf",freshdeskEmailLabel:"Din email:",freshdeskMessageLabel:"Besked til kundeservice:",freshdeskImageLabel:"Upload billede (valgfrit):",freshdeskChooseFileText:"V\xE6lg fil",freshdeskNoFileText:"Ingen fil valgt",freshdeskSendingText:"Sender...",freshdeskSubmitText:"Send henvendelse",freshdeskEmailRequiredError:"Email er p\xE5kr\xE6vet",freshdeskEmailInvalidError:"Indtast venligst en gyldig email adresse",freshdeskFormErrorText:"Ret venligst fejlene i formularen",freshdeskMessageRequiredError:"Besked er p\xE5kr\xE6vet",freshdeskSubmitErrorText:"Der opstod en fejl",contactConfirmationText:"Tak for din henvendelse",freshdeskConfirmationText:"Tak for din henvendelse",freshdeskSubjectText:"Din henvendelse",inputPlaceholder:"Skriv dit sp\xF8rgsm\xE5l her...",ratingMessage:"Fik du besvaret dit sp\xF8rgsm\xE5l?",productButtonText:"SE PRODUKT",productButtonColor:"",productDiscountPriceColor:"",productButtonPadding:"",productImageHeightMultiplier:1,headerLogoG:"",messageIcon:"",themeColor:"#1a1d56",aiMessageColor:"#e5eaf5",aiMessageTextColor:"#262641",userMessageColor:"",userMessageTextColor:"#ffffff",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opst\xE5 fejl, og at samtalen kan gemmes og behandles. L\xE6s mere i vores privatlivspolitik.",subtitleLinkText:"",subtitleLinkUrl:"",fontFamily:"",enableLivechat:!1,titleG:"Chat Assistent",require_email_before_conversation:!1,splitTestId:null,isTabletView:!1,buttonBottom:"20px",buttonRight:"10px",analyticsUrlsEnabled:!1};b.setConfig(e);let t={isPreviewMode:!!window.CHATBOT_PREVIEW_MODE,getChatbotId:ao,hasSentMessageToChatbot:()=>localStorage.getItem(`hasSentMessage_${ao()}`)==="true",getConfig:()=>Ki(e)},n=t.getChatbotId();if(n)try{let o=await fetch(`${W.getUrl({ctx:t})}/api/integration-config/${n}`);if(o.status===403){u.warn("Domain not authorized for this chatbot. Chatbot will not load.");return}if(o.status===404){u.warn("Chatbot not found or disabled. Chatbot will not load.");return}if(o.status>=500){u.warn("Server error loading chatbot config. Chatbot will not load.");return}}catch(o){u.warn("Failed to check domain authorization:",o)}t.isPreviewMode?u.log("Preview Mode: Initializing chatbot preview"):u.log(`Initializing universal chatbot: ${t.getChatbotId()}`),document.readyState==="complete"?re({ctx:t}):document.readyState==="interactive"?re({ctx:t}):document.addEventListener("DOMContentLoaded",()=>{re({ctx:t})}),setTimeout(()=>{b.chatbotInitialized||re({ctx:t})},2e3)}function Ki(e){var n;let t=b.getConfig();return t||(window.CHATBOT_PREVIEW_MODE&&window.CHATBOT_PREVIEW_CONFIG?{...e,...window.CHATBOT_PREVIEW_CONFIG,iframeUrl:(n=window.CHATBOT_PREVIEW_CONFIG.iframeUrl)!=null?n:"https://chatbot.dialogintelligens.dk"}:e)}function ao(){var t,n;let e=b.getChatbotId();return e||(window.CHATBOT_PREVIEW_MODE&&((t=window.CHATBOT_PREVIEW_CONFIG)!=null&&t.chatbotID)?window.CHATBOT_PREVIEW_CONFIG.chatbotID:(n=qi())!=null?n:"")}function qi(){try{let e=document.currentScript;if(e||(e=Array.from(document.scripts).find(i=>{var a;return(a=i.src)==null?void 0:a.includes("/universal-chatbot.js")})),!e||!e.src)return u.error("Could not find script reference. Make sure script is loaded correctly."),null;let n=new URL(e.src).searchParams.get("id");return n||(u.error('Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"><\/script>'),u.error("Script URL:",e.src),null)}catch(e){return u.error("Failed to extract chatbot ID from script URL:",e),null}}function re({ctx:e}){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{ke.init({ctx:e})},100)}):setTimeout(()=>{ke.init({ctx:e})},100)}})();
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.2 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.2/LICENSE *)
*/

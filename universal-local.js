"use strict";(()=>{var g={isIframeEnlarged:!1,chatbotInitialized:!!window.chatbotInitialized,setChatbotInitialized(){window.chatbotInitialized=!0,this.chatbotInitialized=!0},toggleIsIframeEnlarged(){this.isIframeEnlarged=!this.isIframeEnlarged},getState(){return{isIframeEnlarged:this.isIframeEnlarged,chatbotInitialized:this.chatbotInitialized}}};var i={log:tt,error:ot,warn:et,isEnabled:I};function tt(...t){I()&&console.log(...t)}function et(...t){I()&&console.warn(...t)}function ot(...t){I()&&console.error(...t)}function I(){var t;return!!((t=window.localStorage.getItem("CHATBOT_LOGGING_ENABLED")==="true"||window.CHATBOT_LOGGING_ENABLED)!=null?t:window.CHATBOT_PREVIEW_MODE)}var h={getUrl:nt};function nt({ctx:t}){var e;return t.isPreviewMode&&((e=window.CHATBOT_PREVIEW_CONFIG)!=null&&e.backendUrl)?window.CHATBOT_PREVIEW_CONFIG.backendUrl:"https://egendatabasebackend.onrender.com"}function b({ctx:t}){let e=`visitorKey_${t.getChatbotId()}`,o=localStorage.getItem(e);if(!o){let a=`visitor-${Date.now()}-${Math.floor(Math.random()*1e4)}`;return localStorage.setItem(e,a),a}return o}async function y({ctx:t}){try{let e=b({ctx:t}),o=h.getUrl({ctx:t}),a=await fetch(`${o}/api/split-assign?chatbot_id=${encodeURIComponent(t.getChatbotId())}&visitor_key=${encodeURIComponent(e)}`);if(!a.ok)return null;let n=await a.json();return n&&n.enabled?n:null}catch(e){return i.warn("Split test assignment failed:",e),null}}async function L({variantId:t,ctx:e}){try{let o=b({ctx:e}),a=h.getUrl({ctx:e});await fetch(`${a}/api/split-impression`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatbot_id:e.getChatbotId(),variant_id:t,visitor_key:o,user_id:e.getChatbotUserId()})})}catch(o){i.warn("Failed to log split impression:",o)}}async function f({ctx:t}){var o;let e=document.getElementById("chat-iframe");if(e)try{let a=null,n=await y({ctx:t});n&&n.variant_id&&(a=n.variant_id);let s=t.getConfig(),l={action:"integrationOptions",chatbotID:t.getChatbotId(),...s,splitTestId:a,pagePath:window.location.href,isTabletView:!1,isPhoneView:window.innerWidth<1e3,gptInterface:!1};i.log("\u{1F4E4} Sending configuration to iframe:",{chatbotID:l.chatbotID,action:l.action,themeColor:l.themeColor,borderRadiusMultiplier:l.borderRadiusMultiplier,purchaseTrackingEnabled:l.purchaseTrackingEnabled,leadMail:l.leadMail,toHumanMail:l.toHumanMail,freshdeskGroupId:l.freshdeskGroupId});let r=s.iframeUrl;r&&((o=e.contentWindow)==null||o.postMessage(l,r))}catch(a){i.warn("Failed to send message to iframe:",a)}}function u({ctx:t}){let e=t.getConfig(),o=document.getElementById("chat-iframe");if(!o)return;if(window.CHATBOT_PREVIEW_MODE===!0){e&&e.previewMode==="mobile"?(o.style.width="95vw",o.style.height="90vh",o.style.position="fixed",o.style.left="50%",o.style.top="50%",o.style.transform="translate(-50%, -50%)",o.style.bottom="",o.style.right=""):(o.style.width="calc(375px + 6vw)",o.style.height="calc(450px + 20vh)",o.style.position="fixed",o.style.left="auto",o.style.top="auto",o.style.transform="none",o.style.bottom="3vh",o.style.right="2vw");return}g.isIframeEnlarged?(o.style.width=e.iframeWidthEnlarged||"calc(2 * 45vh + 6vw)",o.style.height=e.iframeHeightEnlarged||"90vh"):window.innerWidth<1e3?(o.style.width=e.iframeWidthMobile||"95vw",o.style.height=e.iframeHeightMobile||"90vh"):(o.style.width=e.iframeWidthDesktop||"calc(50vh + 8vw)",o.style.height=e.iframeHeightDesktop||"90vh"),o.style.position="fixed",window.innerWidth<1e3?(o.style.left="50%",o.style.top="50%",o.style.transform="translate(-50%, -50%)",o.style.bottom="",o.style.right=""):(o.style.left="auto",o.style.top="auto",o.style.transform="none",o.style.bottom="3vh",o.style.right="2vw"),f({ctx:t})}async function x({ctx:t}){let e=document.getElementById("chat-iframe");if(e&&e.style.display!=="none")return;let o=`chatMinimized_${t.getChatbotId()}`;if(localStorage.getItem(o)==="true")return;let a=window.innerWidth<1e3,n=`popupState_${t.getChatbotId()}`,s=`pageVisitCount_${t.getChatbotId()}`,l=`lastPageTime_${t.getChatbotId()}`,r=localStorage.getItem(n);if(!a){if(r==="shown"){it({ctx:t});return}if(r==="dismissed")return;await R({ctx:t}),localStorage.setItem(n,"shown");return}if(a){if(t.getConfig().popupShowOnMobile===!1){i.log("\u{1F50D} Popup disabled on mobile via config");return}if(r==="dismissed")return;let d=`popupShowCount_${t.getChatbotId()}`,c=parseInt(localStorage.getItem(d)||"0"),p=t.getConfig().popupMaxDisplays||2;if(c>=p){localStorage.setItem(n,"dismissed");return}let m=parseInt(localStorage.getItem(s)||"0");m++,localStorage.setItem(s,m.toString());let C=Date.now();localStorage.setItem(l,C.toString()),m>=2&&setTimeout(async()=>{let $=localStorage.getItem(l),J=localStorage.getItem(n),X=localStorage.getItem(`chatMinimized_${t.getChatbotId()}`);$===C.toString()&&J!=="dismissed"&&X!=="true"&&(c++,localStorage.setItem(d,c.toString()),await R({ctx:t}),setTimeout(()=>{let E=document.getElementById("chatbase-message-bubbles");if(E&&E.style.display==="flex"){E.style.display="none";let Q=t.getConfig().popupMaxDisplays||2;c>=Q&&localStorage.setItem(n,"dismissed")}},15e3))},6e3)}}async function R({ctx:t}){let e=document.getElementById("chatbase-message-bubbles"),o=document.getElementById("popup-message-box");if(!e||!o)return;let a=await _({ctx:t})||"Har du brug for hj\xE6lp?",n=null;try{n=await y({ctx:t}),n&&n.variant&&n.variant.config&&n.variant.config.popup_text&&(a=n.variant.config.popup_text)}catch(r){i.warn("Split test check failed:",r)}o.innerHTML=`${a} <span id="funny-smiley">\u{1F60A}</span>`,n&&n.variant_id&&L(n.variant_id);let s=o.textContent.trim().length,l=Math.max(380,Math.min(700,s*3.2+260));e.style.width=l+"px",e.classList.add("animate"),e.style.display="flex",setTimeout(()=>{let r=document.getElementById("funny-smiley");r&&e.style.display==="flex"&&(r.classList.add("blink"),setTimeout(()=>r.classList.remove("blink"),1e3))},2e3),setTimeout(()=>{let r=document.getElementById("funny-smiley");r&&e.style.display==="flex"&&(r.classList.add("jump"),setTimeout(()=>r.classList.remove("jump"),1e3))},12e3)}async function it({ctx:t}){let e=document.getElementById("chatbase-message-bubbles"),o=document.getElementById("popup-message-box");if(!e||!o)return;let a=await _({ctx:t})||"Har du brug for hj\xE6lp?",n=null;try{n=await y({ctx:t}),n&&n.variant&&n.variant.config&&n.variant.config.popup_text&&(a=n.variant.config.popup_text)}catch(r){i.warn("Split test check failed:",r)}o.innerHTML=`${a} <span id="funny-smiley">\u{1F60A}</span>`;let s=o.textContent.trim().length,l=Math.max(380,Math.min(700,s*3.2+260));e.style.width=l+"px",e.style.display="flex"}async function _({ctx:t}){try{let e=b({ctx:t}),o=h.getUrl({ctx:t}),a=await fetch(`${o}/api/popup-message?chatbot_id=${encodeURIComponent(t.getChatbotId())}&visitor_key=${encodeURIComponent(e)}`);if(!a.ok)return null;let n=await a.json();return n&&n.popup_text?String(n.popup_text):null}catch(e){return i.warn("Popup fetch failed:",e),null}}function w({ctx:t}){var l;let e=document.getElementById("chat-button"),o=document.getElementById("chat-iframe"),a=document.getElementById("chatbase-message-bubbles"),n=document.getElementById("minimize-button"),s=document.getElementById("chat-container");if(o.style.display==="none"||!o.style.display){o.style.display="block",e&&(e.style.display="none"),a&&(a.style.display="none"),n&&(n.style.display="block"),s&&(s.classList.add("chat-open"),s.classList.remove("minimized"));let r=`chatMinimized_${t.getChatbotId()}`;localStorage.removeItem(r);let d=`popupState_${t.getChatbotId()}`;localStorage.setItem(d,"dismissed"),window.innerWidth>=1e3&&localStorage.setItem("chatWindowState","open"),u({ctx:t}),f({ctx:t}),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},50),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},150),setTimeout(()=>{window.dispatchEvent(new Event("resize"))},300);try{let p=t.getConfig().iframeUrl;p&&((l=o.contentWindow)==null||l.postMessage({action:"chatOpened"},p))}catch(p){}}else o.style.display="none",e&&(e.style.display="block"),n&&(n.style.display="none"),s&&s.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}var U={register:O};function O({ctx:t}){let e=document.getElementById("chat-button"),o=document.getElementById("chat-iframe"),a=document.getElementById("chatbase-message-bubbles"),n=document.querySelector(".close-popup"),s=document.getElementById("minimize-button");if(!e||!o){i.error("\u274C Critical chatbot elements not found. Retrying in 100ms..."),setTimeout(O,100);return}e&&e.addEventListener("click",()=>w({ctx:t})),a&&a.addEventListener("click",c=>{c.target.closest(".close-popup")||w({ctx:t})}),n&&n.addEventListener("click",c=>{if(c.stopPropagation(),a&&(a.style.display="none"),window.innerWidth<1e3){let m=`popupState_${t.getChatbotId()}`;localStorage.setItem(m,"dismissed")}}),s&&s.addEventListener("click",c=>{c.stopPropagation();let p=document.getElementById("chat-container"),m=document.getElementById("chatbase-message-bubbles");o.style.display="none",e.style.display="block",s.style.display="none",p&&(p.classList.remove("chat-open"),p.classList.add("minimized")),m&&(m.style.display="none");let C=`chatMinimized_${t.getChatbotId()}`;localStorage.setItem(C,"true")});let l=document.getElementById("plus-overlay");l&&l.addEventListener("click",c=>{c.stopPropagation();let p=document.getElementById("chat-container");p&&p.classList.remove("minimized"),s&&(s.style.display="");let m=`chatMinimized_${t.getChatbotId()}`;localStorage.removeItem(m);let C=`popupState_${t.getChatbotId()}`;localStorage.getItem(C)!=="dismissed"&&setTimeout(x,500)});let r=`chatMinimized_${t.getChatbotId()}`;if(localStorage.getItem(r)==="true"){let c=document.getElementById("chat-container");c&&c.classList.add("minimized")}window.addEventListener("message",c=>{var p;if(c.origin===((p=t.getConfig().iframeUrl)==null?void 0:p.replace(/\/$/,"")))if(c.data.action==="toggleSize")g.toggleIsIframeEnlarged(),u({ctx:t});else if(c.data.action==="closeChat"){let m=document.getElementById("chat-container");o.style.display="none",e.style.display="block",s&&(s.style.display="none"),m&&m.classList.remove("chat-open"),localStorage.removeItem("chatWindowState")}else c.data.action==="navigate"&&c.data.url?window.location.href=c.data.url:c.data.action==="setChatbotUserId"&&c.data.userId&&(localStorage.setItem(`userId_${t.getChatbotId()}`,c.data.userId),localStorage.setItem(`hasInteracted_${t.getChatbotId()}`,"true"),i.log("\u2705 Received chatbotUserId from iframe:",t.getChatbotUserId()),i.log("\u2705 User has interacted with chatbot, purchase tracking enabled"))}),window.addEventListener("resize",()=>u({ctx:t})),u({ctx:t});function d(){window.dispatchEvent(new Event("resize"))}setTimeout(d,100),setTimeout(d,300),setTimeout(d,500),setTimeout(d,800),setTimeout(d,1200),o.onload=()=>{f({ctx:t})},setTimeout(()=>{o&&o.style.display==="none"&&f({ctx:t})},2e3)}var W={generate:at};function at({ctx:t}){let e=t.getConfig();return`
        <div id="chat-container">
        <!-- Chat Button -->
        <button id="chat-button">
            ${e.chatButtonImageUrl?`<img src="${e.chatButtonImageUrl}" alt="Chat" />`:`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 651">
            <path d="M0 0 C1.18013672 0.19335938 2.36027344 0.38671875 3.57617188 0.5859375 C59.5538758 10.10655486 113.52671101 33.42516318 157.42724609 69.70361328 C158.96654476 70.97242358 160.52414335 72.21892833 162.08203125 73.46484375 C170.48246311 80.31135664 178.13814279 87.92667924 185.8125 95.5625 C186.61646713 96.35856659 186.61646713 96.35856659 187.43667603 97.17071533 C194.4282304 104.10912388 200.90456545 111.24413176 207 119 C207.85759874 120.06027954 208.71557379 121.12025504 209.57421875 122.1796875 C243.74294324 165.75902188 265.49246848 216.56825559 275 271 C275.18079102 272.03382813 275.36158203 273.06765625 275.54785156 274.1328125 C280.79965418 306.12391236 280.53979773 342.07591201 275 374 C274.80664062 375.13598633 274.61328125 376.27197266 274.4140625 377.44238281 C263.53963247 439.24874978 235.2590019 496.61201036 192.3828125 542.42578125 C190.32466446 544.64925594 188.36675656 546.91531996 186.4375 549.25 C185.633125 550.1575 184.82875 551.065 184 552 C183.34 552 182.68 552 182 552 C182 552.66 182 553.32 182 554 C180.671875 555.33984375 180.671875 555.33984375 178.75 556.9375 C175.24889003 559.90091769 171.89656086 562.97488733 168.5625 566.125 C102.31951852 627.5707075 12.3232672 650.95326951 -76 648 C-85.41882655 647.59353945 -94.70187709 646.53577614 -104 645 C-105.18013672 644.80664062 -106.36027344 644.61328125 -107.57617188 644.4140625 C-184.7741212 631.28433254 -261.89597425 590.08881155 -310 527 C-310.7940625 526.03449219 -311.588125 525.06898438 -312.40625 524.07421875 C-325.77273216 507.77131255 -337.42154229 489.77313074 -347 471 C-347.61367432 469.80141357 -347.61367432 469.80141357 -348.23974609 468.57861328 C-363.35816113 438.71901813 -373.24976624 406.9207696 -379 374 C-379.27118652 372.44925781 -379.27118652 372.44925781 -379.54785156 370.8671875 C-384.79965418 338.87608764 -384.53979773 302.92408799 -379 271 C-378.80664062 269.86401367 -378.61328125 268.72802734 -378.4140625 267.55761719 C-373.76087535 241.11056741 -365.97792782 215.50596918 -355 191 C-354.57992676 190.05962891 -354.15985352 189.11925781 -353.72705078 188.15039062 C-342.14115426 162.49559862 -327.35427257 138.39713257 -309 117 C-308.21753906 116.03449219 -307.43507813 115.06898437 -306.62890625 114.07421875 C-299.87385447 105.82225862 -292.45411117 98.23904328 -284.9375 90.6875 C-284.43088837 90.17571198 -283.92427673 89.66392395 -283.40231323 89.1366272 C-276.6083393 82.28800378 -269.59514163 75.96976514 -262 70 C-261.29625244 69.43692139 -260.59250488 68.87384277 -259.86743164 68.29370117 C-187.84667734 10.91605894 -91.12983552 -15.05196565 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(382,3)"/>
            <path d="M0 0 C0.85706543 0.14985352 1.71413086 0.29970703 2.59716797 0.45410156 C17.0170868 2.98787577 30.77750998 6.55507562 44 13 C45.78664063 13.84691406 45.78664063 13.84691406 47.609375 14.7109375 C87.07502571 33.69100547 119.07180587 65.16520401 134.30859375 106.5546875 C138.9352944 119.76206443 141.53838908 132.98381376 142 147 C142.02723145 147.78149414 142.05446289 148.56298828 142.08251953 149.36816406 C143.37847843 191.86583503 126.64289485 227.83108864 98.3828125 258.875 C80.24181982 277.84308961 58.06574921 290.20862839 34 300 C33.09185547 300.37092773 32.18371094 300.74185547 31.24804688 301.12402344 C-3.93069611 315.36427475 -46.66009235 316.09851389 -83 306 C-84.32462235 305.66053702 -85.65015398 305.32460278 -86.9765625 304.9921875 C-95.63984495 302.80482715 -103.67492263 300.07073573 -111.734375 296.2265625 C-112.39695312 295.91178955 -113.05953125 295.5970166 -113.7421875 295.27270508 C-115.04829648 294.64807878 -116.35064216 294.01550037 -117.6484375 293.3737793 C-123.85344318 290.38101924 -128.12278393 289.36545867 -134.78379822 291.58804321 C-135.84794701 291.96598526 -135.84794701 291.96598526 -136.93359375 292.3515625 C-137.68858658 292.60747162 -138.44357941 292.86338074 -139.22145081 293.12704468 C-141.63134825 293.94705175 -144.03432541 294.78552001 -146.4375 295.625 C-148.01714778 296.16662131 -149.59722321 296.70699707 -151.17773438 297.24609375 C-154.2894114 298.30897685 -157.39837654 299.37929374 -160.50561523 300.45507812 C-165.92871704 302.3276149 -171.37655302 304.12298322 -176.828125 305.91064453 C-179.78869474 306.92742888 -182.67355203 308.04652931 -185.5625 309.25 C-189.0293238 310.68534608 -192.24039325 311.60425192 -196 312 C-194.89219427 305.97755272 -192.99406134 300.21763575 -191.1875 294.375 C-190.67219727 292.68697266 -190.67219727 292.68697266 -190.14648438 290.96484375 C-188.22230087 284.7193701 -186.14744249 278.56607533 -183.87719727 272.43847656 C-182.71912963 269.2192226 -181.78069506 265.98681774 -180.875 262.6875 C-179.95652158 259.35896456 -179.04686551 256.12337112 -177.8203125 252.89453125 C-176.90677616 249.67105301 -176.8933762 248.14055735 -178 245 C-179.52979046 242.81242302 -179.52979046 242.81242302 -181.5 240.6875 C-190.49063046 229.81510967 -196.3134459 216.98660623 -201.28613281 203.87792969 C-201.89813607 202.26796763 -202.53634767 200.66801075 -203.1796875 199.0703125 C-215.64398732 165.73555717 -212.04036962 127.09414809 -197.68359375 95.06298828 C-192.76044566 84.75207878 -187.27888413 74.84643409 -180 66 C-179.58782227 65.49065918 -179.17564453 64.98131836 -178.75097656 64.45654297 C-157.23696408 37.93726169 -129.07892276 16.59824284 -96 7 C-94.51829248 6.48643968 -93.03875988 5.96651621 -91.5625 5.4375 C-61.96364451 -4.2464139 -30.53405019 -5.6251629 0 0 Z " fill="#FEFEFE" transform="translate(364,171)"/>
            <path d="M0 0 C2.23673916 -0.37473011 2.23673916 -0.37473011 5.07969666 -0.3742218 C6.15512222 -0.38123611 7.23054779 -0.38825043 8.33856201 -0.39547729 C9.52355286 -0.38783356 10.7085437 -0.38018982 11.92944336 -0.37231445 C13.17337357 -0.37596512 14.41730377 -0.37961578 15.69892883 -0.38337708 C19.11645637 -0.39010858 22.53344236 -0.38334747 25.95091701 -0.37004495 C29.52363945 -0.35874731 33.09634748 -0.36283671 36.66908264 -0.36479187 C42.67063068 -0.3656755 48.67206591 -0.35458113 54.67358398 -0.33618164 C61.61502757 -0.31502254 68.55630573 -0.31150166 75.49777502 -0.3177436 C82.16985508 -0.32343649 88.84187679 -0.31779188 95.51394844 -0.30657005 C98.35559733 -0.30192207 101.19721057 -0.30105109 104.03886223 -0.3031559 C108.00635829 -0.30538757 111.97369672 -0.29093638 115.94116211 -0.2746582 C117.12412872 -0.27713562 118.30709534 -0.27961304 119.52590942 -0.28216553 C121.14327751 -0.27153831 121.14327751 -0.27153831 122.7933197 -0.26069641 C124.2011492 -0.25761711 124.2011492 -0.25761711 125.6374197 -0.25447559 C128 0 128 0 131 2 C131.30400756 4.7390485 131.41829599 7.20263633 131.375 9.9375 C131.38660156 10.66646484 131.39820313 11.39542969 131.41015625 12.14648438 C131.38094932 17.4572772 131.38094932 17.4572772 129.80051517 19.70885658 C127.3670332 21.45389838 125.77646716 21.37735585 122.7933197 21.38095093 C121.71507431 21.3894104 120.63682892 21.39786987 119.52590942 21.40658569 C118.34294281 21.400513 117.1599762 21.39444031 115.94116211 21.38818359 C114.69547958 21.39344055 113.44979706 21.39869751 112.16636658 21.40411377 C108.74897219 21.41506662 105.33212159 21.41248392 101.91475749 21.40297651 C98.34156604 21.39538848 94.76839804 21.40242298 91.19520569 21.40713501 C85.19544291 21.41259437 79.19579089 21.40539554 73.19604492 21.39111328 C66.25394891 21.3747789 59.31211711 21.38008011 52.37002748 21.3965925 C46.41412335 21.41019343 40.45829888 21.41213411 34.50238425 21.40427649 C30.94315957 21.39959321 27.38405921 21.39899308 23.82484245 21.40888596 C19.85960438 21.41913744 15.89466388 21.40494096 11.92944336 21.38818359 C10.74445251 21.39425629 9.55946167 21.40032898 8.33856201 21.40658569 C7.26313644 21.39812622 6.18771088 21.38966675 5.07969666 21.38095093 C4.14152068 21.37981985 3.20334471 21.37868877 2.23673916 21.37752342 C1.12955328 21.19064933 1.12955328 21.19064933 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(234,301)"/>
            <path d="M0 0 C2.42222595 -0.3742218 2.42222595 -0.3742218 5.50366211 -0.37231445 C6.65503159 -0.37854324 7.80640106 -0.38477203 8.99266052 -0.39118958 C10.24160599 -0.38197983 11.49055145 -0.37277008 12.77734375 -0.36328125 C14.05476944 -0.36377975 15.33219513 -0.36427826 16.64833069 -0.36479187 C19.35464344 -0.36244729 22.06017943 -0.35426448 24.76635742 -0.33618164 C28.23451479 -0.3135166 31.70223634 -0.31294556 35.17044735 -0.31969929 C38.47694563 -0.32384598 41.78336662 -0.31186453 45.08984375 -0.30078125 C46.33676498 -0.30169266 47.58368622 -0.30260406 48.86839294 -0.30354309 C50.6001754 -0.28924507 50.6001754 -0.28924507 52.36694336 -0.2746582 C53.38461288 -0.27005081 54.40228241 -0.26544342 55.45079041 -0.26069641 C58 0 58 0 61 2 C61.30400756 4.7390485 61.41829599 7.20263633 61.375 9.9375 C61.38660156 10.66646484 61.39820313 11.39542969 61.41015625 12.14648438 C61.38101687 17.44499419 61.38101687 17.44499419 59.8271637 19.70840454 C57.27876677 21.50982929 55.47369442 21.38089721 52.36694336 21.38818359 C51.21242172 21.39764008 50.05790009 21.40709656 48.86839294 21.4168396 C47.62147171 21.41076691 46.37455048 21.40469421 45.08984375 21.3984375 C43.81146133 21.40130768 42.53307892 21.40417786 41.21595764 21.40713501 C38.51141991 21.4091782 35.80769347 21.40513451 33.10327148 21.39111328 C29.63381046 21.37400378 26.16504473 21.38387422 22.69560909 21.40183067 C19.38949547 21.41526339 16.08346643 21.40586585 12.77734375 21.3984375 C10.90392555 21.40754654 10.90392555 21.40754654 8.99266052 21.4168396 C7.84129105 21.40738312 6.68992157 21.39792664 5.50366211 21.38818359 C3.97835121 21.38460342 3.97835121 21.38460342 2.42222595 21.38095093 C1.62289139 21.25523712 0.82355682 21.12952332 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #00FF00)" transform="translate(234,344)"/>
            <!-- Notification badge -->
            <g id="notification-badge" class="notification-badge">
                <circle cx="605" cy="105" r="115"/>
                <text x="605" y="105" class="notification-badge-text">1</text>
            </g>
            </svg>`}
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
        src="${e.iframeUrl||"https://skalerbartprodukt.onrender.com"}"
        style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: calc(${e.zIndex||190} + 39810);">
        </iframe>
    `}var H={inject:rt};function rt({ctx:t}){let e=t.getConfig(),o=e.productButtonColor||e.themeColor||"#1a1d56",a=`
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
        z-index: ${e.zIndex||190};
        transition: all 0.3s ease;
        }
        #chat-container #chat-button {
        cursor: pointer !important;
        background: none !important;
        border: none !important;
        position: fixed !important;
        z-index: calc(${e.zIndex||190} + 10) !important;
        right: calc(${(e.buttonRight||"10px").replace(/\s*!important/g,"")} + 5px) !important;
        bottom: calc(${(e.buttonBottom||"27px").replace(/\s*!important/g,"")} + 15px) !important;
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
        z-index: calc(${e.zIndex||190} + 9) !important;
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
        z-index: calc(${e.zIndex||190} + 20) !important;
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
        bottom: calc(${(e.buttonBottom||"20px").replace(/\s*!important/g,"")} + 5px);
        right: calc(${(e.buttonRight||"10px").replace(/\s*!important/g,"")} + 45px);
        border-radius: 20px;
        font-family: 'Montserrat', sans-serif;
        font-size: 20px;
        z-index: calc(${e.zIndex||190} + 8);
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
        z-index: calc(${e.zIndex||190} + 999810);
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
            bottom: calc(${(e.buttonBottom||"20px").replace(/\s*!important/g,"")} + -20px);
            right: calc(${(e.buttonRight||"10px").replace(/\s*!important/g,"")} + 25px);
            scale: 0.52;
            z-index: calc(${e.zIndex} + 7);

        }

        #chat-container #chat-button {
            z-index: calc(${e.zIndex||190} + 8) !important;
            right: calc(${(e.buttonRight||"10px").replace(/\s*!important/g,"")} + -8px) !important;
            bottom: calc(${(e.buttonBottom||"27px").replace(/\s*!important/g,"")} + -10px) !important;
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
        --icon-color: ${o};
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
    `,n=document.createElement("style");n.appendChild(document.createTextNode(a)),document.head.appendChild(n)}var D={get:st};async function st({ctx:t}){if(t.isPreviewMode)return t;let e=await lt({ctx:t});return{isPreviewMode:t.isPreviewMode,getChatbotId:t.getChatbotId,getChatbotUserId:t.getChatbotUserId,hasInteractedWithChatbot:t.hasInteractedWithChatbot,getConfig:()=>e}}async function lt({ctx:t}){try{i.log(`\u{1F4E1} Loading configuration for chatbot: ${t.getChatbotId()}`);let e=await fetch(`${h.getUrl({ctx:t})}/api/integration-config/${t.getChatbotId()}`);if(!e.ok)throw new Error(`Failed to load configuration: ${e.status} ${e.statusText}`);let o=await e.json();return i.log("\u2705 Configuration loaded successfully"),{...t.getConfig(),...o}}catch(e){return i.error("\u274C Error loading chatbot config:",e),{...t.getConfig(),themeColor:"#1a1d56",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Vores virtuelle assistent er h\xE4r for at hj\xE6lpe dig.",titleG:"Chat Assistent",enableMinimizeButton:!0,enablePopupMessage:!0}}}function T(){let t=document.getElementById("chat-button");t&&t.addEventListener("click",()=>{let e=document.getElementById("notification-badge");e&&e.remove(),i.log("\u{1F4AC} Chatbot opened \u2014 notification badge removed.")})}function k({ctx:t}){i.log("\u{1F6D2} Purchase tracking check:",{enabled:t.getConfig().purchaseTrackingEnabled,isCheckoutPage:v({ctx:t}),isCheckoutConfirmationPage:M({ctx:t}),userId:t.getChatbotUserId()||"waiting for iframe..."}),t.getConfig().purchaseTrackingEnabled&&(v({ctx:t})||M({ctx:t}))?(i.log("\u{1F6D2} On checkout page - will check for purchase after iframe loads and sends userId..."),setTimeout(()=>P({ctx:t}),2e3),setTimeout(()=>P({ctx:t}),4e3),setTimeout(()=>P({ctx:t}),6e3)):t.getConfig().purchaseTrackingEnabled&&t.hasInteractedWithChatbot()?(i.log("\u{1F6D2} Not checkout page. Tracking cart price every 5 seconds."),setInterval(()=>A({ctx:t}),5e3)):i.log("\u{1F6D2} Purchase tracking disabled")}function M({ctx:t}){if(i.log("\u{1F50D} Checking if current page is confirmation page:",window.location.href),t.isPreviewMode&&t.getConfig().purchaseTrackingEnabled&&t.getConfig().checkoutConfirmationPagePatterns)return!0;let e=t.getConfig().checkoutConfirmationPagePatterns;return e?F({pagePatterns:e}):(i.log("Confirmation page not set: ",e),!1)}function v({ctx:t}){var e;return i.log("\u{1F50D} Checking if current page is checkout:",window.location.href),t.isPreviewMode&&t.getConfig().purchaseTrackingEnabled?!0:F({pagePatterns:(e=t.getConfig().checkoutPagePatterns)!=null?e:""})?(i.log("Is checkout page check: true"),!0):(i.log("Is checkout page check: false"),!1)}function F({pagePatterns:t}){if(!t)return!1;i.log("Checking for page patterns match: ",t);let e=t.split(",").map(o=>o.trim()).filter(Boolean);if(e)try{return e.some(o=>{if(o.startsWith("/")&&o.endsWith("/")){let a=window.location.pathname.replace(/\/$/,""),n=a===o.replace(/\/$/,"");return i.log(`\u{1F50D} Path match check: "${a}" === "${o}" ? ${n}`),n}else{let a=window.location.href.includes(o);return i.log(`\u{1F50D} Substring match check: "${window.location.href}" includes "${o}" ? ${a}`),a}})}catch(o){i.error("Error checking page patterns: ",o)}return!1}function P({ctx:t}){if(!t.getChatbotUserId()){i.log("\u{1F6D2} No userId yet, waiting for iframe to send it...");return}if(!t.hasInteractedWithChatbot()){i.log("\u{1F6D2} User has not interacted with chatbot, skipping purchase tracking");return}if(N({ctx:t})){i.log("\u{1F6D2} Purchase already reported for user:",t.getChatbotUserId());return}if(v({ctx:t})&&A({ctx:t}),v({ctx:t})&&!t.getConfig().checkoutConfirmationPagePatterns&&ct({ctx:t}),M({ctx:t})){i.log("Track purchase at checkout confirmation");let e=localStorage.getItem(z(t.getChatbotUserId()));e&&G({amount:e,ctx:t})}}function A({ctx:t}){let{checkoutPriceSelector:e}=t.getConfig(),o=t.isPreviewMode&&e?"#purchase-tracking-checkout-price":e;if(!o)return;let a=j({selector:o,ctx:t});if(!a)return;let n=pt({priceText:a.textContent.trim(),ctx:t});n&&localStorage.setItem(z(t.getChatbotUserId()),String(n))}function ct({ctx:t}){i.log("Track purchase at checkout");let e=dt({ctx:t});if(e&&!e.length){i.warn("\u26A0\uFE0F Missing purchase selector configuration");return}let o=e.map(a=>j({selector:a,ctx:t})).filter(a=>!!a);if(e.length!==o.length){i.warn(`\u26A0\uFE0F Expected ${e.length} selectors found ${o.length} selectors`);return}i.log(`\u2705 Tracking purchase button(s): ${e}`),o.forEach(a=>{a.addEventListener("click",async()=>{let n=localStorage.getItem(z(t.getChatbotUserId()));i.log(`\u2705 Tracked purchase amount: ${n}`),n&&G({amount:n,ctx:t})})})}function j({selector:t,ctx:e}){let o=t?t.trim():"";try{return i.log("Searching for selector: ",o),document.querySelector(o)}catch(a){return i.warn("\u26A0\uFE0F Found invalid selector:",o),null}}function dt({ctx:t}){let{checkoutPurchaseSelector:e}=t.getConfig();if(!e)return[""];if(t.isPreviewMode&&e)return["#purchase-tracking-checkout-purchase","#purchase-tracking-checkout-purchase-alternative"];try{let o=JSON.parse(e);return Array.isArray(o)?o:[o]}catch(o){return[e]}}function G({amount:t,ctx:e}){if(N({ctx:e})){i.log("\u{1F6D2} Purchase already reported for user:",e.getChatbotUserId());return}let o=h.getUrl({ctx:e}),a=e.getConfig().currency||"DKK";i.log("\u{1F6D2} Reporting purchase to backend:",{userId:e.getChatbotUserId(),chatbotId:e.getChatbotId(),amount:t,currency:a,endpoint:`${o}/purchases`});try{let n=new URLSearchParams({user_id:e.getChatbotUserId(),chatbot_id:e.getChatbotId(),amount:t,currency:a});navigator.sendBeacon(`${o}/purchases`,n)?(localStorage.setItem(V(e.getChatbotUserId()),"true"),i.log({ctx:e},"\u2705 Purchase reported successfully (queued via Beacon)")):i.error("\u274C Failed to queue purchase beacon")}catch(n){i.error("\u274C Failed to send purchase beacon:",n)}}function pt({priceText:t,ctx:e}){i.log(`\u{1F6D2} Parsing price text: "${t}"`);let o=t.match(/(\d{1,3}(?:\.\d{3})*),(\d{2})\s*kr\.?/gi),a=t.match(/\d[\d.,]*/g);i.log("\u{1F6D2} Danish matches:",o),i.log("\u{1F6D2} Regular matches:",a);let n=[];o&&(n=n.concat(o)),a&&(n=n.concat(a));let s=0;if(n&&n.length>0)for(let l of n){i.log(`\u{1F6D2} Processing match: "${l}"`);let r=l;if(l.includes("kr"))r=l.replace(/\s*kr\.?/gi,"").trim(),r.includes(".")&&r.includes(",")?r=r.replace(/\./g,"").replace(",","."):r.includes(",")&&(r=r.replace(",","."));else if(r=l.replace(/[^\d.,]/g,""),r.includes(".")&&r.includes(",")){let c=r.lastIndexOf(",");r.lastIndexOf(".")<c&&r.length-c-1===2?r=r.replace(/\./g,"").replace(",","."):r=r.replace(/,/g,"")}else if(r.includes(",")){let c=r.split(",");c.length===2&&c[1].length<=2?r=r.replace(",","."):r=r.replace(/,/g,"")}i.log(`\u{1F6D2} Cleaned match: "${r}"`);let d=parseFloat(r);i.log(`\u{1F6D2} Parsed number: ${d}`),!isNaN(d)&&d>s&&(s=d)}return s>0?s:null}function N({ctx:t}){return!!localStorage.getItem(V(t.getChatbotUserId()))}function V(t){let e=new Date,o=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return`purchaseReported_${`${o}-${a}-${n}`}_${t}`}function z(t){return`purchaseTotalPriceKey_${t}`}function K({ctx:t}){window.addEventListener("previewConfigUpdate",e=>{let o=e;i.log("\u{1F504} Preview: Received config update event",o.detail),o.detail.chatButtonImageUrl!==void 0&&mt({chatButtonImageUrl:o.detail.chatButtonImageUrl}),u({ctx:t}),k({ctx:t})})}function mt({chatButtonImageUrl:t}){let e=document.getElementById("chat-button");if(!e)return;let o=t?`<img src="${t}" alt="Chat" />`:`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 651">
            <path d="M0 0 C1.18013672 0.19335938 2.36027344 0.38671875 3.57617188 0.5859375 C59.5538758 10.10655486 113.52671101 33.42516318 157.42724609 69.70361328 C158.96654476 70.97242358 160.52414335 72.21892833 162.08203125 73.46484375 C170.48246311 80.31135664 178.13814279 87.92667924 185.8125 95.5625 C186.61646713 96.35856659 186.61646713 96.35856659 187.43667603 97.17071533 C194.4282304 104.10912388 200.90456545 111.24413176 207 119 C207.85759874 120.06027954 208.71557379 121.12025504 209.57421875 122.1796875 C243.74294324 165.75902188 265.49246848 216.56825559 275 271 C275.18079102 272.03382813 275.36158203 273.06765625 275.54785156 274.1328125 C280.79965418 306.12391236 280.53979773 342.07591201 275 374 C274.80664062 375.13598633 274.61328125 376.27197266 274.4140625 377.44238281 C263.53963247 439.24874978 235.2590019 496.61201036 192.3828125 542.42578125 C190.32466446 544.64925594 188.36675656 546.91531996 186.4375 549.25 C185.633125 550.1575 184.82875 551.065 184 552 C183.34 552 182.68 552 182 552 C182 552.66 182 553.32 182 554 C180.671875 555.33984375 180.671875 555.33984375 178.75 556.9375 C175.24889003 559.90091769 171.89656086 562.97488733 168.5625 566.125 C102.31951852 627.5707075 12.3232672 650.95326951 -76 648 C-85.41882655 647.59353945 -94.70187709 646.53577614 -104 645 C-105.18013672 644.80664062 -106.36027344 644.61328125 -107.57617188 644.4140625 C-184.7741212 631.28433254 -261.89597425 590.08881155 -310 527 C-310.7940625 526.03449219 -311.588125 525.06898438 -312.40625 524.07421875 C-325.77273216 507.77131255 -337.42154229 489.77313074 -347 471 C-347.61367432 469.80141357 -347.61367432 469.80141357 -348.23974609 468.57861328 C-363.35816113 438.71901813 -373.24976624 406.9207696 -379 374 C-379.27118652 372.44925781 -379.27118652 372.44925781 -379.54785156 370.8671875 C-384.79965418 338.87608764 -384.53979773 302.92408799 -379 271 C-378.80664062 269.86401367 -378.61328125 268.72802734 -378.4140625 267.55761719 C-373.76087535 241.11056741 -365.97792782 215.50596918 -355 191 C-354.57992676 190.05962891 -354.15985352 189.11925781 -353.72705078 188.15039062 C-342.14115426 162.49559862 -327.35427257 138.39713257 -309 117 C-308.21753906 116.03449219 -307.43507813 115.06898437 -306.62890625 114.07421875 C-299.87385447 105.82225862 -292.45411117 98.23904328 -284.9375 90.6875 C-284.43088837 90.17571198 -283.92427673 89.66392395 -283.40231323 89.1366272 C-276.6083393 82.28800378 -269.59514163 75.96976514 -262 70 C-261.29625244 69.43692139 -260.59250488 68.87384277 -259.86743164 68.29370117 C-187.84667734 10.91605894 -91.12983552 -15.05196565 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(382,3)"/>
            <path d="M0 0 C0.85706543 0.14985352 1.71413086 0.29970703 2.59716797 0.45410156 C17.0170868 2.98787577 30.77750998 6.55507562 44 13 C45.78664063 13.84691406 45.78664063 13.84691406 47.609375 14.7109375 C87.07502571 33.69100547 119.07180587 65.16520401 134.30859375 106.5546875 C138.9352944 119.76206443 141.53838908 132.98381376 142 147 C142.02723145 147.78149414 142.05446289 148.56298828 142.08251953 149.36816406 C143.37847843 191.86583503 126.64289485 227.83108864 98.3828125 258.875 C80.24181982 277.84308961 58.06574921 290.20862839 34 300 C33.09185547 300.37092773 32.18371094 300.74185547 31.24804688 301.12402344 C-3.93069611 315.36427475 -46.66009235 316.09851389 -83 306 C-84.32462235 305.66053702 -85.65015398 305.32460278 -86.9765625 304.9921875 C-95.63984495 302.80482715 -103.67492263 300.07073573 -111.734375 296.2265625 C-112.39695312 295.91178955 -113.05953125 295.5970166 -113.7421875 295.27270508 C-115.04829648 294.64807878 -116.35064216 294.01550037 -117.6484375 293.3737793 C-123.85344318 290.38101924 -128.12278393 289.36545867 -134.78379822 291.58804321 C-135.84794701 291.96598526 -135.84794701 291.96598526 -136.93359375 292.3515625 C-137.68858658 292.60747162 -138.44357941 292.86338074 -139.22145081 293.12704468 C-141.63134825 293.94705175 -144.03432541 294.78552001 -146.4375 295.625 C-148.01714778 296.16662131 -149.59722321 296.70699707 -151.17773438 297.24609375 C-154.2894114 298.30897685 -157.39837654 299.37929374 -160.50561523 300.45507812 C-165.92871704 302.3276149 -171.37655302 304.12298322 -176.828125 305.91064453 C-179.78869474 306.92742888 -182.67355203 308.04652931 -185.5625 309.25 C-189.0293238 310.68534608 -192.24039325 311.60425192 -196 312 C-194.89219427 305.97755272 -192.99406134 300.21763575 -191.1875 294.375 C-190.67219727 292.68697266 -190.67219727 292.68697266 -190.14648438 290.96484375 C-188.22230087 284.7193701 -186.14744249 278.56607533 -183.87719727 272.43847656 C-182.71912963 269.2192226 -181.78069506 265.98681774 -180.875 262.6875 C-179.95652158 259.35896456 -179.04686551 256.12337112 -177.8203125 252.89453125 C-176.90677616 249.67105301 -176.8933762 248.14055735 -178 245 C-179.52979046 242.81242302 -179.52979046 242.81242302 -181.5 240.6875 C-190.49063046 229.81510967 -196.3134459 216.98660623 -201.28613281 203.87792969 C-201.89813607 202.26796763 -202.53634767 200.66801075 -203.1796875 199.0703125 C-215.64398732 165.73555717 -212.04036962 127.09414809 -197.68359375 95.06298828 C-192.76044566 84.75207878 -187.27888413 74.84643409 -180 66 C-179.58782227 65.49065918 -179.17564453 64.98131836 -178.75097656 64.45654297 C-157.23696408 37.93726169 -129.07892276 16.59824284 -96 7 C-94.51829248 6.48643968 -93.03875988 5.96651621 -91.5625 5.4375 C-61.96364451 -4.2464139 -30.53405019 -5.6251629 0 0 Z " fill="#FEFEFE" transform="translate(364,171)"/>
            <path d="M0 0 C2.23673916 -0.37473011 2.23673916 -0.37473011 5.07969666 -0.3742218 C6.15512222 -0.38123611 7.23054779 -0.38825043 8.33856201 -0.39547729 C9.52355286 -0.38783356 10.7085437 -0.38018982 11.92944336 -0.37231445 C13.17337357 -0.37596512 14.41730377 -0.37961578 15.69892883 -0.38337708 C19.11645637 -0.39010858 22.53344236 -0.38334747 25.95091701 -0.37004495 C29.52363945 -0.35874731 33.09634748 -0.36283671 36.66908264 -0.36479187 C42.67063068 -0.3656755 48.67206591 -0.35458113 54.67358398 -0.33618164 C61.61502757 -0.31502254 68.55630573 -0.31150166 75.49777502 -0.3177436 C82.16985508 -0.32343649 88.84187679 -0.31779188 95.51394844 -0.30657005 C98.35559733 -0.30192207 101.19721057 -0.30105109 104.03886223 -0.3031559 C108.00635829 -0.30538757 111.97369672 -0.29093638 115.94116211 -0.2746582 C117.12412872 -0.27713562 118.30709534 -0.27961304 119.52590942 -0.28216553 C121.14327751 -0.27153831 121.14327751 -0.27153831 122.7933197 -0.26069641 C124.2011492 -0.25761711 124.2011492 -0.25761711 125.6374197 -0.25447559 C128 0 128 0 131 2 C131.30400756 4.7390485 131.41829599 7.20263633 131.375 9.9375 C131.38660156 10.66646484 131.39820313 11.39542969 131.41015625 12.14648438 C131.38094932 17.4572772 131.38094932 17.4572772 129.80051517 19.70885658 C127.3670332 21.45389838 125.77646716 21.37735585 122.7933197 21.38095093 C121.71507431 21.3894104 120.63682892 21.39786987 119.52590942 21.40658569 C118.34294281 21.400513 117.1599762 21.39444031 115.94116211 21.38818359 C114.69547958 21.39344055 113.44979706 21.39869751 112.16636658 21.40411377 C108.74897219 21.41506662 105.33212159 21.41248392 101.91475749 21.40297651 C98.34156604 21.39538848 94.76839804 21.40242298 91.19520569 21.40713501 C85.19544291 21.41259437 79.19579089 21.40539554 73.19604492 21.39111328 C66.25394891 21.3747789 59.31211711 21.38008011 52.37002748 21.3965925 C46.41412335 21.41019343 40.45829888 21.41213411 34.50238425 21.40427649 C30.94315957 21.39959321 27.38405921 21.39899308 23.82484245 21.40888596 C19.85960438 21.41913744 15.89466388 21.40494096 11.92944336 21.38818359 C10.74445251 21.39425629 9.55946167 21.40032898 8.33856201 21.40658569 C7.26313644 21.39812622 6.18771088 21.38966675 5.07969666 21.38095093 C4.14152068 21.37981985 3.20334471 21.37868877 2.23673916 21.37752342 C1.12955328 21.19064933 1.12955328 21.19064933 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(234,301)"/>
            <path d="M0 0 C2.42222595 -0.3742218 2.42222595 -0.3742218 5.50366211 -0.37231445 C6.65503159 -0.37854324 7.80640106 -0.38477203 8.99266052 -0.39118958 C10.24160599 -0.38197983 11.49055145 -0.37277008 12.77734375 -0.36328125 C14.05476944 -0.36377975 15.33219513 -0.36427826 16.64833069 -0.36479187 C19.35464344 -0.36244729 22.06017943 -0.35426448 24.76635742 -0.33618164 C28.23451479 -0.3135166 31.70223634 -0.31294556 35.17044735 -0.31969929 C38.47694563 -0.32384598 41.78336662 -0.31186453 45.08984375 -0.30078125 C46.33676498 -0.30169266 47.58368622 -0.30260406 48.86839294 -0.30354309 C50.6001754 -0.28924507 50.6001754 -0.28924507 52.36694336 -0.2746582 C53.38461288 -0.27005081 54.40228241 -0.26544342 55.45079041 -0.26069641 C58 0 58 0 61 2 C61.30400756 4.7390485 61.41829599 7.20263633 61.375 9.9375 C61.38660156 10.66646484 61.39820313 11.39542969 61.41015625 12.14648438 C61.38101687 17.44499419 61.38101687 17.44499419 59.8271637 19.70840454 C57.27876677 21.50982929 55.47369442 21.38089721 52.36694336 21.38818359 C51.21242172 21.39764008 50.05790009 21.40709656 48.86839294 21.4168396 C47.62147171 21.41076691 46.37455048 21.40469421 45.08984375 21.3984375 C43.81146133 21.40130768 42.53307892 21.40417786 41.21595764 21.40713501 C38.51141991 21.4091782 35.80769347 21.40513451 33.10327148 21.39111328 C29.63381046 21.37400378 26.16504473 21.38387422 22.69560909 21.40183067 C19.38949547 21.41526339 16.08346643 21.40586585 12.77734375 21.3984375 C10.90392555 21.40754654 10.90392555 21.40754654 8.99266052 21.4168396 C7.84129105 21.40738312 6.68992157 21.39792664 5.50366211 21.38818359 C3.97835121 21.38460342 3.97835121 21.38460342 2.42222595 21.38095093 C1.62289139 21.25523712 0.82355682 21.12952332 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #00FF00)" transform="translate(234,344)"/>
            <!-- Notification badge -->
            <g id="notification-badge" class="notification-badge">
              <circle cx="605" cy="105" r="115"/>
              <text x="605" y="105" class="notification-badge-text">1</text>
            </g>
          </svg>`;e.innerHTML=o}var B={init:q};async function q({ctx:t}){if(g.chatbotInitialized)return;if(!document.body){setTimeout(q,500);return}if(new URLSearchParams(window.location.search).get("chat")==="open"&&(localStorage.setItem("chatWindowState","open"),history.replaceState(null,"",window.location.pathname)),document.getElementById("chat-container"))return;g.setChatbotInitialized();let o=await D.get({ctx:t});o.isPreviewMode&&K({ctx:o}),i.log("\u{1F194} Initial userId from localStorage:",o.getChatbotUserId()||"none (waiting for iframe)"),i.log("\u{1F194} Has interacted with chatbot:",o.hasInteractedWithChatbot());let a=o.getConfig().fontFamily;if(a){let d=document.createElement("link");d.rel="stylesheet",d.href=`https://fonts.googleapis.com/css2?family=${a.replace(/ /g,"+")}:wght@200;300;400;600;900&display=swap`,document.head.appendChild(d)}let n=W.generate({ctx:o});H.inject({ctx:o});function s(){try{document.body.insertAdjacentHTML("beforeend",n),setTimeout(()=>{let d=document.getElementById("chat-container");!o.getConfig().enableMinimizeButton&&d&&d.classList.add("minimize-disabled")},100)}catch(d){i.error("Failed to insert chatbot HTML:",d)}}document.body?(s(),T()):requestAnimationFrame(()=>{document.body?(s(),T()):setTimeout(s,100)}),U.register({ctx:o});let l=window.innerWidth>=1e3,r=localStorage.getItem("chatWindowState");l&&r==="open"?(i.log("\u{1F504} Restoring chat window state on desktop"),setTimeout(()=>{document.getElementById("chat-button")&&w({ctx:o})},500)):l||localStorage.removeItem("chatWindowState"),o.getConfig().enablePopupMessage!==!1&&!(l&&r==="open")&&setTimeout(()=>x({ctx:o}),2e3),o.isPreviewMode||k({ctx:o}),i.log("\u2705 Chatbot initialized successfully")}(async function(){await gt()})();async function gt(){let t={purchaseTrackingEnabled:!1,enableMinimizeButton:!1,enablePopupMessage:!1,pagePath:window.location.href,isPhoneView:window.innerWidth<1e3,leadGen:"%%",leadMail:"",leadField1:"Navn",leadField2:"Email",useThumbsRating:!1,ratingTimerDuration:18e3,replaceExclamationWithPeriod:!1,privacyLink:"https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/Privatlivspolitik-AI-Chatbot.pdf",freshdeskEmailLabel:"Din email:",freshdeskMessageLabel:"Besked til kundeservice:",freshdeskImageLabel:"Upload billede (valgfrit):",freshdeskChooseFileText:"V\xE6lg fil",freshdeskNoFileText:"Ingen fil valgt",freshdeskSendingText:"Sender...",freshdeskSubmitText:"Send henvendelse",freshdeskEmailRequiredError:"Email er p\xE5kr\xE6vet",freshdeskEmailInvalidError:"Indtast venligst en gyldig email adresse",freshdeskFormErrorText:"Ret venligst fejlene i formularen",freshdeskMessageRequiredError:"Besked er p\xE5kr\xE6vet",freshdeskSubmitErrorText:"Der opstod en fejl",contactConfirmationText:"Tak for din henvendelse",freshdeskConfirmationText:"Tak for din henvendelse",freshdeskSubjectText:"Din henvendelse",inputPlaceholder:"Skriv dit sp\xF8rgsm\xE5l her...",ratingMessage:"Fik du besvaret dit sp\xF8rgsm\xE5l?",productButtonText:"SE PRODUKT",productButtonColor:"",productButtonPadding:"",productImageHeightMultiplier:1,headerLogoG:"",messageIcon:"",themeColor:"#1a1d56",aiMessageColor:"#e5eaf5",aiMessageTextColor:"#262641",borderRadiusMultiplier:1,headerTitleG:"",headerSubtitleG:"Du skriver med en kunstig intelligens. Ved at bruge denne chatbot accepterer du at der kan opst\xE5 fejl, og at samtalen kan gemmes og behandles. L\xE6s mere i vores privatlivspolitik.",subtitleLinkText:"",subtitleLinkUrl:"",fontFamily:"",enableLivechat:!1,titleG:"Chat Assistent",require_email_before_conversation:!1,splitTestId:null,isTabletView:!1,buttonBottom:"20px",buttonRight:"10px"},e={isPreviewMode:!!window.CHATBOT_PREVIEW_MODE,getChatbotId:Y,getChatbotUserId:ht,hasInteractedWithChatbot:()=>{var o;return localStorage.getItem(`hasInteracted_${(o=Z())!=null?o:""}`)==="true"},getConfig:()=>{var o;return window.CHATBOT_PREVIEW_MODE&&window.CHATBOT_PREVIEW_CONFIG?{...t,...window.CHATBOT_PREVIEW_CONFIG,iframeUrl:(o=window.CHATBOT_PREVIEW_CONFIG.iframeUrl)!=null?o:"https://skalerbartprodukt.onrender.com"}:t}};e.isPreviewMode?i.log("\u{1F50D} Preview Mode: Initializing chatbot preview"):i.log(`\u{1F916} Initializing universal chatbot: ${e.getChatbotId()}`),document.readyState==="complete"?S({ctx:e}):document.readyState==="interactive"?S({ctx:e}):document.addEventListener("DOMContentLoaded",()=>S({ctx:e})),setTimeout(()=>{g.chatbotInitialized||S({ctx:e})},2e3)}function ht(){let t=`userId_${Y()}`;return localStorage.getItem(t)||""}function Y(){var e;let t=(e=Z())!=null?e:"";return window.CHATBOT_PREVIEW_MODE&&window.CHATBOT_PREVIEW_CONFIG&&window.CHATBOT_PREVIEW_CONFIG.chatbotID?window.CHATBOT_PREVIEW_CONFIG.chatbotID:t}function Z(){try{let t=document.currentScript;if(t||(t=Array.from(document.scripts).find(n=>{var s;return(s=n.src)==null?void 0:s.includes("/universal-chatbot.js")})),!t||!t.src)return i.error("\u274C Could not find script reference. Make sure script is loaded correctly."),null;let o=new URL(t.src).searchParams.get("id");return o||(i.error('\u274C Chatbot ID not provided in script URL. Usage: <script src="universal-chatbot.js?id=YOUR_CHATBOT_ID"><\/script>'),i.error("Script URL:",t.src),null)}catch(t){return i.error("\u274C Failed to extract chatbot ID from script URL:",t),null}}function S({ctx:t}){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",async()=>{setTimeout(async()=>await B.init({ctx:t}),100)}):setTimeout(async()=>await B.init({ctx:t}),100)}})();

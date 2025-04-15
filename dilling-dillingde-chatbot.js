function initChatbot() {
  // Check if already initialized
  if (document.getElementById('chat-container')) {
   // console.log("Chatbot already loaded.");
    return;
  }    
      
  // 1. Create a unique container for your widget
  var widgetContainer = document.createElement('div');
  widgetContainer.id = 'my-chat-widget';
  document.body.appendChild(widgetContainer);    
  
  /**
   * 1. GLOBAL & FONT SETUP
   */
  var isIframeEnlarged = false; 
  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;600;900&display=swap';
  document.head.appendChild(fontLink);

  /**
   * 2. INJECT CSS
   */
  var css = `
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
      z-index: 200;
    }
    #chat-button {
      cursor: pointer;
      background: none;
      border: none;
      position: fixed;
      z-index: 20;
      right: 10px;
      bottom: 20px;
    }
    #chat-button svg {
      width: 60px;
      height: 60px;
      transition: opacity 0.3s;
    }
    #chat-button:hover svg {
      opacity: 0.7;
      transform: scale(1.1);
    }
  
    /* Popup rise animation */
    @keyframes rise-from-bottom {
      0% {
        transform: translateY(50px) scale(1);
        opacity: 0;
      }
      100% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
  
    /* Popup container */
    #chatbase-message-bubbles {
      position: absolute;
      bottom: 70px;
      right: 7px;
      border-radius: 10px;
      font-family: 'Source Sans 3', sans-serif;
      font-size: 20px;
      z-index: 18;
      scale: 0.55;
      cursor: pointer;
      display: none; /* hidden by default */
      flex-direction: column;
      gap: 50px;
      background-color: white;
      transform-origin: bottom right;
      box-shadow:
        0px 0.6px 0.54px -1.33px rgba(0, 0, 0, 0.15),
        0px 2.29px 2.06px -2.67px rgba(0, 0, 0, 0.13),
        0px 10px 9px -4px rgba(0, 0, 0, 0.04),
        rgba(0, 0, 0, 0.125) 0px 0.362176px 0.941657px -1px,
        rgba(0, 0, 0, 0.18) 0px 3px 7.8px -2px;
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
      right: 9px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      background-color: rgba(224, 224, 224, 0);
      color: black;
      opacity: 0;
      transform: scale(0.7);
      transition: background-color 0.3s, color 0.3s, opacity 0.3s, transform 0.3s;
      z-index: 1000000;
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
   
    @media (max-width: 600px) {
      #chatbase-message-bubbles {
        width: 90vw;
        max-width: 90vw;
        bottom: 69px;
        right: 0vw;
      }
    }
  
    :root {
      --icon-color: #0a0a0a;
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
      padding: 12px 24px 12px 20px;
      margin: 8px;
      font-size: 28px;
      font-family: 'Source Sans 3', sans-serif;
      font-weight: 400;
      line-height: 1em;
      opacity: 1;
      transform: scale(1);
      transition: opacity 1s, transform 1s;
      width: 100%;
      box-sizing: border-box;
      word-wrap: break-word;
      max-width: 100%;
    }
    .gDpkyS {
      position: fixed;
      width: 100vw;
      height: 100%;
      bottom: 0em;
      right: 0em;
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0.3em 0.5em;
      border-radius: 0.8em;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      visibility: visible;
    }    
  `;
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  /**
   * 3. INJECT HTML
   */
  var chatbotHTML = `
      <div id="chat-container">
        <!-- Chat Button -->
        <button id="chat-button">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 651">
            <path d="M0 0 C1.18013672 0.19335938 2.36027344 0.38671875 3.57617188 0.5859375 C59.5538758 10.10655486 113.52671101 33.42516318 157.42724609 69.70361328 C158.96654476 70.97242358 160.52414335 72.21892833 162.08203125 73.46484375 C170.48246311 80.31135664 178.13814279 87.92667924 185.8125 95.5625 C186.61646713 96.35856659 186.61646713 96.35856659 187.43667603 97.17071533 C194.4282304 104.10912388 200.90456545 111.24413176 207 119 C207.85759874 120.06027954 208.71557379 121.12025504 209.57421875 122.1796875 C243.74294324 165.75902188 265.49246848 216.56825559 275 271 C275.18079102 272.03382813 275.36158203 273.06765625 275.54785156 274.1328125 C280.79965418 306.12391236 280.53979773 342.07591201 275 374 C274.80664062 375.13598633 274.61328125 376.27197266 274.4140625 377.44238281 C263.53963247 439.24874978 235.2590019 496.61201036 192.3828125 542.42578125 C190.32466446 544.64925594 188.36675656 546.91531996 186.4375 549.25 C185.633125 550.1575 184.82875 551.065 184 552 C183.34 552 182.68 552 182 552 C182 552.66 182 553.32 182 554 C180.671875 555.33984375 180.671875 555.33984375 178.75 556.9375 C175.24889003 559.90091769 171.89656086 562.97488733 168.5625 566.125 C102.31951852 627.5707075 12.3232672 650.95326951 -76 648 C-85.41882655 647.59353945 -94.70187709 646.53577614 -104 645 C-105.18013672 644.80664062 -106.36027344 644.61328125 -107.57617188 644.4140625 C-184.7741212 631.28433254 -261.89597425 590.08881155 -310 527 C-310.7940625 526.03449219 -311.588125 525.06898438 -312.40625 524.07421875 C-325.77273216 507.77131255 -337.42154229 489.77313074 -347 471 C-347.61367432 469.80141357 -347.61367432 469.80141357 -348.23974609 468.57861328 C-363.35816113 438.71901813 -373.24976624 406.9207696 -379 374 C-379.27118652 372.44925781 -379.27118652 372.44925781 -379.54785156 370.8671875 C-384.79965418 338.87608764 -384.53979773 302.92408799 -379 271 C-378.80664062 269.86401367 -378.61328125 268.72802734 -378.4140625 267.55761719 C-373.76087535 241.11056741 -365.97792782 215.50596918 -355 191 C-354.57992676 190.05962891 -354.15985352 189.11925781 -353.72705078 188.15039062 C-342.14115426 162.49559862 -327.35427257 138.39713257 -309 117 C-308.21753906 116.03449219 -307.43507813 115.06898437 -306.62890625 114.07421875 C-299.87385447 105.82225862 -292.45411117 98.23904328 -284.9375 90.6875 C-284.43088837 90.17571198 -283.92427673 89.66392395 -283.40231323 89.1366272 C-276.6083393 82.28800378 -269.59514163 75.96976514 -262 70 C-261.29625244 69.43692139 -260.59250488 68.87384277 -259.86743164 68.29370117 C-187.84667734 10.91605894 -91.12983552 -15.05196565 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(382,3)"/>
            <path d="M0 0 C0.85706543 0.14985352 1.71413086 0.29970703 2.59716797 0.45410156 C17.0170868 2.98787577 30.77750998 6.55507562 44 13 C45.78664063 13.84691406 45.78664063 13.84691406 47.609375 14.7109375 C87.07502571 33.69100547 119.07180587 65.16520401 134.30859375 106.5546875 C138.9352944 119.76206443 141.53838908 132.98381376 142 147 C142.02723145 147.78149414 142.05446289 148.56298828 142.08251953 149.36816406 C143.37847843 191.86583503 126.64289485 227.83108864 98.3828125 258.875 C80.24181982 277.84308961 58.06574921 290.20862839 34 300 C33.09185547 300.37092773 32.18371094 300.74185547 31.24804688 301.12402344 C-3.93069611 315.36427475 -46.66009235 316.09851389 -83 306 C-84.32462235 305.66053702 -85.65015398 305.32460278 -86.9765625 304.9921875 C-95.63984495 302.80482715 -103.67492263 300.07073573 -111.734375 296.2265625 C-112.39695312 295.91178955 -113.05953125 295.5970166 -113.7421875 295.27270508 C-115.04829648 294.64807878 -116.35064216 294.01550037 -117.6484375 293.3737793 C-123.85344318 290.38101924 -128.12278393 289.36545867 -134.78379822 291.58804321 C-135.84794701 291.96598526 -135.84794701 291.96598526 -136.93359375 292.3515625 C-137.68858658 292.60747162 -138.44357941 292.86338074 -139.22145081 293.12704468 C-141.63134825 293.94705175 -144.03432541 294.78552001 -146.4375 295.625 C-148.01714778 296.16662131 -149.59722321 296.70699707 -151.17773438 297.24609375 C-154.2894114 298.30897685 -157.39837654 299.37929374 -160.50561523 300.45507812 C-165.92871704 302.3276149 -171.37655302 304.12298322 -176.828125 305.91064453 C-179.78869474 306.92742888 -182.67355203 308.04652931 -185.5625 309.25 C-189.0293238 310.68534608 -192.24039325 311.60425192 -196 312 C-194.89219427 305.97755272 -192.99406134 300.21763575 -191.1875 294.375 C-190.67219727 292.68697266 -190.67219727 292.68697266 -190.14648438 290.96484375 C-188.22230087 284.7193701 -186.14744249 278.56607533 -183.87719727 272.43847656 C-182.71912963 269.2192226 -181.78069506 265.98681774 -180.875 262.6875 C-179.95652158 259.35896456 -179.04686551 256.12337112 -177.8203125 252.89453125 C-176.90677616 249.67105301 -176.8933762 248.14055735 -178 245 C-179.52979046 242.81242302 -179.52979046 242.81242302 -181.5 240.6875 C-190.49063046 229.81510967 -196.3134459 216.98660623 -201.28613281 203.87792969 C-201.89813607 202.26796763 -202.53634767 200.66801075 -203.1796875 199.0703125 C-215.64398732 165.73555717 -212.04036962 127.09414809 -197.68359375 95.06298828 C-192.76044566 84.75207878 -187.27888413 74.84643409 -180 66 C-179.58782227 65.49065918 -179.17564453 64.98131836 -178.75097656 64.45654297 C-157.23696408 37.93726169 -129.07892276 16.59824284 -96 7 C-94.51829248 6.48643968 -93.03875988 5.96651621 -91.5625 5.4375 C-61.96364451 -4.2464139 -30.53405019 -5.6251629 0 0 Z " fill="#FEFEFE" transform="translate(364,171)"/>
            <path d="M0 0 C2.23673916 -0.37473011 2.23673916 -0.37473011 5.07969666 -0.3742218 C6.15512222 -0.38123611 7.23054779 -0.38825043 8.33856201 -0.39547729 C9.52355286 -0.38783356 10.7085437 -0.38018982 11.92944336 -0.37231445 C13.17337357 -0.37596512 14.41730377 -0.37961578 15.69892883 -0.38337708 C19.11645637 -0.39010858 22.53344236 -0.38334747 25.95091701 -0.37004495 C29.52363945 -0.35874731 33.09634748 -0.36283671 36.66908264 -0.36479187 C42.67063068 -0.3656755 48.67206591 -0.35458113 54.67358398 -0.33618164 C61.61502757 -0.31502254 68.55630573 -0.31150166 75.49777502 -0.3177436 C82.16985508 -0.32343649 88.84187679 -0.31779188 95.51394844 -0.30657005 C98.35559733 -0.30192207 101.19721057 -0.30105109 104.03886223 -0.3031559 C108.00635829 -0.30538757 111.97369672 -0.29093638 115.94116211 -0.2746582 C117.12412872 -0.27713562 118.30709534 -0.27961304 119.52590942 -0.28216553 C121.14327751 -0.27153831 121.14327751 -0.27153831 122.7933197 -0.26069641 C124.2011492 -0.25761711 124.2011492 -0.25761711 125.6374197 -0.25447559 C128 0 128 0 131 2 C131.30400756 4.7390485 131.41829599 7.20263633 131.375 9.9375 C131.38660156 10.66646484 131.39820313 11.39542969 131.41015625 12.14648438 C131.38094932 17.4572772 131.38094932 17.4572772 129.80051517 19.70885658 C127.3670332 21.45389838 125.77646716 21.37735585 122.7933197 21.38095093 C121.71507431 21.3894104 120.63682892 21.39786987 119.52590942 21.40658569 C118.34294281 21.400513 117.1599762 21.39444031 115.94116211 21.38818359 C114.69547958 21.39344055 113.44979706 21.39869751 112.16636658 21.40411377 C108.74897219 21.41506662 105.33212159 21.41248392 101.91475749 21.40297651 C98.34156604 21.39538848 94.76839804 21.40242298 91.19520569 21.40713501 C85.19544291 21.41259437 79.19579089 21.40539554 73.19604492 21.39111328 C66.25394891 21.3747789 59.31211711 21.38008011 52.37002748 21.3965925 C46.41412335 21.41019343 40.45829888 21.41213411 34.50238425 21.40427649 C30.94315957 21.39959321 27.38405921 21.39899308 23.82484245 21.40888596 C19.85960438 21.41913744 15.89466388 21.40494096 11.92944336 21.38818359 C10.74445251 21.39425629 9.55946167 21.40032898 8.33856201 21.40658569 C7.26313644 21.39812622 6.18771088 21.38966675 5.07969666 21.38095093 C4.14152068 21.37981985 3.20334471 21.37868877 2.23673916 21.37752342 C1.12955328 21.19064933 1.12955328 21.19064933 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #0459E1)" transform="translate(234,301)"/>
            <path d="M0 0 C2.42222595 -0.3742218 2.42222595 -0.3742218 5.50366211 -0.37231445 C6.65503159 -0.37854324 7.80640106 -0.38477203 8.99266052 -0.39118958 C10.24160599 -0.38197983 11.49055145 -0.37277008 12.77734375 -0.36328125 C14.05476944 -0.36377975 15.33219513 -0.36427826 16.64833069 -0.36479187 C19.35464344 -0.36244729 22.06017943 -0.35426448 24.76635742 -0.33618164 C28.23451479 -0.3135166 31.70223634 -0.31294556 35.17044735 -0.31969929 C38.47694563 -0.32384598 41.78336662 -0.31186453 45.08984375 -0.30078125 C46.33676498 -0.30169266 47.58368622 -0.30260406 48.86839294 -0.30354309 C50.6001754 -0.28924507 50.6001754 -0.28924507 52.36694336 -0.2746582 C53.38461288 -0.27005081 54.40228241 -0.26544342 55.45079041 -0.26069641 C58 0 58 0 61 2 C61.30400756 4.7390485 61.41829599 7.20263633 61.375 9.9375 C61.38660156 10.66646484 61.39820313 11.39542969 61.41015625 12.14648438 C61.38101687 17.44499419 61.38101687 17.44499419 59.8271637 19.70840454 C57.27876677 21.50982929 55.47369442 21.38089721 52.36694336 21.38818359 C51.21242172 21.39764008 50.05790009 21.40709656 48.86839294 21.4168396 C47.62147171 21.41076691 46.37455048 21.40469421 45.08984375 21.3984375 C43.81146133 21.40130768 42.53307892 21.40417786 41.21595764 21.40713501 C38.51141991 21.4091782 35.80769347 21.40513451 33.10327148 21.39111328 C29.63381046 21.37400378 26.16504473 21.38387422 22.69560909 21.40183067 C19.38949547 21.41526339 16.08346643 21.40586585 12.77734375 21.3984375 C10.90392555 21.40754654 10.90392555 21.40754654 8.99266052 21.4168396 C7.84129105 21.40738312 6.68992157 21.39792664 5.50366211 21.38818359 C3.97835121 21.38460342 3.97835121 21.38460342 2.42222595 21.38095093 C1.62289139 21.25523712 0.82355682 21.12952332 0 21 C-2.41564046 17.37653931 -2.29781669 14.68396018 -2.25 10.5 C-2.25773438 9.82324219 -2.26546875 9.14648438 -2.2734375 8.44921875 C-2.25884811 4.75080743 -2.10264442 3.15396663 0 0 Z " fill="var(--icon-color, #00FF00)" transform="translate(234,344)"/>
          </svg>
        </button>
  
        <!-- Popup -->
        <div id="chatbase-message-bubbles">
          <div class="close-popup">&times;</div>
          <div class="message-content">
            <div class="message-box" id="popup-message-box">
              <!-- Will be replaced dynamically for new/returning user -->
            </div>
          </div>
        </div>
      </div>
  
      <!-- Chat Iframe -->
      <iframe
        id="chat-iframe"
        src="https://skalerbartprodukt.onrender.com"
        style="display: none; position: fixed; bottom: 3vh; right: 2vw; width: 50vh; height: 90vh; border: none; z-index: 40000;">
      </iframe>
  `;
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  /**
   * 4. COOKIE FUNCTIONS
   */
  function setCookie(name, value, days, domain) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days*24*60*60*1000);
      expires = "; expires=" + date.toUTCString();
    }
    var domainStr = domain ? "; domain=" + domain : "";
    document.cookie = name + "=" + (value || "") + expires + domainStr + "; path=/";
  }
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i=0; i<ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  function getCurrentTimestamp() {
    return new Date().getTime();
  }

  /**
   * 5. CHAT IFRAME LOGIC
   */
  function sendMessageToIframe() {
    var iframe = document.getElementById("chat-iframe");
    var iframeWindow = iframe.contentWindow;

    var messageData = {
      action: 'integrationOptions',
      chatbotID: "dillingde",
      pagePath: window.location.href,
      statestikAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/740370a9-f01d-493e-bbe4-ec374aa9e5d8",
      SOCKET_SERVER_URL: "https://den-utrolige-snebold.onrender.com/",
      apiEndpoint: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/75ae5c08-459e-4a2e-915c-a6df55b5dcd6",
      fordelingsflowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/61d3da9c-fea8-41b8-ae9e-bed791666cf2",
      flow2Key: "product",
      flow2API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/7a6747f1-7aa4-489f-b0a9-79aa5d1f0c98",
      flow3Key: "productnofilter",
      flow3API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/7a6747f1-7aa4-489f-b0a9-79aa5d1f0c98",
      flow4API: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/eebcb827-cf5b-4ee2-8279-71b8639c3d06",
      flow4Key: "category",
      
      imageAPI: "",
  
      metaDataAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/11751a16-1c96-4710-8d18-2987f8b4e21c",
      metaDataKey: "product",
  
      apiFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/4becf9f7-6eca-4ec7-a793-595b2cadb90e",
      apiVarFlowAPI: "https://den-utrolige-snebold.onrender.com/api/v1/prediction/a4a1f49f-2060-4030-8b50-53ad3a1e4d6f",
      apiFlowKey: "order",
  
      useThumbsRating: true,
      ratingTimerDuration: 10000,
  
      knowledgebaseIndexApiEndpoint: "dilling-faq",
      flow2KnowledgebaseIndex: "",
      flow3KnowledgebaseIndex: "dilling-pro",
      flow4KnowledgebaseIndex: "",
      apiFlowKnowledgebaseIndex: "dilling-faq",
      websiteOverride: "dilling.dk",
      languageOverride: "Danish",
      valutaOverride: "KR",
  
      replaceExclamationWithPeriod: true,
      fontFamily: "Montserrat, sans-serif",
      
      // Set FreshdeskForm text
      freshdeskEmailLabel: "Din email:",
      freshdeskMessageLabel: "Besked til kundeservice:",
      freshdeskImageLabel: "Upload billede (valgfrit):",
      freshdeskChooseFileText: "Vælg fil",
      freshdeskNoFileText: "Ingen fil valgt",
      freshdeskSendingText: "Sender...",
      freshdeskSubmitText: "Send henvendelse",
        
      // Set FreshdeskForm validation error messages
      freshdeskEmailRequiredError: "Email er påkrævet",
      freshdeskEmailInvalidError: "Indtast venligst en gyldig email adresse",
      freshdeskFormErrorText: "Ret venligst fejlene i formularen",
      freshdeskMessageRequiredError: "Besked er påkrævet",
      freshdeskSubmitErrorText: "Der opstod en fejl ved afsendelse af henvendelsen. Prøv venligst igen.",
        
      // Set confirmation messages
      contactConfirmationText: "Tak for din henvendelse, vi vender tilbage hurtigst muligt.",
      freshdeskConfirmationText: "Tak for din henvendelse, vi vender tilbage hurtigst muligt.",

      inputPlaceholder: "Skriv dit spørgsmål her...",
      ratingMessage: "Fik du besvaret dit spørgmål?,
      
      privacyLink: "https://image-hosting-pi.vercel.app/Privatlivspolitik_dilling.pdf",
      titleLogoG: "http://dialogintelligens.dk/wp-content/uploads/2025/01/Dilling_whitemessagelogo-1.png",
      headerLogoG: "https://raw.githubusercontent.com/DialogIntelligens/image-hosting/master/chatbot_logo/logo-1741613117737.png",
      messageIcon: "https://image-hosting-pi.vercel.app/messageicon.png",
      themeColor: "#000000",
      headerTitleG: "Jeg er DILLINGs AI-chatbot",
      headerSubtitleG: "Du skriver med en AI-chatbot. Samtidig accepterer du, at samtalen kan gemmes og behandles for at forbedre din oplevelse. Læs mere i vores privatlivspolitik. Bemærk: chatbotten kan i nogle tilfælde give fejlagtige oplysninger.",
      titleG: "DILLINGs chat ",
      firstMessage: "Hej med dig 🙂 Jeg er ny hos DILLING og er stadig under oplæring. Men jeg vil gøre mit bedste, hvis du har spørgsmål omkring DILLING eller vores produkter. Hvordan kan jeg hjælpe dig?  ",
      isTabletView: (window.innerWidth < 1000 && window.innerWidth > 800),
      isPhoneView: (window.innerWidth < 800)
    };

    // If the iframe is already visible, post the message immediately.
    if (iframe.style.display !== 'none') {
      try {
        iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
      } catch (e) {
        console.error("Error posting message to iframe:", e);
      }
    } else {
      // If not visible, assign onload to post the message when it appears.
      iframe.onload = function() {
        try {
          iframeWindow.postMessage(messageData, "https://skalerbartprodukt.onrender.com");
        } catch (e) {
          console.error("Error posting message on iframe load:", e);
        }
      };
    }
  }

  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    if (event.origin !== "https://skalerbartprodukt.onrender.com") return;
    if (event.data.action === 'toggleSize') {
      isIframeEnlarged = !isIframeEnlarged;
      adjustIframeSize();
    } else if (event.data.action === 'closeChat') {
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
    } else if (event.data.action === 'navigate') {
      document.getElementById('chat-iframe').style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
      localStorage.setItem('chatWindowState', 'closed');
      window.location.href = event.data.url;
    }
  });

  /**
   * 6. TOGGLE CHAT WINDOW
   */
  function toggleChatWindow() {
    var iframe = document.getElementById('chat-iframe');
    var button = document.getElementById('chat-button');
    var popup = document.getElementById("chatbase-message-bubbles");
  
    // Determine if the chat is currently open
    var isCurrentlyOpen = iframe.style.display !== 'none';
  
    // Toggle the display of the iframe and button
    iframe.style.display = isCurrentlyOpen ? 'none' : 'block';
    button.style.display = isCurrentlyOpen ? 'block' : 'none';
    localStorage.setItem('chatWindowState', isCurrentlyOpen ? 'closed' : 'open');
  
    // Close the popup when the chat is opened
    if (!isCurrentlyOpen) {
      popup.style.display = "none";
    //  localStorage.setItem("popupClosed", "true");  // Save that the popup has been closed
    }
  
    // Adjust the iframe size
    adjustIframeSize();
  
    // When opening, let the iframe know after a short delay
    if (!isCurrentlyOpen) {
      setTimeout(function() {
        iframe.contentWindow.postMessage({ action: 'chatOpened' }, '*');
      }, 100);
    }
  }
  
  // If the popup is open at DOM load, hide it
  var popup = document.getElementById("chatbase-message-bubbles");
  if (popup && popup.style.display === "flex") {
    popup.style.display = "none";
  }
  
  /**
   * 7. SHOW/HIDE POPUP
   */
  function showPopup() {
    var iframe = document.getElementById("chat-iframe");
    // If the iframe is visible or the popup has been closed, do not show the popup
    if (iframe.style.display !== "none") {
      return;
    }
        
    var popup = document.getElementById("chatbase-message-bubbles");
    var messageBox = document.getElementById("popup-message-box");
    var userHasVisited = getCookie("userHasVisited");
    if (!userHasVisited) {
      setCookie("userHasVisited", "true", 1, ".yourdomain.com");
      messageBox.innerHTML = `Har du brug for hjælp? <span id="funny-smiley">😊</span>` ;
    } else {
      messageBox.innerHTML = `Velkommen tilbage! Har du brug for hjælp? <span id="funny-smiley">😄</span>`;
    }
    // Determine popup width based on character count (excluding any HTML tags)
    var charCount = messageBox.textContent.trim().length;
    var popupElem = document.getElementById("chatbase-message-bubbles");
    if (charCount < 25) {
      popupElem.style.width = "380px";
    } else if (charCount < 60) {
      popupElem.style.width = "405px";
    } else {
      popupElem.style.width = "460px";
    }
  
    popup.style.display = "flex";
  
    // Blink after 2s
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('blink');
        setTimeout(function() {
          smiley.classList.remove('blink');
        }, 1000);
      }
    }, 2000);
  
    // Jump after 12s
    setTimeout(function() {
      var smiley = document.getElementById('funny-smiley');
      if (smiley && popup.style.display === "flex") {
        smiley.classList.add('jump');
        setTimeout(function() {
          smiley.classList.remove('jump');
        }, 1000);
      }
    }, 12000);
  }
  
  // Close the popup and save the state in LocalStorage
  var closePopupButton = document.querySelector("#chatbase-message-bubbles .close-popup");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", function() {
      document.getElementById("chatbase-message-bubbles").style.display = "none";
      localStorage.setItem("popupClosed", "true");  // Save popup closed state
    });
  }

  // Add event listener to popup so clicking on it (except the close button) toggles the chat window
var popupContainer = document.getElementById("chatbase-message-bubbles");
popupContainer.addEventListener("click", function(e) {
  // Ensure that clicking on the close button does not trigger toggling the chat
  if (e.target.closest(".close-popup") === null) {
    toggleChatWindow();
  }
});

    
  // Check if the popup has been closed previously
  // var popupClosed = localStorage.getItem("popupClosed");
  // if (!popupClosed || popupClosed === "false") {
  //   setTimeout(showPopup, 7000);
  // }
  setTimeout(showPopup, 1000);
    
  /**
   * 9. ADJUST IFRAME SIZE
   */
  function adjustIframeSize() {
    var iframe = document.getElementById('chat-iframe');
    //console.log("Adjusting iframe size. Window width:", window.innerWidth);
  
    // Keep 'isIframeEnlarged' logic if toggled from the iframe
    if (isIframeEnlarged) {
      iframe.style.width = 'calc(2 * 45vh + 6vw)';
      iframe.style.height = (window.innerHeight < 720) ? '87vh' : '88vh';
    } else {
      if (window.innerWidth < 1000) {
        iframe.style.width = '95vw';
        iframe.style.height = (window.innerHeight < 720) ? '87vh' : '90vh';
      } else {
        iframe.style.width = 'calc(45vh + 6vw)';
        iframe.style.height = (window.innerHeight < 720) ? '87vh' : '88vh';
      }
    }
  
    // Always position fixed
    iframe.style.position = 'fixed';
  
    // Center if mobile, else bottom-right
    if (window.innerWidth < 1000) {
      iframe.style.left = '50%';
      iframe.style.top = '50%';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.bottom = '';
      iframe.style.right = '';
    } else {
      iframe.style.left = 'auto';
      iframe.style.top = 'auto';
      iframe.style.transform = 'none';
      iframe.style.bottom = '0vh';
      iframe.style.right = '2vw';
    }
  
    sendMessageToIframe();
  }
  // Adjust size on page load + on resize
  adjustIframeSize();
  window.addEventListener('resize', adjustIframeSize);
  
  // Attach event listener to chat-button
  document.getElementById('chat-button').addEventListener('click', toggleChatWindow);
  
  // Modify the initial chat window state logic
  var savedState = localStorage.getItem('chatWindowState');
  var iframe = document.getElementById('chat-iframe');
  var button = document.getElementById('chat-button');
  
  if (savedState === 'open') {
    iframe.style.display = 'block';
    button.style.display = 'none';
    sendMessageToIframe();
  } else {
    iframe.style.display = 'none';
    button.style.display = 'block';
  }
  
  // Chat button click
  document.getElementById("chat-button").addEventListener("click", toggleChatWindow);
} // end of initChatbot

// Initial attempt to load the chatbot.
initChatbot();

// After 2 seconds, check if a key element is present; if not, reinitialize.
setTimeout(function() {
  if (!document.getElementById('chat-container')) {
   // console.log("Chatbot not loaded after 2 seconds, retrying...");
    initChatbot();
  }
}, 5000);

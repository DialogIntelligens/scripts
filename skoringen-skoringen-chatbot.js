(function () {
  const blocked = [
    "/shop-vouchers",
    "/shop-crm",
    "/shop-click-collect"
  ];

  if (blocked.some(path => window.location.href.includes(path))) {
    return;
  }

  const s = document.createElement("script");
  s.src = "https://dialogintelligens.github.io/scripts/universal-chatbot.js?id=skoringen";
  s.defer = true;
  document.head.appendChild(s);
})();

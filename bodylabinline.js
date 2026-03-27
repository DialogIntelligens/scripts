(function () {
  const loaderScript = document.currentScript;
  const s = document.createElement('script');
  s.src =
    'https://dialogintelligens.github.io/scripts/inline-chatbot.js?id=bodylab';
  s.defer = true;
  if (loaderScript && loaderScript.parentNode) {
    loaderScript.parentNode.insertBefore(s, loaderScript.nextSibling);
  } else {
    document.head.appendChild(s);
  }
})();

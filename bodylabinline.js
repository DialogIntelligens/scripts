<script>
(function () {
  // Do not load on checkout
  if (window.location.href.includes("/shop/checkout.html")) {
    return;
  }

  const thisScript = document.currentScript;

  document.addEventListener("DOMContentLoaded", function () {
    // Optional styling (kept from old script)
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @media (min-width: 1024px) {
        #chat-iframe {
          margin-left: 0px;
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Create iframe
    const iframeElement = document.createElement("iframe");
    iframeElement.id = "chat-iframe";

    // 👉 Load the NEW application inside the iframe
    iframeElement.src =
      "https://dialogintelligens.github.io/scripts/universal-chatbot.html?id=bodylab";

    iframeElement.style.width = "100%";
    iframeElement.style.height = "600px";
    iframeElement.style.border = "0";
    iframeElement.style.boxSizing = "border-box";

    // Sandbox: enough for scripts + storage, but still safe
    iframeElement.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-forms allow-popups"
    );

    thisScript.insertAdjacentElement("afterend", iframeElement);
  });
})();
</script>

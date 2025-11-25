<script>
(function() {
  // block on this exact URL
  if (window.location.pathname === "/shop/checkout.html") {
    return; // do nothing
  }

  const s = document.createElement('script');
  s.src = "https://dialogintelligens.github.io/scripts/universal-chatbot.js?id=bodylab";
  s.defer = true;
  document.head.appendChild(s);
})();
</script>

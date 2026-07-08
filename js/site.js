/* Site interactions: scrollspy, back-to-top, footer year */
(function () {
  "use strict";

  /* ---------- back to top ---------- */
  var bt = document.getElementById("toTop");
  if (bt) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) { bt.classList.add("show"); }
      else { bt.classList.remove("show"); }
    }, { passive: true });
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* ---------- scrollspy: highlight current section in the nav ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll("nav a[href^='#']"));
  if (!links.length) { return; }

  var map = {};   // section id -> nav link
  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) { map[id] = a; sections.push(sec); }
  });
  if (!sections.length) { return; }

  function setActive(id) {
    links.forEach(function (a) { a.classList.remove("active"); });
    var link = map[id];
    if (link) {
      link.classList.add("active");
      // keep the active link visible when the nav scrolls horizontally (mobile)
      if (link.scrollIntoView) {
        link.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
  }

  function onScroll() {
    // section is "current" while its top is above the middle of the viewport
    var probe = window.scrollY + window.innerHeight * 0.35;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= probe) { current = sections[i].id; }
    }
    // at the very bottom, force the last section (short sections near the end)
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }
    if (current) { setActive(current); }
    else { links.forEach(function (a) { a.classList.remove("active"); }); }
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();

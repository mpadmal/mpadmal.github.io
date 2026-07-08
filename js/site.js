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

  /* ---------- publication links: local PDF if present, else web ---------- */
  document.querySelectorAll(".pubx[data-pdf]").forEach(function (card) {
    var pdf = card.getAttribute("data-pdf");
    var web = card.getAttribute("data-link");
    var bd = card.querySelector(".bd");
    if (!bd) { return; }

    function addLink(href, isPdf) {
      var row = document.createElement("div");
      row.className = "links";
      var a = document.createElement("a");
      a.href = href;
      if (isPdf) {
        a.setAttribute("download", "");
        a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>Download PDF';
      } else {
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4L10 14M20 14v6H4V4h6"/></svg>View online';
      }
      row.appendChild(a);
      bd.appendChild(row);
    }

    fetch(pdf, { method: "HEAD" })
      .then(function (r) {
        if (r.ok) { addLink(pdf, true); }
        else if (web) { addLink(web, false); }
      })
      .catch(function () { if (web) { addLink(web, false); } });
  });

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

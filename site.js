(function () {
  "use strict";

  var STORAGE_KEY = "rimini-guide-theme";

  function getPreferredTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) { /* ignore */ }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { /* ignore */ }
  }

  function toggleTheme() {
    var root = document.documentElement;
    var current = root.getAttribute("data-theme") || getPreferredTheme();
    root.classList.add("theme-transitioning");
    applyTheme(current === "dark" ? "light" : "dark");
    window.setTimeout(function () {
      root.classList.remove("theme-transitioning");
    }, 450);
  }

  applyTheme(getPreferredTheme());

  function createThemeToggle() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Переключить светлую и тёмную тему");
    btn.title = "Светлая / тёмная тема";
    btn.innerHTML =
      '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="5"/>' +
        '<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>' +
      "</svg>" +
      '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
      "</svg>";
    btn.addEventListener("click", toggleTheme);
    return btn;
  }

  function wrapNav() {
    var nav = document.querySelector(".topnav");
    if (!nav || nav.querySelector(".theme-toggle")) return;

    var ul = nav.querySelector("ul");
    if (!ul) return;

    var inner = document.createElement("div");
    inner.className = "topnav-inner";
    nav.insertBefore(inner, ul);
    inner.appendChild(ul);
    inner.appendChild(createThemeToggle());
  }

  function initReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var targets = document.querySelectorAll(
      "section, .card, .step, .note, table, .section-title"
    );

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      if (i % 3 === 1) el.classList.add("reveal-delay-1");
      if (i % 3 === 2) el.classList.add("reveal-delay-2");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      wrapNav();
      initReveal();
    });
  } else {
    wrapNav();
    initReveal();
  }
})();

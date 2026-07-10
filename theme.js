// Hell/Dunkel-Schalter
(function () {
  var root = document.documentElement;
  var gespeichert = null;
  try { gespeichert = localStorage.getItem("farbschema"); } catch (e) {}

  var dunkel = gespeichert
    ? gespeichert === "dunkel"
    : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (dunkel) root.setAttribute("data-theme", "dark");

  function schalterErstellen() {
    var footer = document.querySelector("footer");
    if (!footer) return;

    var knopf = document.createElement("button");
    knopf.className = "theme-toggle";
    knopf.setAttribute("aria-label", "Farbschema wechseln");
    knopf.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";

    knopf.addEventListener("click", function () {
      var istDunkel = root.getAttribute("data-theme") === "dark";
      if (istDunkel) {
        root.removeAttribute("data-theme");
        knopf.textContent = "🌙";
      } else {
        root.setAttribute("data-theme", "dark");
        knopf.textContent = "☀️";
      }
      try { localStorage.setItem("farbschema", istDunkel ? "hell" : "dunkel"); } catch (e) {}
    });

    footer.appendChild(knopf);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schalterErstellen);
  } else {
    schalterErstellen();
  }
})();

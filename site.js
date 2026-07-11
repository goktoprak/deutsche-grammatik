/* ===== Deutsche Grammatik – gemeinsames Seitengerüst =====
 *
 * Baut auf jeder Seite die Kopfzeile (mit Hell/Dunkel-Schalter),
 * die Kapitel-Navigation, das Blättern zwischen Themen und die Fußzeile
 * auf. Kopf- und Fußzeile werden so nur noch an dieser einen Stelle
 * gepflegt statt in jeder HTML-Datei.
 */
(function () {
  "use strict";

  /* Reihenfolge = Lernreihenfolge, wie die Karten auf der Startseite */
  var THEMEN = [
    { datei: "artikel",             titel: "Artikel" },
    { datei: "hilfsverben",         titel: "Hilfsverben" },
    { datei: "pronomen",            titel: "Pronomen" },
    { datei: "negation",            titel: "Negation" },
    { datei: "modalverben",         titel: "Modalverben" },
    { datei: "zeitformen",          titel: "Zeitformen" },
    { datei: "praepositionen",      titel: "Präpositionen" },
    { datei: "kasus",               titel: "Kasus" },
    { datei: "richtung-ort",        titel: "Richtungs- und Ortsangaben" },
    { datei: "adjektive",           titel: "Adjektive" },
    { datei: "konjunktionen",       titel: "Konjunktionen" },
    { datei: "pronominaladverbien", titel: "Pronominaladverbien" }
  ];

  var root = document.documentElement;

  /* ---- Farbschema so früh wie möglich setzen (kein Aufblitzen) ---- */
  var gespeichert = null;
  try { gespeichert = localStorage.getItem("farbschema"); } catch (e) {}
  var dunkel = gespeichert
    ? gespeichert === "dunkel"
    : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (dunkel) root.setAttribute("data-theme", "dark");

  /* ---- Wo sind wir? ---- */
  var istThema = /\/themen\//.test(location.pathname);
  var wurzel = istThema ? "../" : "";
  var aktuelleDatei = location.pathname.split("/").pop().replace(/\.html$/, "");
  var themaIndex = -1;
  for (var i = 0; i < THEMEN.length; i++) {
    if (istThema && THEMEN[i].datei === aktuelleDatei) themaIndex = i;
  }

  /* ---- Icons ---- */
  var ICON_MOND = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  var ICON_SONNE = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  var ICON_HAUS = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9.5 9-7 9 7V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22v-8h6v8"/></svg>';
  /* ---- Favicon (blaues G, als Daten-URI – keine extra Datei nötig) ---- */
  var favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="14" fill="#2f5fa8"/>' +
    '<text x="32" y="45" font-family="system-ui,sans-serif" font-size="38" font-weight="700" fill="#fff" text-anchor="middle">G</text>' +
    "</svg>");
  document.head.appendChild(favicon);

  /* ---- Adressleisten-Farbe (mobil) an das Farbschema koppeln ---- */
  var metaFarbe = document.createElement("meta");
  metaFarbe.name = "theme-color";
  document.head.appendChild(metaFarbe);
  function metaFarbeSetzen() {
    metaFarbe.content = root.getAttribute("data-theme") === "dark" ? "#14181f" : "#f6f7f9";
  }
  metaFarbeSetzen();

  function el(tag, klasse, inhalt) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (inhalt != null) e.innerHTML = inhalt;
    return e;
  }

  /* ---- Hell/Dunkel-Schalter ---- */
  function schalterBauen() {
    var knopf = el("button", "kopf-knopf theme-toggle");
    knopf.type = "button";
    function anzeigen() {
      var istDunkel = root.getAttribute("data-theme") === "dark";
      knopf.innerHTML = istDunkel ? ICON_SONNE : ICON_MOND;
      knopf.setAttribute("aria-label", istDunkel ? "Helles Farbschema" : "Dunkles Farbschema");
      knopf.title = knopf.getAttribute("aria-label");
    }
    anzeigen();
    knopf.addEventListener("click", function () {
      var istDunkel = root.getAttribute("data-theme") === "dark";
      if (istDunkel) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", "dark");
      try { localStorage.setItem("farbschema", istDunkel ? "hell" : "dunkel"); } catch (e) {}
      anzeigen();
      metaFarbeSetzen();
    });
    return knopf;
  }

  /* ---- Kopfzeile ---- */
  function kopfzeileBauen() {
    var kopf = el("header", "kopfzeile");
    var innen = el("nav", "kopfzeile-innen");
    innen.setAttribute("aria-label", "Hauptnavigation");

    var marke = el("a", "marke", "Deutsche Grammatik");
    marke.href = wurzel + "index.html";
    innen.appendChild(marke);

    var heim = el("a", "kopf-knopf", ICON_HAUS);
    heim.href = wurzel + "index.html";
    heim.setAttribute("aria-label", "Zur Startseite");
    heim.title = "Zur Startseite";
    innen.appendChild(heim);

    innen.appendChild(schalterBauen());
    kopf.appendChild(innen);
    return kopf;
  }

  /* ---- Kapitel-Navigation (Sprungmarken zu den Abschnitten) ---- */
  function kapitelBauen(main) {
    var abschnitte = main.querySelectorAll("section[id]");
    if (abschnitte.length < 2) return;

    var nav = el("nav", "kapitel");
    nav.setAttribute("aria-label", "Auf dieser Seite");
    for (var i = 0; i < abschnitte.length; i++) {
      var h2 = abschnitte[i].querySelector("h2");
      if (!h2) continue;
      var a = document.createElement("a");
      a.href = "#" + abschnitte[i].id;
      a.textContent = h2.textContent;
      nav.appendChild(a);
    }

    var kopf = main.querySelector(".seitenkopf");
    if (kopf) main.insertBefore(nav, kopf.nextSibling);
    else main.insertBefore(nav, main.firstChild);
  }

  /* ---- Blättern: vorheriges / nächstes Thema ---- */
  function blaetternBauen(main) {
    if (themaIndex < 0) return;
    var vorher = THEMEN[themaIndex - 1];
    var nachher = THEMEN[themaIndex + 1];
    if (!vorher && !nachher) return;

    var nav = el("nav", "blaettern");
    nav.setAttribute("aria-label", "Vorheriges und nächstes Thema");
    if (vorher) {
      var a = el("a", "blatt", '<span class="richtung">← Vorheriges Thema</span><span class="titel">' + vorher.titel + "</span>");
      a.href = vorher.datei + ".html";
      nav.appendChild(a);
    }
    if (nachher) {
      var b = el("a", "blatt weiter", '<span class="richtung">Nächstes Thema →</span><span class="titel">' + nachher.titel + "</span>");
      b.href = nachher.datei + ".html";
      nav.appendChild(b);
    }
    main.appendChild(nav);
  }

  /* ---- Fußzeile ---- */
  function fusszeileBauen() {
    return el("footer", null, "Deutsche Grammatik · Erstellt zum Lernen und Nachschlagen · Esat Yiğithan Göktoprak");
  }

  /* ---- Alles zusammenbauen ---- */
  function aufbauen() {
    document.body.insertBefore(kopfzeileBauen(), document.body.firstChild);
    var main = document.querySelector("main");
    if (main) {
      kapitelBauen(main);
      blaetternBauen(main);
    }
    document.body.appendChild(fusszeileBauen());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aufbauen);
  } else {
    aufbauen();
  }
})();

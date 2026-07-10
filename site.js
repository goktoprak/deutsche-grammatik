/* ===== Deutsche Grammatik – gemeinsames Seitengerüst =====
 *
 * Baut auf jeder Seite die Kopfzeile (Themenmenü, Hell/Dunkel-Schalter),
 * die Kapitel-Navigation, das Blättern zwischen Themen und die Fußzeile
 * auf. Kopf- und Fußzeile werden so nur noch an dieser einen Stelle
 * gepflegt statt in jeder HTML-Datei.
 */
(function () {
  "use strict";

  /* Reihenfolge = Lernreihenfolge, wie die Karten auf der Startseite */
  var THEMEN = [
    { datei: "artikel",             titel: "Artikel",                    stufe: "A1.1" },
    { datei: "hilfsverben",         titel: "Hilfsverben",                stufe: "A1.1" },
    { datei: "pronomen",            titel: "Pronomen",                   stufe: "A1.2" },
    { datei: "negation",            titel: "Negation",                   stufe: "A1.2" },
    { datei: "modalverben",         titel: "Modalverben",                stufe: "A1.2" },
    { datei: "zeitformen",          titel: "Zeitformen",                 stufe: "A2.1" },
    { datei: "praepositionen",      titel: "Präpositionen",              stufe: "A2.1" },
    { datei: "kasus",               titel: "Kasus",                      stufe: "A2.2" },
    { datei: "richtung-ort",        titel: "Richtungs- und Ortsangaben", stufe: "A2.2" },
    { datei: "adjektive",           titel: "Adjektive",                  stufe: "B1.1" },
    { datei: "konjunktionen",       titel: "Konjunktionen",              stufe: "B1.1" },
    { datei: "pronominaladverbien", titel: "Pronominaladverbien",        stufe: "B1.2" }
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
  var ICON_PFEIL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

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
    var knopf = el("button", "theme-toggle");
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

  /* ---- Kopfzeile mit Themenmenü ---- */
  function kopfzeileBauen() {
    var kopf = el("header", "kopfzeile");
    var innen = el("nav", "kopfzeile-innen");
    innen.setAttribute("aria-label", "Hauptnavigation");

    var marke = el("a", "marke", "Deutsche Grammatik");
    marke.href = wurzel + "index.html";
    innen.appendChild(marke);

    var menue = el("details", "themen-menue");
    var griff = el("summary", null, "Themen " + ICON_PFEIL);
    menue.appendChild(griff);

    var liste = el("ul");
    for (var i = 0; i < THEMEN.length; i++) {
      var t = THEMEN[i];
      var a = el("a", null, t.titel + ' <span class="stufe-klein">' + t.stufe + "</span>");
      a.href = wurzel + "themen/" + t.datei + ".html";
      if (i === themaIndex) {
        a.className = "aktiv";
        a.setAttribute("aria-current", "page");
      }
      var li = document.createElement("li");
      li.appendChild(a);
      liste.appendChild(li);
    }
    menue.appendChild(liste);
    innen.appendChild(menue);

    /* Menü schließen bei Klick daneben oder Escape */
    document.addEventListener("click", function (ev) {
      if (menue.open && !menue.contains(ev.target)) menue.open = false;
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && menue.open) {
        menue.open = false;
        griff.focus();
      }
    });

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

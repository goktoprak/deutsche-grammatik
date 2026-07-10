# Deutsche Grammatik

Eine kleine statische Website mit übersichtlichen Tabellen und Beispielen zur deutschen Grammatik. Alle Inhalte sind auf Deutsch; englische Übersetzungen gibt es nur bei den Beispielsätzen.

**Live:** https://goktoprak.github.io/deutsche-grammatik/

## Themen

- **Artikel** – bestimmte, unbestimmte, negative, possessive und demonstrative Artikel
- **Pronomen** – Personal-, Reflexiv- und Possessivpronomen
- **Adjektive** – schwache, gemischte und starke Deklination, Komparativ & Superlativ
- **Präpositionen** – mit Akkusativ, Dativ, Genitiv und Wechselpräpositionen
- **Modalverben** – können, müssen, dürfen, wollen, sollen, mögen
- **Hilfsverben** – haben, sein, werden
- **Zeitformen** – Präsens, Perfekt, Präteritum, Plusquamperfekt, Futur I & II
- **Konjunktionen** – nebenordnend, unterordnend, Konjunktionaladverbien
- **Negation** – nicht, kein, Verneinungswörter, doch
- **Richtungs- und Ortsangaben** – Wo? Wohin? Woher?, Positionsverben, lokale Präpositionen
- **Kasus** – Nominativ, Akkusativ, Dativ, Genitiv, Dativverben, n-Deklination
- **Pronominaladverbien** – darauf, damit, davon; Fragen mit worauf, womit, wovon

## Struktur

```
index.html          Startseite mit Themenübersicht
style.css           gemeinsames Stylesheet
site.js             gemeinsames Seitengerüst: Kopf- und Fußzeile, Themenmenü,
                    Kapitel-Navigation, Blättern, Hell/Dunkel-Schalter
themen/             eine HTML-Seite pro Thema
```

Kopf- und Fußzeile werden zentral von `site.js` aufgebaut – die HTML-Seiten enthalten nur noch ihren eigenen Inhalt (Titel, Untertitel, Abschnitte).

Neues Thema hinzufügen:

1. Seite in `themen/` anlegen (bestehende Seite als Vorlage kopieren),
2. eine Karte in `index.html` ergänzen,
3. das Thema in die Liste `THEMEN` in `site.js` eintragen – dann erscheint es automatisch im Themenmenü und beim Blättern.

## Lokal ansehen

Einfach `index.html` im Browser öffnen – kein Build, keine Abhängigkeiten.

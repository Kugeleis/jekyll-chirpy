---
title: "Die Technik hinter diesem Blog"
date: 2026-02-03 19:37:19 +0000
categories: [Technik, Computer]
tags: [it, unrelated, software, jekyll, github, ]
---

Wenn man es leicht haben will macht man eine Insta-Story. Will ich aber nicht. Nicht Insta. Nicht leicht. Alle welt redet von digitaler Souveränität. Dann gehe ich mal voran. Dieser Blog nutzt [Jekyll](https://jekyllrb.com/) als *static site generator* - für nicht IT-affine: Wenn man was auf der Seite ändert, wird sie im Hintergrund neu gebaut. Als *theme* - wieder so ein Anglizismus - nutze ich [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) weil es mir gefällt. Das habe ich etwas angepasst auf meine Bedürfnisse. Zum Beispiel kann ich Landkarten darstellen (mit leaflet) und zeige das Wetter ([von open meteo](https://api.open-meteo.com)).

Gehostet ist das bei Github und dort wird es auch gleich gebaut über *actions*. Einen neuen Beitrag schreibe ich einfach als *issue* im repo mit entsprechendem Label.

Alle Texte liegen als menschenlesbare Dateien vor ([markdown](https://de.wikipedia.org/wiki/Markdown)) und ich habe die volle Kontrolle darüber. Zwar werden sie bei Github, das Microsoft gehört, gelagert, aber ich habe immer Kopien lokal über die Versionskontrolle mit *Git*.

[hier ist z.B. die *Rohversion* dieses Textes](https://github.com/Kugeleis/jekyll-chirpy/blob/main/_posts/2026-02-03-die-technik-hinter-diesem-blog.md)

---
Glossar:
- theme: die Oberfläche einer Anwendung (Farben, Schriftarten, ggf. Funktionen)
- git: eine software zur Versionskontrolle von (meist) Textdateien, wie Programmcode oder diesen Text
- actions: Aufgaben auf den diese Seite bereitstellenden Server, die bestimmte Automatisierungen ausführen
- issue: Bei Software bezeichnet das eine Anmerkung oder Problem. Ich *mißbrauche* das, um Beiträge zu schreiben.

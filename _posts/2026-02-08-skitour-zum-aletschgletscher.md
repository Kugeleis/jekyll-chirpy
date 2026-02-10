---
title: "Skitour zum Aletschgletscher"
date: 2026-02-08 15:25:07 +0000
categories: [Sport]
tags: [winter, ski, ]
---

Eigentlich ist Fiescheralp in schweizer Wallis ein großes Skigebiet. Trotzdem findet sich die eine oder andere Tour für Freunde der Aufstiegs ohne Hilfe. So haben wir uns heute eine kleine Runde zum Ausblick auf den Aletschgletscher am Bettmerhorn ausgesucht. Zum Start rutscht man - nach kurzem Anstieg ohne Felle - auf dem Wanderweg Richtung Westen zur Bättmerhütte. Dort schnappen wir uns einen Haken eines kleinen Schlepplifts, der uns zehn Höhenmeter schenkt. Die breiten Skipisten querend schlagen wir uns zum Bettmersee durch, umrunden ihn und steigen dann in freiem Gelände Richtung Blausee an. Den lassen wir aber links liegen und wenden uns gen Nordosten parallel zur Seilbahn Moosfluh vorbei an deren Bergstation gerade Richtung Bettmerhorn. 

![Blick auf Aletschgletscher und Bettmerhorn](../assets/img/bettmerhorn.jpg)

Das Ziel ist dabei immer im Blick und die Aussichten auf den Aletschgletscher überwältigend. 
An der Aussicht angekommen, kann man je nach Gusto und Schneelage auf Piste oder im Gelände Richtung Fiescheralp abfahren.

<script>
  document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('gpx-map');

    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var gpxUrl = "{{ '/assets/gpx/bettmerhorn.gpx' | relative_url }}";
    new L.GPX(gpxUrl, {
      async: true,
      marker_options: {
        startIconUrl: 'https://cdn.jsdelivr.net/gh/mpetazzoni/leaflet-gpx@1.7.0/pin-icon-start.png',
        endIconUrl: 'https://cdn.jsdelivr.net/gh/mpetazzoni/leaflet-gpx@1.7.0/pin-icon-end.png',
        shadowUrl: 'https://cdn.jsdelivr.net/gh/mpetazzoni/leaflet-gpx@1.7.0/pin-shadow.png'
      }
    }).on('loaded', function(e) {
      map.fitBounds(e.target.getBounds());
    }).addTo(map);
  });
</script>
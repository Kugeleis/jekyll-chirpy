---
title: "Japan Tour: Ein Tag auf dem Rad"
date: 2026-02-02 10:00:00 +0100
categories: [reise, japan]
tags: [fahrrad, gpx, karte]
---

Heute bin ich eine kleine Strecke in Tokio gefahren. Hier ist der GPX-Track:

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js"></script>

<div id="gpx-map" style="height: 400px; z-index: 1;"></div>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    var map = L.map('gpx-map');

    L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var gpxUrl = "{{ '/assets/gpx/example-track.gpx' | relative_url }}";
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

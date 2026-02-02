---
title: Karte
icon: fas fa-map
order: 5
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<div id="map" style="height: 600px; z-index: 1;"></div>

<script>
  (function() {
    var mapEl = document.getElementById('map');
    if (!mapEl || mapEl._leaflet_id) return;

    var points = [
      {% for point in site.data.geopoints %}
      {
        name: "{{ point.name }}",
        latitude: {{ point.latitude }},
        longitude: {{ point.longitude }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ];

    var map = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    points.forEach(function(point) {
      var marker = L.marker([point.latitude, point.longitude]).addTo(map);
      marker.bindPopup(point.name);
    });

    if (points.length >= 2) {
      var p1 = points[points.length - 2];
      var p2 = points[points.length - 1];
      var bounds = L.latLngBounds([[p1.latitude, p1.longitude], [p2.latitude, p2.longitude]]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 10);
    } else {
      map.setView([36.2048, 138.2529], 5); /* Default Japan */
    }
  })();
</script>

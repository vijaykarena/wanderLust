
    // Initialize map
    const map = L.map("map").setView([21.1702, 72.8311], 13);

    // Add tile layer (required to see map tiles)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add a marker
    L.marker([21.1702, 72.8311])
      .addTo(map)
      .bindPopup("Hello from Leaflet!")
      .openPopup();
 
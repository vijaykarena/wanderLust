// Initialize map
let coordinates = listing.geometry.coordinates;
const map = L.map("map").setView([coordinates[1], coordinates[0]], 13); // [lat, lon]

// Add tile layer (required to see map tiles)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// custom icon
const compassIcon = L.divIcon({
  html: `<i class="fa-regular fa-compass"></i>`,
  className: "custom-marker",
  iconSize: [30, 30],
  iconAnchor: [15, 30], // ⬅ tells Leaflet where the "point" is
  popupAnchor: [5, -28], // ⬅ move popup above the icon
});

// Add a marker
L.marker([coordinates[1], coordinates[0]], { icon: compassIcon }) // Listing.geometry.coordinates // [lat, lon]
  .addTo(map)
  .bindPopup(listing.title)
  .openPopup();

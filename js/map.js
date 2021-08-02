"strict-mode";
// Map
coordinations = localStorage.getItem("coords").split(",");
const coords_arr = [];
var map;
initmap();
localStorage_reader();
Onmap_marker(coords_arr);

function initmap() {
  map = L.map("map").setView([32.674675, 51.652872], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      'Made By YB, Map from &copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}
function localStorage_reader() {
  for (let i = 0; i < coordinations.length / 2; i++) {
    coords_arr.push([coordinations[i * 2], coordinations[i * 2 + 1]]);
  }
}
//showing sites on map
function Onmap_marker(coords) {
  // format: [[52,53],[52,53]...]
  for (let i = 0; i < coords.length; i++) {
    // L.marker(coords[i]).addTo(map).bindPopup("ES0015").openPopup();
    L.marker(coords[i]).addTo(map);
  }
  var circle = L.circle([32.675, 51.65322], {
    color: "green",
    fillColor: "#2553",
    fillOpacity: 0.5,
    radius: 20,
  }).addTo(map);
}

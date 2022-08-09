"strict-mode";
// Map
let coordinations = (codesites = ""); // coordinations=cidesites=""

if (localStorage.length) {
  coordinations = localStorage.getItem("coords").split(",");
  codesites = localStorage.getItem("codesites").split(",");
  namesites = localStorage.getItem("names").split(",");
}
const coords_arr = [];
let map;
initmap();
localStorage_reader();
Onmap_marker(coords_arr);

function initmap() {
  map = L.map("map").setView([32.674675, 51.652872], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '<span class="copyright">Made By YB, Map from &copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a></span>',
  }).addTo(map);
}
function localStorage_reader() {
  for (let i = 0; i < coordinations.length / 2; i++) {
    coords_arr.push([coordinations[i * 2], coordinations[i * 2 + 1]]);
  }
  // console.log(coords_arr);
}
//showing sites on map
function Onmap_marker(coords) {
  const btsicon = L.icon({
    iconUrl: "bts.png",
    iconSize: [20, 28], // size of the icon
    iconAnchor: [20, 28], // point of the icon which will correspond to marker's location
    popupAnchor: [-9.5, -25], // point from which the popup should open relative to the iconAnchor
  });
  for (let i = 0; i < coords.length; i++) {
    if (coords[i][0] != "") {
      L.marker(coords[i], { icon: btsicon })
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 30,
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            className: "pop_up",
          })
        )
        .setPopupContent(`${codesites[i]} <br> ${namesites[i]}`)
        .openPopup();
    }

    // var circle = L.circle([C1,C2], {
    //   color: "green",
    //   fillColor: "#2553",
    //   fillOpacity: 0.5,
    //   radius: 20,
    // }).addTo(map);
  }
}

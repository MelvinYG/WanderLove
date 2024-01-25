//map functionality

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
let lng = listing.geometry.coordinates[0];
let lt = listing.geometry.coordinates[1];
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: [lng,lt], // starting position [lng, lat]
  zoom: 10 // starting zoom
});

// console.log(listing.geometry);
const marker1 = new mapboxgl.Marker({color: 'red'})
  .setLngLat([lng,lt])
  .setPopup(new mapboxgl.Popup({offset : 25}).setHTML("<h5>Hello World</h5>"))
  .addTo(map);
//map functionality

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.cordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// // console.log(listing.geometry);
// const marker1 = new mapboxgl.Marker()
//   .setLngLat(listing.geometry.cordinates)
//   .setPopup(new mapboxgl.Popup({offset : 25}).setHTML("<h5>Hello World</h5>"))
//   .addTo(map);
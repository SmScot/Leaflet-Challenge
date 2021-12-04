// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Create the map with our layers
var map = L.map("map", {
  center: [40.73, -74.0059],
  zoom: 3,
});
lightmap.addTo(map);

// Grab the data with d3
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response) {
  var earthquakes = response.features;

for (var i = 0; i < earthquakes.length; i++) {

  var location = earthquakes[i].geometry;
  var size = earthquakes[i].properties;
  var colour;
    
  const mag = size.mag
  switch (true) {
    case mag >= 5:
      colour = "#d73027";
      break;
    case mag >= 4:
      colour = "#fc8d59";
      break;
    case mag >= 3:
      colour = "#fee08b";
      break;
    case mag >= 2:
      colour = "#d9ef8b";
      break;
    case mag >= 1:
      colour = '#91cf60';
      break;
    default:
      colour = "#1a9850";
  }

  var markers = L.circleMarker([location.coordinates[1], location.coordinates[0]], {
    radius: mag*3,
    color: colour
  }).bindPopup("Location: " + size.place + "<br> Magnitude: " + size.mag ).addTo(map)
}

})

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitude</h4>";
    div.innerHTML += '<i style="background: #1a9850"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #91cf60"></i><span>1-2</span><br>';    
    div.innerHTML += '<i style="background: #d9ef8b"></i><span>2-3</span><br>';    
    div.innerHTML += '<i style="background: #fee08b"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #fc8d59"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #d73027"></i><span>5+</span><br>';
  
    return div;
  };
  
  legend.addTo(map);


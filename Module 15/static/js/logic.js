//was unsure as to how to create a lengend, any links to a way how to...?
  
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

  // D3 Request
  d3.json(url).then(function(response) {
    console.log(response)
    onEachFeature(response.features)
  });
// adds color to point based on depth, did is based on image shown on Bootcamp an eyeballed colors using rgb
  function addColor(depth){
    return depth >= 90 ? 'red':
    depth >= 50 && depth < 70 ? 'rgb(255,75,15)':
    depth >= 30 && depth < 50 ? 'rbg(255, 134, 20)':
    depth >= 10 && depth < 30 ? 'rgb(165, 180, 50)':
    'green'
  };

  function createMap(earthquake){
    //Add tile Layer
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    //base streer view
    let baseMap = {
        "Street": base
    };

    //Creates base map
    var myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 4,
        layers: [base, earthquake]
      });

    //Earthquake layer
    let eqMap = {
        "Earthquakes": earthquake
    };
    //Adds layers to map
    L.control.layers(baseMap, eqMap).addTo(myMap);

};

function onEachFeature(response){ //have to use onEachFeature, tried using function name but wont work cause its built into lealet
        //Adds info to points
        function onEachFeature(feature, layer){
            layer.bindPopup(
            `<h2>Magnitude ${feature.properties.mag} Earthquake</h2>
            <hr>
            <h3>${feature.properties.place}</h3>
            <hr>
            <h3>Depth: ${feature.geometry.coordinates[2]}<h3>`);
            
        }

    //Add point and calls color function
    let earthquake = L.geoJson(response, {
        pointToLayer: function(feature, latlng) { //point to layer is another built in leaflet fucntion
            return L.circleMarker(latlng, {
                //point_type: circle,
                radius: feature.properties.mag * 2,
                color: addColor(feature.geometry.coordinates[2]), //calls depth in each cord, which is 3rd value
                fillColor: addColor(feature.geometry.coordinates[2])
            });
        }, 
        onEachFeature: onEachFeature // calls info function above to add info to points
    });
    createMap(earthquake);
};


let myMap =L.map('map',{
	center:[36.6716,-115.6928 ] ,
	zoom:5
})
// grab the map that we will use to center and use it for base
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);


let url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(function(data){
	console.log(data) 
});
// Define the style for earthquake markers
function getMarkerStyle(magnitude, depth) {
    return {
        radius: Math.sqrt(Math.abs(magnitude)) * 5, // Adjust size based on magnitude
        fillColor: getColor(depth),
        color: "white",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };
}

// Define color function based on depth
function getColor(depth) {
    return depth > 100 ? 'red' : 
           depth > 70 ? '#yellow' :  
           depth > 30 ? 'magenta' :  
                        'blue';    
}
// Create legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 30, 70, 100],
        labels = [];

    // Loop through depths and generate a label with a colored square for each depth range
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

// Add legend to map
legend.addTo(myMap);


// Function to add markers for each earthquake
function addMarkers(Data) {
    Data.features.forEach(function(feature) {
        let coordinates = feature.geometry.coordinates;
        let properties = feature.properties;

        let marker = L.circleMarker([coordinates[1], coordinates[0]], getMarkerStyle(properties.mag, coordinates[2]))
            .bindPopup("<b>Location:</b> " + properties.place + "<br><b>Magnitude:</b> " + properties.mag + "<br><b>Depth:</b> " + coordinates[2] + " km")
            .addTo(myMap);
    });
}

// Fetch earthquake data

fetch(url)
    .then(response => response.json())
    .then(data => addMarkers(data))
    .catch(error => console.error("Error fetching earthquake data:", error));
/**
 * Created by yevheniia on 09.06.20.
 */
 var default_zoom_u = window.innerWidth > 800 ? 14 : 24;
 var default_zoom_k = window.innerWidth > 800 ? 24 : 1;
 
 var stops_values = [
     ["Приватна власність", 'white'],
     [-1, '#d3d3d3'],
     [0, '#ffffff'],
     [1, '#ffffb2'],
     [2, '#fed976'],
     [3, "#feb24c"],
     [6, "#fd8d3c"],
     [8, "#f03b20"],
     [10, "#bd0026"]
 ];
 
 mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
 
 var map = new mapboxgl.Map({
     container: 'map',
     minZoom: default_zoom_u,
     maxZoom: default_zoom_u + 2,
     hash: false,
     tap: false,
     attributionControl: true,
     style: 'mapbox://styles/mapbox/dark-v10',
     center: [30.5, 50.4],
     zoom: default_zoom_u // starting zoom
 });
 
 

 
 
 Promise.all([
     d3.csv("https://raw.githubusercontent.com/texty/covid_schools_map/master/data/TABLE.csv"),
     d3.csv("https://raw.githubusercontent.com/texty/covid_schools_map/master/data/smallTable.csv")
 ]).then(function(data) {
 
     data[0].forEach(function(d){
         d.pot_infections = +d.pot_infections;
     });
 
     var layers = map.getStyle().layers;
     var firstSymbolId;
 
     for (var i = 0; i < layers.length; i++) {
         if (layers[i].type === 'symbol') {
             firstSymbolId = layers[i].id;
             break;
         }
     }
 
 
     /* ------- карта України ------- */
     map.on('load', function () {
 
         //векторні тайли
         map.addSource('parcels_4326', {
             type: 'vector',
             tiles: ["https://hubashovd.github.io/kyiv_kadastr_web/tree/main/vector_tiles/parcels/{z}/{x}/{y}.pbf"] 
         });
 
 
         function redrawUkraineMap(choropleth_column) {
             map.addLayer({
                 "id": "parcels_4326",
                 'type': 'fill',
                 'minzoom': 4,
                 'maxzoom': 10,
                 'source': "parcels_4326",
                 "source-layer": "parcels_4326",
                 "paint": {
                     'fill-color': {
                         property: choropleth_column,
                         stops: stops_values
                     },
 
 
                     'fill-outline-color': [
                         'case',
                         ['boolean', ['feature-state', 'hover'], false],
                         "grey",
                         "lightgrey"
                     ]
                 }
             }, firstSymbolId);
         }
 
         map.on('click', 'parcels_4326', function(e) {
            map.getCanvas().style.cursor = 'pointer';
            new mapboxgl.Popup()
                 .setLngLat(e.lngLat)
                 .setHTML(e.features[0].properties.ownership)
                 .addTo(map);
         });
 
         redrawUkraineMap('parcels_4326');
 
         /* перемикаємо шари  карти */
         d3.select("#ukraine-switch-buttons").selectAll(".map_button").on("click", function() {
             let selected_layer = d3.select(this).attr("value");
             d3.select(this.parentNode).selectAll(".map_button").classed("active", false);
             d3.select(this).classed("active", true);
             map.removeLayer('parcels_4326');
             redrawUkraineMap(selected_layer);
         });
 
 
         var nav = new mapboxgl.NavigationControl();
         map.addControl(nav, 'top-left');
 
     }); //end of Ukraine map
     
 });
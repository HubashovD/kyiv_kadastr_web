var default_zoom_u = window.innerWidth > 800 ? 5 : 5;
var default_zoom_k = window.innerWidth > 800 ? 9 : 8; 
  
mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
 
var map = new mapboxgl.Map({
     container: 'map',
     minZoom: default_zoom_u,
     maxZoom: 20,
     hash: false,
     tap: false,
     attributionControl: false,
     style: 'mapbox://styles/mapbox/dark-v10',
     center: [31.5, 48.5],
     zoom: default_zoom_u // starting zoom
 });
 
map.scrollZoom.disable();  

map.on('load', function () {
    var layers = map.getStyle().layers;
    var firstSymbolId;
        
    for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
            }
        }
 
    //векторні тайли
         map.addSource('schools', {
             type: 'vector',
             tiles: ["https://HubashovD.github.io/kyiv_kadastr_web/vector_tiles/parcels/{z}/{x}/{y}.pbf"]
     });
 
 
     function redrawUkraineMap() {
             map.addLayer({
                 "id": "schools_data",
                 'type': 'fill',
                 'minzoom': 4,
                 'maxzoom': 15,
                 'source': "schools",               
                 "source-layer": "parcels_4326",
                 "paint": {   
                    'fill-color': ['match',
                    ['get', 'ownership'],
                    "Приватна власність",
                    'green',
                    "Комунальна власність",
                    'red',
                    "Державна власність",
                    'blue',
                    "Не визначено",
                    '#FFFFB2',
                    /* other */ '#ccc'
                  ],
                     'fill-outline-color': [
                         'case',
                         ['boolean', ['feature-state', 'hover'], false],
                         "grey",
                         "lightgrey"
                     ]
                 }
             }, firstSymbolId);
         }
 
         map.on('click', 'schools_data', function(e) {
            map.getCanvas().style.cursor = 'pointer';
            new mapboxgl.Popup()
                 .setLngLat(e.lngLat)
                 .setHTML(e.features[0].properties.ownership)
                 .addTo(map);
         });
 
         redrawUkraineMap(); 
 
         var nav = new mapboxgl.NavigationControl();
         map.addControl(nav, 'top-left');
 
     }); //end of Ukraine map
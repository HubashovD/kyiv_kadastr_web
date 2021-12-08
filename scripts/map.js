var default_zoom_u = window.innerWidth > 800 ? 11 : 11;

mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';

var map = new mapboxgl.Map({
    container: 'map',
    minZoom: 11,
    maxZoom: 14,
    hash: false,
    tap: false,
    attributionControl: false,
    style: 'https://raw.githubusercontent.com/HubashovD/kyiv_kadastr_web/master/dark_matter.json',
    center: [30.5, 50.4],
    zoom: default_zoom_u // starting zoom
});

map.on('load', function() {
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
            'minzoom': 11,
            'maxzoom': 14,
            'source': "schools",
            "source-layer": "parcels_4326",
            "paint": {
                'fill-color': ['match', ['get', 'ownership'],
                    "Приватна власність",
                    'green',
                    "Комунальна власність",
                    'red',
                    "Державна власність",
                    'blue',
                    "Не визначено",
                    '#FFFFB2',
                    /* other */
                    '#ccc'
                ],
                'fill-opacity': 1

                /*,
                                'fill-outline-color': [
                                    'case', ['boolean', ['feature-state', 'hover'], false],
                                    "grey",
                                    "transperent"
                                ]*/
            }
        }, firstSymbolId);
    }

    var change_op = function(value) {
        console.log(value)
        map.setPaintProperty("schools_data", 'fill-opacity', ['match', ['get', 'category'],
            value, 1.0, 0.2
        ]);
    }

    var change_rent = function(value) {
        console.log(value)
        map.setPaintProperty("schools_data", 'fill-opacity', ['match', ['get', 'rent-xlsx rent xlsx_Орендар'],
            value, 1.0, 0.2
        ]);
    }



    map.on('zoom', function() {
        var zoom = map.getZoom();
        console.log(zoom)
    });

    map.on('click', 'schools_data', function(e) {
        map.getCanvas().style.cursor = 'pointer';
        if (map.getZoom() > 12) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].properties.ownership + " " + e.features[0].properties.cadnum + "\n" + e.features[0].properties.category + "\n")
                .addTo(map);
        }
    });


    /*d3.select("#change_op").on("click", function() {
        console.log("Hello!")
        let selected_value = d3.select(this).attr("value");
        change_op(selected_value)
    })*/

    d3.select("#change_op").on("click", function() {
        console.log("All_objects")
        map.removeLayer('schools_data');
        redrawUkraineMap()
    })

    d3.select("#ukraine-switch-buttons").selectAll(".map_button").on("click", function() {
        let selected_value = d3.select(this).attr("value");
        d3.select(this.parentNode).selectAll(".map_button").classed("active", false);
        d3.select(this).classed("active", true);
        change_op(selected_value)
    });


    d3.select("#rent-switch-buttons").selectAll(".map_button").on("click", function() {
        let selected_value = d3.select(this).attr("value");
        console.log("push rent-switch-buttons")
        d3.select(this.parentNode).selectAll(".map_button").classed("active", false);
        d3.select(this).classed("active", true);
        change_rent(selected_value)
    });




    redrawUkraineMap()

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

}); //end of Ukraine map
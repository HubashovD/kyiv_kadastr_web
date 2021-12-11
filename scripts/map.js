var default_zoom_u = window.innerWidth > 800 ? 11 : 14;

mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';

var map = new mapboxgl.Map({
    container: 'map',
    minZoom: 11,
    maxZoom: 16,
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

    map.addSource('border', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'https://HubashovD.github.io/kyiv_kadastr_web/vector_tiles/border_1.geojson'
    });

    var border = map.addLayer({
        'id': 'border_data',
        'minzoom': 11,
        'maxzoom': 16,
        'source': 'border',
        "type": "line",
        'line-width': 100,
        'paint': {
            "line-color": "#ce4066"
        }
    });

    console.log(border)

    function redrawUkraineMap() {
        map.addLayer({
            "id": "schools_data",
            'type': 'fill',
            'minzoom': 11,
            'maxzoom': 16,
            'source': "schools",
            "source-layer": "parcels_4326",
            "paint": {
                'fill-color': ['match', ['get', 'ownership'],
                    "Приватна власність",
                    'rgb(94,117,81)',
                    "Комунальна власність",
                    'rgb(162,89,95)',
                    "Державна власність",
                    'rgb(100,102,171)',
                    "Не визначено",
                    'rgb(239,233,172)',
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
        map.setPaintProperty("schools_data", 'fill-opacity', ['match', ['get', 'rent-renter'],
            value, 1.0, 0.2
        ]);
    }

    var comm_rent = function(selected_value) {
        console.log(selected_value)
        map.setPaintProperty("schools_data", 'fill-opacity', ['match', ['get', 'rent-rent_rent'], "rent", 1.0, 0.2]);
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
                .setHTML("<b>" + e.features[0].properties.ownership + "</b>" + "<br>" + e.features[0].properties.cadnum + "<br>" + e.features[0].properties.category + "<br><b>" + e.features[0].properties.area + " га")
                .addTo(map);
        }
    });


    /*d3.select("#change_op").on("click", function() {
        console.log("Hello!")
        let selected_value = d3.select(this).attr("value");
        change_op(selected_value)
    })*/

    d3.select("#change_op").on("click", function() {
        let selected_value = d3.select(this).attr("value");
        console.log(selected_value)
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

    d3.select("#comm_rent").on("click", function() {
        let selected_value = d3.select(this).attr("value");
        console.log(selected_value)
        d3.select(this.parentNode).selectAll(".map_button").classed("active", false);
        comm_rent(selected_value)
    })




    redrawUkraineMap()

    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

}); //end of Ukraine map
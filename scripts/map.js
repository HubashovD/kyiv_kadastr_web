var map = L.map('map', {
    zoomControl:true, maxZoom:16, minZoom:11
}).fitBounds([[50.2, 30.3], [50.6, 30.8]]);


map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
var bounds_group = new L.featureGroup([]);


var layer_OpenStreetMap_0 = L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png', {
    opacity: 1.0,
    attribution: '',
    minZoom: 10,
    maxZoom: 22,
    minNativeZoom: 0,
    maxNativeZoom: 19
});
map.addLayer(layer_OpenStreetMap_0);


var parcels = new L.geoJson();  
    console.log(parcels)

parcels.addTo(map);

$.ajax({
    dataType: "json",
    url: "./data/parcels.geojson",
    success: function(data) {
        $(data.features).each(function(key, data) {
            parcels.addData(data);
        });
    }
    }).error(function() {});




/* ******************************
*************Елемент 2 **********
******************************** */
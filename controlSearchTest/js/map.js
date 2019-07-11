var map = L.map('map', {
  zoomControl:false, maxZoom:20, minZoom:13,
  center: [51.5556, -0.0792],
  zoom: 15
});

//SCALE - Add scale to the map 

L.control.scale().addTo(map);

var OSM_street = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          fadeAnimation: false,
          opacity: 1,
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="https://mapbox.com">Mapbox</a>',
          maxZoom: 19,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoiaGFja25leWdpcyIsImEiOiJjajh2ZGRiMDMxMzc5MndwbHBmaGtjYTAyIn0.G75YwN8Zgr8gqDJoV8XMFw'
      });
map.addLayer(OSM_street);

$.ajax({
    url: 'config/mapdefinition.json',
    dataType: 'json',
    //data: { year: selectedYear },
    //context: {},
    success: function (data) {
      //var mapConfig = JSON.parse(data);
      var mapConfig = data;
      //load the data and create layers control
      //loadLayers(mapConfig);
      //load title panel
      //alert('loading map config: '+ mapConfig.name + '<br>Abstract: '+ mapConfig.abstract);
      //Add the Title Control with the Name and Abstract of the Map
      L.control.custom({
        position: 'topleft',
        collapsed:true,
        content : '<strong>' + mapConfig.name + '</strong>' + '<br>'+ mapConfig.abstract,
        classes : 'leaflet-control-layers',
        style   :
        {
        margin: '10px',
        padding: '10px 17px 10px 17px'
        }
    })
    .addTo(map);
    // loadLayers(mapConfig);
    // var controlLegend = L.easyButton('fa-angle-double-down', function (btn, map) {
    //   //createSearchBox(mapConfig);
    //   loadLayers(mapConfig);
    // },
    // { position: 'topleft' });
//Add easy button Zoom to Extent to the map
//map.addControl(controlLegend);
    
    //load layers and create controls based on map config
    loadLayers(mapConfig);
    }
  });




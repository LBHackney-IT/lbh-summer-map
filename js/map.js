
var map = L.map('map', {
    zoomControl:false, maxZoom:22, minZoom:13,
    center: [51.5490, -0.077928], 
    // maxBounds: [
    //   //south west
    //   [51.5118, -0.109045],
    //   //north east
    //   [51.590292, -0.034544]
    //   ], 
    zoom: 13
});

//Limit the view to the extend of the map
 map.setMaxBounds(map.getBounds());

//SCALE - Add scale to the map 

L.control.scale().addTo(map);


// -------------------------------------------------------------------------------------------------------------
//basemap ZoomStack

/*
var OSZoomStack = L.tileLayer('https://api.mapbox.com/styles/v1/hackneygis/cjk8lmw5r9mlz2sohv2n6xnfq/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGFja25leWdpcyIsImEiOiJjajh2ZGRiMDMxMzc5MndwbHBmaGtjYTAyIn0.G75YwN8Zgr8gqDJoV8XMFw', {
   opacity: 1.0,
   maxZoom: 18,
});
map.addLayer(OSZoomStack);

// -------------------------------------------------------------------------------------------------------------
//basemap MasterMap


var OSMM_light = L.tileLayer.wms("https://map.hackney.gov.uk/geoserver/wms", {
   layers: 'osmm:OSMM_outdoor',
   format: 'image/png',
   minZoom: 19,
   maxZoom: 20,
});

map.addLayer(OSMM_light);
*/


var OSM_street = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            fadeAnimation: false,
            opacity: 1,
            attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
            maxZoom: 19,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiaGFja25leWdpcyIsImEiOiJjajh2ZGRiMDMxMzc5MndwbHBmaGtjYTAyIn0.G75YwN8Zgr8gqDJoV8XMFw'
        });
map.addLayer(OSM_street);


//add Hackney boundary
var hackney_bdy_layer = L.tileLayer.wms("https://map.hackney.gov.uk/geoserver/wms", {
        layers: 'boundaries:hackney',
        transparent: true,
        format: 'image/png'
      
      });
map.addLayer(hackney_bdy_layer);

// -------------------------------------------------------------------------------------------------------------
// NAVIGATIONS AND CONTROL TOOLS

//ZOOM CONTROL - change zoom control to the right
L.control.zoom({
  position:'topright'
}).addTo(map);

// ZOOM TO CURRENT LOCATION - Zoom to current location tool using Locate

var currentLocation = L.control.locate({
      position: 'topright',
      strings: {
          title: "Zoom to my current location"
      }
  }).addTo(map);

  // -------------------------------------------------------------------------------------------------------------
  // ZOOM TO HACKNEY EXTENT - Zoom to Hackney Extent using easyButton

var ZoomToExtent = L.easyButton('fa-globe', function (btn, map) {
    map.setView([51.5490, -0.077928],13);
},
{ position: 'topright' });
//Add easy button Zoom to Extent to the map
map.addControl(ZoomToExtent);

// -------------------------------------------------------------------------------------------------------------
/////Load config file and do everything that depends on configuration

/*
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var mapConfig = JSON.parse(this.responseText);
    //load the data and create layers control
    loadLayers(mapConfig);
    //load title panel
    //var mapName = mapConfig.name; 
    //var mapAbstract = mapConfig.name; 
    alert('loading map config: '+ mapConfig.name + '<br>Abstract: '+ mapConfig.abstract);
  }
};
xmlhttp.open("GET", "http://localhost/PublicMappingPlatform/config/mapdefinition.json", true);
xmlhttp.send();
*/
/*
$.ajax({
  url: 'config/mapdefinition.json',
  dataType: 'json',
  //data: { year: selectedYear },
  //context: {},
  success: function (data) {
    //var mapConfig = JSON.parse(data);
    var mapConfig = data;
    //load the data and create layers control
    loadLayers(mapConfig);
    //load title panel
    alert('loading map config: '+ mapConfig.name + '<br>Abstract: '+ mapConfig.abstract);
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
  }
});*/

 // -------------------------------------------------------------------------------------------------------------
  // ZOOM TO HACKNEY EXTENT - Zoom to Hackney Extent using easyButton
  
  /*$.ajax({
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
    */

  //Add map title in a separate div
  $.ajax({
      url: 'config/mapdefinition.json',
      dataType: 'json',
      //data: { year: selectedYear },
      //context: {},
      success: function (data) {
        //var mapConfig = JSON.parse(data);
        var mapConfig = data;
        //alert('loading map config: '+ mapConfig.name + '<br>Abstract: '+ mapConfig.abstract);
        // $("#map-title").html("<br />");
        // $("#map-title").append('<strong>' + mapConfig.name + '</strong>' + '<br>'+ mapConfig.abstract);
        // $("#map-title").addClass("maptitle");
        loadLayers(mapConfig);
        }     
});

var $bottomBar = $('.map-bottom-bar');

$bottomBar.on('click', (e) => {
  if (window.matchMedia('min-width: 768px').matches) {
    return false;
  } else {
    $bottomBar.toggleClass('map-bottom-bar--open');
  }
});

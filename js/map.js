var map = L.map('map', {
  zoomControl:false, maxZoom:19, minZoom:12,
  center: [51.5490, -0.077928], 
  zoom: 13
});

//set correct initial view on mobile
var width = document.documentElement.clientWidth;
if (width < 768) {
  // set the zoom level to 12 on mobile
  map.setView([51.5490, -0.059928], 11);
}

// event that change the zoom level on mobile
window.addEventListener('resize', function(event){
  // get the width of the screen after the resize event
  var width = document.documentElement.clientWidth;
  if (width < 768) {
    // set the zoom level to 12 on mobile
    map.setZoom(11);
  }  else {
    // set the zoom level to 13. It is the default on desktop and tablets
    map.setZoom(13);
  }
});


//SCALE - Add scale to the map 
L.control.scale().addTo(map);


var OSM_street = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  fadeAnimation: false,
  opacity: 1,
  attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
  maxZoom: 19,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiaGFja25leWdpcyIsImEiOiJjajh2ZGRiMDMxMzc5MndwbHBmaGtjYTAyIn0.G75YwN8Zgr8gqDJoV8XMFw'
});
map.addLayer(OSM_street);


//add Hackney mask
var hackney_mask = L.tileLayer.wms("https://map.hackney.gov.uk/geoserver/wms", {
  layers: 'boundaries:hackney_mask',
  transparent: true,
  format: 'image/png'
});
map.addLayer(hackney_mask);



// -------------------------------------------------------------------------------------------------------------
// NAVIGATIONS AND CONTROL TOOLS

//ZOOM CONTROL - change zoom control to the right and disable on mobile
if (!L.Browser.mobile) {
  L.control.zoom({position: 'topright'}).addTo(map);
}


// ZOOM TO CURRENT LOCATION - Zoom to current location tool using Locate
//var currentLocation = L.control.locate({
//    position: 'topright',
//    strings: {
//        title: "Zoom to my current location"
//    }
//}).addTo(map);

var currentLocation2 = L.easyButton('fa-location', function (btn, map) {
    map.locate({
        setView: false,
        timeout: 5000,
        maximumAge: 0,
        maxZoom: 16
    });
}, { position: 'topright' }
).addTo(map);


function onLocationFound(e) {
    var radius = e.accuracy;
    //L.marker(e.latlng).addTo(map);
    L.circle(e.latlng, radius).addTo(map);
    console.log('youhou'+e.latlng);
}

map.on('locationfound', onLocationFound);


//map.on('locationfound', function (e) {
//          console.log('located but are you in Hackney?');
//          map.setZoom(16);
//          console.log(e.latlng);
//          var hackneyBounds = L.bounds([51.517787, -0.097059], [51.580648, -0.009090]);
//          //var hackneyBounds = L.bounds([51.517787, -0.097059], [51.518, -0.096]);
//          if (hackneyBounds.contains([e.latlng.lat, e.latlng.lng])) {
//              console.log('yes');
//          }
//          else {
//              alert('Love Summer only covers Hackney');
//              if (width < 768) {
//                  // set the zoom level to 12 on mobile
//                  map.setView([51.5490, -0.059928], 11);
//              }
//              else {
//                  // set the zoom level to 12 on mobile
//                  map.setView([51.5490, -0.077928], 13);
//              }
         
//          }

//        });

// -------------------------------------------------------------------------------------------------------------
// ZOOM TO HACKNEY EXTENT - Zoom to Hackney Extent using easyButton (on desktop only)
if (!L.Browser.mobile) {
  L.easyButton('fa-globe', function (btn, map) {
      map.setView([51.5490, -0.077928], 13);
    }, { position: 'topright' }
  ).addTo(map);
}

//Add map title in a separate div
$.ajax({
  url: 'config/mapdefinition.json',
  dataType: 'json',
  success: function (data) {
    var mapConfig = data;
    loadLayers(mapConfig);
  }     
});

var CONTROLS_OPEN_CLASS = 'map-controls--open';
var $sidebarToggle = $('.map-sidebar-toggle');
var $controls = $('.map-controls');

$sidebarToggle.on('click', (e) => {
  if (window.matchMedia('min-width: 768px').matches) {
    return false;
  } else {
    $controls.toggleClass(CONTROLS_OPEN_CLASS);
  }
});

$('#map').on('click', () => {
  $controls.removeClass(CONTROLS_OPEN_CLASS);
});

var map = L.map('map', {
  zoomControl:false, maxZoom:19, minZoom:12,
  center: [51.5490, -0.077928], 
  zoom: 13
});

var isMobile = !window.matchMedia('(min-width: 768px)').matches;
if (isMobile) {
  map.setView([51.5490, -0.059928], 11);
}

// On resize if we switch between mobile and desktop views then rezoom/centre the map
window.addEventListener('resize', function(event){
  var mq = window.matchMedia('(min-width: 768px)');
  if (mq.matches && isMobile) {
    // set the zoom level to 13 on desktop
    map.setView([51.5490, -0.077928], 13);
    isMobile = false;
  }  else if (!mq.matches && !isMobile) {
    // set the zoom level to 11 on mobile
    map.setView([51.5490, -0.059928], 11);
    isMobile = true;
  }
});


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

function setZoom() {
  if (window.matchMedia('(min-width: 768px)').matches) {
    // set the zoom level to 13 on desktop
    map.setView([51.5490, -0.077928], 13);
  }  else {
    // set the zoom level to 11 on mobile
    map.setView([51.5490, -0.059928], 11);
  }
}

//utility to clear all layers except from basemapand hackney mask/boundary
function clearMap() {
    map.eachLayer(function (layer) {
        if (layer != OSM_street & layer != hackney_mask) {
            map.removeLayer(layer);
        }
    });

    $controls.removeClass(CONTROLS_OPEN_CLASS);
    setZoom();
}

// -------------------------------------------------------------------------------------------------------------
// NAVIGATIONS AND CONTROL TOOLS

//ZOOM CONTROL - change zoom control to the right and disable on mobile
if (!L.Browser.mobile) {
  L.control.zoom({position: 'topright'}).addTo(map);
}

var currentLocation2 = L.easyButton('fa-location', function (btn, map) {
    //define listener
    function onLocationFoundViaControl(e) {
        if (locateCircle != null) {
            map.removeLayer(locateCircle);
        }
        locateCircle = L.circleMarker(e.latlng).addTo(map);

        var hackneyBounds = L.bounds([51.517787, -0.097059], [51.580648, -0.009090]);
        //var hackneyBounds = L.bounds([51.517787, -0.097059], [51.518, -0.096]);
        if (hackneyBounds.contains([e.latlng.lat, e.latlng.lng])) {
            map.setView([e.latlng.lat, e.latlng.lng], 16);
        } else {
            alert('Love Summer only covers Hackney');
            setZoom();
        }
        //stop listening
        map.off('locationfound', onLocationFoundViaControl);
    }

    //add listener
    map.on('locationfound', onLocationFoundViaControl);

    map.locate({
        setView: false,
        timeout: 5000,
        maximumAge: 0,
        maxZoom: 16
    });
},'Show me where I am',{position: 'topright',}).addTo(map);


//prepare marker and event for geolocation
var locateCircle = null;
map.on('locationerror', function (e) {
    alert('Love Summer cannot find your location. Please enable Location Services for your browser in Settings or try again outside of your office as your network may block geolocation.');
});



// -------------------------------------------------------------------------------------------------------------
// ZOOM TO HACKNEY EXTENT - Zoom to Hackney Extent using easyButton (on desktop only)
if (!L.Browser.mobile) {
  L.easyButton('fa-globe', function (btn, map) {
      map.setView([51.5490, -0.077928], 13);
    }, 'Zoom to all Hackney',{position: 'topright',}).addTo(map);
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
  if (window.matchMedia('(min-width: 768px)').matches) {
    return false;
  } else {
    $controls.toggleClass(CONTROLS_OPEN_CLASS);
  }
});

$('#map').on('click', () => {
  $controls.removeClass(CONTROLS_OPEN_CLASS);
});

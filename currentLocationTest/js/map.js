
        var map = L.map('map', {
            zoomControl:true, maxZoom:20, minZoom:13,
			center: [51.5556, -0.0792],
			zoom: 15
        });
		
		L.control.scale().addTo(map);
		
        // -------------------------------------------------------------------------------------------------------------
        

        // -------------------------------------------------------------------------------------------------------------
        //basemap ZoomStack

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

        // -------------------------------------------------------------------------------------------------------------
        //Geolocation works ok. Needs to be added as an event when clicking on the right icon. Icon is still in progress. 

       
        navigator.geolocation.getCurrentPosition(function(position) {
                console.log('Lat: ' + position.coords.latitude);
                console.log('Long: ' + position.coords.longitude);
              // this is just a marker placed in that position
              var currentLocation = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
              // move the map to have the location in its center
              map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
        }); 

        
        // -------------------------------------------------------------------------------------------------------------
        // Current Location Icon 

        L.control.custom({
            position: 'topright',
            content : '<button type="button" class="btn btn-default">'+
                      '    <i class="fa fa-crosshairs"></i>'+
                      '</button>',
        })
        .addTo(map);

        // -------------------------------------------------------------------------------------------------------------
        // Map title

       L.control.custom({
        position: 'topleft',
        collapsed:true,
        content : '<table cellpadding="0"><tr><td><strong>TITLE OF THE MAP</strong></td><td align="right" valign="top"></td><tr><td colspan="2"> This map shows summer events...</td></tr></table>',
        classes : 'leaflet-control-layers',
        style   :
        {
        margin: '10px',
        padding: '10px 17px 10px 17px'
        }
    })
    .addTo(map);


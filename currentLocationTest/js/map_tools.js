
        var map = L.map('map', {
            zoomControl:false, maxZoom:20, minZoom:13,
			center: [51.5556, -0.0792],
			zoom: 15
        });

        //change zoom control to the right
        L.control.zoom({
            position:'topright'
        }).addTo(map);
       
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

    // -------------------------------------------------------------------------------------------------------------
    // Zoom to current location tool

    var currentLocation = L.control.locate({
        position: 'topright',
        strings: {
            title: "Zoom to my current location"
        }
    }).addTo(map);

    // -------------------------------------------------------------------------------------------------------------
    // Zoom to Hackney Extent


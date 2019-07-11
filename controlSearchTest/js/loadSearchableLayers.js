
//constants 
var owsrootUrl = 'https://map.hackney.gov.uk/geoserver/ows';

var defaultParameters = {
    service : 'WFS',
    version : '2.0',
    request : 'GetFeature',
    typeName : '<WORKSPACE:LAYERNAME - CHANGEME>',
    outputFormat : 'text/javascript',
    format_options : 'callback:getJson',
    SrsName : 'EPSG:3857'
};

function length(obj) {
    return Object.keys(obj).length;
} 

function loadLayers(mapConfig){
	console.log(mapConfig.searchablelayers);
	console.log(mapConfig.searchablelayers.length);


//count layers
var nbLayers = 0;
var nbLoadedLayers = 0;

for (var i=0 ; i<mapConfig.searchablelayers.length ; i++){
	//for each layer in this group
	for (var j=0 ; j<mapConfig.searchablelayers[i].layers.length ; j++){
		nbLayers ++;
	}
}

console.log('to load: '+ nbLayers);



	var layersList = [];
	var layerGroupsList = [];
	var layergroup;
	//var layer;
	var layername;

/*create a list of loading objects with key-values
group name:
layer name:
layer:
loaded:
// */

var loadingTable = [];
//var loadingLayer;
loadingTable.push({
			layername: mapConfig.searchablelayers.geoserverLayerName,
			layertitle: mapConfig.searchablelayers.title,
			layer: null,
			isloaded: false,
			method: 'wfs'
	});


for (var index in loadingTable){
	loadingLayer = loadingTable[index];
	console.log(loadingLayer.layername);
	console.log(loadingLayer.isloaded);

	// now try load it

}
//load each layer in loadingTable

	//for each group in the config file
	for (var i=0 ; i<mapConfig.searchablelayers.length ; i++){
		
		layersList = [];

		//create group with this new empty list of layers
		layergroup = {
			group: mapConfig.searchablelayers[i].name,
			collapsed: false,
			layers: layersList
		};
		
	
		//for each layer in this group
		for (var j=0 ; j<mapConfig.searchablelayers.length ; j++){
			//create wms layer
			
			layer = L.tileLayer.wms("https://map.hackney.gov.uk/geoserver/wms", {
   				layers: mapConfig.searchablelayers.geoserverLayerName,
   				transparent: true,
   				format: 'image/png'
   			
   			});

   			layersList.push({
   				active: false,
				name: mapConfig.searchablelayers.title + '<a href=""> [i] </a>' ,
				icon: '<i class="icon icon-drinking_water"></i>',
				layer: layer
   			});

   			//create geojson layer
   			
			
   			var ajax = $.ajax({
    			url : "https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+mapConfig.searchablelayers.geoserverLayerName+"&outputFormat=text/javascript&SrsName=EPSG:3857&format_options=callback:getJson",
    			dataType : 'jsonp',
    			//jsonp: false,
    			jsonpCallback : 'getJson',
    			success : function (response) {
        			layer = L.geoJson(response);
        			nbLoadedLayers = nbLoadedLayers + 1;
        			console.log('rappel goal: '+ nbLayers);
        			console.log('loaded: '+ nbLoadedLayers);
        		}

			});



    		
    		var url="http://localhost:8080/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+mapConfig.searchablelayers.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
    		var iconn=mapConfig.searchablelayers.icon;
    		
    		
//with context
		$.ajax({
            url: url,
            dataType: 'json',
            //data: { year: selectedYear },
            context: {
            	layername: mapConfig.searchablelayers[i].title,
            	layergroup: mapConfig.searchablelayers[i].name,
            	markericon: mapConfig.searchablelayers[i].icon,
            	markercolour: mapConfig.searchablelayers[i].markercolour
            },
            success: function (data) {
                var layername = this.layername; // get from context
                var layergroup = this.layergroup;
                var markericon = this.markericon;
                var markercolour = this.markercolour;
                var layer = new L.GeoJSON(data, { 
    				pointToLayer: function (feature, latlng) {
        				//return L.marker(latlng);
        				 return L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: markericon, prefix: 'fa', markerColor: markercolour, spin:false}) });
        			},
        			onEachFeature: function (feature, layer) {
                 		console.log('feature read');
                 	}
        		});
        		
        		//find the list corresponding to the right layergroup and add the layer to it
        		for (var index in layerGroupsList){
        			if (layerGroupsList[index].group == this.layergroup){
        				layerGroupsList[index].layers.push({
   							active: false,
							name: '   '+layername,
							icon: '<i class="fas fa-'+markericon+'"></i>  ',
							layer: layer
						});
					}
        		};
        		

				nbLoadedLayers ++;
				if (nbLoadedLayers == nbLayers){
        				createControl(layerGroupsList);
        		}
    		}
        });

   			
   			
			
		
		}//end j
	}//end i

	function createControl(layerGroupsList){
		var panelLayers = new L.Control.PanelLayers([],layerGroupsList, {
			compact: false,
			collapsed: false,
			collapsibleGroups: true
		});
	
		map.addControl(panelLayers);

    }

	//create panel layer control and add to map
	
	//simple layer control-L.control.layers(null, overlays).addTo(map);
}


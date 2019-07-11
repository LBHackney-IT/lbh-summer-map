//console.log('tralala');

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


xmlhttp.open("GET", "config/mapdefinition.json", true);
xmlhttp.send();
*/

//constants 
var owsrootUrl = 'https://map.hackney.gov.uk/geoserver/ows';



//READ MAP CONFIG, LOAD ALL LAYERS, PUT THEM IN GROUPS, CREATE ONE LAYER CONTROL AND ONE EASYBUTTON PER GROUP

function loadLayers(mapConfig){
console.log(mapConfig.layergroups);
console.log(mapConfig.layergroups.length);


//count layers so we can tell if everything has been loaded later
var nbLayers = 0;
var nbLoadedLayers = 0;

for (var i=0 ; i<mapConfig.layergroups.length ; i++){
//for each layer in this group
for (var j=0 ; j<mapConfig.layergroups[i].layers.length ; j++){
nbLayers ++;
}
}

//console.log('to load: '+ nbLayers);


//
var layersList = [];
var layerGroupsList = [];
var layergroup;
var layername;

/*create a list of loading objects with key-values
group name:
layer name:
layer:
loaded:
*/

/*
var loadingTable = [];
//var loadingLayer;
for (var i=0 ; i<mapConfig.layergroups.length ; i++){
//for each layer in this group
for (var j=0 ; j<mapConfig.layergroups[i].layers.length ; j++){
loadingTable.push({
	groupname: mapConfig.layergroups[i].name,
	layername: mapConfig.layergroups[i].layers[j].geoserverLayerName,
	layertitle: mapConfig.layergroups[i].layers[j].title,
	layer: null,
	isloaded: false,
	method: 'wfs'
});
//nbLayers ++;
}
}
*/
/*
for (var index in loadingTable){
loadingLayer = loadingTable[index];
console.log(loadingLayer.layername);
console.log(loadingLayer.isloaded);

// now try load it

}
//load each layer in loadingTable
*/

//for each group in the config file
for (var i=0 ; i<mapConfig.layergroups.length ; i++){
console.log('layer group: ' + mapConfig.layergroups[i].name);
console.log('nb layers in group = '+ mapConfig.layergroups[i].layers.length);

//create an empty list of layers for  group i
layersList = [];

//crate layergroup object with this new empty list of layers
layergroup = {
	group: mapConfig.layergroups[i].name,
  groupIcon: mapConfig.layergroups[i].groupicon,
  collapsed: false,
  layers: layersList,
  groupEasyButton: null,
  //control: new L.control.layers(null, {}, {collapsed: false}),
  control: null,
  overlayMaps: {}
};

layerGroupsList.push(layergroup);

//for each layer in this group
for (var j=0 ; j<mapConfig.layergroups[i].layers.length ; j++){
	//create wms layer
	/*
	layer = L.tileLayer.wms("https://map.hackney.gov.uk/geoserver/wms", {
				layers: mapConfig.layergroups[i].layers[j].geoserverLayerName,
				transparent: true,
				format: 'image/png'
			
			});

			layersList.push({
				active: false,
		name: mapConfig.layergroups[i].layers[j].title + '<a href=""> [i] </a>' ,
		icon: '<i class="icon icon-drinking_water"></i>',
		layer: layer
			});
*/
			//create geojson layer
			
	/*
			var ajax = $.ajax({
			url : "https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+mapConfig.layergroups[i].layers[j].geoserverLayerName+"&outputFormat=text/javascript&SrsName=EPSG:3857&format_options=callback:getJson",
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
*/


var url="http://lbhgiswebt01/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+mapConfig.layergroups[i].layers[j].geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";

		//var url="http://localhost:8080/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+mapConfig.layergroups[i].layers[j].geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
		//var iconn=mapConfig.layergroups[i].layers[j].icon;
		
		// without inline closure
		
	/*$.getJSON(url, function (data) {
    		layer = new L.GeoJSON(data);
		}).done(function () {
    		console.log('$.getJSON Done!');
    		nbLoadedLayers ++;
    		console.log('rappel goal: '+ nbLayers);
    		console.log('loaded: '+ nbLoadedLayers);
    		layersList.push({
					active: false,
			name: mapConfig.layergroups[i].layers[j].title + '<a href=""> [i] </a>' ,
			icon: '<i class="icon icon-drinking_water"></i>',
			layer: layer
				});
    		if (nbLoadedLayers==nbLayers){
    			createControl(layerGroupsList);
    		}

		}).fail(function () {
    		console.log('$.getJSON Fail!');
		});
*/

//send an ajax query to load WFS layer
//with context
$.ajax({
url: url,
dataType: 'json',
        /* context freezes the values associated to indexes i and j. This way, when the ajax query succeeds, 
        it will use the values as they were when the query was created, and not the values associated to 'current' i and j.
        */ 
        context: {
        	layername: mapConfig.layergroups[i].layers[j].title,
        	layergroup: mapConfig.layergroups[i].name,
        	markericon: mapConfig.layergroups[i].layers[j].icon,
        	markercolour: mapConfig.layergroups[i].layers[j].markercolour
        },
        
        //success: create a layer from json
        success: function (data) {
            var layername = this.layername; // get from context
            var layergroup = this.layergroup;
            var markericon = this.markericon;
            var markercolour = this.markercolour;
            var layer = new L.GeoJSON(data, { 

              pointToLayer: function (feature, latlng) {       
                return L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: markericon, prefix: 'fa', markerColor: markercolour, spin:false}) });
              },

              onEachFeature: function (feature, layer) {
               console.log('feature read');
                //here need to cretae a popup
              }
              
            });


    		//find the parent group of this layer and add the layer to it
    		for (var index in layerGroupsList){
    			if (layerGroupsList[index].group == this.layergroup){
    			 layerGroupsList[index].layers.push(layer);

           var legendEntry = '<i class="fas fa-'+markericon+'"></i>        '+ layername;
            //layerGroupsList[index].control.addOverlay(layer, legendEntry);
            layerGroupsList[index].overlayMaps[legendEntry] = layer;
            //layerGroupsList[index].control = L.control.layers(null, layerGroupsList[index].overlayMaps, {collapsed: false, position:'topleft'});
          }
        }

      //check if all the layers have now been loaded. 
      //If yes, we can add the easybuttons and the layer controls for all groups 
      nbLoadedLayers ++;
      if (nbLoadedLayers == nbLayers){
        createControls(layerGroupsList);
      }
    }
  });
}//end j
}//end i
}//end loadLayers

//create controls for each group of layers. All the layers in all groups must have been loaded. 
function createControls(layerGroupsList){


for (var index in layerGroupsList){

  layerGroupsList[index].control = L.control.layers(null, layerGroupsList[index].overlayMaps, {collapsed: false, position:'topleft'});
  //map.addControl(layerGroupsList[index].control);
  createGroupEasyButton(layerGroupsList[index], layerGroupsList);
  //layerGroupsList[index].groupEasyButton = L.easyButton(layerGroupsList[index].groupIcon, function(btn, map, ind){
     //map.addControl(groupControl);
     //alert ('I am the easybutton of ' + layerGroupsList[ind].group);
   }
  //layerGroupsList[index].groupEasyButton.addTo(map);
}

//create one easy button for one group of layers
function createGroupEasyButton(layerGroup, layerGroupsList){
  layerGroup.groupEasyButton = L.easyButton(layerGroup.groupIcon, function(btn, map){
    //remove all controls and all associated layers
    for (var index in layerGroupsList){
      map.removeControl(layerGroupsList[index].control);
      for (var layerindex in layerGroupsList[index].layers){
        map.removeLayer(layerGroupsList[index].layers[layerindex]);
      }
    }
    
    //add the single control we want
    map.addControl(layerGroup.control);
    //alert ('I am the easybutton of ' + layerGroup.group);
  });
  
  //add easybutton
  layerGroup.groupEasyButton.addTo(map);

}

// for (var index in layerGroupsList){
//   var groupControl = layerGroupsList[index].control;
//   var groupicon = layerGroupsList[index].groupIcon;
//   var button = new L.easyButton(groupicon, function(btn, map){
//     map.addControl(groupControl);
//   });
//   button.addTo(map);      
// }


//create panel layer control and add to map

//simple layer control-L.control.layers(null, overlays).addTo(map);



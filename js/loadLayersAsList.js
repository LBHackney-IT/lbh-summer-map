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
// var owsrootUrl = 'https://map.hackney.gov.uk/geoserver/ows';


var leafletMarkerColours = {
	"green": "#70ad26",
  "blue": "#34a1d2",
  "orange":"#f69730",
  "red": "#d43e2a",
  "yellow": "#cbc529",
  "violet": "#9d2ccc",
  "grey": "#797979",
  "black":"#3b3b3b"
}

//READ MAP CONFIG, LOAD ALL LAYERS, PUT THEM IN GROUPS, CREATE ONE LAYER CONTROL AND ONE EASYBUTTON PER GROUP

function loadLayers(mapConfig){
console.log(mapConfig.layergroups);
console.log(mapConfig.layergroups.length);


//count layers so we can tell if everything has been loaded later
var nbLayers = mapConfig.layers.length;
var nbLoadedLayers = 0;

//console.log('to load: '+ nbLayers);


//
var layer;
var layers = [];
var layername;
var layergroup;
var layerGroups = [];
var layersInGroup = [];
var layercontrol; //= new L.control.layers(null, {}, {collapsed: false});
var overlayMaps = {};




//for each group in the config file
for (var i=0 ; i<mapConfig.layergroups.length ; i++){
  console.log('layer group: ' + mapConfig.layergroups[i].name);
  //crate layergroup object with this new empty list of layers
  layergroup = {
    group: mapConfig.layergroups[i].name,
    groupIcon: mapConfig.layergroups[i].groupicon,
    groupText: mapConfig.layergroups[i].grouptext,
    collapsed: false,
    layersInGroup: [],
    groupEasyButton: null,
    //control: new L.control.layers(null, {}, {collapsed: false}),
    //control: null,
    //overlayMaps: {}
  };
  layerGroups.push(layergroup);
}


//for each layer in the config file

for (var i=0 ; i<mapConfig.layers.length ; i++){
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


  var configlayer = mapConfig.layers[i];
  var url="http://lbhgiswebt01/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configlayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";

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
        	configlayer: configlayer,
          layercontrol: layercontrol,
          overlayMaps: overlayMaps,
          layerGroups: layerGroups,
          layers: layers
          //layername: mapConfig.layers[i].title,
        	//layergroup: mapConfig.layers[i].groups,
        	//markericon: mapConfig.layers[i].icon,
        	//markercolour: mapConfig.layers[i].markercolour,
          //popuptitlefield: mapConfig.layers[i].popup.popuptitlefield,
          //popupfields: mapConfig.layers[i].popup.popupfields
        },
        
        //success: create a layer from json
        success: function (data) {
            // var layername = this.layername; // get from context
            // var layergroup = this.layergroup;
            // var markericon = this.markericon;
            // var markercolour = this.markercolour;
            // var popuptitlefield = this.popuptitlefield;
            // var popupfields = this.popupfields;
            var layername = this.configlayer.title; // get from context
            var parentgroups = this.configlayer.groups;
            var sortorder = parseInt(this.configlayer.sortorder);
            var markericon = this.configlayer.icon;
            var markercolour = this.configlayer.markercolour;
            var popuptitlefield = this.configlayer.popup.popuptitlefield;
            var popupfields = this.configlayer.popup.popupfields;
            var layercontrol = this.layercontrol;
            var overlayMaps = this.overlayMaps;
            var layerGroups = this.layerGroups;
            var layers = this.layers;
            var layer = new L.GeoJSON(data, { 

              pointToLayer: function (feature, latlng) {      
                //create marker 
                var marker = L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: markericon, prefix: 'fa', markerColor: markercolour, spin:false}) });
                //var marker = L.marker(latlng);
                return marker;               
                //return L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: markericon, prefix: 'fa', markerColor: markercolour, spin:false}) });
              },

              onEachFeature: function (feature, layer) {
               console.log('feature read');
                //here need to cretae a popup
                //popupOptions = {maxWidth: 200};
                
                var stringpopup = '';
                // put the title field at the top of the popup in bold. If there is none in the config, just use the layer title instead
                if (popuptitlefield != ''){
                  stringpopup = '<b><center>'+feature.properties[popuptitlefield]+'</center></b>';
                }
                else {
                  stringpopup = '<b><center>'+layername+'</center></b>';
                }
                //loop through the fields defined in the config and add them to the popup
                for (var i in popupfields){
                  //if there are popup fields in the map config
                  if (feature.properties[popupfields[i]] != ''){
                    //if there is a value for that field
                    if (feature.properties[popupfields[i].fieldname] != ''){
                      //if there is a label for this field in the config
                      if (popupfields[i].fieldlabel != ''){
                        stringpopup = stringpopup + '<br><b>'+popupfields[i].fieldlabel + '</b>: '+ feature.properties[popupfields[i].fieldname] ;
                      }
                      else {
                        stringpopup = stringpopup + '<br>'+ feature.properties[popupfields[i].fieldname] ;
                      }
                    }                   
                  }                 
                }
                layer.bindPopup(stringpopup);
              },
              sortorder: sortorder
              
            });
            
            //add layer to a list which doesn't take into account groups
            layers.push(layer);
            //prepare entry for layercontrol
            var legendEntry = '<i class="fas fa-'+markericon+'" style="color:' + leafletMarkerColours[markercolour] + '"></i>        '+ layername;
            overlayMaps[legendEntry] = layer;


    		    //find the parent group(s) of this layer and add the layer to it
    		    for (var k in parentgroups){
              for (var l in layerGroups){
                if (layerGroups[l].group == parentgroups[k]){
                  layerGroups[l].layersInGroup.push(layer);
                }
              }
            }

          //check if all the layers have now been loaded. 
          //If yes, we can add the easybuttons and the layer controls for all groups 
          nbLoadedLayers ++;
          if (nbLoadedLayers == nbLayers){
            //add the layer control and keep the javascript object
            var layercontrol = createControl(overlayMaps);
            //var layercontrol = createEmptyControl();
            //create easy buttons for each group
            for (var n in layerGroups){
              //createEasyButtons(layerGroups[n], layers, layercontrol, n);
              createEasyButtons(layerGroups[n], layers, overlayMaps, layercontrol, n);
            }
            
          }
        }//end success    
      });//end ajax
    } //end i
}//end loadLayers

//create control with all layers from all groups


//create controls for each group of layers. All the layers in all groups must have been loaded. 
function createEasyButtonsOld(layerGroup, layers, layercontrol, n){
  var button = document.createElement('button');
  button.classList.add('persona-button');
  button.setAttribute('id', 'persona-button-' + n)
  button.innerHTML = '<span class="button-icon"><img src=' + layerGroup.groupIcon + ' alt="' + layerGroup.groupText + '" /></span><span class="button-text">' + layerGroup.groupText + '</span>';
  var mapPersonas = document.getElementById('map-personas');
  mapPersonas.appendChild(button);
  $('#persona-button-' + n).on('click', function(){
    //Find the layer control, untick all layers and tick only the ones that are in that group 
    for (var j in layers){
      map.removeLayer(layers[j]);
    }
    if (layergroup.group != 'custom'){
      for (var k in layerGroup.layersInGroup){
      map.addLayer(layerGroup.layersInGroup[k]);
    }

    }
  });
    
    //add the single control we want
    //map.addControl(layerGroup.control);
    //alert ('I am the easybutton of ' + layerGroup.group)
    // layerGroup.groupEasyButton.addTo(map);
    
}


//create controls for each group of layers. All the layers in all groups must have been loaded. 
function createEasyButtons(layerGroup, layers, overlayMaps, layercontrol, n){
  var button = document.createElement('button');
  button.classList.add('persona-button');
  button.setAttribute('id', 'persona-button-' + n)
  button.innerHTML = '<span class="button-icon"><img src=' + layerGroup.groupIcon + ' alt="' + layerGroup.groupText + '" /></span><span class="button-text">' + layerGroup.groupText + '</span>';
  var mapPersonas = document.getElementById('map-personas');
  mapPersonas.appendChild(button);
  $('#persona-button-' + n).on('click', function(){
    //Find the layer control, untick all layers and tick only the ones that are in that group 
    for (var j in layers){
      map.removeLayer(layers[j]);
      //remove the corresponding entry in the layer control
      layercontrol.removeLayer(layers[j]);
    }
    
    for (var k in layerGroup.layersInGroup){
      if (layerGroup.group != 'custom'){
        map.addLayer(layerGroup.layersInGroup[k]);
      }

      for (var key in overlayMaps){

        //if (overlayMaps.hasOwnProperty(key)){
          //console.log(key, overlayMaps[key]);
          if (overlayMaps[key] == layerGroup.layersInGroup[k]){
                    console.log ("key = "+key);
            console.log("value = " + overlayMaps[key]);
            layercontrol.addOverlay(overlayMaps[key], key);
          } 
        //}
        
      }
    }
  });
    
    //add the single control we want
    //map.addControl(layerGroup.control);
    //alert ('I am the easybutton of ' + layerGroup.group)
    // layerGroup.groupEasyButton.addTo(map);
    
}
  
function createControl(overlayMaps){
    layercontrol = new L.control.layers(null, overlayMaps, {
        collapsed: false,
        sortLayers: true,
        sortFunction: function (a, b) {
            return a.options.sortorder - b.options.sortorder;
        }
    });
  map.addControl(layercontrol, {collapsed: false, position:'topleft'});
  var mapLegend = document.getElementById('map-legend');
  mapLegend.appendChild(layercontrol.getContainer());
  return layercontrol;
}

function createEmptyControl(){
  layercontrol = new L.control.layers(null, null, {collapsed: false});
  map.addControl(layercontrol, {collapsed: false, position:'topleft'});
  var mapLegend = document.getElementById('map-legend');
  mapLegend.appendChild(layercontrol.getContainer());
  return layercontrol;
}




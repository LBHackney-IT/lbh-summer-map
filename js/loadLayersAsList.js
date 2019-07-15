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
    "red": "#d43e2a",
    "orange": "#F69730",
    "green": "#70ad26",
    "blue": "#38aadd",
    "purple": "#D252BA",
    "darkred": "#a23336",
    "darkblue": "#0e67a3",
    "darkgreen": "#728224",
    "darkpurple": "#5b396b",
    "cadetblue": "#436978",
    "lightred": "#fc8e7f",
    "beige": "#ffcb92",
    "lightgreen": "#bbf970",
    "lightblue": "#8adaff",
    "pink": "#ff91ea",
    "lightgray": "#a3a3a3",
    "gray": "#575757",
    "black": "#3b3b3b"
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
  //Live
  var url="https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configlayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
  //Test
  //var url="http://lbhgiswebt01/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configlayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";

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
            //var sortorder = parseInt(this.configlayer.sortorder);
            var sortorder = this.configlayer.title;
            var markericon = this.configlayer.icon;
            var markercolour = this.configlayer.markercolour;
            var popuptitlefield = this.configlayer.popup.popuptitlefield;
            var popupfields = this.configlayer.popup.popupfields;
            var layercontrol = this.layercontrol;
            var overlayMaps = this.overlayMaps;
            var layerGroups = this.layerGroups;
            var layers = this.layers;
            var layer = new L.GeoJSON(data, { 
                //set colour and dasharray for lines
                color: leafletMarkerColours[markercolour],
                dashArray: '4',

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
                    stringpopup = '<center><b>'+feature.properties[popuptitlefield]+'</b></center>';
                }
                else {
                    stringpopup = '<center><b>' + layername +'</b></center>';
                }
                //loop through the fields defined in the config and add them to the popup
                for (var i in popupfields){
                  //if there are popup fields in the map config
                  if (feature.properties[popupfields[i]] != ''){
                    //if there is a value for that field
                    if (feature.properties[popupfields[i].fieldname] != ''){
                      //if there is a label for this field in the config
                      if (popupfields[i].fieldlabel != ''){
                          stringpopup = stringpopup + '<br><center><b>' + popupfields[i].fieldlabel + '</b>: ' + feature.properties[popupfields[i].fieldname] + '</center>';
                      }
                      else {
                          stringpopup = stringpopup + '<br><center>' + feature.properties[popupfields[i].fieldname] + '</center>';
                      }
                    }                   
                  }                 
                }
                var popup = L.popup({ closeButton: false }).setContent(stringpopup);
                layer.bindPopup(popup);
              },
              sortorder: sortorder
              
            });
            
            //add layer to a list which doesn't take into account groups
            layers.push(layer);
            var count = layer.getLayers().length;
            //prepare entry for layercontrol
            var legendEntry = '<i class="fas fa-'+markericon+'" style="color:' + leafletMarkerColours[markercolour] + '"></i><span class="control-text">'+ layername + '</span><span class="control-count">' + count + ' items shown</span>';
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
            //add the layer control and keep the layercontrol javascript object
            var layercontrol = createControl(overlayMaps);

            //create easy buttons for each group
            for (var n in layerGroups){
                //this function filters out layers in the layer control, showing only the relevant layers for this persona
                createEasyButtons(layerGroups[n], layers, overlayMaps, layercontrol, n, true);
            }           
          }
        }//end success    
      });//end ajax
    } //end i
}//end loadLayers


//create controls for each group of layers. All the layers in all groups must have been loaded. The last parameter is a boolean telling if all layers should stay in layer control or only the layers relevant to one group/persona
function createEasyButtons(layerGroup, layers, overlayMaps, layercontrol, n, keepAllInLayerControl){
  var button = document.createElement('button');
  button.classList.add('persona-button');
  button.setAttribute('id', 'persona-button-' + n)
  button.innerHTML = '<span class="button-icon"><img src=' + layerGroup.groupIcon + ' alt="' + layerGroup.groupText + '" /></span><span class="button-text">' + layerGroup.groupText + '</span>';
  var mapPersonas = document.getElementById('map-personas');
  mapPersonas.appendChild(button);
  $('#persona-button-' + n).on('click', function(e){
    e.stopPropagation();
    //Untick all layers and tick only the ones that are in that group 
    for (var j in layers){
        map.removeLayer(layers[j]);
        //if the keep option is set to false, remove the corresponding entry in the layer control
        if (!keepAllInLayerControl) {
            layercontrol.removeLayer(layers[j]);
        }
    }
    
    for (var k in layerGroup.layersInGroup){
      if (layerGroup.group != 'custom'){
        map.addLayer(layerGroup.layersInGroup[k]);
      }
      // if the keep option is set to false, we now need to re-add the layers to the control
      if (!keepAllInLayerControl) {
        for (var key in overlayMaps) {
          if (overlayMaps[key] == layerGroup.layersInGroup[k]){
            console.log ("key = "+key);
            console.log("value = " + overlayMaps[key]);
            layercontrol.addOverlay(overlayMaps[key], key);
          } 
        }        
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
            //return a.options.sortorder - b.options.sortorder;
            return a.options.sortorder.localeCompare(b.options.sortorder);
        }
    });
  map.addControl(layercontrol, {collapsed: false, position:'topleft'});
  var mapLegend = document.getElementById('map-legend');
  mapLegend.appendChild(layercontrol.getContainer());
  L.DomEvent.on(layercontrol.getContainer(), 'click', L.DomEvent.stopPropagation);
  return layercontrol;
}

function createEmptyControl(){
  layercontrol = new L.control.layers(null, null, {collapsed: false});
  map.addControl(layercontrol, {collapsed: false, position:'topleft'});
  var mapLegend = document.getElementById('map-legend');
  mapLegend.appendChild(layercontrol.getContainer());
  return layercontrol;
}




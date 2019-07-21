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

function loadLayers(mapConfig) {
  //count layers so we can tell if everything has been loaded later
  var nbLayers = mapConfig.layers.length;
  var nbLoadedLayers = 0;
  var layers = [];
  var layergroup;
  var layerGroups = [];
  var layercontrol; 
  var overlayMaps = {};

  //for each group in the config file
  for (var i=0 ; i<mapConfig.layergroups.length ; i++){
    //crate layergroup object with this new empty list of layers
    layergroup = {
      group: mapConfig.layergroups[i].name,
      groupIcon: mapConfig.layergroups[i].groupicon,
      groupText: mapConfig.layergroups[i].grouptext,
      collapsed: false,
      layersInGroup: [],
      groupEasyButton: null
    };
    layerGroups.push(layergroup);
  }


  //for each layer in the config file
  for (var i=0 ; i<mapConfig.layers.length ; i++) {
    var configlayer = mapConfig.layers[i];
    //Live
    var url="https://map.hackney.gov.uk/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configlayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
    //Test
    //var url="http://lbhgiswebt01/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+configlayer.geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";

    //var url="http://localhost:8080/geoserver/ows?service=WFS&version=2.0&request=GetFeature&typeName="+mapConfig.layergroups[i].layers[j].geoserverLayerName+"&outputFormat=json&SrsName=EPSG:4326";
    //var iconn=mapConfig.layergroups[i].layers[j].icon;

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
      },
      success: function (data) {
        var layername = this.configlayer.title; // get from context
        var parentgroups = this.configlayer.groups;
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
          color: leafletMarkerColours[markercolour],
          dashArray: '4',
          pointToLayer: function (feature, latlng) {      
            var marker = L.marker(latlng, {icon: L.AwesomeMarkers.icon({icon: markericon, prefix: 'fa', markerColor: markercolour, spin:false})});
            return marker;               
          },
          onEachFeature: function (feature, layer) { 
            var stringpopup = '';
            // put the title field at the top of the popup in bold. If there is none in the config, just use the layer title instead
            if (popuptitlefield != ''){
              stringpopup = '<center><b>'+feature.properties[popuptitlefield]+'</b></center>';
            } else {
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
        var legendEntry = '<span aria-hidden="true" class="control-active-border" style="background:' + leafletMarkerColours[markercolour] + '"></span><i class="fas fa-'+markericon+'" style="color:' + leafletMarkerColours[markercolour] + '"></i><span class="control-text">'+ layername + '</span><span class="control-count">' + count + ' items shown</span>';
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

        $('#map-clear').on('click', () => {
          for (var i in layers) {
            map.removeLayer(layers[i]);
          }

          $controls.removeClass(CONTROLS_OPEN_CLASS);
          var width = document.documentElement.clientWidth;
          if (width < 768) {
            // set the zoom level to 12 on mobile
            map.setZoom(11);
            map.setView([51.5490, -0.059928], 11);
          }  else {
            // set the zoom level to 13. It is the default on desktop and tablets
            map.setZoom(13);
            map.setView([51.5490, -0.077928], 11);
          }
        });
      }//end success    
    });//end ajax
  } //end i
}//end loadLayers


//create controls for each group of layers. All the layers in all groups must have been loaded. The last parameter is a boolean telling if all layers should stay in layer control or only the layers relevant to one group/persona
function createEasyButtons(layerGroup, layers, overlayMaps, layercontrol, n, keepAllInLayerControl){
  var button = document.createElement('button');
  button.classList.add('persona-button');
  button.setAttribute('id', 'persona-button-' + n);
  // reintroduce below line when adding in icons
  // button.innerHTML = '<span class="button-icon"><img src=' + layerGroup.groupIcon + ' alt="' + layerGroup.groupText + '" /></span><span class="button-text">' + layerGroup.groupText + '</span>';
  button.innerHTML = '<span class="button-text">' + layerGroup.groupText + '</span>';
  var mapPersonas = document.getElementById('map-personas');
  mapPersonas.appendChild(button);
  $('#persona-button-' + n).on('click', function(e){
    e.stopPropagation();

     

    //For custom layer only: geolocate and then switch group if in Hackney
    if (layerGroup.group == 'custom') {

        //define listener
        function onLocationFoundViaPersona(e) {
            console.log('locationFound2');

            //add marker
            if (locateCircle != null) {
                map.removeLayer(locateCircle);
            }
            locateCircle = L.circleMarker(e.latlng).addTo(map);

            var hackneyBounds = L.bounds([51.517787, -0.097059], [51.580648, -0.009090]);
            //var hackneyBounds = L.bounds([51.517787, -0.097059], [51.518, -0.096]);
            if (hackneyBounds.contains([e.latlng.lat, e.latlng.lng])) {
                console.log('yes, now I need to switch on layers');
                map.setView([e.latlng.lat, e.latlng.lng], 16);
                switchGroup();
            }
            else {
                alert('Love Summer only covers Hackney');

                //clearMap();
                if (width < 768) {
                    // set the zoom level to 12 on mobile
                    map.setView([51.5490, -0.059928], 11);
                }
                else {
                    // set the zoom level to 13 on desktop
                    map.setView([51.5490, -0.077928], 13);
                }
            }
            //remove listener
            map.off('locationfound', onLocationFoundViaPersona);
        }

        //add listener
        map.on('locationfound', onLocationFoundViaPersona);

        map.locate({
            setView: false,
            timeout: 5000,
            maximumAge: 0,
            maxZoom: 16
        });
    }

    //for all groups except custom: just switch group
    else {
        switchGroup();
    }

    //bit of that switches the group
    function switchGroup() {
        //remove all layers 
        for (var j in layers) {
            map.removeLayer(layers[j]);
            //if the keep option is set to false, remove the corresponding entry in the layer control
            if (!keepAllInLayerControl) {
                layercontrol.removeLayer(layers[j]);
            }
        }

        //add layers from that group
        for (var k in layerGroup.layersInGroup) {
            map.addLayer(layerGroup.layersInGroup[k]);
            // if the keep option is set to false, we now need to re-add the layers to the control
            if (!keepAllInLayerControl) {
                for (var key in overlayMaps) {
                    if (overlayMaps[key] == layerGroup.layersInGroup[k]) {
                        layercontrol.addOverlay(overlayMaps[key], key);
                    }
                }
            }
        }
    }

    $('html, body').animate({
      scrollTop: $('#map-toggle').offset().top
    }, 500, function() {
      // Callback after animation
      // Must change focus!
      var $target = $('#map-toggle');
      $target.focus();
      if ($target.is(":focus")) { // Checking if the target was focused
        return false;
      } else {
        $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
        $target.focus(); // Set focus again
      };
    });
  });    
}




  
function createControl(overlayMaps){
  layercontrol = new L.control.layers(null, overlayMaps, {
    collapsed: false,
    sortLayers: true,
    sortFunction: function (a, b) {
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




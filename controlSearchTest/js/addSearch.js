// -------------------------------------------------------------------------------------------------------------
        function pop_boundarieshackney_1(feature, layer) {
            var popupContent = '<table>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['borough'] !== null ? Autolinker.link(String(feature.properties['borough'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['total_households'] !== null ? Autolinker.link(String(feature.properties['total_households'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['longitude'] !== null ? Autolinker.link(String(feature.properties['longitude'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['latitude'] !== null ? Autolinker.link(String(feature.properties['latitude'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['prinx'] !== null ? Autolinker.link(String(feature.properties['prinx'])) : '') + '</td>\
                    </tr>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 400});
        }

        function style_boundarieshackney_1_0() {
            return {
                pane: 'pane_boundarieshackney_1',
                opacity: 1,
                color: 'rgba(0,0,0,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 4.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(92,229,42,0.0)',
            }
        }
        map.createPane('pane_boundarieshackney_1');
        map.getPane('pane_boundarieshackney_1').style.zIndex = 401;
        map.getPane('pane_boundarieshackney_1').style['mix-blend-mode'] = 'normal';
        var layer_boundarieshackney_1 = L.geoJson(null, {
            attribution: '<a href=""></a>',
            style: style_boundarieshackney_1_0,
            pane: 'pane_boundarieshackney_1',
            onEachFeature: pop_boundarieshackney_1
        });
        function getboundarieshackney_1Json(geojson) {
            layer_boundarieshackney_1.addData(geojson);
        };
        bounds_group.addLayer(layer_boundarieshackney_1);
        map.addLayer(layer_boundarieshackney_1);
        // -------------------------------------------------------------------------------------------------------------
        function pop_greenspaceshackney_park_2(feature, layer) {
            var popupContent = '<table>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['park_id'] !== null ? Autolinker.link(String(feature.properties['park_id'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['old_ward'] !== null ? Autolinker.link(String(feature.properties['old_ward'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['new_ward'] !== null ? Autolinker.link(String(feature.properties['new_ward'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['land_registry'] !== null ? Autolinker.link(String(feature.properties['land_registry'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['area_h'] !== null ? Autolinker.link(String(feature.properties['area_h'])) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['prinx'] !== null ? Autolinker.link(String(feature.properties['prinx'])) : '') + '</td>\
                    </tr>\
                </table>';
            layer.bindPopup(popupContent, {maxHeight: 400});
        }
        
        function style_greenspaceshackney_park_2_0() {
            return {
                pane: 'pane_greenspaceshackney_park_2',
                opacity: 1,
                color: 'rgba(0,0,0,0.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(48,142,63,0.0)',
            }
        }
        map.createPane('pane_greenspaceshackney_park_2');
        map.getPane('pane_greenspaceshackney_park_2').style.zIndex = 402;
        map.getPane('pane_greenspaceshackney_park_2').style['mix-blend-mode'] = 'normal';
        var layer_greenspaceshackney_park_2 = L.geoJson(null, {
            attribution: '<a href=""></a>',
            style: style_greenspaceshackney_park_2_0,
            pane: 'pane_greenspaceshackney_park_2',
            onEachFeature: pop_greenspaceshackney_park_2
        });
        function getgreenspaceshackney_park_2Json(geojson) {
            layer_greenspaceshackney_park_2.addData(geojson);
        };
        bounds_group.addLayer(layer_greenspaceshackney_park_2);
        map.addLayer(layer_greenspaceshackney_park_2);
        
        
         // search. uses the NAME field from the WFS layer of all the regeneration programmes.
         // zoom level 17
        map.addControl(new L.Control.Search({
            layer: layer_greenspaceshackney_park_2,
            initial: false,
            collapsed: false,
            zoom: 17,
            textPlaceholder: 'Search by park or event',
            textErr: 'Location not found. Please start typing the name of the event or park where it will take place',
            propertyName: 'name', }));
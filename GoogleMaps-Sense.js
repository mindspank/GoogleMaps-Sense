require.config({
	paths: {
		async: '/extensions/GoogleMaps-Sense/lib/async',
		markerclusterer: '/extensions/GoogleMaps-Sense/lib/markerclusterer'
	},
	shim: {
		'markerclusterer': {
			exports: 'MarkerClusterer'
		}
	}
});

define(['qlik', './src/properties', './src/styles', 'markerclusterer', './src/abbreviateNumber', 'qvangular', 'async!https://maps.google.com/maps/api/js'], function(qlik, properties, styles, MarkerClusterer, abbreviateNumber, qv) {
	var BASE_URL = '/extensions/GoogleMaps-Sense/';

    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }
    }

    if (typeof(Number.prototype.toDeg) === "undefined") {
        Number.prototype.toDeg = function() {
            return this * 180 / Math.PI;
        }
    }

	return {
		initialProperties: {
			version: 1,
			qHyperCubeDef: {
				qSuppressZero: true,
				qSuppressMissing: true
			},
			gmaps: {
				cluster: {
					oneStyle: false,
					maxZoom: 10
				},
				map: {
					mode: 'cluster',
					customIcon: null,
					iconUrl: '',
					maxZoom: 18,
					style: 'default'
				}
			}
		},
		definition: properties,
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function($element, layout) {
			
			$element.empty();
			
			this.backendApi.cacheCube.enabled = false;
			var _this = this;
			
			var columns = layout.qHyperCube.qSize.qcx, totalheight = layout.qHyperCube.qSize.qcy;
		    var pageheight = Math.floor(10000 / columns);
			var numberOfPages = Math.ceil(totalheight / pageheight);

			var markers = [];
			var selectedMarkers = [];
            
            var rectangles = [];
            var selectedRects = [];
																		
			var columns = layout.qHyperCube.qSize.qcx;
			var totalheight = layout.qHyperCube.qSize.qcy;
			
			var pageheight = Math.floor(10000 / columns);
			var numberOfPages = Math.ceil(totalheight / pageheight);
			
			var Promise = qv.getService('$q');
			
			var promises = Array.apply(null, Array(numberOfPages)).map(function(data, index) {
				var page = {
					qTop: (pageheight * index) + index,
					qLeft: 0,
					qWidth: columns,
					qHeight: pageheight
				};
				
				return this.backendApi.getData([page]);
				
			}, this)
			
			Promise.all(promises).then(function(data) {
				render(data);
			});
			
			function render(data) {

				var useCustomStyle = layout.gmaps.map.style !== 'default';
				var hasMeasure = layout.qHyperCube.qMeasureInfo.length >= 1 ? true : false;
				var hasPopup = layout.qHyperCube.qMeasureInfo.length === 2 ? true : false;
	
				//The bounds object, used to determain which part of the map to show based on data
				var bounds = new google.maps.LatLngBounds();
	
				var mapOptions = {
					maxZoom: layout.gmaps.map.maxZoom,
					panControl: true,
					zoomControl: true,
					overviewMapControl: false,
					overviewMapControlOptions: {
						opened: false
					},
					scaleControl: false,
					streetViewControl: true,
					mapTypeControlOptions: {
						mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.HYBRID, 'map_style']
					}
				};
	
				//Put the map on the page so give some visual feedback
				var map = new google.maps.Map($element.get(0), mapOptions);
	
				if(useCustomStyle) {
	
					var selectedStyle = styles.filter(function(d) {
						return d.key === layout.gmaps.map.style
					});
	
					var styledMap = new google.maps.StyledMapType(selectedStyle[0].data, {
						name: layout.gmaps.map.style
					});
	
					map.mapTypes.set('map_style', styledMap);
					map.setMapTypeId('map_style');
	
				};
				
				//Create a marker for each row of data
				data.forEach(function(obj) {
					obj[0].qMatrix.forEach(function(row, index) {
						if (row[0].qText == '-') return;
						
						//Parse the dimension
						var latlng = JSON.parse(row[0].qText);
	
						//Reverse the order as QS sends long lat
						var point = new google.maps.LatLng(latlng[1], latlng[0]);
	
						//Create our marker - if we have a expression then use that otherwise default to just show locations
						var marker = new google.maps.Marker({
							position: point,
							title: '',
							customData: hasMeasure ? row[1].qText : 1,
							qElem: row[0].qElemNumber
						});
	
						//If we have popup values for each marker create the popup windows
						if (hasPopup) {
		
							marker.infoWindow = new google.maps.InfoWindow({
								content: row[2].qText
							});
		
							google.maps.event.addListener(marker, 'mouseover', function() {
								this.infoWindow.open(map, this);
							});
		
							google.maps.event.addListener(marker, 'mouseout', function() {
								this.infoWindow.close();
							});
		
						};
	
						//Add click handler
						google.maps.event.addListener(marker, 'click', (function(value) {
							return function() {
								_this.selectValues(0, [value], true);
								highlightMarkers(value)
							}
						})(row[0].qElemNumber));
	
						bounds.extend(point);
						markers.push(marker);
						
					});
				});
				
				//Fit map to bounds
				map.fitBounds(bounds);
	
				//Clustering enabled
				if (layout.gmaps.map.mode === 'cluster') {
	
					if (layout.gmaps.cluster.oneStyle) {
						var clusterStyles = [{
							opt_textColor: 'black',
							url: BASE_URL + 'images/singlecluster.png',
							height: 56,
							width: 55
						}];
					};
	
					var mcOptions = {
						imagePath: BASE_URL + 'images/m',
						styles: clusterStyles,
						maxZoom: layout.gmaps.cluster.maxZoom
					};
	
					//Draw clusters onto map
					var markerCluster = new MarkerClusterer(map, markers, mcOptions);
					markerCluster.setCalculator(function(markers, clusterStyles) {
	
						var index = 0,
							count = markers.length,
							total = count;
	
						while (total !== 0) {
							//Create a new total by dividing by a set number
							total = parseInt(total / 5, 10);
							//Increase the index and move up to the next style
							index++;
						}
						index = Math.min(index, clusterStyles);
	
						var measure = 0;
						for (var i = 0, k = count; i < k; i++) {
							measure += parseInt(markers[i].customData)
						}
						var abbreviatedValue = abbreviateNumber(measure)
						return {
							text: abbreviatedValue,
							index: index
						};
					});
	
				};
	
				if (layout.gmaps.map.mode === 'marker') {
					markers.forEach(function(d) {
						d.setMap(map);
					})
				};
                
                if (layout.gmaps.map.mode === 'boxes') {
                    
                  
                  markers.forEach(function(d) {
                      
                      var distance = d.customData > 1 ? d.customData : 10;
                      var lat = d.position.lat();
                      var lng = d.position.lng();
                      var boxbounds = new google.maps.LatLngBounds(box(lat, lng, 225, distance), box(lat, lng, 45, distance))
                      var rect = new google.maps.Rectangle({
                        strokeColor: layout.gmaps.boxes.strokeFill,
                        strokeOpacity: +layout.gmaps.boxes.strokeOpacity,
                        strokeWeight: +layout.gmaps.boxes.strokeWeight,
                        fillColor: layout.gmaps.boxes.fillColor,
                        fillOpacity: +layout.gmaps.boxes.fillOpacity,
                        qElem: d.qElem,
                        map: map,
                        bounds: boxbounds                         
                      });
                      
                      //Add click handler
                      google.maps.event.addListener(rect, 'click', (function(value) {
                          return function() {
                              _this.selectValues(0, [value], true);
                              highlightRects(value)
                          }
                      })(d.qElem));
                      
                      rectangles.push(rect);
                      
                  })
                    
                };
                	
			};
			
			//In selection mode - loop over markers to highlight markers scheduled for selection.
			function highlightMarkers(qElem) {
				var idx = selectedMarkers.indexOf(qElem);
				if (idx > -1) {
					selectedMarkers.splice(idx, 1)
				} else {
					selectedMarkers.push(qElem)
				}
				markers.forEach(function(marker) {
					if (selectedMarkers.indexOf(marker.qElem) === -1) {
    					marker.setOpacity(0.5)
					} else {
    					marker.setOpacity(1);
					}
				});
			};
            
			//In selection mode - loop over markers to highlight markers scheduled for selection.
			function highlightRects(qElem) {
				var idx = selectedRects.indexOf(qElem);
				if (idx > -1) {
					selectedRects.splice(idx, 1)
				} else {
					selectedRects.push(qElem)
				}
				rectangles.forEach(function(marker) {
					if (selectedRects.indexOf(marker.qElem) === -1) {
                        marker.setOptions({
                            fillOpacity: +layout.gmaps.boxes.fillOpacity / 2,
                            strokeOpacity: +layout.gmaps.boxes.strokeOpacity / 2
                        })                       
					} else {
                        marker.setOptions({
                            fillOpacity: +layout.gmaps.boxes.fillOpacity,
                            strokeOpacity: +layout.gmaps.boxes.strokeOpacity
                        })                                 
					}
				});
			};            
            
            function box(lat,lng,brng,dist) {
                this._radius = 6371;
                var dist = dist / this._radius;
                var brng = brng.toRad();
                var lat1 = lat.toRad();
                var lon1 = lng.toRad();
                
                var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                    Math.cos(lat1) * Math.sin(dist) *
                    Math.cos(brng));
                    
                var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                    Math.cos(lat1), Math.cos(dist) -
                    Math.sin(lat1) * Math.sin(lat2));
                lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
                
                return new google.maps.LatLng(lat2.toDeg(),lon2.toDeg());
            }
			
		}	
	};
});
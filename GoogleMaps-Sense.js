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

define(['qlik', './src/properties', 'markerclusterer', 'async!http://maps.google.com/maps/api/js?sensor=false'], function(qlik, properties, MarkerClusterer) {

	var BASE_URL = '/extensions/GoogleMaps-Sense/';

	//Size of the data page to fetch
	var pageChunk = 3000;

	return {
		initialProperties: {
			version: 1.1,
			qHyperCubeDef: {
				qInitialDataFetch: [{
					qWidth: 3,
					qHeight: 1500
				}],
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

			//Page through all available data
			//Need to have all data before we can put markers onto the map
			if (this.backendApi.getRowCount() > pageChunk + 1) {
				var page = [{
					qTop: pageChunk + 1,
					qLeft: 0,
					qWidth: 3,
					qHeight: pageChunk
				}];

				//Get next page of data and re-render
				this.backendApi.getData(page).then(function(d) {
					pageChunk += pageChunk;
					_this.paint($element, layout);
				});

			}

			var markers = [];
			var selectedMarkers = [];
			var _this = this;

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
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
				}
			};

			//Put the map on the page so give some visual feedback
			var map = new google.maps.Map($element.get(0), mapOptions);


			//Create a marker for each row of data
			this.backendApi.eachDataRow(function(rownum, row) {
				if(row[0].qText == '-') return;
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
				//TODO: Give some sort of visual indication that a point is in selected state
				google.maps.event.addListener(marker, 'click', (function(value) {
					return function() {
						_this.selectValues(0, [value], true);
						highlightMarkers(value)
					}
				})(row[0].qElemNumber));

				bounds.extend(point);
				markers.push(marker);

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
						marker.setOpacity(1)
					}
				});
			};

			//For custom cluster calculations shorten very long numbers
			//TODO: Move labels into the properties panel
			function abbreviateNumber(value) {
				var newValue = value;
				if (value >= 1000) {
					var suffixes = ["", "k", "m", "b", "t"];
					var suffixNum = Math.floor(("" + value).length / 3);
					var shortValue = '';
					for (var precision = 2; precision >= 1; precision--) {
						shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
						var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
						if (dotLessShortValue.length <= 2) {
							break;
						}
					}
					if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
					newValue = shortValue + suffixes[suffixNum];
				}
				return newValue;
			};

		}
	};
});
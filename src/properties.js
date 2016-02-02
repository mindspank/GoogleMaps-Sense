define([], function() {
	'use strict';

	var DIMENSIONS = {
		uses: "dimensions",
		min: 1,
		max: 1
	}

	var BASEMAP_SETTINGS = {
		grouped: true,
		type: 'items',
		label: 'General Map Settings',
		items: {
			usecluster: {
				type: 'string',
				label: 'How do you want to plot your data?',
				component: "dropdown",
				ref: 'gmaps.map.mode',
				options: [{
					value: 'cluster',
					label: 'Cluster'
				},{
					value: 'marker',
					label: 'Marker'
				},{
                    value: 'boxes',
                    label: 'Boxes'
                }],
				defaultValue: "cluster"
			},
			style: {
				type: 'string',
				label: 'Base map style',
				component: "dropdown",
				ref: 'gmaps.map.style',
				options: [{
					value: 'default',
					label: 'Default'
				}, {
					value: 'greyscale',
					label: 'Greyscale'
				}, {
					value: "cleangrey",
					label: "Clean Grey"
				}],
				defaultValue: "default"
			},
			maxzoom: {
				type: 'number',
				label: 'Max Zoom Level (0-18)',
				ref: 'gmaps.map.maxZoom',
				defaultValue: 10,
				show: true,
				component: 'slider',
				min: 0,
				max: 18,
				step: 1
			}
		}
	}
    
    var BOX_SETTINGS = {
      grouped: true,
      type: 'items',
      label: 'Box Settings',
      show: function(d) {
          return d.gmaps.map.mode === 'boxes'
      },
      items: {
          fillcolor: {
              type: 'string',
              label: 'Fill Color',
              ref: 'gmaps.boxes.fillColor',
              defaultValue: '#FF0000',
              expression: 'optional'
          },
          fillOpacity: {
              type: 'number',
              label: 'Fill Opacity',
              ref: 'gmaps.boxes.fillOpacity',
              defaultValue: 0.35,
              expression: 'optional'              
          },
          strokeFill: {
              type: 'string',
              label: 'Stroke Fill',
              ref: 'gmaps.boxes.strokeFill',
              defaultValue: '#FF0000',
              expression: 'optional'             
          },
          strokeWeight: {
              type: 'number',
              label: 'Stroke Weight',
              ref: 'gmaps.boxes.strokeWeight',
              defaultValue: 2,
              expression: 'optional'              
          },
          strokeOpacity: {
              type: 'number',
              label: 'Stroke Opacity',
              ref: 'gmaps.boxes.strokeOpacity',
              defaultValue: 0.8,
              expression: 'optional'              
          }               
      }  
    };

	var CLUSTER_SETTINGS = {
		grouped: true,
		type: 'items',
		label: 'Cluster Settings',
        show: function(d) {
          return d.gmaps.map.mode === 'cluster'
        },
		items: {
			singlecluster: {
				type: "boolean",
				label: "Use one cluster style",
				ref: "gmaps.cluster.oneStyle",
				defaultValue: false
			},
			clusterzoomlevel: {
				type: 'number',
				label: 'Stop Clustering at Zoom Level (0-18)',
				ref: 'gmaps.cluster.maxZoom',
				defaultValue: 10,
				show: true,
				component: 'slider',
				min: 0,
				max: 18,
				step: 1
			}
		}
	}


	return {
		type: "items",
		component: "accordion",
		items: {
			dimensions: DIMENSIONS,
			measures: {
				uses: "measures",
				min: 0,
				max: 2
			},
			settings: {
				uses: "settings"
			},
			mapsettings: {
				label: 'Map Settings',
				component: 'expandable-items',
				type: 'items',
				items: {
					basemap: BASEMAP_SETTINGS,
					cluster: CLUSTER_SETTINGS,
                    box: BOX_SETTINGS
				}
			}
		}
	}

});
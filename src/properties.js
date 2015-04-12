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

	var CLUSTER_SETTINGS = {
		grouped: true,
		type: 'items',
		label: 'Cluster Settings',
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
					cluster: CLUSTER_SETTINGS
				}
			}
		}
	}

});
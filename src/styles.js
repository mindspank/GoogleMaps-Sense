define([], function() {

  var styles = [];

  var greyscale = {
    key: "greyscale",
    data: [{
      "featureType": "landscape",
      "stylers": [{
        "saturation": -100
      }, {
        "lightness": 65
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "poi",
      "stylers": [{
        "saturation": -100
      }, {
        "lightness": 51
      }, {
        "visibility": "simplified"
      }]
    }, {
      "featureType": "road.highway",
      "stylers": [{
        "saturation": -100
      }, {
        "visibility": "simplified"
      }]
    }, {
      "featureType": "road.arterial",
      "stylers": [{
        "saturation": -100
      }, {
        "lightness": 30
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "road.local",
      "stylers": [{
        "saturation": -100
      }, {
        "lightness": 40
      }, {
        "visibility": "on"
      }]
    }, {
      "featureType": "transit",
      "stylers": [{
        "saturation": -100
      }, {
        "visibility": "simplified"
      }]
    }, {
      "featureType": "administrative.province",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "water",
      "elementType": "labels",
      "stylers": [{
        "visibility": "on"
      }, {
        "lightness": -25
      }, {
        "saturation": -100
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "hue": "#ffff00"
      }, {
        "lightness": -25
      }, {
        "saturation": -97
      }]
    }]
  };

  styles.push(greyscale);

  var cleangrey = {
    key: "cleangrey",
    data: [{
      "featureType": "administrative",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#e3e3e3"
      }]
    }, {
      "featureType": "landscape.natural",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{
        "color": "#cccccc"
      }]
    }, {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit.line",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit.station.airport",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit.station.airport",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "color": "#FFFFFF"
      }]
    }, {
      "featureType": "water",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }]
  };

  styles.push(cleangrey);

  return styles;

});
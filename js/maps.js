/**
  * README
  *
  * To use maps.js, first create an object literal with the following values mentioned in the
  * init() method. Then simply call init() with the object literal as the parameter.
  *
  * Be sure to check if "success" is true in your callback before doing anything. "success" will
  * be false if the address is unable to be geolocated.
  *
  * In order to retrieve the data from maps.js, please use your resultCallback function that
  * you specified in your object literal. The callback passes in an object literal with keys
  * identical to your placeTypes. The value for each key is an array of the top 20 search
  * results for that key.
  *
  * Each result is an object literal from which you can retrieve the values from the keys
  * mentioned here: https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
  */

var success;
var info;
var map;
var infoWindow;
var geocoder;
var markerArray;
var resultDict;

/** 
  * init() initializes a map using an object literal, specs. specs must include the
  * following fields:
  *     - <String> address
  *     - <String[]> placeTypes
  *     - <Object> icons (keys must match elements of placeTypes, values are string paths to images)
  *     - <function> resultCallback (with parameter, resultDict)
  */
function init(specs) {
    info = specs;
    initializeAddress();
}

/**
  * initializeAddress() first tries to geoCode an address into coordinates before
  * initializing the map in initializeMap().
  */
function initializeAddress() {
    geoCode(info.address, initializeMap);
}

/**
  * initializeMap() sets up a new map.
  */
function initializeMap(home) {
  var mapOptions = {
    center: home, 
    zoom: 14,
    disableDefaultUI: true
  };

  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  markerArray = [];
  resultDict = {};

  // Adding the home marker.
  var homeMarker = new google.maps.Marker({
      map: map,
      position: home,
      icon: "/img/color_icons_green_home.png"
  });

  google.maps.event.addListener(homeMarker, 'click', function() {
      infoWindow.setContent("Home");
      infoWindow.open(map, this);
  })

  var searchCallback = function(type, results) {
      resultDict[type] = results;
      if (Object.keys(resultDict).length === info.placeTypes.length) {
          info.resultCallback(resultDict);
      }
  }

  for (var i=0; i<info.placeTypes.length; i++) {
    if (i < 3) { // Only the first 3 place types are displayed on the map.
      searchPlaces(home, info.placeTypes[i], [info.placeTypes[i]], true, searchCallback);
    } else {
      searchPlaces(home, info.placeTypes[i], [info.placeTypes[i]], false, searchCallback);
    }
  }
}

/**
  * createMarker() creates amarker on the map of the specified place and
  * includes an infoWindow describing the place's name and rating.
  */
function createMarker(place, type) {
  var location = place.geometry.location;
  var rating;
  if (place.rating == null) {
    rating = "No rating";
  } else {
    rating = place.rating;
  }

  var marker = new google.maps.Marker({
    map: map,
    position: location,
    icon: info.icons[type]
  });
  markerArray.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(
      '<b>' + place.name + '</b><br>' + 
      rating);
    infoWindow.open(map, this);
  });
}

/**
  * removeMarkers() simply removes all markers from the map and resets the
  * markerArray.
  */
function removeMarkers() {
    for (var i=0; i<markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    markerArray = [];
}

/**
  * searchPlaces() removes all existing markers (except for home), then 
  * searches for places of a specific query within a certain range of home.
  * isMarked is a boolean that denotes whether or not we want to create a
  * marker for every search result. cb is the callback function to deal with
  * results.
  */
function searchPlaces(home, type, query, isMarked, cb) {
    var request = {
        location: home,
        radius: 2000,
        types: query
    };

    var callback = function(results, status, pagination) {
        results.sort(function(a, b) {
          var ratingA;
          var ratingB;

          if (a == null || a.rating == null) {
            ratingA = 0;
          } else {
            ratingA = a.rating;
          }

          if (b == null || b.rating == null) {
            ratingB = 0
          } else {
            ratingB = b.rating;
          }

          return ratingB - ratingA;
        });

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i=0; i<3; i++) {
                if (isMarked) {createMarker(results[i], type)};
            }
            if (cb) {cb(type, results); }
        } else {
          if (cb) {cb(type, []); }
        }
    }

    infoWindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

/**
  * geoCode() converts a String address into coordinates on the map.
  */
function geoCode(address, callback) {
    geocoder = new google.maps.Geocoder();
    var location;

    var cb = function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            success = true;
            if (callback) {
                callback(results[0].geometry.location);
            }
        } else {
            success = false;
        }
    }

    geocoder.geocode({'address': address}, cb);
}


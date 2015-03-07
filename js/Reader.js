(function(app) {
    "use strict";

    /**
     * This function takes a location and uses the googlemap-API to get the locations coordinates.
     * These values are then used in the readSMHI function.
     * @param  Location | The place to find coordinates for.
     */
    var readLocation = function(Location) {
        var a = $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + Location);
        a.done(function(result) {
            var latitude = result.results[0].geometry.location.lat.toFixed(3);
            var longitude = result.results[0].geometry.location.lng.toFixed(3);
            readSMHI(latitude, longitude);
        });
    }
    app.readLocation = readLocation;

    /**
     * This function makes a request to the SMHI-API for certain information depending on the location the user asked for.
     * Information about the weather for the next seven days (including the current day) will then be pushed into an array.
     * @param lat | The latitude of the place the user asked for.
     * @param lng | The longitude of the place the user asked for.
     */
    function readSMHI(lat, lng) {
        var weatherInfo = [];
        var b = $.getJSON("http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/" + lat + "/lon/" + lng + "/data.json");
        b.done(function(result) {
            $.each(result.timeseries, function(index, val) {
                weatherInfo.push(val);
            });
            app.fixTable(app.getWindInfo(weatherInfo), app.getTemp(weatherInfo));
        });
    }
    /**
     * This function gets your current location and then gathers weatherinfo for that location.
     */
    var readFromCurrentPosition = function() {
        navigator.geolocation.getCurrentPosition(success, error, options);
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;
            readSMHI(crd.latitude.toFixed(6), crd.longitude.toFixed(6));
        };

        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        };
    }
    app.readFromCurrentPosition = readFromCurrentPosition;

}(window.app || (window.app = {})));
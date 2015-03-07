(function(app) {
    "use strict";

    /**
     * This function gathers windinformation from the weatherInfo[] and pushes it into two other arrays.
     * @param weatherArray | The array you want to gather data from.
     * @return Two arrays with windvalues.
     */
    var getWindInfo = function(weatherArray) {
        var windStrenght = [];
        var windDirection = []; 
        var timeString = "12:00:00Z";
        for (var i = 0; i < weatherArray.length; i++) {
            if (weatherArray[i].validTime.indexOf(timeString) !== -1) {
                windDirection.push(weatherArray[i].wd);
                windStrenght.push(weatherArray[i].ws + " m/s ");
            }
        }
        if (windDirection.length < 10) {
            windDirection.splice(0, 0, "Ej tillgängligt");
            windStrenght.splice(0, 0, "Ej tillgängligt");
        }
        return [windDirection, windStrenght];
    }
    app.getWindInfo = getWindInfo;

    /**
     * This function gathers information about temperature from the weatherInfo[].
     * It gathers all temperaturevalues and then calculates a average value before pushing it into averageTemp[].
     * @param weatherArray | An array that contains all the information from SMHI.
     * @return Two arrays with temperaturevalues.
     */
    var getTemp = function(weatherArray) {
        var highestTempArray = [];
        var averageTempArray = []; 
        var b = []; //Local array that stores all dates for all objects.
        var uniqueDates = []; //Local array that stores all UNIQUE dates.


        $.each(weatherArray, function(index, val) {
            var a = weatherArray[index].validTime.split('T');
            b.push(a[0]); //Push the datevalues (without hours, minutes and seconds) into the temporary array.

            //Looping trough the array with all dates and removes duplicates.
            $.each(b, function(i, date) {
                if ($.inArray(date, uniqueDates) === -1) {
                    uniqueDates.push(date);
                }
            });
        });

        //Here I remove the first spot in the array if it contains information from the previuous day. 
        //It takes a few hours on the new day before it actually gets the first spot in the JSON-object.
        var a = moment().format("YYYY-MM-DD");
        if(uniqueDates[0].indexOf(a) == -1){
        	uniqueDates.splice(0, 1);
        }

        //Here we have two loops. The outer goes trough the unique dates one at the time
        //The inner loop goes trough the entire weatherArray with all objects and picks out the ones with matching dates.
        //When the inner loop is completed it calculates the average temperature and pushes it into the averageTemp[].
        $.each(uniqueDates, function(index, val) {
            var currentDate = uniqueDates[index];
            var s = 0; //Variable s sums the values from the weatherArray.
            var n = ""; // Variable n counts the number of values. 
            var maxArray = [];

            $.each(weatherArray, function(index, val) {
                if (weatherArray[index].validTime.indexOf(currentDate) !== -1) {
                    var number = parseFloat(weatherArray[index].t); //Turns the string into a number.
                    s += number; //Adding the value.
                    maxArray.push(number.toFixed(1)); //Pushing the value into an array which is used in the getHighestTemp-function.
                    n++; //Increasing the amount of values with one.
                } else if (index == weatherArray.length - 1) {
                    var fixed = (s / n).toFixed(1);
                    averageTempArray.push(fixed);
                    getHighestTemp(maxArray, highestTempArray);
                }
            });
        });
        return [averageTempArray, highestTempArray];
    }
    app.getTemp = getTemp;
    
    /**
     * This function adds the highest temperatures to an array.
     * @param  maxArray | An array with all temperatures.
     * @param  highestTempArray | An array with the highest temperatures.
     */
    function getHighestTemp(maxArray, highestTempArray) {
        var max = maxArray[0];

        $.each(maxArray, function(index, val) {
            if (parseFloat(val) > parseFloat(max)) {
                max = val;
            }
        });
        highestTempArray.push(max);
    }
}(window.app || (window.app = {})));


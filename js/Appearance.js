 (function(app) {
     /**
      * This function creates a table with weatherinfo for seven days from today.
      * It appends the table to index.html. It also modifies some CSS.
      * @param  wind | A function that returns two arrays with the neccessary information regarding wind.
      * @param  temp | A function that returns two arrays with the neccessary information regarding temperature.
      */
     var fixTable = function(wind, temp, cityName) {
         var weekday = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
         $("#weatherTable tbody, thead").empty();
         $('#weatherTable thead').append("<tr><th>Dag</th><th>Medel-temp</th><th>Max-temp</th><th>Vind kl:12</th></tr>");
         var d = new Date().getDay();
         for (var i = 0; i < 7; i++) {
             $('#weatherTable tbody').append("<tr><td>" + weekday[d] + "</td><td>" +
                 temp[0][i] + "</td><td>" + temp[1][i] + "</td><td>" + wind[1][i] + "<img id=" + i + " src='images/arrow.png'/></td></tr>");
             rotateImage(wind[0][i], i);
             if (d < 6) {
                 d++;
             } else {
                 d = 0;
             }
         };
         $('#wrapper').css("height", 680);
     }
     app.fixTable = fixTable;

     /**
      * This function targets an image and rotates it.
      * @param  rotateValue | The rotation.
      * @param  number | Target ID.
      */
     function rotateImage(rotateValue, number) {
         $('#' + number).rotate({
             animateTo: rotateValue
         });
     }

     /**
      * This function adds the localStorage to the drop down list.
      */
     var appendFromStorage = function(){
        for (var key in localStorage) {
            $('#favorites select').append('<option>' + localStorage.getItem(key) + '</option>');
        }
     }
     app.appendFromStorage = appendFromStorage;

 }(window.app || (window.app = {})));
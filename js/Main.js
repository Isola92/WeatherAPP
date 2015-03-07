(function(app) {
    "use strict";

    app.appendFromStorage();
    app.readFromCurrentPosition();

    $('#send').click(function() {
        if ($('#City').val() !== "") {
            var location = document.getElementById("City").value;
            app.readLocation(location);
        } else if ($('#favorites select option:selected').text() !== "") {
            app.readLocation($('#favorites select option:selected').text());
        }
    });
    $('#save').click(function() {
        var a = $('#City').val();
        if ($("#favorites select").text().indexOf(a) === -1) {
            $('#favorites select').append('<option>' + a + '</option>');
            localStorage.setItem(a, a);
        }
    });

}(window.app || (window.app = {})));		


// <script src="Appearance.js"></script>
// 		<script src="Reader.js"></script>
// 		<script src="Logic.js"></script>
// 		<script src="Main.js"></script>
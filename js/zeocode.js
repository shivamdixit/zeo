$(document).ready(function(){
    var parameterName = "ll";
    var mapFound = false;
    var latitude, longitude;

    setTimeout(function() {
        $(document).find('a').each(function(index) {
            var url = $(this).attr('href');
            var pattern = /^https?:\/\/maps.google.com\/maps\\?.*/;
            if (pattern.test(url)) {
                // Google Maps URL found
                // Now extract parameters
                var latLng = $.urlParam(url, parameterName);
                if (latLng) {
                    var lat = latLng.split(",")[0];
                    var lng = latLng.split(",")[1];
                    displayWidget(lat, lng, this);
                    alert("1. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
                    return false; // Only show one instance of map
                }
            }
        });
    }, 4500);

    $(document).find('img').each(function() {
        var src = decodeURIComponent($(this).attr('src'));
        if (src.indexOf('staticmap?') > -1) {
            var latLng = extractLatLng(src);
            if (latLng) {
                var lat = latLng.split(",")[0];
                var lng = latLng.split(",")[1];

                displayWidget(lat, lng, this);
                alert("2. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
            }
        }
    });

    $(document).find('div').each(function() {
        var possibility1 = decodeURIComponent(
            $(this).css('background').
            replace(/.*\s?url\([\'\"]?/, '').
            replace(/[\'\"]?\).*/, '')
        );

        if (possibility1.indexOf('staticmap?') > -1) {
            var latLng = extractLatLng(possibility1);
            if (latLng) {
                var lat = latLng.split(",")[0];
                var lng = latLng.split(",")[1];
                displayWidget(lat, lng, this);
                alert("3. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
            }
        } else {
            var possibility2 = decodeURIComponent(
                $(this).css('background-image').
                replace(/.*\s?url\([\'\"]?/, '').
                replace(/[\'\"]?\).*/, '')
            );

            if (possibility2.indexOf('staticmap?') > -1) {
                var latLng = extractLatLng(possibility2);
                if (latLng) {
                    var lat = latLng.split(",")[0];
                    var lng = latLng.split(",")[1];
                    displayWidget(lat, lng, this);
                    alert("4. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
                }
            }
        }
    });

    function displayWidget(lat, lng, event) {
        chrome.runtime.sendMessage({'newIconPath' : '../icon.png'});
        console.log(event);
        $(event).parent().after('<div class="zeocode"><input type="button" name="zeo" value="Create Zeo"></div>');
    }
});

function extractLatLng(string) {
    return string.match(/\-?\d{1,3}\.\d+\,\-?\d{1,3}\.\d+/)[0];
}

$.urlParam = function(url, parameter) {
    var results = new RegExp('[\?&]' + parameter + '=([^&#]*)').exec(url);
    if (results == null){
       return null;
    } else {
       return results[1] || 0;
    }
}

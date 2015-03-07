var mapFound = false;

$(document).ready(function(){
    var parameterName = "ll";

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
                    // alert("1. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
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
                // alert("2. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
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
                // alert("3. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
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
                    // alert("4. Map found. Latitude is: " + lat + ", Longitude is:" + lng);
                }
            }
        }
    });

    function displayWidget(lat, lng, event) {
        mapFound = true;
        chrome.runtime.sendMessage({'type': 'changeIcon', 'newIconPath' : '../icon.png'});
        console.log(event);
        var btnUrl = chrome.extension.getURL('images/button.png');
        $(event).parent().after('<div id="zeocodeExtCnt" style="display: block; margin: 5px; z-index: 999999; cursor: pointer;" data-attr="' + lat +',' + lng + ' "><img src="' + btnUrl + '" width="200px" id="createZeoExtBtn"/></div>');
    }
});

$(document).on('click', '#createZeoExtBtn', function(){
    var attr = $('#zeocodeExtCnt').attr('data-attr').split(',');
    var createBtnUrl = chrome.extension.getURL('images/button.png');
    var waitBtnUrl = chrome.extension.getURL('images/wait.png');

    $('#createZeoExtBtn').attr('src', waitBtnUrl);

    chrome.runtime.sendMessage({'type': 'createZeo', 'lat': attr[0], 'lng': attr[1]}, function(data) {
        alert("Zeocode created! " + data.zeocode + '\n\n Share: http://zeoco.de/' + data.zeocode);
        $('#createZeoExtBtn').attr('src', createBtnUrl);
        $('#createZeoExtBtn').attr('disabled', 'disabled');

        console.log(data);
    });
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


// Listen for incoming requests from browser_action script
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == 'createZeo') {
        if (!mapFound) {
            sendResponse("No map found!");
            return true;
        }
        $('#createZeoExtBtn').click();
    } else {
        sendResponse({}); // snub them.
    }
});

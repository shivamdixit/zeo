$(document).ready(function(){
    var parameterName = "ll";
    setTimeout(function(){
        $(document).find('a').each(function(index){
            var url = $(this).attr('href');
            var pattern = /^https?:\/\/maps.google.com\/maps\\?.*/;
            if (pattern.test(url)) {
                // Google Maps URL found
                // Now extract parameters
                var latLng = $.urlParam(url, parameterName);
                if (latLng) {
                    var lat = latLng.split(",")[0];
                    var lng = latLng.split(",")[1];

                    alert("Map found. Latitude is: " + lat + ", Longitude is:" + lng);
                }
            }
        });
    }, 5000);
});

$.urlParam = function(url, parameter){
    var results = new RegExp('[\?&]' + parameter + '=([^&#]*)').exec(url);
    if (results == null){
       return null;
    } else {
       return results[1] || 0;
    }
}

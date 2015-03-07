$(document).ready(function(){
    $('#zeomessage').html('Please wait....');

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {method: 'createZeo'}, function (response) {
            if (response == "No map found!") {
                $('#zeomessage').html(response);
            }
        });
    });
});

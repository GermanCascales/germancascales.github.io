var API_PATH = "http://apih.megastar.fm/";
var APP_URL = "static/";

$(document).ready(function () {
    checkDpi();
    changeAppearence(); // en el inicio, current_track_id = 0 hasta que ocurra el intervalo; el id 0 muestra el programa actual
    checkPlayer();
    timer();
    

    audioStream.volume = 0.2;
    setTimeout(function() {
        audioStream.volume = 1.0;
    }, 2700);
    indicativo();
    
    setInterval(function () {
        checkDpi();
        $.get(API_PATH + "?method=music.current_track_id", function (a) {
            if (a.id_track !== current_track_id) {
                current_track_id = a.id_track;
                changeAppearence();
            }
        });
    }, 5000);
});
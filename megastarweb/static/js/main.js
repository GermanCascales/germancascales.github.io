var API_PATH = "http://apih.megastar.fm/";
var APP_URL = "static/";

$(document).ready(function () {
    checkDpi();
    // changeAppearence(); // en el inicio, current_track_id = 0 hasta que ocurra el intervalo; el id 0 muestra el programa actual
    audioInit();
    checkPlayer();
    uiPymedia();

    audioStream.volume = 0.2;
    setTimeout(function() {
        audioStream.volume = 1.0;
    }, 2700);
    indicativo();
    
    setInterval(function () {
        checkDpi();

        $.get(API_PATH + "?method=music.current_track_id", function (a) {
            /* console.log("current_track_id" + current_track_id);
            console.log("id_track" + a.id_track); */
            if (a.id_track !== current_track_id) {
                current_track_id = a.id_track;
                // current_track_id = 0;
                if (0 == current_track_id) {
                    uiPymedia();
                } else {
                    changeAppearence();
                }
            }
        });
    }, 5000);



////// inisio

$(document).on("pagecreate",function(event){
  $(window).on("orientationchange",function(){
    alert("The orientation has changed!");
  });                     
});

  // finnnnnnnn


});
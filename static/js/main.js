var API_PATH = "http://apih.megastar.fm/";
var APP_URL = "static/";
var sel_color;
var showTrackId;

var current_track_id = 0;

var colors = new Array();
colors[1] = "#15ab31";
colors[2] = "#f6c500";
colors[3] = "rgba(0,161,211,0.7)";
colors[4] = "#ae805e";
colors[5] = "rgba(251,11,26,0.6)";
colors[6] = "rgba(238,0,123,0.6)";

function changeAppearence() {
    showTrackId = current_track_id;

	$.getJSON(API_PATH + "?method=music.track_info&id=" + showTrackId + "&type=big", function (a) {
        $("#track_info").show();

        if (a.title !== null) {
            $("#player_title").html(a.title);
            $("#player_title").show();
        } else {
            $("#player_title").hide();
        }
            
        $("#player_artist").html(a.artist);

        var b = Math.floor(Math.random() * a.images.length);

        $("#background-image").css("background-image", "url(" + a.images[b].hash + ")");
        $("#background-image2").prop("src", APP_URL + "img/stars/" + a.images[b].color + ".png");
        sel_color = colors[a.images[b].color];

    });
}

$(document).ready(function () {
    changeAppearence(0); // en el inicio, current_track_id = 0, el id 0 muestra el programa actual hasta que ocurra el intervalo
    setInterval(function () {
        $.get(API_PATH + "?method=music.current_track_id", function (a) {
            if (a.id_track !== current_track_id) {
                current_track_id = a.id_track;
                changeAppearence();
            }
        });
    }, 5000);
});

function aud_play_pause() {
    var myAudio = document.getElementById("myTune");
    if (myAudio.paused) {
        $('#player_main_ctrl').removeClass('player_play');
        $('#player_main_ctrl').addClass('player_pause');
        myAudio.play();
    } else {
        $('#player_main_ctrl').removeClass('player_pause');
        $('#player_main_ctrl').addClass('player_play');
        myAudio.pause();
    }
}
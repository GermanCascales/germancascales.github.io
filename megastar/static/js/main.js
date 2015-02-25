var API_PATH = "http://apih.megastar.fm/";
var APP_URL = "static/";
var sel_color;
var showTrackId;

var flashPlayerActivo = 0;

var current_track_id = 0;

var colors = new Array();
colors[1] = "#15ab31";
colors[2] = "#f6c500";
colors[3] = "rgba(0,161,211,0.7)";
colors[4] = "#ae805e";
colors[5] = "rgba(251,11,26,0.6)";
colors[6] = "rgba(238,0,123,0.6)";

function capitalize(string) {
    var words = string.split(" ");
    var output = "";
    var lowerWord, capitalizedWord;
    for (i = 0; i < words.length; i++) {
        lowerWord = words[i].toLowerCase();
        lowerWord = lowerWord.trim();
        capitalizedWord = lowerWord.slice(0, 1).toUpperCase() + lowerWord.slice(1);
        output += capitalizedWord;
        if (i != words.length - 1) {
            output += " ";
        }
    }
    output[output.length - 1] = '';
    return output;
}

function changeAppearence() {
    showTrackId = current_track_id;

	$.getJSON(API_PATH + "?method=music.track_info&id=" + showTrackId + "&type=big", function (a) {
        $("#track_info").show();
        
        if (a.title !== null) {
            $("#player_title").html(a.title);
            $("#player_title").show();
            $("#dialog").dialog("option", "title", a.title + ' ‒ ' + capitalize(a.artist));
        } else {
            $("#player_title").hide();
        }
            
        $("#player_artist").html(a.artist);

        var b = Math.floor(Math.random() * a.images.length);

        $("#background-image").css("background-image", "url(" + a.images[b].hash + ")");
        $("#background-image2").prop("src", APP_URL + "img/stars/" + a.images[b].color + ".png");
        sel_color = colors[a.images[b].color];
        
        if (a.lyrics && a.lyrics !== "null" && a.lyrics !== "") {
            //a.lyrics = a.lyrics.replace(/\r?\n/g, "<br>");
            $("#lyrics_block").html(a.lyrics);
            $("#opener").show();
        } else {
            $("#lyrics_block").html("");
            $("#opener").hide();
		}

        if (a.video_url !== null) {
            var d = a.video_url;

            $("#track_video_yt").show();
            $("#track_video_yt").html("<iframe src=\"http://www.youtube.com/embed/" + d + "\"></iframe>");
        } else {
            $("#track_video_yt").hide();
        }
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

// lyrics&video dialog
$(function () {
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        dialogClass: "no-close",
        maxHeight: 600,
        show: {
            effect: "puff",
            duration: 500
        },
        hide: {
            effect: "drop",
            duration: 500
        }
    });
 
    $("#opener").click(function () {
        $("#dialog").dialog("open");
    });
     
    $("body").on("click", ".ui-widget-overlay", function () {
        $('#dialog').dialog("close");
    });
});

function loadFlashPlayer() {
    if (flashPlayerActivo == 0) {
        var myAudio = document.getElementById("myTune");
        $("#flashPlayer").html("<embed type=\"application/x-shockwave-flash\" src=\"http://www.todostreaming.es/player2.swf\" height=\"24\" style=\"undefined\" id=\"playerFlash\" name=\"player\" bgcolor=\"#000000\" quality=\"high\" allowscriptaccess=\"always\" allowfullscreen=\"false\" flashvars=\"file=http://91.121.68.52:8012/;stream.nsv&amp;provider=sound&amp;bufferlength=2&amp;autostart=true\" wmode=\"opaque\">");
        $('.player_circle').remove()
        myAudio.pause();
        flashPlayerActivo = 1;
    } else {
        null;
    }
    
}
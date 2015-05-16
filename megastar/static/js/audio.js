var sleepTimeout;

var current_track_id = 0;
var flashPlayerActivo = 0;
var temazoTortazoActivo = 0;

function aud_play_pause() {
    if (audioStream.paused) {
        $('#player_main_ctrl').removeClass('player_play');
        $('#player_main_ctrl').addClass('player_pause');
        $('#player_spinner').removeClass('pause');
        audioStream.play();
    } else {
        $('#player_main_ctrl').removeClass('player_pause');
        $('#player_main_ctrl').addClass('player_play');
        $('#player_spinner').addClass('pause');
        audioStream.pause();
    }
}

function stopAudio() {
    audioStream.pause(0);
    audioStream.src = "";
    audioStream.load();
    $("audioStream").remove();
}

function loadFlashPlayer() {
    if (flashPlayerActivo == 0) {
        $("#flashPlayer").html("<embed type=\"application/x-shockwave-flash\" src=\"http://cdn.livestream.com/chromelessPlayer/examples/jwplayer/players/player.swf\" height=\"24\" style=\"undefined\" id=\"playerFlash\" name=\"player\" bgcolor=\"#000000\" quality=\"high\" allowscriptaccess=\"always\" allowfullscreen=\"false\" flashvars=\"file=http://91.121.68.52:8012/;stream.nsv&amp;provider=sound&amp;bufferlength=2&amp;autostart=true\" wmode=\"opaque\">");
        //$("#flashPlayer").html("<embed type=\"application/x-shockwave-flash\" src=\"http://www.todostreaming.es/player2.swf\" height=\"24\" style=\"undefined\" id=\"playerFlash\" name=\"player\" bgcolor=\"#000000\" quality=\"high\" allowscriptaccess=\"always\" allowfullscreen=\"false\" flashvars=\"file=http://195.55.74.208/cope/megastar.mp3&amp;autostart=true\" wmode=\"opaque\">");
        $('.player_circle').remove();
        stopAudio();
        flashPlayerActivo = 1;
    } else {
        null;
    }
}

function checkPlayer() {
    var audioStream = document.getElementById("stream");
    if (flashPlayerActivo == 0) {
        if (audioStream.playing) {
            $('#player_main_ctrl').removeClass('player_pause');
            $('#player_main_ctrl').addClass('player_play');
            $('#player_spinner').addClass('pause');
        } else {
            $('#player_main_ctrl').removeClass('player_play');
            $('#player_main_ctrl').addClass('player_pause');
            $('#player_spinner').removeClass('pause');
        }
    }
}

function timer() {    
    $("#select").change(function(){
        var selectedValue = $("#select").val();
        if (selectedValue != 0) {
            sleepTimeout = setTimeout(function () {
                aud_play_pause();
                $("#select").val('0');
            }, selectedValue);
        } else {
            clearTimeout(sleepTimeout);
        }
    });
}

function indicativo() {
    if (flashPlayerActivo == 0) {
        $( "#logo" ).mouseover(function() {
            audioStream.volume = 0.2;
            audioIndicativo.play();
            setTimeout(function() {
                audioStream.volume = 1.0;
            }, 2700);
        });
    }
}

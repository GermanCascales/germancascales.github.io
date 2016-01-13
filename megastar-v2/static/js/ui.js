var showTrackId;
var dpi;
var colors = new Array();
colors[1] = "http://guiadebenalmadena.com/megastar/static/img/ic_launcher_green.png";
colors[2] = "http://guiadebenalmadena.com/megastar/static/img/ic_launcher_yellow.png";
colors[3] = "http://guiadebenalmadena.com/megastar/static/img/ic_launcher_blue.png";
colors[4] = "http://guiadebenalmadena.com/megastar/static/img/ic_launcher_black.png";
colors[5] = "http://guiadebenalmadena.com/megastar/static/img/ic_launcher_red.png";
colors[6] = "http://guiadebenalmadena.com/megastar/static/img/ic_launcher_pink.png";

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
    checkDpi();
    showTrackId = current_track_id;

	$.getJSON(API_PATH + "?method=music.track_info&id=" + showTrackId + "&type=" + dpi, function (a) {
        // console.log(showTrackId);

        $("#track_info").show();
        
        if (a.title !== null) {
            $("#player_title").html(a.title);
            $("#player_title").show();
            $("#dialog").dialog("option", "title", a.title + ' ‒ ' + a.artistReal);
        } else {
            $("#player_title").hide();
        }
            
        $("#player_artist").html(a.artist);

        var b = Math.floor(Math.random() * a.images.length);

        $("#background-image").css("background-image", "url(" + a.images[b].hash + ")");
        $("#background-image2").prop("src", APP_URL + "img/stars/" + a.images[b].color + ".png");
        
        if (a.lyrics && a.lyrics !== "null" && a.lyrics !== "") {
            //a.lyrics = a.lyrics.replace(/\r?\n/g, "<br>");
            $("#lyrics_block").html(a.lyrics);
            $("#openerLyrics").show();
        } else {
            $("#lyrics_block").html("");
            $("#openerLyrics").hide();
		}

        if (a.video_url && a.video_url !== "null" && a.video_url !== "") {
            var d = a.video_url;
            $("#track_video_i").show();
            $("#track_video_yt").html("<iframe src=\"http://www.youtube.com/embed/" + d + "\"></iframe>");
        } else {
            $("#track_video_i").hide();
        }
        
        // Comprobamos si el navegador soporta notificaciones
        if (!("Notification" in window)) {
            //alert("Este navegador no soporta notificaciones");
            null;
            
        } else if (Notification.permission === "granted") {
            // Ya teníamos permiso :3
            var notification = new Notification(a.artist, {
                body: a.title,
                icon: colors[a.images[b].color]
            });
            
            setTimeout(function () {
                notification.close();
            }, 5000);
            
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // Se envía notificación después de dar permiso
                if (permission === "granted") {
                    var notification = new Notification(a.artist, {
                        body: a.title,
                        icon: colors[a.images[b].color]
                    });
                    
                    setTimeout(function () {
                        notification.close();
                    }, 5000);
                }
            });
        }
    });
}

function uiPymedia() {
    $("#track_info").hide();

    $.getJSON("http://germancascales.github.io/megastar-v2/static/json/fondos.json", function (data) {
        if (dpi == "big") {
            var aleatorio = Math.floor(Math.random() * data.fondosPC.length);
            $("#background-image").css("background-image", "url(static/img/fondos_pc/" + data.fondosPC[aleatorio].file + ")");
        } else {
            var aleatorio = Math.floor(Math.random() * data.fondosMovil.length);
            $("#track_info").hide();
            $("#background-image").css("background-image", "url(static/img/fondos_movil/" + data.fondosMovil[aleatorio].file + ")");
        }
    });
}

function checkDpi() {
    if ($(window).width() < 450) {
        dpi = "xhdpi";
    } else {
        dpi = "big";
    }
}
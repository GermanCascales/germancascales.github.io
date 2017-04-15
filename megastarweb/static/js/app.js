var tabActive = "";
var players = [];
var navBarStatus = Cookies.get('navBar');
var contentStatus = "show";
var current_track_id;
var dpi;

var initialVolume = Cookies.get('jwplayer.volume');
var flashPlayerActivo = 0;

var App = function () {

	var xhr = null;

	function handles() {

		$("nav .navHeader").click(function() {
			$("nav .navContainer").slideToggle("slow", function(){
				if($("nav .navContainer").is(':visible')){
					$("nav .navHeader").html('<i class="fa fa-chevron-down"></i> Ocultar menú <i class="fa fa-chevron-down"></i>');
					Cookies.set('navBar', 'show', { expires: 7 });
					navBarStatus = "show";
				}else{
					$("nav .navHeader").html('<i class="fa fa-chevron-up"></i> Mostrar menú <i class="fa fa-chevron-up"></i>');
					Cookies.set('navBar', 'hide', { expires: 7 });
					navBarStatus = "hide";
				}

				Player.setStarStyle();
			});

		});

		$("nav .tile a").click(function(e) {
			e.preventDefault();

			$('nav a').blur();
			var type = $(this).attr("data-type");

			if(type == "tab"){
				var status = handleNav($(this).attr("data-tab"), $(this).attr("href"));

				if(status){
					handleContent($(this).attr("href"));
				}
			}else if(type == "blank"){
				window.open($(this).attr("href"),'_blank');
				return false;
			}

		});

		jQuery(document).on('click','.closeContent i.fa-times-circle', function(e) {
			e.preventDefault();

			App.closeContent();

		});

		jQuery(document).on('click','.content a[target="_self"]', function(e) {
			e.preventDefault();

			handleContent($(this).attr("href"));

		});

		jQuery(document).on('keyup','input[role=search]', function() {

			var rex = new RegExp($(this).val(), 'i');
			$('table.frequency tbody tr').hide().filter(function () {
				return rex.test($(this).text());
			}).show();

		});

	

		$( document ).on( "click", ".inside img", function(e){
			e.preventDefault();
			$.swipebox( [
					{ href:$(this).attr("src"), title:$(this).attr("alt") }
				],
				{
					useCSS : true,
					hideBarsDelay : 0
				}
			);
		});

		$( document ).on( "click", ".event img[data-type=preview]", function(e){
			e.preventDefault();
			$.swipebox( [
					{ href:$(this).attr("src"), title:$(this).attr("alt") }
				],
				{
					useCSS : true,
					hideBarsDelay : 0
				}
			);
		});

	}

	function handleNav(_zone, _newURL) {
		var _n = new Array();
		var _a = parseURL(document.location.pathname);
		var hideTab = false;
		var changeTab = false;
		var _actualSelected = $("div.navContainer div.active a").attr("href");

		/* if(_newURL !== undefined){
			_n = parseURL(_newURL);
		} 

		if(_actualSelected !== undefined){
			_actualSelected = parseURL(_actualSelected);
		}else{
			_actualSelected = new Array();
		}*/


		$("div.data").addClass("half_size");
		$("div.player").addClass("half_size");
		$("div.track_info").addClass("half_size");
		$("nav").addClass("half_size");

		activeTab(_zone);

		contentStatus = "show";
		Player.setStarStyle();

		return true;
	}

	function activeTab(_zone){
		$("nav div.active").removeClass("active");
		$("a[data-tab='"+_zone+"']").closest("div").addClass("active");
		tabActive = _zone;
	}

	function handleContent(_tempurl) {

		var _s = parseURL(_tempurl);
		var newURL;
		
		activeTab(_s[0]);

		$("div.content").removeClass("show");
		$("div.loading").addClass("show");

		if (document.location.pathname.indexOf('dev.')!=-1) {
			newURL = "http://www.megastar.fm/app_dev.php";
		}else{
			newURL = "http://germancascales.tk/megastarweb";
		}

		_s.forEach(function(entry) {
			newURL += "/" + entry;
		});

		// history.pushState(null, null, newURL);

		if(xhr){
			xhr.abort();
		}

		xhr = $.ajax({
			type: 'GET',
			url: newURL,
			cache: false,
			success: function(result){
				xhr = null;
				players = [];

				$("div.loading").removeClass("show");
				$("div.content").html(result).addClass("show");

				if(_s[0] == "twitter"){
					/*alert("holii");*/
					/*$("div.navbar").addClass("facebook");*/

					/*if (typeof twttr != 'undefined'){*/
						twttr.widgets.load();
					/*}*/

				}else{

					if(_s[0] == "facebook"){
						FB.XFBML.parse();
						/*$( "#track_video_yt" ).each(function() {
							playerYTVideo.playVideo("track_video_yt", $(this).attr("data-video"));
						});*/
					}

					$("div.navbar").removeClass("facebook");
					App.adjustIframe();
				}

				Player.setHeaderStyle();


			}
		});

	}

	function parseURL(_tempurl){

		var _s = _tempurl.split("/");
		var index = _s.indexOf("app_dev.php");
		_s.splice(0, (index + 1));

		if(_s[0] == ""){
			_s.splice(0, 1);
		}
		
		return _s; 
	}

	function preloadImages(){

		var images = new Array();
		var preload = [
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/1h.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/1.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/2h.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/2.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/3h.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/3.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/4h.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/4.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/5h.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/5.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/6h.png",
			"http://www.guiadebenalmadena.com/megastar/static/img/stars/6.png"
		];
		for (i = 0; i < preload.length; i++) {
			images[i] = new Image();
			images[i].src = preload[i];
		}
	}

	return {
		init: function () {
			preloadImages();
			handles();

			$('.loading').spin({
				lines: 13
				, length: 28
				, width: 14
				, radius: 42
				, scale: 0.5
				, corners: 1
				, color: '#000'
				, opacity: 0.25
				, rotate: 0
				, direction: 1
				, speed: 1
				, trail: 60
				, fps: 20
				, zIndex: 2e9
				, className: 'spinner'
				, top: '50%'
				, left: '50%'
				, shadow: false
				, hwaccel: false
				, position: 'absolute'
			});

			if(typeof navBarStatus == 'undefined' || navBarStatus == "hide"){
				setTimeout(function(){
					$( "nav .navHeader" ).trigger("click");
				}, 30000);
			}

		},

		refreshContent: function () {
			newURL = "http://germancascales.tk/megastarweb/estasonando";
			// history.pushState(null, null, newURL);
			handleContent("estasonando");
		},

		adjustIframe: function() {

			$("div.content iframe").each(function() {
				if($(this).closest( "div" ).hasClass("ad") === false){
					if($(this).hasClass("embed-responsive-item") === false){
						$(this).wrap( "<div class='embed-responsive embed-responsive-16by9'></div>" ).addClass("embed-responsive-item").attr("style", "width:100%");
					}
				}
			});
		},

		closeContent: function(){
			$("div.content").html("");
			$("div").removeClass("half_size");
			$("nav").removeClass("half_size");

			tabActive = "";

			if (document.location.pathname.indexOf('dev.')!=-1) {
				newURL = "http://www.megastar.fm/app_dev.php";
			}else{
				newURL = "http://" + window.location.hostname + "/";
			}
			// history.pushState(null, null, newURL);

			activeTab(newURL);
			contentStatus = "hide";
			Player.setStarStyle();
		}
	};

}();

var Playlist = function () {

	return {
		init: function () {

			var _lastTrack = 0;

			$("ul.playlist li .playAction").click(function(e){
				e.preventDefault();

				var _container = $(this).closest("li[data-track-id]");
				var _trackid = _container.attr('data-track-id');
				var _videoid = _container.attr('data-track-video');
				var _title =  _container.find("h6").html();
				var _artist = _container.find("h4").html();

				$("div.trackInfo").remove();
				$("i.fa-times").removeClass("fa-times").addClass("fa-youtube-play");

				if(_lastTrack != 0){
					players.pop();
				}

				if (_lastTrack != _trackid){

					_container.append('<div class="trackInfo"><div id="track_video_yt" data-video="' + _videoid + '"></div></div>');
					$( "#track_video_yt" ).each(function() {
						playerYTVideo.playVideo("track_video_yt", $(this).attr("data-video"));
					});

					_container.find('i.fa-youtube-play').removeClass("fa-youtube-play").addClass("fa-times");
					_lastTrack = _trackid;
				}else{
					_lastTrack = 0;
				}

			});

			playerYTVideo.playVideo("playlistMainVideo", $("#playlistMainVideo").attr("data-youtube"));
		}

	};

}();

var Artists = function () {

	var artistHash = null;
	var artistName = null;

	function loadArtist(hash){

		var link = "/artistas/" + hash;

		history.pushState(null, null, link);

		$('div.content').load(link ,function(response, status, xhr){});

		if (typeof ga !== "undefined" && ga !== null) {
			ga('send','pageview',link);
		}

	}

	return {
		init: function (list) {

			$(".artistSearch input").keyup(function(e) {

				if($(this).val() != artistName){
					$(".artistSearch div.input-group-addon").off();
				}else{
					$(".artistSearch div.input-group-addon").on("click", function(e) {
						loadArtist(artistHash);
					});
				}

			});

			$('.artistSearch input').autocomplete({
				lookup: list,
				onSelect: function (suggestion) {
					artistName = suggestion.value;
					artistHash = suggestion.data;
					loadArtist(suggestion.data);
				}
			});

		}
	};

}();

var new_config = {
	isLive:true,
	podId:75,
	autoPlay:true,
	embed:false,
	volume:true,
	skipad: 5,
	skin: 'megastarfm',
	techPriority: 'html5'
};

var Player = function () {

	var actualColor = "";

	var colors = new Array;
	colors[1] = "#b7c72c";
	colors[2] = "#f5da43";
	colors[3] = "#5ac5e7";
	colors[4] = "#1a1919";
	colors[5] = "#ce2631";
	colors[6] = "#d286b2";

	var styles = new Array;
	styles[1] = "green";
	styles[2] = "yellow";
	styles[3] = "blue";
	styles[4] = "black";
	styles[5] = "red";
	styles[6] = "pink";

	var lastID;

	function getTrackInfo(){
		checkDpi();

		$(".track_info").hide();
		$(".player").removeAttr("style");
		$(".star").removeAttr("style");

		//$.getJSON("http://apih.megastar.fm/?method=music.track_info&id=" + lastID + "&type=" + dpi, function(a) {
		$.getJSON("http://apih.megastar.fm/?method=music.track_info_bytile&str=" + encodeURIComponent(lastID) + "&type=" + dpi, function(a) {
			var b = Math.floor(Math.random() * a.images.length);
			actualColor = a.images[b].color;

			if (a.showNotif == 1 && dpi == "big") {
				launchNotificacion(a);
			}

			$(".player").css("background-image", "url(" + a.images[b].hash + ")");

			Player.setStarStyle();

			Player.setHeaderStyle();

			$(".dial").trigger("configure", {
				fgColor: colors[a.images[b].color]
			});

			if(a.title !== null){
				$(".player_title").html(a.title).show();
			}else{
				$(".player_title").hide();
			}
			$(".player_artist").html(a.artist);

			$(".track_info").show();

			updateMetaThemeColor(actualColor);

			if (tabActive == "estasonando"){
				App.refreshContent();
			}

		})
.error(function() { lastID = null; });

	}

	function launchNotificacion(a) {
		if (!Notification || a.showNotif == 0) {
			return;
		}

		if (Notification.permission !== "granted"){
			Player.notificationRequest();
			return;
		}

		var b = Math.floor(Math.random() * a.imagesNotif.length);

		var imagePath = "http://www.guiadebenalmadena.com/megastar/static/img/notifications/" + actualColor + ".png";

		if(a.imagesNotif[b].generic == 0){
			imagePath = "http://files.megastar.fm/media/artist/" + a.id_artist + "/100x100/" + a.imagesNotif[b].hash;
		}

		var notification = new Notification(a.artistReal, {
			icon: imagePath,
			body: a.title,
			dir: 'auto'
		});
		notification.onclick = function () {
			window.focus();
			notification.close();
		};
		setTimeout(function () {
			notification.close();
		}, 5000);

	}

	return {
		init: function (_c) {

			lastID = $("div.track_info").attr("data-initial-track");
			$("div.track_info").removeAttr("data-initial-track");

			actualColor = _c;

			//$("#player_main_ctrl").hide();

			// var initialVolume = Cookies.get('jwplayer.volume');
			initialVolume = Cookies.get('jwplayer.volume');

			if(typeof initialVolume === "undefined"){
				initialVolume = 25;
			}

			$(".dial").val(initialVolume);

			$(".dial").knob({
				'min': 0,
				'max': 100,
				'stopper': !0,
				'width': 112,
				'angleArc': 250,
				'angleOffset': -125,
				'displayInput': !1,
				'fgColor': "rgba(0,0,0,0)",
				'bgColor': "rgba(0,0,0,0)",
				'thickness': .09,
				'lineCap': "round",
				change: function (a) {
					jwplayer().setVolume(a);
				}
			});

			loadPlayer(47363);

			jwplayer().onSetupError(function() {
				console.log("ERROR Setup");
				console.log(event.message);
				$("#container_player_47363").hide();
				$("#player_main_ctrl").hide();
			});

			jwplayer().onAdError(function() {
				$("#container_player_47363").hide();
				$("#player_main_ctrl").show();
				$("#player_main_ctrl").removeClass("player_play").addClass("player_pause");
				$("#player_spinner").addClass("active");
				jwplayer().setVolume(initialVolume);
			});

			jwplayer().onAdComplete(function() {
				$("#container_player_47363").hide();
				$("#player_main_ctrl").show();

				$(".dial").trigger("configure", {
					fgColor: colors[actualColor]
				});
				$("#player_spinner").addClass("active");
				jwplayer().setVolume(initialVolume);
				$("#player_main_ctrl").removeClass("player_play").addClass("player_pause");
			});

			jwplayer().onAdSkipped(function() {
				$("#container_player_47363").hide();
				$("#player_main_ctrl").show();

				$(".dial").trigger("configure", {
					fgColor: colors[actualColor]
				});
				$("#player_spinner").addClass("active");

				jwplayer().setVolume(initialVolume);
				$("#player_main_ctrl").removeClass("player_play").addClass("player_pause");
			});

			jwplayer().onIdle(function(){
				$("#player_main_ctrl").removeClass("player_play").addClass("player_pause");
			});

			$("#player_main_ctrl").click(function(){
				var current = $(this).attr("class");
				if(current == "player_pause"){
					Player.stop();
				}else{
					Player.play();
				}
			});
		},

		notificationRequest: function (){

			if (Notification.permission !== "granted"){
				Notification.requestPermission();
			}

		},

		checkTitle: function (data) {

			if (lastID != data){
				lastID = data;
				// if (data == 0) {
				if (data == "SOLO TEMAZOS") {
					$.getJSON("static/json/fondos.json", function (data) {
				        if (dpi == "big") {
				            var aleatorio = Math.floor(Math.random() * data.fondosPC.length);
				            $(".player").css("background-image", "url(static/img/fondos_pc/" + data.fondosPC[aleatorio].file + ")");
				            $(".track_info").hide();

				        } else {
				            var aleatorio = Math.floor(Math.random() * data.fondosMovil.length);
				            $("#track_info").hide();
				            $("#background-image").css("background-image", "url(static/img/fondos_movil/" + data.fondosMovil[aleatorio].file + ")");
				        }
				    });
				} else {
					getTrackInfo();
				}
			}

		},

		play: function(){
			for (var i in players) {
				var _p = players[i];
				//_p.stopVideo();
			}
			jwplayer().play(true);
			$("#player_main_ctrl").removeClass("player_play").addClass("player_pause");
			$("#player_spinner").addClass("active");
		},

		stop: function(){
			$("#player_spinner").removeClass("active");
			jwplayer().stop();
			$("#player_main_ctrl").removeClass("player_pause").addClass("player_play");
		},

		setHeaderStyle: function(){
			$(".onair .songs ul").removeClass("default green yellow blue black red pink").addClass(styles[actualColor]);
			$(".navbar").removeClass("default green yellow blue black red pink").addClass(styles[actualColor]);
			$(".container-fluid").removeClass("default green yellow blue black red pink").addClass(styles[actualColor]);
			$(".track_info span").removeClass("default green yellow blue black red pink").addClass(styles[actualColor]);
			$(".subfooter .breadcrumb").removeClass("default green yellow blue black red pink").addClass(styles[actualColor]);
			$(".navHeader").removeClass("default green yellow blue black red pink").addClass(styles[actualColor]);
			$(".goOnAir").removeClass("default green yellow blue black red pink").addClass(styles[actualColor]);
		},

		setStarStyle: function(){
			if((typeof navBarStatus == 'undefined' || navBarStatus == "hide") && !$("div.data").hasClass("half_size")){
				$(".star").css("background-image", "url(http://www.guiadebenalmadena.com/megastar/static/img/stars/" + actualColor + "h.png)");
			}else{
				$(".star").css("background-image", "url(http://guiadebenalmadena.com/megastar/static/img/stars/" + actualColor + ".png)");
			}
		}
	};
}();

function getStreamTitle() {
	/* $.get("http://apih.megastar.fm/?method=music.current_track_id", function (a) {
		Player.checkTitle(a.id_track);
	}); */
	
	$.getJSON("http://bo.cope.webtv.flumotion.com/api/active?format=json&podId=75", function (a) {
       var current_song = $.parseJSON(a.value);
            if (current_song.author != '') {
               author = current_song.author + ' - ';
            } else {
               author = current_song.author;
            }
		Player.checkTitle(author + current_song.title);
	});
}

document.addEventListener('DOMContentLoaded', function () {
	indicativo();
	Player.notificationRequest();
	setInterval(getStreamTitle, 5000);
});

function loadFlashPlayer() {
	var audioStream = document.getElementById("indicativo");
    if (flashPlayerActivo == 0) {
    	audioStream.src = "";
    	audioStream.load();
  		$("#indicativo").remove();
    	$('.container_player_html5').remove();
    	Player.stop();
        $('.player_circle').remove();
        // $("#flashPlayer").html("<embed type=\"application/x-shockwave-flash\" src=\"static/audio/player2.swf\" height=\"24\" style=\"undefined\" id=\"playerFlash\" name=\"player\" bgcolor=\"#000000\" quality=\"high\" allowscriptaccess=\"always\" allowfullscreen=\"false\" flashvars=\"file=http://91.121.68.52:8012/;stream.nsv&amp;provider=sound&amp;bufferlength=2&amp;autostart=true\" wmode=\"opaque\">");
        $("#flashPlayer").html("<embed type=\"application/x-shockwave-flash\" src=\"static/audio/player2.swf\" height=\"24\" style=\"undefined\" id=\"playerFlash\" name=\"player\" bgcolor=\"#000000\" quality=\"high\" allowscriptaccess=\"always\" allowfullscreen=\"false\" flashvars=\"file=http://streaming5.elitecomunicacion.es:8030/live.mp3&amp;provider=sound&amp;bufferlength=5&amp;autostart=true\" wmode=\"opaque\">");
        flashPlayerActivo = 1;
    } else {
        null;
    }
}

function indicativo() {
    if (flashPlayerActivo == 0) {
    	// console.log(flashPlayerActivo);
    	var previousVolume = initialVolume;
        $( "#logo" ).mouseover(function() {
        	jwplayer().setVolume(20);
            audioIndicativo.play();
            setTimeout(function() {
            	jwplayer().setVolume(previousVolume);
            }, 2700);
        });
    }
}

function checkDpi() {
    if ($(window).width() < 450) {
        dpi = "xhdpi";
    } else {
        dpi = "big";
    }
}

function updateMetaThemeColor(myColor) {
	var myColor;
    if(myColor == '1') {
        themeColor = '#b7c72c'
    } else if(myColor == '2') {
        themeColor = '#f5da43';
    } else if(myColor == '3') {
        themeColor = '#5ac5e7';
    } else if(myColor == '4') {
        themeColor = '#1a1919';
    } else if(myColor == '5') {
        themeColor = '#ce2631';
    } else if(myColor == '6') {
        themeColor = '#d286b2';
    }

    $('meta[name=theme-color]').remove();
    $('head').append('<meta name="theme-color" content="'+themeColor+'">');
}

/* youtube-direct-lite */
var playerYTVideo = {

	playVideo: function(container, videoId) {

		if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
			window.onYouTubeIframeAPIReady = function() {
				playerYTVideo.loadPlayer(container, videoId);
			};
		} else {
			playerYTVideo.loadPlayer(container, videoId);
		}
	},

	loadPlayer: function(container, videoId) {

		var player = new YT.Player(container, {
			videoId: videoId,
			height: '309',
			width: '439',
			playerVars: {
				autoplay: 0,
				controls: 1,
				modestbranding: 1,
				rel: 0,
				showInfo: 0,
				hd: 1,
				vq: "hd720"
			},
			events: {
				'onReady': playerYTVideo.onPlayerReady,
				'onStateChange': playerYTVideo.onPlayerStateChange
			}
		});

		FB.XFBML.parse();
		App.adjustIframe();
		players.push(player);

	},

	onPlayerReady: function(){
		//App.adjustIframe();
	},

	onPlayerStateChange: function(event){
		if(event.data == YT.PlayerState.PLAYING){
			Player.stop();
		}else if(event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED){
			Player.play();
		}
	}
};

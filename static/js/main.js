    var API_PATH = "http://apih.megastar.fm/";
    var APP_URL = "/static/";

    var new_config = {
        isLive: false,
        embed: true,
        volume: true,
        fullscreen: false,
        showRadioFormat: true,
        autoPlay: true,
        basicColor: '#FFFFFF',
        secondaryColor: '#ff0000',
        theme: 'dark',
        border: '3',
        delay_change_stream: 10
    };

    var ytvideoloaded = 0;
	var plVideo;
	var pl;
	var loadYT;

	var sel_color;
	var page_orig_title = document.title;
	var content_block_is_visible = !0;

	var colors = new Array;
		colors[1] = "#15ab31";
		colors[2] = "#f6c500";
		colors[3] = "rgba(0,161,211,0.7)";
		colors[4] = "#ae805e";
		colors[5] = "rgba(251,11,26,0.6)";
		colors[6] = "rgba(238,0,123,0.6)";


	function onPlayerStateChange(event){
		if(event.data == YT.PlayerState.PLAYING){
			pause();
		}else if(event.data == YT.PlayerState.ENDED || event.data == YT.PlayerState.PAUSED){
			play();
		}
	}

	function onPlayerReady(e){
		ytvideoloaded = 1;
	}

	function onYouTubeIframeAPIReady(){
		plVideo = new YT.Player("track_video_yt", {
			height: "390",
			width: "640",
			playerVars: {
				version: 3,
				controls: 1,
				autoplay: 0,
				hd: 1,
				showinfo: 0,
				vq: "hd720",
				rel: 0,
				iv_load_policy: 3,
				modestbranding: 1
			},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	$(document).ready(function () {

        $("#content_block_show_ctrl").click(hideContentBlock);
		changeAppearence(0);

		loadPlayer(47363);

		$("a[data-type-program]").click(function(e){
			history.pushState(null, null, $(this).attr("href"));
			e.preventDefault();

			targ = $(this).attr("data-canonical");
			pag = $(this).attr("data-type-program");
			if(pag == "blog"){
				$("#page_"+targ).find("div.blog_container_program").show();
				$("#page_"+targ).find("div#page_twitter").hide();
			}else{
				$("#page_"+targ).find("div.blog_container_program").hide();
				$("#page_"+targ).find("div#page_twitter").show();
			}

		});

		$("a[data-type-twitter]").click(function(e){
			history.pushState(null, null, $(this).attr("href"));
			e.preventDefault();

			targ = $(this).attr("data-type-twitter");
		  	$("#page_twitter .active_page").removeClass("active_page").addClass("hidden");
		  	$("#page_twitter #page_content_twitter_"+targ).removeClass("hidden").addClass("active_page");

		});

		$("a[data-target-inside]").click(function(e){
			e.preventDefault();

			var target = $(this).attr("data-target-inside");

			$("#" + target).show();

			$("#page_" + actual_tab).hide();
			$("div.tab_main").removeClass("sel");

			actual_tab = "";

		});

		$("a[data-tab]").click(function(e){
			e.preventDefault();

			var father = $(this).find("div");
			var target = $(this).attr("data-tab");

			if (target != actual_tab){

				history.pushState(null, null, $(this).attr("href"));

				$("div.tab_main").removeClass("sel");
				father.addClass("sel");
				updateSelMainTabColor();

				$("#page_legal").hide();
				$("#page_" + actual_tab).hide();
				$("#page_" + actual_tab).find("div#page_blog_post").hide();
				$("#page_" + target).show();
				actual_tab = target;

				$("#page_"+target).find("div.blog_container_program").show();
				$("#page_"+target).find("div#page_twitter").hide();
			}
		});

		$("div[data-ctrl], a[data-ctrl]").click(function(e){

			type = $(this).attr("data-ctrl");
			targ = $(this).attr("data-program");
			ref = $(this).attr("data-href");

			if(type == "refresh"){
				$.get(ref, function (r) {
					$("#page_content_" + targ + "_blog").find("div#blog_content").html(r);
				});
			}else if(type == "back"){
				e.preventDefault();
				history.pushState(null, null, $(this).attr("href"));


				$("#page_"+targ).find("#page_blog_post").hide();
				$("#page_"+targ).find("#page_content_" + targ + "_blog").show();

			}

		});

		$("a[data-post-id]").click(function(e){
			e.preventDefault();
			history.pushState(null, null, $(this).attr("href"));

			content = '<div class="post">' + $("#post-"+$(this).attr("data-post-id")).html() + '</div>';
			targ = $(this).attr("data-canonical");

			$("#page_"+targ).find("#page_blog_post").find("#blog_content").html(content);
			$("#page_"+targ).find("#page_blog_post").find("#blog_content").find("a[data-post-id]").addClass("disabled");
			$("#page_"+targ).find("#page_content_" + targ + "_blog").hide();
			$("#page_"+targ).find("#page_blog_post").show();

		});

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
				videoControllers.getItem(47363).setVolume(a);
			}
		});

		if(has_post == 1){
			$("#page_"+actual_tab).find("#page_content_" + actual_tab + "_blog").hide();
			$("#page_"+actual_tab).find("#page_blog_post").show();
		}


		$("div#playlist_block ul li").click(function(e){
			pause();
			_trackid = $(this).attr('data-track-id');
			changeAppearence(1);

			$.ajax( {
				url: "/playlist/" + _trackid,
				type: "GET",
				cache: true,
				success: function(html) {
					$("#playlistModal .modal-content").html(html);
					$("#playlistModal").modal('show');
				}
			});

		});

		$('#playlistModal').on('hidden.bs.modal', function () {
			loadPlayer(47363);
			$('#playlistModal .modal-content').html("");
			changeAppearence(0);
			//play();

		});

		$(".modal_close").click(function () {
			$(".modal_window").addClass("hidden")
		})

		$( document ).on( "click", ".share_facebook", shareFacebook);
		$( document ).on( "click", ".share_twitter", shareModal);
		$( document ).on( "click", ".share_tuenti", shareModal);

		$( document ).on( "click", ".post img", showImageModal);
		$( document ).on( "click", "div.link_button li.programacion a", showProgramacionModal);

    });

	function changeTab(t){
		if (t != actual_tab){

			$("div.tab_main").removeClass("sel");
			father.addClass("sel");
			updateSelMainTabColor();

			$("#" + actual_tab).hide("fast", function() {
				$("#" + target).show("fast", function(){
					actual_tab = target;
				});
			});
		}

		$("#page_blog_post").hide();
	}


    function hideContentBlock() {
        content_block_is_visible = !1;
        width = $("#content_block").width();
        $("#content_block").animate({
            "margin-left": -width
        }, 700, function () {
            $("#content_block_show_ctrl").off("click");
            $("#content_block_show_ctrl").click(showContentBlock);
            $("#content_block_show_ctrl").attr("class", "content_block_ctrl_show");
        });
    }

    function showContentBlock() {
        content_block_is_visible = !0;
        width = $("#content_block").width();
        $("#content_block").animate({
            "margin-left": 0
        }, 700, function () {
            $("#content_block_show_ctrl").off("click");
            $("#content_block_show_ctrl").click(hideContentBlock);
            $("#content_block_show_ctrl").attr("class", "content_block_ctrl_hide");
        });
    }

    function play() {
        lastTime = 0;
        //videoControllers.getItem(47363).play();
		loadPlayer(47363);
        document.getElementById("player_main_ctrl").className = "player_pause";
        $("#player_spinner").css("opacity", "1");
        $("#player_main_ctrl").off("click");
        $("#player_main_ctrl").click(pause);


		/*$.get(API_PATH + "?method=music.current_track_id", function (a) {
			if(a.id_track != current_track_id){
				current_track_id = a.id_track;
				changeAppearence(0);
			}
		});*/


        document.title = "\u25b6 " + page_orig_title;
    }

    function pause() {
        videoControllers.getItem(47363).pause();
        document.getElementById("player_main_ctrl").className = "player_play";
        $("#player_spinner").css("opacity", "0");
        $("#player_main_ctrl").off("click");
        $("#player_main_ctrl").click(play);
        document.title = page_orig_title;
    }

	function parseMetaData(a) {
		var b = parseInt(a.split("-", 1), 10);
		return b
	}

	function getStreamTitle(a) {

		if (document.getElementById("audio").style.visibility = "hidden", $("#player_main_ctrl").css("visibility", "visible"), document.getElementById("player_main_ctrl").className = "player_pause", $("#player_spinner").css("opacity", "1"), $("#player_main_ctrl").off("click"), $("#player_main_ctrl").click(pause), document.title = "\u25b6 " + page_orig_title) {
			var b = parseMetaData(a);
			if (b != current_track_id){
				current_track_id = b;
				changeAppearence(0);
			}
		}

	}

	function drawCompanionAd(code, click, type) {
		$("#audio").show();
	}

	function changeAppearence(isPlaylist) {

		if(isPlaylist == 1){
			showTrackId = _trackid;
		}else{
			showTrackId = current_track_id;
		}

		$.getJSON(API_PATH + "?method=music.track_info&id=" + showTrackId + "&type=big", function(a) {
			if(357 == showTrackId){
				$("#logo").hide();
			}else{
				$("#logo").show();
			}

			$("#track_info").show();

			if(a.title !== null){
				$("#player_title").html(a.title);
				$("#player_title").show();
			}else{
				$("#player_title").hide();
			}
			$("#player_artist").html(a.artist);

			var b = Math.floor(Math.random() * a.images.length);

			$("#background-image").css("background-image", "url(" + a.images[b].hash + ")");
			$("#background-image2").prop("src", APP_URL + "img/stars/" + a.images[b].color + ".png");
			$(".dial").trigger("configure", {
				fgColor: colors[a.images[b].color]
			});
			sel_color = colors[a.images[b].color];
			updateSelMainTabColor();

			if (a.lyrics !== "null" && a.lyrics != "NULL"){
				//a.lyrics = a.lyrics.replace(/\r?\n/g, "<br>");
				$("#lyrics_block").html(a.lyrics);
			}else{
				$("#lyrics_block").html("");
			}

			if (a.video_url !== null){

				var d = a.video_url;

				loadVideo(d);

				$("#track_video_block").show();
				$("#track_video_yt").show();

			}else{
				$("#track_video_block").hide();
				$("#track_video_yt").hide();
			}
		});

	}

	function loadVideo(d){
		if(ytvideoloaded == 1){
			plVideo.cueVideoById(d);
			clearTimeout(loadYT);
		}else{
			loadYT = setTimeout(function() {
				loadVideo(d);
			}, 20000);
		}
	}


	function updateSelMainTabColor() {
		$(".tab_main.sel, .tab_music.sel").css("borderLeftColor", sel_color)
	}

	function rotate(a) {
		var b = 0;
		setInterval(function () {
			a.css({
				transform: "rotate(" + b + "deg)"
			}), 360 == b ? b = 0 : b++
		}, 15)
	}

	function dump(a) {
		var b = "";
		for (var c in a) b += c + ": " + a[c] + "\n";
		return b
	}

	function base64_decode(a) {
		var c, d, e, f, g, h, i, j, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			k = 0,
			l = 0,
			m = "",
			n = [];
		if (!a) return a;
		a += "";
		do f = b.indexOf(a.charAt(k++)), g = b.indexOf(a.charAt(k++)), h = b.indexOf(a.charAt(k++)), i = b.indexOf(a.charAt(k++)), j = f << 18 | g << 12 | h << 6 | i, c = 255 & j >> 16, d = 255 & j >> 8, e = 255 & j, n[l++] = 64 == h ? String.fromCharCode(c) : 64 == i ? String.fromCharCode(c, d) : String.fromCharCode(c, d, e); while (k < a.length);
		return m = n.join("")
	}

	function shareModal(){

		var url = $(this).data("url");
		//console.log("URL DE LA MODAL : "+ url);
		var w = 500;
		var h = 400;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		var win = window.open(url, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
		win.focus();

	}

	function shareFacebook(e){

		e.preventDefault();
		FB.ui(
			{
				method: 'feed',
				name: 'MegaStarFM | ' + $(this).data("title"),
				link: $(this).data("url"),
				description: $(this).data("content"),
				picture: 'http://www.megastar.fm/static/img/logo_background.jpg'
			});
	};

	var showImageModal = function (id){

		$("#modal_image .modal_window_add .content_modal").html('<img src="'+ $(this).attr("src") +'"/>');

		$("#modal_image").removeClass("hidden");

	}

	var showProgramacionModal = function (e){

		e.preventDefault();

		$("#modal_image .modal_window_add .content_modal").html('<img src="'+ $(this).attr("href") +'"/>');

		$("#modal_image").removeClass("hidden");

	}

	$(document).bind("touchmove", function (a) {
		a.preventDefault()
	});
(function($) {
    var debug = false;
    var comscore_active = true;
    var xmlDoc;
    var player_size;
    var streamSense;
    var carrousel_started = false;
    var carrousel_image = 0;
    var carrousel_interval;
    var xmlData = new Object;
    var metadata_api = 'http://bo.cope.webtv.flumotion.com/';
    var metadata_interval;
    var ads_completed = false;
    var delaybar_displayed = false;
    var delay_position;
    var delay_newPosition;
    var content_type;
    var config = {
        isLive: false,
        volume: true,
        configuration: false,
        fullscreen: true,
        autoPlay: true,
        delay_change_stream: false,
        skipad: 0,
        techPriority: 'html5'
    };
    write_log = function(data) {
        if (debug) {
            console.log(data)
        }
    };
    checkExtension = function(file) {
        var pos = file.lastIndexOf(".");
        var query_pos = file.lastIndexOf("?");
        if (query_pos != -1) {
            var extension = file.substr(pos + 1, query_pos - (pos + 1))
        } else {
            var extension = file.substr(pos + 1)
        }
        return extension
    };
    isValidURL = function(url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url)
    };
    retrieveURL = function(filename) {
        var scripts = document.getElementsByTagName('script');
        if (scripts && scripts.length > 0) {
            for (var i in scripts) {
                if (scripts[i].src && (scripts[i].src.match(new RegExp(filename + '\\.js$')))) {
                    return scripts[i].src.replace(new RegExp('(.*)' + filename + '\\.js$'), '$1')
                }
                if (scripts[i].src && (scripts[i].src.match(new RegExp(filename + '\.min\.js$')))) {
                    return scripts[i].src.replace(new RegExp('(.*)' + filename + '\.min\.js$'), '$1')
                }
            }
        }
    };
    parseM3U = function(file) {
        var stream_url;
        $.ajax({
            url: file,
            type: 'get',
            async: false,
            success: function(file_string) {
                var lines = file_string.split("\n");
                for (var i = 0, len = lines.length; i < len; i++) {
                    stream_url = decodeURIComponent(lines[i]);
                    if (isValidURL(stream_url)) {
                        return true
                    }
                }
            }
        });
        return stream_url
    };
    flashInstalled = function() {
        var hasFlash = false;
        try {
            var fo = (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash']) ? navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin : 0;
            if (fo) {
                hasFlash = true
            }
        } catch (e) {
            if (navigator.mimeTypes['application/x-shockwave-flash'] != undefined) {
                hasFlash = true
            }
        }
        return hasFlash
    };
    loadXMLFile = function(xmlConfig, xmlData) {
        $.ajax({
            type: "GET",
            url: xmlConfig,
            dataType: "xml",
            async: false,
            success: function(xml) {
                var $xmlTag = $(xml).find('xml');
                if ($xmlTag.length > 0) {
                    $(xml).find('xml').each(function() {
                        xmlData.id = $(this).find('id').text();
                        xmlData.url_page = $(this).find('url_page').text();
                        xmlData.title = $(this).find('title').text();
                        xmlData.controlbar_text = $(this).find('controlbar_text').text();
                        xmlData.delay_text = $(this).find('delay_text').text();
                        xmlData.description = $(this).find('description').text();
                        xmlData.introduction = $(this).find('introduction').text()
                    })
                } else {
                    $(xml).find('live').each(function() {
                        xmlData.id = $(this).find('id').text();
                        xmlData.url_page = $(this).find('url_page').text();
                        xmlData.title = $(this).find('title').text();
                        xmlData.controlbar_text = $(this).find('controlbar_text').text();
                        xmlData.delay_text = $(this).find('delay_text').text();
                        xmlData.description = $(this).find('description').text();
                        xmlData.introduction = $(this).find('introduction').text()
                    })
                }
                $(xml).find('stats').each(function() {
                    xmlData.c3 = $(this).find('c3').text();
                    xmlData.c4 = $(this).find('c4').text()
                });
                xmlData.pictures = new Array;
                $(xml).find('pictures').each(function() {
                    if ($(this).find('picture').length > 1) {
                        xmlData.carrousel = true
                    } else {
                        xmlData.carrousel = false
                    }
                    xmlData.pictures_time = $(this).attr('time');
                    xmlData.pictures_imagenes = $(this).attr('imagenes');
                    $(this).find('picture').each(function(index) {
                        xmlData.pictures[index] = $.trim($(this).text())
                    })
                });
                var $contents = $(xml).find('contents');
                content_type = $($contents).attr('type');
                xmlData.videos = new Array;
                var i = 0;
                $($contents).find('video').each(function(index, value) {
                    if ($(this).attr('type') == 'preroll') {
                        xmlData.vast_url = $.trim($(this).find('url').text());
                        i++
                    } else {
                        var $tmp_url = $.trim($(this).find('url').text());
                        var $tmp_urlHtml = $.trim($(this).find('urlHtml').text());
                        var $tmp_urlMobile = $.trim($(this).find('urlMobile').text());
                        var $tmp_download_url = $.trim($(this).find('download_url').text());
                        if (checkExtension($tmp_url) == 'm3u') {
                            $tmp_url = parseM3U($tmp_url)
                        }
                        if ($tmp_urlHtml != '') {
                            if (checkExtension($tmp_urlHtml) == 'm3u') {
                                $tmp_urlHtml = parseM3U($tmp_urlHtml)
                            }
                        } else {
                            $tmp_urlHtml = $tmp_url
                        }
                        if ($tmp_urlMobile != '') {
                            if (checkExtension($tmp_urlMobile) == 'm3u') {
                                $tmp_urlMobile = parseM3U($tmp_urlMobile)
                            }
                        } else {
                            $tmp_urlMobile = $tmp_url
                        }
                        xmlData.videos[index - i] = {
                            url: $tmp_url,
                            urlHtml: $tmp_urlHtml,
                            urlMobile: $tmp_urlMobile,
                            download_url: $tmp_download_url
                        }
                    }
                });
                xmlData.audios = new Array;
                $($contents).find('audio').each(function(index, value) {
                    var $tmp_url = $.trim($(this).find('url').text());
                    var $tmp_urlHtml = $.trim($(this).find('urlHtml').text());
                    var $tmp_urlMobile = $.trim($(this).find('urlMobile').text());
                    var $tmp_download_url = $.trim($(this).find('download_url').text());
                    if (checkExtension($tmp_url) == 'm3u') {
                        $tmp_url = parseM3U($tmp_url)
                    }
                    if ($tmp_urlHtml != '') {
                        if (checkExtension($tmp_urlHtml) == 'm3u') {
                            $tmp_urlHtml = parseM3U($tmp_urlHtml)
                        }
                    } else {
                        $tmp_urlHtml = $tmp_url
                    }
                    if ($tmp_urlMobile != '') {
                        if (checkExtension($tmp_urlMobile) == 'm3u') {
                            $tmp_urlMobile = parseM3U($tmp_urlMobile)
                        }
                    } else {
                        $tmp_urlMobile = $tmp_url
                    }
                    xmlData.audios[index] = {
                        url: $tmp_url,
                        urlHtml: $tmp_urlHtml,
                        urlMobile: $tmp_urlMobile,
                        download_url: $tmp_download_url
                    }
                });
                $(xml).find('services').each(function() {
                    xmlData.embed = $.trim($(this).find('embed').text())
                })
            }
        })
    };
    loadPlayer = function(controllerId) {
        var playerDiv = 'player_' + controllerId;
        var xmlConfig = $('#' + playerDiv).attr('rel');
        write_log('loading player');
        if (typeof new_config != 'undefined') {
            $.each(new_config, function(index, value) {
                config[index] = value
            })
        }
        scriptFolder = retrieveURL('player.flumotion');
        var $active_skin;
        if (config.isLive) {
            $active_skin = scriptFolder + 'skins/' + config.skin + '/' + config.skin + '-live.xml'
        } else {
            $active_skin = scriptFolder + 'skins/' + config.skin + '/' + config.skin + '.xml'
        }
        write_log('ACTIVE SKIN: ' + $active_skin);
        loadXMLFile(xmlConfig, xmlData);
        var $active_url;
        if (/Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $active_url = 'urlHtml'
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            $active_url = 'urlMobile'
        } else {
            $active_url = 'url'
        }
        write_log('STREAM URL : ' + $active_url);
        $playlist = new Array;
        var $stream_url;
        if (content_type == 'audio') {
            if (xmlData.audios.length == 1) {
                switch ($active_url) {
                    case 'urlHtml':
                        $stream_url = xmlData.audios[0].urlHtml;
                        $playlist[0] = {
                            file: xmlData.audios[0].urlHtml
                        };
                        break;
                    case 'urlMobile':
                        $stream_url = xmlData.audios[0].urlMobile;
                        $playlist[0] = {
                            file: xmlData.audios[0].urlMobile
                        };
                        break;
                    default:
                        if (!flashInstalled() && checkExtension(xmlData.audios[0].url) == 'flv') {
                            $stream_url = xmlData.audios[0].urlHtml
                        } else {
                            $stream_url = xmlData.audios[0].url
                        }
                        $playlist[0] = {
                            file: $stream_url
                        };
                        break
                }
            } else {
                for (var i = 0; i < xmlData.audios.length; i++) {
                    switch ($active_url) {
                        case 'urlHtml':
                            $playlist[i] = {
                                file: xmlData.audios[i].urlHtml,
                                adschedule: {
                                    offset: 'pre',
                                    tag: xmlData.vast_url
                                }
                            };
                            break;
                        case 'urlMobile':
                            $playlist[i] = {
                                file: xmlData.audios[i].urlMobile,
                                adschedule: {
                                    offset: 'pre',
                                    tag: xmlData.vast_url
                                }
                            };
                            break;
                        default:
                            if (!flashInstalled() && checkExtension(xmlData.audios[i].url) == 'flv') {
                                $stream_url = xmlData.audios[i].urlHtml
                            } else {
                                $stream_url = xmlData.audios[i].url
                            }
                            $playlist[i] = {
                                file: $stream_url,
                                adschedule: {
                                    offset: 'pre',
                                    tag: xmlData.vast_url
                                }
                            };
                            break
                    }
                }
            }
        } else {
            if (xmlData.videos.length == 1) {
                switch ($active_url) {
                    case 'urlHtml':
                        $stream_url = xmlData.videos[0].urlHtml;
                        $playlist[0] = {
                            file: xmlData.videos[0].urlHtml
                        };
                        break;
                    case 'urlMobile':
                        $stream_url = xmlData.videos[0].urlMobile;
                        $playlist[0] = {
                            file: xmlData.videos[0].urlMobile
                        };
                        break;
                    default:
                        if (!flashInstalled() && checkExtension(xmlData.videos[0].url) == 'flv') {
                            $stream_url = xmlData.videos[0].urlHtml
                        } else {
                            $stream_url = xmlData.videos[0].url
                        }
                        $playlist[0] = {
                            file: $stream_url
                        };
                        break
                }
            } else {
                for (var i = 0; i < xmlData.videos.length; i++) {
                    switch ($active_url) {
                        case 'urlHtml':
                            $playlist[i] = {
                                file: xmlData.videos[i].urlHtml,
                                adschedule: {
                                    offset: 'pre',
                                    tag: xmlData.vast_url
                                }
                            };
                            break;
                        case 'urlMobile':
                            $playlist[i] = {
                                file: xmlData.videos[i].urlMobile,
                                adschedule: {
                                    offset: 'pre',
                                    tag: xmlData.vast_url
                                }
                            };
                            break;
                        default:
                            if (!flashInstalled() && checkExtension(xmlData.videos[i].url) == 'flv') {
                                $stream_url = xmlData.videos[i].urlHtml
                            } else {
                                $stream_url = xmlData.videos[i].url
                            }
                            $playlist[i] = {
                                file: $stream_url,
                                adschedule: {
                                    offset: 'pre',
                                    tag: xmlData.vast_url
                                }
                            };
                            break
                    }
                }
            }
        }
        var $active_bg_image;
        if (xmlData.pictures.length != 0) {
            if (xmlData.carrousel) {
                $active_bg_image = scriptFolder + 'images/bg.png'
            } else {
                $active_bg_image = xmlData.pictures[0]
            }
        } else {
            $active_bg_image = ''
        }
        var $controlbar_text;
        if (xmlData.controlbar_text != '') {
            $controlbar_text = xmlData.controlbar_text
        } else {
            $controlbar_text = ''
        }
        var $playerOptions = {
            image: $active_bg_image,
            primary: config.techPriority,
            width: "100%",
            height: "30",
            abouttext: "About Flumotion Player",
            aboutlink: "http://www.flumotion.com",
            title: $controlbar_text,
            advertising: {
                client: "vast",
                schedule: {
                    adbreak: {
                        offset: 'pre',
                        tag: xmlData.vast_url
                    }
                },
                skipoffset: config.skipad,
                skipmessage: 'Saltar xx seg.',
                skiptext: 'Saltar',
                admessage: 'El anuncio termina en xx segundos.'
            },
            skin: $active_skin,
            startparam: 'starttime',
            androidhls: true,
            repeat: false,
            analytics: {enabled:false}
        };
        if (config.isLive) {
            $playerOptions.bufferlength = '0'
        }
        if (content_type == 'audio' && !$active_bg_image) {
            $playerOptions.height = '30'
        } else {
            $playerOptions.aspectratio = '16:9'
        }
        if (config.autoPlay) {
            $playerOptions.autostart = true
        } else {
            $playerOptions.autostart = false
        }
        if ($playlist.length > 1) {
            $playerOptions.playlist = $playlist
        } else {
            $playerOptions.file = $stream_url
        }
        jwplayer('player_' + controllerId).setup($playerOptions);
        player_size = 'minimized';
        jwplayer('player_' + controllerId).onAdPlay(function(event) {
            $("#slide").remove();
            write_log('onAdPlay');
            write_log(event)
        });
        jwplayer('player_' + controllerId).onAdPause(function() {
            write_log('onAdPause')
        });
        jwplayer('player_' + controllerId).onAdComplete(function() {
            minimizePlayer();
            write_log('onAdComplete');
            ads_completed = true;
            loadCarrousel()
        });
        jwplayer('player_' + controllerId).onAdSkipped(function() {
            minimizePlayer();
            write_log('onAdSkipped');
            ads_completed = true;
            loadCarrousel()
        });
        jwplayer('player_' + controllerId).onAdError(function(event) {
            minimizePlayer();
            write_log('onAdError: TAG: ' + event.tag + ' - MESSAGE: ' + event.message);
            ads_completed = true;
            loadCarrousel()
        });
        jwplayer('player_' + controllerId).onAdImpression(function(event) {
            if (event.creativetype == 'video' || event.creativetype == "vpaid") {
                maximizePlayer()
            }
        });
        jwplayer('player_' + controllerId).onAdCompanions(function(event) {
            for (var i = 0; i < event.companions.length; i++) {
                var entry = event.companions[i];
                drawCompanionAd(entry.resource, entry.click, entry.type, entry.width, entry.height)
            }
        });
        jwplayer('player_' + controllerId).onAdTime(function(event) {
            var ad_duration = Math.floor(event.duration);
            if (ad_duration == 1 && player_size == 'maximized') {}
        });
        startPlayer = function() {
            jwplayer('player_' + controllerId).play();
            $('#sincronize-image').attr('src', scriptFolder + 'images/sincronize-icon.png')
        };
        jwplayer('player_' + controllerId).onReady(function() {
            minimizePlayer();
            initComscore()
        });
        jwplayer('player_' + controllerId).onBuffer(function() {
            // streamsense.notify(ns_.StreamSense.PlayerEvents.BUFFER, {}, jwplayer('player_' + controllerId).getPosition())
        });
        jwplayer('player_' + controllerId).onPlay(function() {
            // streamsense.notify(ns_.StreamSense.PlayerEvents.PLAY, {}, jwplayer('player_' + controllerId).getPosition());
            if ($active_bg_image) {
                maximizePlayer()
            }
            write_log('onPlay');
            if (ads_completed) {
                loadCarrousel()
            }
            
            /*loadMetadata();
            if (config.isLive) {
                metadata_interval = setInterval(loadMetadata, 10000)
            } */
            if (config.isLive && config.delay_change_stream) {
                init_delaybar()
            }
        });
        jwplayer('player_' + controllerId).onPause(function() {
            // streamsense.notify(ns_.StreamSense.PlayerEvents.PAUSE, {}, jwplayer('player_' + controllerId).getPosition());
            stopCarrousel();
            stopMetadata()
        });
        minimizePlayer = function() {
            if (player_size == 'minimized') {
                return true
            }
            var $width = $('#player_' + controllerId).width();
            if (!$active_bg_image && content_type != 'video') {
                $('#player_' + controllerId).height('30px')
            }
            player_size = 'minimized'
        };
        maximizePlayer = function() {
            if (player_size != 'maximized') {
                var $width = $('#player_' + controllerId).width();
                var $new_height = $width * 9 / 16;
                if (jwplayer('player_' + controllerId).getRenderingMode() == 'flash') {
                    $('#player_' + controllerId).height($new_height)
                } else {
                    jwplayer('player_' + controllerId).resize($width, $new_height)
                }
                player_size = 'maximized'
            }
        };
        changeBackground = function() {
            var new_slide;
            if (carrousel_image >= xmlData.pictures.length) {
                carrousel_image = 0
            }
            new_slide = xmlData.pictures[carrousel_image];
            if ($('#slide').length != 0) {
                $("#slideOverlay").fadeOut('fast', function() {
                    $("#slideOverlay").html('<img src="' + new_slide + '" height="' + height + '" style="margin:none;padding:0px;"/>').fadeIn('slow')
                })
            } else {
                var slide_div = document.createElement("div");
                var is_flash_player;
                if (jwplayer('player_' + controllerId).getRenderingMode() == "html5") {
                    var myPlayer = document.getElementById('player_' + controllerId);
                    is_flash_player = false
                } else {
                    var myPlayer = document.getElementById('player_' + controllerId + "_wrapper");
                    is_flash_player = true
                }
                slide_div.setAttribute('id', 'slide');
                myPlayer.appendChild(slide_div);
                width = $('#player_' + controllerId).width();
                height = width * 9 / 16;
                if (is_flash_player) {
                    var div_height = height - 30
                } else {
                    var div_height = height
                }
                var slide_code = '<div id="slideOverlay" class="slideOverlay" style="height:' + div_height + 'px;"></div>';
                slide_div.innerHTML = slide_code;
                slide_div.style.display = "table";
                slide_div.style.zIndex = "0";
                slide_div.style.height = div_height + 'px';
                $("#slideOverlay").html('<img src="' + new_slide + '" height="' + height + '" style="margin:none;padding:0px;"/>').fadeIn('slow')
            }
            carrousel_image++
        };
        loadCarrousel = function() {
            if (carrousel_started) {
                return true
            }
            if (xmlData.carrousel && !carrousel_started) {
                changeBackground();
                carrousel_interval = setInterval(changeBackground, xmlData.pictures_time * 1000);
                carrousel_started = true;
                write_log('CARROUSEL STARTED')
            }
        };
        stopCarrousel = function() {
            if (carrousel_started) {
                clearInterval(carrousel_interval);
                carrousel_started = false
            }
        };
        loadMetadata = function() {
            if (content_type == 'audio') {
                if (config.isLive && config.podId) {
                    write_log('loading metadata from API');
                    /* var metadata_url = metadata_api + 'api/active?format=json&podId=' + config.podId;
                    $.getJSON(metadata_url, function(data) {
                        var current_song = $.parseJSON(data.value);
                        if (current_song.author != '') {
                            author = current_song.author + ' - '
                        } else {
                            author = current_song.author
                        }
                        getStreamTitle(author + current_song.title)
                    }) */
                   
                        // getStreamTitle();
                }
                if (!config.isLive) {
                    write_log('loading metadata from ID3');
                    var index = jwplayer('player_' + controllerId).getPlaylistIndex();
                    switch ($active_url) {
                        case 'urlHtml':
                            $stream_url_check = xmlData.audios[index].urlHtml;
                            break;
                        case 'urlMobile':
                            $stream_url_check = xmlData.audios[index].urlMobile;
                            break;
                        default:
                            $stream_url_check = xmlData.audios[index].url;
                            break
                    }
                    /*ID3.loadTags($stream_url_check, function() {
                        var tags = ID3.getAllTags($stream_url_check);
                        if (tags.artist != '') {
                            author = tags.artist + ' - '
                        } else {
                            author = tags.artist
                        }
                        getStreamTitle(author + tags.title)
                    })*/
                }
            }
        };
        stopMetadata = function() {
            clearInterval(metadata_interval)
        };
        initComscore = function() {
            /* if (!comscore_active) {
                return false
            }
            streamsense = new ns_.StreamSense({}, 'http://b.scorecardresearch.com/p?c1=2&c2=15131279&c3=' + xmlData.c3 + '&c4=' + xmlData.c4 + '&c5=02');
            streamsense.setPlaylist() */
        };
        $(document).on('click', '#shareClose', function(e) {
            $('#share').hide();
            e.preventDefault()
        });
        jwplayer('player_' + controllerId).onPlaylistComplete(function() {
            // streamsense.notify(ns_.StreamSense.PlayerEvents.END, {}, jwplayer('player_' + controllerId).getPosition());
            stopCarrousel();
            stopMetadata();
            maximizePlayer();
            if ($('#share').length != 0) {
                $('#share').show();
                return true
            }
            var share_div = document.createElement("div");
            if (jwplayer('player_' + controllerId).getRenderingMode() == "html5") {
                var myPlayer = document.getElementById('player_' + controllerId)
            } else {
                var myPlayer = document.getElementById('player_' + controllerId + "_wrapper")
            }
            share_div.setAttribute('id', 'share');
            myPlayer.appendChild(share_div);
            var share_code = '<div class="shareOverlay">' + '<a id="shareClose" href="#" title="Cerrar">X</a>' + '<h2>' + 'COMPARTE CON TUS AMIGOS' + '</h2>' + '<div class="shareCode">';
            if (xmlData.embed) {
                share_code = share_code + '<small class="embed">Copia este c&oacute;digo y ponlo en tu web</small>' + '<textarea class="embed" id="shareEmbed" rows="3" onclick="this.focus();this.select();" >' + xmlData.embed + '</textarea>'
            }
            share_code = share_code + '<ul class="shareIcons">';
            if (xmlData.download_url) {
                share_code = share_code + '<li><a target="_blank" href="' + xmlData.download_url + '" download><img src="' + scriptFolder + 'images/download-icon.png" alt="Descargar" title="Descargar"/></a></li>'
            }
            share_code = share_code + '<li><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' + xmlData.url_page + '&t=' + xmlData.title + '"><img src="' + scriptFolder + 'images/facebook-icon.png" alt="Compartir en Facebook" title="Compartir en Facebook"/></a></li>' + '<li><a target="_blank" href="https://twitter.com/intent/tweet?text=' + xmlData.title + '&url=' + xmlData.url_page + '"><img src="' + scriptFolder + 'images/twitter-icon.png" alt="Compartir en Twitter" title="Compartir en Twitter"/></a></li>' + '</ul>' + '</div>' + '</div>';
            share_div.innerHTML = share_code;
            share_div.style.display = "table";
            width = $('#player_' + controllerId).width();
            height = width * 9 / 16;
            share_div.style.height = height + 'px'
        });
        var bar, current;
        init_delaybar = function() {
            if (!delaybar_displayed) {
                create_delaybar();
                write_log('sincronizando init_delaybar')
            }
        };
        create_delaybar = function() {
            delaybar_displayed = true;
            var delaybar_div = document.createElement("div");
            delaybar_div.setAttribute('id', 'delaybar');
            if (jwplayer('player_' + controllerId).getRenderingMode() == "html5") {
                var myPlayer = document.getElementById('player_' + controllerId);
                $('#player_' + controllerId).after(delaybar_div)
            } else {
                var myPlayer = document.getElementById('player_' + controllerId + "_wrapper");
                $('#player_' + controllerId + "_wrapper").after(delaybar_div)
            }
            var $delay_text;
            if (xmlData.delay_text != '') {
                $delay_text = xmlData.delay_text
            } else {
                $delay_text = ''
            }
            var delaybar_code = '<div id="sincronize">' + '<img id="sincronize-image" src="' + scriptFolder + 'images/sincronize-icon.png">' + '</div>' + '<div id="timeline"></div>' + '<div id="scrub"></div>' + '<div id="text-timeline">' + $delay_text + '</div>';
            delaybar_div.innerHTML = delaybar_code;
            write_log('sincronizando create_delaybar');
            var lastPosition = 270;
            var scrub = {
                    el: document.getElementById('scrub'),
                    current: {
                        x: 0
                    },
                    last: {
                        x: 0
                    }
                },
                timeline = document.getElementById('timeline'),
                mouseDown = false;
            scrub.el.onmousedown = function() {
                mouseDown = true;
                scrub.origin = timeline.offsetLeft;
                scrub.last.x = scrub.el.offsetLeft;
                return false
            };
            document.onmousemove = function(e) {
                if (mouseDown === true) {
                    var scrubStyle = getComputedStyle(scrub.el),
                        scrubOffset = parseInt(scrubStyle.width, 10) / 2,
                        position = parseInt(scrubStyle.left, 10),
                        newPosition = position + (e.clientX - scrub.last.x),
                        timeStyle = getComputedStyle(timeline, 10),
                        timeWidth = parseInt(timeStyle.width, 10);
                    if (e.clientX < timeline.offsetLeft) {
                        newPosition = scrub.origin - (scrubOffset * 2)
                    } else if (e.clientX > timeWidth + timeline.offsetLeft) {
                        newPosition = timeWidth - (scrubOffset)
                    }
                    if (position > newPosition) {
                        delay_position = scrub.last.x;
                        delay_newPosition = newPosition
                    }
                    scrub.el.style.left = newPosition + 'px';
                    scrub.last.x = e.clientX
                }
            };
            document.onmouseup = function() {
                if (lastPosition > delay_newPosition) {
                    $delay = (lastPosition - delay_newPosition) / (250 / 20);
                    lastPosition = delay_newPosition;
                    write_log('delay_position: ' + delay_position + ' - delay_newPosition:' + delay_newPosition + ' - delay: ' + $delay);
                    if (!isNaN($delay)) {
                        if (jwplayer('player_' + controllerId).getState() == 'PLAYING') {
                            $('#sincronize-image').attr('src', scriptFolder + 'images/sincronize-loading.gif');
                            jwplayer('player_' + controllerId).pause();
                            setTimeout(startPlayer, $delay * 1000)
                        }
                    }
                    delay_position = delay_newPosition
                }
                mouseDown = false
            }
        }
    }
})(jQuery);
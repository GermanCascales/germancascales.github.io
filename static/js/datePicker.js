

	var associative_programs = new Array();
	associative_programs[1] = "elshowdexavimartinez";
	associative_programs[2] = "starclub";

	var Calendar = function( args ){

			this.element = null;	//	Calendar container

			this.plugin = null; 	// Calendar plugin

			this.options = null;	//	Plugin options ( only for this.plugin )

			this.url = null;			//  Url to make the request

			this.urlArguments = null; 	// Array with the request arguments

			this.initCall = null;

			this.getMethod = null;

			this.writeMethod = null;

			this.selectionSelector = null;

			this.appendElement = null;

			this.date = null;

			this.loaderContainer = null;

			this.refreshCall = false;

			this.podcasts = {
                "1" : "El show de Xavi Martínez",
                "2" : "StarClub"
			};	


			/*************
				*******arguments******
				opts = http://api.jqueryui.com/datepicker/ 

				objectArgs =	element , //element(HTML) to inner the calendar
								urlArguments , //array of the post request arguments 
								url , //url to request
				***********************
			**************	
			*/

			this.initialize = function(opts,objectArgs) {

				//LLAMADA PARA EL NOMBRE-->ID DE LOS PROGRAMAS DE PODCAST

				this.writeMethod = objectArgs.writeMethod || writePodcast;

				this.getMethod = objectArgs.getMethod || getPodcast;

				this.appendElement = objectArgs.appendElement || ".podcast_container";

				this.loaderContainer = objectArgs.loaderContainer || "#podcast_loading";


				/* Default options */

				var dayNamesSmall = {dayNamesMin: ["Do" ,"Lu" , "Ma" , "Mi" , "Ju" , "Vi" , "Sa" ]};
				var dayNamesLong = {dayNames : [ "Domingo" , "Lunes" , "Martes" , "Miercoles" , "Jueves" , "Viernes" , "Sabado"]};
				var monthNamesSmall = {monthNamesShort: [ "Ene" , "Feb" , "Mar" , "Abr" , "May" , "Jun" , "Jul" , "Ago" , "Sep" , "Oct" , "Nov" , "Dic"] };
				var monthNamesLong = {monthNames: [ "Enero" , "Febrero" , "Marzo" , "Abril" , "Mayo" , "Junio" , "Julio" , "Agosto" , "Septiembre" , "Octubre" , "Noviembre" , "Diciembre"] };
                var prevText = {prevText: "Anterior" };
                var nextText = {nextText: "Siguiente" };

				var defs = { element : ".calendar" , firstDay : 1 , selectOtherMonths: true ,onSelect : $.proxy(this.refreshAttr , this ), dateFormat : "yy-mm-dd" } ;

				/*----------------*/

				$.extend( defs , dayNamesSmall , dayNamesLong , monthNamesSmall , monthNamesLong, prevText, nextText);

				this.element = objectArgs.element || '.calendar';

				this.urlArguments = objectArgs.urlArguments ||  [    {"method" : "podcasts"},
	                                                                 {"section_id" : 1},
	                                                                 {"since_date" : "2013-09-06"},
	                                                                 {"until_date" : "2013-09-06"}
	                                                            ];

				var d = new Date();

				this.initCall = objectArgs.initCall ||  [    {"method" : "podcasts"},
	                                                                 {"section_id" : 1},
	                                                                 {"since_date" : "2014-07-01"},
	                                                                 {"until_date" : "2014-07-01"}
	                                                            ];



				this.url = objectArgs.url;

				this.options = $.extend({},defs,opts);

				this.plugin = $(this.element).datepicker(this.options);

				this.selectionSelector = objectArgs.selectionSelector;

				if(this.selectionSelector)
					$(this.selectionSelector).change($.proxy(this.refreshAttr , this,["selector"]));

				this.getMethod(this.initCall,true);

				/* inicializamos el link al programa */
				$("#podcast_rss_link").attr("href", "http://api.megastar.fm/feeds/podcasts/elshowdexavimartinez/");

			};
			this.updateNavigation = function(){

				var dateConverted = parseDate(this.date);

				if( !dateConverted )
					dateConverted = "";

				var id = $(String(this.selectionSelector)).val();

				history.pushState(null, null, "/podcast/"+associative_programs[id]+"/"+dateConverted);
			}
			this.refresh = function(date){

				if(date){

					this.refreshCall = true;

					date = parseDate(date);

					this.refreshAttr(date);

					this.plugin.datepicker("setDate",date);

				}else{

					this.refreshAttr("selector");

				} 

			}
			this.refreshAttr = function(date){
				var urlSection = null;
				var dateConverted = null;

				/*Cambiamos el URL de rss dependiendo de la sección de los podcasts*/
				if( String(date) === "selector" ){
					if( $(String(this.selectionSelector)).val() == "1" ){
						$("#podcast_rss_link").attr("href","http://api.megastar.fm/feeds/podcasts/elshowdexavimartinez/");
					}
					if( $(String(this.selectionSelector)).val() == "2" ){
						$("#podcast_rss_link").attr("href","http://api.megastar.fm/feeds/podcasts/starclub/");
					}
				}

				for( var i = 0; i < this.urlArguments.length ; i++){

					if(date != "selector"){
						if(this.urlArguments[i].until_date)
							this.urlArguments[i].until_date = date;

						if(this.urlArguments[i].since_date)
							this.urlArguments[i].since_date = date;

						this.date = date;
					}
					if(this.urlArguments[i].section_id){
						if(this.selectionSelector){
							this.urlArguments[i].section_id = $(String(this.selectionSelector)).val();
							urlSection = this.urlArguments[i].section_id;
						}
					}

				}

				showLoader();

				this.getMethod(this.urlArguments,false);

				dateConverted  = parseDate(this.date);

				if(this.date == "NaN-NaN-NaN" || this.date == "undefined" || this.date == null){
					var dateTypeVar = this.plugin.datepicker( "getDate" );

					dateConverted = $.datepicker.formatDate('yy-mm-dd', dateTypeVar);
				}

				history.pushState(null, null, "/podcast/"+associative_programs[urlSection]+"/"+dateConverted);

			};

			var getPodcast = function(urlArguments,selectMaxDate){
				
				/* Refresh date */
				

				var urlGet = this.url;

				if( urlGet.substr(urlGet.length - 1 ) != "\/"){
					urlGet += "\/";
				}
				urlGet += "?";

				var key = null,
					value = null;
				for(var i = 0 ; i < urlArguments.length ; i++){

					key = Object.keys(urlArguments[ i ]);	
					value = urlArguments[ i ];
					value = value[key]; 

					urlGet += key + "=" + value;
					if( (i + 1) < urlArguments.length ){
						urlGet += "&";
					}

				}
				$.ajax({
				        type: "GET",
				        url: urlGet,
				        cache: false,
				        dataType:'json',
				        success: $.proxy(function(data){
					            this.writeMethod(data,selectMaxDate);
	       		 		},this)
	    		});

			};
			var writePodcast = function(data,selectMaxDate){
				
				var HTML = "";
				if( data ) {

					this.date = data.date;

					var currentDate = parseDate(data.date);

					//for(var i = 0; i < data.length ; i++){
					if(data.parts.length > 0){
						var parte = "";
						HTML += '</br> <div class="titlePod">'+ this.podcasts[ data.id_section ] + ': <nobr>' + currentDate + '</nobr> </div>';
								if( data.parts.length > 1){
									for( var j = 0 ; j < data.parts.length ; j++){
										if( j == 0){
											parte =  "Parte 1 (7 - 8h)";
										}else if ( j == 1){
												parte =  "Parte 2 (8 - 9h)";
											}else{
												if( j == 2){
													parte =  "Parte 3 (9 - 10h)";
												}
											}
										HTML +=	'<div class="partsPod">' + parte + ' </div> '+
													'<div class="native_player_container">'+
														'<audio preload="metadata" class="audio_podcast" controls>'+
	  														'<source src="' + data.parts[j].url + '" type="audio/mpeg">'+
															'Su navegador no soporta este elemento'+
														'</audio>'+
														'<a class="native_player_download" href="' + data.parts[j].url + '" title="Descargar"></a>'+
													'</div>';
									}
								}else{
									HTML +=	
									'<div class="native_player_container">'+
                                        '<audio preload="metadata" class="audio_podcast" controls>'+
	  										'<source src="' + data.parts[0].url + '" type="audio/mpeg">'+
											'Su navegador no soporta este elemento'+
										'</audio>'+
                                        '<a class="native_player_download" href="' + data.parts[0].url + '" title="Descargar"></a>'+
                                    '</div>';
								}
					}else{
						HTML += "<p style='margin-top: 10px;text-align: center;'>No hay podcasts para la fecha seleccionada.</p>";
					}

					

					if(selectMaxDate){

						if( !this.refreshCall ){
							this.plugin.datepicker("setDate",data.date);
						}

						this.plugin.datepicker("option" , "maxDate" , data.date);
					}
					for( var i = 0; i < this.urlArguments.length ; i++){

							if(this.urlArguments[i].until_date)
								this.urlArguments[i].until_date = data.date;

							if(this.urlArguments[i].since_date)
								this.urlArguments[i].since_date = data.date;

					}
				}else{
					HTML += "<p style='margin-top: 10px;text-align: center;'>No hay podcasts para la fecha seleccionada.</p>";
				}



				$(this.appendElement).html(HTML);

				$("audio").on("play" , function(){pause();});


				setTimeout(function(){hideLoader();},500);
			};


			/*Execution cycle*/
			
			this.initialize(args.opts,args.objectArgs);

			/*this.*/

			
	};
	function parseDate(date){

		if( date ){
			var elements = date.split("-");

			var dateDMY = elements[2] + "-" + elements[1] + "-" + elements[0];

			return dateDMY;
		}

	};
	var showLoader = function(){


		$(".podcast_container").addClass("hidden_v");
		$("#podcast_loading").removeClass("hidden");

	};
	var hideLoader = function(){

		$("#podcast_loading").addClass("hidden");
		$(".podcast_container").removeClass("hidden_v");

	};
console.log("homejs...");

var map;
var curCoord;
var geocoder;
var directionsService;
var curMarker;
var curCircle;
var startMarker;
var startCircle;
var endMarker;
var endCircle;

var directionsRenderer;
var directionMarkers;

var myScroll;

var contentWidth;
var contentHeight;


$(document).ready(function() {
	initAjaxLoading();
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	contentWidth = $("#contentHome").outerWidth();
	contentHeight = $(window).height();
	$("#contentHome").height(contentHeight+"px");

	var searchInputWidth = contentWidth - 30 - 30 - 12;
	$(".searchInput").width(searchInputWidth + "px");
	var divStartEndLocHeight = $("#divStartEndLoc").outerHeight();
	var divRoomListWrapHeight = $("#wrapper").outerHeight();
	var divMapWrapHeight = contentHeight - divStartEndLocHeight - divRoomListWrapHeight;
	$("#divMapWrap").height(divMapWrapHeight+"px");

	init();
	
	initStartTime();

	$("#btnSettings").click(function(event) {
//		event.stopPropagation();
		changeHref("../setting/settings.html");
		return false;
	});

	$("#btnCurrentLoc").click(function(event) {
		event.stopPropagation();
    	map.moveTo(curCoord);
    	setStartSession(
    			curCoord.getX(),
    			curCoord.getY(),
    			null,
    			"내위치: ",
    			function () {
		    		checkStartLocation();
		    	});
    	return false;
    });

	 $("#btnFavoriteLoc").click(function(){
		favoriteList();
		backgroundBlack();
		return false;
	 });
	 $("#favorite_Header").click(function(){
		 $("#divFavoriteLoc_popup").popup("close");
		 return false;
	 });


	$("#divStartEndLoc input[type=text]").bind("keypress", function(e) {
		if (e.keyCode == 13) {
			searchLocation(this);
		}
	});
    $("#startInput").on("input", function(e) {
		if ( $("#startInput").val() == "" ) {
			$("#aStartSearchClear").css("visibility", "hidden");
		} else {
			$("#aStartSearchClear").css("visibility", "visible");
		}
	});
    $("#endInput").on("input", function(e) {
		if ( $("#endInput").val() == "" ) {
			$("#aEndSearchClear").css("visibility", "hidden");
		} else {
			$("#aEndSearchClear").css("visibility", "visible");
		}
	});
    $("#startInput").click(function(event) {
		event.stopPropagation();
		this.select();
		return false;
	});
    $("#endInput").click(function(event) {
		event.stopPropagation();
		this.select();
		return false;
	});
	$("#aStartSearchClear").click(function(event) {
		event.stopPropagation();
		$("#startInput").val("");
		$("#aStartSearchClear").css("visibility", "hidden");
		return false;
	});
	$("#aEndSearchClear").click(function(event) {
		event.stopPropagation();
		$("#endInput").val("");
		$("#aEndSearchClear").css("visibility", "hidden");
		return false;
	});
	
	$("#btnAddViewRoom").click(function(event) {
		event.stopPropagation();
		clickAddViewRoom();
		
		return false;
	});
//	$(".btnAddRoomUI").on("touchend", function(event) {
	$("#divAddRoom").on("click", function(event) {		
		event.stopPropagation();
		console.log( $(this).text() );
		push.initialise("addRoom");
//		addRoom('111111111111111111111111111'); //////////////////////////////////////////// Web용 임시
//		app.initialise();	//어플배포시 주석 풀것!!!
//		push();
		
		$("#divAddRoomCondition_popup").popup("close");
		
		return false;
    });


    var divWrapperHeight = $("#wrapper").outerHeight();
    var moveHeight = contentHeight - divWrapperHeight;
    var transitionDuration = 300;
    $("#wrapper").on("swipeup", function() {
    	$("#wrapper").height(contentHeight - 1);
    	$("#scroller li").height(contentHeight - 1);

    	$("#wrapper").transition({y: -moveHeight}, transitionDuration);
    	$(".divRoomDetailInfo").transition({ opacity: 1}, transitionDuration );
    	$(".divRoomMbrThumbs").transition({ opacity: 0}, transitionDuration/2 );
    	$(".headerVar").attr("src", "../images/common/downheadervar.png");
    	setTimeout(function() {
    		$(".divRoomMbrThumbs").css("display", "none");
    		$(".divRoomDistanceAndFare").css("display", "");
    		$(".divRoomDistanceAndFare").transition({ opacity: 1 }, transitionDuration/2 );
    		$(".divRoomDetailInfo").css("visibility", "visible");
    	}, transitionDuration/2 );

    });

    $("#wrapper").on("swipedown", function() {
    	$("#wrapper").transition({y: 0}, transitionDuration);
    	$(".divRoomDetailInfo").transition({ opacity: 0}, transitionDuration );

		$(".divRoomDistanceAndFare").transition({ opacity: 0 }, transitionDuration/2 );
		$(".headerVar").attr("src", "../images/common/defaultvar.png");
		setTimeout(function() {
    		$(".divRoomDistanceAndFare").css("display", "none");
    		$(".divRoomMbrThumbs").css("display", "");
    		$(".divRoomMbrThumbs").transition({ opacity: 1 }, transitionDuration/2 );
    	}, transitionDuration/2 );

    	setTimeout(function() {
    		$("#wrapper").height(divWrapperHeight -1);
        	$("#scroller li").height(divWrapperHeight -1);
    	}, transitionDuration);
    });


    $("#inputTime").parent().css("padding", "0");
    $("#inputTime").css("display","none");
    $("#outText").removeAttr("class");
    $("#outText > div").removeAttr("class");
    $("#divToday").parent().css("padding","0");
    $("#divToday").parent().removeAttr("class");
    $(".divLeftSection").parent().css("padding","0");
    $(".divLeftSection").parent().removeAttr("class");
    $(".divLeftSection").parent().addClass("liBtnArea ui-btn-up-d");
    $("#favoriteUl").css("width",  (contentWidth - 50) + "px");
    
    $("#divTomorrow").click(function() {
    	$('#divToday').css('background','whitesmoke');
    	$('#divTomorrow').css('background','white');
    	$('#inputTime').attr("data-val","tomorrow");
    });
    $("#divToday").click(function() {
    	$('#divToday').css('background','white');
    	$('#divTomorrow').css('background','whitesmoke');
    	$('#inputTime').attr("data-val","today");
    });

    $("<div>")
	    .attr("id", "blackImage")
	    .css("width",(contentWidth + 2) + "px")
	    .css("height",contentHeight + "px")
	    .css("background","black")
	    .css("z-index","1099")
	    .css("left","-1px")
	    .css("top","0")
	    .css("position","absolute")
	    .css("opacity","0.5")
	    .css("visibility","hidden")
	    .appendTo($("#contentHome"));
    
    $("#divAddRoomCondition_popup").on( "popupafterclose", function( event, ui ) {
    	$("#blackImage").css("visibility","hidden");
    } );
    
    $("#divFavoriteLoc_popup").on( "popupafterclose", function( event, ui ) {
    	$("#blackImage").css("visibility","hidden");
    } );

	$("#leftPanel ul li a:link").css("width", ((contentWidth / 2) -10) + "px");
	$("#leftPanel ul li a:visited").css("width", ((contentWidth / 2) - 10) + "px");
	$(".ui-panel").css("width", (contentWidth / 2) + "px");


	$("#btnShowMenu").click(function() {
		$("#leftPanel").panel("open");
		backgroundBlack();
		return false;
	});

	$( "#leftPanel" ).on( "panelbeforeclose", function() {
		$("#blackImage").css("visibility","hidden");
	} );

	$("#blackImage").on({
		touchend:function(){
//		click:function(){
	    	$("#leftPanel").panel("close");
	    	$("#blackImage").css("visibility","hidden");
		},
		swipeleft: function() {
			$("#leftPanel").panel("close");
	    	$("#blackImage").css("visibility","hidden");
		}
	});
	
}); //ready()

/**
 * deviceready 이벤트
 */
var onDeviceReady = function() {
	console.log("onDeviceReady()");
	
	push.initialise();
	
	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);	
};

/**
 * 방 만들기 출발시간 초기화
 */
var initStartTime = function() {
	console.log()
	var curr = new Date().getFullYear();
	var opt = {
	}
	opt.date = {
		preset : 'date'
	};
	opt.datetime = {
		preset : 'datetime',
		minDate : new Date(2012, 3, 10, 9, 22),
		maxDate : new Date(2014, 7, 30, 15, 44),
		stepMinute : 5
	};
	opt.time = {
		preset : 'time',
		stepMinute : 10
	};
	opt.select = {
		preset : 'select'
	};

	$('#inputTime').val('').scroller('destroy').scroller(
			$.extend(opt['time'], {
				theme : 'android-ics light',
				mode : 'scroller',
				display : 'inline',
				lang : "",
				showNow: true
			}));
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var ampm = "0";
	minute = minute + 10;
	minute = Math.ceil( minute / 10) * 10;
	if ( minute >=  60 ) {
		hour = hour + 1;
		minute = minute - 60;
	}
	if ( hour >= 12) {
		ampm = "1";	
		hour = hour - 12;
		if ( hour == 12) {
			hour = 0;
			ampm = "0";
			$('#divToday').css('background','whitesmoke');
	    	$('#divTomorrow').css('background','white');
	    	$('#inputTime').attr("data-val","tomorrow");
		}
	}


	
	
	$('#inputTime').mobiscroll("setValue", [hour, minute, ampm]);
};

/**
 * 방목록 iScroll 로딩
 */
function loaded() {
	console.log("loadRoomScroll()");
	myScroll = new iScroll('wrapper', {
		snap: "li",
		momentum: false,
		hScrollbar: false,
		onRefresh: function () {
			console.log("onRefresh...");
		},
		onScrollMove: function () {
		},
		onScrollEnd: function () {
			console.log("onScrollEnd...");
		},
		onTouchEnd: function () {
			console.log("onTouchEnd...");

			var roomLi = $( $("#ulRoomList li").get(myScroll.currPageX) );

			initRoute();

			searchRoute(
					parseFloat( roomLi.data("startX") ),
					parseFloat( roomLi.data("startY") ),
					parseFloat( roomLi.data("endX") ),
					parseFloat( roomLi.data("endY") ),
					"directionsService_callback",
					null );

		}
	});
	

}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', loaded, false);

/**
 * 초기화
 */
var init = function() {
	console.log("init()");
	// 현재위치 조회
	navigator.geolocation.getCurrentPosition(function(position) {
		var curPoint = new olleh.maps.Point( position.coords.longitude, position.coords.latitude );

		var srcproj = new olleh.maps.Projection('WGS84');
		var destproj = new olleh.maps.Projection('UTM_K');
		olleh.maps.Projection.transform(curPoint, srcproj, destproj);
		curCoord = new olleh.maps.Coord(curPoint.getX(), curPoint.getY());

		geocoder = new olleh.maps.Geocoder("KEY");
		directionsService = new olleh.maps.DirectionsService('frKMcOKXS*l9iO5g');

	  	var mapOptions = {
	     	center : curCoord,
	     	mapTypeId : olleh.maps.MapTypeId.BASEMAP,
	     	mapTypeControl: false,
	     	zoom : 10
	  	};
	  	map = new olleh.maps.Map(document.getElementById("canvas_map"), mapOptions);


		var myIcon = new olleh.maps.MarkerImage(
				"../images/common/marker/my_marker_red.png",
				new olleh.maps.Size(10, 10),
				new olleh.maps.Pixel(0,0),
				new olleh.maps.Pixel(5, 5) );
		curMarker = new olleh.maps.Marker({
			position: curCoord,
			map: map,
			icon: myIcon,
			title : '내위치',
			zIndex : 1
	  	});

		checkLocations();

	});
};

/**
 * 출발지/목적지 검사
 */
var checkLocations = function() {
	console.log("checkLocations()");
	checkStartLocation();
};

/**
 * 출발지 검사
 */
var checkStartLocation = function() {
	console.log("checkStartLocation()");
	$.getJSON( rootPath + "/room/getLocationSession.do", function(result) {
		var locationSession = result.data;

		if ( locationSession && locationSession != null &&
				locationSession.startName && locationSession.startName != null && locationSession.startName != "" &&
				locationSession.startX && locationSession.startX != null && locationSession.startX != "" &&
				locationSession.startY && locationSession.startY != null && locationSession.startY != "" ) {
			setStartLocation(locationSession.startX, locationSession.startY, locationSession.startName, locationSession.startPrefix);

			checkEndLocation();

		} else {
			setStartSession(
					curCoord.getX(),
					curCoord.getY(),
					null,
					"내위치: ",
					function () {
			    		checkStartLocation();
			    	} );

		}
	});
};

/**
 * 출발지 설정
 */
var setStartLocation = function (x, y, locName, prefix) {
	console.log("setStartLocation()");

	if ( !prefix || prefix == null ) {
		prefix = "";
	}

	$("#startInput").val(prefix + locName);

	var coord = new olleh.maps.Coord( x, y );
	if (startMarker) {
		startMarker.setMap(null);
	}
	if (startCircle) {
		startCircle.setMap(null);
	}

	var icon = new olleh.maps.MarkerImage(
			"../images/common/marker/MapMarker_Ball__Azure.png",
			new olleh.maps.Size(30, 30),
			new olleh.maps.Pixel(0,0),
			new olleh.maps.Pixel(15, 30)
		);
	startMarker= new olleh.maps.Marker({
			position: coord,
			map: map,
//			shadow: shadow,
			icon: icon,
			title : '출발지',
			zIndex : 1
	  	});
	var loginInfo = getSessionItem("loginInfo");
	startCircle = setCircle( coord, "#00ffff", loginInfo.startRange );
};

/**
 * 목적지 검사
 */
var checkEndLocation = function() {
	console.log("checkEndLocation()");
	$.getJSON( rootPath + "/room/getLocationSession.do", function(result) {
		var locationSession = result.data;
		if ( locationSession && locationSession != null &&
				locationSession.endName && locationSession.endName != null && locationSession.endName != "" &&
				locationSession.endX && locationSession.endX != null && locationSession.endX != "" &&
				locationSession.endY && locationSession.endY != null && locationSession.endY != "" ) {
			setEndLocation(
					locationSession.endX,
					locationSession.endY,
					locationSession.endName,
					locationSession.endPrefix );

			setSessionItem("locationSession", locationSession);
			searchRooms();

		} else {
			$.getJSON( rootPath + "/member/getRecentDestination.do", function(result) {
				if (result.status === "success") {
					var recentDestinationList = result.data;
					if ( recentDestinationList.length > 0 ) {
						setEndSession(
								recentDestinationList[0].fvrtLocLng,
								recentDestinationList[0].fvrtLocLat,
								recentDestinationList[0].fvrtLocName,
								"최근목적지: ",
								function() {
									checkEndLocation();
								} );
					} else {
						$("#btnAddViewRoom").css("visibility","hidden");
						$("<li>")
						.width(contentWidth +"px")
						.append(
								$("<div>")
								.addClass("divMsgArea")
								.css("padding-top","14px")
								.append(
										$("<h1>")
											.html("출발지와 도착지를<br>검색해주세요") ) )
						.appendTo( $("#ulRoomList") );
						myScroll.disable();
					}
				}
			});

		}
	});
};

/**
 * 목적지 설정
 */
var setEndLocation = function (x, y, locName, prefix) {
	console.log("setEndLocation()");

	if ( !prefix || prefix == null ) {
		prefix = "";
	}

	$("#endInput").val(prefix + locName);
	
	if ( !($("#startInput").val()) || !($("#endInput").val()) ) {
		$("#btnAddViewRoom").css("visibility","hidden");
	}

	var coord = new olleh.maps.Coord( x, y );
	if (endMarker) {
		endMarker.setMap(null);
	}
	if (endCircle) {
		endCircle.setMap(null);
	}

	var icon = new olleh.maps.MarkerImage(
			"../images/common/marker/MapMarker_Ball__Chartreuse.png",
			new olleh.maps.Size(30, 30),
			new olleh.maps.Pixel(0,0),
			new olleh.maps.Pixel(15, 30)
		);
	endMarker= new olleh.maps.Marker({
		position: coord,
		map: map,
//		shadow: shadow,
		icon: icon,
		title : '목적지',
		zIndex : 1
  	});
	var loginInfo = getSessionItem("loginInfo");
	endCircle = setCircle( coord, "#00ffff", loginInfo.endRange );
};

/**
 * 지도에 반경 표시
 */
var setCircle = function( coord, color, radius ) {
	console.log("setCircle(coord, color, radius)");
	console.log(coord, color, radius);
	
	var circle = new olleh.maps.Circle({
		center: coord,
		radius: radius,
		map: map,
		fillColor: color,
		fillOpacity: 0.07,
		strokeColor: color,
		strokeOpacity: 0.4,
		strokeWeight: 1
	});

	return circle;
};

/**
 * 위치 검색
 */
var searchLocation = function( target ) {
    console.log("searchLocation()");
    var query = $.trim($(target).val());
    if ( target && query != "" ) {
            if ( query.indexOf("내위치: ") == 0 || query.indexOf("최근목적지: ") == 0 ) {
                    query = query.split(": ")[1];
            }

            var params = null;
            if ( $(target).get(0) == $("#startInput").get(0) ) {
                    params = { "query" : query };
            } else if ( $(target).get(0) == $("#endInput").get(0) ) {
                    params = { "query" : query };
            }

            changeHref("../location/location.html", params);
    }

};

/**
 * 방 목록 조회
 */
var searchRooms = function() {
	console.log("searchRooms()");

	var locationSession = getSessionItem("locationSession");
	var loginInfo = getSessionItem("loginInfo");
	
//	isRoomMbr(
//			function() {
//				$("#btnAddViewRoom > img").attr("src", "../images/common/button/into_room.png");
//				$("#btnAddViewRoom").data("status", "intoMyRoomBtn");
//				$("#divRoomList").data("isRoomMbr", "true");
//			},
//			function() {
//				$("#btnAddViewRoom > img").attr("src", "../images/common/button/add_btn.png");
//				$("#btnAddViewRoom").data("status", "addRoomBtn");
//				$("#divRoomList").data("isRoomMbr", "false");
//			} );
	$.post( rootPath + "/room/searchRooms.do"
			, {
				startLat 	: locationSession.startY,
				startLng 	: locationSession.startX,
				startRange 	: loginInfo.startRange,
				endLat 		: locationSession.endY,
				endLng 		: locationSession.endX,
				endRange 	: loginInfo.endRange
			}, function(result) {
				if (result.status == "success") {
					initRoute();

					var searchRoomList = result.data;

					var roomPathList = null;
					var roomMbrList = null;
					var startInfo = null;
					var endInfo = null;
					var waypoints = [];
					var startTime = null;
					var isMyRoom = "false";
					var loginInfo = getSessionItem("loginInfo");

					var roomList = [];

					for( var i = 0; i < searchRoomList.length; i++ ) {
						roomPathList = searchRoomList[i].roomPathList;
						roomMbrList = searchRoomList[i].roomMbrList;

						startInfo = null;
						endInfo = null;
						waypoints = [];

						startTime = new Date(searchRoomList[i].roomStartTime);
						startTime = startTime.toTimeString().substr(0, 5);

						isMyRoom = "false";
						for ( var j in roomMbrList ) {
							if ( roomMbrList[j].mbrId == loginInfo.mbrId ) {
								isMyRoom = "true";
							}
						}

						for ( var j in roomPathList) {
							if ( roomPathList[j].pathRank == 0 ) {
								startInfo = roomPathList[j];

							} else if ( roomPathList[j].pathRank == 99 ) {
								endInfo = roomPathList[j];

							} else {
								waypoints[waypoints.length] = roomPathList[j];

							}
						}

						roomList[i] = {
							roomNo : searchRoomList[i].roomNo,
							startTime : startTime,
							roomDistance: searchRoomList[i].roomDistance,
							startX : startInfo.pathLng,
							startY : startInfo.pathLat,
							endX : endInfo.pathLng,
							endY: endInfo.pathLat,
							roomMbrCount : searchRoomList[i].roomMbrCount,
							isMyRoom : isMyRoom,
							waypoints : waypoints,
							roomMbrList : roomMbrList,
							roomPathList : roomPathList
						};

					}

					isRoomMbr( function() { // isRoomMbrTrue
						$("#btnAddViewRoom > img").attr("src", "../images/common/button/into_room.png");
						$("#btnAddViewRoom").data("status", "intoMyRoomBtn");
						$("#divRoomList").data("isRoomMbr", "true");
						
						createRoomList( roomList, true );
						
				    },
				    function() { // isRoomMbrFalse
				    	$("#btnAddViewRoom > img").attr("src", "../images/common/button/add_btn.png");
						$("#btnAddViewRoom").data("status", "addRoomBtn");
						$("#divRoomList").data("isRoomMbr", "false");
						
				    	createRoomList( roomList, false );
				    	
				    } );
					

				} else {
					console.log("fail");

				}
			}, "json");
};

/**
 * 방목록 그리기
 */
var createRoomList = function( roomList, isRoomMbr ) {
	console.log("createRoomList( roomList, isRoomMbr )");
//	console.log( roomList, isRoomMbr );

	if ( !myScroll ) {
		loaded();
	}

	$("#ulRoomList").children().remove();
	$("#scroller").css("width", 0+"px");

	if (roomList && roomList.length > 0) {
		var roomMbrList = null;
		var divRoomMbrThumb = null;

		for ( var i in roomList ) {
			roomMbrList =  roomList[i].roomMbrList;

			divRoomMbrThumb = $("<div>")
									.addClass("divRoomMbrThumbs");
			for ( var j in roomMbrList ) {
				divRoomMbrThumb.append(
									$("<img>")
										.attr("src", roomMbrList[j].mbrPhotoUrl ) );
			}

			$("<li>")
				.width(contentWidth +"px")
				.data("roomIdx", i)
				.data("roomNo", roomList[i].roomNo)
				.data("startX", roomList[i].startX)
				.data("startY", roomList[i].startY)
				.data("endX", roomList[i].endX)
				.data("endY", roomList[i].endY)
				.data("roomMbrCount", roomList[i].roomMbrCount)
				.data("isMyRoom", roomList[i].isMyRoom)
				.append(
						$("<div>")
							.addClass("divHeaderLine")
							.attr("data-flag", "close")
							.append(
									$("<a>")
										.attr("href", "#")
										.append(
												$("<img>")
													.attr("src", "../images/common/defaultvar.png")
													.addClass("headerVar"))) )
				.append(
						$("<div>")
						.addClass("divRoomInfoArea")
						.append(
								$("<h2>")
									.text( roomList[i].startTime ) )
						.append(
								$("<span>")
									.addClass("spanStartLabel")
									.text("출발") )
						.append( divRoomMbrThumb )
						.append(
								$("<div>")
									.addClass("divRoomDistanceAndFare")
									.append(
											$("<h4>")
												.addClass("distance")
												.text("") )
									.append(
											$("<h4>")
												.addClass("fare")
												.text("") ) )
						.append(
								$("<div>")
									.addClass("divRoomDetailInfo")
									.append(
											$("<div>")
												.addClass("divRoomPathInfo")
												.append(
														$("<img>")
															.addClass("imgDownArrow")
															.attr("src", "../images/common/startToEnd.png") )
												.append(
														$("<h4>")
															.addClass("startLocName")
															.text(roomList[i].roomPathList[0].pathName) )
												.append(
														$("<h4>")
															.addClass("endLocName")
															.text(roomList[i].roomPathList[1].pathName) ) )
									.append(
											$("<div>")
												.addClass("divCanvas")
												.append(
														$("<canvas>")
															.addClass("canvas")
															.attr("id", "myCanvas_" + i) ) ) ) )
				.append(
						$("<div>")
							.addClass("divBtnArea")
							.width(contentWidth +"px")
							.append(
									$("<a>")
										.addClass("btnJoinRoom")
										.append(
												$("<span>")
													.text("같이타자") )
//										.on("touchend", function(event) {
										.on("click", function(event) {
											event.stopPropagation();
											
											var roomNo = $(this).parents("li").data("roomNo");
											push.initialise("joinRoom", roomNo);
//											joinRoom('111111111111111111111111111', roomNo); //////////////////////////////////////////// Web용 임시
//											app.initialize(roomNo);	//어플배포시 주석 풀것!!!
											
											return false;
										}) ) )
				.appendTo( $("#ulRoomList") );

			$("#scroller").css("width", parseInt($("#scroller").css("width")) + contentWidth + "px");

			showRelationInfo(roomList[i], i);

		}

		$(".startLocName").width( ($(".divRoomPathInfo").outerWidth() - 70 ) + "px");
		$(".endLocName").width( ($(".divRoomPathInfo").outerWidth() - 70 ) + "px");

		$(".divRoomDetailInfo").css("visibility", "hidden");
		$(".divRoomMbrThumbs").css("display", "");
		$(".divRoomDistanceAndFare").css("display", "none");

		var roomLi = $( $("#ulRoomList li").get(0) );

		initRoute();

		searchRoute(
				parseFloat( roomLi.data("startX") ),
				parseFloat( roomLi.data("startY") ),
				parseFloat( roomLi.data("endX") ),
				parseFloat( roomLi.data("endY") ),
 				"directionsService_callback",
				null );
		
		$("#btnAddViewRoom").css("visibility","visible");
		
	} else {
		var btnText = "방 만들기";
		if ( isRoomMbr ) {
			btnText  = "내방가기";
		}

		$("<li>")
			.width(contentWidth +"px")
			.append(
					$("<div>")
						.addClass("divHeaderLine")
						.attr("data-flag", "close")
						.append(
								$("<a>")
									.attr("href", "#")
									.append(
											$("<img>")
												.attr("src", "../images/common/defaultvar.png")
												.addClass("headerVar") ) ) )
			.append(
					$("<div>")
					.addClass("divMsgArea")
					.append(
							$("<h2>")
								.text( "검색된 결과가 없습니다" ) ) )
			.append(
					$("<div>")
						.addClass("divBtnArea")
						.width(contentWidth +"px")
						.append(
								$("<a>")
									.addClass("btnJoinRoom")
									.append(
											$("<span>")
												.text(btnText) ) )
//						.on("touchend", function(event) {
						.click(function(event) {
							event.stopPropagation();
							clickAddViewRoom();
							
							return false;
						}) )
			.appendTo( $("#ulRoomList") );

		$("#scroller").css("width", parseInt($("#scroller").css("width")) + contentWidth + "px");

		$("#btnAddViewRoom").css("visibility","hidden");
		
	}

	if ( roomList && roomList.length > 1 ) {
		myScroll.refresh();
		myScroll.enable();

	} else {
		myScroll.disable();

	}

};

/**
 * 경로 초기화
 */
var initRoute = function() {
	if (directionsRenderer) {
		directionsRenderer.setMap(null);
	}

	if (directionMarkers) {
		for( var i in directionMarkers ) {
			directionMarkers[i].setMap(null);
		}
	}
};

/**
 * 방 만들기
 */
var addRoom = function(regId) {
	console.log("addRoom()");
	console.log($("#inputTime").mobiscroll('getValue'));
	var locationSession = getSessionItem("locationSession");
    var startTime = new Date();
    var inputTime = $("#inputTime").mobiscroll('getValue');
    // AM,PM 일 때
    if (inputTime[2] == '1') {
    	startTime.setHours(inputTime[0] + 12);
    } else {
    	startTime.setHours(inputTime[0]);
    }
    startTime.setMinutes(inputTime[1]);
    
    if ( $('#inputTime').attr("data-val") == 'tomorrow' ) {
    	startTime.setDate(startTime.getDate() + 1);
    }
//	distance, fare는 추후 수정필요
    var distance = 0;
    var fare = 0;
    console.log(startTime);
    if ( startTime && startTime != null && startTime != "" &&
    		locationSession && locationSession != null &&
    		locationSession.startName && locationSession.startName != null && locationSession.startName != "" &&
    		locationSession.startX && locationSession.startX != null && locationSession.startX != "" &&
    		locationSession.startY && locationSession.startY != null && locationSession.startY != "" &&
    		locationSession.endName && locationSession.endName != null && locationSession.endName != "" &&
    		locationSession.endX && locationSession.endX != null && locationSession.endX != "" &&
    		locationSession.endY && locationSession.endY != null && locationSession.endY != ""
    		) {
    	$.post( rootPath + "/room/addRoom.do",  {
    		gcmRegId : regId,
    	    roomStartTime : startTime,
    	    roomDistance : distance,
            roomFare : fare,
            startLocName : locationSession.startName,
            startLocLng : locationSession.startX,
            startLocLat : locationSession.startY,
    	    startLocRank : 0,
            endLocName : locationSession.endName,
            endLocLng : locationSession.endX,
            endLocLat : locationSession.endY,
            endLocRank : 99
        },
        function(result) {
            if (result.status == "success") {
            	changeHref("../room/room.html", { roomNo : result.data});

            } else {
            	console.log(result.data);

            }
        },
        "json");
    }
};

/**
 * 경로 찾기
 */
var searchRoute = function ( startX, startY, endX, endY, callbackFunc, waypoints ) {
	console.log("searchRoute(startX, startY, endX, endY, callbackFunc, waypoints)");
	console.log(startX, startY, endX, endY, callbackFunc, waypoints);
	
	var DirectionsRequest = {
		origin 		: new olleh.maps.Coord( startX, startY ),
		destination : new olleh.maps.Coord( endX, endY ),
		waypoints 	: waypoints,
		projection 	: olleh.maps.DirectionsProjection.UTM_K,
		travelMode	: olleh.maps.DirectionsTravelMode.DRIVING,
		priority  		: olleh.maps.DirectionsDrivePriority.PRIORITY_3	//1.최단 거리 우선(PRIORITY = 0),2.고속도로 우선(PRIORITY = 1),3.무료 도로 우선(PRIORITY = 2),4.최적 경로(PRIORITY = 3)
	};
	directionsService.route(DirectionsRequest, callbackFunc);

};
var directionsService_callback = function (data) {
	console.log("directionsService_callback()");
	console.log(data);
	
	var DirectionsResult  = directionsService.parseRoute(data);
	
	var distance = DirectionsResult.result.total_distance.value;
	var h4Distance = $($("#ulRoomList div.divRoomDistanceAndFare > h4.distance").get(myScroll.currPageX));
	var h4Fare = $($("#ulRoomList div.divRoomDistanceAndFare > h4.fare").get(myScroll.currPageX));
	h4Distance.text( changeDistanceUnit(distance) );
	h4Fare.text( calcTaxiFare(distance) );

	directionMarkers = [];
	var routes = DirectionsResult.result.routes;
	for( var i in routes) {
		if ( routes[i].type == "999" ) {
			directionMarkers[directionMarkers.length] = setWaypointMarker(
					new olleh.maps.Coord( routes[i].point.x, routes[i].point.y ),
					"../images/common/marker/MapMarker_Marker_Outside_Azure.png" );
		}

		if ( routes[i].type == "1000" ) {
			directionMarkers[directionMarkers.length] = setWaypointMarker(
					new olleh.maps.Coord( routes[i].point.x, routes[i].point.y ),
					"../images/common/marker/MapMarker_Marker_Outside_Pink.png" );
		}

		if ( routes[i].type == "1001" ) {
			directionMarkers[directionMarkers.length] = setWaypointMarker(
					new olleh.maps.Coord( routes[i].point.x, routes[i].point.y ),
					"../images/common/marker/MapMarker_Marker_Outside_Chartreuse.png" );
		}
	}

	var DirectionsRendererOptions = {
		directions : DirectionsResult,
		map : map,
		keepView : true,
		offMarkers : true,
		offPolylines : false
	};

	directionsRenderer = new olleh.maps.DirectionsRenderer(DirectionsRendererOptions);
	directionsRenderer.setMap(map);
};

/**
 * 경로 마커 표시
 */
var setWaypointMarker = function( coord, imageUrl ) {
	console.log("setWaypointMarker(coord, imageUrl)");
//	console.log(coord, imageUrl);
	
	var icon = new olleh.maps.MarkerImage(
		imageUrl,
		new olleh.maps.Size(30, 30),
		new olleh.maps.Pixel(0,0),
		new olleh.maps.Pixel(15, 30)
	);
	var marker = new olleh.maps.Marker({
		position: coord,
		map: map,
//		shadow: shadow,
		icon: icon,
		title : '내위치',
		zIndex : 1
  	});

	return marker;
};


/**
 * 방 만들기 & 내방가기 버튼 클릭
 */
var clickAddViewRoom = function() {
	if ($("#btnAddViewRoom").data("status") == "intoMyRoomBtn") {
		goMyroom();

	} else {
		showAddRoomTimePicker();
		
	}	
};

/**
 * 내방가기
 */
var goMyroom = function() {
	console.log("goMyroom()");
	
	$.getJSON( rootPath + "/room/getMyRoom.do", function(result) {
//		console.log(result);
		if (result.status === "success") {
			var room = result.data;
			if ( room && room != null &&
					room.roomNo && room.roomNo != null && room.roomNo != 0) {
				changeHref("../room/room.html", { roomNo : room.roomNo });
			}
		}
	});
};

/**
 * 방 만들기 출발시간 설정 팝업 보이기
 */
var showAddRoomTimePicker = function() {
	console.log("showAddRoomTimePicker()");
	
	isRoomMbr( function() { // isRoomMbrTrue
    	Toast.shortshow("이미 방에 참여 중입니다.");
    },
    function() { // isRoomMbrFalse
    	var dateTime = new Date();
    	dateTime.setMinutes( dateTime.getMinutes() + 10 );
//    	$("#setTimeBox").datebox("setTheDate", dateTime);
		$("#divAddRoomCondition_popup").popup("open", { transition  : "pop" });
		backgroundBlack();
		$("#setTimeBox").parent().css("display","none");
    } );
};

/**
 * 방 참여하기
 */
var joinRoom = function(regId, roomNo) {
	console.log("joinRoom(regId, roomNo)");
//	console.log(regId, roomNo);

    isRoomMbr(
    		function() { //isRoomMbrTrue
    			Toast.shortshow("이미 방에 참여 중입니다.");
		    },
		    function() { //isRoomMbrFalse

		    	var locationSession = getSessionItem("locationSession");
		    	console.log(rootPath);
		    	$.post( rootPath + "/room/joinRoom.do",
		    			{
			    		roomNo : roomNo,
						endLocName : locationSession.endName,
						endLocLat : locationSession.endY,
						endLocLng : locationSession.endX,
						gcmRegId : regId
						},
						function(result) {
							if (result.status =="success") {
								changeHref("../room/room.html", { roomNo : roomNo});

							} else {
								console.log(result.data);

							}
						}, "json");
		    });
};

/**
 * 즐겨찾기 목록
 */
var favoriteList = function() {
    console.log("favoriteList()");

    $.getJSON( rootPath + "/member/getFavoritePlaces.do", function(result) {
        if(result.status == "success") {
            var fvrtLoc = result.data;
            var ul = $("#favoriteUl");

            $("#favoriteUl #favoriteList").remove();
            for (var i in fvrtLoc) {
                $("<li>")
                    .attr("id", "favoriteList")
                    .attr("data-theme","f")
                    .attr("data-icon", "false")
                    .data("endX", fvrtLoc[i].fvrtLocLng)
                    .data("endY", fvrtLoc[i].fvrtLocLat)
                    .data("locName", fvrtLoc[i].fvrtLocName)
//                    .on("touchend", function(event) {
                    .click( function(event){
                     	setEndSession(
                     			$(this).data("endX"),
                     			$(this).data("endY"),
                     			$(this).data("locName"),
                    			"",
                    			function () {
                		    		checkEndLocation();
                		    		map.moveTo( new olleh.maps.Coord($(this).data("endX"), $(this).data("endY")) );
                                    $("#divFavoriteLoc_popup").popup("close");
                		    	});
                     	return false;
                    })
                    .append(
                    		$("<a>")
                            	.attr("id", "favoriteLink")
                                .attr("href","#")
                                .text( fvrtLoc[i].fvrtLocName)
                                .append(
                                		$("<img>")
                                			.addClass("ui-li-icon ui-corner-none")
	                                        .attr("src", "../images/common/star-th.png")
                                )
                    )
                    .appendTo(ul);
                $("#favoriteUl").listview("refresh");
            }

            $("#divFavoriteLoc_popup").popup("open", {
    			transition : "pop"
    		});
        } else {
	        // 즐겨찾기 없을경우 + 버튼 추가

        }
    });
};

/**
 * 관계도 그리기
 */
var showRelationInfo = function(roomInfo, idx) {
	console.log("showRelationInfo(roomInfo, idx)");
//	console.log(roomInfo, idx);

	var canvas = document.getElementById("myCanvas_" + idx);

	if ( contentWidth < 340 || contentHeight < 580 ) {
		drawRelationCanvas(roomInfo, canvas, 1);

	} else {
		drawRelationCanvas(roomInfo, canvas, 2);

	}

};

/**
 * 뒤로가기 버튼 처리
 */
var FINSH_INTERVAL_TIME = 2000;
var backPressedTime = 0;

var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");
	
	var tempTime = new Date().getTime();
	var intervalTime = tempTime - backPressedTime;
	if ( $("#blackImage").css("visibility") == "hidden") {
		if ( 0 <= intervalTime && FINSH_INTERVAL_TIME >= intervalTime ) {
			navigator.app.exitApp();
		} else {
			backPressedTime = tempTime;
			Toast.shortshow("'뒤로'버튼을 한번 더 누르시면 종료됩니다.");
		}
	} else {
		$("#leftPanel").panel("close");
		$("#divFavoriteLoc_popup").popup("close");
		$("#divAddRoomCondition_popup").popup("close");
	}
};

/**
 * background black 처리
 */
var backgroundBlack = function() {
	$("#blackImage").css("visibility","visible");
};

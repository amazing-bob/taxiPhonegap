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

var roomList = [];


$(document).ready(function() {
	initAjaxLoading();
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	document.addEventListener("menubutton", slideMenuPanel, false);

	contentWidth = $("body > .ui-page").outerWidth();
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
		changeHref("../settings/settings.html");
		return false;
	});

	$("#btnCurrentLoc").click(function(event) {
		event.stopPropagation();
    	map.moveTo(curCoord);
    	setStartLocationSession(
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
		showhideBlackBackground("show");
		return false;
	 });
	 $("#favorite_Header").click(function(){
		 $("#divFavoriteLoc_popup").popup("close");
		 return false;
	 });

/**
 *    설   명 : 출발지 최근 이용지 실시간 검색
 *    작성자 : 장종혁
 */
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
			
			var value = {
					text : $("#startInput").val(),
					type : 'S'
			};
			
			selectRcntLoc(value, function(rcntList) {
		
			var startRcntList = new Array();
				
				console.log(rcntList[i]);
				for ( var i = 0; i < rcntList.length; i++ ) {
					startRcntList[i] = rcntList[i].rcntLocName;
				}
			
				$( "#startInput" ).autocomplete({
				      source: startRcntList,
				      select: function( event, ui ) {
				    	  
				    	  for ( var i = 0; i < rcntList.length; i++ ) {
								
					    		  if(rcntList[i].rcntLocName == ui.item.value){
					    			  
					    			  setStartLocationSession(
					    					  	rcntList[i].rcntLocLng,
				                     			rcntList[i].rcntLocLat,
				                     			rcntList[i].rcntLocName,
				                    			"",
				                    			function () {
				                		    		checkEndLocation();
				                		    		map.moveTo( new olleh.maps.Coord(rcntList[i].rcntLocLng, rcntList[i].rcntLocLat) );
				                		    	});
					    			  
					    		  }
							}
				    	  
				      }
				    });
				
				
			
			});
			
		}
	});
    
    /**
     *    설   명 : 목적지 최근 이용지 실시간 검색
     *    작성자 : 장종혁
     */
    $("#endInput").on("input", function(e) {
		if ( $("#endInput").val() == "" ) {
			$("#aEndSearchClear").css("visibility", "hidden");
		} else {
			$("#aEndSearchClear").css("visibility", "visible");

			var value = {
					text : $("#endInput").val(),
					type : 'E'
			};
			selectRcntLoc(value, function(rcntList) {
		
			var endRcntList = new Array();
			
				for ( var i = 0; i < rcntList.length; i++ ) {
					
					endRcntList[i] = rcntList[i].rcntLocName;

				}
			
				$( "#endInput" ).autocomplete({
				      source: endRcntList,
				      select: function( event, ui ) {
				    	  
				    	  for ( var i = 0; i < rcntList.length; i++ ) {
								
					    		  if(rcntList[i].rcntLocName == ui.item.value){
					    			  
					    			  setEndLocationSession(
					    					  	rcntList[i].rcntLocLng,
				                     			rcntList[i].rcntLocLat,
				                     			rcntList[i].rcntLocName,
				                    			"",
				                    			function () {
				                		    		checkEndLocation();
				                		    		map.moveTo( new olleh.maps.Coord(rcntList[i].rcntLocLng, rcntList[i].rcntLocLat) );
				                		    	});
					    			  
					    		  }
							}
				    	  
				      }
				    });
			
			});
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
		
		push.initialise("addRoom");
//		addRoom('111111111111111111111111111'); //////////////////////////////////////////// Web용 임시
		
		$("#divAddRoomCondition_popup").popup("close");
		
		return false;
    });
	
	$("#btnComment").click(function(event) {
//		event.stopPropagation();
		changeHref("../comment/comment.html");
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
    
    /**
     * 설  명 : 방 생성 시 인원제한 관련
     * 작성자 : 이용준
     */
    $("#divMemTwo").click(function() {
    	$('#divMemTwo').css('background','white');
    	$('#divMemThree').css('background','whitesmoke');
    	$('#divMemFour').css('background','whitesmoke');
    	$('#roomMbrNumLimit').attr("data-val","2");
    });
    
    $("#divMemThree").click(function() {
    	$('#divMemTwo').css('background','whitesmoke');
    	$('#divMemThree').css('background','white');
    	$('#divMemFour').css('background','whitesmoke');
    	$('#roomMbrNumLimit').attr("data-val","3");
    });
    
    $("#divMemFour").click(function() {
    	$('#divMemTwo').css('background','whitesmoke');
    	$('#divMemThree').css('background','whitesmoke');
    	$('#divMemFour').css('background','white');
    	$('#roomMbrNumLimit').attr("data-val","4");
    });
    
    
    $("#divAddRoomCondition_popup").on( "popupafterclose", function( event, ui ) {
    	showhideBlackBackground("hide");
    } );
    
    $("#divFavoriteLoc_popup").on( "popupafterclose", function( event, ui ) {
    	showhideBlackBackground("hide");
    } );
	$("#leftPanel ul li a:link").css("width", ((contentWidth / 2) -10) + "px");
	$("#leftPanel ul li a:visited").css("width", ((contentWidth / 2) - 10) + "px");
	$(".ui-panel").css("width", (contentWidth / 2) + "px");

	$("#btnShowMenu").click(function() {
		$("#leftPanel").panel("open");
		showhideBlackBackground("show");
		return false;
	});
	
	$( "#leftPanel" ).on( "panelbeforeclose", function() {
		showhideBlackBackground("hide");
	} );
	
		
	// 참여하기 팝업 관련
	$("#joinRoom_popup a.aCancelBtn").on("click", function(event) {
		event.stopPropagation();
		$("#joinRoom_popup").popup("close", {
			transition : "pop"
		});

		return false;
	});
	$("#joinRoom_popup a.aOkBtn").on("click", function(event){
		event.stopPropagation();
		var outRoomNo = $("#joinRoom_popup").data("outRoomNo");
		var joinRoomNo = $("#joinRoom_popup").data("joinRoomNo");
		
		outRoomToJoinRoom(myInfo.mbrNo, outRoomNo, joinRoomNo);

		return false;
	});
	$("#joinRoom_popup").on("popupafterclose", function(event, ui) {
		$(this).data("isOpen", false);
		showhideBlackBackground("hide");
	});
	$("#joinRoom_popup").on("popupafteropen", function(event, ui) {
		$(this).data("isOpen", true);
		showhideBlackBackground("show");
	});
	
	
	
	
}); //ready()


/**
 * 설  명: deviceready 이벤트
 * 작성자: 김상헌
 */
var onDeviceReady = function() {
	console.log("onDeviceReady()");
	
	push.initialise();
	
	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);	
};


/**
 * 설  명: 방 만들기 출발시간 초기화
 * 작성자: 김상헌
 */
var initStartTime = function() {
	console.log();
	var curr = new Date().getFullYear();
	var opt = {
	};
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
 * 설  명: 방 목록 iScroll 로딩 될 때 처리 - 방 목록 더 가져오기, 경로 위치 지정
 * 작성자: 김상헌
 */
var loadedMyScroll = function() {
	console.log("loadedMyScroll()");
	
	myScroll = new iScroll('wrapper', {
		snap 			: "li",
		momentum 		: false,
		hScrollbar 		: false,
		onRefresh 		: function() { console.log("onRefresh..."); 		},
		onScrollMove 	: function() { console.log("onScrollMove..."); 	},
		onScrollEnd 	: function() { console.log("onScrollEnd..."); 	},
		onTouchEnd 		: function() {
			console.log("onTouchEnd...");
			
			//처음home 이로딩 되면서 searchRoom 을 호출 1페이지당 8개의 방목록을 가져온다.
			if ( roomList.length < (8*5) && this.maxScrollX > this.x ) {
                searchRooms( myInfo.mbrNo, /* refreshFlag */ false );
                  
            } else { 
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

		}
	});

};

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', loadedMyScroll, false);

/**
 * 설  명: 초기화
 * 작성자: 김상헌
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
//		curCoord = new olleh.maps.Coord("958238.8608608943", "1944407.0290863856");// 강남역	958238.8608608943, 1944407.0290863856	37.49798,  127.02755
//		curCoord = new olleh.maps.Coord("949576.8370300145", "1942923.1597472064");// 신림역	949576.8370300145, 1942923.1597472064	37.484173, 126.929661
//		curCoord = new olleh.maps.Coord("956019.1205096169", "1953794.6490542048");// 대학로	956019.1205096169, 1953794.6490542048	37.58249,  127.001876

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

		checkStartLocation();
		testDataInsert();
		
	});
};


/**
 * 설  명: 출발지 검사
 * 작성자: 김상헌
 */
var checkStartLocation = function() {
	console.log("checkStartLocation()");
	
	var locationSession = getSessionItem("locationSession");

	if ( locationSession 				&& locationSession != null 				&&
			locationSession.startName 	&& locationSession.startName != null 	&& locationSession.startName != "" 	&&
			locationSession.startX 		&& locationSession.startX != null 		&& locationSession.startX != "" 	&&
			locationSession.startY 		&& locationSession.startY != null 		&& locationSession.startY != "" ) {
		setStartLocation(	
						locationSession.startX,
						locationSession.startY,
						locationSession.startName,
						locationSession.startPrefix );

		checkEndLocation();

	} else {
		setStartLocationSession(
				curCoord.getX(),
				curCoord.getY(),
				null,
				"내위치: ",
				function () {
		    		checkStartLocation();
		    	} );
		
	}
	
};


/**
 * 설  명: 출발지 설정
 * 작성자: 김상헌
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
	startCircle = setCircle( coord, "#00ffff", myInfo.startRange );
};


/**
 * 설  명: 목적지 검사
 * 작성자: 김상헌
 */
var checkEndLocation = function() {
	console.log("checkEndLocation()");
	
	var locationSession = getSessionItem("locationSession");
	
	if ( locationSession 			&& locationSession != null 			&&
			locationSession.endName && locationSession.endName != null 	&& locationSession.endName != "" 	&&
			locationSession.endX 	&& locationSession.endX != null 	&& locationSession.endX != "" 		&&
			locationSession.endY 	&& locationSession.endY != null 	&& locationSession.endY != "" ) {
		
		setEndLocation(
						locationSession.endX,
						locationSession.endY,
						locationSession.endName,
						locationSession.endPrefix );

		searchRooms( myInfo.mbrNo, /* refreshFlag */ false );

	} else {
		// 최근 목적지 조회 & 목적지로 설정
		var param = {
			mbrNo: myInfo.mbrNo
		};
		
		$.getJSON( rootPath + "/location/getRecentDestination.do", param, function(result) {
			if (result.status === "success") {
				var recentDestinationList = result.data;
				if ( recentDestinationList.length > 0 ) {
					setEndLocationSession(
							recentDestinationList[0].rcntLocLng,
							recentDestinationList[0].rcntLocLat,
							recentDestinationList[0].rcntLocName,
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
};


/**
 * 설  명: 목적지 설정
 * 작성자: 김상헌
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
	endCircle = setCircle( coord, "#00ffff", myInfo.endRange );
};

/**
 * 설  명: 지도에 반경 표시
 * 작성자: 김상헌
 */
var setCircle = function( coord, color, radius ) {
	console.log("setCircle(coord, color, radius)");
//	console.log(coord, color, radius);
	
	var circle = new olleh.maps.Circle({
		center 			: coord,
		radius 			: radius,
		map 			: map,
		fillColor 		: color,
		fillOpacity 		: 0.07,
		strokeColor 	: color,
		strokeOpacity 	: 0.4,
		strokeWeight 	: 1
	});

	return circle;
};

/**
 * 설  명: 위치 검색
 * 작성자: 김상헌
 */
var searchLocation = function( target ) {
    console.log("searchLocation()");
//    console.log(target);
    
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
 * 설  명: 방 목록 조회
 * 작성자: 김상헌
 */
var searchRooms = function( mbrNo, refreshFlag ) {
	console.log("searchRooms(mbrNo, refreshFlag)");
//	console.log(mbrNo, refreshFlag);
	
	var locationSession = getSessionItem("locationSession");
	
	var roomNoArr = new Array();
	for (var i in roomList) {
		roomNoArr[i] = roomList[i].roomNo;
	}

	var params = {
		mbrNo			: mbrNo,
		roomNoArrString : JSON.stringify(roomNoArr),
		startLat 		: locationSession.startY,
		startLng 		: locationSession.startX,
		startRange 		: myInfo.startRange,
		endLat 			: locationSession.endY,
		endLng 			: locationSession.endX,
		endRange 		: myInfo.endRange
	};
	
	$.post( rootPath + "/room/searchRooms.do"
			, params
			, function(result) {
				if (result.status == "success") {
					
					//추가로 얻어온 방목록이 없고, 스크롤의 에 의한 첫페이지를 넘어간 우
					if ( result.data.length == 0 && roomList.length > 8 ) {
		    			var roomLi = $( $("#ulRoomList li").get(myScroll.currPageX) );

		    			initRoute();
		    			searchRoute(
		    					parseFloat( roomLi.data("startX") ),
		    					parseFloat( roomLi.data("startY") ),
		    					parseFloat( roomLi.data("endX") ),
		    					parseFloat( roomLi.data("endY") ),
		    					"directionsService_callback",
		    					null );
						
					} else {
						
						initRoute();
						
						var searchRoomList 	= result.data;
						var roomPathList 	= null;
						var roomMbrList 	= null;
						var startInfo 		= null;
						var endInfo 		= null;
						var waypoints 		= [];
						var startTime 		= null;
						var isMyRoom 		= "false";

						var realignRoomList = [];

						// 각 방들의 정보 출력이 쉽도록 값들의 배치 변경
						for( var i = 0; i < searchRoomList.length; i++ ) {
							roomMbrList = searchRoomList[i].roomMbrList;
							isMyRoom 	= isIRoomMember( roomMbrList, myInfo.mbrNo );
							
							// 출발지 & 목적지 & 경유지 설정
							roomPathList 	= searchRoomList[i].roomPathList;
							startInfo 		= null;
							endInfo 		= null;
							waypoints 		= [];
							
							for ( var j in roomPathList) {
								if ( roomPathList[j].pathRank == 0 ) {
									startInfo = roomPathList[j];

								} else if ( roomPathList[j].pathRank == 99 ) {
									endInfo = roomPathList[j];

								} else {
									waypoints[waypoints.length] = roomPathList[j];

								}
							}

							// 출발시간 설정
							startTime = new Date(searchRoomList[i].roomStartTime);
							startTime = startTime.toTimeString().substr(0, 5);
							
							
							realignRoomList[i] = {
								roomNo 		: searchRoomList[i].roomNo,
								startTime 	: startTime,
								roomDistance: searchRoomList[i].roomDistance,
								startX 		: startInfo.pathLng,
								startY 		: startInfo.pathLat,
								endX 		: endInfo.pathLng,
								endY 		: endInfo.pathLat,
								roomMbrCount: searchRoomList[i].roomMbrCount,
								isMyRoom 	: isMyRoom,
								waypoints 	: waypoints,
								roomMbrNumLimit : result.data[i].roomMbrNumLimit,
								roomMbrList : roomMbrList,
								roomPathList: roomPathList
							};

						}
											
						if ( refreshFlag ) {
							// 기존의 방리스트 초기화 후 조회해 리스트 추가 
							roomList = new Array();
							roomList = realignRoomList;
							
						} else {
							// 기존의 방리스트에 조회해온 리스트 추가
		                    if ( realignRoomList && realignRoomList.length > 0 ) { 
		                        var roomListLen = roomList.length; 
		                        for( var i = 0 ; i < realignRoomList.length; i++ ) { 
		                        	roomList[roomListLen + i] = realignRoomList[i]; 
		                        } 
		                    }
		                    
						}

						// 내방 여부에 따른 화면 세팅
						if ( isRoomMbr() ) { 
							$("#btnAddViewRoom > img").attr("src", "../images/common/button/into_room.png");
							$("#btnAddViewRoom").data("status", "intoMyRoomBtn");
							$("#divRoomList").data("isRoomMbr", "true");
							
							createRoomList( roomList, true );
							
						} else {
					    	$("#btnAddViewRoom > img").attr("src", "../images/common/button/add_btn.png");
							$("#btnAddViewRoom").data("status", "addRoomBtn");
							$("#divRoomList").data("isRoomMbr", "false");
							
					    	createRoomList( roomList, false );
						}

					}
					
				} else {
					console.log("fail");

				}
			}, "json");
};


/**
 * 설  명: 내가 참여하고 있는 방여부 판단
 * 작성자: 김상헌
 * param:
 * 		roomMbrList : 방멤버리스트
 * 		myInfo 		: 회원번호
 */
var isIRoomMember = function( roomMbrList, myMbrNo ) {
	console.log("isMyRoom(roomMbrList)");
//	console.log(roomMbrList);
	
	for ( var j in roomMbrList ) {
		if ( roomMbrList[j].mbrNo == myMbrNo ) {
			return "true";
		}
	}
	return "false";
};


/**
 * 설  명: 방목록 그리기
 * 작성자: 김상헌
 */
var createRoomList = function( roomList, isRoomMbr ) {
	console.log("createRoomList( roomList, isRoomMbr )");
//	console.log( roomList, isRoomMbr );

	if ( !myScroll ) {
		loadedMyScroll();
	}

	$("#ulRoomList").children().remove();
	$("#scroller").css("width", 0+"px");

	if (roomList && roomList.length > 0) { // 검색된 방이 있는 경우
		var roomMbrList = null;
		var divRoomMbrThumb = null;

		for ( var i in roomList ) {
			roomMbrList =  roomList[i].roomMbrList;

			divRoomMbrThumb = $("<div>")
									.addClass("divRoomMbrThumbs");
			
			for(var j=roomList[i].roomMbrNumLimit-1;j>=0;j--){

				if(j>=roomMbrList.length){
					divRoomMbrThumb.append(
							$("<img>")
							.attr("src", "../images/common/transparency.png" )
							.addClass("divRoomVacant") );
				}else{
					divRoomMbrThumb.append(
							$("<img>")
								.attr("src", roomMbrList[j].mbrPhotoUrl )
								.css("height","2.0em"));
				}
			}

			$("<li>")
				.width(contentWidth +"px")
				.data("roomIdx"		, i)
				.data("roomNo"		, roomList[i].roomNo)
				.data("startX"		, roomList[i].startX)
				.data("startY"		, roomList[i].startY)
				.data("endX"		, roomList[i].endX)
				.data("endY"		, roomList[i].endY)
				.data("roomMbrCount", roomList[i].roomMbrCount)
				.data("isMyRoom"	, roomList[i].isMyRoom)
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
												.addClass("relMapPaper")
												.attr("id","relationMap")
												.append(
														$("<div>")
															.addClass("relFace0")
															.attr("id", "relMbr0")
															.append(
																	$("<span>")
																	.attr("class","relMbr0Name")
															))
												.append(
														$("<div>")
															.addClass("relFace1")
															.attr("id", "relMbr1")
															.append(
																	$("<span>")
																	.attr("class","relMbr1Name")
															))
												.append(
														$("<div>")
															.addClass("relFace2")
															.attr("id", "relMbr2")
															.append(
																	$("<span>")
																	.attr("class","relMbr2Name")
															))
												.append(
														$("<div>")
															.addClass("relFace3")
															.attr("id", "relMbr3")
															.append(
																	$("<span>")
																	.attr("class","relMbr3Name")
															))
												.append(
														$("<div id='relLine"+i+"'   style='position:absolute; width:100%; height:100%;'>")
												)
									) ) )
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
											
											var joinRoomNo = $(this).parents("li").data("roomNo");
											
											if ( isRoomMbr ) {
												var outRoomNo = getSessionItem("myRoom").roomNo;
												
												$("#joinRoom_popup").data("outRoomNo", outRoomNo);
												$("#joinRoom_popup").data("joinRoomNo", joinRoomNo);
												
												showhideBlackBackground("show");
												
												$("#joinRoom_popup").popup("open", {
													transition : "pop"
												});
												
											} else {
												push.initialise("joinRoom", joinRoomNo);
//												joinRoom('111111111111111111111111111', joinRoomNo); //////////////////////////////////////////// Web용 임시	
											}
											
											return false;
										}) ) )
				.appendTo( $("#ulRoomList") );

			//방관계도 그리기
			relLineUp(roomMbrList,i,roomList[i].roomMbrNumLimit);
			
			
			$("#scroller").css("width", parseInt($("#scroller").css("width")) + contentWidth + "px");

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
	} else { // 검색된 방이 없는 경우
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
		
		// 페이지 마지막이면 가져온 후 자동으로 다음페이지 이동 처리
        var currPageX = myScroll.currPageX; 
        if ( currPageX != 0 ) { 
            myScroll.scrollToPage( ++currPageX, 1, 1000 ); 
        }

	} else {
		myScroll.disable();

	}

};

/**
 * 설  명: 경로 초기화
 * 작성자: 김상헌
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
 * 설  명: 방 만들기
 * 작성자: 김상헌
 */
var addRoom = function( regId ) {
	console.log("addRoom(regId)");
//	console.log(regId);

	var locationSession = getSessionItem("locationSession");
    var startTime = new Date();
    console.log(startTime);
    var inputTime = $("#inputTime").mobiscroll('getValue');
    console.log(inputTime);
    // AM,PM 일 때
    if (inputTime[2] == '1') {
    	startTime.setHours( parseInt(inputTime[0]) + 12 );
    } else {
    	startTime.setHours( parseInt(inputTime[0]) );
    }
    startTime.setMinutes( parseInt(inputTime[1]) );
    
    if ( $('#inputTime').attr("data-val") == 'tomorrow' ) {
    	startTime.setDate(startTime.getDate() + 1);
    }
    
    if ( startTime && startTime != null && startTime != "" &&
    		locationSession 			&& locationSession != null &&
    		locationSession.startName 	&& locationSession.startName != null 	&& locationSession.startName != "" 	&&
    		locationSession.startX 		&& locationSession.startX != null 		&& locationSession.startX != "" 	&&
    		locationSession.startY 		&& locationSession.startY != null 		&& locationSession.startY != "" 	&&
    		locationSession.endName 	&& locationSession.endName != null 		&& locationSession.endName != "" 	&&
    		locationSession.endX 		&& locationSession.endX != null 		&& locationSession.endX != "" 		&&
    		locationSession.endY 		&& locationSession.endY != null 		&& locationSession.endY != ""
    		) {
    	
    	var params = {
    			mbrNo			: myInfo.mbrNo,
	    		gcmRegId 		: regId,
	    	    roomStartTime 	: startTime,
	    	    roomMbrNumLimit : $('#roomMbrNumLimit').attr("data-val"),	// 2차 개발 수정 완료(이용준)
	    	    roomColor		: (Math.ceil(Math.random() * roomColorArr.length) - 1),	// 방 생성 시 룸 칼라의 번호
	            startLocName 	: locationSession.startName,
	            startLocLng 	: locationSession.startX,
	            startLocLat 	: locationSession.startY,
	    	    startLocRank 	: 0,
	            endLocName 		: locationSession.endName,
	            endLocLng 		: locationSession.endX,
	            endLocLat 		: locationSession.endY,
	            endLocRank 		: 99
        };
    	
    	$.post( rootPath + "/room/addRoom.do",
    			params,
		        function(result) {
		            if (result.status == "success") {
		            	var myRoom = result.data;
		            	setSessionItem("myRoom", myRoom);

		            	executeQuery(
								// Transaction Execute
								function(transaction) {
									deleteAllRcntLocTable(transaction);
									insertRcntLocTable(transaction, result.data.rcntLocList);
								},
								// Success Callback
								function() {
									changeHref("../room/room.html", { roomNo : myRoom.roomNo});
						});

		            } else {
		            	console.log(result.data);
		
		            }
		        },
		        "json");
    }
};


/**
 * 설  명: 경로 찾기
 * 작성자: 김상헌
 */
var searchRoute = function ( startX, startY, endX, endY, callbackFunc, waypoints ) {
	console.log("searchRoute(startX, startY, endX, endY, callbackFunc, waypoints)");
//	console.log(startX, startY, endX, endY, callbackFunc, waypoints);
	
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
//	console.log(data);
	
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
 * 설  명: 경로 마커 표시
 * 작성자: 김상헌
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
 * 설  명: 방 만들기 & 내방가기 버튼 클릭
 * 작성자: 김상헌
 */
var clickAddViewRoom = function() {
	if ($("#btnAddViewRoom").data("status") == "intoMyRoomBtn") {
		goMyroom();

	} else {
		showAddRoomTimePicker();
		
	}	
};


/**
 * 설  명: 내방가기
 * 작성자: 김상헌
 */
var goMyroom = function() {
	console.log("goMyroom()");
	
	if ( isRoomMbr() ) {
		var myRoom = getSessionItem("myRoom");
		
		if (  myRoom && myRoom.roomNo && myRoom.roomNo != 0) {
			changeHref("../room/room.html", { roomNo : myRoom.roomNo });
		}
	}
	
};


/**
 * 설  명: 방 만들기 출발시간 설정 팝업 보이기
 * 작성자: 김상헌
 */
var showAddRoomTimePicker = function() {
	console.log("showAddRoomTimePicker()");
	
	if ( isRoomMbr() ) {
		showAlertToast("이미 방에 참여 중입니다.");
    	
	} else {
    	var dateTime = new Date();
    	dateTime.setMinutes( dateTime.getMinutes() + 10 );
//    	$("#setTimeBox").datebox("setTheDate", dateTime);
		$("#divAddRoomCondition_popup").popup("open", { transition  : "pop" });
		showhideBlackBackground("show");
		$("#setTimeBox").parent().css("display","none");
	}
	
};


/**
 * 설  명: 방 참여하기
 * 작성자: 김상헌
 */
var joinRoom = function(regId, joinRoomNo) {
	console.log("joinRoom(regId, joinRoomNo");
//	console.log(regId, joinRoomNo);

	if ( isRoomMbr() ) {
		showAlertToast("이미 방에 참여 중입니다.");
		
	} else {
    	var locationSession = getSessionItem("locationSession");
    	var params = {
	    		roomNo 			: joinRoomNo,
	    		mbrNo			: myInfo.mbrNo,
	            startLocName 	: locationSession.startName,
	            startLocLng 	: locationSession.startX,
	            startLocLat 	: locationSession.startY,
				endLocName 		: locationSession.endName,
				endLocLat 		: locationSession.endY,
				endLocLng 		: locationSession.endX,
				gcmRegId 		: regId
    	};
    	$.post( rootPath + "/room/joinRoom.do",
    			params,
				function(result) {
					if (result.status =="success") {
						setSessionItem("myRoom", result.data.myRoom);
						// WebDB 에 적용
						executeQuery(
								// Transaction Execute
								function(transaction) {
									deleteAllRcntLocTable(transaction);
									insertRcntLocTable(transaction, result.data.rcntLocList);
									console.log(result.data)
								},
								// Success Callback
								function() {
									changeHref("../room/room.html", { roomNo : joinRoomNo });
								});

					} else {
						showAlertToast(result.data);
						searchRooms(myInfo.mbrNo, /* refreshFlag */ true);

					}
				}, "json");
	}
};

/**
 * 설  명: 기존 방을 나가고 새로운 방에 참여하기
 * 작성자: 김상헌
 */
var outRoomToJoinRoom = function(mbrNo, outRoomNo, joinRoomNo) {
	console.log("outRoomToJoinRoom(mbrNo, outRoomNo, joinRoomNo");
	console.log(mbrNo, outRoomNo, joinRoomNo);
	
		$.getJSON( 
				// URL
				rootPath + "/room/outRoom.do",
				// Params
				{
					mbrNo 	: mbrNo,
					roomNo 	: outRoomNo
				},
				// Success
				function( result ) {
					if(result.status == "success") {
						// myRoom SessionStorage에 방 정보 제거
						removeSessionItem("myRoom");
		
						push.initialise("joinRoom", joinRoomNo);
//						joinRoom('111111111111111111111111111', joinRoomNo); //////////////////////////////////////////// Web용 임시
		
					} else {
						showAlertToast("실행중 오류발생!"); 
						console.log(result.data);
					}
				});
	

	
};


/**
 * 설  명: WebDB 에서 즐겨찾기 목록가져와서 그리기
 * 작성자: 김상헌
 * 수정내용 : 스와이프시 왼쪽:출발지 오른쪽 : 목적지 & 버튼 추가
 * 수정자 : 장종혁
 */
var favoriteList = function() {
    console.log("favoriteList()");
    
    // WebDB 에서 즐겨찾기 목록 가져오기
    selectMyFvrtLocList(
    		myInfo.mbrNo,
    		// Callback
    		function( favoriteLocationList ) {
	            var ul = $("#favoriteUl");
	            
	            $("#favoriteUl .favoriteList").remove();
	            for (var i in favoriteLocationList) {
	                $("<li>")
	                    .addClass("favoriteList")
	                    .attr("data-theme" 	, "d")
	                    .attr("data-icon" 	, "false")
	                    .attr("data-rel" 	, "popup")
	                    .data("endX" 		, favoriteLocationList[i].fvrtLocLng)
	                    .data("endY" 		, favoriteLocationList[i].fvrtLocLat)
	                    .data("locName" 	, favoriteLocationList[i].fvrtLocName)
	                    .data("locNo"		, favoriteLocationList[i].fvrtLocNo)
	                    .click( function(event){
	                    	
	                    	$('.fvrbtn').remove();
	                    	
	                    	var textWidth = (window.contentWidth)*0.75;
	                    	for(var i=0;i<$('.fvrTag').length;i++){
	                    		
	                    		
	                    		$('.fvrTag')[i].style.width=textWidth+"px";
	                    		$('.fvrTag')[i].style.textOverflow="ellipsis";
	                    	}
	                    	
	                    	var textNo = $(this).data("locNo");
	                    	$("#"+textNo).css("width","50%");
	                    	var textNo = $(this).data("locNo");
	                    	var text = $("#favoriteLink"+textNo).text();
	                    	
	                    	var loc = {
	                    			 locX : $(this).data("endX"),
	                    			 locY : $(this).data("endY"),
	                    			 locName : $(this).data("locName")
	                    	 };
	                    	 
	                      	 
	                    	$(".fvlx"+$(this).data("locNo")).append(
                             		$("<a>")
                            		.addClass("ui-btn ui-icon-arrow-r ui-btn-icon-left ui-corner-all ui-shadow ui-btn-inline fvrbtn startEndBtn")
                            		.css("position","absolute")
                            		.css("right","1%")
                            		.css("border","0.5px dotted  gray")
                            		.css("bottom","11%")
                            		.text("도착")
                            		.click( function(event){
                            			
                            			setEndLocationSession(
    	    	                       			loc.locX,
    	    	                     			loc.locY,
    	    	                     			loc.locName,
    	    	                    			"",
    	    	                    			function () {
    	    	                		    		checkEndLocation();
    	    	                		    		map.moveTo( new olleh.maps.Coord(loc.locX, loc.locY) );
    	    	                		    	});
    	                            	
                            			  $("#divFavoriteLoc_popup").popup("close");
    	                              return false;
                            			
                            		})
                            )
                            .append(
                            		$("<a>")
                            		.addClass("ui-btn ui-icon-arrow-r ui-btn-icon-left ui-corner-all ui-shadow ui-btn-inline fvrbtn startEndBtn")
                            		.css("position","absolute")
                            		.css("right","17%")
                            		.css("bottom","10%")
                            		//.css("border","0.5px dotted  gray")
                            		.text("출발")
                            		.click(function(event) {
                            			
                            			setStartLocationSession(
    	    	                     			loc.locX,
    	    	                     			loc.locY,
    	    	                     			loc.locName,
    	    	                    			"",
    	    	                    			function () {
    	    	                     				checkStartLocation();
    	    	                		    		map.moveTo( new olleh.maps.Coord(loc.locX, loc.locY) );
    	    	                		    	});
    	                            	
                            		$("#divFavoriteLoc_popup").popup("close");
    	                              return false;
                            			
									})
                            );
	                    	
	                    })
	                    .swipeleft( function(event) {
	                    	setStartLocationSession(
	                     			$(this).data("endX"),
	                     			$(this).data("endY"),
	                     			$(this).data("locName"),
	                    			"",
	                    			function () {
	                     				checkStartLocation();
	                		    		map.moveTo( new olleh.maps.Coord($(this).data("endX"), $(this).data("endY")) );
	                                    $("#divFavoriteLoc_popup").popup("close");
	                		    	});
	                     	return false;
	            		})
	            		.swiperight( function(event) {
	            			setEndLocationSession(
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
	                            	.attr("id",favoriteLocationList[i].fvrtLocNo)
	                            	.addClass("fvrTag  fvlx"+favoriteLocationList[i].fvrtLocNo)
	                            	.attr("position","relative")
	                                .attr("href","#")
	                                .attr("width","100%")
	                                .text( favoriteLocationList[i].fvrtLocName)
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
    		});
};


/**
 * 설  명: 뒤로가기 버튼 처리
 * 작성자: 김상헌
 */
var FINSH_INTERVAL_TIME = 2000;
var backPressedTime = 0;

var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");
	
	var tempTime = new Date().getTime();
	var intervalTime = tempTime - backPressedTime;
	if ( $(".divBlackBackground").css("visibility") == "hidden") {
		if ( 0 <= intervalTime && FINSH_INTERVAL_TIME >= intervalTime ) {
			navigator.app.exitApp();
		} else {
			backPressedTime = tempTime;
			showAlertToast("'뒤로'버튼을 한번 더 누르시면 종료됩니다.");
		}
	} else {
		$("#leftPanel").panel("close");
		$("#divFavoriteLoc_popup").popup("close");
		$("#divAddRoomCondition_popup").popup("close");
		$("#joinRoom_popup").popup("close");
	}
};


/**
 *설   명 : 메뉴버튼 눌렀을 때 메뉴 나오기 
 *작성자 : 장종혁
 */
function slideMenuPanel() {
	showhideBlackBackground("show");
	$("#leftPanel").panel("open");
	return false;
	
}


/**
 *   설   명  :  관계도 선 그리기
 *   작성자 : 장종혁
 */
var relLineUp = function(roomMbrData, roomCnt,roomMbrLimit){
	console.log("relLineUp(roomMbrData, roomCnt)");
	
	var faceCoordinate = new Array();
	
		// 위치값 보정
		var w=35;
		var h=35;
		
		faceCoordinate[0] = {
				height : $(".relMapPaper")[0].children[0].clientHeight,
				width : $(".relMapPaper")[0].children[0].clientWidth,
				offsetHeight : $(".relMapPaper")[0].children[0].offsetTop+h,
				offsetLeft : $(".relMapPaper")[0].children[0].offsetLeft+w
		};
		
		faceCoordinate[1] = {
				height : $(".relMapPaper")[0].children[1].clientHeight,
				width : $(".relMapPaper")[0].children[1].clientWidth,
				offsetHeight : $(".relMapPaper")[0].children[1].offsetTop+h,
				offsetLeft : $(".relMapPaper")[0].children[1].offsetLeft+w
		};
		
		faceCoordinate[2] = {
				height : $(".relMapPaper")[0].children[2].clientHeight,
				width : $(".relMapPaper")[0].children[2].clientWidth,
				offsetHeight : $(".relMapPaper")[0].children[2].offsetTop+h,
				offsetLeft : $(".relMapPaper")[0].children[2].offsetLeft+w
		};
		
		faceCoordinate[3] = {
				height : $(".relMapPaper")[0].children[3].clientHeight,
				width : $(".relMapPaper")[0].children[3].clientWidth,
				offsetHeight : $(".relMapPaper")[0].children[3].offsetTop+h,
				offsetLeft : $(".relMapPaper")[0].children[3].offsetLeft+w
		};
		
	makeReletionHomeHtml(roomMbrData,faceCoordinate,roomCnt,roomMbrLimit);
};

/**
 *  설   명 : 데이터 정보 확인 테스터
 *  작성자 : 장종혁
 */
function testDataInsert(){
	
	var locationSession = getSessionItem("locationSession");
	
	var myRoomSession = getSessionItem("myRoom");
	
	var rootPathSession = getSessionItem("rootPath");
	
	var myInfoLocal = getLocalItem("myInfo");
	
	console.log("**********************************************");
	console.log("CONSOLE DATA TEST ***********************");
	console.log("**********************************************");
	
	console.log("SessionStorage****************");
	
	console.log("***locationSession : ");
	console.log(locationSession);
	console.log("***locationSession : JSON.stringify");
	console.log(JSON.stringify(locationSession));
	
	console.log("***myRoomSession : ");
	console.log(myRoomSession);
	console.log("***myRoomSession : JSON.stringify");
	console.log(JSON.stringify(myRoomSession));
	
	console.log("***rootPathSession : ");
	console.log(rootPathSession);
	console.log("***rootPathSession : JSON.stringify");
	console.log(JSON.stringify(rootPathSession));
	
	
	
	console.log("LocalStorage*******************");
	console.log("***myInfoLocal : ");
	console.log(myInfoLocal);
	console.log("***myInfoLocal : JSON.stringify");
	console.log(JSON.stringify(myInfoLocal));
	
	
	
	
	selectFrndWebDB(myInfoLocal.mbrNo);
	
}

function selectFrndWebDB(mbrNo){
		
	console.log("WebDB******************************");
		
		selectFrndAllList(function(frndList) {

			console.log("FRND WEB DB ******************");
			console.log("frndList Size : " + frndList.length);
			
			if(frndList.length > 0){
				console.log("frnd[0] = " + JSON.stringify(frndList[0]));
			}
			
			selectFvrtLocWebDB(mbrNo);
			
		});
	
}

function selectFvrtLocWebDB(mbrNo){

	selectMyFvrtLocList(mbrNo,function(fvrtList) {

		console.log("FVRT WEB DB ******************");
		console.log("fvrtList Size : " + fvrtList.length);
		
		if(fvrtList.length > 0){
			console.log("fvrtList[0] = " + JSON.stringify(fvrtList[0]));
		}
		
		selectRcntLocWebDB(mbrNo);
		
	});

}
function selectRcntLocWebDB(mbrNo){
	
	selectAllRcntLoc(function(rcntList) {

		var rcntS = rcntList[0];
		var rcntE = rcntList[1];
		
		
		console.log("RCNT WEB DB! ******************");
		console.log("rcntList 출발지 Size : " + rcntS.length);
		console.log("rcntList 도착지 Size : " + rcntE.length);
		
		if(rcntList[0].length > 0){
			console.log("rcntList 출발지[0] = " + JSON.stringify(rcntS[0]));
		}
		
		if(rcntList[1].length > 0){
			console.log("rcntList 도착지[0] = " + JSON.stringify(rcntE[0]));
		}
		
		console.log("=================================================================");
		console.log("*************************************DATA Test Fin*********************************");
		
	});
}

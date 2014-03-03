console.log("roomjs...");

var map;
var distance;
var geocoder;
var curCoord;
var geocoder;
var directionsService;
var startMarker;
var endMarker;
var curMarker;

var directionsRenderer;
var directionMarkers;
var startTime;
var memberCount;
var contentWidth;
var contentHeight;

var thisRoomColor;


$(document).ready(function(){
	initAjaxLoading();

	var params = getHrefParams();

	var roomNo = params.roomNo;  
	contentHeight = $(window).height();
	contentWidth = $(window).outerWidth();

	
	$("#divMapWrap").css("height",(contentHeight * 2 / 3) + "px");
	
	getAndSetRoomInfo(roomNo);
	getAndSetFeedList(roomNo);
	createMenuPanel();
	
	registerEvent();

});

/**
 * 설  명: 이벤트 등록
 * 작성자: 김상헌
 */
var registerEvent = function() {
	console.log("registerEvent()");
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	// Swipe 관련
	$(function() {
		$(document).swipe({
			swipe:function(event, direction) {

				if(direction == "up" && event.target.offsetParent.id == "divRoomList") {
					if($("#roomSubHeader").attr("data-flag") == "open"){
						closePanel(event);
					}
				} else if(direction == "right") {
					if($("#roomSubHeader").attr("data-flag") == "open"){
						closePanel(event);
					}
				} else if(direction == "left") {
					if($("#roomSubHeader").attr("data-flag") == "open"){
						closePanel(event);
					}
				} else if(direction == "down" && event.target.className != "TileImage"){
					if($("#roomSubHeader").attr("data-flag") == "close"){
						openPanel(event);
					}
				} else if(direction == "left"){
					if($("#roomSubHeader").attr("data-flag") == "close"){
						openPanel(event);
					}
				} else if(direction == "right"){
					if($("#roomSubHeader").attr("data-flag") == "close"){
						openPanel(event);
					}
				}

			},
			allowPageScroll:"none",
			triggerOnTouchEnd : true,
			excludedElements:$.fn.swipe.defaults.excludedElements+"#divMapWrap, #commentList, " +
			".roomMbrHiddenBtnArea_0, .roomMbrHiddenBtnArea_1, .roomMbrHiddenBtnArea_2, .roomMbrHiddenBtnArea_3, " +
			"#popupExit_popup-screen, #popupExit"
		});

		$("#roomPage").on("click", "#roomSubHeader",function(event){
			console.log("click" + event);
			if(event.type == "click" && $("#roomSubHeader").attr("data-flag") == "close"){
				openPanel(event);
			} else if(event.type == "click" && ($("#divRoomList").attr("data-flag") == "open")){
				closePanel(event);
			}

			return false;
		});

	});

	document.addEventListener('DOMMouseScroll', moveObject, false);
	document.onmousewheel = moveObject;

	$(document).bind("touchstart touchend", "#commentList",function(event){
		event.stopPropagation();
	});
	
	// 사이드 패널 관련
	$("#btnShowMenu").click(function() {
		$("#leftPanel").panel("open");
		backgroundBlack();
		return false;
	});
	
	$( "#leftPanel" ).on( "panelbeforeclose", function() {
		$("#blackImage").css("visibility","hidden");
	} );
	$(document).on('keypress', '#reply', function(evt){

		var keyPressed = evt.which || evt.keyCode;
		var mbrNo = myInfo.mbrNo;
		var myRoom = getSessionItem("myRoom");
		
		if (keyPressed == 13) {

			var feedContent = $("#reply").val();
			$("#reply").val("");
			addFeed(mbrNo, feedContent, myRoom.roomNo);
		}
	});

	// 피드 삭제 클릭
	$(document).on("click", ".btnDelete", function(event){
		event.stopPropagation();
		var mbrNo = $(this).attr("data-mbrNo");
		var feedNo = $(this).attr("data-feedNo");
		var roomNo = $(this).attr("data-roomNo");
		deleteFeed(mbrNo, feedNo, roomNo);

		return false;
	});

	// 방 나가기 관련
	$(document).on("click", "#exitRoom",function(){
		$("#popupExit_popup").popup("open", {
			transition : "pop"
		});

		return false;
	});

	$(document).on("click", "#cancleExit", function(event){
		event.stopPropagation();
		$("#popupExit_popup").popup("close", {
			transition : "pop"
		});

		return false;
	});
	$("#outRoom").on("click", function(event){

		event.stopPropagation();

		var mbrNo = myInfo.mbrNo;
		var roomNo = $("#roomNo").attr("data-roomNo");
		outRoom(mbrNo, roomNo);

		return false;
	});
	$("#popupExit_popup").on("popupafterclose", function(event, ui) {
		$(this).data("isOpen", false);
	});
	$("#popupExit_popup").on("popupafteropen", function(event, ui) {
		$(this).data("isOpen", true);
	});
	

	// 블랙리스트 관련
	$("#btnRegisterBlacklist").on("click", function(event){
		event.stopPropagation();
		
		var blackMbrNo = $("#spanBlackText").data("blackMbrNo");
		registerBlacklist(blackMbrNo);

		return false;
	});
	$("#blacklistRegister_popup").on("popupafterclose", function(event, ui) {
		$(this).data("isOpen", false);
	});
	$("#blacklistRegister_popup").on("popupafteropen", function(event, ui) {
		$(this).data("isOpen", true);
	});


	// 색전환 관련
	$(document).on("click", "#colorSign",function(){
		var screenWidth = $(document).width();
		var screenHeight = $(document).height(); 
		$('#roomColor').css({'width':screenWidth,'height':screenHeight, 'background-color':thisRoomColor});
		$('#roomColor').fadeIn(0);      
		$('#roomColor').fadeTo("speed",1.0);
	});
	$(document).on("click", "#colorClear",function(){
		$('#roomColor').css('display',"none");
	});

};


/**
 * deviceready 이벤트
 */
var onDeviceReady = function() {
	console.log("onDeviceReady()");

	push.initialise();

	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);
};


/**
 * 설  명: 방정보 가져와서 설정하기
 * 작성자: 김상헌
 */
var getAndSetRoomInfo = function(roomNo) {
	console.log("getAndSetRoomInfo(roomNo)");
//	console.log(roomNo);
	
	$.getJSON(
			// URL
			rootPath + "/room/getRoomInfo.do",
			// params
			{ roomNo : roomNo },
			// Success
			function(result) {
				var roomInfo = result.data;
				
				if(result.status == "success") {
					var startLat 	= roomInfo.roomPathList[0].pathLat;
					var startLng 	= roomInfo.roomPathList[0].pathLng;
					var endLat 		= roomInfo.roomPathList[1].pathLat;
					var endLng 		= roomInfo.roomPathList[1].pathLng;
		
					initMap(startLat, startLng);
					
					initRoute();
					searchRoute( startLng, startLat, endLng, endLat, /*callback*/ "directionsService_callback" );
		
					setViewRoomInfo(roomInfo);
					createHeaderSlide(roomInfo);
					
		
				} else {
					alert("실행중 오류발생!");
					console.log(result.data);
				}
			});
};


/**
 * 설  명: 맵 그리기
 * 작성자: 김상헌
 */
var initMap = function( startLat, startLng ) {
	console.log("initMap(startLat, startLng)");
//	console.log(startLat, startLng);
	
	geocoder = new olleh.maps.Geocoder("KEY");
	directionsService = new olleh.maps.DirectionsService('frKMcOKXS*l9iO5g');

	curCoord = new olleh.maps.Coord(startLng, startLat);

	console.log("loadMap()");

	var mapOptions = {
			center : curCoord,
			zoom : 1,
			mapTypeId : olleh.maps.MapTypeId.BASEMAP,
			mapTypeControl: false
	};

	map = new olleh.maps.Map(document.getElementById("canvas_map"), mapOptions);
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
 * 설  명: 경로 찾기
 * 작성자: 김상헌
 */
var searchRoute = function ( startX, startY, endX, endY, callbackFunc, waypoints ) {
	console.log("searchRoute()");
	var DirectionsRequest = {
			origin 		: new olleh.maps.Coord( startX, startY ),
			destination : new olleh.maps.Coord( endX, endY ),
			waypoints 	: waypoints,
			projection 	: olleh.maps.DirectionsProjection.UTM_K,
			travelMode	: olleh.maps.DirectionsTravelMode.DRIVING,
			priority  		: olleh.maps.DirectionsDrivePriority.PRIORITY_3
	};
	directionsService.route(DirectionsRequest, callbackFunc);
};

/**
 * 설  명: 경로찾기 callback
 * 작성자: 김상헌
 */
var directionsService_callback = function (data) {
	console.log("directionsService_callback()");
	var DirectionsResult  = directionsService.parseRoute(data);
	console.log(DirectionsResult);

//	var startRoute = DirectionsResult.result.routes[0].point;
//	console.log(startRoute);

	var date = parseInt(startTime);

	if(	date >= 00 && date < 04){

		console.log("할증");

		var distanceFare =
			(DirectionsResult.result.total_distance.value / 142) * 120;

//		var durationFare =
//		Math.round(((
//		(Math.round(DirectionsResult.result.total_duration.value) * 60) - 540) / 35) * 100);

		var totalFare = Math.round(distanceFare + 3600);
		totalFare = totalFare.toString().substr(
				0, totalFare.toString().length -2).concat("00");

		console.log(totalFare);
		distance = DirectionsResult.result.total_distance.value  / 10.0;
		distance = Math.round(distance) / 100;

		$("#roomDistance").text( distance +"km");
		$("#totalFareName").text("할증요금")
		.css("background-color", "crimson")
		.css("color", "lightyellow");

		$("#roomFare").text( totalFare + "원");

		var roomFare = ((totalFare / memberCount) / 100);
		var myFare = roomFare.toString().substr(
				0, totalFare.toString().length -2).concat("00").replace(".", "");
		console.log(myFare);
		$("#myFare").text( myFare + "원");

	} else {


		console.log("NO할증");

		var distanceFare =
			(DirectionsResult.result.total_distance.value / 142) * 100;

//		var durationFare =
//		Math.round(((
//		(Math.round(DirectionsResult.result.total_duration.value) * 60) - 540) / 35) * 100) / 2;

		var totalFare = Math.round(distanceFare + 3000);
		totalFare = totalFare.toString().substr(
				0, totalFare.toString().length -2).concat("00");

		distance = DirectionsResult.result.total_distance.value  / 10.0;
		distance = Math.round(distance) / 100;

		$("#roomFare").text(totalFare + "원");

		var roomFare = ((totalFare / memberCount) / 100);
		var myFare = roomFare.toString().substr(
				0, totalFare.toString().length -2).concat("00").replace(".", "");

		$("#myFare").text( myFare + "원");
		$("#roomDistance").text( distance +"km");

		$("#totalFareName").text("Total")
		.css("background-color", "wheat")
		.css("color", "darkgreen");

	}

	directionMarkers = [];
	var routes = DirectionsResult.result.routes;
	var strCoord = null;
	for( var i in routes) {
		if ( routes[i].type == "999" ) {
			directionMarkers[directionMarkers.length] = setWaypointMarker(
					new olleh.maps.Coord( routes[i].point.x, routes[i].point.y ),
			"../images/common/marker/MapMarker_Marker_Outside_Azure.png" );
			strCoord = new olleh.maps.Coord( routes[i].point.x, routes[i].point.y );
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

	map.moveTo(strCoord, 10);
	setInterval(strRefresh, 3000);
};


/**
 * 설  명: 화면에 값 설정하기
 * 작성자: 김상헌
 */
var setViewRoomInfo = function( roomInfo ) {
	console.log("setViewRoomInfo(roomInfo)");
//	console.log(roomInfo);
	
	var d = new Date(roomInfo.roomStartTime);
	var hour = d.toTimeString().substring(0, 2);
	var minute = d.toTimeString().substring(3, 5);
	startTime = hour;
	memberCount = roomInfo.roomMbrCount;
	thisRoomColor =roomColorArr[roomInfo.roomColor];

	$("#roomStartTime").text( hour +":"+ minute );
	$("#imgMbrPhoto").attr( "src", myInfo.mbrPhotoUrl );
	$("#mbrName").text( myInfo.mbrName );
	$("#roomNo").attr("data-roomNo", roomInfo.roomNo);
};


/**
 * 설  명: 헤더 슬라이드 만들기
 * 작성자: 김상헌
 */
var createHeaderSlide = function(roomInfo) {
	console.log("ceateHearSlide(roomInfo)");
//	console.log(roomInfo);
	
	var idx = 0;
	var divRoomList = $("#divRoomList");
	
	// 헤더 표시 Bar
	$("<div>")
	.addClass("divHeaderLine")
	.attr("data-flag", "close")
	.append(
			$("<a>")
				.attr("href", "#")
				.attr("id", "btnHeaderVar")
				.append(
						$("<img>")
							.attr("src", "../images/common/defaultvar.png")
							.attr("id", "headerVar")
							.addClass("headerVar") ) 
				)
	.appendTo(divRoomList);
	
	// 관계도 
	$("#divCanvas").remove();
	
	$("<div>")
			.attr("id", "divCanvas")
			.append(
					$("<canvas>")
					.addClass("canvas")
					.attr("id", "myCanvas_" + idx))
					.prependTo(divRoomList);

	var roomMbrList =  roomInfo.roomMbrList;
	console.log(roomMbrList);

	for(var i in  roomMbrList){
		$("#divCanvas").append( 
				$("<div>")
						.attr("style", "z-index:1000")
						.addClass( "roomMbrHiddenBtnArea_" + i )
						.data("roomMbrName"	, roomMbrList[i].mbrName)
						.data("roomMbrNo"	, roomMbrList[i].mbrNo)
						.click(function() {
							showRegBlacklsitPopup(this);
						})
			);
	}
	$("#divMapWrap")
			.append( $("<div>").attr("id", "divTouch") );

	if ( contentWidth < 340 || contentHeight < 580 ) {

		$("#divRoomList").css("top", "-277px" );

		$("#roomFare").css("font-size", "78%");
		$("#roomStartTime").css("font-size", "200%");

		$("#roomDistance").css("width", "22%");
		$("#fareName").text("예상요금")
		.css("width", "20%");

		$("#myFare").attr("style", "font-size: 81%")
		.attr("style", "width: 20%");

	} else {
		$("#divRoomList").css("top", "-327px" );

		$("#roomFare").attr("style", "font-size: 85%");

		$("#roomStartTime").attr("style", "font-size: 235%");

		$("#roomDistance").attr("style", "width: 22%");
		$("#fareName").text("예상요금")
		.css("width", "22%");

		$("#myFare").attr("style", "font-size: 90%")
		.attr("style", "width:22%");
	}
	
	showRelationInfo(roomInfo, idx);
};


/**
 * 설  명: 관계도 보여주기
 * 작성자: 김상헌
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
 * 설  명: 사이드 메뉴패널 만들기
 * 작성자: 김태경
 */
var createMenuPanel = function() {
	console.log("createMenuPanel()");
	
	$("<div>")
		.attr("id", "blackImage")
		.css("width",(contentWidth + 2) + "px")
		.css("height",contentHeight + "px")
		.css("background","black")
		.css("z-index","9998")
		.css("left","-1px")
		.css("top","0")
		.css("position","absolute")
		.css("opacity","0.5")
		.css("visibility","hidden")
	.appendTo($("body"));
	
	$("#btnSettings").click(function(event) {
	//event.stopPropagation();
	changeHref("../settings/settings.html");
	return false;
	});
	
	$("#btnComment").click(function(event) {
	//event.stopPropagation();
	changeHref("../comment/comment.html");
	return false;
	});
	
	$("#leftPanel ul li a:link").css("width", ((contentWidth / 2) -10) + "px");
	$("#leftPanel ul li a:visited").css("width", ((contentWidth / 2) - 10) + "px");
	$(".ui-panel").css("width", (contentWidth / 2) + "px");
	
	
	$("#blackImage").on({
	//touchend:function(){
		click:function(){
		$("#leftPanel").panel("close");
		$("#blackImage").css("visibility","hidden");
	},
	swipeleft: function() {
		$("#leftPanel").panel("close");
		$("#blackImage").css("visibility","hidden");
	}
	});
};


/**
 * 설  명: 방 나가기
 * 작서자: 김상헌
 */
var outRoom = function (mbrNo, roomNo) {
	console.log("outRoom(mbrNo, roomNo)");
//	console.log(mbrNo, roomNo);

	var params = {
			mbrNo 	: mbrNo,
			roomNo 	: roomNo 
	};
	$.getJSON( rootPath + "/room/outRoom.do"
			, params
			, function( result ) {
		if(result.status == "success") {
			// myRoom SessionStorage에 방 정보 제거
			removeSessionItem("myRoom");

			changeHref("../home/home.html");

		} else {
			alert("실행중 오류발생!"); 
			console.log(result.data);
		}
	});
};


/**
 * 설  명: 피드 리스트 가져오기
 * 작성자: 김상헌
 */
var getAndSetFeedList = function(roomNo){
	console.log("getAndSetFeedList(roomNo)");
//	console.log(roomNo);
	
	var params = { roomNo : roomNo };
	$.getJSON( rootPath + "/feed/feedList.do"
			, params
			, function(result) {
		if(result.status == "success") {

			var feedList = result.data;
			var mbrNo = myInfo.mbrNo;
			var ul = $(".listViewUl");

			$(".listViewUl .feedList").remove();

			for (var i in feedList) {
				var li = $("<li>")
				.addClass("feedList")
				.append( $("<p>") 
						.attr("class","ui-li-aside") 
						.text(feedList[i].feedRegDate) )
						.append( $("<img>")
								.attr("id", "feedMbrImg")
								.attr("src", feedList[i].mbrPhotoUrl) )
								.append( $("<h2>")
										.text(feedList[i].mbrName) );

				if(feedList[i].mbrNo === mbrNo){
					li.append( $("<p>")
							.append( $("<strong>").text(feedList[i].feedContent) )
							.append( $("<a>")
									.addClass("btnDelete")
									.attr("data-inline", "true")
									.attr("data-roomNo", feedList[i].roomNo)
									.attr("data-feedNo", feedList[i].feedNo)
									.attr("data-mbrNo", feedList[i].mbrNo)
									.append(
											$("<img>").attr("src", "../images/common/button/deletefeedx.png")
											.addClass("deleteFeed"))
							) )
							.appendTo(ul);

					$('ul a[data-role=button]').buttonMarkup("refresh");
				} else {
					console.log("else");
					li.append( $("<p>")
							.append( $("<strong>").text(feedList[i].feedContent) ) )
							.appendTo(ul);
				}
			} // 반복문 end
			$('ul').listview('refresh');

			contentHeight = $(window).height();
			var currentWarpperHeight = $("#wrapper").css("height");
			$("#wrapper").css("height", (currentWarpperHeight + 81)  + "px");
		}
	});
};


/**
 * 설  명: 피드 추가하기
 * 작성자: 김상헌
 */
var addFeed = function(mbrNo, feedContent, roomNo) {
	console.log("addFeed(mbrNo, feedContent, roomNo)");
	console.log(mbrNo, feedContent, roomNo);
	
	$.post( rootPath + "/feed/addFeed.do",
			{
				mbrNo		:  mbrNo,
				roomNo		:  roomNo,
				feedContent	:  feedContent
			},
			function(result) {
				if(result.status == "success") {
					getAndSetFeedList(roomNo);

				} else {
					alert("실행중 오류발생!");
					console.log(result.data);
				}
			},
	"json");
};


/**
 * 설  명: 피드 삭제하기
 * 작성자: 김상헌
 */
var deleteFeed = function(mbrNo, feedNo, roomNo){
	console.log("deleteFeed(mbrNo, feedNo, roomNo)");
//	console.log(mbrNo, feedNo, roomNo);

	$.getJSON( rootPath + "/feed/deleteFeed.do?mbrNo=" + mbrNo +
			"&feedNo=" + feedNo
			, function(result) {

		if(result.status == "success") {
			getAndSetFeedList(roomNo);

		} else {
			alert("실행중 오류발생!");
			console.log(result.data);
		}
	});
};


/**
 * 설  명: 블랙리스트 등록 확인 팝업 보이기
 * 작성자: 김상헌
 */
var showRegBlacklsitPopup = function( target ) {
	console.log("showRegBlacklsitPopup(target)");
//	console.log(target);
	
	var roomMbrNo = $(target).data("roomMbrNo");
	
	// 내가 아닌경우 팝업 보여준다
	if ( roomMbrNo != myInfo.mbrNo) {
		var roomMbrName = $(target).data("roomMbrName");
		
		$("#spanBlackText")
						.text(roomMbrName)
						.data("blackMbrNo", roomMbrNo);
		
		$("#blacklistRegister_popup").popup("open", {
			transition : "pop"
		});
		
	} else {
		Toast.shortshow("자신은 블랙리스트로 지정 하 수 없습니다.");
		
	}
};

/**
 * 설  명: 블랙리스트로 등록하기
 * 작성자: 김상헌
 */
var registerBlacklist = function( blackMbrNo ){
	console.log("registerBlacklist(blackMbrNo)");
//	console.log(blackMbrNo);
	
	$.getJSON(
			// URL
			rootPath + "/black/registerBlacklist.do",
			// Parameter
			{ 
				mbrNo 		: myInfo.mbrNo,
				blackMbrNo 	: blackMbrNo 
			},
			// Success
			function(result) {
				if ( result.status == "success" ) {
					var blackList = result.data;
					console.log(blackList);
					
					if ( blackList ) {
						// WebDB 에 추가
						executeQuery(
								// Execute Transaction
								function( transaction ) {
									insertBlackTable( transaction, blackList );
								},
								// Callback Function
								function() {
									$("#blacklistRegister_popup").popup("close");
									// 블랙리스트 표시해주기 ///////////////////////////////  추후에 개발해야함.
									
								});
						
					}
					
				} else {
					console.log("블랙리스트 등록 중 오류 발생");
					
				}
			});
	
};


function openPanel(event){
	event.stopPropagation();
	$("#divTouch").attr("style", "visibility:visible");
	$("#roomSubHeader").attr("data-flag", "open");
	$(".divHeaderLine").attr("data-flag", "open");
	$("#divRoomList").attr("data-flag", "open").
	transition({y: ''+ ($("#divRoomList").height() - 11) +'px'}, 300, 'linear');
	$("#headerVar").attr("src", "../images/common/upheadervar.png");

}

function closePanel(event){
	event.stopPropagation();
	$("#divTouch").attr("style", "visibility:hidden");
	$(".divHeaderLine").attr("data-flag", "close");
	$("#roomSubHeader").attr("data-flag", "close");
	$("#divRoomList").attr("data-flag", "close").transition({y: "0px"}, 300);
	$("#headerVar").attr("src", "../images/common/defaultvar.png");
	$(".roomMbrHiddenBtnArea_0").attr("style", "opacity:0");
}


function moveObject(event) {
	if($("#roomSubHeader").attr("data-flag") == "close"){
		console.log("close" + event);
		event.preventDefault();
		event.stopPropagation();
		event.returnValue = true;

	} else {
		console.log("open" + event);
		event.preventDefault();
		event.stopPropagation();
		event.returnValue = false;
	}
}


/**
 * 작 성 : 이지우
 * 설 명 : 3초마다 Refresh하여 내 위치를 지도의 중심으로 세팅함.
 */
var strRefresh = function() {
	console.log("strRefresh()");
	var realCoord = null;
	navigator.geolocation.getCurrentPosition(function(position) {
		var curPoint = new olleh.maps.Point( position.coords.longitude, position.coords.latitude );
		var srcproj = new olleh.maps.Projection('WGS84');
		var destproj = new olleh.maps.Projection('UTM_K');
		olleh.maps.Projection.transform(curPoint, srcproj, destproj);
		realCoord = new olleh.maps.Coord(curPoint.getX(), curPoint.getY());

		map.moveTo(realCoord);
		// Zoom Level은 일단 제외
		console.log(realCoord);
	});


};

var setWaypointMarker = function( coord, imageUrl ) {
	console.log("setWaypointMarker()");
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
		title : 'Current Location',
		zIndex : 1
	});

	return marker;
};


/**
 * 뒤로가기 버튼 처리
 */
var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");

	var hasOpenPopup = false;

	$("div[data-role=popup]").each(function( idx ) {
		if ( $(this).data("isOpen") == true ) {
			$(this).popup("close");

			hasOpenPopup = true;
		}
	});

	if ( !hasOpenPopup ) {
		changeHref("../home/home.html");
	}

};


/**
 * 설  명: background black 처리
 * 작성자: 김상헌
 */
var backgroundBlack = function() {
	$("#blackImage").css("visibility","visible");
};


/**
 *설   명 : 메뉴버튼 눌렀을 때 메뉴 나오기 
 *작성자 : 장종혁
 */
function slideMenuPanel() {
	$("#leftPanel").panel("open");
	backgroundBlack();
	return false;

}



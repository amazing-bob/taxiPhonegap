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


$(document).ready(function(){
	initAjaxLoading();

	document.addEventListener("deviceready", onDeviceReady, false);

	var params = getHrefParams();
	console.log(params);
	var roomNo = params.roomNo;
	var contentHeight = $(window).height();
	console.log(contentHeight);
	console.log($("#mainHeader").outerHeight());
	console.log($("#content").outerHeight());
	console.log($("#commentList").outerHeight());
//	var feedheight = $("#divStartEndLoc").outerHeight()
//	$("#commentList")

//	loginInfo();
//	개인 세션 정보로 Select
	$("#divMapWrap").css("height",(contentHeight * 2 / 3) + "px");
	getRoomInfo(roomNo);
	getFeedList(roomNo);

	$(document).on('keypress', '#reply', function(evt){

	        var keyPressed = evt.which || evt.keyCode;
	        var mbrNo = getSessionItem("myInfo").mbrNo;

	        if (keyPressed == 13) {

	        	var feedContent = $("#reply").val();
	        	$("#reply").val("");
	        	addFeed(mbrNo, feedContent, roomNo);
	        }
	 });

	 $(document).on("click", ".btnDelete", function(event){
		 event.stopPropagation();
		 var mbrNo = $(this).attr("data-mbrNo");
		 var feedNo = $(this).attr("data-feedNo");
		 var roomNo = $(this).attr("data-roomNo");
		 console.log("=============&&&&&&&&&&&&");
		 console.log(mbrNo +feedNo +roomNo );
		 deleteFeed(mbrNo, feedNo, roomNo);

		 return false;
	 });

	 $("#icons").click(function(event){
		 event.stopPropagation();
		 changeHref("../home/home.html");

		 return false;
	 });

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
	 $("#popupExit_popup").on("popupafterclose", function(event, ui) {
		 $(this).data("isOpen", false);
	 });
	 $("#popupExit_popup").on("popupafteropen", function(event, ui) {
		 $(this).data("isOpen", true);
	 });

	$("#popupCall_popup").on("popupafterclose", function(event, ui) {
		$(this).data("isOpen", false);
	});
	$("#popupCall_popup").on("popupafteropen", function(event, ui) {
		$(this).data("isOpen", true);
	});


	 $("#outRoom").on("click", function(event){

		 event.stopPropagation();

		 var mbrNo = getSessionItem("myInfo").mbrNo;
		 var roomNo = $("#roomNo").attr("data-roomNo");
		 outRoom(mbrNo, roomNo);

		 return false;
	 });


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
			  														".divCall1, .divCall2, .divCall3, .divCall4," +
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
//				console.log(event.toElement);
		event.stopPropagation();
	});


	$(document).on("click", ".divCall0",function(event){
		event.stopPropagation();
		beforeCall( $(event.currentTarget)[0].dataset.callname,
						$(event.currentTarget)[0].dataset.mbrphoneno);

		return false;
	});

	$(document).on("click", ".divCall1",function(event){
		event.stopPropagation();
		beforeCall( $(event.currentTarget)[0].dataset.callname,
						$(event.currentTarget)[0].dataset.mbrphoneno);

		return false;
	});

	$(document).on("click", ".divCall2",function(event){
		event.stopPropagation();
		beforeCall( $(event.currentTarget)[0].dataset.callname,
						$(event.currentTarget)[0].dataset.mbrphoneno);

		return false;
	});

	$(document).on("click", ".divCall3",function(event){
		event.stopPropagation();
		beforeCall( $(event.currentTarget)[0].dataset.callname,
						$(event.currentTarget)[0].dataset.mbrphoneno);

		return false;
	});

	$("#callRoom").on("click", function(event){
		event.stopPropagation();
		var phoneNo = $("#callTextSpan").attr("data-phoneno");
		callSomeOne(phoneNo);

		return false;
	});

	$("<div>")
	.addClass("divHeaderLine")
	.attr("data-flag", "close")
				  		.append($("<a>")
				  		.attr("href", "#")
				  		.attr("id", "btnHeaderVar")
								.append(
										$("<img>")
												  .attr("src", "../images/common/defaultvar.png")
												  .attr("id", "headerVar")
												  .addClass("headerVar")))
	.appendTo(divRoomList);


});

function beforeCall(mbrName, phoneNo){
	$("#callTextSpan").text(mbrName)
					  .attr("data-phoneno", phoneNo);
	$("#popupCall_popup").popup("open", {
		transition : "pop"
	});
}


function callSomeOne(phoneNo){
	console.log(phoneNo);
	Phonedialer.dial(phoneNo);
}


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
	$(".divCall1").attr("style", "opacity:0");
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
 * deviceready 이벤트
 */
var onDeviceReady = function() {
	console.log("onDeviceReady()");

	push.initialise();

	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);
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
 * 경로 찾기
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
 * 경로찾기 callback
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
//				Math.round(((
//					(Math.round(DirectionsResult.result.total_duration.value) * 60) - 540) / 35) * 100);

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
//				Math.round(((
//					(Math.round(DirectionsResult.result.total_duration.value) * 60) - 540) / 35) * 100) / 2;

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

/*
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


var outRoom = function (mbrNo, roomNo) {

	var params = {
		mbrNo 	: mbrNo,
		roomNo 	: roomNo
	};
	$.getJSON( rootPath + "/room/outRoom.do"
			, params
			, function( result ) {
				if(result.status == "success") {
					// 방나간정보를 myInfo 에 적용
					$.extend(true,
							myInfo,
							{
								isRoomMbr : false,
								myRoom : undefined
							});

					setSessionItem("myInfo", myInfo);

					changeHref("../home/home.html");

				} else {
					alert("실행중 오류발생!");
					console.log(result.data);
				}
			 });
};


var getRoomInfo = function(roomNo) {
	console.log("getRoomInfo()");
	$.getJSON( rootPath + "/room/getRoomInfo.do?roomNo=" + roomNo,
								function(result) {
		console.log(result);
	var roomInfo = result.data;
	console.log(roomInfo);
	if(result.status == "success") {

		console.log("init()	- getRoomInfo()");
		var startLat = roomInfo.roomPathList[0].pathLat;
		var startLng = roomInfo.roomPathList[0].pathLng;
		var endLat = roomInfo.roomPathList[1].pathLat;
		var endLng = roomInfo.roomPathList[1].pathLng;
		var dsCallBack = "directionsService_callback";

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

	  	initRoute();
	  	searchRoute(startLng, startLat, endLng, endLat, dsCallBack);

		var d = new Date(roomInfo.roomStartTime);

		var hour = d.toTimeString().substring(0, 2);
		var minute = d.toTimeString().substring(3, 5);
		startTime = hour;
		memberCount = roomInfo.roomMbrCount;

		$("#roomStartTime").text( hour +":"+ minute );
		$("#roomStartDay").text("출발");
		$("#imgMbrPhoto").attr( "src", myInfo.mbrPhotoUrl );
		$("#mbrName").text( myInfo.mbrName );
		$("#roomNo").attr("data-roomNo", roomInfo.roomNo);

		var idx = 0;
		var divRoomList = $("#divRoomList");

		$("#divCanvas").remove();

		$("<div>")
			.attr("id", "divCanvas")
				  .append(
						  $("<canvas>")
						  			  .addClass("canvas")
						  			  .attr("id", "myCanvas_" + idx))
			      .prependTo(divRoomList);

		var roomMbrList =  roomInfo.roomMbrList;

		for(var i in  roomMbrList){
				$("#divCanvas")
				.append($("<div>")
						.attr("style", "z-index:1000")
						.addClass("divCall" + i )
						.attr("data-callname", roomMbrList[i].mbrName)
						.attr("data-mbrphoneno", roomMbrList[i].mbrPhoneNo)
				);
		}

		$("#divMapWrap").append(
								$("<div>").attr("id", "divTouch"));


		console.log("" + screen.width);
		console.log("" + screen.height);

		if ( contentWidth < 340 || contentHeight < 580 ) {

			$("#divRoomList").css("top", "-277px" );

//			$("#roomStartDay").css("margin-top", "20px")
//							.css("margin-left", "13px")
//							.css("font-size: 100%");

			$("#roomFare").css("font-size", "78%");
			$("#roomStartTime").css("font-size", "200%");

			$("#roomDistance").css("width", "22%");
			$("#fareName").text("예상요금")
						  .css("width", "20%");

			$("#myFare").attr("style", "font-size: 81%")
						.attr("style", "width: 20%");

		} else {
			$("#divRoomList").css("top", "-327px" );

//			$("#roomStartDay").css("margin-top", "24px")
//			  					.css("margin-left", "13px")
//			  						.css("font-size: 110%");

			$("#roomFare").attr("style", "font-size: 85%");

			$("#roomStartTime").attr("style", "font-size: 235%");

			$("#roomDistance").attr("style", "width: 22%");
			$("#fareName").text("예상요금")
			 			  .css("width", "22%");

			$("#myFare").attr("style", "font-size: 90%")
						.attr("style", "width:22%");
		}
		showRelationInfo(roomInfo, idx);

	} else {
		alert("실행중 오류발생!");
		console.log(result.data);
	}
});
};



var showRelationInfo = function(roomInfo, idx) {
	console.log("showRelationInfo(roomInfo, idx)");

	var canvas = document.getElementById("myCanvas_" + idx);

	if ( contentWidth < 340 || contentHeight < 580 ) {
		drawRelationCanvas(roomInfo, canvas, 1);

	} else {
		drawRelationCanvas(roomInfo, canvas, 2);
	}

};



var getFeedList = function(roomNo){

	$.getJSON( rootPath + "/feed/feedList.do?roomNo="
									+ roomNo, function(result) {

		if(result.status == "success") {

			var feedList = result.data;
			console.log(feedList);
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
								.attr("id","feedMbrImg")
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


var addFeed = function(mbrNo, feedContent, roomNo) {
	console.log("addFeed:" + mbrNo, feedContent, roomNo);
	$.post( rootPath + "/feed/addFeed.do",
			{
					mbrNo	:  mbrNo,
					roomNo	:  roomNo,
			  feedContent	:  feedContent
			},
			function(result) {
				if(result.status == "success") {
					getFeedList(roomNo);
					console.log("성공!!! 방정보 받기");

				} else {
					alert("실행중 오류발생!");
					console.log(result.data);
				}
			},
	"json");
};


var deleteFeed = function(mbrNo, feedNo, roomNo){

	$.getJSON( rootPath + "/feed/deleteFeed.do?mbrNo=" + mbrNo +
									"&feedNo=" + feedNo
										, function(result) {

				if(result.status == "success") {
					getFeedList(roomNo);

				} else {
					alert("실행중 오류발생!");
					console.log(result.data);
				}
		});
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




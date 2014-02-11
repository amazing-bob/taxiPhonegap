console.log("commonjs...");

var rootPath = "http://buru1020.cafe24.com/taxi";	//호스팅
//var rootPath = "http://192.168.0.67:9999/taxi_proto";		//로컬_상헌

/**
 * ajax 로딩 초기설정
 */
var initAjaxLoading = function() {
	$( document ).ajaxStart(function() {
		$.mobile.loading("show",{
			text: "",
			textVisible: false,
			theme: "none",
			textonly: false,
			html: "<img src='../images/common/button/loading.gif' style='width: 50px; height:50px;'>"
		});
	});
	$( document ).ajaxStop(function() {
		$.mobile.loading("hide");
	});
};

/**
 * sessionStorage 에 값 설정하기
 */
var setSessionItem = function (key, value) {
	console.log("setSessionItem(", key,", ", value+")");
//	console.log(key, value);
	sessionStorage.setItem(key, JSON.stringify(value));
};

/**
 * sessoinStorage 값 가져오기
 */
var getSessionItem = function (key) {
	console.log("getSessionItem(key)");
//	console.log(key);
	return JSON.parse(sessionStorage.getItem(key));
};

/**
 * sesisonStorage 에서 아이템 제거
 */
var removeSessionItem = function (key) {
	console.log("removeSessionItem(key)");
	sessionStorage.removeItem(key);
};

/**
 * sessionStorage 비우기
 */
var clearSession = function () {
	console.log("clearSession()");
	sessionStorage.clear();
};
setSessionItem("rootPath", "/" + window.location.pathname.split("/")[1]);

/**
 * location.href를 이용해서 화면 이동
 */
var changeHref = function (url, jsonObject) {
	console.log("changeHref(url, jsonObjec)");
//	console.log(url, jsonObject));
	if (jsonObject) {
		setSessionItem("hrefParams", jsonObject);
	}
	window.location.href = url;
};

/**
 * 파라미터 가져오기
 */
var getHrefParams = function () {
	console.log("getHrefParams()");
	var hrefParams = getSessionItem("hrefParams");
//	removeSessionItem("hrefParams");
	
	return hrefParams;
};

/**
 * 현재 html 경로 가져오기
 */
var getCurrentHtmlPath = function() {
	console.log("getCurrentHtmlPath()");
	
	var hrefSplitArr = window.location.href.split("/www/");
	 
	if ( hrefSplitArr.length > 1 ) 
		return hrefSplitArr[1];
	 
	else 
		return undefined;
	 
}

/**
 * 로그인 체크
 */
var authCheck = function () {
	console.log("authCheck()");
	var hrefArr = window.location.href.split("/auth/");
	var curHtml = hrefArr[hrefArr.length-1];

	if ( curHtml != "auth.html" ) {
		$.getJSON( rootPath + "/auth/loginInfo.do", function(result) {
			if (result.status == "success") {
				setSessionItem("loginInfo", result.data);

			} else {
				alert("사용자 인증 실패!");
				window.location.href = "../auth/auth.html";

			}
		});
	}
};
authCheck();

/**
 * 방 참여 여부
 */
var isRoomMbr = function( isRoomMbrTrue, isRoomMbrFalse ) {
	console.log("isRoomMbr()");
	$.getJSON( rootPath + "/room/isRoomMbr.do", function(result) {
		if (result.status == "success") {
//			console.log(result.data);
			setSessionItem("isRoomMbr", result.data);

			if (result.data === true) {
				isRoomMbrTrue();
        	} else {
        		isRoomMbrFalse();
        	}

		} else {
			alert("요청 처리중 오류 발생");
		}
	});
};


/**
 * 출발지 HttpSession에 등록
 * params (
 * 		x 			: 지도의 x좌표,
 * 		y 			: 지도의 y좌표,
 * 		locName	: 지명
 * 		prefix		: 앞에 수식될 문구
 * 		startSession_callback : 세션등록후 처리될 콜백 함수
 */
var setStartSession = function(x, y, locName, prefix, startSession_callback) {
	console.log("setSessionStart(x, y, locName, prefix, startSession_callback)");
//	console.log(x, y, locName, prefix, startSession_callback);

	if ( !prefix ) {
		prefix = "";
	}

	if ( locName && locName != null && locName.length > 0 ) {
		$.getJSON( rootPath + "/room/setLocationSession.do",{
			startName : locName,
			startX : x,
			startY : y,
			startPrefix :  prefix
		}, function(result) {
			startSession_callback();
		});

	} else {
	  	geocoder.geocode(
				{
			  		type: 1,
			  		isJibun: 1,
			  		x: x,
			  		y: y
				},
				"setStartSession_callback");
	  	setStartSession_callback = function(data) {
	  		console.log("setStartSession_callback(data)");
//	  		console.log(data);

			var geocoderResult = geocoder.parseGeocode(data);
			if(geocoderResult["count"] != "0") {
				var infoArr = geocoderResult["infoarr"];
				for(var i=0; i<infoArr.length; i++){
					$.getJSON( rootPath + "/room/setLocationSession.do",{
						startName : infoArr[i].address,
						startX : infoArr[i].x,
						startY : infoArr[i].y,
						startPrefix :  prefix
					}, function(result) {
						startSession_callback();
					});
				}
			}
		};

	}
};

/**
 * 목적지 HttpSession에 등록
 * params (
 * 		x 			: 지도의 x좌표,
 * 		y 			: 지도의 y좌표,
 * 		locName	: 지명
 * 		prefix		: 앞에 수식될 문구
 * 		endSession_callback : 세션등록후 처리될 콜백 함수
 */
var setEndSession = function(x, y, locName, prefix, endSession_callback) {
	console.log("setEndSession(x, y, locName, prefix, startSession_callback)");
//	console.log(x, y, locName, prefix, startSession_callback);

	if ( !prefix ) {
		prefix = "";
	}

	if ( locName && locName != null && locName.length > 0 ) {
		$.getJSON( rootPath + "/room/setLocationSession.do",{
			endName : locName,
			endX : x,
			endY : y,
			endPrefix :  prefix
		}, function(result) {
			endSession_callback();
		});

	} else {
	  	geocoder.geocode(
				{
			  		type: 1,
			  		isJibun: 1,
			  		x: x,
			  		y: y
				},
				"setEndSession_callback");
	  	setEndSession_callback = function(data) {
	  		console.log("setEndSession_callback(data)");
//	  		console.log(data);

			var geocoderResult = geocoder.parseGeocode(data);
			if(geocoderResult["count"] != "0") {
				var infoArr = geocoderResult["infoarr"];
				for(var i=0; i<infoArr.length; i++){
					$.getJSON( rootPath + "/room/setLocationSession.do",{
						endName : infoArr[i].address,
						endX : infoArr[i].x,
						endY : infoArr[i].y,
						endPrefix :  prefix
					}, function(result) {
						endSession_callback();
					});
				}
			}
		};

	}
};


/**
 * 거리에 따라 보여지는 형식 변경
 * 1000m 이하: m
 * 1000m 이상: km
 */
var changeDistanceUnit = function(distance) {
	if ( distance < 1000 ) {
		return distance + "m";
	} else {
		distance = distance  / 10.0;
		distance = Math.round(distance) / 100;
		return distance.toString() + "km";
	}
};

/**
 * 택시요금 계산
 */
var calcTaxiFare = function(distance) {

	var distanceFare = (distance / 142) * 100;

	var durationFare =
			Math.round(((
				(Math.round(distance) * 60) - 540) / 35) * 100) / 2;

	var totalFare = Math.round(distanceFare + 3000);
	totalFare = totalFare.toString().substr(
										0, totalFare.toString().length -2).concat("00원");

	return totalFare;
} ;

/**
 * 푸쉬 관련 객체
 */
var push = {
	registerAction: undefined,
	roomNo: undefined,

	// initialise
    initialise: function(registerAction, roomNo) {
    	console.log("push.initialise(registerAction, roomNo)");
//    	console.log(registerAction, roomNo);
    	
    	if ( registerAction && registerAction != null )
    		this.registerAction = registerAction;
    	else 
    		this.registerAction = undefined;
    	
    	if ( roomNo && roomNo != null )
    		this.roomNo = roomNo;
    	else
    		this.roomNo = undefined;

    	
    	var pushNotification = window.plugins.pushNotification;
    	pushNotification.register( 
							this.successHandler, 
							this.errorHandler, 
							{
								"senderID": "1058995885601",
								"ecb": "push.onNotificationGCM"
							});
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	console.log("push.receivedEvent(id)");
//    	console.log(id); 
    },

    // result contains any message sent from the plugin call
    successHandler: function(result) {
        console.log("push.successHandler(result)");
//        console.log(result);
    },

    // error 
    errorHandler: function(error) {
        console.log("push.errorHandler(error)");
//        console.log(error);
    },

    // onnotificationGCM callback
    onNotificationGCM: function(e) {
    	console.log("push.onNotificationGCM(e)");
    	console.log(JSON.stringify(e));
    	
        switch( e.event ) {
            case 'registered': {
            	console.log("push.onNotificationGCM() registered...");
            	
        		var regId = e.regid;
        		
	            if ( this.registerAction && this.registerAction == "joinRoom" 
	            		&& regId.length > 0 && this.roomNo != undefined ) {
	            	joinRoom(regId, this.roomNo);
		                
	            } else if ( this.registerAction && this.registerAction == "addRoom" 
	            		&& regId.length > 0 ) {
	            	addRoom(regId);
		            	
	            }
            	break;
            }
            
            case 'message': {
            	console.log("push.onNotificationGCM() message...");
            	console.log(JSON.stringify(e));
            	
            	// if this flag is set, this notification happened while we were in the foreground.
            	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
            	
            	if (e.foreground) {
            		if ( e.payload && e.payload.className == "FeedRunnable" ) { // 피드 등록 푸쉬 
            			console.log("push.onNotificationGCM() message.FeedRunnable...");
            			
            			if ( getCurrentHtmlPath() == "room/room.html") {
            				getFeedList( e.payload.roomNo )
            			}
            			
            			if (e.payload.feedAction && e.payload.feedAction == "addFeed") {
	            			notification.vibrate(500);
		            		notification.beep(1);
		            		
//		            		Toast.shortshow(e.message);
            			}
	            		
            		} else if ( e.payload && e.payload.className == "RoomRunnable" ) { // 방 푸쉬
            			console.log("push.onNotificationGCM() message.RoomRunnable...");
            			
            			if ( getCurrentHtmlPath() == "room/room.html") {
            				getRoomInfo( e.payload.roomNo ); 
            			}
            			
            			notification.vibrate(500);
	            		notification.beep(1);
	            		
	            		Toast.shortshow(e.message);
            			
            		} else if ( e.payload && e.payload.className == "StartAlramRunnable" ) { // 출발 알림 푸쉬
            			console.log("push.onNotificationGCM() message.StartAlramRunnable...");
            			
            			notification.vibrate(500);
	            		notification.beep(1);
	            		
            			Toast.shortshow(e.message);
            			
            		}
            		
    				
    			} else {	// otherwise we were launched because the user touched a notification in the notification tray.
    				if (e.coldstart) {
    					console.log('2--COLDSTART NOTIFICATION--');
    					
    				} else {
    					console.log('3--BACKGROUND NOTIFICATION--');
    					
    				}
    			}
            	console.log(JSON.stringify(e));
            	console.log('4--MESSAGE -> MSG  :: ' + e.payload.message);
            	console.log('4--MESSAGE -> MSGCNT  :: ' + e.payload.msgcnt);
    			
	            break;
            }
            
            case 'error': {
            	console.log("push.onNotificationGCM() message...");
//            	console.log(e.msg);
            	
    			break;
            }
            
            default: {
    			break;
            }
        }
    }
};





/**
 * swipe up & down
 */
(function() {
    var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})();
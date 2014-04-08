console.log("commonjs...");

//var rootPath = "http://buru1020.cafe24.com/taxi";	//호스팅
//var rootPath = "http://localhost:9999/taxi";		//로컬
//var rootPath = "http://192.168.10.83:9999/taxi";	//상헌
var rootPath = "http://192.168.43.65:9999/taxi";		//종혁
//var rootPath = "http://192.168.10.59:9999/taxi";	//태경
var contentWidth;
var contentHeight;

var myInfo;

var roomColorArr = ['#DF0101', '#61210B', '#FF4000', '#FE9A2E', '#F7FE2E', 
                    '#80FF00', '#21610B', '#04B4AE', '#00FFFF', '#013ADF', 
                    '#642EFE', '#4B088A', '#8904B1', '#FE2E9A'];

/**
 * 설  명: ajax 로딩이미지 초기설정
 * 작성자: 김상헌
 */
var initAjaxLoading = function() {
	console.log("initAjaxLoading()");
	
	$( document ).ajaxStart( showLoadingImg() );
	$( document ).ajaxStop( hideLoadingImg() );
};

/**
 * 설  명: 로딩이미지 보이기
 * 작상자: 김상헌
 */
var showLoadingImg = function() {
	console.log("showLoadingImg()");
	
	$.mobile.loading("show",{
		text: "",
		textVisible: false,
		theme: "b",
		textonly: false,
		html: ""
	});
};

/**
 * 설  명: 로딩이미지 숨기기
 * 작성자: 김상헌
 */
var hideLoadingImg = function() {
	console.log("hideLoadingImg()");
	
	$.mobile.loading("hide");
};


/**
 * 설  명: sessionStorage 에 값 설정하기
 * 작성자: 김상헌
 * param:
 * 		key 	: SessionStorage에 저장할 key값
 * 		value 	: 저장 할 Json객체
 */
var setSessionItem = function (key, value) {
	console.log("setSessionItem(key, value)");
//	console.log(key, value);
	sessionStorage.setItem(key, JSON.stringify(value));
};


/**
 * 설  명: sessoinStorage 값 가져오기
 * 작성자: 김상헌
 * param:
 * 		key 	: SessionStorage에 저장 한 key값
 */
var getSessionItem = function (key) {
	console.log("getSessionItem(key)");
//	console.log(key);
	return JSON.parse(sessionStorage.getItem(key));
};


/**
 * 설  명: sesisonStorage 에서 아이템 제거
 * 작성자: 김상헌
 * param:
 * 		key 	: SessionStorage에 저장 한 key값
 */
var removeSessionItem = function (key) {
	console.log("removeSessionItem(key)");
	sessionStorage.removeItem(key);
};


/**
 * 설  명: sessionStorage 에 등록된것 전부 지우기
 * 작성자: 김상헌
 */
var clearSession = function () {
	console.log("clearSession()");
	sessionStorage.clear();
};
setSessionItem("rootPath", "/" + window.location.pathname.split("/")[1]);


/**
 * 설  명: 파라미터 가져오기
 * 작성자: 김상헌
 * 
 */
var getHrefParams = function () {
	console.log("getHrefParams()");
	var hrefParams = getSessionItem("hrefParams");
//	removeSessionItem("hrefParams");
	
	return hrefParams;
};

/**
 * 설  명: 현재 html 경로 가져오기
 * 작성자: 김상헌
 */
var getCurrentHtmlPath = function() {
	console.log("getCurrentHtmlPath()");
	
	var hrefSplitArr = window.location.href.split("/www/");
	 
	if ( hrefSplitArr.length > 1 ) 
		return hrefSplitArr[1];
	 
	else 
		return undefined;
	 
};

/**
 * 설  명: LocalStorage 에 값 설정하기
 * 작성자: 김상헌
 * param:
 * 		key 	: SessionStorage에 저장할 key값
 * 		value 	: 저장 할 Json객체
 */
var setLocalItem = function (key, value) {
	console.log("setLocalItem(key, value)");
//	console.log(key, value);
	if ( value ) {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		localStorage.setItem(key, null);
	}
};


/**
 * 설  명: LocalStorage 값 가져오기
 * 작성자: 김상헌
 * param:
 * 		key 	: SessionStorage에 저장 한 key값
 */
var getLocalItem = function (key) {
	console.log("getLocalItem(key)");
//	console.log(key);
	var item = localStorage.getItem(key);
	if ( item ) {
		return JSON.parse(item);
	} else {
		return null;
	}
};


/**
 * 설  명: LocalStorage 에서 아이템 제거
 * 작성자: 김상헌
 * param:
 * 		key 	: SessionStorage에 저장 한 key값
 */
var removeLocalItem = function (key) {
	console.log("removeLocalItem(key)");
	localStorage.removeItem(key);
};


/**
 * 설  명: LocalStorage 에 등록된것 전부 지우기
 * 작성자: 김상헌
 */
var clearLocal = function () {
	console.log("clearLocal()");
	localStorage.clear();
};


/**
 * 설  명: location.href를 이용해서 화면 이동
 * 작성자: 김상헌
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
 * 설  명: LocalStorage 에 있는 myInfo 객체 가져오기
 * 작성자: 김상헌
 */
var getMyInfo = function() {
	console.log("getMyInfo()");
	
	var hrefArr = window.location.href.split("/auth/");
	var curHtml = hrefArr[hrefArr.length-1];

	if ( curHtml != "auth.html" ) {
		myInfo = getLocalItem("myInfo");
	}
}();


/**
 * 설  명: SessionStorage에 myRoom 조회 후 세팅
 * 작성자: 김상헌
 */
var searchMyRoom = function(callbackFunc) {
	console.log("searchMyRoom(callbackFunc)");
//	console.log(callbackFunc);
	
	myInfo = getLocalItem("myInfo");
	var params = {
		mbrNo : myInfo.mbrNo
	};
	
	$.getJSON( rootPath + "/room/getMyRoom.do"
			, params
			, function(result) {
				if (result.status == "success") {
					var myRoom = result.data;
					if ( myRoom && myRoom.roomNo && myRoom.roomNo != 0 ) {
						setSessionItem("myRoom", myRoom);
						
					} else {
						setSessionItem("myRoom", null);
						
					}
					
				} else {
					showAlertToast("요청 처리중 오류 발생");
				}
				
				callbackFunc();
	});
};


/**
 * 설  명: 방 참여 여부
 * 작성자: 김상헌
 */
var isRoomMbr = function() {
	console.log("isRoomMbr()");
	
	var myRoom = getSessionItem("myRoom");
	
	if ( myRoom && myRoom.roomNo )
		return true;
	else
		return false;
	
};

/**
 * 설  명: 참여하는 방 정보 SessionStorage 에 설정
 * 작성자: 김상헌
 */
var setMyRoom = function( myRoom ) {
	console.log("setMyRoom(myRoom)");
//	console.log(myRoom);
	
	setSessionItem("myRoom", myRoom);
	
};


/**
 * 설  명: 출발지 SessionStorage에 저장
 * 작성자: 김상헌
 * param: 
 * 		x 			: 지도의 x좌표,
 * 		y 			: 지도의 y좌표,
 * 		locName		: 지명
 * 		prefix		: 앞에 수식될 문구
 * 		callbackFunc : 세션등록후 처리될 콜백 함수
 */
var setStartLocationSession = function(x, y, locName, prefix, callbackFunc) {
	console.log("setSessionStart(x, y, locName, prefix, callbackFunc)");
//	console.log(x, y, locName, prefix, callbackFunc);

	if ( !prefix ) {
		prefix = "";
	}
	
	var startSession = {
		startName	: locName,
		startX 		: x,
		startY 		: y,
		startPrefix 	:  prefix
	};

	if ( locName && locName != null && locName.length > 0 ) {
		var locationSession = mergeLocationSession(startSession);
		setSessionItem("locationSession", locationSession);
		
		callbackFunc();
		
	} else {
		// 맵api에서 주소 조회
	  	geocoder.geocode(
				{
			  		type 	: 1,
			  		isJibun : 1,
			  		x 		: x,
			  		y 		: y
				},
				"setStartLocationSession_callback");
	  	setStartLocationSession_callback = function(data) {
	  		console.log("setStartLocationSession_callback(data)");
//	  		console.log(data);

			var geocoderResult = geocoder.parseGeocode(data);
			if ( geocoderResult && parseInt(geocoderResult["count"]) > 0 ) {
				var infoArr = geocoderResult["infoarr"];
				startSession.startName 	= infoArr[0].address;
				startSession.startX		= infoArr[0].x;
				startSession.startY 	= infoArr[0].y;
				
				var locationSession = mergeLocationSession(startSession);
				setSessionItem("locationSession", locationSession);
				
				callbackFunc();
			}
		};
	}
};

/**
 * 설  명: 목적지 SessionStorage에 저장
 * 작성자: 김상헌
 * param:
 * 		x 			: 지도의 x좌표,
 * 		y 			: 지도의 y좌표,
 * 		locName		: 지명
 * 		prefix		: 앞에 수식될 문구
 * 		callbackFunc : 세션등록후 처리될 콜백 함수
 */
var setEndLocationSession = function(x, y, locName, prefix, callbackFunc) {
	console.log("setEndLocationSession(x, y, locName, prefix, callbackFunc)");
//	console.log(x, y, locName, prefix, callbackFunc);

	if ( !prefix ) {
		prefix = "";
	}
	
	var endSession = {
		endName : locName,
		endX 	: x,
		endY 	: y,
		endPrefix :  prefix	
	};
	
	if ( locName && locName != null && locName.length > 0 ) {
		var locationSession = mergeLocationSession(endSession);
		setSessionItem("locationSession", locationSession);
		
		callbackFunc();

	} else {
	  	geocoder.geocode(
				{
			  		type 	: 1,
			  		isJibun : 1,
			  		x 		: x,
			  		y 		: y
				},
				"setEndLocationSession_callback");
	  	setEndLocationSession_callback = function(data) {
	  		console.log("setEndLocationSession_callback(data)");
//	  		console.log(data);

			var geocoderResult = geocoder.parseGeocode(data);
			if ( geocoderResult && parseInt(geocoderResult["count"]) > 0 ) {
				var infoArr = geocoderResult["infoarr"];
				endSession.endName = infoArr[0].address;
				endSession.endX = infoArr[0].x;
				endSession.endY = infoArr[0].y;
			
				var locationSession = mergeLocationSession(endSession);
				setSessionItem("locationSession", locationSession);
				
				callbackFunc();
			}
		};

	}
};


/**
 * 설  명: locationSession 객체 머징
 * 작성자: 김상헌
 */
var mergeLocationSession = function( startEndSession ) {
	console.log("mergeLocationSession(startEndSession)");
//	console.log(startEndSession);
	
	var locationSession = getSessionItem("locationSession");
	
	if ( !locationSession || locationSession == null ) {
		locationSession = {};
	}
	
	$.extend(true, locationSession, startEndSession);
	
	return locationSession;
};


/**
 * 설  명: 거리에 따라 보여지는 형식 변경
 * 		1000m 이하: m
 * 		1000m 이상: km
 * 작성자: 김상헌
 */
var changeDistanceUnit = function(distance) {
	console.log("changeDistanceUnit(distance)");
//	console.log(distance);
	
	if ( distance < 1000 ) {
		return distance + "m";
	} else {
		distance = distance  / 10.0;
		distance = Math.round(distance) / 100;
		return distance.toString() + "km";
	}
};

/**
 * 설  명: 택시요금 계산
 * 작성자: 김상헌
 */
var calcTaxiFare = function(distance) {
	console.log("calcTaxiFare(distance)");
//	console.log(distance);

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
 * 설  명: 푸쉬 관련 객체
 * 작성자: 김상헌
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
    	//console.log(JSON.stringify(e));
    	
    	setSessionItem("pushThis",this);
    	setSessionItem("pushRoomNo",this.roomNo);
    	setSessionItem("pushEvent",e);
    	
    	setTimeout(function(){
    	
       var e = getSessionItem("pushEvent");
       var that = getSessionItem("pushThis");
     
        switch( e.event ) {
            case 'registered': {
            	console.log("push.onNotificationGCM() registered...");
            	
        		var regId = e.regid;
        		
	            if ( that.registerAction && that.registerAction == "joinRoom" 
	            		&& regId.length > 0 && that.roomNo != undefined ) {
	            	joinRoom(regId, getSessionItem("pushRoomNo"));
		                
	            } else if ( that.registerAction && that.registerAction == "addRoom" 
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
            				getAndSetFeedList( e.payload.roomNo )
            			}
            			
            			if (e.payload.feedAction && e.payload.feedAction == "addFeed") {
	            			notification.vibrate(500);
		            		notification.beep(1);
            			}
            			
            			if (e.payload.feedAction && e.payload.feedAction == "deleteFeed") {
	            			getAndSetFeedList( e.payload.roomNo )
            			}
	            		
            		} else if ( e.payload && e.payload.className == "RoomRunnable" ) { // 방 푸쉬
            			console.log("push.onNotificationGCM() message.RoomRunnable...");
            			
            			if ( getCurrentHtmlPath() == "room/room.html") {
            				getAndSetRoomInfo( e.payload.roomNo ); 
            			}
            			
            			notification.vibrate(500);
	            		notification.beep(1);
	            		
	            		showAlertToast(e.message);
            			
            		} else if ( e.payload && e.payload.className == "StartAlramRunnable" ) { // 출발 알림 푸쉬
            			console.log("push.onNotificationGCM() message.StartAlramRunnable...");
            			
            			notification.vibrate(500);
	            		notification.beep(1);
	            		
	            		showAlertToast(e.message);
            			
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
        
       removeSessionItem("pushRoomNo");
       removeSessionItem("pushEvent");
       removeSessionItem("pushThis");
        
    	},400);
    	
    }
    
    
};


/**
 * 설  명: 밤투명 검은 배경 보이고 안보이게 하기
 * 작성자: 김상헌
 */
var showhideBlackBackground = function(visibleCommand) {
	console.log("showhideBlackBackground(visibleCommand)");
//	console.log(visibleCommand);
	
	if ( $(".divBlackBackground")[0] ) {
		if ( visibleCommand == "show" ) {
			$(".divBlackBackground").show();
			
		} else {
			$(".divBlackBackground").hide();
			
		}
	} else {
		var divBackgound = $("<div>")
	    		.addClass("divBlackBackground")
			    .css("width"		, (contentWidth + 2) + "px")
			    .css("height"		, contentHeight + "px")
			    .css("background"	, "black")
			    .css("z-index"		, "1099")
			    .css("left"			, "-1px")
			    .css("top"			, "0")
			    .css("position"		, "absolute")
			    .css("opacity"		, "0.5")
			    .css("visibility"	, "visible")
			    .on({
//					touchend:function(){
					click: function(){
						$(".ui-popup").popup("close");
				    	$("#leftPanel").panel("close");
				    	showhideBlackBackground("hide");
					},
					swipeleft: function() {
						$("#leftPanel").panel("close");
						showhideBlackBackground("hide");
					}
				});
		$("div[data-role=page]").append( divBackgound );
		/*////////////////////////////////////////////
		// 팝업 띄울때 검은색 반투명 배경 편법으로 방화면에도 적용시키는 방법.
		// But. 팝없이 뜬상태에서 클릭을 두번해야지 검은 배경이 없어지는 현상이 생겨서 적용 안함.
		// Jquerymobile 새로운 버전으로 업데이트 하면 이런 현상은 data-overlay-theme="a" 속성 추가하면 해결됨.
		// 그렇지만 버전을 업데이트 하면 UI가 전반적으로 깨지기 때문에 추후에 시간이 나면 업데이트 하는 것으로 함.
		
		if ( $("header[data-role=header]")[0] ) {
			$("header[data-role=header]").append( divBackgound );
		} else {
			$("section[data-role=content]").append( divBackgound );
		}
		////////////////////////////////////////////*/
	}
};


/**
 * 설  명: 메시지 보이기 (웹이면 alert, 안드로이드면 Toast로 메시지 출력)
 * 작성자: 김상헌
 */
var showAlertToast = function( message ) {
	console.log("showAlertToast(message)");
//	console.log(message);

	if ( window['Toast'] != undefined ) {
		Toast.shortshow( message );
		
	} else {
		alert(message);
		
	}
	
};



/**
 * 설  명: swipe up & down
 * 작성자: 김상헌
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



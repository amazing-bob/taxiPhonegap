console.log("locationjs..."); 
  
var map; 
var myScroll; 
  
var query; 
var page = 0; 
var locations = []; 
var markers = []; 
var zIdx = 0; 
  
var contentWidth; 
var contentHeight; 
  
var defaultMarkerImg = "../images/common/marker/location_marker_off.png"; 
var selectedMarkerImg = "../images/common/marker/location_marker_on.png"; 
  
  
$(document).ready(function() { 
	initAjaxLoading();
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
    contentWidth = $("#contentLocation").outerWidth(); 
      
    $("#divSearchInput").css("width", contentWidth + "px"); 
    var glassWidth = $("#magnifyingGlass").outerHeight();  
    var searchInputWidth = contentWidth - 30 - 30 - 12; 
    $("#searchInput").css("width", searchInputWidth + "px"); 
      
      
    var params = getHrefParams(); 
    query = params.query; 
    
    initMap(function() {
        searchLocation(query, page); 
    }); 
      
    $("#searchInput").val(query); 
      
    $("#searchInput").bind("keypress", function(e) { 
        if (e.keyCode == 13) { 
            searchAgain(this); 
        } 
    }); 
    $("#searchInput").on("input", function(e) { 
        if ( $("#searchInput").val() == "" ) { 
            $("#aSearchClear").css("visibility", "hidden"); 
        } else { 
            $("#aSearchClear").css("visibility", "visible"); 
        } 
    }); 
    $("#searchInput").on("click", function(event) {
        event.stopPropagation(); 
        this.select(); 
        
        return false;
    }); 
      
    $("#aSearchClear").on("click", function(event) {
        event.stopPropagation(); 
        $("#searchInput").val(""); 
        $("#aSearchClear").css("visibility", "hidden");
        
        return false;
    }); 
      
      
}); 

/**
 * deviceready 이벤트
 */
var onDeviceReady = function() {
	console.log("onDeviceReady()");

	push.initialise();
	
	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);	
};

/**
 * 설  명: 위치 목록 iScroll 로딩 될 때 처리 - 위치 목록 더 가져오기, 마커위치 지정
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
			
			if ( page < 5 && this.maxScrollX > this.x ) { 
                searchLocation(query, ++page); 
                  
            } else { 
                var currPageX = this.currPageX; 
                  
                hideMarkers(markers); 
                markers[currPageX].setZIndex(++zIdx); 
                markers[currPageX].getIcon().url = selectedMarkerImg; 
                showMarkers(markers); 
  
                map.moveTo(markers[currPageX].position, 10);
            } 
        } 
    }); 
};
  
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); 
  
document.addEventListener('DOMContentLoaded', loadedMyScroll, false); 
  
document.addEventListener("deviceready", function() {
	document.addEventListener("backbutton", yourCallbackFunction, false);	
}, false);


var yourCallbackFunction = function() {
	changeHref("../home/home.html");
};

var searchAgain = function( target ) { 
    var tmpQuery = $.trim( $(target).val() ); 
    if ( tmpQuery && tmpQuery != "" ) { 
        query  = tmpQuery; 
        changeHref( "location.html", { query : query }); 
    } 
}; 


/**
 * 설  명: 위치정보 olleh API에서 조회하기
 * 작성자: 김상헌
 */
var searchLocation = function(query, page) { 
    console.log("searchLocation(query, page)"); 
//    console.log(query, page);
    
    var params = { 
            query 		: encodeURI(query), 
            places 		: 8, 
            addrs 		: 8, 
            sr 			: "RANK",   //DIS:거리순, RANK:정확도순, MATCH:일치 
            p 			: page, 
            timestamp 	: 1317949634794 
        }; 
      
    $.getJSON( rootPath + "/map/ollehMapApi.do",  
            {
                url : "http://openapi.kt.com/maps/search/localSearch", 
                params : JSON.stringify( params ) 
            },  
            function(result) {
                if ( result.status == "success" ) {
                	console.log(result.data)
                	
                    var resultData =  JSON.parse(result.data); 
                    var tmpLocations = [];
	                var resdata =resultData.payload; 
                    if(resdata==undefined){
                    	searchLocation(query, page);
                    }else{
	                    tmpLocations = resultData.payload.RESULTDATA.place.Data; 
	                    if (tmpLocations && tmpLocations.length > 0) { 
	                        var locationLen = locations.length; 
	                        for( var i = 0 ; i < tmpLocations.length; i++ ) { 
	                            locations[locationLen + i] = tmpLocations[i]; 
	                        } 
	                          
	                        var tmpMarkers = setMarkers(tmpLocations); 
	                        var markerLen = markers.length; 
	                        for( var i = 0 ; i < tmpMarkers.length; i++ ) { 
	                            markers[markerLen + i] = tmpMarkers[i]; 
	                        } 
	                    }
                    }
                    createLocationList(locations, page); 
                } 
            }); 
}; 


/**
 * 설  명: 검색된 위치 화면에 만들기
 * 작성자: 김상헌
 */
var createLocationList = function(locations, page) { 
    console.log("createLocationList()"); 
      
    if ( !myScroll ) { 
        loadedMyScroll(); 
    } 
      
    $("#ulLocationList").children().remove(); 
    $("#scroller").css("width", 0+"px"); 
      
    if ( locations && locations.length > 0 ) { 
        for(var i in locations) { 
            $("<li>") 
                .addClass("liLocationList") 
                .attr("id","liLocationList" + i).css("left",(contentWidth * i) + "px") 
                .css("width", contentWidth) 
                .append( 
                        $("<a>") 
                            .addClass("divFavoriteIcon") 
                            .attr("data-idx",i) 
                            .append(  
                                    $("<img>") 
                                        .attr("src", "../images/common/favorite-non-icon.png") 
                                        .attr("href","#") 
                                        .attr("data-status","false") ) 
                            .on("touchend click", function(event) { 
                            	// touchend click 과 같이 써줘야 하는 부분 burutouch 만들면 사라질 부분 
                            	if ( window["device"] != undefined ) {
                            		if ( event.originalEvent.type && event.originalEvent.type == "click" ) {
                            			return false;
                            		}
                            	}
                            	// touchend click 과 같이 써줘야 하는 부분 burutouch 만들면 사라질 부분 
                        		event.stopPropagation(); 
                    			var liIdx = $(this).attr("data-idx"); 
                    			addAndDelFavoriteLocation(liIdx, locations);	
                            }) ) 
                .append( 
                        $("<div>") 
                            .addClass("locationNameAndAddress") 
                            .append( 
                                    $("<legend>") 
                                        .addClass("locationName") 
                                        .text( locations[i].NAME )) 
                                        .append(
                                                $("<p>") 
                                                    .addClass("locationAddress") 
                                                    .text(locations[i].ADDR) ) )
                .append( 
                        $("<div>") 
                            .addClass("locationStartAndEnd") 
                            .attr("data-idx",i) 
                            .append( 
                                    $("<a>") 
                                        .addClass("locationStart") 
                                        .attr("href","#") 
                                        .append( $("<span>").text("출발") ) 
                                        .on("click", function(event) {
                                            event.stopPropagation(); 
                                            var liIdx =  $(this).parents(".locationStartAndEnd").attr("data-idx"); 
                                            setStartLocationSession( 
                                                    locations[liIdx].X,  
                                                    locations[liIdx].Y,  
                                                    locations[liIdx].NAME,  
                                                    "", 
                                                    function() { 
                                                        changeHref("../home/home.html"); 
                                                    } );
                                            
                                            return false;
                                        }) )  
                            .append( 
                                    $("<a>") 
                                        .addClass("locationEnd") 
                                        .attr("href","#") 
                                        .append( $("<span>").text("도착") ) 
                                        .on("click", function(event) {
                                            event.stopPropagation(); 
                                            var liIdx =  $(this).parents(".locationStartAndEnd").attr("data-idx"); 
                                            setEndLocationSession( 
                                                    locations[liIdx].X,  
                                                    locations[liIdx].Y,  
                                                    locations[liIdx].NAME,  
                                                    "", 
                                                    function() { 
                                                        changeHref("../home/home.html"); 
                                                    } );
                                            
                                            return false;
                                        }) ) ) 
            .appendTo($("#ulLocationList")); 
              
            $("#scroller").css("width", parseInt($("#scroller").css("width")) + contentWidth + "px"); 
        } 
          
        myScroll.refresh(); 
        
        // 페이지 마지막이면 가져온 후 자동으로 다음페이지 이동 처리
        var currPageX = myScroll.currPageX; 
        if ( currPageX != 0 ) { 
            myScroll.scrollToPage( ++currPageX, 1, 1000 ); 
        }
        
        if ( currPageX % 8 == 0 ) { 
            markers[currPageX].setZIndex(++zIdx); 
            hideMarkers(markers); 
            markers[currPageX].getIcon().url = selectedMarkerImg; 
            showMarkers(markers); 
            map.moveTo(markers[currPageX].position, 10); 
        } 
          
        // WebDB 에서 즐겨찾기 목록 가져와서 별 표시 
        selectMyFvrtLocList(
        		myInfo.mbrNo, 
        		// Callback
        		function(favoriteLocationList) {
		            for(var i in favoriteLocationList) { 
		                for(var j in locations ) { 
		                    if (favoriteLocationList[i].fvrtLocLat == locations[j].Y &  
		                            favoriteLocationList[i].fvrtLocLng == locations[j].X &  
		                            favoriteLocationList[i].fvrtLocName == locations[j].NAME) { 
		                        $(".divFavoriteIcon[data-idx=" + j + "] img") 
		                            .attr( 'src', '../images/common/favorite-icon.png') 
		                            .attr("data-status","true"); 
		                    } 
		                      
		                } 
		            } 
		        }); 
        myScroll.enable();
          
    } else { 
    	$("<li>")
			.width(contentWidth +"px")
			.append(
					$("<div>")
					.addClass("divMsgArea")
					.append(
							$("<h1>")
								.text( "검색 결과가 없습니다." ) ) )
			.appendTo( $("#ulLocationList") );
	
		$("#scroller").css("width", parseInt($("#scroller").css("width")) + contentWidth + "px");
		myScroll.disable(); 
          
    } 
  
}; 
  
/**
 * 설  명: 즐겨찾기 추가 & 삭제하기
 * 작성자: 김상헌
 */
var addAndDelFavoriteLocation = function(idx, locations) { 
    console.log("addAndDelFavoriteLocation(idx, locations)"); 
//    console.log(idx, location); 

    // WebDB 에서 즐겨찾기 목록 가져오기
    selectMyFvrtLocList(
    		myInfo.mbrNo,
    		// Callback
    		function( favoriteLocationList ) {
		        if($(".divFavoriteIcon[data-idx=" + idx + "] img").attr("data-status") == "false") { // 즐겨찾기 추가
		            $(".divFavoriteIcon[data-idx=" + idx + "] img").attr("data-status","true"); 
		            $(".divFavoriteIcon[data-idx=" + idx + "] img").attr('src', '../images/common/favorite-icon.png'); 
		            
		            var isFavoriteLocation = false; 
		            
		            // 즐겨찾기 되어 있는것 표시
		            for ( var i in favoriteLocationList) {
		                if ((favoriteLocationList[i].fvrtLocLat == locations[idx].Y &  
		                        favoriteLocationList[i].fvrtLocLng == locations[idx].X &  
		                        favoriteLocationList[i].fvrtLocName == locations[idx].NAME)) { 
		                    isFavoriteLocation = true; 
		                } else { 
		                      
		                }  
		            } 
		              
		            if (isFavoriteLocation == false) { 
		            	var params = { 
		            			mbrNo 		: myInfo.mbrNo,
		            			fvrtLocName : locations[idx].NAME, 
		                        fvrtLocLng  : locations[idx].X, 
		                        fvrtLocLat  : locations[idx].Y
		            	};
		                $.post( rootPath + "/location/addFavoriteLocation.do"
		                		, params
		                        , function(result) {
		                            if (result.status == "success") {
		                            	var fvrtLocList = result.data;
		                            	if (fvrtLocList) {
		                            		// WebDB 에 적용
		                            		executeQuery(
		            								// Transaction Execute
		            								function(transaction) {
		            									deleteAllFvrtLocTable(transaction);
		            									insertFvrtLocTable(transaction, fvrtLocList);
		            								},
		            								// Success Callback
		            								function() {});
		                            	}
		                            } else { 
		                            	showAlertToast(result.data); 
		                            } 
		                        }, "json"); 
		            } 
		              
		        } else { // 즐겨찾기 해제
		            $(".divFavoriteIcon[data-idx=" + idx + "] img").attr("data-status","false"); 
		            $(".divFavoriteIcon[data-idx=" + idx + "] img").attr('src', '../images/common/favorite-non-icon.png');
		            
		            for (var i in favoriteLocationList){ 
		                if (favoriteLocationList[i].fvrtLocLat == locations[idx].Y &  
		                        favoriteLocationList[i].fvrtLocLng == locations[idx].X &  
		                        favoriteLocationList[i].fvrtLocName == locations[idx].NAME) { 
		                	var fvrtLocNo = favoriteLocationList[i].fvrtLocNo;
		                    var url = rootPath + "/location/deleteFavoriteLocation.do"; 
		                    $.post(url 
		                            ,{ 
		                                fvrtLocNo : fvrtLocNo 
		                            }, function(result) { 
		                                if (result.status == "success") { 
		                                	// WebDB 에 적용
		                                	deleteFvrtLocTable(myInfo.mbrNo, fvrtLocNo);
		                                	
		                                } else { 
		                                	showAlertToast("즐겨찾기 삭제중 오류 발생!!"); 
		                                    
		                                } 
		                            }, "json"); 
		                } 
		            } 
		        } 
		    }); 
}; 

  
var initMap = function(callbackFunc) { 
    console.log("initMap()"); 
    // 현재위치 가져오기 
    navigator.geolocation.getCurrentPosition(function(position) { 
        var curPoint = new olleh.maps.Point( position.coords.longitude, position.coords.latitude ); 
        var srcproj = new olleh.maps.Projection('WGS84'); 
        var destproj = new olleh.maps.Projection('UTM_K'); 
        olleh.maps.Projection.transform(curPoint, srcproj, destproj); 
          
        loadMap( new olleh.maps.Coord(curPoint.getX(), curPoint.getY()), 10 ); 
        callbackFunc(); 
          
          
        contentHeight = $(window).height(); 
        $("#contentLocation").css("height", contentHeight+"px"); 
        $("#divMapWrap").css("height", (contentHeight - 129)+"px"); 
          
        $('#searchInput').removeAttr("readonly"); 
    }); 
  
}; 
  
var loadMap = function (coord, zoom) { 
    console.log("loadMap(coord, zoom)"); 
      
    var mapOptions = {       
        center 			: coord, 
        zoom 			: zoom, 
        mapTypeId 		: olleh.maps.MapTypeId.BASEMAP, 
        mapTypeControl 	: false, 
        zIndex 			: 0 
    };  
      
    map = new olleh.maps.Map(document.getElementById("canvas_map"), mapOptions); 
}; 
  
var setMarkers = function(locations) { 
    console.log("setMarkers()"); 
    var tmpMarkers = []; 
    for (var i in locations) { 
        tmpMarkers[i] = new olleh.maps.Marker({ 
	                position 	: new olleh.maps.Coord(locations[i].X, locations[i].Y), 
	                map 		: map,   
	                icon 		: new olleh.maps.MarkerImage ( 	defaultMarkerImg,  
										                        new olleh.maps.Size(24, 45), 
										                        new olleh.maps.Pixel(0, 0), 
										                        new olleh.maps.Pixel(12, 40) ), 
	                title 		: locations[i].NAME,
        		}); 
        tmpMarkers[i].setZIndex(0); 
    } 
    return tmpMarkers; 
}; 
  
var hideMarkers = function(markers) { 
    console.log("hideMarkers(markers)"); 
    for (var i = 0; i < markers.length; i++) { 
        markers[i].getIcon().url = defaultMarkerImg; 
        markers[i].setMap(null); 
    } 
}; 
  
var showMarkers = function(markers) { 
    console.log("showMarkers(markers)"); 
    for (var i = 0; i < markers.length; i++) { 
        markers[i].setMap(map); 
    } 
}; 

/**
 * 뒤로가기 버튼 처리
 */
var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");
	if ( isRoomMbr() ) {
		var myRoom = getSessionItem("myRoom");
		
		if (  myRoom && myRoom.roomNo && myRoom.roomNo != 0) {
				changeHref("../room/room.html", { roomNo : myRoom.roomNo });
		}
	}else{
		changeHref("../home/home.html");
	}
};
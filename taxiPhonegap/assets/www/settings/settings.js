console.log("settings...");

var that = this;
var myInfo;

var fvrtLocNo;

$(document).ready(function() {
	
	myInfo = getSessionItem("myInfo");
	
	initAjaxLoading();
	
	document.addEventListener("deviceready", onDeviceReady, false);

	
	$("#seach").click(function() {
		startRangeChk();
		endRangeChk();
		 $("#startRange").find("input[type='radio']").bind("change", function(){
      });
	});
	
	
	$(".rangeSave").click(function() {
		addRange();
	});
	
	
	/*$.getJSON( rootPath + "/setting/getRange.do", function(result){
		if(result.status == "success") {
			var setting = result.data;
			$("#startRange1").val(setting.startRange);
			$("#endRange1").val(setting.endRange);
		}else{
			Toast.shortshow("실행중 오류발생!");
			console.log(result.data);
		}
	});*/

	$("#btnLogoutAccept").click(function(){
		logout();
	});
	$("#btnLogoutCancel").click(function() {
		$("#popupLogout").popup("close");
	});

	$("#btnRefresh").click(function() {
		$(".btnRefresh").attr("src", "../images/common/loading-update.gif");
		$("#btnRefresh").css("background","white");
		$(".btnRefresh").css("width","35px");
		$(".btnRefresh").css("height","35px");
		$(".btnRefresh").css("margin-left","3.5px");
		$(".btnRefresh").css("margin-top","-6px");
		$(".btnRefresh").css("border-radius","40px");
		frndRefresh();
	});
	
	
	
	/**
	 * 내용:회원탈퇴부분
	 * 작성자:김태경
	 */
	$("#btnLeave").click(function(){
		leaveMember();
	});
	$("#btnCancel").click(function(){
		console.log("close");
		$("#popupLeaveMember").popup("close");
	});
	$("#btnDeleteLocCancel").click(function() {
		$("#popupFvrtLoc").popup("close");
	});

	$("#btnChange").click(function(){
	   fvrtLocLists();
	});

	$("#btnDeleteLoc").click(function() {
		
		deleteFvrtLoc();
	});

	$("#btnList").click(function(){
		listFvrtLoc();
	});
	$("#btnFvrtLocUpdate").click(function(){
    	fvrtLocUpdate();
	});
	$(".save").click(function(){
		rankUpdate();
	});

	$(".content").hide();
	$("#btnList").show();
	$("#btnList").click(function () {
	$(".content").toggle("slide");
	});

	$(".contents").hide();
	$("#btnChange").show();
	$("#btnChange").click(function () {
	$(".contents").toggle("slide");
	});
	$.mobile.loadPage( "settings.html", { showLoadMsg: false } );

});//ready()

/*친구목록갱신 버튼*/
$( document ).on( "click", ".show-page-loading-msg", function() {
    $.mobile.loading( "show", {
            text: "친구목록 갱신중...",
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
    });
});

/**
 * deviceready 이벤트
 */
function onDeviceReady() {
	console.log("onDeviceReady()");

	push.initialise();

	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);

	try {
	    getLoginStatus();

    } catch (e) {
    	Toast.shortshow(e);
    }
}


/**
 * 내용:출발지 거리 반경 정보 localStorage 에서 얻어서 화면에 checked 로 그리기
 * 작성자:김태경
 */

function startRangeChk() {
	
	myInfo = getSessionItem("myInfo");

	if(myInfo.startRange == "500"){
		$("#radio-choice-h-2a").prop("checked", true);
	}else if(myInfo.startRange =="1000"){
		$("#radio-choice-h-2b").prop("checked", true);
	}else if(myInfo.startRange =="2000"){
		$("#radio-choice-h-2c").prop("checked", true);
	}else if(myInfo.startRange =="3000"){
		$("#radio-choice-h-2d").prop("checked", true);
	}
	
}


/**
 * 내용:도착지 거리 반경 정보 localStorage 에서 얻어서 화면에 checked 로 그리기
 * 작성자:김태경
 */
function endRangeChk() {

	if(myInfo.endRange == "500"){
		$("#radio-choice-h-3a").prop("checked", true);
	}else if(myInfo.endRange =="1000"){
		$("#radio-choice-h-3b").prop("checked", true);
	}else if(myInfo.endRange =="2000"){
		$("#radio-choice-h-3c").prop("checked", true);
	}else if(myInfo.endRange =="3000"){
		$("#radio-choice-h-3d").prop("checked", true);
	}
}


function frndRefresh() {
	console.log("frndRefresh()");
	getFacebookMyInfo(function(myInfo) {
		console.log(myInfo);
		$.ajax(rootPath + "/member/frndRefresh.do", {
    		type: "POST",
    		data: JSON.stringify( myInfo ),
    		dataType: "json",
    		contentType: "application/json",
    		success: function(result) {
    			if(result.status == "success") {
    				Toast.shortshow("친구목록이 갱신 되었습니다.");
//    				location.href = "../setting/settings.html";
    				$(".btnRefresh").attr("src", "../images/common/btn_refresh.png");
    				$(".btnRefresh").attr("style", "width:40px");
    				$(".btnRefresh").attr("style", "height:40px");
    				$(".btnRefresh").attr("style", "margin-top:-10px");

    				var d = new Date();
//    				var year = d. getFullYear().toString().substr(2, 2);
    				var year = d. getFullYear();
    				var month = d.getMonth();
    				var dates = d.getDate();
    				var time = d.toLocaleTimeString().slice(0, 5);
    				var ampm = null;

//    				if(time.slice(0, 2) < 12){
//    					ampm = "오전";
//    				} else {
//    					ampm = "오후";
//    				}
    				$("#frndUpdateDate").text(year + "." + month + "." + dates + " " + time);


    			} else {
    				Toast.shortshow("친구목록 갱신 실패");
    			}
    		}
    	});
	});
};


/**
 * 내용:해당 localStorage 객체 해당 하는 모든 db데이터삭제후 localStorage 삭제.
 * 작성자:김태경
 */
function leaveMember() {
	
	$.post(rootPath + "/member/leaveMember.do",
			myInfo,
			function(result) {
				if(result.status == "success") {
					
					removeSessionItem("myInfo");
					/*Toast.shortshow("탈퇴가 성공적으로 되었습니다.");*/
					alert("회원탈퇴 성공");
					changeHref("../auth/auth.html");
					console.log("처리됨");
//					facebookLogout();	//이 부분은 아직 나중에 처리 하고.
				} else {
					/*Toast.shortshow("실행중 오류발생!");*/
					
				}
			},
	"json");
};













/**
 * 내  용:즐겨찾기 서버디비 데이타 삭제 후 로컬디비 동기화.
 * 작성자:김태경
 */
function deleteFvrtLoc() {
	
	var params = {
			mbrNo 		: myInfo.mbrNo,
			fvrtLocNo 	: this.fvrtLocNo
	};
	$.getJSON( rootPath + "/location/deleteFavoritePlace.do"
			, params
			, function(result) {
				if(result.status == "success") {
					console.log(result.data);
					console.log(result);
					
					myInfo.fvrtLocList = result.data;
					
					if(myInfo.dbUpdateStatus == false){
						myInfo.dbUpdateStatus = true;
					}
					setSessionItem("myInfo",myInfo);
					
					$("#popupFvrtLoc").popup("close");
					fvrtLocLists();
				} else {
					/*Toast.shortshow("실행중 오류발생!");*/
					console.log(result.data);
				}
			});
}
/**
 * 내용:거리반경 정보 db update 및 localStorage 동기화
 * 작성자:김태경
 */
function addRange(){

	$.post(rootPath + "/setting/updateRange.do",
			{
		mbrNo : myInfo.mbrNo,
		startRange: $('input[name=radio-choice-h-2]:checked', '#updateRange').val(),
		endRange: $('input[name=radio-choice-h-2]:checked', '#updateRange1').val(),

			},
			function(result) {
				if(result.status == "success") {
					
					myInfo.startRange = result.data.startRange;
					myInfo.endRange = result.data.endRange;
					
//					setSessionItem("myInfo",myInfo);
					
					/*Toast.shortshow("반경설정이 변경되었습니다.");*/
					console.log("변경된 검색지 반경"+myInfo.startRange+"=========");
					console.log("변경된 검색지 반경"+myInfo.endRange+"=========");
					
					setSessionItem("myInfo", myInfo);
					
					changeHref("../settings/settings.html");
					/*location.href = "../settings/settings.html";*/
				} else {
					/*Toast.shortshow("실행중 오류발생!");*/
					console.log(result.data);
				}
			},
	"json");
	
	/*$.getJSON(rootPath + "/setting/getRange.do", function(result){
		if(result.status == "success") {
		var setting = result.data;
		$("#startRange1").val(setting.startRange);
		$("#endRange1").val(setting.endRange);
		}else{
			Toast.shortshow("실행중 오류발생!");
			console.log(result.data);
		}
	});*/
}
function selected(obj) {
	// HTML로 부터 변경된 값 가져오는 함수
}
/* 라디오버튼 벨류값 가져오기 */
function getRadioValue(radioObj){
	 if(radioObj != null){
	  for(var i=0; i<radioObj.length; i++){
	   if(radioObj[i].checked){
	    return radioObj[i].value;
//	    alert(radioObj[radioObj.checkedIndex].value);
	   }
	  }
	 }
	 return null;
	}
/*즐겨찾기 우선순위 변경*/
$(document).bind('pageinit', function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
    $( "#sortable" ).bind( "sortstop", function(event, ui) {
    /*$('#sortable').listview('refresh');*/
    });
  });
/*웹에서는 아래것을 사용해야 drag and drop이 가능*/
/*$(function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
    $( "#sortable" ).listview('refresh');
  });*/

/**
 * 내  용:서버디비 즐겨찾기 목록 가져오기.
 * 작성자 : 김태경
 */
function fvrtLocLists(){
	var params = {
			mbrNo : myInfo.mbrNo
	};
	$.getJSON(rootPath + "/location/getFavoriteList.do"
			, params
			, function(result) {
				if(result.status == "success") {
					var FvrtLoc = result.data;
					var ol = $("#sortable");
					$("#sortable li").remove();
					$('#fvrtLocNo').find('span').show();
					for(var i=0; i<FvrtLoc.length; i++){
		
						     $("<li>")
						     	.attr("data-theme", "f")
						     	.attr("class","fvrtLocNo")
						     	.attr("fvrtLocNo", FvrtLoc[i].fvrtLocNo)
						     	.attr("data-rank", FvrtLoc[i].fvrtLocRank)
						     	.attr("data-no",i)
						     	.attr("onClick",'that.setFvrtLocNo('+FvrtLoc[i].fvrtLocNo+')')
						     	.append($("<a>")
						     					/*.css("text-decoration","none")*/
										     	.attr("data-icon", "delete")
										     	.attr("data-rel","popup")
												.attr("href","#popupFvrtLoc")
												.attr("class","test1")
										     	.append($("<div>")
										     	.text(FvrtLoc[i].fvrtLocName))
						     	)
						        .appendTo(ol);
					}
				}else {
					Toast.shortshow("실행중 오류발생!");
					console.log(getFavoritePlaces);
				}
		
			},"json");
};



/**
 * 내  용:로컬디비에서 즐겨찾기 목록 가져오기.
 * 작성자 : 김태경
 */
/*var FvrtLoc = myInfo.fvrtLocList;
var ol = $("#sortable");
$("#sortable li").remove();
$('#fvrtLocNo').find('span').show();
for(var i=0; i<FvrtLoc.length; i++){

	     $("<li>")
	     	.attr("data-theme", "f")
	     	.attr("id","fvrtLocNo")
	     	.attr("fvrtLocNo", FvrtLoc[i].fvrtLocNo)
	     	.attr("data-rank", FvrtLoc[i].fvrtLocRank)
	     	.append($("<a>")
	     					.css("text-decoration","none")
					     	.attr("data-icon", "delete")
					     	.attr("data-rel","popup")
							.attr("href","#popupFvrtLoc")
					     	.append($("<div>")
					     	.text(FvrtLoc[i].fvrtLocName))
	     	)
	        .appendTo(ol);
}*/

/*즐겨찾기 우선순위 변경 저장클릭시 이동*/
function fvrtLocUpdate(){
	var fvrtArr = [];
	for(var index = 0; index < $("#sortable>li").size(); index++ ) {
		fvrtArr[index] = {
				fvrtLocNo : $($("#sortable>li").get(index)).attr("fvrtLocNo"),
				fvrtLocName : $($("#sortable>li").get(index)).text(),
				fvrtLocRank : index + 1
		};
	};
	console.log(fvrtArr);
	rankUpdate(fvrtArr);
};

/**
 * 내  용: 서버디비 우선순위 랭크값 변경 로컬디비에 동기화.
 * 작성자 : 김태경
 */
function rankUpdate() {
	var fvrtArr = [];
	for(var index = 0; index < $("#sortable>li").size(); index++ ) {
		fvrtArr[index] = {
				fvrtLocNo : $($("#sortable>li").get(index)).attr("fvrtLocNo"),
				fvrtLocName : $($("#sortable>li").get(index)).text(),
				fvrtLocRank : index + 1
		};
	};

	$.ajax( rootPath + "/location/changeFavoritePlaces.do?mbrNo="+myInfo.mbrNo, {
		type: "POST",
		data: JSON.stringify( { "fvrtArr" : fvrtArr } ),
		dataType: "json",
		contentType: "application/json",
		success: function(result) {
			console.log(fvrtArr);
			if(result.status == "success") {
    			console.log(result.data);
    			
    			//여기서 동기화 시켜주면 fvrtLocLists()는 로컬 디비에서 업데이트 된 데이터를 불러온다.
    			myInfo.fvrtLocList = result.data;
    			
    			if(myInfo.dbUpdateStatus == false){
    				myInfo.dbUpdateStatus = true;
    			}
    			setSessionItem("myInfo",myInfo);
    			
    			fvrtLocLists();
    			/*Toast.shortshow("우선순위가 변경되었습니다.");*/
    			$("#sortable").listview('refresh');
            	location.href = "../settings/settings.html";
			} else {
				/*Toast.shortshow("실행중 오류발생!");*/
			}
		},
	});
};

/**
 * 뒤로가기 버튼 처리
 */
var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");

	var pageId = $.mobile.activePage.attr('id');
	if ( pageId && ( pageId == 'pageFvrtSetting' || pageId == 'pageRangeSetting' )) {
		changeHref("../setting/settings.html");
	} else {
		changeHref("../home/home.html");
	}
};
/**
 * 내 용: 삭제시 해당 위치 번호 얻어와서 초기화
 * 작업자:김태경
 */
var setFvrtLocNo = function(fvrtLocNo){
	console.log(fvrtLocNo+"===================================");
	this.fvrtLocNo = fvrtLocNo;
};

console.log("settings...");

var that = this;
var fvrtLocNo;
var pictureSource;   // picture source
var destinationType; // sets the format of returned value

$(document).ready(function() {
	getUpdatedTime();
	initAjaxLoading();
	document.addEventListener("deviceready", onDeviceReady, false);
	registerEvent();
	displayAccountInfoArea();

});
/**
 * 내용:setting 이벤트 등록
 * 작성자: 김태경
 */
var registerEvent = function(){
	
	console.log(myInfo.mbrPhotoUrl);
	
	$("#seach").click(function() {
		myInfo = getLocalItem("myInfo");
		startRangeChk();
		endRangeChk();
		$("#startRange").find("input[type='radio']").bind("change", function(){
		});
	});
	
	$("#rangeSave").click(function() {
		addRange();
	});
	
	$(".save").hover(
			function(){
				$(this).css("background","#c6ecf8")
					   .css("border","1px solid #c6ecf8")
					   .css("z-index","999");
//				$(this).style.boxShadow = "0px 1px 5px #c6ecf8";
			},
			function(){
				$(this).css("background","#fafbfd")
					   .css("border","0.1em solid #eee")
					   .css("z-index","999");
//				$(this).style.boxShadow = "0px 1px 5px #dadada";
			});
	

	$("#btnLogoutAccept").click(function(){
		logout();
	});
	$("#btnLogoutCancel").click(function() {
		$("#popupLogout").popup("close");
	});

	$("#btnRefresh").click(function() {
		
		$("#frndUpdateDate").text("갱신중...");
		$(".btnRefresh").attr("src", "../images/common/loading-update.gif");
		$("#btnRefresh").css("background","white");
		$(".btnRefresh").css("width","35px");
		$(".btnRefresh").css("height","35px");
		$(".btnRefresh").css("margin-left","3.5px");
		$(".btnRefresh").css("margin-top","-6px");
		$(".btnRefresh").css("border-radius","40px");
	
		that.getFrndList();
	});

	$("#divExit").click(function(){
		console.log("회원탈퇴");
		leaveMember();
	});
	$("#divCancel").click(function(){
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
	
	
	
	$("#save").click(function(){
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

	$(".profilePicture").click(function(){
		$("#popupProfile").popup();
		$("#popupProfile").css("visibility","visible");
		$("#popupProfile").popup("open", { transition  : "pop" });
	});

	$("#btnProfile").click(function(){
		$("#profilePicture").css('display','block')
		.css('background-image', 'url(' + myInfo.mbrPhotoUrl + ')');
		$("#profileName").text("이름 : "+myInfo.mbrName);
		$("#profilePhoneNo").text("휴대폰 번호 : "+myInfo.mbrPhoneNo);
	});

	$("#profileGallery").click(function(){
		getPhoto(pictureSource.PHOTOLIBRARY);
	});

	$("#profileCamera").click(function(){
		capturePhoto();
	});
	
	$.mobile.loadPage( "settings.html", { showLoadMsg: false } );
	
	//계정연동 버튼 회원연동화면으로 이동
	$("#btnAccountLogin").click(function() {
		
		if ( myInfo.accountNo && myInfo.accountNo != 0 ) { 
			alert("이미 계정연동이 되었습니다.");
//			Toast.shortshow("이미 계정연동이 되었습니다.");
			
		} else {
			changeHref("../auth/signup.html");
		}
	});
	
};


/**
 * deviceready 이벤트
 */
function onDeviceReady() {
	console.log("onDeviceReady()");

	push.initialise();

	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);

	  pictureSource=navigator.camera.PictureSourceType;

	  destinationType=navigator.camera.DestinationType;
}


/**
 * 설  명: 계정정보영역 내용 보여기
 * 작성자: 김상헌
 */
var displayAccountInfoArea = function() {
	console.log("displayAccountInfoArea()");
	
	$("#imgMbrPhoto").attr( "src", myInfo.mbrPhotoUrl );
	$("#spanMbrName").text(myInfo.mbrName);
	$("#spanPhoneNo").text(myInfo.mbrPhoneNo);
	
	if ( myInfo.accountNo && myInfo.accountNo > 0 ) {
		$("#btnAccountLogin").text(myInfo.accountEmail);
		
	} else {
		$("#btnAccountLogin").text("TAXI 계정 연동");
				
	}
};


/**
 * 내용:출발지 거리 반경 정보 localStorage 에서 얻어서 화면에 checked 로 그리기
 * 작성자:김태경
 */

function startRangeChk() {

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

/**
 * 내용:연락처 가져와서 세션에 저장
 * 작성자:김태경
 */
var getFrndList = function(){
	console.log("frndRefresh()");
	//임시 세션에서 친구 리스트 삭제
//	removeSessionItem("frndData");
	//frndData 새로운 친구 리스트 임시 세션에 저장.
	getContacts();
};


/**
 * 내용: 휴대폰연락쳐를 서버에 업데이트 로컬디비 동기화.
 * 작성자: 김태경
 */
var updateFrndList = function(){
	var param = {
			
			frndList : getSessionItem("frndList")
	};
	
	$.ajax(rootPath + "/friend/frndRefresh.do",{
		type : "POST",
		data : JSON.stringify(param),
		dataType : "json",
		contentType : "application/json",
		success : function(result){
			if(result.status == "success") {

//				location.href = "../setting/settings.html";
				$(".btnRefresh").attr("src", "../images/common/btn_refresh.png");
				$(".btnRefresh").attr("style", "width:40px");
				$(".btnRefresh").attr("style", "height:40px");
				$(".btnRefresh").attr("style", "margin-top:-10px");
				Toast.shortshow("친구목록이 갱신 되었습니다.");
				var a = result.data;
				console.log(JSON.stringify(a));
				executeQuery(
				// Transaction Execute
				function( transaction ) {
					
					deleteAllFrndTable (transaction);	
					insertFrndTable( 	transaction, result.data.frndList);
					
				},function(){
					
					//현재 날짜 정보를 가져옴
					var d = new Date();
					
					setLocalItem("updatedTime",d);
					
					var text = getUpdateTime();
					$("#frndUpdateDate").text(text);
					
				});
				
			}else{
				Toast.shortshow("친구목록 갱신 실패");
			}
			
		}
	});
};


/**
 * 내용: 서버디비 회원정보 삭제 로컬 스토리지 세션 스토리지 로컬 디비 삭제 auth.html 이동 재가입 화면
 * 작성자:김태경
 */
function leaveMember() {
	console.log(myInfo.mbrNo+"번회원===========");
	var param = {
			mbrNo : myInfo.mbrNo
	};
	$.post(rootPath + "/member/leaveMember.do",
			param,
			function(result) {
				if(result.status == "success") {
					clearSession();
					clearLocal();
					
					executeQuery(
					// Transaction Execute
					function( transaction ) {
						dropBlackTable(transaction);
						dropFrndTable(transaction);
						dropFvrtLocTable(transaction);
						dropKeywordTable(transaction);
						dropRcntLocTable(transaction);
					});
			//Toast.shortshow("탈퇴가 성공적으로 되었습니다.");
			//alert("회원탈퇴 성공");
			changeHref("../auth/auth.html");
			console.log("처리됨");
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

			//서버디비 값을 삭제 했다면 로컬디비에 에서도 삭제작업.

			deleteFvrtLocTable(params.mbrNo,params.fvrtLocNo);
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
					//Toast.shortshow("반경설정이 변경되었습니다.");
					setLocalItem("myInfo", myInfo);
					changeHref("../settings/settings.html");
					
				} else {
					Toast.shortshow("실행중 오류발생!");
					console.log(result.data);
				}
			},
	"json");


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
//				alert(radioObj[radioObj.checkedIndex].value);
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


/**
 * 내  용:로컬디비에서 즐겨찾기 목록 가져오기.
 * 작성자 : 김태경
 */

function fvrtLocLists(){

	selectMyFvrtLocList(
			myInfo.mbrNo,
			// Callback
			function( favoriteLocationList ) {

				var ol = $("#sortable");
				$("#sortable li").remove();
				$('#fvrtLocNo').find('span').show();
				for(var i=0; i<favoriteLocationList.length; i++){

					$("<li>")
					.attr("data-theme", "f")
					.attr("class","fvrtLocNo")
					.attr("fvrtLocNo", favoriteLocationList[i].fvrtLocNo)
					.attr("data-rank", favoriteLocationList[i].fvrtLocRank)
					.attr("data-no",i)
					.attr("onClick",'that.setFvrtLocNo('+favoriteLocationList[i].fvrtLocNo+')')
					.append($("<a>")
							.css("text-decoration","none")
							.attr("data-icon", "delete")
							.attr("data-rel","popup")
							.attr("href","#popupFvrtLoc")
							.attr("class","test1")
							.append($("<div>")
									.text(favoriteLocationList[i].fvrtLocName))
					)
					.appendTo(ol);
				};
			});

}


/**
 * 내용:즐겨찾기 우선순위 변경후 저장시 호출
 * 작성자 : 김태경
 */
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
			
			if(result.status == "success") {
				

				var fvrtLocList = result.data;
				console.log(fvrtLocList);
				for(var i in fvrtLocList){
					console.log("위치번호:"+fvrtLocList[i].fvrtLocNo+"우선순위:"+fvrtLocList[i].fvrtLocRank);
				}
				executeQuery(
						// Transaction Execute
						function( transaction ) {
							updateFvrtLocRank(transaction, fvrtLocList);
						},
						// Success Callback
						function() {
							//Toast.shortshow("우선순위가 변경되었습니다.");
							/*$("#sortable").listview('refresh');*/
							location.href = "../settings/settings.html";
							
						});
			} else {
				//Toast.shortshow("실행중 오류발생!");
			}
		},
	});
};


/**
 * 뒤로가기 버튼 처리(블랙리스트 안심서비스 페이지 추가 방참여인 경우 추가)
 * 작성자: 김태경
 */
var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");

	var pageId = $.mobile.activePage.attr('id');
	console.log(pageId);
	if ( pageId && (   pageId == 'pageFvrtSetting' 
					|| pageId == 'pageRangeSetting' 
					|| pageId == 'pageBlakcListSetting'
					|| pageId == 'pageSafeServiceSetting'
					|| pageId == 'pageProfileSetting')
		) {
		changeHref("../settings/settings.html");
	} else {
		
	//	history.back();
	//	history.go(-1);
		if ( isRoomMbr() ) {
			var myRoom = getSessionItem("myRoom");
			
			if (  myRoom && myRoom.roomNo && myRoom.roomNo != 0) {
				changeHref("../room/room.html", { roomNo : myRoom.roomNo });
			}
		}else{
			changeHref("../home/home.html");
		}
		
	}
};


/**
 * 내 용: 삭제시 해당 위치 번호 얻어와서 초기화
 * 작업자:김태경
 */
var setFvrtLocNo = function(fvrtLocNo){
	this.fvrtLocNo = fvrtLocNo;
};


/**
 * 내용:휴대폰에서 연락처 가져오기
 * 작성자:장종혁
 */
var getContacts = function(){
	
	var options = new ContactFindOptions();
    options.multiple  = true; 
    var fields = ["displayName", "name","phoneNumbers"];
    navigator.contacts.find(fields, extractionContactData, null, options);
    
};


/**
 * 내용:가져온 연락처 임시세션에 저장하기.
 * 작성자:장종혁
 */
function extractionContactData(contacts) {
	var contactsList = new Array();
	var frndList = new Array();
	
    for (var i=0; i<contacts.length; i++) {

        	if(contacts[i].phoneNumbers==null){
        		
        		contactsList[i] = {
    					type : "notFound",
    					name : 	contacts[i].displayName,
    					value : "noHaveValue"
    			};
        		
        	}else{
        		
	        		for (var j=0; j<contacts[i].phoneNumbers.length; j++) {

	        			contactsList[i] = {
	        					type : contacts[i].phoneNumbers[j].type,
	        					name : 	contacts[i].displayName,
	        					value : contacts[i].phoneNumbers[j].value
	        			};
	        		}
        	}
    }
    
    var num = 0;
    for(var i = 0; i<contactsList.length;i++){
    	
    	if( contactsList[i].value.substring(0,3)=="010"){
    		
    		frndList[num] = {
    				frndName : contactsList[i].name ,
    				frndPhoneNo : contactsList[i].value,
    				mbrNo : myInfo.mbrNo
    				//frndPhoneNo : b64_md5(contactsList[i].value)
    		};
    		
    		num++;
    		
    	}
    }
    setSessionItem("frndList",frndList);
    that.updateFrndList();
};


/**
 * 내용: 최근갱신 시간 가져오기. 처음호출 시
 * 작성자:김태경
 */
var getUpdatedTime = function(){
	
	if(getLocalItem("updatedTime") == null){
		
		$("#frndUpdateDate").text("");
		
	}else{
		
		$("#frndUpdateDate").text(getUpdateTime());
		
	}
	
};


/**
 * 내용: 최근 갱신 시간 가져오기.업데이트 후
 * 작성자 : 김태경
 */
var getUpdateTime = function(){
    
	var text = "";
	
	var t1 = new Date();
	var t2 = new Date(getLocalItem("updatedTime"))
	var t3 = t1-t2;
	var getDiffTimeMinute  = Math.floor((t3/(1000*60)));
	
	console.log("지나간 시간"+getDiffTimeMinute+"분");
	
	
	if(getDiffTimeMinute < 60){
		
		text = getDiffTimeMinute+"분전"
		
	}else if( getDiffTimeMinute >= 60 ){
		
		text = parseInt( getDiffTimeMinute / 60) +"시간전";
		
	}else if( getDiffTimeMinute >= 1440 ){
		
		text = parseInt( getDiffTimeMinute / 1440) +"일전";
		
	}else if( getDiffTimeMinute >= 525600 ){
		
		text = parseInt( getDiffTimeMinute / 525600) +"년전";
		
	}
	
	
	return text;	
};


/**
 * 내용: profile 사진 수정 & 사진 서버로 전송
 * 작성자: 이 용 준
 */
function onPhotoURISuccess(imageURI) {
	
	var UploadUrl = rootPath + "/setting/uploadUserPhoto.do"
	
	var options = new FileUploadOptions();

	options.headers = {	Connection: "close"}
	options.chunkedMode = false;

	options.fileKey = "file";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.mimeType = "text/plain";
	
	var params = {
			mbrNo 		: myInfo.mbrNo,
			rootPath    : rootPath
	};

	options.params = params;

		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(UploadUrl),function(r){ profileImgUploadSuccess(r);}, fail, options);
}


/**
 *   설  명 : 업로드 성공 시 프로필 사진 바꾸기
 *   작성자 : 장종혁
 */
var profileImgUploadSuccess = function(r) {
			
	var result=   JSON.parse(r.response);
	
	if(result.status=="success"){
		var newMyInfoData = myInfo;
		var imageURI = result.data;
		
		newMyInfoData.mbrPhotoUrl = imageURI;
		
		setLocalItem("myInfo",newMyInfoData);

			$("#profilePicture").css('display','block')
				.css('background-image', 'url(' + imageURI + ')');
	}else{
			alert("접속이 원할하지 않습니다.\n 잠시 후 다시 시도해 주시기 바랍니다.");
	}
};

var fail = function (error) {
	if(error.code==1){
		alert("ErrorCode:1\n선택된 파일을 찾을 수 없습니다.\n 다시 시도해 주시기 바랍니다.");
	}else if(error.code==2){
		alert("ErrorCode:2\n주소가 유효하지 않습니다. \n 관리자에게 문의 해주시기 바랍니다.");
	}else if(error.code==3){
		alert("ErrorCode:3\n서버와의 접속이 원활하지 않습니다.\n 잠시 후 다시 시도해 주시기 바랍니다.");
	}else if(error.code==4){
		alert("ErrorCode:4\n파일 읽기가 중지 되었습니다.");
	}
};

//사진전송을 위해 라이브러리에서 사진을 가져온다.
function getPhoto(source) {
	$("#popupProfile").popup( "close" );
	//alert("library" + source);
    navigator.camera.getPicture(onPhotoURISuccess, getPhotofail(source), {
        quality: 100,
        targetWidth: 280,
        targetHeight: 280,
    	encodingType: Camera.EncodingType.PNG,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}

//라이브러리에서 사진가져오기 실패하면 - 다시 시도.
function getPhotofail(source) {
	
	console.log(source);
	
	//getPhoto(source);
}

//사진찍기
function capturePhoto() {
	$("#popupProfile").popup( "close" );
    navigator.camera.getPicture(onPhotoURISuccess, capturePhotofail, {   
    	quality: 100,
    	targetWidth: 280,
    	 targetHeight: 280,
    	encodingType: Camera.EncodingType.PNG,
        destinationType: destinationType.FILE_URI });
}

//사진 저장이 실패하면
function capturePhotofail(message) {
    //alert('실패 : ' + message);
    navigator.notification.alert(
        '사진을 저장할 수 없습니다!',
        '',
        '저장실패',
        '확인'
    );
}

function onFail(message) {
  alert('Failed because: ' + message);
}

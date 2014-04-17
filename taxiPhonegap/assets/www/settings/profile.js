console.log("profile.js...");

var that = this;
var pictureSource;   // picture source
var destinationType; // sets the format of returned value

$(document).ready(function() {
	
	initAjaxLoading();
	document.addEventListener("deviceready", onDeviceReady, false);
	showProfilePage();
	registerEvents();

}); 


/**
 * 설  명: deviceready 이벤트
 * 작성자: 김상헌
 */
var onDeviceReady = function() {
	console.log("onDeviceReady()");

	push.initialise();

	document.addEventListener("backbutton", touchBackBtnCallbackFunc, false);

	  pictureSource=navigator.camera.PictureSourceType;

	  destinationType=navigator.camera.DestinationType;
	  
};



/**
 * 설  명 : 이벤트 등록
 * 작성자 : 김태경
 */

var registerEvents = function(){
	console.log("registerEvents");
	
	
	
	$(".profileUpdate").on("click", function(event) {
		var pageId =  $(this).attr("id");
		checkRequest(pageId);
	});
	$("#nameInput").on("input", function(e) {
		getValidationResultName();
	});
	$("#phoneNumberInput").on("input", function(e) {
		getValidationResultPhoneNumber();
	});

	$(".deleteProfileInputImg").click(function(){
		deleteInputText();
	});
	$("#nameUpdate").on("click", function(event) {
		checkNameInput();
	});
	$("#phoneNumberUpdate").on("click", function(event) {
		checkPhoneNumber();
	});
	

	$(".profilePicture").on("click", function(event) {
	
		$("#popupProfile").popup();
		$("#popupProfile").css("visibility","visible");
		$("#popupProfile").popup("open", { transition  : "pop" });
		
	});

	$("#profileGallery").on("click", function(event) {
		getPhoto(pictureSource.PHOTOLIBRARY);
	});

	$("#profileCamera").on("click", function(event) {
		capturePhoto();
	});
};

/**
 * 설  명: 요청에 따른 화면 구성
 * 작성자 : 김태경
 */
var checkRequest = function(pageId){
	console.log("checkRequuest");
	console.log(pageId);
	
	if(pageId == "profileName_a"){
		$.mobile.changePage('#profileNameUpdatePage','slide','reverse');
		console.log(myInfo.mbrName);
		$("#nameInput").val(myInfo.mbrName);
		$("#nameUpdate").removeClass("center-button-enable");
		$("#nameUpdate").addClass("center-button-disable");
		$("#nameInput").css("color",'red');
		$(".deleteProfileInputImg").show();

	}else if(pageId  == "profilePhoneNo_a"){
		console.log(myInfo.mbrPhoneNo);
		$.mobile.changePage('#profilePhoneNumberUpdatePage','slide','reverse');
		$("#phoneNumberInput").val(myInfo.mbrPhoneNo);
		$("#phoneNumberUpdate").removeClass("center-button-enable");
		$("#phoneNumberUpdate").addClass("center-button-disable");
		$("#phoneNumberInput").css("color",'red');
		$(".deleteProfileInputImg").show();
	}else if(pageId == 'account_a'){
		
		//문제점1. 계정이 연동되어있는경우 이메일 변경 비밀번호 변경 비밀번호 찾기 메뉴가 있어야할듯.
		if ( myInfo.accountNo && myInfo.accountNo != 0 ) { 
			alert("이미 계정연동이 되었습니다.");
//			Toast.shortshow("이미 계정연동이 되었습니다.");
			
		} else {
			changeHref("account.html");
		}
		
	};
};

/**
 * 설  명 : 전화번호 입력에 따른 UI 구성
 * 작성자 : 김태경
 */
var getValidationResultPhoneNumber = function(){
	console.log("getValidationResultPhoneNumber()");

	var phoneNumber = $("#phoneNumberInput").val();

	if(phoneNumber == ""){

		$("#phoneNumberUpdate").removeClass("center-button-enable");
		$("#phoneNumberUpdate").addClass("center-button-disable");
	}else{

		if(that.validationCheckPhoneNumber(phoneNumber)){
			
			if($("#phoneNumberInput").val() == myInfo.mbrPhoneNo){
				
				$("#phoneNumberInput").css("color",'red');
				$("#phoneNumberUpdate").removeClass("center-button-enable");
				$("#phoneNumberUpdate").addClass("center-button-disable");
				$("#phoneNumberInput").removeAttr("status");
				
			}else{
				
				$("#phoneNumberInput").css("color",'rgb(75, 133, 236)');
				$("#phoneNumberInput").attr("status","true");
				$("#phoneNumberUpdate").removeClass("center-button-disable");
				$("#phoneNumberUpdate").addClass("center-button-enable");
			}
			
		}else{
			$("#phoneNumberInput").css("color",'red');
			$("#phoneNumberInput").attr("status","false");
			$("#phoneNumberUpdate").removeClass("center-button-enable");
			$("#phoneNumberUpdate").addClass("center-button-disable");
			if($("#phoneNumberInput").val() == myInfo.mbrPhoneNo){
				$("#phoneNumberInput").removeAttr("status");
			}
		};
	}

};
/**
 * 설  명 : 이름 입력에 따른 UI 구성
 * 작성자 : 김태경
 */

var getValidationResultName = function(){

	console.log("getValidationResultName()");
	var name = $("#nameInput").val();

	if(name == ""){

		$("#nameUpdate").removeClass("center-button-enable");
		$("#nameUpdate").addClass("center-button-disable");
		
	}else{
		
		var result = that.validationCheckName(name);
		console.log(result);
		if(result){
			
			if($("#nameInput").val() == myInfo.mbrName){
				
				$("#nameUpdate").removeClass("center-button-enable");
				$("#nameUpdate").addClass("center-button-disable");
				$("#nameInput").removeAttr("status");
				$("#nameInput").css("color",'red');
			}else{
				$("#nameInput").css("color",'rgb(75, 133, 236)');
				$("#nameInput").attr("status","true");
				$("#nameUpdate").removeClass("center-button-disable");
				$("#nameUpdate").addClass("center-button-enable");
			}
			
			
		}else{
			$("#nameInput").css("color",'red');
			$("#nameInput").attr("status","false");
			$("#nameUpdate").removeClass("center-button-enable");
			$("#nameUpdate").addClass("center-button-disable");
			if($("#nameInput").val() == myInfo.mbrName){
				$("#nameInput").removeAttr("status");
			}
		};
	}

};

/**
 * 설  명 : 휴대폰번호 validation 체크
 * 작성자 : 김태경
 */
var validationCheckPhoneNumber = function(text){
	var filter = /[010]\d{8}$/g;
	if(text != '' && text.length > 10 && text.length < 12){
		if (filter.test(text)) {
			return true;
		} else {
			return false;
		}
		return false;
	}else{
		return false;
	};
};
/**
 * 설  명 : 이름 validation 체크(영문 x , 자음모음 따로 떨어지는거 x)
 * 작성자 : 김태경
 */
var validationCheckName = function(text){
	console.log(text);
	var form = text;
	for(var i = 0; i < form.length; i++){
		var chr = form.substr(i,1);
		chr = escape(chr);
		if(chr.charAt(1) == "u"){
			chr = chr.substr(2, (chr.length - 1));
			if((chr < "AC00") || (chr > "D7A3"))
				return false;
		}
		else{
			return false;
		}
	}
	return true;
};

/**
 * 설  명 : 입력폼 값 지우는 버튼 
 * 작성자 : 김태경
 */
var deleteInputText = function(){
	var pageId = $.mobile.activePage.attr('id');
	if(pageId && pageId == "profileNameUpdatePage"){

		$("#nameInput").val("");
		$("#nameInput").focus();
		$(".deleteProfileInputImg").hide();
		$("#nameInput").trigger("input");

	}else if(pageId && pageId == "profilePhoneNumberUpdatePage"){

		$("#phoneNumberInput").val("");
		$("#phoneNumberInput").focus();
		$(".deleteProfileInputImg").hide();
		$("#phoneNumberInput").trigger("input");

	}
};
/**
 * 설  명 : 이름업데이트
 * 작성자 : 김태경
 */
var nameUpdate = function(){

	var newName = $("#nameInput").val();
	console.log("nameUpdate();");
	if($("#nameInput").attr("status") == "true"){

		
		console.log(newName);

		var param = {
				newName		: 	newName,
				mbrNo		:	myInfo.mbrNo
		};
		$.getJSON( rootPath + "/member/profileNameUpdate.do"
				,param
				,function(result){

			myInfo.mbrName = result.data;
			setLocalItem("myInfo",myInfo);
			$("#nameInput").removeAttr("status");
			showAlertToast("이름이 변경되었습니다");
			showProfilePage();

		});

	}
};
/**
 * 설  명 : 전화번호 업데이트
 * 작성자 : 김태경
 */
var phoneNumberUpdate = function(){
	
	var newPhoneNumber = $("#phoneNumberInput").val();
	console.log("profilePhoneNumberUpdate()");
	if($("#phoneNumberInput").attr("status") == "true"){
		console.log(newPhoneNumber);

		var param = {
				newPhoneNumber 	: 	newPhoneNumber,
				mbrNo			:	myInfo.mbrNo
		};

		$.getJSON( rootPath + "/member/profilePhoneNumberUpdate.do"
				,param
				,function(result){

			if(result.data != null){
				myInfo.mbrPhoneNo = result.data;
				setLocalItem("myInfo",myInfo);
				$("#phoneNumberInput").removeAttr("status");
				showAlertToast("전화번호가 변경 되었습니다");
				showProfilePage();

			}else{

				showAlertToast("이미 등록된 전화번호 입니다");
				setTimeout($("#phoneNumberInput").focus(),2000);
			}

		});


	}	

};
/**
 * 설  명 : 변경버튼 클릭시 이름 검사
 * 작성자 : 김태경
 */
var checkNameInput = function(){
	
	if($("#nameInput").val() == ""
		|| $("#nameInput").val() == myInfo.mbrName
		|| $("#nameInput").attr("status") == "false"){
		
		$("#nameInput").focus();
		
	}else{
		
		nameUpdate();
	}
	
};
/**
 * 설  명 : 변경버튼 클릭시 전화번호 검사
 * 작성자 : 김태경
 */
var checkPhoneNumber = function(){
	
	if($("#phoneNumberInput").val() == ""
		|| $("#phoneNumberInput").val() == myInfo.mbrPhoneNo
		|| $("#phoneNumberInput").attr("status") == myInfo.mbrPhoneNo){
		$("#phoneNumberInput").focus();
		
	}else{
		
		phoneNumberUpdate();
	}
	
};

/**
 * 내용 : 프로필 정보 페이지 로드
 * 작성자 : 김태경
 */
var showProfilePage = function(){
	
	var myInfo = getLocalItem("myInfo");
	$("#profilePicture").css('display','block')
	.css('background-image', 'url(' + myInfo.mbrPhotoUrl + ')');
	$("#profileName_a").text("이름 : "+myInfo.mbrName);
	$("#profilePhoneNo_a").text("휴대폰 번호 : "+myInfo.mbrPhoneNo);
	if ( myInfo.accountNo && myInfo.accountNo > 0 ) {
		$("#account_a").text(myInfo.accountEmail);
	} else {
		$("#account_a").text("TAXI 계정 연동");
	}
	$.mobile.changePage('#pageProfileSetting','slide','reverse');
	
};


/**
 * 내용: profile 사진 수정 & 사진 서버로 전송
 * 작성자: 이 용 준
 */
function onPhotoURISuccess(imageURI) {
	
	var UploadUrl = rootPath + "/setting/uploadUserPhoto.do";
	
	var options = new FileUploadOptions();

	options.headers = {	Connection: "close"};
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
		
		myInfo.mbrPhotoUrl = imageURI;
		
		setLocalItem("myInfo",newMyInfoData);

			$("#profilePicture").css('display','block')
				.css('background-image', 'url(' + imageURI + ')');
	}else{
		showAlertToast("접속이 원할하지 않습니다.\n 잠시 후 다시 시도해 주시기 바랍니다.");
	}
};

var fail = function (error) {
	if(error.code==1){
		showAlertToast("ErrorCode:1\n선택된 파일을 찾을 수 없습니다.\n 다시 시도해 주시기 바랍니다.");
	}else if(error.code==2){
		showAlertToast("ErrorCode:2\n주소가 유효하지 않습니다. \n 관리자에게 문의 해주시기 바랍니다.");
	}else if(error.code==3){
		showAlertToast("ErrorCode:3\n서버와의 접속이 원활하지 않습니다.\n 잠시 후 다시 시도해 주시기 바랍니다.");
	}else if(error.code==4){
		showAlertToast("ErrorCode:4\n파일 읽기가 중지 되었습니다.");
	}
};

//사진전송을 위해 라이브러리에서 사진을 가져온다.
var getPhoto = function(source) {
	$("#popupProfile").popup( "close" );
    navigator.camera.getPicture(onPhotoURISuccess, getPhotofail(source), {
        quality: 100,
        targetWidth: 280,
        targetHeight: 280,
    	encodingType: Camera.EncodingType.PNG,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
};

//라이브러리에서 사진가져오기 실패하면 - 다시 시도.
function getPhotofail(source) {
	
	console.log(source);
	
	//getPhoto(source);
}

//사진찍기
var capturePhoto = function() {
	$("#popupProfile").popup( "close" );
    navigator.camera.getPicture(onPhotoURISuccess, capturePhotofail, {   
    	quality: 100,
    	targetWidth: 280,
    	 targetHeight: 280,
    	encodingType: Camera.EncodingType.PNG,
        destinationType: destinationType.FILE_URI });
};

//사진 저장이 실패하면
function capturePhotofail(message) {
    navigator.notification.alert(
        '사진을 저장할 수 없습니다!',
        '',
        '저장실패',
        '확인'
    );
}

function onFail(message) {
	showAlertToast('Failed because: ' + message);
}

/**
 * 설  명 : 뒤로가기처리
 * 작성자 : 김태경
 */
var touchBackBtnCallbackFunc = function(){
	
	
//	if($(".ui-popup-container[class=ui-popup-active]")){
		
//	}else{
		var pageId = $.mobile.activePage.attr('id');
		console.log(pageId);
		if(pageId == "pageProfileSetting"){
			changeHref("settings.html");
		}else if(pageId == "profilePhoneNumberUpdatePage"){
			$.mobile.changePage('#pageProfileSetting','slide','reverse');
		}else if(pageId == "profileNameUpdatePage"){
			$.mobile.changePage('#pageProfileSetting','slide','reverse');
		};
		
		
//	}
	
};

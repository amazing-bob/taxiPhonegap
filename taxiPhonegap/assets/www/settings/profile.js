console.log("profile.js...");


var that = this;
$(document).ready(function() {
	initAjaxLoading();
	document.addEventListener("deviceready", onDeviceReady, false);
	checkRequest();
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

};
/**
 * 설  명: 요청에 따른 화면 구성
 * 작성자 : 김태경
 */
var checkRequest = function(){
	console.log("checkRequuest");
	var request = getSessionItem("hrefParams");
	console.log(request);

	if(request == "name"){
		console.log(myInfo.mbrName);
		$("#nameInput").val(myInfo.mbrName);
		$("#nameUpdate").removeClass("center-button-enable");
		$("#nameUpdate").addClass("center-button-disable");
		$("#nameInput").css("color",'red');
		$.mobile.changePage('#profileNameUpdatePage','slide','reverse');
		$(".deleteProfileInputImg").show();

	}else if(request  == "phoneNumber"){
		console.log(myInfo.mbrPhoneNo);

		$("#phoneNumberInput").val(myInfo.mbrPhoneNo);
		$("#phoneNumberUpdate").removeClass("center-button-enable");
		$("#phoneNumberUpdate").addClass("center-button-disable");
		$("#phoneNumberInput").css("color",'red');
		
		$.mobile.changePage('#profilePhoneNumberUpdatePage','slide','reverse');
		$(".deleteProfileInputImg").show();
	};
};

/**
 * 설  명 : 이벤트 등록
 * 작성자 : 김태경
 */

var registerEvents = function(){
	console.log("registerEvents");

	$("#nameInput").on("input", function(e) {
		getValidationResultName();
	});
	$("#phoneNumberInput").on("input", function(e) {
		getValidationResultPhoneNumber();
	});

	$(".deleteProfileInputImg").click(function(){
		deleteInputText();
	});
	$("#nameUpdate").click(function(){
		checkNameInput();
	});
	$("#phoneNumberUpdate").click(function(){
		checkPhoneNumber();
	});

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

	var pageId = $.mobile.activePage.attr('id'); 
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
			changeHref("settings.html",pageId);

		});

	}
};
/**
 * 설  명 : 전화번호 업데이트
 * 작성자 : 김태경
 */
var phoneNumberUpdate = function(){
	
	var pageId = $.mobile.activePage.attr('id'); 
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
				changeHref("settings.html",pageId);

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
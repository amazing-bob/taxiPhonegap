console.log("authjs...");

var that = this;
var myInfo;

var contentHeight;

$(document).ready(function() {
	console.log("ready()");
	initAjaxLoading();
	
	/* 임시 사용자 로그인 */
	console.log("tempLogin()...........");
	console.log(rootPath);
	
	var myInfo = {
			mbrNo: 1,
			mbrName:"회원001",
			mbrPhotoUrl: "../images/photo/m01.jpg",
			startRange: 500,
			endRange: 1000,
			fvrtLocList: null,
			rcntLocList: null
		};
	// 웹 버전일 경우만 주석 풀어야됨!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//	isSignUp( getLocalItem("myInfo") );
	
	setLocalItem("myInfo", myInfo);
	
	
    document.addEventListener("deviceready", onDeviceReady, false);
	contentHeight = $(window).height();
	$("#selectionLoginContent").height(contentHeight+"px");
	
	// 폰번호 입력시 validatePhone() 호출
	$("#content").on('keyup','#txtPhone', function(e) {
	   if ( validatePhone('txtPhone') ) {
	       $('#spnPhoneStatus').text('Valid');
	       $('#spnPhoneStatus').css('color', 'green');
	       $("#btnPhoneNo").removeAttr("disabled").button("refresh");
	   } else {
	      $('#spnPhoneStatus').text('Invalid');
	      $('#spnPhoneStatus').css('color', 'red');
	      $("#btnPhoneNo").attr("disabled", "disabled").button("refresh");
	   }
	});
	
	// 이름 입력시 validateName() 호출
	$("#contentName").on('keyup','#txtName', function(e) {
	   if ( validateName('txtName') ) {
	       $('#spnPhoneStatus').text('Valid');
	       $('#spnPhoneStatus').css('color', 'green');
	       $("#btnName").removeAttr("disabled").button("refresh");

	   } else {
	      $('#spnPhoneStatus').text('Invalid');
	      $('#spnPhoneStatus').css('color', 'red');
	      $("#btnName").attr("disabled", "disabled").button("refresh");
	   }
	});
	
    $("#btnLogin").on("touchend", function() { 
    	taxiLogin(); 
    });

	$("#btnPhoneNo").on('click', clickNextBtn);
	$("#btnName").on('click', clickSignupBtn);
	
}); //reday()

/**
 * deviceready 이벤트
 */
function onDeviceReady() {
	console.log("onDeviceReady()");
	
	try {
		//로컬스토리지로 변경 - 종혁
		isSignUp( getLocalItem("myInfo") );
    } catch (e) {
    	alert(e);
    }
}


/**
 * 설  명 :
 * 작성자 : 
 */
var getAddressBook = function() {
console.log("getAddressBook");
//console.log(callback, args);


/*if ( user.friends && user.friends.data ) {
	myInfo.friendList = [user.friends.data.length];
	for ( var i = 0; i < user.friends.data.length; i++ ) {
		myInfo.friendList[i] = {
    			frndId: 		user.friends.data[i].id,
    			mbrId:			myInfo.mbrId,
    			frndName: 		user.friends.data[i].name,
    			frndGender:		user.friends.data[i].gender,
    			frndPhotoUrl: 	user.friends.data[i].picture.data.url
    	};
	}
}*/
};


/**
 * Taix 어플 회원가입 여부
 */
var isSignUp = function( myInfo ) {
	console.log("isSignUp(myInfo)");
//	console.log(myInfo);
	
	if ( myInfo && myInfo.mbrNo ) {
		console.log(myInfo.mbrNo);
	
		$.getJSON( rootPath + "/auth/hasMember.do"
				, { mbrNo: myInfo.mbrNo }
				, function(result) {
					if(result.status == "success") {
						if ( result.data ) {
							var myInfo = result.data;
							// 세션스토리지에 저장
							//setSessionItem("myInfo", myInfo );
							
							//로컬 스토리지에 저장
							setLocalItem("myInfo", myInfo);
							
							goHomeOrRoom(myInfo);
							
						} else {
							that.myInfo = myInfo;
							
							// 회원가입 화면 이동 
							$.mobile.changePage("#divPhonePage");
						}
						
					} else {
						alert("시스템오류 발생");
					}
		});
	
	} else {
		// 회원가입 화면 이동
		$.mobile.changePage("#divPhonePage");
	}
};

/**
 * 회원가입(다음) 버튼 클릭
 */
var clickNextBtn = function(){
//	console.log("clickNextBtn 클릭");
	$.mobile.changePage("#divSignUpPage");
};

/**
 * 회원가입(완료) 버튼 클릭
 */
var clickSignupBtn = function(){
	console.log("clickSignupBtn()");
	
	var phoneNo = $("#txtPhone").val();
	var mbrName = $("#txtName").val();
	
	if ( phoneNo && mbrName ) {
		signUp( phoneNo, mbrName );
		
	} else {
		console.log("clickSignupBtn 예외발생");
		
	}
	
	return false;
}; 

/**
 * 회원가입
 */
var signUp = function( phoneNo, mbrName ) {
	console.log("signUp(myInfo, phoneNo,mbrName)");
	
	var params = {
			mbrName 	: mbrName,
			mbrPhoneNo 	: phoneNo
	};
	
	$.ajax( rootPath + "/auth/signUp.do", {
		type: "POST",
		data: JSON.stringify( params ),
		dataType: "json",
		contentType: "application/json",
		success: function(result) {
	    			if(result.status == "success") {
	    				var myInfo = result.data;
	    				
	    				if ( myInfo ) {
							// 세션스토리지에 저장
							//setSessionItem("myInfo", myInfo );
	    					//로컬스토리지에 저장
	    					setLocalItem("myInfo", myInfo);
	    				}
	    				
	    			} else {
	    				alert("회원등록 중 오류 발생");
	    				
	    			}
	    		}
	});
};


/**
 * 휴대폰 번호 유효성 검사
 */
var validatePhone = function(txtPhone) {
	console.log("validatePhone()");
    var testPhone = document.getElementById(txtPhone).value;
    var filter = /[010]\d{8}$/g;

    if(testPhone != '' && testPhone.length > 10 && testPhone.length < 12){
    	if (filter.test(testPhone)) {
    		return true;
    	} else {
    		return false;
    	}
    	return false;
    };
};

/**
 * 회원가입-이름 유효성 검사
 */
var validateName = function(txtName) {
	console.log("validateName()");
    var testName = document.getElementById(txtName).value;
    var filter = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
    
    if(testName != '' && testName.length > 1 && testName.length < 10){
    	if (!filter.test(testName)) {
    		return true;
    	} else {
    		return false;
    	}
    	return false;
    };

};


/**
 * 설  명: 방 없으면 홈화면, 방 있으면 방화면
 * 작성자: 김상헌
 */
var goHomeOrRoom = function(myInfo) {
	console.log("goHomeOrRoom(myInfo)");
//	console.log(myInfo);
	
	// 방 참여여부 설정
	searchMyRoom(
			// callbackFunc
			function() { 
				if ( isRoomMbr() ) { // 방 있을 때
					var myRoom = getSessionItem("myRoom");
					changeHref("../room/room.html", { roomNo : myRoom.roomNo });		
				
				} else { // 방 없을 때
					changeHref("../home/home.html");
					
				}
			} );
};


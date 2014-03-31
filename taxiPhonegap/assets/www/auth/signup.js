console.log("signupjs...");

var blankImg = $("<img>")
					.attr("src", "../images/common/blank.png")
					.addClass("inputCheck");
var checkImg = $("<img>")
					.attr("src", "../images/common/check_mark_green.png")
					.addClass("inputCheck");
var xImg = $("<img>")
					.attr("src", "../images/common/check_x_red.png")
					.addClass("inputCheck");

$(document).ready(function() {
	initAjaxLoading();
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	init();
	registerEvents();
	
}); //ready()


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
 * 설  명: 최초 화면 설정
 * 작성자: 김상헌
 */
var init = function() {
	console.log("init()");
	
	// input text 뒤에 체크 및 공백 이미지 변경해주는 부분 나주에 변경이 꼭 필요한 부분이다.
	$("#loginEmail").parent().append(blankImg.clone());
	$("#loginPassword").parent().append(blankImg.clone());
	
	$("#signupPage").on( "pagebeforeshow", function(event) {
		if ( !$("#signEmail + img")[0] ) {
			$("#signEmail").parent().append(blankImg.clone());
		}
		if ( !$("#signPassword + img")[0] ) {
			$("#signPassword").parent().append(blankImg.clone());
		}
		if ( !$("#signPasswordConfirm + img")[0] ) {
			$("#signPasswordConfirm").parent().append(blankImg.clone());
		}
	});
	
};


/**
 * 설  명: 이벤트 등록
 * 작성자: 김상헌
 */
var registerEvents = function() {
	console.log("registerEvents()");
	
	// 계정연동 화면 관련 이벤트
	$("#loginEmail").on("keyup", function(event) {
		validLoginAccount();
	});
	$("#loginPassword").on("keyup", function(event) {
		checkLoginBtnActive();
	});
	
	$("#btnGoSignup").click(function() {
		$.mobile.changePage("#signupPage");
	});
	$("#btnLogin").click(function() {
		var password = b64_md5( $("#loginPassword").val() );
		if ( $(this).hasClass("center-button-enable") ) {
			loginAccount( 	/* mbrNo */  	myInfo.mbrNo, 
							/* email */  	$("#loginEmail").val(), 
							/* password */ 	password );
		}
	});
	
	
	// 계정만들기 화면 관련 이벤트
	// 유효성 체크
	$("#signEmail").on("keyup", function(event) {
		validSignupAccount();
	});
	
	$("#signPassword").on("keyup", function(event){
		validPassword();
	});
	
	$("#signPasswordConfirm").on("keyup", function(event){
		comparePasswrodConfirm();
	});
	
	// 버튼 이벤트
	$("#btnBackToLogin").click(function() {
		$.mobile.changePage("#loginPage");
	});
	
	$("#btnCreateAccount").click(function() {
		var password = b64_md5( $("#signPassword").val() );
		if ( $(this).hasClass("center-button-enable") ) {
			createAccount( 	/* mbrNo */ 	myInfo.mbrNo, 
							/* email */ 	$("#signEmail").val(), 
							/* password */ 	password );
		}			
	});
	
};


/**
 * 설  명: 로그인 계정 유효성 검사
 * 작성자: 김상헌
 */
var validLoginAccount = function() {
	console.log("validLoginAccount()");
	
	var isValidAccount = isValidEmailFromat( /* email */ $.trim( $("#loginEmail").val() ) );
	
	if ( isValidAccount ) {
		$("#loginEmail + img").replaceWith( checkImg.clone() );
		
	} else {
		$("#loginEmail + img").replaceWith( xImg.clone() );
		
	}
	checkLoginBtnActive();
};


/**
 * 설  명: 이메일 형식 유효성 검사 후 true/false 값 리턴
 * 작성자: 김상헌
 */
var isValidEmailFromat = function( email ) {
	console.log("isValidEmailFromat(email)");
	
	if ( email.match(/^[_a-zA-Z0-9]+([-+.][_a-zA-Z0-9]+)*@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/i) ){
		return true;
		
	} else {
		return false;
		
	}
};


/**
 * 설  명: 로그인 입력란 확인 후 로그인 버튼 활성화/비활성화
 * 작성자: 김상헌
 */
var checkLoginBtnActive = function() {
	console.log("checkLoginBtnActive()");
	
	var isValidLoginEmail = $("#loginEmail + img").attr("src") == checkImg.attr("src");
	
	// 비밀번호 찾기 버튼 활성화 판단
	if ( isValidLoginEmail ) {
		$("#btnFindPassword").removeClass("center-button-disable");
		$("#btnFindPassword").addClass("center-button-enable");		
		
	} else {
		$("#btnFindPassword").removeClass("center-button-enable");
		$("#btnFindPassword").addClass("center-button-disable");
		
	}
	
	// 로그인 버튼 활성화 판단
	if ( isValidLoginEmail && $("#loginPassword").val().length > 0 ) {
		$("#btnLogin").removeClass("center-button-disable");
		$("#btnLogin").addClass("center-button-enable");		
		
	} else {
		$("#btnLogin").removeClass("center-button-enable");
		$("#btnLogin").addClass("center-button-disable");
		
	}
};


/**
 * 설  명: 계정 로그인
 * 작성자: 김상헌
 */
var loginAccount = function(mbrNo, email, password) {
	console.log("loginAccount(mbrNo, email, password)");
//	console.log(mbrNo, email, password);
	
	$.getJSON(
			// URL
			rootPath + "/auth/loginAccount.do",
			// Params
			{
				mbrNo 			: mbrNo,
				accountEmail 	: email,
				accountPassword : password,
			},
			// Success
			function(result) {
				if (result.status == "success") {
					var changedMyInfo = result.data.myInfo;
					
					if ( changedMyInfo ) {
						
						// 로컬 스토리지에 저장
						setLocalItem("myInfo", changedMyInfo);
						myInfo = changedMyInfo;
						
						// 세션스토리지에 myRoom 변경
						var myRoom = result.data.myRoom;
						setSessionItem("myRoom", myRoom);
						
						// WebDB 에 추가
						executeQuery(
								// Transaction Execute
								function(transaction) {
									deleteAllFrndTable(		transaction);
									deleteAllFvrtLocTable(	transaction);
									deleteAllRcntLocTable(	transaction);
									deleteAllBlackTable(	transaction);
									insertFrndTable( 	transaction, result.data.frndList);
									insertFvrtLocTable(	transaction, result.data.fvrtLocList);
									insertRcntLocTable(	transaction, result.data.rcntLocList);
									insertBlackTable(	transaction, result.data.blackList);
								},
								// Success Callback
								function() {
									changeHref("../settings/settings.html", null);
								});
						
					}
					
				} else {
					alert(result.data);
					$("#loginPassword").val("");
					checkLoginBtnActive();
					
				}
				
			});
	
};  



/**
 * 설  명: 추가회원가입 계정 유효성 검사
 * 작성자: 김상헌
 */
var validSignupAccount = function() {
	console.log("validSignupAccount()");
	
	var accountEmail = $.trim( $("#signEmail").val() );
	var isEmailValid = isValidEmailFromat( accountEmail );
	
	if ( isEmailValid ) {
		vaildSignupInServer( accountEmail );
		
	} else {
		$("#signEmail + img").replaceWith( xImg.clone() );
		
	}
	checkSignupBtnActive();
};


/**
 * 설  명: 서버에서 추가회원가입 계정 유효성 검사
 * 작성자: 김상헌
 */
var vaildSignupInServer = function( accountEmail ) {
	console.log("vaildSignupInServer(accountEmail)");
//	console.log(accountEmail);
	
	$.getJSON(
			// URL
			rootPath + "/auth/validSignupAccount.do",
			// Params
			{
				mbrNo 			: myInfo.mbrNo,
				accountEmail 	: accountEmail
			},
			// Success
			function(result) {
				if (result.status == "success") {
					isVaildAccount = result.data;
					
					if ( isVaildAccount ) {
						$("#signEmail + img").replaceWith( checkImg.clone() );
						
					} else {
						$("#signEmail + img").replaceWith( xImg.clone() );
						
					}
					
				} else {
					$("#signEmail + img").replaceWith( xImg.clone() );
				}
				checkSignupBtnActive();
				
			});
};


/**
 * 설  명: 비밀번호 유효성 검사
 * 작성자: 김상헌
 */
var validPassword = function() {
	console.log("validPassword()");
	
	var isPasswordValid = true;
	
	// 8~24자
	if( $("#signPassword").val().length < 8 || $("#signPassword").val().length > 24 ) {
		isPasswordValid = false;
	}
	// 비밀번호는 영문, 숫자, 특수분자(!@$%^&* 만 허용)
	if( !$("#signPassword").val().match(/([a-zA-Z0-9!,@,#,$,%,^,&,*,?,_,~])/) ) {
		isPasswordValid = false;
	}
	
	if ( isPasswordValid ) {
		$("#signPassword + img").replaceWith( checkImg.clone() );
		
	} else {
		$("#signPassword + img").replaceWith( xImg.clone() );
	}
	
	comparePasswrodConfirm();
};


/**
 * 설  명: 비밀번호와 비밀번호 확인 비교
 * 작성자: 김상헌
 */
var comparePasswrodConfirm = function() {
	console.log("comparePasswrodConfirm()");
	
	if ( $("#signPasswordConfirm").val().length > 0 ) {
		if ( $("#signPasswordConfirm").val() == $("#signPassword").val() ) {
			$("#signPasswordConfirm + img").replaceWith( checkImg.clone() );
			
		} else {
			$("#signPasswordConfirm + img").replaceWith( xImg.clone() );
			
		}
	}
	
	checkSignupBtnActive();
};


/**
 * 설  명: 체크이미지 확인 후 회원가입 버튼 활성화/비활성화
 * 작성자: 김상헌
 */
var checkSignupBtnActive = function() {
	console.log("checkSignupBtnActive()");

	var isVisibleSignupBtn = true;
	
	if ( $("#signEmail + img").attr("src") != checkImg.attr("src") ) {
		isVisibleSignupBtn = false;
	}
	if ( $("#signPassword + img").attr("src") != checkImg.attr("src") ) {
		isVisibleSignupBtn = false;
	}
	if ( $("#signPasswordConfirm + img").attr("src") != checkImg.attr("src") ) {
		isVisibleSignupBtn = false;
	}
	
	if ( isVisibleSignupBtn ) {
		$("#btnCreateAccount").removeClass("center-button-disable");
		$("#btnCreateAccount").addClass("center-button-enable");
		
	} else {
		$("#btnCreateAccount").removeClass("center-button-enable");
		$("#btnCreateAccount").addClass("center-button-disable");
		
	}
};


/**
 * 설  명: 계정 만들기
 * 작성자: 김상헌
 */
var createAccount = function(mbrNo, email, password) {
	console.log("createAccount(mbrNo, email, password)");
//	console.log(mbrNo, email, password);
	
	$.getJSON(
			// URL
			rootPath + "/auth/createAccount.do",
			// Params
			{
				mbrNo 			: mbrNo,
				accountEmail 	: email,
				accountPassword : password,
				accountSt 		: "G"
			},
			// Success
			function(result) {
				if (result.status == "success") {
					myInfo = result.data;
					setLocalItem("myInfo", myInfo);
					changeHref("../settings/settings.html", null);
					
				} else {
					alert(result.data);
					
				}
				
			});
	
};

/**
 * 설  명: 뒤로가기 버튼 처리
 * 작성자: 김상헌
 */
var FINSH_INTERVAL_TIME = 2000;
var backPressedTime = 0;

var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");
	
	var tempTime = new Date().getTime();
	var intervalTime = tempTime - backPressedTime;
	if ( $(".divBlackBackground").css("visibility") == "hidden") {
		if ( 0 <= intervalTime && FINSH_INTERVAL_TIME >= intervalTime ) {
			navigator.app.exitApp();
		} else {
			backPressedTime = tempTime;
			Toast.shortshow("'뒤로'버튼을 한번 더 누르시면 종료됩니다.");
		}
	} else {
		$("#leftPanel").panel("close");
		$("#divFavoriteLoc_popup").popup("close");
		$("#divAddRoomCondition_popup").popup("close");
		$("#joinRoom_popup").popup("close");
	}
};
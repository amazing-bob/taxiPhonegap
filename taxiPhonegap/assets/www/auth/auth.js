console.log("authjs...");

var myInfo;

var isGetContactsComplet = false;

var contentHeight;

var keyWordList = new Array();
var keywordNo;

var phoneNo;


$(document).ready(function() {
	console.log("ready()");
	
	initAjaxLoading();
	
	contentHeight = $(window).height();
	$("#selectionLoginContent").height(contentHeight+"px");
	
	// 최초 WebDB 만들기
	openWebDB(function() { // Success Callback
		
		registerEvent();
		
		
		/* 임시 사용자 로그인 */
//		console.log("tempLogin()...........");
//		console.log(rootPath);
//		setLocalItem("myInfo", {
//				mbrNo: 1,
//				mbrName:"회원001",
//				mbrPhotoUrl: "../images/photo/m01.jpg",
//				startRange: 500,
//				endRange: 1000,
//				fvrtLocList: null,
//				rcntLocList: null,
//				keyNoList: null
//		});
		
		// 웹 버전일 경우만 주석 풀어야됨!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//		isSignUp( getLocalItem("myInfo"), /*phoneNo*/ null, /*uuid*/ null );
//		isGetContactsComplet = true;
		//////////////////////////////////////////////////////////////////////////////////
		
	});
	
}); //reday()


/**
 * 설  명: 이벤트 등록
 * 작성자: 김상헌
 */
var registerEvent = function() {
	console.log("registerEvent()");
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	// 폰번호 입력시 validatePhone() 호출
	$("#content").on('keyup','#txtPhone', function(e) {
		if ( validatePhone('txtPhone') ) {
			$('#spnPhoneStatus').text('Valid');
			$('#spnPhoneStatus').css('color', 'green');
			$("#btnPhoneNo").removeAttr("disabled").button("refresh");//유효성 검사후 트루값 리턴 받으면 초록 Valid 글씨 띄우고 다음 버튼 활성화.
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
	$("#btnName").on('click', clickKeyWordPage);
	$("#signUpComplete").on('click', clickSignupBtn);

	
	// 키워드 입력란 검색어 입력
	$("#schoolName").on("input", function(e) {
		var sugList = $("#suggestions");
		var text = $(this).val();

		if(text.length < 1) {
			sugList.html("");
			sugList.listview("refresh");
		} else {
			selectMyKeywordList(text, function(keywordList) {
				var str = "";
		
				for ( var i = 0; i < keywordList.length; i++ ) {
					str += "<li class='listdata' data-no="+keywordList[i].keywordNo+">"
	            	+keywordList[i].keywordName+"</li>";
				}
				sugList.html(str);
				sugList.listview("refresh");
			});
		}
	});
	
	// 키워드 클릭 
	$('body').on('click', ".listdata", function (e) { 
		var i = $(this)[0];
		keywordNo = i.dataset.no;
		console.log(i.dataset.no);
		console.log(i.innerHTML);
	 	    $("#schoolName").val(i.innerHTML);
	    $(".listdata").remove();
	});  
};


/**
 * deviceready 이벤트
 */
function onDeviceReady() {
	console.log("onDeviceReady()");
	
    getsetPhoneNo();
    getContacts();
    isSignUp( getLocalItem("myInfo"), phoneNo, device.uuid );
    
}


/**
 *  설   명 : 휴대폰 전화번호를 자동으로 txtPhone 에 추가.
 *  작성자 : 장종혁
 *  수정내용 : 폰 번호를 +8210293023  이런 형식으로 가져올 경우 자동기입 안됨.
 */
var getsetPhoneNo = function() {
	console.log("getsetPhoneNo()");
	
    PhoneNumber.getPhoneNo(function(result) {

    	phoneNo = result.phoneNo;
		
		if(phoneNo.substring(0,3)=="010"){
			
		}else{
			phoneNo = "0"+ phoneNo.substring(3);
		}
		
		$("#txtPhone").val(phoneNo);
		$('#spnPhoneStatus').text('Valid');
		$('#spnPhoneStatus').css('color', 'green');
		$("#btnPhoneNo").removeAttr("disabled").button("refresh");
		
	}, function() {
		// error
	});
};


/**
 * 설  명: 연락처 가져오기
 * 작성자: 장종혁
 */
var getContacts = function() {
	console.log("getContacks()");
	
	//휴대폰 기기안의 주소록 가져오기
    var options = new ContactFindOptions();
    options.multiple  = true; 
    var fields = ["displayName", "name","phoneNumbers"];
    navigator.contacts.find(fields, extractionContactData, null, options);
};


/**
 * 설  명 : 주소록 가져온 정보를 추출하여 contactsList에 저장 후 임시로 세션 스토리지에 저장
 * 작성자 : 장종혁
 * P     S  : 친구의 휴대폰 정보는 Base64 md5 형식으로 저장됨. 
 */
function extractionContactData(contacts) {
	console.log("extractionContactData(contacts)");
	
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
//    console.log(contactsList);
    for(var i = 0; i<contactsList.length;i++){
    	
    //	console.log("정보 )    타입 : " + contactsList[i].type + "   | 이름 : " + contactsList[i].name + "   |번호 : " + contactsList[i].value+"\n");

    	if( contactsList[i].value.substring(0,3)=="010"){
    		
    		frndList[num] = {
    				frndName : contactsList[i].name ,
    				frndPhoneNo : contactsList[i].value
    				//frndPhoneNo : b64_md5(contactsList[i].value)
    		};
    		
    		num++;
    		
    	}
    	
    }
    
    setSessionItem("frndData",frndList);

    isGetContactsComplet = true;
};

/**
 * 설  명: Taix 어플 회원가입 여부
 * 작성자: 김상헌
 */
var isSignUp = function( myInfo, phoneNo, uuid ) {
	console.log("isSignUp(myInfo, phoneNo, uuid)");
//	console.log(myInfo, phoneNo, uuid);
	
	var mbrNo = 0;
	
	if ( myInfo && myInfo.mbrNo > 0 ) {
		mbrNo = myInfo.mbrNo;
	}
	
	if ( (mbrNo && mbrNo > 0) 
			|| (phoneNo && uuid && phoneNo > 0 && uuid != "") ) {
		$.getJSON( rootPath + "/auth/hasMember.do",
				// Param
				{
					mbrNo 		: mbrNo,
					mbrPhoneNo 	: phoneNo,
					mbrUuid 	: uuid
				},
				// Success
				function(result) {
					if(result.status == "success") {
						myInfo = result.data.myInfo;
						
						if ( myInfo ) {
							
							//로컬 스토리지에 저장
							setLocalItem("myInfo", myInfo);
							
							// WebDB 에 추가
							executeQuery(
									// Transaction Execute
									function(transaction) {
										insertFrndTable( 	transaction, result.data.frndList);
										insertFvrtLocTable(	transaction, result.data.fvrtLocList);
										insertRcntLocTable(	transaction, result.data.rcntLocList);
										insertBlackTable(	transaction, result.data.blackList);
									},
									// Success Callback
									function() {
										goHomeOrRoom(myInfo);
									});
							
						} else {
							clearLocalData();
							// 회원가입 화면 이동 
							$.mobile.changePage("#divPhonePage");
						}
		
					} else {
						alert("시스템오류 발생");
					}
				});

	} else {
		clearLocalData();
		// 회원가입 화면 이동
		$.mobile.changePage("#divPhonePage");
	}
};

/**
 * 설  명: 로컬 데이터 삭제(WebDB, LocalStorage, SessionStorage)
 * 작성자: 김상헌
 */
var clearLocalData = function() {
	console.log("clearLocalData()");
	executeQuery(
			// Transaction Execute
			function(transaction) {
				deleteAllFvrtLocTable(transaction);
				deleteAllRcntLocTable(transaction);
				deleteAllBlackTable(transaction);
			}, 
			// Success Callback
			function() {
				clearSession();
				clearLocal();
			});
};


/**
 * 전화번호 입력후 다음 버튼 클릭
 */
var clickNextBtn = function(){
//	console.log("clickNextBtn 클릭");
	$.mobile.changePage("#divSignUpPage");
};
/**
 * 이름 입력후 다음 버튼 클릭
 */
var clickKeyWordPage = function(){
	console.log("getKeyword()");
	
	getKeyword();
	$.mobile.changePage("#keyWordPage");

};
/**
 * 회원가입(완료) 버튼 클릭
 */
var clickSignupBtn = function(){
	console.log("clickSignupBtn()");

	var phoneNo = $("#txtPhone").val();
	var mbrName = $("#txtName").val();

	if ( phoneNo && mbrName ) {
		signUp( phoneNo, device.uuid, mbrName , keywordNo);

	} else {
		console.log("clickSignupBtn 예외발생");

	}

	return false;
}; 


/**
 * 회원가입 
 * 
 * 추가 : 2014-02-25 장종혁 : WebDB에 myInfo값 추가를 위해 서버에서 받은 mbrNo를 받아서 저장.
 */
var signUp = function( phoneNo, uuid, mbrName, keywordNo ) {
	console.log("signUp(phoneNo, uuid, mbrName, keywordNo)");
//	console.log(phoneNo, uuid, mbrName, keywordNo);

	showLoadingImg();
	
	// 연락처 모두 가져오면 다음으로 진행
	var interval = setInterval(function() {
		if ( isGetContactsComplet ) {
			clearInterval(interval);
			
			var params = {
					mbrName 	: mbrName,
					mbrPhoneNo 	: phoneNo,
					mbrUuid 	: uuid,
					keywordNo	: keywordNo,
					frndList 	: getSessionItem("frndData")
			};
			
			$.ajax( rootPath + "/auth/signUp.do", {
				type: "POST",
				data: JSON.stringify( params ),
				dataType: "json",
				contentType: "application/json",
				success: function(result) {
					if(result.status == "success") {
						var myInfo = result.data.myInfo;
		
						if ( myInfo ) {
							//로컬스토리지에 저장
							setLocalItem("myInfo", myInfo);
							
							//주소록 친구 정보 base64 md5 형식으로 웹DB에 저장.
							executeQuery(
									// Transaction Execute
									function(transaction) {
										insertFrndTable( 	transaction, result.data.frndList);
										insertFvrtLocTable(	transaction, result.data.fvrtLocList);
										insertRcntLocTable(	transaction, result.data.rcntLocList);
										insertBlackTable(	transaction, result.data.blackList);
									}, 
									// Success Callback
									function() {
										changeHref("../home/home.html",myInfo);
									});
						}
		
					} else {
						alert("회원등록 중 오류 발생");
		
					}
				}
			});
		}
	}, 300);
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


/**
 * 내  용: 초기회원가입시 이름입력완료후 서버디비에서 키워드 목록 가져와서 웹디비에 결과 던지기.
 * 작성자: 김태경
 */
var getKeyword = function(){
	$.getJSON( rootPath + "/keyword/getKeywordList.do"
			, function(result) {
		if(result.status == "success") {
			if ( result.data ) {
				var keyWord = result.data;

				executeQuery(
						// Transaction Execute
						function(transaction) {
							insertKeywordTable(transaction, keyWord);
						}, 
						// Success Callback
						function() {});
				

			}

		} else {
			alert("시스템오류 발생");
		}
	});
};




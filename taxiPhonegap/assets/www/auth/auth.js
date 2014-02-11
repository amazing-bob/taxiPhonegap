console.log("authjs...");

var that = this;
var myInfo;

var contentHeight;

$(document).ready(function() {
	initAjaxLoading();
	 
	/* 임시 사용자 로그인 
	console.log("tempLogin()...........");
	console.log(rootPath);
	$.ajax( rootPath + "/auth/login.do", {
		type: "POST",
		data: JSON.stringify( {mbrId: 10000002, friendList: [{}]} ),
		dataType: "json",
		contentType: "application/json",
		success: function(result) {
			if(result.status == "success") {
//				console.log(result.data);
				setSessionItem("loginInfo", result.data);
				console.log(getSessionItem("loginInfo"));

				goHomeOrRoom(result.data);
//				$.mobile.changePage("../home/home.html");
//				changeHref("../home/home.html");
			} else {
				alert("회원정보가 맞지 않습니다.");
			}
		}
	});
	*/
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	contentHeight = $(window).height();
	$("#selectionLoginContent").height(contentHeight+"px");
	
	
	if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) 
    	alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
    if (typeof CDV == 'undefined') 
    	alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
    if (typeof FB == 'undefined') 
    	alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
    
    FB.Event.subscribe('auth.login', function(response) {
							$("#btnFacebookLogin").css("visibility", "hidden")
													.css("opacity", "0");
							getFacebookMyInfo( isSignUp );
                       });
    
    FB.Event.subscribe('auth.logout', function(response) {
					    	$("#btnFacebookLogin").css("visibility", "visible");
							$("#btnFacebookLogin").transition({ opacity: 1, delay: 900 });
                       		$.mobile.changePage("#divLoginPage");
                       	});
    
    FB.Event.subscribe('auth.sessionChange', function(response) {
                       		getLoginStatus();
                       });
    
    FB.Event.subscribe('auth.statusChange', function(response) {
    						getLoginStatus();
    					});
	
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
	
    $("#btnFacebookLogin").on("touchend", function() { 
    	facebookLogin(); 
    });

	$("#btnPhoneNo").on('click', clickSignupBtn);
	
}); //reday()

/**
 * deviceready 이벤트
 */
function onDeviceReady() {
	console.log("onDeviceReady()");

	try {
	    FB.init({ appId: "536450846448669", nativeInterface: CDV.FB, useCachedDialogs: false });
	    
	    getLoginStatus();
	    
    } catch (e) {
    	alert(e);
    }
}

/**
 * Facebook 로그인 상태 가져오기
 */
var getLoginStatus = function() {
	console.log("getLoginStatus()");
	
	$("#btnFacebookLogin").css("visibility", "hidden")
							.css("opacity", "0");
	
    FB.getLoginStatus(function(response) {
    	setTimeout(function () {
						if (response.status == 'connected') {
							getFacebookMyInfo( isSignUp );
				        	
						} else {
							$("#btnFacebookLogin").css("visibility", "visible");
							$("#btnFacebookLogin").transition({ opacity: 1, delay: 900 });
						}
			    	}, 1000);
    });
};

/**
 * Facebook 로그인
 */
var facebookLogin = function() {
	console.log("facebookLogin()");
	
    FB.login(
             function(response) {
            	 console.log(response.session);
	             if (response.session) {
	            	 console.log('logged in');
	            	 
	             } else {
	            	 console.log('not logged in');
	            	 
	             }
             }, 
             { scope: "email" }
             );
};

/**
 * Facebook 로그아웃
 */
var facebookLogout = function() {
	console.log("facebookLogout()");
    FB.logout(function(response) {
    			alert('logged out');
			});
};

/**
 * Facebook 회원 정보 가져오기
 */
var getFacebookMyInfo = function( callback, args ) {
	console.log("getFacebookMyInfo(callback, args)");
//	console.log(callback, args);
	
	FB.api(
			'me', 
			{
				fields: 'id,name,gender,picture.height(100).width(100),'
					+'friends.fields(id,name,gender,picture.height(100).width(100))' 
			},  
			function(user) {
               if (user.error) {
            	   alert(JSON.stringify(user.error));
            	   
               } else {
				   var myInfo = null;
				   myInfo = {
		        			mbrId: 			user.id,
		        			mbrName: 		user.name,
		        			mbrGender:		user.gender,
		        			mbrPhotoUrl: 	user.picture.data.url,
		        			friendList:		[]
		        	};
				
		            if ( user.friends && user.friends.data ) {
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
		            }
		            
		            if (args) {
		            	callback(myInfo, args);
		            } else {
		            	callback(myInfo);
		            }
               }
               
			});  
	
};

/**
 * Taix 어플 회원가입 여부
 */
var isSignUp = function( myInfo ) {
	console.log("isSignUp(myInfo)");
//	console.log(myInfo);
	
	$.ajax( rootPath + "/auth/isSignUp.do", {
		type: "POST",
		data: JSON.stringify( { mbrId: myInfo.mbrId } ),
		dataType: "json",
		contentType: "application/json",
		success: function(result) {
					if(result.status == "success") {
						if ( result.data ) {
		    				taxiLogin( myInfo );
							
						} else {
							that.myInfo = myInfo;
							setPhoneNo();
							$.mobile.changePage("#divPhonePage");
							
						}
						
					} else {
						alert("시스템오류 발생");
						
					}
				}
	});
};

/**
 * 휴대폰번호 설정
 */
var setPhoneNo = function() {
	PhoneNumber.getPhoneNo(function(result) {
		$("#txtPhone").val(result.phoneNo);
		if ( validatePhone('txtPhone') ) {
		       $('#spnPhoneStatus').text('Valid');
		       $('#spnPhoneStatus').css('color', 'green');
		       $("#btnPhoneNo").removeAttr("disabled").button("refresh");

		   } else {
		      $('#spnPhoneStatus').text('Invalid');
		      $('#spnPhoneStatus').css('color', 'red');
		      $("#btnPhoneNo").attr("disabled", "disabled").button("refresh");
		   }
	}, function() {
		// error
	});
}

/**
 * 회원가입(다음) 버튼 클릭
 */
var clickSignupBtn = function(){
	console.log("clickSignupBtn()");
	
	var phoneNo = $("#txtPhone").val();
	console.log(that.myInfo.id);

	if ( that.myInfo && that.myInfo != null ) {
		signUp( that.myInfo, phoneNo );
		
	} else {
		getFacebookMyInfo( signUp, phoneNo );
		
	}
	
	return false;
};

/**
 * 회원가입
 */
var signUp = function( myInfo, phoneNo ) {
	console.log("signUp(myInfo, phoneNo)");
//	console.log(myInfo, phoneNo);
	
	myInfo.mbrPhoneNo = phoneNo;
	
	$.ajax( rootPath + "/auth/signup.do", {
		type: "POST",
		data: JSON.stringify( myInfo ),
		dataType: "json",
		contentType: "application/json",
		success: function(result) {
	    			if(result.status == "success") {
	    				taxiLogin( myInfo );
	    				
	    			} else {
	    				alert("회원등록 중 오류 발생");
	    				
	    			}
	    		}
	});
};

/**
 * Taxi어플 로그인
 */
var taxiLogin = function( myInfo ) {
	console.log("taxiLogin(myInfo)");
//	console.log(myInfo);
	
		$.ajax( rootPath + "/auth/login.do", {
    		type: "POST",
    		data: JSON.stringify( myInfo ),
    		dataType: "json",
    		contentType: "application/json",
    		success: function(result) {
    			if(result.status == "success") {
    				setSessionItem("loginInfo", result.data);
    				
    				goHomeOrRoom(result.data);
    			} else {
    				alert("로그인 처리중 오류 발생");
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
 * 참여방 유무에 따른 최초화면 분기(홈/방)
 */
var goHomeOrRoom = function(loginInfo) {
	console.log("goHomeOrJoinRoom()");
//	console.log(loginInfo);
	
	isRoomMbr(
    		function() { //isRoomMbrTrue
    			$.getJSON( rootPath + "/room/getMyRoom.do", function(result) {
		    		if (result.status === "success") {
		    			var room = result.data;
		    			if ( room && room != null &&
		    					room.roomNo && room.roomNo != null && room.roomNo != 0) {
		    				changeHref("../room/room.html", { roomNo : room.roomNo });
		    			}
		    		}
		    	});
		    },
		    function() { //isRoomMbrFalse
		    	changeHref("../home/home.html");
		    });
};
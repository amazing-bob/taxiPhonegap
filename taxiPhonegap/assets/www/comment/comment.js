console.log("comment...");

var that = this;

$(document).ready(function() {
	
	initAjaxLoading();
	

	$("#btnCommentSend").click(function(){
		commentSend();
	});
	$("#commentCancel").click(function() {
		$("#commentPOP").popup("close");
	});

});//ready()


/**
 * 뒤로가기 버튼 처리
 */
var touchBackBtnCallbackFunc = function() {
	console.log("touchBackBtnCallbackFunc()");

	changeHref("../home/home.html");

};

function commentSend(){
	Toast.shortshow("의견을 접수중입니다. 잠시만 기다려주세요.");
	$.post(rootPath + "/comment/commentSend.do",
			{
				mbrNo: myInfo.mbrNo,
				comment : $("#commentArea").val(),
			},
			function(result) {
				if(result.status === "success") {
					Toast.shortshow("의견이 성공적으로 접수되었습니다.");
					changeHref("../home/home.html");
					
				} else {
					Toast.shortshow("다시 시도해주세요.");
					
				};
			},
			"json");
}
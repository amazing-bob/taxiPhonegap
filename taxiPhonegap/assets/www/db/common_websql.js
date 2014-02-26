/**
 *   설  명 : Web DB 기본 셋팅
 *   작성자 : 장종혁
 */
var taxidb = window.openDatabase("taxi", "1.0", "taxiDB", 1000000);

/**
 * 설  명: WebDB 테이블 생성
 */
var openWebDB = function() {
	console.log("openWebDB()");
	
	taxidb.transaction(function(transaction) {
		createFvrtLocTable(transaction);
		createRcntLocTable(transaction);
		createBlackTable(transaction);
		createKeywordTable(transaction);
		createFrndTable(transaction);
	});
};

/**
 * 설    명 : 오류 났을 경우 경고창으로 알림.(// Transaction error callback)
 * 작성자 : 장종혁
 */
function errCallback(err) {
	console.log(" WEB DB ERR =========================================================")
	console.log(err);
}

/**
 * 설    명 : 성공일 경우 알림.( // Transaction success callback)
 * 작성자 : 장종혁
 */
function successCallback() {
}
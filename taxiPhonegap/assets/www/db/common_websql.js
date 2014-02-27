/**
 *   설  명 : Web DB 기본 셋팅
 *   작성자 : 장종혁
 */
var taxidb = window.openDatabase("taxi", "1.0", "taxiDB", 1000000);


/**
 * 설  명: WebDB 테이블 생성
 * 작성자: 김상헌
 */
var openWebDB = function( successCallbackFunc) {
	console.log("openWebDB(errCallbackFunc, successCallbackFunc)");
	
	console.log(taxidb);
	console.log(taxidb.frnd);
	
	taxidb.transaction( function(transaction) { // Transaction Execute
		createFvrtLocTable(transaction);
		createRcntLocTable(transaction);
		createBlackTable(transaction);
		createKeywordTable(transaction);
		createFrndTable(transaction);
	},
	// Error Callback
	function(err) {
		console.log("-------err");
		console.log(err);
	}, 
	// Success Callback
	successCallbackFunc);
};


/**
 * 설  명: 쿼리 실행시 호출되는 공통 함수
 * 작성자: 김상헌
 */
var executeQuery = function( executeFunc, successCallbackFunc ) {
	console.log("executeQuery(executeFunc, successCallbackFunc)");
	
	taxidb.transaction(
			// Transaction Execute
			executeFunc,
			// Error Callback
			function(err) {
				console.log("-------err");
				console.log(err);
			},
			// Success Callback
			successCallbackFunc);
	
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
/**
 *   설  명 : BLACK WebDB 생성
 *   작성자 : 김상헌
 */
var createBlackTable = function (transaction) {
	console.log("createBlackTable(transaction)");
	
	transaction.executeSql(
			// SQL
			' CREATE TABLE IF NOT EXISTS BLACK '+ 
			' ('+
		    '  	  mbrNo 			INTEGER NOT NULL '+ //PRIMARY KEY 
		    ' 	, blackMbrNo		INTEGER NOT NULL '+
		    ' 	, blackMbrRegDate 	DATETIME '+
		    ' 	, PRIMARY KEY (mbrNo, blackMbrNo)'+
    		' );', 
			// Parameter
			[], 
			// Success
			function() {
				console.log("createBlackTable  success");
			}, 
			// Fail
			function() {
				console.log("createBlackTable  fail");
			});
};


/**
 * 설  명: BLACK WebDB 삭제
 * 작성자: 김상헌
 */
var dropBlackTable = function (transaction) {
	console.log("dropBlackTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS BLACK;", 
			// Parameter
			[], 
			// Success
			function() {
				console.log("dropBlackTable  success");
			}, 
			// Fail
			function() {
				console.log("dropBlackTable  fail");
			});
};


/**
 *   설  명 : 블랙리스트 추가
 *   작성자 : 김상헌
 */
var insertBlackTable = function( transaction, blackList ) {
	console.log("insertBlackTable(blackList)");
//	console.log(blackList);

	if ( blackList && blackList.length > 0 ) {
		for(var  i = 0; i < blackList.length; i++){
			transaction.executeSql(
					// SQL
					"INSERT INTO BLACK "+
					"	( mbrNo, blackMbrNo, blackMbrRegDate ) "+
					"VALUES "+
					"	(     ?,          ?,               ? );", 
					// Parameter
					[
					 	blackList[i].mbrNo,
						blackList[i].blackMbrNo, 
						blackList[i].blackMbrRegDate
					 ],
			 		// Success
					function() {
						console.log("insertBlackTable  success");
					},
					// Fail
					function () {
						console.log("insertBlackTable  fail");
					});
		}
		
	} else {
		console.log("insertFrndTable  null");
	}
			
};


/**
 *   설  명 : 블랙리스트 전부 삭제
 *   작성자 : 김상헌
 */
var deleteAllBlackTable = function(transaction) {
	console.log("deleteAllBlackTable()");

	var sql = 
		" delete from BLACK " +
		" where 1 = 1 " +
		" ;";
	transaction.executeSql(
			sql, 
			// Parameter
			[],
	 		// Success
			function() {
				console.log("deleteAllBlackTable  success");
			},
			// Fail
			function () {
				console.log("deleteAllBlackTable  fail");
			});
		
};
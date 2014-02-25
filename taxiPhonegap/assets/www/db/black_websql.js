/**
 *   설  명 : black WebDB 생성
 *   작성자 : 김상헌
 */
var createBlackTable = function (transaction) {
	console.log("createBlackTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS BLACK;"
			);
	
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
 *   설  명 : 즐겨찾기 추가
 *   작성자 : 김상헌
 */
var insertBlackTable = function( blackList ) {
	console.log("insertBlackTable(blackList)");
//	console.log(blackList);

	taxidb.transaction(function(transaction) {
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
			
	});
};
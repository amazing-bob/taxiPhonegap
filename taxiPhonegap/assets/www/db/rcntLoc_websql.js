/**
 *   설  명 : rcntLoc WebDB 생성
 *   작성자 : 김상헌
 */
var createRcntLocTable = function (transaction) {
	console.log("createRcntLocTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS RCNT_LOC;"
			);
	
	transaction.executeSql(
			// SQL
			' CREATE TABLE IF NOT EXISTS RCNT_LOC '+ 
			' ('+
		    		'  rcntLocNo 		INTEGER NOT NULL PRIMARY KEY'+
		    		', mbrNo 			INTEGER'+
		    		', rcntLocName 		TEXT'+
		    		', rcntLocSt 		TEXT'+
		    		', rcntLocLat 		DOUBLE'+
		    		', rcntLocLng 		DOUBLE'+
		    		', rcntLocRegDate 	DATETIME'+
    		' );', 
			// Parameter
			[], 
			// Success
			function() {
				console.log("createRcntLocTable  success");
			}, 
			// Fail
			function() {
				console.log("createRcntLocTable  fail");
			});
};


/**
 *   설  명 : 최근목적지 추가
 *   작성자 : 김상헌
 */
var insertRcntLocTable = function( rcntLocList ) {
	console.log("insertRcntLocTable(rcntLocList)");
//	console.log(rcntLocList);

	taxidb.transaction(function(transaction) {
		for(var  i = 0; i < rcntLocList.length; i++){
			transaction.executeSql(
					// SQL
					"INSERT INTO RCNT_LOC "+
					"	( rcntLocNo, mbrNo, rcntLocName, rcntLocSt, rcntLocLat, rcntLocLng, rcntLocRegDate ) "+
					"VALUES "+
					"	(         ?,     ?,           ?,         ?,           ?,         ?,              ? );", 
					// Parameter
					[
						 rcntLocList[i].rcntLocNo, 
						 rcntLocList[i].mbrNo,
						 rcntLocList[i].rcntLocName,
						 rcntLocList[i].rcntLocSt,
						 rcntLocList[i].rcntLocLat, 
						 rcntLocList[i].rcntLocLng, 
						 rcntLocList[i].rcntLocRegDate
					 ],
			 		// Success
					function() {
						console.log("insertRcntLocTable  success");
					},
					// Fail
					function () {
						console.log("insertRcntLocTable  fail");
					});
		}
			
	});
};


/**
 *   설  명 : 최근목적지 전부 삭제
 *   작성자 : 김상헌
 */
var deleteAllRcntLocTable = function( mbrNo ) {
	console.log("deleteAllRcntLocTable(mbrNo)");
//	console.log(mbrNo);

	taxidb.transaction(function(transaction) {
		var sql = 
			" delete from Rcnt_LOC " +
			" where 1 = 1 " +
			" and 	mbrNo = ?" +
			" ;";
		transaction.executeSql(
				sql, 
				// Parameter
				[
					 mbrNo
				 ],
		 		// Success
				function() {
					console.log("deleteAllRcntLocTable  success");
				},
				// Fail
				function () {
					console.log("deleteAllRcntLocTable  fail");
				});
			
	});
};
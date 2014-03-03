/**
 *   설  명 : rcntLoc WebDB 생성
 *   작성자 : 김상헌
 */
var createRcntLocTable = function (transaction) {
	console.log("createRcntLocTable(transaction)");
	
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
 * 설  명: RCNT_LOC WebDB 삭제
 * 작성자: 김상헌
 */
var dropRcntLocTable = function (transaction) {
	console.log("dropRcntLocTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS RCNT_LOC;", 
			// Parameter
			[], 
			// Success
			function() {
				console.log("dropRcntLocTable  success");
			}, 
			// Fail
			function() {
				console.log("dropRcntLocTable  fail");
			});
};


/**
 *   설  명 : 최근목적지 추가
 *   작성자 : 김상헌
 */
var insertRcntLocTable = function( transaction, rcntLocList ) {
	console.log("insertRcntLocTable(rcntLocList)");
//	console.log(rcntLocList);

	if ( rcntLocList && rcntLocList.length > 0 ) {
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
		
	} else {
		console.log("insertFrndTable  null");
	}
			
};


/**
 *   설  명 : 최근목적지 전부 삭제
 *   작성자 : 김상헌
 */
var deleteAllRcntLocTable = function(transaction) {
	console.log("deleteAllRcntLocTable()");

	var sql = 
		" delete from Rcnt_LOC " +
		" where 1 = 1 " +
		" ;";
	transaction.executeSql(
			sql, 
			// Parameter
			[],
	 		// Success
			function() {
				console.log("deleteAllRcntLocTable  success");
			},
			// Fail
			function () {
				console.log("deleteAllRcntLocTable  fail");
			});
			
};



/**
 *    설   명 : 최근 출발지 , 목적지 검사
 *    작성자 : 장종혁
 */
var selectRcntLoc = function(value, callback){
	console.log("selectRcntLoc(value, callback)");
	
	var text = value.text;
	var type = value.type;
	
	taxidb.transaction(	function(transaction) {
		transaction.executeSql(
				// SQL
				" select 	rcntLocNo " +
				"		, 	mbrNo " +
				"		, 	rcntLocName" +
				"		, 	rcntLocSt" +
				"		, 	rcntLocLat" +
				"		, 	rcntLocLng" +
				"		, 	rcntLocRegDate" +
				" from 		RCNT_LOC " +
				" where 	rcntLocName like ? " +
				" and rcntLocSt = ? " +
				" limit 5",
				// Parameter
				["%"+text+"%", type],
				// Success
				function (transaction, results) {
					console.log("selectRcntLoc  success");
					var len = results.rows.length;
					console.log("size : " + len);
					var rcntList = new Array();
			        for (var i=0; i<len; i++){
			        	rcntList[i] = results.rows.item(i);
			        }
			        
			        callback(rcntList);
			        
			    }, 
			    // Fail
			    function() {
			    	console.log("selectRcntLoc  fail");
			    });
	  });

};

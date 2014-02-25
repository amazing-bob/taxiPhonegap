/**
 *   설  명 : fvrtLoc WebDB 생성
 *   작성자 : 김상헌
 */
var createFvrtLocTable = function (transaction) {
	console.log("createFvrtLocTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS FVRT_LOC;"
			);
	
	transaction.executeSql(
			// SQL
			' CREATE TABLE IF NOT EXISTS FVRT_LOC '+ 
			' ('+
		    		'  fvrtLocNo 	INTEGER NOT NULL PRIMARY KEY'+
		    		', mbrNo 		INTEGER'+
		    		', fvrtLocName 	TEXT'+
		    		', fvrtLocLat 	DOUBLE'+
		    		', fvrtLocLng 	DOUBLE'+
		    		', fvrtLocRank 	INTEGER'+
    		' );', 
			// Parameter
			[], 
			// Success
			function() {
				console.log("createFvrtLocTable  success");
			}, 
			// Fail
			function() {
				console.log("createFvrtLocTable  fail");
			});
};


/**
 *   설  명 : 즐겨찾기 추가
 *   작성자 : 김상헌
 */
var insertFvrtLocTable = function( fvrtLocList ) {
	console.log("insertFvrtLocTable(fvrtLocList)");
//	console.log(fvrtLocList);

	taxidb.transaction(function(transaction) {
		for(var  i = 0; i < fvrtLocList.length; i++){
			transaction.executeSql(
					// SQL
					"INSERT INTO FVRT_LOC "+
					"	( fvrtLocNo, mbrNo, fvrtLocName, fvrtLocLat, fvrtLocLng, fvrtLocRank ) "+
					"VALUES "+
					"	(         ?,     ?,           ?,          ?,           ?,          ? );", 
					// Parameter
					[
						 fvrtLocList[i].fvrtLocNo, 
						 fvrtLocList[i].mbrNo,
						 fvrtLocList[i].fvrtLocName,
						 fvrtLocList[i].fvrtLocLat, 
						 fvrtLocList[i].fvrtLocLng, 
						 fvrtLocList[i].fvrtLocRank
					 ],
			 		// Success
					function() {
						console.log("insertFvrtLocTable  success");
					},
					// Fail
					function () {
						console.log("insertFvrtLocTable  fail");
					});
		}
			
	});
};
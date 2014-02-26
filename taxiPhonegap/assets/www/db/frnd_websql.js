/**
 *   설  명 : frnd WebDB 생성
 *   작성자 : 장종혁
 */
var createFrndTable = function (transaction) {
	console.log("createFrndTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS FRND;"
			);
	
	transaction.executeSql(
			// SQL
			' CREATE TABLE IF NOT EXISTS FRND '+ 
			' ('+
		    '  	  mbrNo 			INTEGER NOT NULL PRIMARY KEY'+ 
		    ' 	, frndPhoneNo		TEXT '+
		    ' 	, frndName 	TEXT '+
		    ' 	, frndRegDate TIMESTAMP;'+
    		' );', 
			// Parameter
			[], 
			// Success
			function() {
				console.log("createFrndTable  success");
			}, 
			// Fail
			function() {
				console.log("createFrndTable  fail");
			});
};

/**
 *   설  명 : 친구정보 추가
 *   작성자 : 장종혁
 */
var insertFrndTable = function( frndList, mbrNo ) {
	console.log("insertFrndTable(blackList)");
//	console.log(blackList);

	taxidb.transaction(function(transaction) {
		for(var  i = 0; i < frndList.length; i++){
			transaction.executeSql(
					// SQL
					"INSERT INTO FRND "+
					"	( mbrNo, frndPhoneNo, frndName, frndRegDate) "+
					"VALUES "+
					"	(     ?,          ?,               ?,now() );", 
					// Parameter
					[
					 	mbrNo,
					 	frndList[i].frndName, 
					 	frndList[i].frndPhoneNo
					 ],
			 		// Success
					function() {
						console.log("insertFrndTable  success");
					},
					// Fail
					function () {
						console.log("insertFrndTable  fail");
					});
		}
			
	});
};


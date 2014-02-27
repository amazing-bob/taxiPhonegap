/**
 *   설  명 : FRND WebDB 생성
 *   작성자 : 장종혁
 */
var createFrndTable = function (transaction) {
	console.log("createFrndTable(transaction)");
	
	var sql  = 
		' CREATE TABLE IF NOT EXISTS FRND '+ 
		' ('+
	    '  	  mbrNo 			INTEGER NOT NULL '+ 
	    ' 	, frndPhoneNo		TEXT NOT NULL'+
	    ' 	, frndName 			TEXT '+
	    ' 	, frndRegDate 		TIMESTAMP '+
	    '	, PRIMARY KEY(mbrNo, frndPhoneNo) '+
		' );';
	transaction.executeSql(
			// SQL
			sql, 
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
 * 설  명: FRND WebDB 삭제
 * 작성자: 김상헌
 */
var dropFrndTable = function (transaction) {
	console.log("dropFrndTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS FRND;", 
			// Parameter
			[], 
			// Success
			function() {
				console.log("dropFrndTable  success");
			}, 
			// Fail
			function() {
				console.log("dropFrndTable  fail");
			});
};


/**
 *   설  명 : 친구정보 추가
 *   작성자 : 장종혁
 */
var insertFrndTable = function( transaction, frndList ) {
	console.log("insertFrndTable(transaction, frndList)");
//	console.log(frndList);

	var sql = 
		"INSERT INTO FRND "+
		"	( mbrNo, frndPhoneNo, frndName, frndRegDate ) "+
		"VALUES "+
		"	(     ?,           ?,        ?,           ? );";
	if ( frndList && frndList.length > 0 ) {
		for(var  i = 0; i < frndList.length; i++){
			transaction.executeSql(
					// SQL
					sql, 
					// Parameter
					[
					 	frndList[i].mbrNo,
					 	frndList[i].frndPhoneNo,
					 	frndList[i].frndName,
					 	frndList[i].frndRegDate
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
		
	} else {
		console.log("insertFrndTable  null");
	}
			
};


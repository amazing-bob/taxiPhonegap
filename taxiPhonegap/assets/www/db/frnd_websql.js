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
 *   설  명 : 친구정보 추가
 *   작성자 : 장종혁
 */
var insertFrndTable = function(transaction, frndList, mbrNo ) {
	console.log("insertFrndTable(frndList, mbrNo)");
	console.log(frndList, mbrNo);

	var sql = 
		"INSERT INTO FRND "+
		"	( mbrNo, frndPhoneNo, frndName, frndRegDate) "+
		"VALUES "+
		"	(     ?,          ?,               ?, ? );";
	console.log(sql);
	for(var  i = 0; i < frndList.length; i++){
		transaction.executeSql(
				// SQL
				sql, 
				// Parameter
				[
				 	mbrNo,
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
			
};


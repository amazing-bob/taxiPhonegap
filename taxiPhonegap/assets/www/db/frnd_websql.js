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
	console.log(frndList);

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

/**
 * 내용 : 친구목록 전체삭제
 * 작성자 : 김태경
 */
var deleteFrndData = function( transaction, mbrNo ) {
	console.log("deleteFrndData(transaction, mbrNo)");
//	console.log(frndList);

	var sql = 
		" delete from FRND " +
		" where 1 = 1 " +
		" and 	mbrNo = ?" +
		" ;";
	transaction.executeSql(
			// SQL
			sql, 
			// Parameter
			[
			 	mbrNo
			],
		 	// Success
			function() {
				console.log("deleteFrndData  success");
			},
			// Fail
			function () {
				console.log("deleteFrndData  fail");
			});
		
			
};
/**
 * 내용:친구목록 전체 가져오기
 * 작업자:김태경
 */
var selectFrndAllList = function( transaction, mbrNo ) {
	console.log("selelctFrndAllData(transaction, mbrNo)");
//	console.log(frndList);

	var sql = 
		" select from FRND " +
		" where 1 = 1 " +
		" and 	mbrNo = ?" +
		" ;";
	transaction.executeSql(
			// SQL
			sql, 
			// Parameter
			[
			 	mbrNo
			],
		 	// Success
			function() {
				console.log("selelctFrndAllData  success");
				
				var len = results.rows.length;

				var frndList = new Array();
				for( var i = 0; i < len; i++ ){
					frndList[i] = results.rows.item(i);
				}
				
				setSessionItem("frndList", frndList);
			},
			// Fail
			function () {
				console.log("selelctFrndAllData  fail");
			});
		
};
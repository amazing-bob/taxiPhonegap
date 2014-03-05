/**
 *   설  명 : FVRT_LOC WebDB 생성
 *   작성자 : 김상헌
 */
var createFvrtLocTable = function (transaction) {
	console.log("createFvrtLocTable(transaction)");

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
 * 설  명: FVRT_LOC WebDB 삭제
 * 작성자: 김상헌
 */
var dropFvrtLocTable = function (transaction) {
	console.log("dropFvrtLocTable(transaction)");

	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS FVRT_LOC;", 
			// Parameter
			[], 
			// Success
			function() {
				console.log("dropFvrtLocTable  success");
			}, 
			// Fail
			function() {
				console.log("dropFvrtLocTable  fail");
			});
};


/**
 *   설  명 : 즐겨찾기 추가
 *   작성자 : 김상헌
 */
var insertFvrtLocTable = function( transaction, fvrtLocList ) {
	console.log("insertFvrtLocTable(fvrtLocList)");
//	console.log(fvrtLocList);

	if ( fvrtLocList && fvrtLocList.length > 0 ) {
		for ( var  i = 0; i < fvrtLocList.length; i++ ) {
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

	} else {
		console.log("insertFrndTable  null");
	}
};
/**
 * 즐겨찾기 랭크 업데이트 (현재 업데이트 문 error 로 안쓰지만 추후 수정예정)
 * 작성자 : 김태경
 */
var updateFvrtLocRank = function( transaction , fvrtLocList ) {
	console.log("updateFvrtLocRank(fvrtLocList)");
	
	var sql = 
		" UPDATE FVRT_LOC" +
		" SET fvrtLocRank =?" + 
		" WHERE fvrtLocNo =?;";
	
	for(var i in fvrtLocList){
		transaction.executeSql(
				sql, 
				// Parameter
				[
				 fvrtLocList[i].fvrtLocRank,
				 fvrtLocList[i].fvrtLocNo
				 ],
				 // Success
				 function() {
					console.log("updateFvrtLocTable  success");
				},
				// Fail
				function () {
					console.log("updateFvrtLocTable  fail");
				});
	}

};
/**
 *   설  명 : 즐겨찾기 전부 삭제
 *   작성자 : 김상헌
 */
var deleteAllFvrtLocTable = function(transaction) {
	console.log("deleteAllFvrtLocTable()");

	var sql = 
		" delete from FVRT_LOC " +
		" where 1 = 1 " +
		" ;";
	transaction.executeSql(
			sql, 
			// Parameter
			[],
			// Success
			function() {
				console.log("deleteAllFvrtLocTable  success");
			},
			// Fail
			function () {
				console.log("deleteAllFvrtLocTable  fail");
			});

};


/**
 *   설  명 : 즐겨찾기 삭제
 *   작성자 : 김상헌
 */
var deleteFvrtLocTable = function( mbrNo, fvrtLocNo ) {
	console.log("deleteFvrtLocTable(mbrNo, fvrtLocNo)");
//	console.log(mbrNo, fvrtLocNo);

	taxidb.transaction(function(transaction) {
		var sql = 
			" delete from FVRT_LOC " +
			" where 1 = 1 " +
			" and 	mbrNo = ?" +
			" and 	fvrtLocNo = ?" +
			" ;";
		transaction.executeSql(
				sql, 
				// Parameter
				[
				 mbrNo,
				 fvrtLocNo
				 ],
				 // Success
				 function() {
					console.log("deleteFvrtLocTable  success");
				},
				// Fail
				function () {
					console.log("deleteFvrtLocTable  fail");
				});

	});
};


/**
 * 내  용 : 나의 즐겨찾기 목록 조회
 * 작성자 : 김상헌
 */
var selectMyFvrtLocList = function(mbrNo, callback){
	console.log("selectMyFvrtLocList(mbrNo, callback)");
//	console.log(mbrNo, callback);

	taxidb.transaction(	function(transaction) {
		var sql = 
			" select 	" +
			"			fvrtLocNo " +
			"		, 	mbrNo " +
			"		, 	fvrtLocName " +
			"		, 	fvrtLocLat " +
			"		, 	fvrtLocLng " +
			"		, 	fvrtLocRank " +
			" from  	FVRT_LOC " +
			" where 	1 = 1 " +
			" and 		mbrNo = ? " +
			" order by  fvrtLocRank";
		console.log(sql);
		transaction.executeSql(
				sql,
				// Parameter
				[ mbrNo ],
				// Success
				function (transaction, results) {
					console.log("selectMyFvrtLocList  success");
					var len = results.rows.length;

					var fvrtLocList = new Array();
					for( var i = 0; i < len; i++ ){
						fvrtLocList[i] = results.rows.item(i);
					}

					callback(fvrtLocList);

				}, 
				// Fail
				function() {
					console.log("selectMyFvrtLocList  fail");
				});
	});

};

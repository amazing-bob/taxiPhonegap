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

/** *    설   명 : 관계도 친구 정보 검사
 *    작성자 : 장종혁
 *    // 배열을 넣어서 
 */
var serchFrndTable = function(frndPhoneNumberList, callback){
	
	var data = new Array();
	setSessionItem("relFrndFrnd", data);
	
	
	console.log("serchFrndTable(frndPhoneNumberList, callback)");
	
	var sql = "SELECT * FROM FRND WHERE frndPhoneNo = ?";
	
		
	for(var  i = 0; i < frndPhoneNumberList.length; i++){
		var relPhone = frndPhoneNumberList[i].relFrndPhone;
		
		taxidb.transaction(	function(transaction,data) {
		    transaction.executeSql(
				// SQL
				sql, 
				// Parameter
				[relPhone],
		 		// Success
				function (transaction, results) {
					console.log("serchFrndTable  success");

					var len = results.rows.length;
					var data = new Array();
					
					console.log(len);

					data = getSessionItem("relFrndFrnd");

					if(len==0){
						data[data.length]="?";
					}else{
						data[data.length]= results.rows.item(0);
					}
			        
					setSessionItem("relFrndFrnd", data);
					
					
			        callback(data);
			        
			    },
				// Fail
				function () {
					console.log("insertFrndTable  fail");
				});
		});
	}
	
};

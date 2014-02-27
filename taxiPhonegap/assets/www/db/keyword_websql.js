/**
 *   설    명 : WebDB 생성( Keyword )
 *   작성자 : 장종혁
 *    PS1.   차후 서버에서 키워드 목록을 받아오는 소스 추가 예정
 *    PS2.   따로 뺀 이유 : KEYWORD는  회원가입시에 필요, 나머지는 회원 가입 후 정보이므로.
 */
var createKeywordTable = function (transaction) {
	console.log("createKeywordTable(transaction)");
	
	transaction.executeSql(
			// SQL
			"DROP TABLE IF EXISTS KEYWORD;"
			);
	
	transaction.executeSql (
				// SQL
				' CREATE TABLE IF NOT EXISTS KEYWORD '+ 
				' ( '+
	    		' 		keywordNo 		INTEGER NOT NULL PRIMARY KEY '+     
	    		' 	, 	keywordName 	TEXT '+
	    		' 	, 	keywordSt 		TEXT '+ 
	    		' ); ', 
				// Parameter
				[], 
				// Success
				function() {
					console.log("createKeywordTable  success");
				}, 
				// Fail
				function() {
					console.log("createKeywordTable  fail");
				});
};


/**
 *   설    명 : WebDB ( Keyword )값 입력
 *   작성자 : 장종혁
 */
var insertKeywordTable = function(transaction, keywordList){
	console.log("insertKeywordTable(transaction, keywordList)");
//	console.log(keywordList);

	for ( var  i = 0; i < keywordList.length; i++ ) {
		transaction.executeSql(
				// SQL
				"INSERT INTO KEYWORD "+
				"	( keywordNo, keywordName, keywordSt ) "+
				"VALUES "+
				"	(         ?,           ?,         ? ); ", 
				// Parameter
				[
					keywordList[i].keywordNo, 
					keywordList[i].keywordName,
					keywordList[i].keywordSt
				 ],
		 		// Success
				function() {
					console.log("insertKeywordTable  success");
				},
				// Fail
				function () {
					console.log("insertKeywordTable  fail");
				});
	}
				
};


/**
 * 내  용 : 키워드 검색
 * 작성자 : 장종혁
 */
var selectMyKeywordList = function(text, callback){
	console.log("selectMyKeywordList(text, callback)");
//	console.log(text, callback);
	
	var value = text;
	
	taxidb.transaction(	function(transaction) {
		transaction.executeSql(
				// SQL
				" select 	keywordNo " +
				"		, 	keywordName " +
				"		, 	keywordSt " +
				" from 		KEYWORD " +
				" where 	keywordName like ? " +
				" limit 5",
				// Parameter
				["%"+value+"%"],
				// Success
				function (transaction, results) {
					console.log("selectMyFvrtLocList  success");
					console.log(results.rows);
					var len = results.rows.length;
					
					var keywordList = new Array();
			        for (var i=0; i<len; i++){
			        	keywordList[i] = results.rows.item(i);
			        }
			        
			        callback(keywordList);
			        
			    }, 
			    // Fail
			    function() {
			    	console.log("selectMyFvrtLocList  fail");
			    });
	  });

};


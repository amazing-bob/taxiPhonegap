/**
 *   설    명 : WebDB 생성( Keyword )
 *   작성자 : 장종혁
 *    PS1.   차후 서버에서 키워드 목록을 받아오는 소스 추가 예정
 *    PS2.   따로 뺀 이유 : KEYWORD는  회원가입시에 필요, 나머지는 회원 가입 후 정보이므로.
 */
var createKeywordTable = function (transaction) {
	console.log("createKeywordTable(transaction)");
	
	transaction.executeSql(("DROP TABLE IF EXISTS KEYWORD;"));
	
	transaction.executeSql (
				// SQL
				' CREATE TABLE IF NOT EXISTS KEYWORD ('+
	    		' 	KEYWORD_NO 		INTEGER NOT NULL PRIMARY KEY,'+
	    		' 	KEYWORD_NAME 	TEXT ,'+
	    		' 	KEWORD_ST 		TEXT)', 
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
var insertKeywordTable = function(transaction, keyWord){
	console.log("insertKeywordTable(transaction, keyWord)");
//	console.log(transaction, keyWord);
	
	for(var  i = 0; i < keyWord.length; i++){
		transaction.executeSql(("INSERT INTO KEYWORD (KEYWORD_NO, KEYWORD_NAME) VALUES (?,?);"), 
		[i,keyWord[i].keyWordName], function(transaction, results){successCallback(results);}, null);
	}
				
};


/**
 * 내  용 : 키워드 검색
 * 작성자 : 장종혁
 */
var searchKeywordList = function(text, callback){
	console.log("getSerchKeyWordList(text, callback)");
//	console.log(text, callback);
	
	var value = text;
	
	taxidb.transaction(	function(transaction) {
		transaction.executeSql('SELECT * FROM KEYWORD WHERE KEYWORD_NAME LIKE ? limit 5'
				, ["%"+value+"%"]
				, function (tx, results) {
					var len = results.rows.length;
					
					var keywordList = new Array();
			        for (var i=0; i<len; i++){
			        	keywordList[i] = results.rows.item(i);
			        }
			        
			        callback(keywordList);
			        
			    }, errCallback);
	  });

};


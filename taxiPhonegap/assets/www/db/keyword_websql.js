/**
 *   설   명  : WebDB 키워드 테이블 생성 트렌젝션
 *   작성자 : 장종혁
 */
var openKeywordWebDb = function(){
	taxidb.transaction(createKeywordTable);
};

/**
 *   설    명 : WebDB 생성( Keyword )
 *   작성자 : 장종혁
 *    PS1.   차후 서버에서 키워드 목록을 받아오는 소스 추가 예정
 *    PS2.   따로 뺀 이유 : KEYWORD는  회원가입시에 필요, 나머지는 회원 가입 후 정보이므로.
 */
var createKeywordTable = function (transaction) {
	
	dropKeywordTable();
	
	transaction.executeSql
    		('CREATE TABLE IF NOT EXISTS KEYWORD('+
	    		'KEYWORD_NO INTEGER NOT NULL PRIMARY KEY,'+
	    		'KEYWORD_NAME TEXT ,'+
	    		' KEWORD_ST TEXT)');
};


/**
 *   설    명 : WebDB ( Keyword ) 테이블 삭제
 *   작성자 : 장종혁
 */
var dropKeywordTable = function() {
	
		taxidb.transaction(function(transaction){
				transaction.executeSql(("DROP KEYWORD TABLE IF EXISTS;"));
		});
};


/**
 *   설    명 : WebDB ( Keyword )값 입력
 *   작성자 : 장종혁
 */
var insertKeywordTable = function(keyWord){
		taxidb.transaction(function(transaction){
			
			for(var  i = 0; i < keyWord.length; i++){
				transaction.executeSql(("INSERT INTO KEYWORD (KEYWORD_NO, KEYWORD_NAME) VALUES (?,?);"), 
				[i,keyWord[i].keyWordName], function(transaction, results){successCallback(results);}, null);
			}
				
			//transaction.executeSql(("INSERT INTO KEYWORD (KEYWORD_NO, KEYWORD_NAME,KEWORD_ST) VALUES (?, ?, ?);"), 
			//[keyWord[i].keyWordNo, keyWord[i].keyWordName, keyWord[i].keyWordSt], function(transaction, results){successCallback(results);}, errCallback);
		});
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


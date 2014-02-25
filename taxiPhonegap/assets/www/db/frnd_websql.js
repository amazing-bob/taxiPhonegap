/**
 *   설    명 : WebDB 생성( frnd )
 *   작성자 : 장종혁
 */
var createFrndTable = function (transaction) {
	
	dropFrndTable();
	
	transaction.executeSql
    		('CREATE TABLE IF NOT EXISTS FRND('+
	    		'mbrNo INTEGER NOT NULL,'+
	    		'frndPhoneNo TEXT NOT NULL,'+
	    		'frndName TEXT,'+
	    		' frndRegDate TIMESTAMP)');
};

//

/**
 *   설    명 : WebDB ( Frnd ) 테이블 삭제
 *   작성자 : 장종혁
 */
var dropFrndTable = function() {
	
		taxidb.transaction(function(transaction){
				transaction.executeSql(("DROP TABLE IF EXISTS FRND;"));
		});
};


/**
 *   설    명 : WebDB ( Frnd )값 입력
 *   작성자 : 장종혁
 */
var insertFrndTable = function(keyWord){
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
 * 내  용 : 친구목록 검색
 * 작성자 : 장종혁
 */
var searchFrndList = function(text, callback){
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


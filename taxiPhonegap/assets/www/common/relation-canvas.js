///  실행파트

/**
 *   설   명 : room.html 관계도 그리기
 *   작성자 : 장종혁
 * 
 */
var makeRelationInfo = function(roomInfo,faceCoordinate){

	console.log("makeRelationInfo(roomInfo)");

	clrRoomRel();
	
	var roomMbrData = roomMbrRange(roomInfo);
	
	drawRelFace(roomInfo, roomMbrData);
	
	return drawRelLine(roomMbrData, faceCoordinate);
	
};

/**
 *   설  명 : home.html 관계도 그리기
 *   작성자 : 장종혁
 */
var makeReletionHomeHtml = function(roomMbrData,faceCoordinate,roomCnt){

	console.log("makeReletionHomeHtml");
	
	drawHomeRelFace(roomMbrData, roomCnt);
	
	
	if(roomMbrData.length==1){
		
		
	}else{
		
		var paper = Raphael("relLine"+roomCnt, 698, 272);
		
		drawHomeRelLine(roomMbrData, faceCoordinate,paper);
		
	}
	
}



/// 함수 파트 

////room.html 관련 함수들..
/**
 *   설   명 : 화면 지우기.
 *   작성자 : 장종혁
 */
var clrRoomRel = function(){
	$(".relFace").css("display","none");
};


/**
 *   설  명 : 방 인원 정보 정렬하기 (mbr0 = 나 자신, mbr1~3 = 방 참여자)
 *   작성자 : 장종혁
 */
var roomMbrRange = function(roomInfo){
	
	var mbr0No = getLocalItem("myInfo").mbrNo;
	
	var roomMbrData = new Array();
	
	var cnt = 1;
	
	// 데이터를 그리기 편한 순서로 정렬한다. (mbr0 = 나 자신, mbr1~3 = 방 참여자)
	for(var i=0;i< roomInfo.roomMbrCount;i++){
		
		if(roomInfo.roomMbrList[i].mbrNo ==mbr0No ){
			roomMbrData[0]= roomInfo.roomMbrList[i];
		}else{
			roomMbrData[cnt] = roomInfo.roomMbrList[i];
			cnt++;
		}
		
	}
	
	return roomMbrData;
	
};


/**
 *    설   명 : 관계도 얼굴 그리기(room.html) - 차후 리펙토링으로 home.html 얼굴그리기와 병합예정 
 *    작성자 : 장종혁
 */
var drawRelFace = function(roomInfo, roomMbrData){
//	console.log(roomMbrData);
//	console.log($(".relFace"));
	
	if(roomInfo.roomMbrNumLimit==1){//방 최대인원수가 2명일경우
		
		$("#relMbr0").css("display","");
		$("#relMbr1").css("display","");
		
	}else if(roomInfo.roomMbrNumLimit==2){//방 인원수가 3명일경우
		
		$("#relMbr0").css("display","");
		$("#relMbr1").css("display","");
		$("#relMbr2").css("display","");
		
	}else {//방 인원수가 4명일경우
		
		$("#relMbr0").css("display","");
		$("#relMbr1").css("display","");
		$("#relMbr2").css("display","");
		$("#relMbr3").css("display","");
		
	}
	
	//얼굴 및 이름 넣기
	for(var i = 0; i <roomMbrData.length;i++){
		$(".relFace")[i].style.backgroundImage = "url("+roomMbrData[i].mbrPhotoUrl+")";
		$("#relMbr"+i+"Name").text(roomMbrData[i].mbrName);
	}
	
};

/**
 *   설   명 : 관계도 관계선 그리기
 *   작성자 : 장종혁
*/
var drawRelLine = function(roomMbrData, faceCoordinate){
	
	var relData = new Array();

	var relLinePaper = new Array();

	var frndFrndSerchData = new Array();
	
	var paper = Raphael("relLine", 698, 272);
	
	
	var cnt = 0;

	
	for(var i=0; i<roomMbrData.length;i++){
		

		for(var j=0;j<roomMbrData.length;j++){
		
				var frndName;
				var relS;						//      relS - 시작점
				var relE;						//		 relE  - 끝점
				var relType;				//		relType - 0 : 관계없음  1 : 친구  2: 친구의 친구
				var relFrndName="";		//		relFrndName - 친구의 친구일경우 DB에서 select 할 경우 값이 있으면 해당 이름을, 없으면 ? 으로 표시
				var relST;					//		relST - 0 무관   1 친구   2 동승자  3 키워드
				
				//console.log("i("+i+") /  j("+j+") = "+roomMbrData[i].mbrNo + "   /   " + roomMbrData[j].roomMbrNo);
			
				if(roomMbrData[i].mbrNo==roomMbrData[j].roomMbrNo){


						if( roomMbrData[i].relFrndPhoneNo != null){ // 친구의 친구가 있나 없나 검사
							relType = 2;
														
							/// 얼굴 그리기
							relLinePaper[cnt] =  paper.path("M"+faceCoordinate[i].offsetLeft+" "+faceCoordinate[i].offsetHeight+"L"+faceCoordinate[j].offsetLeft+" "+faceCoordinate[j].offsetHeight)
																			.attr({stroke:"red"})
																			.attr({weight :30})
																			.node.setAttribute("class","relLineIndex");
							
						}else{ // 친구의 친구가 없을 경우
							
							relType = 1;
							relFrndName = "";
							/// 얼굴 그리기
							relLinePaper[cnt] =  paper.path("M"+faceCoordinate[i].offsetLeft+" "+faceCoordinate[i].offsetHeight+"L"+faceCoordinate[j].offsetLeft+" "+faceCoordinate[j].offsetHeight)
																			.attr({stroke:"blue"})
																			.attr({weight :30})
																			.node.setAttribute("class","relLineIndex");
						
						}
		
				relData[relData.length]={
						roomMbrName : roomMbrData[j].roomMbrName,
					    relS : i,
						relE : j,
						relType : relType,
						relFrndName : relFrndName,
						relFrndPhone : roomMbrData[i].relFrndPhoneNo,
						relST : roomMbrData[i].roomMbrSt
				};
			
				cnt++;
				
			}
			
		}
		
		
		
	}
	
	var cnt = 0;
	
		for(var i=0;i<relData.length;i++){
			
			var temp;
			
			if(relData[i].relS>relData[i].relE){
				temp=relData[i].relS;
				relData[i].relS=relData[i].relE;
				relData[i].relE=temp;
			}

			
			if(relData[i].relType==2){
				
				frndFrndSerchData[cnt]=relData[i];
			
				cnt++;
				
			}

		}
	
	////////////////////////////////////////////////////
	
		if(frndFrndSerchData.length>0){
				
				serchFrndTable(frndFrndSerchData, function(relFrndRes) {
					
					if(relFrndRes.length==frndFrndSerchData.length){
					
					
					var frndOfFrndNamedata = new Array();
					frndOfFrndNamedata = getSessionItem("relFrndFrnd");
					
					console.log(faceCoordinate);
					
					for(var i=0;i<frndFrndSerchData.length;i++){
						var s = frndFrndSerchData[i].relS;
						var e = frndFrndSerchData[i].relE;
						var positionX = 0;
						var positionY = 0;
						var className = "";

						console.log(i);
						console.log(frndFrndSerchData[i]);
						console.log(frndOfFrndNamedata[i]);
						
						if(s==0){
							
								if(e==1){
									
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2 -20;
									className = "ftx01";
									var t01 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									t01.node.setAttribute("class",className);
									
								}else if(e==2){

									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -30;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx02";
									var t02 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									t02.node.setAttribute("class",className);
									
								}else if(e==3){
									console.log(frndOfFrndNamedata[i]);
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2-45;
									className = "ftx03";
									var t03 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									t03.node.setAttribute("class",className);
									
									var c03 = paper.circle(positionX-8, positionY+3, 5);
									c03.node.setAttribute("class","c"+className);
									
								}
							
						}else if(s==1){
							
								if(e==2){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+45;
									className = "ftx12";
									var t12 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									
									var c12 = paper.circle(positionX-8, positionY-3, 5);
									c12.node.setAttribute("class","c"+className);
									
								}else if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 +15;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx13";
									var t13 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									
								}
							
						}else if(s==2){
							
								if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+20;
									className = "ftx13";
									var t23 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									
								}
						
						}
						else{ console.log("error : 5개 이상의 알수없는 오류.. 예정된 관계가 아님..");}
						
		
					}
					
					
					
					}
					
					
					
				});
				
				
//				setTimeout(function(){
//					removeSessionItem("relFrndFrnd");
//				}, 1500);
//				
				
				
		}
	
		
	return relData;

}


////////////////////////////////////////////////////// home.html 관련 함수들..


/**
 *    설   명 : 관계도 얼굴 그리기(home.html)
 *    작성자 : 장종혁
 */
var drawHomeRelFace = function(roomMbrData, roomCnt){
	
	if(roomMbrData.length==1){//현재 방 인원수가 1명일경우
		
		$(".relFace0")[roomCnt].style.display="";
		$(".relFace1")[roomCnt].style.display="none";
		$(".relFace2")[roomCnt].style.display="none";
		$(".relFace3")[roomCnt].style.display="none";
		
	}else if(roomMbrData.length==2){//방 인원수가 2명일경우
		
		$(".relFace0")[roomCnt].style.display="";
		$(".relFace1")[roomCnt].style.display="";
		$(".relFace2")[roomCnt].style.display="none";
		$(".relFace3")[roomCnt].style.display="none";
		
	}else if(roomMbrData.length==3){//방 인원수가 3명일경우
		
		$(".relFace0")[roomCnt].style.display="";
		$(".relFace1")[roomCnt].style.display="";
		$(".relFace2")[roomCnt].style.display="";
		$(".relFace3")[roomCnt].style.display="none";
		
	}else {//방 인원수가 4명일경우
		
		$(".relFace0")[roomCnt].style.display="";
		$(".relFace1")[roomCnt].style.display="";
		$(".relFace2")[roomCnt].style.display="";
		$(".relFace3")[roomCnt].style.display="";
		
	}
	
	console.log
	console.log($(".relMbr"+0+"Name")[0])
	
	$(".relMbr"+0+"Name")[0].innerHtml="dd"
	
	//얼굴 및 이름 넣기
	for(var i = 0; i <roomMbrData.length;i++){
		$(".relFace"+i)[roomCnt].style.backgroundImage = "url("+roomMbrData[i].mbrPhotoUrl+")";
		$(".relMbr"+i+"Name")[roomCnt].innerText=roomMbrData[i].mbrName;
	}
	
};


/**
 *   설   명 : 관계도 관계선 그리기(home.html)
 *   작성자 : 장종혁
*/
var drawHomeRelLine = function(roomMbrData, faceCoordinate,paper){
	
	var relData = new Array();

	var relLinePaper = new Array();

	var frndFrndSerchData = new Array();
	
	var cnt = 0;

	
	for(var i=0; i<roomMbrData.length;i++){
		

		for(var j=0;j<roomMbrData.length;j++){
		
				var frndName;
				var relS;						//      relS - 시작점
				var relE;						//		 relE  - 끝점
				var relType;				//		relType - 0 : 관계없음  1 : 친구  2: 친구의 친구
				var relFrndName="";		//		relFrndName - 친구의 친구일경우 DB에서 select 할 경우 값이 있으면 해당 이름을, 없으면 ? 으로 표시
				var relST;					//		relST - 0 무관   1 친구   2 동승자  3 키워드
				
				//console.log("i("+i+") /  j("+j+") = "+roomMbrData[i].mbrNo + "   /   " + roomMbrData[j].roomMbrNo);
			
				if(roomMbrData[i].mbrNo==roomMbrData[j].roomMbrNo){


						if( roomMbrData[i].relFrndPhoneNo != null){ // 친구의 친구가 있나 없나 검사
							relType = 2;
														
							/// 얼굴 그리기
							relLinePaper[cnt] =  paper.path("M"+faceCoordinate[i].offsetLeft+" "+faceCoordinate[i].offsetHeight+"L"+faceCoordinate[j].offsetLeft+" "+faceCoordinate[j].offsetHeight)
																			.attr({stroke:"red"})
																			.attr({weight :30})
																			.node.setAttribute("class","relLineIndex");
							
						}else{ // 친구의 친구가 없을 경우
							
							relType = 1;
							relFrndName = "";
							/// 얼굴 그리기
							relLinePaper[cnt] =  paper.path("M"+faceCoordinate[i].offsetLeft+" "+faceCoordinate[i].offsetHeight+"L"+faceCoordinate[j].offsetLeft+" "+faceCoordinate[j].offsetHeight)
																			.attr({stroke:"blue"})
																			.attr({weight :30})
																			.node.setAttribute("class","relLineIndex");
						
						}
		
				relData[relData.length]={
						roomMbrName : roomMbrData[j].roomMbrName,
					    relS : i,
						relE : j,
						relType : relType,
						relFrndName : relFrndName,
						relFrndPhone : roomMbrData[i].relFrndPhoneNo,
						relST : roomMbrData[i].roomMbrSt
				};
			
				cnt++;
				
			}
			
		}
		
		
		
	}
	var cnt = 0;
	
		for(var i=0;i<relData.length;i++){
			
			var temp;
			
			if(relData[i].relS>relData[i].relE){
				temp=relData[i].relS;
				relData[i].relS=relData[i].relE;
				relData[i].relE=temp;
			}

			
			if(relData[i].relType==2){
				
				frndFrndSerchData[cnt]=relData[i];
			
				cnt++;
				
			}

		}
	
		if(frndFrndSerchData.length>0){
				
				serchFrndTable(frndFrndSerchData, function(relFrndRes) {
					
					if(relFrndRes.length==frndFrndSerchData.length){
					
					
					var frndOfFrndNamedata = new Array();
					frndOfFrndNamedata = getSessionItem("relFrndFrnd");
					
					console.log(faceCoordinate);
					for(var i=0;i<frndFrndSerchData.length;i++){
						var s = frndFrndSerchData[i].relS;
						var e = frndFrndSerchData[i].relE;
						var positionX = 0;
						var positionY = 0;
						var className = "";


						
						if(s==0){
							
								if(e==1){
									
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2 -20;
									className = "ftx01";
									var t01 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									t01.node.setAttribute("class",className);
									
								}else if(e==2){

									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -30;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx02";
									var t02 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									t02.node.setAttribute("class",className);
									
								}else if(e==3){
									console.log(frndOfFrndNamedata[i]);
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2-45;
									className = "ftx03";
									var t03 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									t03.node.setAttribute("class",className);
				
									var c03 = paper.circle(positionX-30, positionY+3, 5);
									c03.node.setAttribute("class","c"+className);
									
								}
							
						}else if(s==1){
							
								if(e==2){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+45;
									className = "ftx12";
									var t12 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									
									var c12 = paper.circle(positionX-35, positionY-3, 5);
									c12.node.setAttribute("class","c"+className);
									
								}else if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 +15;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx13";
									var t13 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									
								}
							
						}else if(s==2){
							
								if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+20;
									className = "ftx13";
									var t23 = paper.text(positionX, positionY, frndOfFrndNamedata[i]);
									
								}
						
						}
						else{ console.log("error : 5개 이상의 알수없는 오류.. 예정된 관계가 아님..");}
						
		
					}
					
					
					
					}
					
					
					
				});
				
				
		}
	
		
	return relData;

}
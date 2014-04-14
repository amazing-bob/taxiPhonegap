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
var makeReletionHomeHtml = function(roomMbrData,faceCoordinate,roomCnt,roomMbrLimit){
	console.log("makeReletionHomeHtml(roomMbrData,faceCoordinate,roomCnt)");
//	console.log(roomMbrData,faceCoordinate,roomCnt);
	
	drawHomeRelFace(roomMbrData, roomCnt,roomMbrLimit);
	
	
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

	for(var i = 0;i<4;i++){
		if(i<roomInfo.roomMbrNumLimit){
			if(roomMbrData.length<=i){
				$("#relMbr"+i+"Name").text("");
				$(".relFace")[i].style.backgroundImage = "url(../images/common/transparency.png)";
				$(".relFace")[i].style.display="";
				$(".relFace")[i].style.width = "80px";
				$(".relFace")[i].style.height = "80px";
				$(".relFace")[i].style.margin = "0px 0px 0px -5px";
			}else{
				$("#relMbr"+i+"Name").text(roomMbrData[i].mbrName);
				$(".relFace")[i].style.display="";
				$(".relFace")[i].style.backgroundImage = "url("+roomMbrData[i].mbrPhotoUrl+")";
			}
		}else{
			$(".relFace")[i].style.display="none";
		}
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
									var t01 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									t01.node.setAttribute("class",className);
									
								}else if(e==2){

									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -30;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx02";
									var t02 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									t02.node.setAttribute("class",className);
									
								}else if(e==3){
									console.log(frndOfFrndNamedata[i]);
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2-45;
									className = "ftx03";
									var t03 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									t03.node.setAttribute("class",className);
									
									var c03 = paper.circle(positionX-8, positionY+3, 5);
									c03.node.setAttribute("class","c"+className);
									
								}
							
						}else if(s==1){
							
								if(e==2){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+45;
									className = "ftx12";
									var t12 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									
									var c12 = paper.circle(positionX-8, positionY-3, 5);
									c12.node.setAttribute("class","c"+className);
									
								}else if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 +15;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx13";
									var t13 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									
								}
							
						}else if(s==2){
							
								if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+20;
									className = "ftx13";
									var t23 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									
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
var drawHomeRelFace = function(roomMbrData, roomCnt,roomMbrLimit){

	for(var i = 0;i<4;i++){
		if(i<roomMbrLimit){
			if(roomMbrData.length<=i){
				$(".relFace"+i)[roomCnt].style.backgroundImage = "url(../images/common/transparency.png)";
				$(".relFace"+i)[roomCnt].style.display="";
				
			}else{
				$(".relFace"+i)[roomCnt].style.display="";
				$(".relFace"+i)[roomCnt].style.backgroundImage = "url("+roomMbrData[i].mbrPhotoUrl+")";
			}
		}else{
			$(".relFace"+i)[roomCnt].style.display="none";
		}
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
									var t01 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									t01.node.setAttribute("class",className);
									
								}else if(e==2){

									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -30;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx02";
									var t02 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									t02.node.setAttribute("class",className);
									
								}else if(e==3){
									console.log(frndOfFrndNamedata[i]);
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2-45;
									className = "ftx03";
									var t03 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									t03.node.setAttribute("class",className);
				
									var c03 = paper.circle(positionX-5, positionY+3, 5);
									c03.node.setAttribute("class","c"+className);
									
								}
							
						}else if(s==1){
							
								if(e==2){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 -45;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+45;
									className = "ftx12";
									var t12 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									
									var c12 = paper.circle(positionX-6, positionY-3, 5);
									c12.node.setAttribute("class","c"+className);
									
								}else if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2 +15;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2;
									className = "ftx13";
									var t13 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									
								}
							
						}else if(s==2){
							
								if(e==3){
									positionX = (faceCoordinate[s].offsetLeft + faceCoordinate[e].offsetLeft)/2;
									positionY = (faceCoordinate[s].offsetHeight + faceCoordinate[e].offsetHeight)/2+20;
									className = "ftx13";
									var t23 = paper.text(positionX, positionY, frndOfFrndNamedata[i].frndName);
									
								}
						
						}
						else{ console.log("error : 5개 이상의 알수없는 오류.. 예정된 관계가 아님..");}
						
		
					}
					
					
					
					}
					
					
					
				});
				
				
		}
	
		
	return relData;

}
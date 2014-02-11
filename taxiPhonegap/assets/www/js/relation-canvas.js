console.log("relation-canvasjs...");

function drawRelationCanvas (roomInfo, canvas, type) {
	console.log("drawRelationCanvas(roomInfo, canvas, type)");
//	console.log(roomInfo, canvas, type);

	var canvasSize = 320;
	var imageSize = 80;
	var arcRadius = 38;
	var stdImgX = 17;
	var stdImgY = 20;
	var stdArcX = 55;
	var stdArcY = 62;
	var stdNameX = 26;
	var stdNameY = 16;
	
	if ( type == 1 ) { 
		canvasSize = 270;
		imageSize = 60;
		stdImgX = 25;
		stdImgY = 27;
		arcRadius = 30;
		stdArcX = 55;
		stdArcY = 57;
		stdNameX = 30;
		stdNameY = 20;
	} else {
		canvasSize = 320;
		imageSize = 80;
		arcRadius = 38;
		stdImgX = 17;
		stdImgY = 20;
		stdArcX = 55;
		stdArcY = 62;
		stdNameX = 26;
		stdNameY = 16;
	}
	
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    
    var ctx = canvas.getContext("2d");
    
    ctx.beginPath();
    ctx.fillStyle="black";
	
	
	if (type == 1) { // 작은 Canvas 270px * 270px
	    
		if( (roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null) &&
				(roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null)){
			if(roomInfo.roomMbrList[0].roomMbrId
					== roomInfo.roomMbrList[1].mbrId) {
				if( (roomInfo.roomMbrList[0].frndRelId != "" &&
						roomInfo.roomMbrList[0].frndRelId != null)
				    		&& (roomInfo.roomMbrList[0].frndRelName != null &&
				    				roomInfo.roomMbrList[0].frndRelName != "") ) {
					var fixDot1 = new Image(); // 위쪽 선
					fixDot1.src = "../images/common/fixdot.png";
					fixDot1.onload = function() {
						ctx.drawImage(fixDot1, 140, 35, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[0].frndRelName, canvasSize / 2 - 20, stdArcY - 10);
				}
				first(ctx, true, type, canvasSize, stdArcX, stdArcY);
			}
		}
	    
		if( (roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null) &&
				(roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null) ){
	    	if(roomInfo.roomMbrList[0].roomMbrId
		    		== roomInfo.roomMbrList[2].mbrId) {
	    		if( (roomInfo.roomMbrList[0].frndRelId != "" &&
		    			roomInfo.roomMbrList[0].frndRelId != null)
				    		&& (roomInfo.roomMbrList[0].frndRelName != null &&
				    				roomInfo.roomMbrList[0].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 대각선1 위쪽 아이콘
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 100, 95, 40, 40);
		    		};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize/2 - 30, stdArcY + 40);
				}
	    		horizontalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	    
		if( (roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null) &&
				(roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null)){
	    	if(roomInfo.roomMbrList[0].roomMbrId
		    		== roomInfo.roomMbrList[3].mbrId) {
	    		if( (roomInfo.roomMbrList[0].frndRelId != "" &
		    			roomInfo.roomMbrList[0].frndRelId != null)
				    		& (roomInfo.roomMbrList[0].frndRelName != null &
				    				roomInfo.roomMbrList[0].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 왼쪽
	    			fixDot3.src = "../images/common/fixdot.png";
	    			fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 35, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[0].frndRelName, stdArcX + 5, canvasSize / 2);
				}
				fourth(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
	    // 두번째 멤버
	    if( (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null) &&
				(roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null)){
			if(roomInfo.roomMbrList[1].roomMbrId
					== roomInfo.roomMbrList[0].mbrId) {
				if( (roomInfo.roomMbrList[1].frndRelId != "" &&
						roomInfo.roomMbrList[1].frndRelId != null)
				    		&& (roomInfo.roomMbrList[1].frndRelName != null &&
				    				roomInfo.roomMbrList[1].frndRelName != "") ) {
					var fixDot1 = new Image(); // 위쪽 선
					fixDot1.src = "../images/common/fixdot.png";
					fixDot1.onload = function() {
						ctx.drawImage(fixDot1, 140, 35, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize / 2 - 20, stdArcY - 10);
				}
				first(ctx, true, type, canvasSize, stdArcX, stdArcY);
			}
		}
	    
	    if( (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null) &&
						(roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)){
	    	if(roomInfo.roomMbrList[1].roomMbrId
		    		== roomInfo.roomMbrList[2].mbrId) {
	    		if( (roomInfo.roomMbrList[1].frndRelId != "" &&
		    			roomInfo.roomMbrList[1].frndRelId != null)
				    		&& (roomInfo.roomMbrList[1].frndRelName != null &&
				    				roomInfo.roomMbrList[1].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 오른쪽
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 250, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize - stdArcY - 40, canvasSize / 2);
				}
	    		second(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
	    if( (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null) &&
	    		(roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null)){
	    	if(roomInfo.roomMbrList[1].roomMbrId
	    			== roomInfo.roomMbrList[3].mbrId) {
	    		if( (roomInfo.roomMbrList[1].frndRelId != "" &&
		    			roomInfo.roomMbrList[1].frndRelId != null)
				    		&& (roomInfo.roomMbrList[1].frndRelName != null &&
				    				roomInfo.roomMbrList[1].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 대각선2 아래쪽 아이콘
	    			fixDot3.src = "../images/common/fixdot.png";
	    			fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 100, 185, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize/2 - 30, canvasSize - stdArcY - 35);
				}
	    		verticalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
	    }
	
	    // 세번째 멤버
		if( (roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)){
	    	if(roomInfo.roomMbrList[2].roomMbrId
		    		== roomInfo.roomMbrList[0].mbrId) {
	    		if( (roomInfo.roomMbrList[2].frndRelId != "" &&
		    			roomInfo.roomMbrList[2].frndRelId != null)
				    		&& (roomInfo.roomMbrList[2].frndRelName != null &&
				    				roomInfo.roomMbrList[2].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 대각선1 위쪽 아이콘
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 100, 95, 40, 40);
		    		};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize/2 - 30, stdArcY + 40);
				}
	    		horizontalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
		if( (roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)
				&& (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null)){
	    	if(roomInfo.roomMbrList[2].roomMbrId
	    			== roomInfo.roomMbrList[1].mbrId) {
	    		if( (roomInfo.roomMbrList[2].frndRelId != "" &&
		    			roomInfo.roomMbrList[2].frndRelId != null)
				    		&& (roomInfo.roomMbrList[2].frndRelName != null &&
				    				roomInfo.roomMbrList[2].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 오른쪽
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 250, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize - stdArcY - 40, canvasSize / 2);
				}
	    		second(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
		
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null)){
	    	if(roomInfo.roomMbrList[2].roomMbrId
		    		== roomInfo.roomMbrList[3].mbrId) {
	    		if( (roomInfo.roomMbrList[2].frndRelId != "" &&
		    			roomInfo.roomMbrList[2].frndRelId != null)
				    		&& (roomInfo.roomMbrList[2].frndRelName != null &&
				    				roomInfo.roomMbrList[2].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 아래선
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 140, 250, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize / 2 - 20, canvasSize - stdArcY + 20);
				}
	    		third(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
	
		// 라스트멤버
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null) &&
				(roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null)){
	    	if(roomInfo.roomMbrList[3].roomMbrId
		    		== roomInfo.roomMbrList[0].mbrId) {
	    		if( (roomInfo.roomMbrList[3].frndRelId != "" &
		    			roomInfo.roomMbrList[3].frndRelId != null)
				    		& (roomInfo.roomMbrList[3].frndRelName != null &
				    				roomInfo.roomMbrList[3].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 왼쪽
	    			fixDot3.src = "../images/common/fixdot.png";
	    			fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 35, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, stdArcX + 5, canvasSize / 2);
				}
				fourth(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
		
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null) &&
				(roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null)){
	    	if(roomInfo.roomMbrList[3].roomMbrId
	    			== roomInfo.roomMbrList[1].mbrId) {
	    		if( (roomInfo.roomMbrList[3].frndRelId != "" &&
		    			roomInfo.roomMbrList[3].frndRelId != null)
				    		&& (roomInfo.roomMbrList[3].frndRelName != null &&
				    				roomInfo.roomMbrList[3].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 대각선2 아래쪽 아이콘
					fixDot3.src = "../images/common/fixdot.png";
					fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 100, 185, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize/2 - 30, canvasSize - stdArcY - 35);
				}
	    		verticalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
		
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null) &&
					(roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)){
			if(roomInfo.roomMbrList[3].roomMbrId
					== roomInfo.roomMbrList[2].mbrId) {
				if( (roomInfo.roomMbrList[3].frndRelId != "" &&
		    			roomInfo.roomMbrList[3].frndRelId != null)
				    		&& (roomInfo.roomMbrList[3].frndRelName != null &&
				    				roomInfo.roomMbrList[3].frndRelName != "") ) {
					var fixDot3 = new Image(); // 아래선
					fixDot3.src = "../images/common/fixdot.png";
					fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 140, 250, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize / 2 - 20, canvasSize - stdArcY + 20);
				}
				third(ctx, true, type, canvasSize, stdArcX, stdArcY);
			}
		} 
		
	
		ctx.restore();
		ctx.beginPath();
		
		ctx.strokeStyle="#ccc";
		ctx.lineWidth=6;
	    
		ctx.font = "0.8em Nanum Gothic";
		ctx.fillStyle = "black";
		
		// 방장
		if( roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null && roomInfo.roomMbrList[0] != "" ) {
			var photo1 = new Image();
		    photo1.src = roomInfo.roomMbrList[0].mbrPhotoUrl;
		    photo1.onload = function() { 
				var imgX = stdImgX;
			    var imgY = stdImgY;
			    ctx.drawImage(photo1, imgX, imgY, imageSize, imageSize); 
		    };	    
		    
		    var arcX = stdArcX;
		    var arcY = stdArcY;
			ctx.moveTo(arcX, arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2, false);
	
			var nameX = stdNameX;
			var nameY = stdNameY;
			ctx.fillText(roomInfo.roomMbrList[0].mbrName, nameX, nameY);
		}
	
		
		// 두번째 멤버
		if( roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null && roomInfo.roomMbrList[1] != "" ) {
			var photo2 = new Image();
			photo2.src = roomInfo.roomMbrList[1].mbrPhotoUrl;
		    photo2.onload = function() { 
		    		var imgX = canvasSize - imageSize - stdImgX;
			    var imgY = stdImgY;
			    ctx.drawImage(photo2,  imgX, imgY, imageSize, imageSize); 
		    };
		    
		    var arcX = canvasSize - stdArcX;
		    var arcY = stdArcY;
			ctx.moveTo(arcX,  arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2);
	
			var nameX = canvasSize - 50 -stdNameX;
			var nameY = stdNameY;
			ctx.fillText(roomInfo.roomMbrList[1].mbrName, nameX, nameY);
		}
	
		
		
		// 세번째 멤버
		if( roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null && roomInfo.roomMbrList[2] != "" ) {
			var photo3 = new Image();
			photo3.src = roomInfo.roomMbrList[2].mbrPhotoUrl;
		    photo3.onload = function() {
		    		var imgX = canvasSize - imageSize - stdImgX;
		    	var imgY = canvasSize - imageSize - stdImgY;
		    		ctx.drawImage(photo3, imgX, imgY, imageSize, imageSize); 
		    };
		    
		    var arcX = canvasSize - stdArcX;
		    var arcY = canvasSize - stdArcY;
			ctx.moveTo(arcX, arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2);
	
			var nameX = canvasSize - 50 - stdNameX;
			var nameY = canvasSize - stdNameY/2;
			ctx.fillText(roomInfo.roomMbrList[2].mbrName, nameX, nameY);
		}
		
		
		// 네번째 멤버
		if( roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null && roomInfo.roomMbrList[3] != "" ) {
			var photo4 = new Image();
			photo4.src = roomInfo.roomMbrList[3].mbrPhotoUrl;
			photo4.onload = function() { 
				var imgX = stdImgX;
		    	var imgY = canvasSize - imageSize - stdImgY;
				ctx.drawImage(photo4, imgX, imgY, imageSize, imageSize); 
			};
			
			var arcX = stdArcX;
		    var arcY = canvasSize - stdArcY;
			ctx.moveTo(arcX, arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2);
	
			var nameX = stdNameX;
			var nameY = canvasSize - stdNameY/2;
			ctx.fillText(roomInfo.roomMbrList[3].mbrName, nameX, nameY);
		}
		
	    ctx.stroke();
		ctx.clip();
		
		
		
		
		
		
		
		
		
		
	} else if ( type == 2 ) { // 작은 Canvas 320 * 320px
	
		if( (roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null) &&
				(roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null)){
			if(roomInfo.roomMbrList[0].roomMbrId
					== roomInfo.roomMbrList[1].mbrId) {
				if( (roomInfo.roomMbrList[0].frndRelId != "" &&
						roomInfo.roomMbrList[0].frndRelId != null)
				    		&& (roomInfo.roomMbrList[0].frndRelName != null &&
				    				roomInfo.roomMbrList[0].frndRelName != "") ) {
					var fixDot1 = new Image(); // 위쪽 선
					fixDot1.src = "../images/common/fixdot.png";
					fixDot1.onload = function() {
						ctx.drawImage(fixDot1, 140, 35, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[0].frndRelName, canvasSize / 2 - 20, stdArcY - 10);
				}
				first(ctx, true, type, canvasSize, stdArcX, stdArcY);
			}
		}
	    
		if( (roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null) &&
				(roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null) ){
	    	if(roomInfo.roomMbrList[0].roomMbrId
		    		== roomInfo.roomMbrList[2].mbrId) {
	    		if( (roomInfo.roomMbrList[0].frndRelId != "" &&
		    			roomInfo.roomMbrList[0].frndRelId != null)
				    		&& (roomInfo.roomMbrList[0].frndRelName != null &&
				    				roomInfo.roomMbrList[0].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 대각선1 위쪽 아이콘
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 100, 95, 40, 40);
		    		};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[0].frndRelName, canvasSize/2 - 40, stdArcY + 50);
				}
	    		horizontalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	    
		if( (roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null) &&
				(roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null)){
	    	if(roomInfo.roomMbrList[0].roomMbrId
		    		== roomInfo.roomMbrList[3].mbrId) {
	    		if( (roomInfo.roomMbrList[0].frndRelId != "" &
		    			roomInfo.roomMbrList[0].frndRelId != null)
				    		& (roomInfo.roomMbrList[0].frndRelName != null &
				    				roomInfo.roomMbrList[0].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 왼쪽
	    			fixDot3.src = "../images/common/fixdot.png";
	    			fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 35, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[0].frndRelName, stdArcX + 5, canvasSize / 2);
				}
				fourth(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
	    // 두번째 멤버
	    if( (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null) &&
				(roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null)){
			if(roomInfo.roomMbrList[1].roomMbrId
					== roomInfo.roomMbrList[0].mbrId) {
				if( (roomInfo.roomMbrList[1].frndRelId != "" &&
						roomInfo.roomMbrList[1].frndRelId != null)
				    		&& (roomInfo.roomMbrList[1].frndRelName != null &&
				    				roomInfo.roomMbrList[1].frndRelName != "") ) {
					var fixDot1 = new Image(); // 위쪽 선
					fixDot1.src = "../images/common/fixdot.png";
					fixDot1.onload = function() {
						ctx.drawImage(fixDot1, 140, 35, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize / 2 - 20, stdArcY - 10);
				}
				first(ctx, true, type, canvasSize, stdArcX, stdArcY);
			}
		}
	    
	    if( (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null) &&
						(roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)){
	    	if(roomInfo.roomMbrList[1].roomMbrId
		    		== roomInfo.roomMbrList[2].mbrId) {
	    		if( (roomInfo.roomMbrList[1].frndRelId != "" &&
		    			roomInfo.roomMbrList[1].frndRelId != null)
				    		&& (roomInfo.roomMbrList[1].frndRelName != null &&
				    				roomInfo.roomMbrList[1].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 오른쪽
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 250, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize - stdArcY - 40, canvasSize / 2);
				}
	    		second(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
	    if( (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null) &&
	    		(roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null)){
	    	if(roomInfo.roomMbrList[1].roomMbrId
	    			== roomInfo.roomMbrList[3].mbrId) {
	    		if( (roomInfo.roomMbrList[1].frndRelId != "" &&
		    			roomInfo.roomMbrList[1].frndRelId != null)
				    		&& (roomInfo.roomMbrList[1].frndRelName != null &&
				    				roomInfo.roomMbrList[1].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 대각선2 아래쪽 아이콘
	    			fixDot3.src = "../images/common/fixdot.png";
	    			fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 100, 185, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize/2 - 40, canvasSize - stdArcY - 50);
				}
	    		verticalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
	    }
	
	    // 세번째 멤버
		if( (roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)){
	    	if(roomInfo.roomMbrList[2].roomMbrId
		    		== roomInfo.roomMbrList[0].mbrId) {
	    		if( (roomInfo.roomMbrList[2].frndRelId != "" &&
		    			roomInfo.roomMbrList[2].frndRelId != null)
				    		&& (roomInfo.roomMbrList[2].frndRelName != null &&
				    				roomInfo.roomMbrList[2].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 대각선1 위쪽 아이콘
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 100, 95, 40, 40);
		    		};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize/2 - 40, stdArcY + 50);
				}
	    		horizontalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
		if( (roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)
				&& (roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null)){
	    	if(roomInfo.roomMbrList[2].roomMbrId
	    			== roomInfo.roomMbrList[1].mbrId) {
	    		if( (roomInfo.roomMbrList[2].frndRelId != "" &&
		    			roomInfo.roomMbrList[2].frndRelId != null)
				    		&& (roomInfo.roomMbrList[2].frndRelName != null &&
				    				roomInfo.roomMbrList[2].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 오른쪽
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 250, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize - stdArcY - 40, canvasSize / 2);
				}
	    		second(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
		
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null)){
	    	if(roomInfo.roomMbrList[2].roomMbrId
		    		== roomInfo.roomMbrList[3].mbrId) {
	    		if( (roomInfo.roomMbrList[2].frndRelId != "" &&
		    			roomInfo.roomMbrList[2].frndRelId != null)
				    		&& (roomInfo.roomMbrList[2].frndRelName != null &&
				    				roomInfo.roomMbrList[2].frndRelName != "") ) {
	    			var fixDot2 = new Image(); // 아래선
	    			fixDot2.src = "../images/common/fixdot.png";
	    			fixDot2.onload = function() {
						ctx.drawImage(fixDot2, 140, 250, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize / 2 - 20, canvasSize - stdArcY + 20);
				}
	    		third(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
	
	
		// 라스트멤버
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null) &&
				(roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null)){
	    	if(roomInfo.roomMbrList[3].roomMbrId
		    		== roomInfo.roomMbrList[0].mbrId) {
	    		if( (roomInfo.roomMbrList[3].frndRelId != "" &
		    			roomInfo.roomMbrList[3].frndRelId != null)
				    		& (roomInfo.roomMbrList[3].frndRelName != null &
				    				roomInfo.roomMbrList[3].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 왼쪽
	    			fixDot3.src = "../images/common/fixdot.png";
	    			fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 35, 140, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, stdArcX + 5, canvasSize / 2);
				}
				fourth(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
		
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null) &&
				(roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null)){
	    	if(roomInfo.roomMbrList[3].roomMbrId
	    			== roomInfo.roomMbrList[1].mbrId) {
	    		if( (roomInfo.roomMbrList[3].frndRelId != "" &&
		    			roomInfo.roomMbrList[3].frndRelId != null)
				    		&& (roomInfo.roomMbrList[3].frndRelName != null &&
				    				roomInfo.roomMbrList[3].frndRelName != "") ) {
	    			var fixDot3 = new Image(); // 대각선2 아래쪽 아이콘
					fixDot3.src = "../images/common/fixdot.png";
					fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 100, 185, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize/2 - 40, canvasSize - stdArcY - 50);
				}
	    		verticalLine(ctx, true, type, canvasSize, stdArcX, stdArcY);
	    	}
		}
		
		if( (roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null) &&
					(roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null)){
			if(roomInfo.roomMbrList[3].roomMbrId
					== roomInfo.roomMbrList[2].mbrId) {
				if( (roomInfo.roomMbrList[3].frndRelId != "" &&
		    			roomInfo.roomMbrList[3].frndRelId != null)
				    		&& (roomInfo.roomMbrList[3].frndRelName != null &&
				    				roomInfo.roomMbrList[3].frndRelName != "") ) {
					var fixDot3 = new Image(); // 아래선
					fixDot3.src = "../images/common/fixdot.png";
					fixDot3.onload = function() {
						ctx.drawImage(fixDot3, 140, 250, 40, 40);
					};
					ctx.font="11px Gothic";
					ctx.fillStyle="green";
					ctx.fillText(roomInfo.roomMbrList[1].frndRelName, canvasSize / 2 - 20, canvasSize - stdArcY + 20);
				}
				third(ctx, true, type, canvasSize, stdArcX, stdArcY);
			}
		}
	
		
			
		ctx.restore();
		ctx.beginPath();
		
		ctx.strokeStyle="#ccc";
		ctx.lineWidth=6;
	    
		ctx.font = "1em Nanum Gothic";
		ctx.fillStyle = "black";
		
		// 방장
		if( roomInfo.roomMbrList[0] && roomInfo.roomMbrList[0] != null && roomInfo.roomMbrList[0] != "" ) {
			var photo1 = new Image();
		    photo1.src = roomInfo.roomMbrList[0].mbrPhotoUrl;
		    
		    photo1.onload = function() { 
		    		var imgX = stdImgX;
		    	var imgY = stdImgY;
		    	ctx.drawImage(photo1, imgX, imgY, imageSize, imageSize); 
		    };	    
		    
		    var arcX = stdArcX;
		    var arcY = stdArcY;
			ctx.moveTo(arcX, arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2, false);
	
			var nameX = stdNameX;
			var nameY = stdNameY;
			ctx.fillText(roomInfo.roomMbrList[0].mbrName, nameX, nameY);
		}
	
		
		// 두번째 멤버
		if( roomInfo.roomMbrList[1] && roomInfo.roomMbrList[1] != null && roomInfo.roomMbrList[1] != "" ) {
			var photo2 = new Image();
			photo2.src = roomInfo.roomMbrList[1].mbrPhotoUrl;
		    photo2.onload = function() { 
		    		var imgX = canvasSize - imageSize - stdImgX;
			    var imgY = stdImgY;
			    ctx.drawImage(photo2,  imgX, imgY, imageSize, imageSize); 
		    };
		    
		    var arcX = canvasSize - stdArcX;
		    var arcY = stdArcY;
			ctx.moveTo(arcX,  arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2);
	
			var nameX = canvasSize - 50 -stdNameX;
			var nameY = stdNameY;
			ctx.fillText(roomInfo.roomMbrList[1].mbrName, nameX, nameY);
		}
	
		
		
		// 세번째 멤버
		if( roomInfo.roomMbrList[2] && roomInfo.roomMbrList[2] != null && roomInfo.roomMbrList[2] != "" ) {
			var photo3 = new Image();
			photo3.src = roomInfo.roomMbrList[2].mbrPhotoUrl;
		    photo3.onload = function() {
		    		var imgX = canvasSize - imageSize - stdImgX;
		    	var imgY = canvasSize - imageSize - stdImgY;
		    		ctx.drawImage(photo3, imgX,imgY, imageSize, imageSize); 
		    };
		    
		    var arcX = canvasSize - stdArcX;
		    var arcY = canvasSize - stdArcY;
			ctx.moveTo(arcX, arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2);
	
			var nameX = canvasSize - 50 - stdNameX;
			var nameY = canvasSize - stdNameY/3;
			ctx.fillText(roomInfo.roomMbrList[2].mbrName, nameX, nameY);
		}
		
		
		// 네번째 멤버
		if( roomInfo.roomMbrList[3] && roomInfo.roomMbrList[3] != null && roomInfo.roomMbrList[3] != "" ) {
			var photo4 = new Image();
			photo4.src = roomInfo.roomMbrList[3].mbrPhotoUrl;
			photo4.onload = function() { 
				var imgX = stdImgX;
		    	var imgY = canvasSize - imageSize - stdImgY;
				ctx.drawImage(photo4, imgX, imgY, imageSize, imageSize); 
			};
			
			var arcX = stdArcX;
		    var arcY = canvasSize - stdArcY;
			ctx.moveTo(arcX, arcY);
			ctx.arc(arcX, arcY, arcRadius, 0, Math.PI * 2);
	
			var nameX = stdNameX;
			var nameY = canvasSize - stdNameY/3;
			ctx.fillText(roomInfo.roomMbrList[3].mbrName, nameX, nameY);
		}
		
	    ctx.stroke();
		ctx.clip();
			
	}
}





function first(ctx, yn, type, canvasSize, stdArcX, stdArcY) {
	if(yn){
		if ( type == 1 ) {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(stdArcX, stdArcY);
			ctx.lineTo(canvasSize - stdArcX, stdArcY);
			ctx.stroke();
			
		} else {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(stdArcX, stdArcY);
			ctx.lineTo(canvasSize - stdArcX, stdArcY);
			ctx.stroke();
			
		}

	} else {

	}
};

function second(ctx, yn, type, canvasSize, stdArcX, stdArcY) {
	if (yn) {
		if ( type == 1 ) {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, stdArcY);
			ctx.lineTo(canvasSize - stdArcX, canvasSize - stdArcY);
			ctx.stroke();
			
		} else {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, stdArcY);
			ctx.lineTo(canvasSize - stdArcX, canvasSize - stdArcY);
			ctx.stroke();
			  
		}

	} else {

	}
};

function third(ctx, yn, type, canvasSize, stdArcX, stdArcY) {
	if (yn) {
		if ( type == 1 ) {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, canvasSize - stdArcY);
			ctx.lineTo(stdArcX, canvasSize - stdArcY);
			ctx.stroke();
		  
		} else {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, canvasSize - stdArcY);
			ctx.lineTo(stdArcX, canvasSize - stdArcY);
			ctx.stroke();
  
		}
		
	} else {

	}
};


function fourth(ctx, yn, type, canvasSize, stdArcX, stdArcY) {
	if (yn) {
		if ( type == 1 ) {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(stdArcX, canvasSize - stdArcY);
			ctx.lineTo(stdArcX, stdArcY);
			ctx.stroke();

		} else {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(stdArcX, canvasSize - stdArcY);
			ctx.lineTo(stdArcX, stdArcX);
			ctx.stroke();
			
		}

	} else {

	}
};

function horizontalLine(ctx, yn, type, canvasSize, stdArcX, stdArcY) {
	if (yn) {
		if ( type == 1 ) {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, canvasSize - stdArcY);
			ctx.lineTo(stdArcX, stdArcX);
			ctx.stroke();
		  
		} else {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, canvasSize - stdArcY);
			ctx.lineTo(stdArcX, stdArcX);
			ctx.stroke();
			
		}
	} else {

	}
};

function verticalLine(ctx, yn, type, canvasSize, stdArcX, stdArcY) {
	if (yn) {
		if ( type == 1 ) {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, stdArcY);
			ctx.lineTo(stdArcX, canvasSize - stdArcY);
			ctx.stroke();
	  
		} else {
			ctx.beginPath();
			ctx.lineWidth="5";
			ctx.strokeStyle="#33b4e4";
			ctx.moveTo(canvasSize - stdArcX, stdArcX);
			ctx.lineTo(stdArcX, canvasSize - stdArcY);
			ctx.stroke();
			  
		}
		
	} else {

	}
};


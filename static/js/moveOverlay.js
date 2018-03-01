var inFlag = false;
var from,type,index,sx,sy,width,height,radius;
var obj;

function checkIn(pos){
	// console.log(rects.length,remoteRects.length);
	var result = '';
	if(rects.length||remoteRects.length){
		// console.log('check in rect ?');
		result = checkInRect(pos.x,pos.y);
	}
	//先看是否在矩形中，再看是否在圆中
	if((circles.length||remoteCircles.length)&&result==''){
		// console.log('check in circle ?');
		result = checkInCircle(pos.x,pos.y);
	}
	if(result){
		changeObj(result.split('-')[0],result.split('-')[1]);
		index = parseInt(result.split('-')[2]);
		inFlag = true;
		// console.log(obj,index);
	}
}

//鼠标按下时是否在圆形中
function checkInCircle(x,y){
	// console.log('checking');
	var local_num = circles.length;
	var remote_num = remoteCircles.length;
	var cx,cy,r;
	for(var i=0;i<local_num;i++){
		cx = circles[i].x;
		cy = circles[i].y;
		r = circles[i].radius;
		if(Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy))<r){
			sx = circles[i].x;
			sy = circles[i].y;
			radius = circles[i].radius;
			// console.log('in local circle '+i);
			return 'local-circle-'+i;
		}
	}
	for(var i=0;i<remote_num;i++){
		cx = remoteCircles[i].x;
		cy = remoteCircles[i].y;
		r = remoteCircles[i].radius;
		if(Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy))<r){
			sx = remoteCircles[i].x;
			sy = remoteCircles[i].y;
			radius = remoteRects[i].radius;
			// console.log('in remote circle '+i);
			return 'remote-circle-'+i;
		}
	}
}

//鼠标按下时是否在矩形中
function checkInRect(x,y){
	var local_num = rects.length;
	var remote_num = remoteRects.length;
	for(var i=0;i<local_num;i++){
		if(x<(rects[i].x+rects[i].width)&&x>rects[i].x&&y<(rects[i].y+rects[i].height)&&y>rects[i].y){
			sx = rects[i].x;
			sy = rects[i].y;
			width = rects[i].width;
			height = rects[i].height;
			return 'local-rect-'+i;
		}
	}
	for(var i=0;i<remote_num;i++){
		if(x<(remoteRects[i].x+remoteRects[i].width)&&x>remoteRects[i].x&&y<(remoteRects[i].y+remoteRects[i].height)&&y>remoteRects[i].y){
			sx = remoteRects[i].x;
			sy = remoteRects[i].y;
			width = remoteRects[i].width;
			height = remoteRects[i].height;
			return 'remote-rect-'+i;
		}
	}
	return '';
}

/*松手后，将信息发送到server*/
function sendMoveToServer(x,y){
	if(ws_Status){
		ws.send(JSON.stringify({"type":"move","name":my_name,"x":sx+x,"y":sy+y,"obj":obj,"number":index}));
		console.log('send move msg to server.');
	}
}

/*改变相应元素的x,y值，并重绘*/
function move(x,y,type,number){
	var t = type||obj;
	var n = number==0?0:number||index;
	switch(t){
		case 1:
			rects[n].x = type?x:sx+x;
			rects[n].y = type?y:sy+y;
			drawCover();
		break;
		case 2:
			circles[n].x = type?x:sx+x;
			circles[n].y = type?y:sy+y;
			drawCover();
		break;
		case 3:
			remoteRects[n].x = type?x:sx+x;
			remoteRects[n].y = type?y:sy+y;
			drawCover();
		break;
		case 4:
			remoteCircles[n].x = type?x:sx+x;
			remoteCircles[n].y = type?y:sy+y;
			drawCover();
		break
	}
}

/*设置状态，表明移动矩形、圆形、远程、本地的哪种*/
function changeObj(from,type){
	if(from=='local'&&type=='rect'){
		// obj = 'rects';
		obj = 1;
	}else if(from=='local'&&type=='circle'){
		// obj = 'circles';
		obj = 2;
	}else if(from=='remote'&&type=='rect'){
		// obj = 'remoteRects';
		obj = 3;
	}else if(from=='remote'&&type=='circle'){
		// obj = 'remoteCircles';
		obj = 4;
	}
}

/*在矩形中鼠标拖动，做出拖动矩形效果*/
function drawMovedRect(x,y){
	clearCanvas(c_temp.getContext('2d'),c_temp.width,c_temp.height);
	ctx_temp.strokeRect(sx+x,sy+y,width,height);
}

/*在圆形中鼠标拖动，做出拖动圆形效果*/
function drawMovedCircle(x,y){
	clearCanvas(c_temp.getContext('2d'),c_temp.width,c_temp.height);
	ctx_temp.beginPath();
	ctx_temp.arc(sx+x,sy+y,radius,0,Math.PI*(2),false);
	ctx_temp.stroke();
	ctx_temp.closePath();
}
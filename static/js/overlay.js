var ctx_cover = c_cover.getContext('2d'),
	ctx_temp = c_temp.getContext('2d'),
	rects = [],
	circles = [],
	remoteRects = [],
	remoteCircles = [],
	flag_cover = false;

var start,end;

c_cover.onmousedown = function(e){
	flag = true;
	start = getPos(e);
	mode=='move'?checkIn(start):null;
	c_cover.onmousemove = function(e){
		temp = getPos(e);
		switch (mode)
		{
			case 'rect':
				drawTempRect(start.x,start.y,temp.x,temp.y);
				break;
			case 'circle':
				drawTempCircle(start.x,start.y,temp.x-start.x);
				break;
			case 'move':
				inFlag&&(obj==1||obj==3)?drawMovedRect(temp.x-start.x,temp.y-start.y):null;
				inFlag&&(obj==2||obj==4)?drawMovedCircle(temp.x-start.x,temp.y-start.y):null;
				break;
		}
	}
}

c_cover.onmouseup = function(e){
	clearCanvas(c_temp.getContext('2d'),c_temp.width,c_temp.height);
	flag = false;
	c_cover.onmousemove = '';
	end = getPos(e);
	switch (mode)
	{
		case 'rect':
			//记录矩形的左上角和右下角坐标
			addRect(start.x,start.y,end.x,end.y);
			sendRectToServer(start.x,start.y,end.x-start.x,end.y-start.y);
			drawCover();
			break;
		case 'circle':
			//记录圆心和半径
			addCircle(start.x,start.y,end.x-start.x);
			sendCircleToServer(start.x,start.y,end.x-start.x);
			drawCover();
			break;
		case 'move':
			//发送移动消息
			inFlag?sendMoveToServer(end.x-start.x,end.y-start.y):null;
			//重绘
			inFlag?move(end.x-start.x,end.y-start.y):null;
			inFlag = false;
			break;
	}
}

/*本地矩形存储*/
function addRect(sx,sy,ex,ey){
	rects.push({"x":sx,"y":sy,"width":ex-sx,"height":ey-sy});
}

/*绘制矩形，根据提供的obj,可绘制本地和远程的*/
function drawRect(obj){
	var length = obj.length;
	for(var i=0;i<length;i++){
		ctx_cover.strokeRect(obj[i].x,obj[i].y,obj[i].width,obj[i].height);
	}
}

/*按下鼠标，拖动后，临时绘制矩形*/
function drawTempRect(sx,sy,ex,ey){
	clearCanvas(c_temp.getContext('2d'),c_temp.width,c_temp.height);
	ctx_temp.strokeRect(sx,sy,ex-sx,ey-sy);
}

/*绘制远程的矩形*/
function drawRemoteRect(x,y,width,height){
	ctx_cover.strokeRect(x,y,width,height);
}

/*本地圆形存储*/
function addCircle(x,y,radius){
	radius = radius<0?-radius:radius;
	circles.push({"x":x,"y":y,"radius":radius});
}

/*绘制圆形，根据提供的obj，可绘制本地和远程的*/
function drawCircle(obj){
	var length = obj.length;
	for(var i=0;i<length;i++){
		ctx_cover.beginPath();
		ctx_cover.arc(obj[i].x,obj[i].y,obj[i].radius,0,Math.PI*(2),false);
		ctx_cover.stroke();
		ctx_cover.closePath();
	}
}

/*按下鼠标，拖动后，临时绘制圆形*/
function drawTempCircle(x,y,radius){
	radius = radius<0?-radius:radius;
	clearCanvas(c_temp.getContext('2d'),c_temp.width,c_temp.height);
	ctx_temp.beginPath();
	ctx_temp.arc(x,y,radius,0,Math.PI*(2),false);
	ctx_temp.stroke();//画空心圆
	ctx_temp.closePath();
}

/*绘制远程的圆形*/
function drawRemoteCircle(x,y,radius){
	ctx_cover.beginPath();
	ctx_cover.arc(x,y,radius,0,Math.PI*(2),false);
	ctx_cover.stroke();
	ctx_cover.closePath();
}

/*更新cover*/
function drawCover(){
	// console.log(remoteCircles);
	clearCanvas(c_cover.getContext('2d'),c_cover.width,c_cover.height);
	drawRect(rects);
	drawRect(remoteRects);
	drawCircle(circles);
	drawCircle(remoteCircles);
}

/*To服务器 => 添加矩形*/
function sendRectToServer(x,y,width,height){
	if(ws_Status){
		ws.send(JSON.stringify({"type":"addRect","name":my_name,"x":x,"y":y,"width":width,"height":height}));
	}
}

/*To服务器 => 添加圆形*/
function sendCircleToServer(x,y,radius){
	radius = radius<0?-radius:radius;
	if(ws_Status){
		ws.send(JSON.stringify({"type":"addCircle","name":my_name,"x":x,"y":y,"radius":radius}));
	}
}
var ctx_line = c_line.getContext('2d'),
	MyPoints = [],
	OtherPoints = [],
	flag_line = false;

c_line.onmousedown = function(e){
	flag_line = true;
	MyPoints.push(getPos());
	c_line.onmousemove = function(e){
		MyPoints.push(getPos());
		if(flag_line&&MyPoints.length>=2){
			sendPointToServer(MyPoints[0].x,MyPoints[0].y);
			ctx_line.beginPath();
			ctx_line.moveTo(MyPoints[0].x,MyPoints[0].y);
			ctx_line.lineTo(MyPoints[1].x,MyPoints[1].y);
			ctx_line.stroke();
			ctx_line.closePath();
			MyPoints.shift();
		}
	}
}

c_line.onmouseup = function(e){
	flag_line = false;
	c_line.onmousemove = '';
	MyPoints = [];
	ws.send(JSON.stringify({"type":"stop"}));
}

function drawLine(){
	if(OtherPoints.length>=2){
		ctx_line.beginPath();
		ctx_line.moveTo(OtherPoints[0].x,OtherPoints[0].y);
		ctx_line.lineTo(OtherPoints[1].x,OtherPoints[1].y);
		ctx_line.stroke();
		ctx_line.closePath();
		OtherPoints.shift();
	}
}

function sendPointToServer(x,y){
	if(ws_Status){
		ws.send(JSON.stringify({"type":"point","name":my_name,"x":x,"y":y}));
	}
}
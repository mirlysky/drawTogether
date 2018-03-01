var ws = new WebSocket("ws://192.168.137.88:3001/");
var ws_Status = false;
var my_name = '';
var timer ;

ws.onopen = function(){
	ws_Status = true;
	console.log("连接成功");
};

ws.onmessage = function(evt){
	var jsonObj = JSON.parse(evt.data);
	switch (jsonObj.type)
	{
		case 'welcome':
			getWelcome(jsonObj);
			break;
		case 'point':
			getPoint(jsonObj);
			break;
		case 'addRect':
			getRect(jsonObj);
			break;
		case 'addCircle':
			getCircle(jsonObj);
			break;
		case 'stop':
			stopDraw();
			break;
		case 'clear':
			console.log('clear');
			rects = [];
			remoteRects = [];
			circles = [];
			remotoCircles = [];
			clearCanvas(c_line.getContext('2d'),c_line.width,c_line.height);
			clearCanvas(c_cover.getContext('2d'),c_line.width,c_line.height);
			clearCanvas(c_temp.getContext('2d'),c_line.width,c_line.height);
			break;
		case 'move':
			console.log('receive move msg.');
			move(jsonObj.x,jsonObj.y,jsonObj.obj,jsonObj.number);
			break;
	}
};

ws.onclose = function(){
	console.log('close');
};

ws.onerror = function(err){
	console.log('err: '+err)
};

/*获取远程绘制的点*/
function getPoint(jsonObj){
	OtherPoints.push({"x":jsonObj.x,"y":jsonObj.y});
	drawLine();
}

/*获取远程绘制的矩形*/
function getRect(jsonObj){
	remoteRects.push({"x":jsonObj.x,"y":jsonObj.y,"width":jsonObj.width,"height":jsonObj.height});
	drawRemoteRect(jsonObj.x,jsonObj.y,jsonObj.width,jsonObj.height);
}

/*获取远程绘制的圆*/
function getCircle(jsonObj){
	remoteCircles.push({"x":jsonObj.x,"y":jsonObj.y,"radius":jsonObj.radius});
	drawRemoteCircle(jsonObj.x,jsonObj.y,jsonObj.radius);
}

function stopDraw(){
	OtherPoints = [];
}

/*获取当前server在线人数和自己的昵称*/
function getWelcome(jsonObj){
	my_name = jsonObj.name;
	console.log(jsonObj.name+",\n当前在线："+jsonObj.num+"");
}
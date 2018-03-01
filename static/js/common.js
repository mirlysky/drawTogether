var c_line = document.querySelector('#line-canvas'),
	c_cover = document.querySelector('#cover-canvas'),
	c_temp = document.querySelector('#temp-canvas'),
	btn_clear = document.querySelector('#clear'),
	btn_line = document.querySelector('#line'),
	btn_rect = document.querySelector('#rect'),
	btn_circle = document.querySelector('#circle'),
	btn_move = document.querySelector('#move')
	btn_color = document.querySelector('#color');

var mode = '';

window.onload = function(){

	resizeCanvas(c_line);
	resizeCanvas(c_cover);
	resizeCanvas(c_temp);

	/*点击左侧按钮，改变当前模式，将画布设置到顶部*/
	
	btn_clear.addEventListener('click',function(){
		rects = [];
		remoteRects = [];
		circles = [];
		remoteCircles = [];
		
		ws.send(JSON.stringify({"type":"clear","name":my_name}));
		clearCanvas(c_line.getContext('2d'),c_line.width,c_line.height);
		clearCanvas(c_cover.getContext('2d'),c_line.width,c_line.height);
		clearCanvas(c_temp.getContext('2d'),c_line.width,c_line.height);
	},false);

	btn_line.addEventListener('click',function(){
		mode = 'line';
		this.className = 'btn active';
		btn_rect.className = 'btn';
		btn_circle.className = 'btn';
		btn_move.className = 'btn';
		btn_color.className = 'btn';
		c_line.className = 'top';
		c_cover.className = '';
	},false);

	btn_rect.addEventListener('click',function(){
		mode = 'rect';
		this.className = 'btn active';
		btn_line.className = 'btn';
		btn_circle.className = 'btn';
		btn_move.className = 'btn';
		btn_color.className = 'btn';
		c_line.className = '';
		c_cover.className = 'top';
	});

	btn_circle.addEventListener('click',function(){
		mode = 'circle';
		this.className = 'btn active';
		btn_line.className = 'btn';
		btn_rect.className = 'btn';
		btn_move.className = 'btn';
		btn_color.className = 'btn';
		c_line.className = '';
		c_cover.className = 'top';
	});

	btn_move.addEventListener('click',function(){
		mode = 'move';
		this.className = 'btn active';
		btn_line.className = 'btn';
		btn_rect.className = 'btn';
		btn_circle.className = 'btn';
		btn_color.className = 'btn';
		c_line.className = '';
		c_cover.className = 'top';
	});

	btn_color.addEventListener('click',function(){
		mode = 'color';
		this.className = 'btn active';
		btn_line.className = 'btn';
		btn_rect.className = 'btn';
		btn_circle.className = 'btn';
		btn_move.className = 'btn';
		c_line.className = '';
		c_cover.className = 'top';
	});
};

/*窗口尺寸改变时，改变canvas大小*/
window.onresize = function(){
	resizeCanvas(c_line);
	resizeCanvas(c_cover);
	resizeCanvas(c_temp);
};

/*获取鼠标在当前画布中的位置*/
function getPos(e){
	var ctx = c_line.getContext('2d');
	var e = window.event||e;
	var rect = c_line.getBoundingClientRect();
	var curX = e.clientX - rect.left;
	var curY = e.clientY - rect.top;
	return({x:curX,y:curY});
}

/*清空画布*/
function clearCanvas(ctx,width,height){
	ctx.clearRect(0,0,width,height);
}

/*窗口尺寸改变时重绘画布*/
function resizeCanvas(canvas){
	var parent = document.querySelector('.line-canvas');
	// var ctx=canvas.getContext('2d');	
	canvas.height = parent.clientHeight;
	canvas.width = parent.clientWidth;
}

/*重绘画布*/
function drawScene(){
	clearCanvas();
}
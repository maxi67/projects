let level = 0,
	score = 0,
	gscore = 0,
	countblink = 10,
	ghost = false;

let player = {
	x:50,
	y:100,
	pacmouth:320,
	pacdir:0,
	psize:32,
	speed:10
}

let enemy = {
	x: 200,
	y: 150,
	speed: 0,
	speedbase: 0,
	dirx: 0,
	diry: 0,
	ghostNum: 0,
	moving: 0,
	flash: 0
}

let powerdot = {
	x: 15,
	y: 155,
	powerup: false,
	pcountdown:0,
	ghostNum:0,
	eaten: false
}

function init(){
	let can = document.createElement('canvas');
	let container = document.querySelector("#main_container");
	container.innerHTML = ""; //clear choose mode
	can.width = 600;
	can.height = 400;
	
	mainImage = new Image();
	mainImage.ready = false;
	mainImage.onload = checkReady;
	mainImage.src = 'img/pac.png';

	let keyClick = {};
	document.addEventListener("keydown", function(event){
		keyClick[event.keyCode]=true;
		move(keyClick);
	},false);
	
	document.addEventListener("keyup", function(event){
		delete keyClick[event.keyCode];
	},false);
	
	let div_board = document.createElement("div");
	let board = document.createElement("span");
	let board2 = document.createElement("span");	
	board.id = "board";
	board.className = "board";
	board.textContent = "Pcman : "+score+" VS Ghost : " + gscore;
	board.style.marginRight = "100px";	
	board2.className = "board level";
	board2.textContent = "Enemy Level(1~5): " + level;
	
	let div_btn = document.createElement("div");
	let btn_stop = document.createElement("button");
	let btn_easy = document.createElement("button");
	btn_stop.textContent = "End Game";
	btn_stop.style.marginRight = "30px";	
	btn_easy.textContent = "Let Me Stronger!";
	
	btn_stop.onclick = function (){
		level = 0;
		container.innerHTML = "";
	//	chooseMode();
	};
	btn_easy.onclick = function (){
		btn_easy.textContent = "Good Luck:P";
		player.speed += 10;
		btn_easy.disabled = true;
	};
	
	div_board.appendChild(board);
	div_board.appendChild(board2);
	div_btn.appendChild(btn_stop);
	div_btn.appendChild(btn_easy);
	
	container.appendChild(div_btn);
	container.appendChild(div_board);
	container.appendChild(can);
}

function chooseMode(){
	let container = document.querySelector("#main_container");
	container.innerHTML="";

	var p_set = new Array(document.createElement("p"),
		document.createElement("p"),
		document.createElement("p"),
		document.createElement("p"),
		document.createElement("p"),
		document.createElement("p"),
		document.createElement("p"));
		
	var comp_set = new Array(document.createElement("img"),
		document.createElement("label"),
		document.createElement("button"),
		document.createElement("button"),
		document.createElement("button"),
		document.createElement("button"),
		document.createElement("button"));
	
	//IMG
	comp_set[0].src = 'img/cover.png';
	
	//Label
	comp_set[1].textContent = "Choose Mode";
	comp_set[1].style.fontSize = "30px";
	comp_set[1].style.fontFamily = "Lobster";
	
	//Buttons
	comp_set[2].textContent = "Super Easy";
	comp_set[3].textContent = "Easy";
	comp_set[4].textContent = "Normal";
	comp_set[5].textContent = "Hard";
	comp_set[6].textContent = "Boss";
		
	comp_set[2].onclick = function (){
		level = 1;
		enemy.speedbase = 1;
		init();
	};
	
	comp_set[3].onclick = function (){
		level = 2;
		enemy.speedbase = 2;
		init();
	};
	
	comp_set[4].onclick = function (){
		level = 3;
		enemy.speedbase = 4;
		init();
	};
	
	comp_set[5].onclick = function (){
		level = 4;
		enemy.speedbase = 6;
		init();
	};
	
	comp_set[6].onclick = function (){
		level = 5;
		enemy.speedbase = 12;
		init();
	};
	
	for (let i = 0; i < p_set.length; i++){
		p_set[i].appendChild(comp_set[i]);
		p_set[i].align = "Center";
		container.appendChild(p_set[i]);
	}
}

function move(keyClick){
	let can = document.querySelector("canvas");
	if (37 in keyClick){
		player.x -= player.speed
		player.pacdir = 64;
	}
	if (38 in keyClick){
		player.y -= player.speed
		player.pacdir = 96;
	}
	if (39 in keyClick){
		player.x += player.speed
		player.pacdir = 0;
	}
	if (40 in keyClick){
		player.y += player.speed
		player.pacdir = 32;
	}
	if (player.x > (can.width-32)){
		player.x = 0;
	}
	if (player.y > (can.height-32)){
		player.y = 0;
	}
	if (player.x < 0){
		player.x = can.width-32;
	}
	if (player.y < 0){
		player.y = can.height-32;
	}
	if (player.pacmouth == 320)
		player.pacmouth = 352;
	else
		player.pacmouth = 320;
	
	render();
}

function checkReady(){
	this.ready = true;
	playGame();
}

function playGame(){
	render();
	requestAnimationFrame(playGame);
}

function getRandom(n){
	return Math.floor(Math.random()*n);
}

function render(){
	if (level == 0)
		return;
	let can = document.querySelector("canvas");
	let context = can.getContext('2d');
	context.fillStyle = "black";
	context.fillRect(0, 0, can.width, can.height);

	if (!powerdot.powerup && powerdot.pcountdown < 5){
		powerdot.x = getRandom(400)+25;
		powerdot.y = getRandom(250)+1;
		powerdot.powerup = true;
	}

	// Create enemy
	if (!ghost){
		enemy.ghostNum = getRandom(5) * 64;
		enemy.x = getRandom(450)+30;
		enemy.y = getRandom(250)+30;
		ghost = true;
	}
	
	// Enemy Move
	if (enemy.moving < 0){
		if (level >= 4) { 
			enemy.moving = (getRandom(20))+1;
		}
		else {
			enemy.moving = (getRandom(30)*3)+getRandom(1);
		}	
		
		enemy.dirx = 0;
		enemy.diry = 0;
		enemy.speed = (getRandom(enemy.speedbase)+1)/2; //speed
		
		//enemy run away
		if (powerdot.eaten)
			enemy.speed = -0.5;	
			

		if (enemy.moving % 2){
			if (player.x < enemy.x)
				enemy.dirx = -enemy.speed;
			else
				enemy.dirx = enemy.speed;
		}
			
		else {
			if (player.y < enemy.y)
				enemy.diry = -enemy.speed;
			else
				enemy.diry = enemy.speed;
		}
	}
	enemy.moving--;
	enemy.x += enemy.dirx;
	enemy.y += enemy.diry;
	
	if (enemy.x > (can.width-32)){
		enemy.x = 0;
	}
	if (enemy.y > (can.height-32)){
		enemy.y = 0;
	}
	if (enemy.x < 0){
		enemy.x = can.width-32;
	}
	if (enemy.y < 0){
		enemy.y = can.height-32;
	}
	
	//Collision detection ghost
	if(player.x <= (enemy.x+32) && enemy.x <= (player.x+32) && player.y <= (enemy.y+32) &&
		enemy.y <= (player.y +32)){
		console.log('ghost');
		if (powerdot.eaten)
			score++;
		else
			gscore++;
		//reset
		player.x = 100;
		player.y = 100;
		enemy.x = 500;
		enemy.y = 100;
		powerdot.pcountdown = 0;
	}

	//Collision detection
	if(player.x <= powerdot.x && powerdot.x <= (player.x+32) && player.y <= powerdot.y &&
		powerdot.y <= (player.y +32)){
		powerdot.x = 0;
		powerdot.y = 0;
		console.log('hit');
		powerdot.powerup = false;
		powerdot.pcountdown = 500;
		powerdot.ghostNum = enemy.ghostNum;
		enemy.ghostNum = 384;
		powerdot.eaten = true;
	}
	
	//Judge winner
	if (score >= 10 || gscore >= 10){
		level = 0;
		let container = document.querySelector("#main_container");
		container.innerHTML = ""; //clear chhose mode
		
		let p_1 = document.createElement("p");
		let p_2 = document.createElement("p");
		let p_3 = document.createElement("p");
		p_1.align = "Center";
		p_2.align = "Center";
		p_3.align = "Center";

		let img = document.createElement("img");	
		if (score >= 10)
			img.src = 'img/win.png';
		else
			img.src = 'img/lose.png';
		
		let label = document.createElement("label");
		let label2 = document.createElement("label");
		label.textContent = "挑戰不同難度試試吧！";
		label2.textContent = "按 F5 或重新整理網頁以繼續...";
		label.style.fontSize = "30px";
		label2.style.fontSize = "20px";
		p_1.appendChild(img);
		p_2.appendChild(label);
		p_3.appendChild(label2);
		container.appendChild(p_1);
		container.appendChild(p_2);
		container.appendChild(p_3);
	}
	
	if (powerdot.eaten){
		powerdot.pcountdown--;
		if (powerdot.pcountdown <= 0){
			powerdot.eaten = false;
			enemy.ghostNum = powerdot.ghostNum;
		}
	}

	if (powerdot.powerup){
		context.fillStyle = "#ffffff";
		context.beginPath();
		context.arc(powerdot.x,powerdot.y,10,0,Math.PI*2,true);
		context.closePath();
		context.fill();
	}
	
	//flash 
	if (countblink > 0)
		countblink--;
	else {
		countblink = 15; //bigger, frequency slower
		if (enemy.flash == 0) 
			enemy.flash = 32;
		else 
			enemy.flash = 0;
	}

	//src,xfrom,yfrom,xwidth,ywidth,posx,posy,xwidth,ywidth
	context.drawImage(mainImage,enemy.ghostNum,enemy.flash,32,32,enemy.x,enemy.y,32,32);
	context.drawImage(mainImage,player.pacmouth,player.pacdir,32,32,player.x,player.y,32,32);
	
	if (level > 0){
		let board = document.querySelector("#board");
		board.innerHTML = "PC-Man :"+score+" VS Ghost :" + gscore;
	}
	
	
}

//Main Function
chooseMode();


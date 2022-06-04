var countInterval;
var notice;
var number;

var objectMap;
var functionMap;

var stats;

var canvas;
var ctx;

var barrageCanvas;
var barrageCtx;

var selfCanvas;
var selfCtx;

var otherCanvas;
var otherCtx;

var backCanvas;
var backCtx;

var filterCanvas;
var filterCtx;

var barrageImg;
var selfImg;
var otherImg;
var backImg;
var filterImg;

var webSocket;

var characterId;

document.addEventListener('DOMContentLoaded', function() {
	initializeStatsDom();
	initializeVariables();
	initializeControlEvent();
	initializeDefaultServerIP();
});

function initializeStatsDom() {
	stats = new Stats();
	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	
	document.getElementById('stageWrapper').appendChild(stats.dom);
}

function initializeVariables() {
	objectMap = new Map();
	
	functionMap = new Map();
	functionMap.set('B', handleBarrage);
	functionMap.set('C', handleCharacter);
	functionMap.set('I', handleId);
	functionMap.set('S', handleStart);
	functionMap.set('O', handleOn);
	functionMap.set('E', handleError);
	functionMap.set('R', handleResult);

	canvas = document.getElementById('stage');
	ctx = canvas.getContext('2d');

	barrageImg = new Image();
	barrageImg.src = './resources/bt/raindrop.png';
	barrageImg.onload = function() {
		barrageCanvas = document.createElement('canvas');
		barrageCtx = barrageCanvas.getContext('2d');

		barrageCanvas.width = 60;
		barrageCanvas.height = 60;

		barrageCtx.drawImage(barrageImg, 0, 0);
	};

	selfImg = new Image();
	selfImg.src = './resources/bt/character_self.png';
	selfImg.onload = function() {
		selfCanvas = document.createElement('canvas');
		selfCtx = selfCanvas.getContext('2d');

		selfCanvas.width = 60;
		selfCanvas.height = 60;

		selfCtx.drawImage(selfImg, 0, 0);
	};

	otherImg = new Image();
	otherImg.src = './resources/bt/character_other.png';
	otherImg.onload = function() {
		otherCanvas = document.createElement('canvas');
		otherCtx = otherCanvas.getContext('2d');

		otherCanvas.width = 60;
		otherCanvas.height = 60;

		otherCtx.drawImage(otherImg, 0, 0);
	};

	backImg = new Image();
	backImg.src = './resources/bt/background.png';
	backImg.onload = function() {
		backCanvas = document.createElement('canvas');
		backCtx = backCanvas.getContext('2d');

		backCanvas.width = 800;
		backCanvas.height = 800;

		backCtx.drawImage(backImg, 0, 0);
	};

	filterImg = new Image();
	filterImg .src = './resources/bt/filter.png';
	filterImg .onload = function() {
		filterCanvas = document.createElement('canvas');
		filterCtx = filterCanvas.getContext('2d');

		filterCanvas.width = 800;
		filterCanvas.height = 800;

		filterCtx.drawImage(filterImg, 0, 0);

		currStart = performance.now();
		window.requestAnimationFrame(render);
	};

	notice = document.getElementById('notice');
	number = 3;
}

async function render() {
	stats.begin();
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(backCanvas, 0, 0);
	
	objectMap.forEach(value => value.draw());
	
	if (document.querySelector('input[name="filter"]:checked').value == 'true') {
		ctx.drawImage(filterCanvas, 0, 0);
	}
	
	stats.end();
	
	window.requestAnimationFrame(render);
}

function initializeWebSocket() {
	if (webSocket != null) {
		webSocket.close();
	}

	webSocket = new WebSocket(document.getElementById('ip').value);

	webSocket.onopen = function() {
		console.log('webSocket open');
		waitReadyState();
	};

	webSocket.onclose = function() {
		console.log('webSocket close');
	};

	webSocket.onmessage = handleMessage;
}

function handleMessage(e) {
	//console.log(Date.now());
	
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	//ctx.drawImage(backCanvas, 0, 0);

	objectMap.clear();

	var dataList = e.data.split(':');
	dataList
		.map(splitData)
		.forEach(callFunction);
}

function splitData(data) {
	return data.split(',');
}

function callFunction(dataArray) {
	var func = functionMap.get(dataArray[0]);
	func(dataArray);
}

function handleBarrage(dataArray) {
	var barrage = objectMap.get(dataArray[1]);
	if (typeof barrage == 'undefined') {
		barrage = new Barrage(dataArray);
		
		objectMap.set(dataArray[1], barrage);
		return;
	}
	
	barrage.update(dataArray);
}

function handleCharacter(dataArray) {
	var character = objectMap.get(dataArray[1]);
	if (typeof barrage == 'undefined') {
		character = new Character(dataArray);
		
		objectMap.set(dataArray[1], character);
		return;
	}
	
	barrage.update(dataArray);
}

function handleId(dataArray) {
	characterId = dataArray[1];
	console.log('character id: ' + characterId);
}

function handleStart() {
	countInterval = setInterval(showCount, 1000);
	showCount();
}

function showCount() {
	notice.style['font-size'] = '';

	if (number == 0) {
		notice.innerText = '';
		number = 3;
		clearInterval(countInterval);
		return;
	}

	notice.innerText = number;
	number--;
}

function handleOn() {
	notice.style['font-size'] = '20px';
	notice.innerText = '게임 진행 중';
}

function handleError() {
	notice.style['font-size'] = '20px';
	notice.innerText = '플레이어가 모두 접속하지 않아 게임을 시작할 수 없습니다.';
}

function handleResult(dataArray) {
	var result = Number(dataArray[1]) / 1000;

	notice.style['font-size'] = '20px';
	notice.innerText = '기록: ' + result + ' 초 ';
}

function initializeControlEvent() {
	document.addEventListener('keydown', function(e) {
		if (e.code == 'ArrowRight') {
			webSocket.send('RON');
		}
		else if (e.code == 'ArrowLeft') {
			webSocket.send('LON');
		}
		else if (e.code == 'Space') {
			notice.innerText = '';
			initializeWebSocket();
		}
		else if (e.code == 'Enter') {
			webSocket.send('START');
		}
	});

	document.addEventListener('keyup', function(e) {
		if (e.code == 'ArrowRight') {
			webSocket.send('ROFF');
		}
		else if (e.code == 'ArrowLeft') {
			webSocket.send('LOFF');
		}
	});
	
	document.getElementById('ipSelect').addEventListener('change', function() {
		var ipSelected = this.options[this.selectedIndex].value;
		var input = document.getElementById('ip');
		
		if (ipSelected == '') {
			input.value = '';
			input.disabled = false;
			
		} else {
			input.value = 'wss://' + ipSelected + '/break';
			input.disabled = true;
		}
	});
}

function initializeDefaultServerIP() {
	document.getElementById('ip').value = 'wss://jase.iptime.org:45000/break';
	window.open('./bt_ws.html', 'Web socket connection allowed.', 'width=400px, height=400px');
}

function waitReadyState() {
	var opened = connection(webSocket);
	if (opened) {
		webSocket.send('REQUEST_ID');
	}
}

async function connection(socket) {
	let loop = 0;
	
	while (socket.readyState == WebSocket.CONNECTING && loop < 100) {
		await new Promise(sleep);
		loop++;
	}
	
	return socket.readyState == WebSocket.OPEN;
}

function sleep(resolve, time = 100) {
	setTimeout(resolve, time)
}
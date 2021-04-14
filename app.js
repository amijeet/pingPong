const canvas = document.querySelector(".drawingArea");
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext("2d");

var numberOfBalls = document.getElementById("numberOfBalls").value;
var sizeOfBalls = document.getElementById("sizeOfBalls").value;
var velocityOfBalls = document.getElementById("velocityOfBalls").value;
var requestId;

var count = 0;
var balls = [];

function degToRad(degree) {
	return (Math.PI / 180) * degree;
}

function rbgToString(r, g, b) {
	return "rgb(" + r + ", " + g + ", " + b + ")";
}

function getRandomInt(x, y) {
	return Math.round(Math.random() * (y - x) + x);
}

function init() {
	balls = [];
	count = 0;
	for (var i = 0; i < numberOfBalls; i++) {
		balls.push([]);
		balls[i].push(getRandomInt(100, width - 100)); //x, y, and radius
		balls[i].push(getRandomInt(100, height - 100));
		balls[i].push(getRandomInt(sizeOfBalls - 20, sizeOfBalls));
		balls[i].push(getRandomInt(-velocityOfBalls, velocityOfBalls)); //x and y velocities
		balls[i].push(getRandomInt(-velocityOfBalls, velocityOfBalls));
		balls[i].push(getRandomInt(0, 255)); //rgb values
		balls[i].push(getRandomInt(0, 255));
		balls[i].push(getRandomInt(0, 255));
	}
}

function drawBalls() {
	ctx.clearRect(0, 0, width, height);
	for (var i = 0; i < numberOfBalls; i++) {
		ctx.beginPath();
		ctx.arc(balls[i][0] + balls[i][3], balls[i][1] + balls[i][4], balls[i][2], degToRad(0), degToRad(360));
		ctx.fillStyle = rbgToString(balls[i][5], balls[i][6], balls[i][7]);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(balls[i][0] + balls[i][3], balls[i][1] + balls[i][4], balls[i][2] + 1, degToRad(0), degToRad(360));
		ctx.lineWidth = 5;
		ctx.stroke();
		if (balls[i][0] + balls[i][2] > width || balls[i][0] - balls[i][2] < 0) {
			balls[i][3] = -balls[i][3];
			count += 1;
			balls[i][5] = getRandomInt(0, 255);
			balls[i][6] = getRandomInt(0, 255);
			balls[i][7] = getRandomInt(0, 255);
		}
		if (balls[i][1] + balls[i][2] > height || balls[i][1] - balls[i][2] < 0) {
			balls[i][4] = -balls[i][4];
			count += 1;
			balls[i][5] = getRandomInt(0, 255);
			balls[i][6] = getRandomInt(0, 255);
			balls[i][7] = getRandomInt(0, 255);
		}
		balls[i][0] += balls[i][3];
		balls[i][1] += balls[i][4];
	}
	document.getElementById("numberOfCollisions").innerHTML = count;
	requestId = window.requestAnimationFrame(drawBalls);
}

function start() {
	window.cancelAnimationFrame(requestId);
	balls = [];
	numberOfBalls = document.getElementById("numberOfBalls").value;
	sizeOfBalls = document.getElementById("sizeOfBalls").value;
	velocityOfBalls = document.getElementById("velocityOfBalls").value;
	init();
	drawBalls();
}

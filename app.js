const canvas = document.querySelector(".drawingArea");
const c = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

// GLOBAL VARIABLES
var balls;
var requestID;
var count = 0;

// FUNCTIONS
function degToRad(degree) {
	return (Math.PI / 180) * degree;
}

function randomInt(max, min) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomRGB() {
	let r = randomInt(0, 255);
	let b = randomInt(0, 255);
	let g = randomInt(0, 255);

	return "rgb(" + r + ", " + g + ", " + b + ")";
}

function isColliding(ball1, ball2) {
	if (Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2) <= ball1.r + ball2.r) return true;
	else return false;
}

function init() {
	balls = [];

	for (var i = 0; i < 20; i++) {
		balls.push(returnBall());
		for (var j = 0; j < balls.length - 1; j++) {
			if (isColliding(balls[i], balls[j])) {
				balls[i] = returnBall();
				j = -1;
			}
		}
	}
}

function returnBall() {
	ball = {
		r: randomInt(50, 80),
		x: randomInt(100, width - 100),
		y: randomInt(100, height - 100),
		get mass() {
			return 1 + this.r / 10 - 3;
		},
		vx: randomInt(-5, 5),
		vy: randomInt(-5, 5),
		color: randomRGB(),
	};
	return ball;
}

function draw(ball) {
	c.beginPath();
	c.arc(ball.x, ball.y, ball.r, degToRad(0), degToRad(360));
	c.lineWidth = 6;
	c.stroke();
	c.beginPath();
	c.arc(ball.x, ball.y, ball.r, degToRad(0), degToRad(360));
	c.fillStyle = ball.color;
	c.fill();
}

function resolveCollision(ball1, ball2) {
	const xVelocityDiff = ball1.vx - ball2.vx;
	const yVelocityDiff = ball1.vy - ball2.vy;

	const xDistDiff = ball1.x - ball2.x;
	const yDistDiff = ball1.y - ball2.y;

	const m1 = ball1.mass;
	const m2 = ball2.mass;

	const v1x = ball1.vx;
	const v2x = ball2.vx;
	const v1y = ball1.vy;
	const v2y = ball2.vy;

	if (xVelocityDiff * xDistDiff + yVelocityDiff * yDistDiff >= 0) {
		return;
	}

	var dotProduct = xVelocityDiff * xDistDiff + yVelocityDiff * yDistDiff;
	const squareOfDistance = xDistDiff ** 2 + yDistDiff ** 2;
	const massFraction1 = (2 * m2) / (m1 + m2);
	const massFraction2 = (2 * m1) / (m1 + m2);

	var v1xFinal = v1x - (massFraction1 * dotProduct * xDistDiff) / squareOfDistance;
	var v1yFinal = v1y - (massFraction1 * dotProduct * yDistDiff) / squareOfDistance;
	var v2xFinal = v2x - (massFraction2 * dotProduct * -1 * xDistDiff) / squareOfDistance;
	var v2yFinal = v2y - (massFraction2 * dotProduct * -1 * yDistDiff) / squareOfDistance;

	ball1.vx = v1xFinal;
	ball1.vy = v1yFinal;
	ball2.vx = v2xFinal;
	ball2.vy = v2yFinal;
}

function update(ball) {
	draw(ball);

	for (var i = 0; i < balls.length; i++) {
		if (ball === balls[i]) continue;
		if (isColliding(ball, balls[i])) {
			resolveCollision(ball, balls[i]);
			ball.color = randomRGB();
			balls[i].color = randomRGB();
		}
	}
	if (ball.x - ball.r <= 0 || ball.x + ball.r >= width) {
		ball.vx = -1 * ball.vx;
	}
	if (ball.y - ball.r <= 0 || ball.y + ball.r >= height) {
		ball.vy = -1 * ball.vy;
	}
	ball.x += ball.vx;
	ball.y += ball.vy;
}

function animate() {
	c.clearRect(0, 0, width, height);
	balls.forEach(function (ball) {
		update(ball);
	});
	requestID = requestAnimationFrame(animate);
}

init();
animate();

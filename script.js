const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const resetBtn = document.getElementById("resetBtn");
const ballCount = document.getElementById("ballCount");
const gameMessage = document.getElementById("gameMessage");

const MAX_BALLS = 20;
const START_BALLS = 10;

let balls = [];
let gravity = 0.02;

function randomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

class Ball {

    constructor(x, y, radius, color, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {

        if (this.x + this.radius >= canvas.width) {
            this.velocityX *= -1;
            this.x = canvas.width - this.radius;
        }

        if (this.x - this.radius <= 0) {
            this.velocityX *= -1;
            this.x = this.radius;
        }

        if (this.y + this.radius >= canvas.height) {
            this.velocityY *= -1;
            this.y = canvas.height - this.radius;
        }

        if (this.y - this.radius <= 0) {
            this.velocityY *= -1;
            this.y = this.radius;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    update() {
        this.move();
        this.draw();
    }

}

class MovingBall extends Ball {

    update() {
        this.velocityY += gravity;
        this.move();
        this.draw();
    }

}

function updateCounter() {
    ballCount.textContent = `Balls: ${balls.length} / ${MAX_BALLS}`;
}

function createBall(x, y) {

    if (balls.length >= MAX_BALLS) {
        gameMessage.textContent = "GAME OVER";
        return;
    }

    const radius = Math.floor(Math.random() * 15) + 10;

    let velocityX = Math.random() * 4 + 2;
    let velocityY = Math.random() * 4 + 2;

    if (Math.random() < 0.5) velocityX *= -1;
    if (Math.random() < 0.5) velocityY *= -1;

    const color = randomColor();

    let ball;

    if (Math.random() < 0.5) {
        ball = new Ball(
            x,
            y,
            radius,
            color,
            velocityX,
            velocityY
        );
    } else {
        ball = new MovingBall(
            x,
            y,
            radius,
            color,
            velocityX,
            velocityY
        );
    }

    balls.push(ball);

    updateCounter();
}
function initializeBalls() {

    balls = [];
    gameMessage.textContent = "";

    for (let i = 0; i < START_BALLS; i++) {

        const radius = Math.floor(Math.random() * 15) + 10;

        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;

        createBall(x, y);

    }

    updateCounter();

}

canvas.addEventListener("click", function (event) {

    if (balls.length >= MAX_BALLS) {
        gameMessage.textContent = "GAME OVER";
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    createBall(x, y);

});

resetBtn.addEventListener("click", function () {

    initializeBalls();

});

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
    }

    requestAnimationFrame(animate);

}

initializeBalls();

animate();
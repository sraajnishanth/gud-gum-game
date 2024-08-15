// Author: S.Raaj Nishanth

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

let bubbles = [];
let bullets = [];
let score = 0;

class Bubble {
    constructor(x, y, radius, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.type = type;
        this.dy = Math.random() * 2 + 1; // Bubble speed
    }

    draw() {
        ctx.beginPath();
        if (this.type === 'gudgum') {
            ctx.fillStyle = '#ff4081';
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'pink';
        } else {
            ctx.fillStyle = '#757575';
        }
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y -= this.dy;
        this.draw();
    }

    explode() {
        let color = this.type === 'gudgum' ? `hsl(${Math.random() * 360}, 100%, 50%)` : '#000000';
        for (let i = 0; i < 20; i++) {
            createParticle(this.x, this.y, color);
        }
        createPointDisplay(this.x, this.y, this.type === 'gudgum' ? '+10' : '-5');
    }
}

class Particle {
    constructor(x, y, size, color, speedX, speedY, lifetime) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.lifetime = lifetime;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.lifetime--;
        this.draw();
    }
}

class PointDisplay {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.alpha = 1;
        this.lifetime = 30;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#FF0000';  // Deep red color
        ctx.font = 'bold 20px Arial';  // Bold font
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

    update() {
        this.y -= 1;
        this.alpha -= 0.03;
        this.lifetime--;
        this.draw();
    }
}

class MessageDisplay {
    constructor(x, y, text, emoji) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.emoji = emoji;
        this.alpha = 1;
        this.lifetime = 60;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.text} ${this.emoji}`, this.x, this.y);
        ctx.restore();
    }

    update() {
        this.alpha -= 0.02;
        this.lifetime--;
        this.draw();
    }
}


class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dy = -5; // Bullet speed
        this.radius = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.dy;
        this.draw();
    }
}

class Gun {
    constructor() {
        this.width = 50;
        this.height = 30;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 20;
        this.dx = 10;  // Gun speed
    }

    draw() {
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height); // Bottom left
        ctx.lineTo(this.x + this.width, this.y + this.height); // Bottom right
        ctx.lineTo(this.x + this.width / 2, this.y); // Top center (cannon tip)
        ctx.closePath();
        ctx.fill();
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.dx * 2;  // Double speed for responsiveness
        }
    }

    moveRight() {
        if (this.x + this.width < canvas.width) {
            this.x += this.dx * 2;  // Double speed for responsiveness
        }
    }

    shoot() {
        const bullet = new Bullet(this.x + this.width / 2, this.y);
        bullets.push(bullet);
    }
}

const gun = new Gun();

// Attach event listeners for desktop (keyboard)
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); // Prevent the default scrolling behavior
    }

    // Existing game controls
    if (e.key === 'ArrowLeft') {
        gun.moveLeft();
    } else if (e.key === 'ArrowRight') {
        gun.moveRight();
    } else if (e.key === 'ArrowUp') {
        gun.shoot();
    }
});



// Attach event listeners for mobile (touch) and desktop (click)
document.getElementById('leftButton').addEventListener('touchstart', () => gun.moveLeft());
document.getElementById('rightButton').addEventListener('touchstart', () => gun.moveRight());
document.getElementById('shootButton').addEventListener('touchstart', () => gun.shoot());

document.getElementById('leftButton').addEventListener('click', () => gun.moveLeft());
document.getElementById('rightButton').addEventListener('click', () => gun.moveRight());
document.getElementById('shootButton').addEventListener('click', () => gun.shoot());

let particles = [];
let pointDisplays = [];
let messageDisplays = [];

function createParticle(x, y, color) {
    const size = Math.random() * 3 + 1;
    const speedX = (Math.random() - 0.5) * 4;
    const speedY = (Math.random() - 0.5) * 4;
    const lifetime = Math.random() * 30 + 30;
    particles.push(new Particle(x, y, size, color, speedX, speedY, lifetime));
}

function createPointDisplay(x, y, text) {
    pointDisplays.push(new PointDisplay(x, y, text));
}

function handleParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].lifetime <= 0) {
            particles.splice(i, 1);
        }
    }
}

function handlePointDisplays() {
    for (let i = pointDisplays.length - 1; i >= 0; i--) {
        pointDisplays[i].update();
        if (pointDisplays[i].lifetime <= 0) {
            pointDisplays.splice(i, 1);
        }
    }
}

function createMessageDisplay(x, y, text, emoji) {
    messageDisplays.push(new MessageDisplay(x, y, text, emoji));
}

function handleMessageDisplays() {
    for (let i = messageDisplays.length - 1; i >= 0; i--) {
        messageDisplays[i].update();
        if (messageDisplays[i].lifetime <= 0) {
            messageDisplays.splice(i, 1);
        }
    }
}


function createBubble() {
    const radius = 30;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = canvas.height + radius;
    const type = Math.random() < 0.3 ? 'gudgum' : 'plastic'; // 30% chance for Gud Gum bubble
    bubbles.push(new Bubble(x, y, radius, type));
}

function handleBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();

        // Remove bubbles that go off screen
        if (bubbles[i].y + bubbles[i].radius < 0) {
            bubbles.splice(i, 1);
            i--;
        }
    }
}

function handleBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();

        // Remove bullets that go off screen
        if (bullets[i].y + bullets[i].radius < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function detectCollisions() {
    for (let i = 0; i < bubbles.length; i++) {
        for (let j = 0; j < bullets.length; j++) {
            const dist = Math.hypot(bullets[j].x - bubbles[i].x, bullets[j].y - bubbles[i].y);
            if (dist - bubbles[i].radius - bullets[j].radius < 1) {
                if (bubbles[i].type === 'gudgum') {
                    score += 10;
                    createPointDisplay(bubbles[i].x, bubbles[i].y, "+10");
                    createMessageDisplay(bubbles[i].x, bubbles[i].y - 30, "YOU GOT GUD GUM", "😊");
                } else {
                    score -= 5;
                    createPointDisplay(bubbles[i].x, bubbles[i].y, "-5");
                    createMessageDisplay(bubbles[i].x, bubbles[i].y - 30, "YOU GOT PLASTIC GUM", "😢");
                }
                bubbles[i].explode(); 
                updateScore(); 
                bullets.splice(j, 1);
                bubbles.splice(i, 1);
                break;
            }
        }
    }
}




function updateScore() {
    const scoreBoard = document.getElementById('score-board');
    if (scoreBoard) {
        scoreBoard.textContent = `Score: ${score}`;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gun.draw();
    handleBubbles();
    handleBullets();
    detectCollisions();
    handleParticles();
    handlePointDisplays();
    handleMessageDisplays();  // Ensure both messages and points are handled
    requestAnimationFrame(animate);
}

function startGame() {
    setInterval(createBubble, 1000);
    animate();
}

// Start the game
startGame();

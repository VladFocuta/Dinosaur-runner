let obstaclesContainer = document.getElementById("obstaclesContainer");
let dino = document.getElementById("dino");
let bigCactus = document.getElementsByClassName("bigCactus");
let smallObstacle = document.getElementsByClassName("smallCactus");
let message = document.getElementById("messages");
let highScoreMessage = document.getElementById("highScoreMessage");
let clouds = document.getElementById("clouds");
let secondClouds = document.getElementById("secondClouds");
let dinoMoved = document.getElementById("dinoMoved");
let gameOver = false;
let isJumping = false;

document.addEventListener("keydown", handleKeys)
let charLeftAdd = 50, charUpAdd = 16;
function handleKeys(e) {
    let pressedKey = e.code;
    if (pressedKey === "Space" && gameOver) {
        resetGame();
    }
    if (!gameOver) {
        if (pressedKey === "ArrowDown" && charUpAdd > 16) {
            returnToGround();
        }
        if (pressedKey === "Space") {
            jump();
        }
    }
}

let goingDown;
function returnToGround() {
    if (charUpAdd <= 50) {
        clearInterval(jumpInterval);
        goingDown = setInterval(function () {
            if (charUpAdd == 16) {
                clearInterval(goingDown);
                dinoMoved.style.display = "block";
                isJumping = false;
            }
            if (charUpAdd > 16) {
                charUpAdd -= 2;
                dino.style.bottom = charUpAdd + "%";
            }
        }, 10)
    }
}

let jumpInterval;
let downTime;

function jump() {
    if (isJumping) return;
    jumpInterval = setInterval(function () {
        const maxJump = 50;
        const onTheGround = 16;

        if (charUpAdd == maxJump) {
            clearInterval(jumpInterval);
            downTime = setInterval(function () { // cream un interval care readuce obiectul pe pamanat(16)
                if (charUpAdd == onTheGround) { // daca a ajuns jos,stergem intervalul
                    clearInterval(downTime);
                    dinoMoved.style.display = "block";
                    isJumping = false;
                }
                if (charUpAdd > onTheGround) {
                    charUpAdd -= 2;
                    dino.style.bottom = charUpAdd + "%";
                }
            }, 20)
        }
        charUpAdd += 2;
        dino.style.bottom = charUpAdd + "%";
        isJumping = true;
        dinoMoved.style.display = "none";
    }, 15);
}

let rightDirection = 0, secondCloudsRight = 30;
function moveClouds() {
    if (!gameOver) {
        const maxRight = 80;
        const cloudsStart = 30;

        clouds.style.right = rightDirection + "%";
        secondClouds.style.right = secondCloudsRight + "%";
        rightDirection += 1;
        secondCloudsRight += 1;
        if (rightDirection == maxRight) {
            clouds.style.right = 0 + "%";
            rightDirection = 0;
        }
        if (secondCloudsRight == maxRight) {
            secondClouds.style.right = cloudsStart + "%";
            secondCloudsRight = cloudsStart;
        }
    }
}

jumpInterval = setInterval(moveClouds, 70);
let obstaclesInterval;
let spawnInterval;

let obstacles = [];
function createObstacle(type) {
    let obstacle = document.createElement("div");
    obstacle.className = type === "big" ? "bigCactus" : "smallCactus";
    obstacle.style.right = 0 + "%";
    obstaclesContainer.appendChild(obstacle);
    obstacles.push({ element: obstacle, type: type });
}

function createObstacles() {
    let randomSpawn = Math.floor(Math.random() * 2240) + 1000;
    setTimeout(function () {
        createObstacle("big");
        setTimeout(function () {
            createObstacle("small");
        }, 1720);
    }, randomSpawn);
}

function checkCollision() {
    if (!gameOver) {
        const margins = 84;
        const marginsObstacle = 30;

        let dinoRect = dino.getBoundingClientRect();
        for (let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];
            let right = parseFloat(obstacle.element.style.right) || 0;
            let obstacleRect = obstacle.element.getBoundingClientRect();

            right += 2;
            obstacle.element.style.right = right + "%";

            if (right >= margins) {
                obstacle.element.remove();
                obstacles.splice(i, 1);
                i--;
            }

            if (dinoRect.left + margins < obstacleRect.right &&
                dinoRect.right - margins > obstacleRect.left &&
                dinoRect.bottom > obstacleRect.top && obstacle.type === "big") {
                clearInterval(obstaclesInterval);
                clearInterval(spawnInterval);
                clearInterval(obstaclesDelay);
                showScore();
                gameOver = true;
            }

            if (dinoRect.left + marginsObstacle < obstacleRect.right &&
                dinoRect.right > obstacleRect.left + marginsObstacle &&
                dinoRect.bottom > obstacleRect.top && obstacle.type === "small") {
                clearInterval(obstaclesInterval);
                clearInterval(spawnInterval);
                clearInterval(obstaclesDelay);
                showScore();
                gameOver = true;
            }
        }
    }
}

let timer = 0;
function score() {
    timer++;
    if (timer >= highScoreValue) {
        highScoreValue = timer;
    }
    message.innerHTML = "Score: " + timer;
}

obstaclesDelay = setInterval(score, 1000);

function showScore() {
    message.innerHTML = "Your score is: " + timer;
    message.className = "finalScore";
}

let highScoreValue = 0;
function highScore() {
    highScoreMessage.innerHTML = "Hi: " + highScoreValue;
}

let increaseSpeed;
function levelUp() {
    increaseSpeed = setInterval(function () {
        if (timer > 15 && timer < 17) {
            setInterval(checkCollision, 37);
        }
    }, 16000);
}

levelUp();

function resetGame() {
    // Reseteaza variabilele și starea jocului
    clearInterval(obstaclesInterval);
    clearInterval(spawnInterval);
    clearInterval(obstaclesDelay);
    gameOver = false;
    timer = 0;
    message.className = "score";
    message.innerHTML = "Score: " + timer;
    // Sterge toate obstacolele existente
    while (obstaclesContainer.firstChild) {
        obstaclesContainer.removeChild(obstaclesContainer.firstChild);
    }
    // Reporneste jocul
    obstaclesInterval = setInterval(checkCollision, 35);
    spawnInterval = setInterval(createObstacles, 2000);
    obstaclesDelay = setInterval(score, 1000);
    highScore();
}

let isVisible = true;
function moveDino() {
    if (!gameOver) {
        if (isVisible) {
            dinoMoved.className = "dino";
        } else {
            dinoMoved.className = "dinoMoved";
        }
        isVisible = !isVisible;
    }
}

//pornesc jocul
obstaclesInterval = setInterval(moveDino, 200);
obstaclesInterval = setInterval(checkCollision, 35);
spawnInterval = setInterval(createObstacles, 2000);

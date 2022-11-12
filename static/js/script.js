import Ball from "./Ball.js";
import Paddle from "./Paddle.js"

const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScore = document.getElementById("player-score")
const computerScore = document.getElementById("computer-score")
const gameMenu = document.getElementById("game-menu")
const startButton = document.getElementById("startButton")
const gameMenuText = document.querySelector('[data-game-menu-text]')
const WINNING_SCORE = 3;
let gameStarted = false;

startButton.addEventListener('click', startGame)

function startGame() {

    ball.reset();
    computerPaddle.reset();

    gameMenu.classList.remove('show')

    if(!gameStarted){
        gameStarted = true
        window.requestAnimationFrame(update)
    }
}

//infinite update loop
let lastTime;
function update(time) {
    if (lastTime != null){
        const delta = time - lastTime;
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
        computerPaddle.update(delta, ball.y)
        const hue = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--hue")
            )
            
        document.documentElement.style.setProperty("--hue", hue + delta * .01)
            
        if (isLose()) {
            handleLose();
        }
    }

    lastTime = time;

    if(!gameStarted) return
    
    window.requestAnimationFrame(update)
}

function isLose() {
    const rect = ball.rect();
    return (rect.right >= window.innerWidth || rect.left <= 0)
}

function handleLose() {
    const rect = ball.rect()
    if(rect.right >= window.innerWidth) {
        playerScore.textContent = parseInt(playerScore.textContent) + 1
    } else {
        computerScore.textContent = parseInt(computerScore.textContent) + 1
    }
    ball.reset();
    computerPaddle.reset();

    if(parseInt(playerScore.textContent) === WINNING_SCORE){
        gameOver('You Win!')
    } 
    else if (parseInt(computerScore.textContent) === WINNING_SCORE){
        gameOver('Computer Wins!')
    }
}

function gameOver(text){
    playerScore.textContent = 0;
    computerScore.textContent = 0;
    gameMenuText.textContent = text
    startButton.textContent = 'RESTART';
    gameMenu.classList.add('show')
    gameStarted = false;
}

document.addEventListener("mousemove", event => {
    playerPaddle.position = (event.y / window.innerHeight) * 100;
})
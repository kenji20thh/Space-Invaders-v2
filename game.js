// Game constants
const GAME_WIDTH = 800
const GAME_HEIGHT = 560
const PLAYER_SPEED = 5
const ALIEN_SPEED = 1
const BULLET_SPEED = 7
const ALIEN_BULLET_SPEED = 5
const ALIEN_ROWS = 5
const ALIEN_COLS = 10
const ALIEN_PADDING = 10
const ALIEN_DROP = 20
const GAME_DURATION = 60 // seconds

// Game state
let gameRunning = false
let gamePaused = false
let lastTime = 0
let score = 0
let lives = 3
let timeRemaining = GAME_DURATION
let alienDirection = 1 // 1 for right, -1 for left
const alienMoveDown = false
let shootCooldown = 0
let alienShootCooldown = 0

// Game elements
let player
let aliens = []
let bullets = []
let alienBullets = []

// DOM elemts
const gameArea = document.getElementById("game-area")
const scoreElement = document.getElementById("score")
const livesElement = document.getElementById("lives")
const timerElement = document.getElementById("timer")

// pause menu creation
const pauseMenu = document.createElement("div")
pauseMenu.id = "pause-menu"
pauseMenu.className = "hidden"
const menuContent = document.createElement("div")
menuContent.className = "menu-content"
const menuTitle = document.createElement("h2")
menuTitle.textContent = "PAUSED"
const continueBtn = document.createElement("button")
continueBtn.id = "continue-btn"
continueBtn.textContent = "CONTINUE"
const restartBtn = document.createElement("button")
restartBtn.id = "restart-btn"
restartBtn.textContent = "RESTART"
menuContent.appendChild(menuTitle)
menuContent.appendChild(continueBtn)
menuContent.appendChild(restartBtn)
pauseMenu.appendChild(menuContent)
document.querySelector(".game-container").appendChild(pauseMenu)

const startGame = () => {
    pauseMenu.style.display = 'none'
    gamePaused = false
    createPlayer()
    createAliens()
    score = 0
    lives = 3
    timeRemaining = 60 
    updateUI()
    gameRunning = true
    requestAnimationFrame(gameLoop)
    startTimer()
}

const createPlayer = () => {
    player = document.createElement("div")
    player.className = "player"
    player.style.left = `${800 / 2 - 30}px` // mid game widtih - 30
    gameArea.appendChild(player)
}
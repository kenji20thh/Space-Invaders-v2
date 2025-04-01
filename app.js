const gameArea = document.querySelector('.game-area')
const scoreElem = document.getElementById('score')
const livesElem = document.getElementById('lives')
const timerElem = document.getElementById('timer')
const gameContainer = document.querySelector('.game-container')

// stats
let score = 0
let lives = 3
let timeRemaining = 60
let alienDirection = 1

// game elems

let player
let aliens = []
let bullets = []
let alienBullets = []

// creating pause 
const pauseMenu = document.createElement('div')
pauseMenu.id = 'pause-menu'
pauseMenu.className = 'hidden'
const menuContent = document.createElement('div')
menuContent.className = 'menu-content'
const menuTitle = document.createElement('h2')
menuTitle.textContent = 'PAUSED'
const continueBtn = document.createElement('button')
continueBtn.id = 'continue-btn'
continueBtn.textContent = 'CONTINUE'
const restartBtn = document.createElement('button')
restartBtn.id = 'restart-btn'
restartBtn.textContent = 'RESTART'

menuContent.appendChild(menuTitle)
menuContent.appendChild(continueBtn)
menuContent.appendChild(restartBtn)
pauseMenu.appendChild(menuContent)
gameContainer.appendChild(pauseMenu)

// Toggle pause
const togglePause = () => {
    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseMenu.style.display = 'flex';
    } else {
        pauseMenu.style.display = 'none';
    }
}

//shppoting

const shoot = () => {
    const bullet = document.createElement('div')
    bullet.className = 'bullet'
    bullet.style.left = `${Number.parseInt(player.style.left) + 28}px`
    bullet.style.top = `${560 - 40}px`//game height - 40
    gameArea.appendChild(bullet)
    bullet.push(bullet)
}

// create player

const createPlayer = () => {
    player = document.createElement('div')
    player.className = 'player'
    player.style.left = `${800 / 2 - 30}px` //mid game width - 30px
    gameArea.appendChild(player)
}

const movePlayer = () => {
    if (keys.ArrowLeft && Number.parseInt(player.style.left) > 0) {
        player.style.left = Number.parseInt(player.style.left) - 5
    } else if (keys.ArrowRight && Number.parseInt(player.style.right) < 800 - 60) { // game width - 60
        player.style.left = Number.parseInt(player.style.left) + 5 // 5 = player speed
    } else if (keys[' ']) {
        shoot() // needs modifications
    }
}

// creat aliens 

const createAlien = () => {
    aliens = []
    const startX = (800 - 10 * (40 + 10)) / 2 //(gamewidth - columns * (alienWidth + alien paddin)) / 2
    const startY = 50
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 10; j++) {
            const alien = document.createElement('div')
            alien.className = 'alien'
            alien.style.left = `${startX + i * (40 + 10)}px` // startX + row * (alienWidth + padding)
            alien.style.top = `${startY + j * (30 + 10)}px` // startY + row * (alienHeight + padding)
            gameArea.appendChild(alien)
            aliens.push(alien)
        }
    }
}

// alien move
const moveAlien = () => {
    let moveDown = false
    let changeDirection = false
    for (let alien of aliens) {
        if (alienDirection > 0 && Number.parseInt(alien.style.left) > 800 - 60) {
            changeDirection = true
            moveDown = true
            break
        } else if (alienDirection < 0 && Number.parseInt(alien.style.left) < 10) {
            changeDirection = true
            moveDown = true
            break
        }
    }
} 

// update board
const updateBoard = () => {
    scoreElem.textContent = score
    livesElem.textContent = lives
    timerElem.textContent = timeRemaining
}

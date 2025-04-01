const gameArea = document.querySelector('.game-area')
const scoreElem = document.getElementById('score')
const livesElem = document.getElementById('lives')
const timerElem = document.getElementById('timer')
const gameContainer = document.querySelector('.game-container')

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

// create player

const createPlayer = () => {
    player = document.createElement('div')
    player.className = 'player'
    player.style.left = `${800 / 2 - 30}px` //mid width - 30px
    gameArea.appendChild(player)
}

// move player 

const movePlayer = () => {
    if (keys.ArrowLeft && Number.parseInt(player.style.left) > 0) {
        player.style.left = Number.parseInt(player.style.left) - 5
    } else if (keys.ArrowRight && Number.parseInt(player.style.right) > 0) {
        player.style.left = Number.parseInt(player.style.left) + 5
    } else if (keys[' '] && shootCoolDown <= 0) {
        shoot() // needs modifications
    }
}

const shoot = () => {
    const bullet = document.createElement('div')
    bullet.className = 'bullet'
    bullet.style.left = `${Number.parseInt(player.style.left) + 28}px`
    bullet.style.top = `${560 - 40}px`//game height - 40
    gameArea.appendChild(bullet)
    bullet.push(bullet)
}

const createAlien = () => {
    aliens = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 10; j++) {
            const alien = document.createElement('div')
            alien.className = 'alien'
            gameArea.appendChild(alien)
            aliens.push(alien)
        }
    }
}
// createPlayer()
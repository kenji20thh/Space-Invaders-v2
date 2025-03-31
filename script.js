const gameArea = document.querySelector('.game-area')
const scoreElem = document.getElementById('score')
const livesElem = document.getElementById('lives')
const timerElem = document.getElementById('timer')
const gameContainer = document.querySelector('.game-container')

// game elems

let player
let aliens = []


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
    gameArea.appendChild(player)
}

// move player 

const movePlayer = () => {
    if (keys.ArrowLeft && Number.parseInt(player.style.left) > 0) {
        player.style.left = Number.parseInt(player.style.left) - 5
    } else if (keys.ArrowRight && Number.parseInt(player.style.right) > 0) {
        player.style.left = Number.parseInt(player.style.left) + 5
    } else if (keys[' '] && shootCoolDown) {
        shoot() // needs modifications
    }
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
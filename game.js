// Game state
let gameRunning = false
let gamePaused = false
let lastTime = 0
let score = 0
let lives = 3
let timeRemaining = 60
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
const scoreElem = document.getElementById("score")
const livesElem = document.getElementById("lives")
const timerElem = document.getElementById("timer")

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
    updateStats()
    gameRunning = true
    requestAnimationFrame(gameLoop)
    startTime()
}

const createPlayer = () => {
    player = document.createElement("div")
    player.className = "player"
    player.style.left = `${800 / 2 - 30}px` // mid game widtih - 30
    gameArea.appendChild(player)
}

const createAliens = () => {
    aliens = []
    const startX = (800 - 10 * (40 + 10)) / 2 //(gamewidth - columns * (alienWidth + alien paddin)) / 2
    const startY = 50
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            const alien = document.createElement("div")
            alien.className = "alien"
            alien.style.left = `${startX + j * (40 + 10)}px` // 10 = padding
            alien.style.top = `${startY + i * (30 + 10)}px`
            gameArea.appendChild(alien)
            aliens.push(alien)
        }
    }

}

const updateStats = () => {
    scoreElem.textContent = score
    livesElem.textContent = lives
    timerElem.textContent = Math.ceil(timeRemaining)
}

const startTime = () => {
    const timerInterval = setInterval(() => {
        if (!gamePaused && gameRunning) {
            timeRemaining -= 0.1
            updateStats()
            if (timeRemaining <= 0) {
                clearInterval(timerInterval)
                gameOver()
            }
        }
    }, 100)
}
// game loop
function gameLoop(timestamp) {
    if (!gameRunning) return
    if (gamePaused) {
        requestAnimationFrame(gameLoop)
        return
    }

    const deltaTime = timestamp - lastTime
    lastTime = timestamp

    // Update game state
    movePlayer()
    moveAliens(deltaTime)
    updateBullets()
    checkCollisions()

    // Cooldowns
    if (shootCooldown > 0) shootCooldown -= deltaTime
    if (alienShootCooldown > 0) alienShootCooldown -= deltaTime
    else alienShoot()

    // Continue the loop
    requestAnimationFrame(gameLoop)
}

const movePlayer = () => {
    if (keys.ArrowLeft && Number.parseInt(player.style.left) > 0) {
        player.style.left = `${Number.parseInt(player.style.left) - 5}px`
    } else if (keys.ArrowRight && Number.parseInt(player.style.left) + 60 < 800) { // game width - 60
        player.style.left = `${Number.parseInt(player.style.left) + 5}px` // 5 = player speed
    } else if (keys[' '] && shootCooldown <= 0) {
        shoot() // needs modifications
    }
}

function moveAliens(deltaTime) {
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
    for (let alien of aliens) {
        if (moveDown) {
            alien.style.top = `${Number.parseInt(alien.style.top) + 20}px`
            if (Number.parseInt(alien.style.top) > 560 - 50) {
                loseLife()
                resetAliens()
                break
            }
        }
        alien.style.left = `${Number.parseInt(alien.style.left) + 1 * alienDirection}px` // 1 = alien speed
    }
    if (changeDirection) {
        alienDirection *= -1
    }
}

const resetAliens = () => {
    const startY = 50
    let row = 0
    let col = 0
    const startX = (800 - 10 * (40 + 10)) / 2 // width - cols * (width + padding) / 2
    for (let i = 0; i < aliens.length; i++) {
        row = Math.floor(i / 10)
        col = i % 10
        aliens[i].style.left = `${startX + col * (40 + 10)}px` // width + padding
        aliens[i].style.top = `${startY + row * (30 + 10)}px` // height + padding
    }
}

const updateBullets = () => {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]
        bullet.style.top = `${Number.parseInt(bullet.style.top) - 7}px` // 7 = bullet speed
        if (Number.parseInt(bullet.style.top) < 0) { // off scrreen remove
            gameArea.removeChild(bullet)
            bullets.splice(i, 1)
        }
    }
    for (let i = alienBullets.length - 1; i >= 0; i--) {
        const bullet = alienBullets[i]
        bullet.style.top = `${Number.parseInt(bullet.style.top) + 5}px` // alien bullet speed = 5
        if (Number.parseInt(bullet.style.top) > 560) {
            gameArea.removeChild(bullet)
            alienBullets.splice(i, 1)
        }
    }
}

const shoot = () => {
    const bullet = document.createElement('div')
    bullet.className = 'bullet'
    bullet.style.left = `${Number.parseInt(player.style.left) + 28}px` // Center the bullet on the player
    bullet.style.top = `${560 - 40}px` 
    gameArea.appendChild(bullet)
    bullets.push(bullet)
    shootCooldown = 300 
}

const alienShoot = () => {
    if (aliens.length === 0) return
    const randomAlien = aliens[Math.floor(Math.random() * aliens.length)]
    const bullet = document.createElement('div')
    bullet.className = 'alien-bullet'
    bullet.style.left = `${Number.parseInt(randomAlien.style.left) + 18}px` 
    bullet.style.top = `${Number.parseInt(randomAlien.style.top) + 30}px` 
    gameArea.appendChild(bullet)
    alienBullets.push(bullet)
    alienShootCooldown = 1000 + Math.random() * 2000 
}

// Check for collisions
function checkCollisions() {
    // Check player bullets vs aliens
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]
        const bulletRect = bullet.getBoundingClientRect()

        for (let j = aliens.length - 1; j >= 0; j--) {
            const alien = aliens[j]
            const alienRect = alien.getBoundingClientRect()

            if (
                bulletRect.left < alienRect.right &&
                bulletRect.right > alienRect.left &&
                bulletRect.top < alienRect.bottom &&
                bulletRect.bottom > alienRect.top
            ) {
                // Collision detected
                gameArea.removeChild(bullet)
                bullets.splice(i, 1)
                gameArea.removeChild(alien)
                aliens.splice(j, 1)
                score += 10
                updateUI()

                // Check if all aliens are destroyed
                if (aliens.length === 0) {
                    createAliens() // Create a new wave
                    score += 50 // Bonus for clearing a wave
                    updateUI()
                }

                break
            }
        }
    }

    // Check alien bullets vs player
    const playerRect = player.getBoundingClientRect()
    for (let i = alienBullets.length - 1; i >= 0; i--) {
        const bullet = alienBullets[i]
        const bulletRect = bullet.getBoundingClientRect()

        if (
            bulletRect.left < playerRect.right &&
            bulletRect.right > playerRect.left &&
            bulletRect.top < playerRect.bottom &&
            bulletRect.bottom > playerRect.top
        ) {
            // Collision detected
            gameArea.removeChild(bullet)
            alienBullets.splice(i, 1)
            loseLife()
        }
    }
}

const loseLife = () => {
    lives--
    updateUI()
    if (lives === 0) {
        gameOver()
    }
}

const gameOver =() => {
    gameRunning = false
    pauseMenu.style.display = 'flex'
    pauseMenu.classList.remove('hidden')
    document.getElementById('continue-btn').style.display = 'none'
    document.querySelector('.menu-content h2').textContent = 'GAME OVER'
}

// events

// Keyboard input handling
const keys = {}
window.addEventListener("keydown", (e) => {
    keys[e.key] = true
    if (e.key === "Escape" && gameRunning) {
        togglePause()
    }
})
window.addEventListener("keyup", (e) => {
    keys[e.key] = false
})
continueBtn.addEventListener("click", () => {
    togglePause() 
})
restartBtn.addEventListener("click", () => {
    pauseMenu.style.display = 'none'
    gamePaused = false
    resetGame()
})

const togglePause = () => {
    gamePaused = !gamePaused
    if (gamePaused) {
        pauseMenu.style.display = 'flex'
    } else {
        pauseMenu.style.display = 'none'
    }
}

const resetGame = () => {
    pauseMenu.style.display = 'none'
    gamePaused = false;
    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild)
    }
    bullets = []
    alienBullets = []
    aliens = []
    startGame()
}   
window.addEventListener('load', startGame)


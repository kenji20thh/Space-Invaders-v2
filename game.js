// Game stats
let gameRunning = false
let gamePaused = false
let lastTime = 0
let score = 0
let lives = 3
let timeRemaining = 120
let alienDirection = 1 // 1 right -1 left
let shootCooldown = 0
let alienShootCooldown = 0
let gameLoopId = null
let timerInterval = null

// Game elements with position tracking
let player = { element: null, x: 0, y: 0 }
let aliens = []
let bullets = []
let alienBullets = []

// DOM elements
const gameArea = document.getElementById("game-area")
const scoreElem = document.getElementById("score")
const livesElem = document.getElementById("lives")
const timerElem = document.getElementById("timer")

function getBounds() {
    return {
        width: gameArea.clientWidth,
        height: gameArea.clientHeight
    }
}

// Helper function to update element position using transform
function updateElementPosition(element, x, y) {
    element.style.transform = `translate(${x}px, ${y}px)`
}

// Helper function to get element bounds with transform
function getTransformBounds(element, x, y, width, height) {
    return {
        left: x,
        right: x + width,
        top: y,
        bottom: y + height
    }
}

// Pause menu setup
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
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId)
        gameLoopId = null
    }
    pauseMenu.style.display = 'none'
    resetPauseMenu()
    gamePaused = false
    createPlayer()
    createAliens()
    score = 0
    lives = 3
    timeRemaining = 120
    updateStats()
    lastTime = performance.now()
    gameRunning = true
    requestAnimationFrame(gameLoop)
    startTimer()
}

const createPlayer = () => {
    const { width, height } = getBounds()
    player.element = document.createElement("div")
    player.element.className = "player"
    player.x = width / 2 - 30
    player.y = height - 75
    updateElementPosition(player.element, player.x, player.y)
    gameArea.appendChild(player.element)
}

const createAliens = () => {
    aliens = []
    const { width } = getBounds()
    const startX = (width - 10 * (40 + 10)) / 2
    const startY = 50
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 10; j++) {
            const alien = {
                element: document.createElement("div"),
                x: startX + j * (40 + 10),
                y: startY + i * (30 + 10),
                width: 40,
                height: 30
            }
            alien.element.className = "alien" + (i + 1)
            updateElementPosition(alien.element, alien.x, alien.y)
            gameArea.appendChild(alien.element)
            aliens.push(alien)
        }
    }
}

const updateStats = () => {
    scoreElem.textContent = score
    livesElem.textContent = lives
    timerElem.textContent = Math.ceil(timeRemaining)
}

const startTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
    timerInterval = setInterval(() => {
        if (!gamePaused && gameRunning) {
            timeRemaining -= 0.1
            updateStats()
            if (timeRemaining <= 0) {
                clearInterval(timerInterval)
                timerInterval = null
                gameOver()
            }
        }
    }, 100)
}

// Game loop
function gameLoop(timestamp) {
    if (!gameRunning) return
    if (gamePaused) {
        gameLoopId = requestAnimationFrame(gameLoop)
        return
    }

    const deltaTime = timestamp - lastTime
    lastTime = timestamp

    // Update game state
    movePlayer()
    moveAliens()
    updateBullets()
    checkCollisions()

    // Cooldowns
    if (shootCooldown > 0) shootCooldown -= deltaTime
    if (alienShootCooldown > 0) alienShootCooldown -= deltaTime
    else alienShoot()

    // Continue the loop
    gameLoopId = requestAnimationFrame(gameLoop)
}

const movePlayer = () => {
    const { width } = getBounds()
    
    if (keys.ArrowLeft && player.x > 30) {
        player.x -= 5
        updateElementPosition(player.element, player.x, player.y)
        if (keys[' '] && shootCooldown <= 0) shoot()
    } else if (keys.ArrowRight && player.x + 60 < width) {
        player.x += 5
        updateElementPosition(player.element, player.x, player.y)
        if (keys[' '] && shootCooldown <= 0) shoot()
    } else if (keys[' '] && shootCooldown <= 0) {
        shoot()
    }
}

const moveAliens = () => {
    const { width, height } = getBounds()
    let moveDown = false
    let changeDirection = false
    
    // Check if any alien hits the boundary
    for (let alien of aliens) {
        if (alienDirection > 0 && alien.x > width - 60) {
            changeDirection = true
            moveDown = true
            break
        } else if (alienDirection < 0 && alien.x < 10) {
            changeDirection = true
            moveDown = true
            break
        }
    }
    
    // Move aliens
    for (let alien of aliens) {
        if (moveDown) {
            alien.y += 20
            if (alien.y > height) {
                loseLife()
                resetAliens()
                break
            }
        }
        alien.x += 1 * alienDirection
        updateElementPosition(alien.element, alien.x, alien.y)
    }
    
    if (changeDirection) {
        alienDirection *= -1
    }
}

const resetAliens = () => {
    const { width } = getBounds()
    const startY = 50
    const startX = (width - 10 * (40 + 10)) / 2
    
    for (let i = 0; i < aliens.length; i++) {
        const row = Math.floor(i / 10)
        const col = i % 10
        aliens[i].x = startX + col * (40 + 10)
        aliens[i].y = startY + row * (30 + 10)
        updateElementPosition(aliens[i].element, aliens[i].x, aliens[i].y)
    }
}

const updateBullets = () => {
    const { height } = getBounds()
    
    // Update player bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]
        bullet.y -= 7
        updateElementPosition(bullet.element, bullet.x, bullet.y)
        
        if (bullet.y < 0) {
            gameArea.removeChild(bullet.element)
            bullets.splice(i, 1)
        }
    }
    
    // Update alien bullets
    for (let i = alienBullets.length - 1; i >= 0; i--) {
        const bullet = alienBullets[i]
        bullet.y += 5
        updateElementPosition(bullet.element, bullet.x, bullet.y)
        
        if (bullet.y > height) {
            gameArea.removeChild(bullet.element)
            alienBullets.splice(i, 1)
        }
    }
}

const shoot = () => {
    const bullet = {
        element: document.createElement('div'),
        x: player.x + 28,
        y: player.y,
        width: 4,
        height: 10
    }
    bullet.element.className = 'bullet'
    updateElementPosition(bullet.element, bullet.x, bullet.y)
    gameArea.appendChild(bullet.element)
    bullets.push(bullet)
    shootCooldown = 400
}

const alienShoot = () => {
    if (aliens.length === 0) return
    const randomAlien = aliens[Math.floor(Math.random() * aliens.length)]
    const bullet = {
        element: document.createElement('div'),
        x: randomAlien.x + 18,
        y: randomAlien.y + 30,
        width: 4,
        height: 10
    }
    bullet.element.className = 'alien-bullet'
    updateElementPosition(bullet.element, bullet.x, bullet.y)
    gameArea.appendChild(bullet.element)
    alienBullets.push(bullet)
    alienShootCooldown = 1000 + Math.random() * 2000
}

// Check for collisions using transform-based positions
const checkCollisions = () => {
    // Check player bullets vs aliens
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i]
        const bulletBounds = getTransformBounds(bullet.element, bullet.x, bullet.y, bullet.width, bullet.height)
        
        for (let j = aliens.length - 1; j >= 0; j--) {
            const alien = aliens[j]
            const alienBounds = getTransformBounds(alien.element, alien.x, alien.y, alien.width, alien.height)
            
            if (
                bulletBounds.left < alienBounds.right &&
                bulletBounds.right > alienBounds.left &&
                bulletBounds.top < alienBounds.bottom &&
                bulletBounds.bottom > alienBounds.top
            ) {
                gameArea.removeChild(bullet.element)
                bullets.splice(i, 1)
                gameArea.removeChild(alien.element)
                aliens.splice(j, 1)
                score += 10
                updateStats()
                
                if (aliens.length === 0) {
                    timeRemaining += 20
                    createAliens()
                    score += 50
                    updateStats()
                }
                break
            }
        }
    }
    
    // Check alien bullets vs player
    const playerBounds = getTransformBounds(player.element, player.x, player.y, 60, 55)
    for (let i = alienBullets.length - 1; i >= 0; i--) {
        const bullet = alienBullets[i]
        const bulletBounds = getTransformBounds(bullet.element, bullet.x, bullet.y, bullet.width, bullet.height)
        
        if (
            bulletBounds.left < playerBounds.right &&
            bulletBounds.right > playerBounds.left &&
            bulletBounds.top < playerBounds.bottom &&
            bulletBounds.bottom > playerBounds.top
        ) {
            gameArea.removeChild(bullet.element)
            alienBullets.splice(i, 1)
            loseLife()
        }
    }
}

const loseLife = () => {
    lives--
    updateStats()
    if (lives === 0) {
        gameOver()
    }
}

const resetPauseMenu = () => {
    pauseMenu.classList.add('hidden')
    menuTitle.textContent = 'PAUSED'
    continueBtn.style.display = 'block'
}

const gameOver = () => {
    gameRunning = false
    pauseMenu.style.display = 'flex'
    pauseMenu.classList.remove('hidden')
    document.getElementById('continue-btn').style.display = 'none'
    document.querySelector('.menu-content h2').textContent = `GAME OVER  Your Score: ${score}`
}

// Events
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
    gamePaused = false

    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId)
        gameLoopId = null
    }
    
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }

    // Clear game area
    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild)
    }
    
    // Reset arrays
    bullets = []
    alienBullets = []
    aliens = []
    player = { element: null, x: 0, y: 0 }
    
    startGame()
}

window.addEventListener('load', startGame)
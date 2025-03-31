const gameArea = document.getElementById('game-area')
const scoreElem = document.getElementById('score')
const livesElem = document.getElementById('lives')
const timerElem = document.getElementById('timer')
const gameContainer = document.querySelector('.game-container')

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

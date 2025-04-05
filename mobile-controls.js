// Mobile controls for Space Invaders game
document.addEventListener("DOMContentLoaded", () => {
    // Check if the device is a mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768
  
    // Declare keys variable
    const keys = {}
  
    if (isMobile) {
      createMobileControls()
    }
  
    function createMobileControls() {
      // Create container for mobile controls
      const controlsContainer = document.createElement("div")
      controlsContainer.className = "mobile-controls"
      document.body.appendChild(controlsContainer)
  
      // Create left button
      const leftBtn = document.createElement("button")
      leftBtn.className = "control-btn left-btn"
      leftBtn.innerHTML = "&larr;"
      controlsContainer.appendChild(leftBtn)
  
      // Create shoot button
      const shootBtn = document.createElement("button")
      shootBtn.className = "control-btn shoot-btn"
      shootBtn.innerHTML = "&#9650;"
      controlsContainer.appendChild(shootBtn)
  
      // Create right button
      const rightBtn = document.createElement("button")
      rightBtn.className = "control-btn right-btn"
      rightBtn.innerHTML = "&rarr;"
      controlsContainer.appendChild(rightBtn)
  
      // Add event listeners for touch controls
      leftBtn.addEventListener("touchstart", (e) => {
        e.preventDefault()
        keys.ArrowLeft = true
      })
  
      leftBtn.addEventListener("touchend", (e) => {
        e.preventDefault()
        keys.ArrowLeft = false
      })
  
      rightBtn.addEventListener("touchstart", (e) => {
        e.preventDefault()
        keys.ArrowRight = true
      })
  
      rightBtn.addEventListener("touchend", (e) => {
        e.preventDefault()
        keys.ArrowRight = false
      })
  
      shootBtn.addEventListener("touchstart", (e) => {
        e.preventDefault()
        keys[" "] = true
      })
  
      shootBtn.addEventListener("touchend", (e) => {
        e.preventDefault()
        keys[" "] = false
      })
  
      // Add CSS for mobile controls
      const style = document.createElement("style")
      style.textContent = `
        .mobile-controls {
          display: flex;
          justify-content: space-between;
          position: fixed;
          bottom: 20px;
          left: 0;
          right: 0;
          padding: 0 20px;
          z-index: 1000;
        }
        
        .control-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background-color: rgba(51, 255, 51, 0.3);
          border: 2px solid #33ff33;
          color: #33ff33;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        .control-btn:active {
          background-color: rgba(51, 255, 51, 0.6);
        }
        
        .shoot-btn {
          background-color: rgba(255, 255, 255, 0.3);
          border-color: #ffffff;
          color: #ffffff;
        }
        
        .shoot-btn:active {
          background-color: rgba(255, 255, 255, 0.6);
        }
        
        @media (min-width: 768px) {
          .mobile-controls {
            display: none;
          }
        }
        
        /* Make game container responsive */
        @media (max-width: 767px) {
          .game-container {
            width: 100% !important;
            height: 80vh !important;
            border-width: 2px !important;
          }
          
          body {
            padding: 0;
            margin: 0;
          }
        }
      `
      document.head.appendChild(style)
  
      // Add meta viewport tag if not present
      if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement("meta")
        meta.name = "viewport"
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        document.head.appendChild(meta)
      }
  
      // Prevent default touch actions to avoid scrolling while playing
      document.addEventListener(
        "touchmove",
        (e) => {
          if (e.target.closest(".game-container") || e.target.closest(".mobile-controls")) {
            e.preventDefault()
          }
        },
        { passive: false },
      )
    }
  })
  
  
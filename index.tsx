// Survival Game

import { createRoot } from 'react-dom/client'
import React from 'react'
import { useState, useEffect, useRef } from 'react'

let gameover = false

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('gameContainer') as HTMLElement).render(
    <GameContainer />
  )
})

function GameContainer() {
  // #region states
  const [health, setHealth] = useState(100)
  const [hunger, setHunger] = useState(100)
  const [thirst, setThirst] = useState(100)
  const [sleep, setSleep] = useState(100)
  const [boredom, setBoredom] = useState(100)
  const [wallet, setWallet] = useState(100)
  const [survivalTime, setSurvivalTime] = useState(0)
  const [stickImg, setStickImg] = useState('./images/stick/stick.png')
  // #endregion

  // #region sound effects
  const slurpSFX = new Audio('./audio/slurp.mp3')
  const biteSFX = new Audio('./audio/bite.wav')
  const sleepSFX = new Audio('./audio/sleep.wav')
  const gymSFX = new Audio('./audio/gym.mp3')
  const workSFX = new Audio('./audio/work.wav')
  const gameSFX = new Audio('./audio/game.wav')
  const errorSFX = new Audio('./audio/error.wav')
  const deathSFX = new Audio('./audio/death.mp3')
  // #endregion

  const RestartGame = () => {
    console.log('restart')
    gameover = false
    window.location.reload()
  }

  // #region Interval
  let toggle = true
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'healthBar')
        if (prev <= 1) {
          handleGameover('Weakness')
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setHunger((prev) => {
        updateBar(prev, 'hungerBar')
        if (prev > 100) return 100
        if (prev <= 1) {
          handleGameover('Starvation')
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setThirst((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'thirstBar')
        if (prev <= 1) {
          handleGameover('Dehydration')
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setSleep((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'sleepBar')
        if (prev <= 1) {
          handleGameover('Sleep Deprivation')
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setBoredom((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'boredomBar')
        if (prev <= 1) {
          handleGameover('Boredom')
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setSurvivalTime((x) => x + 1)
      if (toggle) {
        setStickImg('./images/stick/stick.png')
        toggle = false
      } else {
        toggle = true
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  // #endregion

  function handleHealth() {
    if (gameover === true) return
    setStickImg('./images/stick/stick-gym.png')
    gymSFX.play()
    setHealth((x) => x + 25)
    setThirst((x) => x - 30)
    setHunger((x) => x - 20)
    setSleep((x) => x - 20)
    setWallet((x) => {
      updateBar(x - 20, 'walletBar')
      return x - 20
    })
  }
  function handleHunger() {
    if (gameover === true) return
    if (wallet > 0) {
      setStickImg('./images/stick/stick-eat.png')
      biteSFX.play()
      setHunger((x) => x + 40)
      setHealth((x) => x + 5)
      setWallet((x) => {
        updateBar(x - 20, 'walletBar')
        return x - 20
      })
    } else {
      errorSFX.play()
    }
  }
  function handleThirst() {
    if (gameover === true) return
    if (wallet > 0) {
      setStickImg('./images/stick/stick-drink.png')
      slurpSFX.play()
      setThirst((x) => x + 30)
      setHealth((x) => x + 5)
      setSleep((x) => x - 10)
      setWallet((x) => {
        updateBar(x - 10, 'walletBar')
        return x - 10
      })
    } else {
      errorSFX.play()
    }
  }
  function handleSleep() {
    if (gameover === true) return
    setStickImg('./images/stick/stick-sleep.png')
    sleepSFX.play()
    setSleep((x) => x + 50)
    setHunger((x) => x - 20)
    setThirst((x) => x - 20)
    setHealth((x) => x + 10)
  }
  function handleBoredom() {
    if (gameover === true) return
    setStickImg('./images/stick/stick-game.png')
    gameSFX.play()
    setBoredom((x) => x + 50)
    setHunger((x) => x - 20)
    setThirst((x) => x - 10)
    setHealth((x) => x - 20)
  }
  function handleWallet() {
    if (gameover === true) return
    setStickImg('./images/stick/stick-work.png')
    workSFX.play()
    setThirst((x) => x - 10)
    setHealth((x) => x - 20)
    setHunger((x) => x - 30)
    setSleep((x) => x - 30)
    setBoredom((x) => x - 30)
    setWallet((x) => {
      updateBar(x + 60, 'walletBar')
      return x + 60
    })
  }

  const time: React.RefObject<any> = useRef(0)!
  time.current = survivalTime

  function handleGameover(reason: string) {
    gameover = true
    deathSFX.play()
    setStickImg('./images/stick/stick-dead.png')

    const alertDiv: HTMLElement = document.getElementById('alert')!
    alertDiv.innerHTML = `you died from ${reason}</br> you lived for ${
      time.current + 1
    } hours`
    alertDiv.classList.remove('hide')

    const restartButton = document.createElement('button')
    restartButton.id = 'restartButton'
    restartButton.textContent = 'Restart'
    restartButton.addEventListener('click', () => RestartGame())
    alertDiv.appendChild(restartButton)
  }

  function updateBar(x: number, bar: string) {
    const currentBar: HTMLElement = document.getElementById(bar)!
    currentBar.style.width = x * 2 + 'px'
    if (x > 40) {
      currentBar.style.backgroundColor = 'green'
    } else if (x > 20) {
      currentBar.style.backgroundColor = 'orange'
    } else {
      currentBar.style.backgroundColor = 'red'
    }
  }

  return (
    <>
      <div id="gameBox">
        <div id="stickMan">
          <div id="alert" className="hide"></div>
          <img src={stickImg} id="stick" />
        </div>
        <div id="buttonDiv">
          <button onClick={() => handleHealth()}>
            <img src="./images/gym.png" className="buttonImg" />
          </button>
          <button onClick={() => handleHunger()}>
            <img src="./images/food.png" className="buttonImg" />
          </button>
          <button onClick={() => handleThirst()}>
            <img src="./images/monster.png" className="buttonImg" />
          </button>
          <button onClick={() => handleSleep()}>
            <img src="./images/mattress.png" className="buttonImg" />
          </button>
          <button onClick={() => handleBoredom()}>
            <img src="./images/game.png" className="buttonImg" />
          </button>
          <button onClick={() => handleWallet()}>
            <img src="./images/work.png" className="buttonImg" />
          </button>
        </div>
        <div id="statContainer">
          <div className="stat">
            <p>Health: {health}</p>
            <div id="healthBar" className="bar"></div>
          </div>
          <div className="stat">
            <p>Hunger: {hunger}</p>
            <div id="hungerBar" className="bar"></div>
          </div>
          <div className="stat">
            <p>Thirst: {thirst}</p>
            <div id="thirstBar" className="bar"></div>
          </div>
          <div className="stat">
            <p>Sleep: {sleep}</p>
            <div id="sleepBar" className="bar"></div>
          </div>
          <div className="stat">
            <p>Boredom: {boredom}</p>
            <div id="boredomBar" className="bar"></div>
          </div>
          <div className="stat">
            <p>Wallet: ${wallet / 2}</p>
            <div id="walletBar" className="bar"></div>
          </div>
          <h3>Survival Time: {survivalTime}</h3>
        </div>
      </div>
    </>
  )
}

// Survival Game
//
// health, wallet, hunger, thirst, sleep
// bed, monster, chicken, work, gym
// health runs out when bars are low
// items refresh their bars and health
//gaming and boredom and guitar

// endgame and show why you died + how long you lived
// add png and sound effects for items
// add stickman

import { createRoot } from 'react-dom/client'
import { useState, useEffect, React } from 'react'

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('gameContainer') as HTMLElement).render(
    <GameContainer />
  )
})

function GameContainer() {
  const [health, setHealth] = useState(100)
  const [hunger, setHunger] = useState(100)
  const [thirst, setThirst] = useState(100)
  const [sleep, setSleep] = useState(100)
  const [boredom, setBoredom] = useState(100)
  const [wallet, setWallet] = useState(100)
  const [survivalTime, setSurvivalTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'healthBar')
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setHunger((prev) => {
        updateBar(prev, 'hungerBar')
        if (prev > 100) return 100
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setThirst((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'thirstBar')
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setSleep((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'sleepBar')
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setBoredom((prev) => {
        if (prev > 100) return 100
        updateBar(prev, 'boredomBar')
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
      setSurvivalTime((x) => x + 1)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  function handleHealth() {
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
    setHunger((x) => x + 40)
    setHealth((x) => x + 5)
    setWallet((x) => {
      updateBar(x - 20, 'walletBar')
      return x - 20
    })
  }
  function handleThirst() {
    setThirst((x) => x + 30)
    setHealth((x) => x + 5)
    setSleep((x) => x - 10)
    setWallet((x) => {
      updateBar(x - 10, 'walletBar')
      return x - 10
    })
  }
  function handleSleep() {
    setSleep((x) => x + 50)
    setHunger((x) => x - 20)
    setThirst((x) => x - 20)
    setHealth((x) => x + 10)
  }
  function handleBoredom() {
    setBoredom((x) => x + 50)
    setHunger((x) => x - 20)
    setThirst((x) => x - 10)
    setHealth((x) => x - 20)
  }
  function handleWallet() {
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

  function updateBar(x, bar) {
    const currentBar = document.getElementById(bar)
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
        <h3>Survival Time: {survivalTime}</h3>
        <div id="stickMan">
          <img src="stick.png" id="stick" />
        </div>
        <div id="buttonDiv">
          <button onClick={() => handleHealth()}>Gym</button>
          <button onClick={() => handleHunger()}>Steak</button>
          <button onClick={() => handleThirst()}>Monster</button>
          <button onClick={() => handleSleep()}>Bed</button>
          <button onClick={() => handleBoredom()}>Game</button>
          <button onClick={() => handleWallet()}>Work</button>
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
        </div>
      </div>
    </>
  )
}

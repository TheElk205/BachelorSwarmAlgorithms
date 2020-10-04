import {TestAgent} from "./TestAgent.js";

const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')

const gameSettings = {
  numberOfAgents: 10,
  fps: 30,
  debugEnabled: true
}

// Game Controls
const speedSlider = document.getElementById('speedSelector')
speedSlider.oninput = (input) => {
  console.log(input.target.value)
  for (let agent in agents) {
    agent.setSpeed(input.target.value)
  }
}
const isDebugEnabledToggle = document.getElementById('isDebugEnabled')
isDebugEnabledToggle.checked = gameSettings.debugEnabled
isDebugEnabledToggle.onchange = () => {
  gameSettings.debugEnabled = !gameSettings.debugEnabled
}


// Init everything here
const agents = [];

for (let i=0; i < gameSettings.numberOfAgents; i++)
{
  const agent = TestAgent(
      ctx,
      cvs,
      {
        position: [Math.random() * cvs.width, Math.random() * cvs.height]
      }
  )
  agent.setSpeed(speedSlider.value)
  agents.push(agent)
}

// Game Logic
const startedAt = performance.now()
let lastFrame = startedAt

const drawEverything = () =>
{
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  agents.forEach(agent =>
  {
    agent.update(performance.now() - lastFrame)
    if (gameSettings.debugEnabled) {
      agent.drawDebug()
    }
    agent.draw()
  })

  // Testing
  // ctx.rect(300, 320, 1, 1);
  // ctx.stroke()
  lastFrame = performance.now()
}

let game = setInterval(drawEverything, 1000 / gameSettings.fps)

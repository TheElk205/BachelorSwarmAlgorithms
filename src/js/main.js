import {TestAgent} from "./TestAgent.js";

const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')

const gameSettings = {
  numberOfAgents: 10,
  fps: 60,
  debugEnabled: true
}

// Game Controls
const speedSlider = document.getElementById('speedSelector')
speedSlider.oninput = (input) => {
  console.log(input.target.value)
  agents.forEach(agent => {
    agent.setSpeed(input.target.value)
  })
}

const isDebugEnabledToggle = document.getElementById('isDebugEnabled')
isDebugEnabledToggle.checked = gameSettings.debugEnabled
isDebugEnabledToggle.onchange = () => {
  gameSettings.debugEnabled = !gameSettings.debugEnabled
}

const perceptionAngleSlider = document.getElementById('perceptionAngleSelector')
perceptionAngleSlider.oninput = (input) => {
  console.log(input.target.value)
  agents.forEach(agent => {
    agent.setPerception({
      startAngle: -input.target.value,
      endAngle: input.target.value
    })
  })
}

const perceptionRadiusSlider = document.getElementById('perceptionRadiusSelector')
perceptionRadiusSlider.oninput = (input) => {
  console.log(input.target.value)
  agents.forEach(agent => {
    agent.setPerception({
      radius: input.target.value
    })
  })
}

// Init everything here
const agents = [];

for (let i=0; i < gameSettings.numberOfAgents; i++)
{
  const agent = TestAgent(
      ctx,
      cvs,
      {
        position: [Math.random() * cvs.width, Math.random() * cvs.height],
        velocity: [Math.random(), Math.random()]
      }
  )
  agent.setSpeed(speedSlider.value)
  agents.forEach(agent => {
    agent.setPerception({
      radius: perceptionRadiusSlider.value,
      startAngle: -perceptionAngleSlider.value,
      endAngle: perceptionAngleSlider.value,
    })
  })
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
    agents.forEach(perceptionAgents => {
      agent.addAgentIfWithinPerception(perceptionAgents)
    })
  })

  agents.forEach(agent => {
    if (gameSettings.debugEnabled) {
      agent.drawDebug()
    }
    agent.update(performance.now() - lastFrame)
    agent.draw()
  })

  // Testing
  // ctx.rect(300, 320, 1, 1);
  // ctx.stroke()
  lastFrame = performance.now()
}

// maybe split this up in visual update and "physics' Udpate.
let game = setInterval(drawEverything, 1000 / gameSettings.fps)

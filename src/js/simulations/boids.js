import {Boid} from "../agents/Boid.js";
import Simulation from "../Simulation";

const simulation = Simulation()

// Game Controls
const speedSlider = document.getElementById('speedSelector')
speedSlider.oninput = (input) => {
  console.log(input.target.value)
  agents.forEach(agent => {
    agent.setSpeed(input.target.value)
  })
}

const isDebugEnabledToggle = document.getElementById('isDebugEnabled')
isDebugEnabledToggle.checked = simulation.gameSettings.debugEnabled
isDebugEnabledToggle.onchange = () => {
  simulation.gameSettings.debugEnabled = !simulation.gameSettings.debugEnabled
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

for (let i=0; i < simulation.gameSettings.numberOfAgents; i++)
{
  const agent = Boid(
      simulation.gameContext,
      simulation.canvas,
      {
        position: [Math.random() * simulation.canvas.width, Math.random() * simulation.canvas.height],
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
  simulation.gameContext.clearRect(0, 0, simulation.canvas.width, simulation.canvas.height);
  agents.forEach(agent =>
  {
    agents.forEach(perceptionAgents => {
      agent.addAgentIfWithinPerception(perceptionAgents)
    })
  })

  agents.forEach(agent => {
    if (simulation.gameSettings.debugEnabled) {
      agent.drawDebug()
    }
    agent.update(performance.now() - lastFrame)
    agent.draw()
  })

  // Testing
  // simulation.gameContext.rect(300, 320, 1, 1);
  // simulation.gameContext.stroke()
  lastFrame = performance.now()
}

// maybe split this up in visual update and "physics' Udpate.
let game = setInterval(drawEverything, 1000 / simulation.gameSettings.fps)

import {Boid} from "../agents/Boid.js";
import Simulation from "../Simulation";
import Boid2 from "../agents/Boid2";

const simulation = Simulation()

// Game Controls
const fpsLabel = document.getElementById('fpsView')

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
      endAngle: parseFloat(input.target.value)
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
  const agent = new Boid2(
      simulation,
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

let stillRendering = false

const drawEverything = () =>
{
  const frameStart = performance.now()

  if (stillRendering)
  {
    console.error("can not keep FPS, skipping frame")
    return
  }
  stillRendering = true
  simulation.gameContext.setTransform(1,0,0,1,0,0);
  simulation.gameContext.clearRect(0, 0, simulation.canvas.width, simulation.canvas.height);

  // Check Neighbours
  agents.forEach(agent =>
  {
    agents.forEach(perceptionAgents => {
      agent.addAgentIfWithinPerception(perceptionAgents)
    })
  })

  // Draw all agents
  agents.forEach(agent => {
    agent.update(performance.now() - lastFrame)
    agent.drawDebug()
    agent.draw()
  })

  // Testing
  // simulation.gameContext.rect(300, 320, 1, 1);
  // simulation.gameContext.stroke()
  const duration = performance.now() - frameStart
  const fps = Math.round(1/(duration/1000) * 100) / 100
  fpsLabel.value = `${duration} ms (${fps} FPS)`
  lastFrame = performance.now()
  stillRendering = false
}

// maybe split this up in visual update and "physics' Udpate.
let game = setInterval(drawEverything, 1000 / simulation.gameSettings.fps)

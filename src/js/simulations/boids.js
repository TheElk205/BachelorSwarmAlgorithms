import {Boid} from "../agents/Boid.js";
import Simulation from "../Simulation";
import Boid2 from "../agents/Boid2";
import NumberSlider from "../uiUtils/NumberSlider";
import Checkbox from "../uiUtils/Checkbox";

const simulation = Simulation()

// Game Controls
const fpsLabel = document.getElementById('fpsView')

const speedSlider = NumberSlider('speedSelector', (value) => {
  console.log(value)
  agents.forEach(agent => {
    agent.setSpeed(value)
  })
});

const isDebugEnabledToggle = Checkbox('isDebugEnabled',
    () => {
      simulation.gameSettings.debugEnabled = !simulation.gameSettings.debugEnabled
    }, simulation.gameSettings.debugEnabled)

const perceptionAngleSlider = NumberSlider('perceptionAngleSelector', (value) => {
  console.log(value)
  agents.forEach(agent => {
    agent.setPerception({
      startAngle: -value,
      endAngle: value
    })
  })
});

const perceptionRadiusSlider = NumberSlider('perceptionRadiusSelector', (value) => {
  console.log(value)
  agents.forEach(agent => {
    agent.setPerception({
      radius: value
    })
  })
});

// Init everything here
const agents = [];

for (let i=0; i < simulation.gameSettings.numberOfAgents; i++)
{
  const agent = new Boid2(
    simulation,
    {
      position: [Math.random() * simulation.canvas.width, Math.random() * simulation.canvas.height],
      velocity: [Math.random() * 2 - 1, Math.random() * 2 - 1],
      parameters: {
        separation: 0.5,
        cohesion: 0.2,
        alignment: 0.001
      }
    }
  )
  agent.setSpeed(speedSlider.getValue())
  agent.setPerception({
    radius: perceptionRadiusSlider.getValue(),
    startAngle: -perceptionAngleSlider.getValue(),
    endAngle: perceptionAngleSlider.getValue(),
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
    agent.update(performance.now() - lastFrame)
    agent.drawDebug()
    agent.draw()
  })

  // Draw all agents
  agents.forEach(agent => {

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

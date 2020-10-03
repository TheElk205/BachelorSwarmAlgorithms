import {TestAgent} from "./TestAgent.js";

const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')

let agent =  TestAgent(ctx, cvs);

// Get controls
const speedSlider = document.getElementById('speedSelector')
speedSlider.oninput = (input) => {
  console.log(input.target.value)
  agent.setSpeed(input.target.value)
}

let fps = 30;

// ctx.fillStyle = 'red'
// ctx.fillRect(100, 200, 30, 30)

const startedAt = performance.now()
let lastFrame = startedAt

const drawEverything = () =>
{
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  agent.update(performance.now() - lastFrame)
  agent.draw()
  lastFrame = performance.now()
}

// Init everything here
agent.setSpeed(speedSlider.value)

let game = setInterval(drawEverything, 1000 / fps)

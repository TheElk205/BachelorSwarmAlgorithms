import {TestAgent} from "./TestAgent.js";

const cvs = document.getElementById('canvas')
const ctx = cvs.getContext('2d')

let agent =  TestAgent(ctx, cvs);
let debugEnabled = true;

// Get controls
const speedSlider = document.getElementById('speedSelector')
speedSlider.oninput = (input) => {
  console.log(input.target.value)
  agent.setSpeed(input.target.value)
}
const isDebugEnabledToggle = document.getElementById('isDebugEnabled')
isDebugEnabledToggle.checked = debugEnabled
isDebugEnabledToggle.onchange = () => {
  debugEnabled = !debugEnabled
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
  if (debugEnabled)
  {
    agent.drawDebug()
  }
  agent.draw()

  // Testing
  ctx.rect(300, 320, 1, 1);
  ctx.stroke()
  lastFrame = performance.now()
}

// Init everything here
agent.setSpeed(speedSlider.value)

let game = setInterval(drawEverything, 1000 / fps)

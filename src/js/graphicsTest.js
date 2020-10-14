// Game Controls

import Simulation from "./Simulation";
import GraphicsTestAgent from "./agents/GraphicsTestAgent";

const simulation = Simulation()

const testAgent = new GraphicsTestAgent(
    simulation,
    {
        position: [300, 300],
        velocity: [0, 0]
    }
)

const speedSlider = document.getElementById('rotationSelector')
speedSlider.oninput = (input) => {
    console.log("Rotation: ", input.target.value)
    testAgent.setPartialState("rotation", parseFloat(input.target.value))
}

const perceptionAngleSlider = document.getElementById('perceptionAngleSelector')
perceptionAngleSlider.oninput = (input) => {
    console.log("Perception angle: ", input.target.value)
    testAgent.setPerception({
        startAngle: -parseFloat(input.target.value),
        endAngle: parseFloat(input.target.value)
    })
}

const perceptionRadiusSlider = document.getElementById('perceptionRadiusSelector')
perceptionRadiusSlider.oninput = (input) => {
    console.log("Perception Radius: ", input.target.value)
    testAgent.setPerception({
        radius: parseFloat(input.target.value)
    })
}

// Init setup
testAgent.setPartialState("rotation", speedSlider.value)

// Game Logic
const startedAt = performance.now()
let lastFrame = startedAt

const drawEverything = () =>
{
    // Reset Simulation
    simulation.gameContext.setTransform(1,0,0,1,0,0);
    simulation.gameContext.clearRect(0,0,simulation.canvas.width, simulation.canvas.height);

    // if (simulation.gameSettings.debugEnabled) {
    testAgent.drawDebug()
    // }
    testAgent.update(performance.now() - lastFrame)
    testAgent.draw()

    // Testing
    // simulation.gameContext.rect(300, 320, 1, 1);
    // simulation.gameContext.stroke()
    lastFrame = performance.now()
}

// maybe split this up in visual update and "physics' Udpate.
let game = setInterval(drawEverything, 1000 / simulation.gameSettings.fps)
// Game Controls

import Simulation from "./Simulation";
import GraphicsTestAgent from "./agents/GraphicsTestAgent";
import NumberSlider from "./uiUtils/NumberSlider";

const simulation = Simulation()

const testAgent = new GraphicsTestAgent(
    simulation,
    {
        position: [300, 300],
        velocity: [0, 0]
    }
)

const perceptionTestAgent = new GraphicsTestAgent(
    simulation,
    {
        position: [300, 350],
        velocity: [0, 0],
        perception: {
            radius: 0
        }
    }
)

const speedSlider = NumberSlider('rotationSelector', (value) => {
    console.log("Rotation: ", value)
    testAgent.setPartialState("rotation", value)
});

const perceptionAngleSlider = NumberSlider('perceptionAngleSelector',  (value) => {
    console.log("Perception angle: ", value)
    testAgent.setPerception({
        startAngle: -value,
        endAngle: value
    })
});

const perceptionRadiusSlider = NumberSlider('perceptionRadiusSelector', (value) => {
    console.log("Perception Radius: ", value)
    testAgent.setPerception({
        radius: value
    })
});

// Init setup
testAgent.setPartialState("rotation", speedSlider.getValue())
testAgent.setPerception({
    radius: perceptionRadiusSlider.getValue(),
    startAngle: -perceptionAngleSlider.getValue(),
    endAngle: perceptionAngleSlider.getValue()
})
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
    perceptionTestAgent.drawDebug()
    // }
    testAgent.getPerception("default").checkIfPointWithinPerception(
        perceptionTestAgent.getState().position[0],
        perceptionTestAgent.getState().position[1])
    testAgent.update(performance.now() - lastFrame)
    perceptionTestAgent.update(performance.now() - lastFrame)
    testAgent.draw()
    perceptionTestAgent.draw()

    // Testing
    // simulation.gameContext.rect(300, 320, 1, 1);
    // simulation.gameContext.stroke()
    lastFrame = performance.now()
}

// maybe split this up in visual update and "physics' Udpate.
let game = setInterval(drawEverything, 1000 / simulation.gameSettings.fps)
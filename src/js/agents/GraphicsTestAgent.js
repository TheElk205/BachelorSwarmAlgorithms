import {MathUtils} from "../utils/MathHelpers";
import defaultState from "./defaultState";

const GraphicsTestAgent = (gameContext, gameCanvas, startState = {}) => {
    console.log("Creating Test Agent")

    const maxSpeed = 0.1

    const angleOffset = 180.0

    const state = {
        ...defaultState,
        ...startState,
        id: MathUtils.uuidv4()
    }

    let agent = new Image()
    agent.onload = () => {
        console.log('Agent loaded')
        console.log(gameCanvas.width)
        state.isLoaded = true
    }
    agent.src = '../img/Agent/Agent.png'

    // no need to use save and restore between calls as it sets the transform rather
    // than multiply it like ctx.rotate ctx.translate ctx.scale and ctx.transform
    // Also combining the scale and origin into the one call makes it quicker
    // x,y position of image center
    // scale scale of image
    // rotation in radians.
    const drawImage = (image, x, y, scale, rotationRadians) => {
        gameContext.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        gameContext.rotate(rotationRadians);
        gameContext.drawImage(image, -image.width / 2, -image.height / 2);
    }

    const calculatePerception = (perception) =>
    {
        const perceptionOffset = angleOffset + 90.0
        const position = [
            0,
            0
        ]
        // console.log("Plain Angle: ", perception.startAngle)
        // console.log("Plain Angle with ofset: ", angleOffset + perception.startAngle)
        gameContext.beginPath();
        gameContext.arc(
            position[0],
            position[1],
            perception.radius,
            MathUtils.deg2rad(perceptionOffset + perception.startAngle),
            MathUtils.deg2rad(perceptionOffset + perception.endAngle)
        );
        gameContext.moveTo(
            position[0],
            position[1]
        )
        const arcStartPoint = MathUtils.getPointOnArc(
            position[0],
            position[1],
            state.perception.radius,
            MathUtils.deg2rad(perceptionOffset + perception.startAngle)
        )
        gameContext.lineTo(
            arcStartPoint[0],
            arcStartPoint[1]
        )
        const arcEndPoint = MathUtils.getPointOnArc(
            position[0],
            position[1],
            state.perception.radius,
            MathUtils.deg2rad(perceptionOffset + perception.endAngle)
        )
        gameContext.lineTo(
            arcEndPoint[0],
            arcEndPoint[1]
        )
        gameContext.lineTo(
            position[0],
            position[1],
        )
        gameContext.closePath()
    }

    const drawPerception = (perception) =>
    {
        calculatePerception(state.perception)
        gameContext.stroke();
    }

    const setPartialState = (name, value, hardOverwrite = true) => {
        console.log("Setting for key: ", name)
        console.log("Setting value  : ", value)
        if (typeof state[name] === 'object' && state[name] !== null)
        {
            state[name] = {
                ... (hardOverwrite ? state[name] : null),
                ...value
            }
        }
        else
        {
            state[name] = value
        }
        console.log("Saved everything: ", state[name])
    }

    return {
        // helper
        setSpeed: (newSpeed) => {
        },
        setPerception: (newPerception) => {
            setPartialState("perception", newPerception)
        },
        addAgentIfWithinPerception: (agent) => {
        },
        update: (deltaTime) => {
        },
        drawDebug: () => {
            if (!state.isLoaded)
            {
                return
            }

            const angle = angleOffset + state.rotation
            gameContext.setTransform(1, 0, 0, 1, state.position[0],
                state.position[1]); // sets scale and origin
            gameContext.rotate(MathUtils.deg2rad(angle));
            drawPerception(state.perception)
            // isPointInPerception(state.perception, 300, 320)
            gameContext.font = "16px Arial";
            gameContext.fillText(
                "" + state.agentsWithinPerception.length,
                0,
                -10);
            // gameContext.fillText(
            //     "" + state.rotation,
            //     -10,
            //     -10);
        },
        draw: () => {
            if (!state.isLoaded)
            {
                return
            }
            const angle = angleOffset + state.rotation
            drawImage(agent,
                state.position[0],
                state.position[1],
                0.5,
                MathUtils.deg2rad(angle)
            )
        },
        setPartialState: setPartialState,

        getState: () => {
            return state
        }
    }
}

export default GraphicsTestAgent
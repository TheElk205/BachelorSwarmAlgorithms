import {MathUtils} from "../utils/MathHelpers";
import Drawable from "../engine/Drawable";

class AbstractAgent extends Drawable {
    constructor(simualtionSettings, startState = {}, agentImage = './img/Agent/Agent.png') {
        super(agentImage, simualtionSettings);
        console.log("Creating Agent")

        this.perceptions = new Map()
    }

    setPartialState = (name, value, hardOverwrite = true) => {
        if (typeof this.state[name] === 'object' && this.state[name] !== null)
        {
            this.state[name] = {
                ... (hardOverwrite ? state[name] : null),
                ...value
            }
        }
        else
        {
            this.state[name] = value
        }
    }

    // helper
    setSpeed = (newSpeed) => {
    }

    setPerceptionParameters = (perceptionKey, perceptionParameters) => {
        const perception = this.perceptions.get(perceptionKey);
        if (perception === undefined)
        {
            console.error(`No perception found for key: ${perceptionKey}`)
            return
        }
        perception.setPerception(perceptionParameters)
    }

    update = (deltaTime) => {
    }

    drawDebug = () => {
        if (!this.isLoaded || !this.simulationSettings.gameSettings.debugEnabled)
        {
            return
        }

        // TODO readd text rendering
        const perceptionOffset = this.angleOffset + 90
        const angle = this.angleOffset + this.state.rotation
        // gameContext.setTransform(1, 0, 0, 1, this.state.position[0],
        //     state.position[1]); // sets scale and origin
        // gameContext.rotate(MathUtils.deg2rad(angle));
        for (let [key, value] of this.perceptions) {
            value.draw()
        }
        // isPointInPerception(state.perception, 300, 320)
        // gameContext.font = "16px Arial";
        // gameContext.fillText(
        //     "" + state.agentsWithinPerception.length,
        //     0,
        //     -10);
        // gameContext.fillText(
        //     "" + state.rotation,
        //     -10,
        //     -10);
    }
    draw = () => {
        const angle = this.angleOffset + this.state.rotation
        super.draw(
            this.state.position[0],
            this.state.position[1],
            0.5,
            MathUtils.deg2rad(angle)
        )
    }

    getState = () => {
        return this.state
    }

    addPerception = (key, perception) =>
    {
        this.perceptions.set(key, perception)
    }

    getPerception = (key) => {
        this.perceptions.get(key)
    }
}

export default AbstractAgent
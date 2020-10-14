import {MathUtils} from "../utils/MathHelpers";
import defaultState from "./defaultState";
import Perception from "../engine/Perception";
import AbstractAgent from "./AbstractAgent";

class GraphicsTestAgent extends AbstractAgent {
    constructor(simualtionSettings, startState = {}) {
        super(simualtionSettings, startState);
        console.log("Creating Graphics Test Agent")

        this.maxSpeed = 0.1
        this.angleOffset = 180.0

        this.state = {
            ...defaultState,
            ...startState,
            id: MathUtils.uuidv4()
        }

        this.addPerception("default", new Perception(simualtionSettings, this, this.state.perception))
    }

    setPerception = (newPerceptionParameters) => {
        this.setPerceptionParameters("default", newPerceptionParameters)
    }
}

export default GraphicsTestAgent
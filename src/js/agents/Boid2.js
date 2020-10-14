import AbstractAgent from "./AbstractAgent";
import {MathUtils} from "../utils/MathHelpers";
import defaultState from "./defaultState";
import Perception from "../engine/Perception";

class Boid2 extends AbstractAgent
{
    constructor(simualtionSettings, startState = {}) {
        super(simualtionSettings, startState);
        console.log("Creating Boids Agent")

        this.maxSpeed = 0.1
        this.angleOffset = 90.0

        this.state = {
            ...defaultState,
            ...startState,
            agentsWithinPerception: [],
            id: MathUtils.uuidv4()
        }

        this.addPerception("default", new Perception(simualtionSettings, this, this.state.perception, 0))
    }

    setPerception = (newPerceptionParameters) => {
        this.setPerceptionParameters("default", newPerceptionParameters)
    }

    addAgentIfWithinPerception = (otherAgent) => {
        const otherAgentId = otherAgent.getState().id;
        if (this.state.id === otherAgentId)
        {
            return
        }
        const positionOtherAgent = otherAgent.getState().position;
        if (this.perceptions.get("default").checkIfPointWithinPerception(
            positionOtherAgent[0],
            positionOtherAgent[1]
        )) {
            this.state.agentsWithinPerception.push(otherAgent)
        }
    }

    move = (moveVelocity) => {
        this.state.position[0] += moveVelocity[0]
        this.state.position[1] += moveVelocity[1]

        // Reset when moving out of the canvas
        this.state.position[0] = this.calculateOverflow(this.state.position[0], this.simulationSettings.canvas.width + 10, 10)
        this.state.position[1] = this.calculateOverflow(this.state.position[1], this.simulationSettings.canvas.height + 10, 10)
    }

    calculateOverflow = (newValue, max, min = 0) => {
        if (newValue < min)
        {
            return max - Math.abs(newValue) - min
        }
        else if (newValue > max)
        {
            return newValue - max + min
        }
        return newValue
    }

    calculateNewNormalizedVelocity = () => {
        // console.log(`agent ${this.state.id} has ${this.state.agentsWithinPerception.length} agents within perception`)
        // Separation
        const separation = [0, 0];
        this.state.agentsWithinPerception.forEach(agent => {
            separation[0] += (this.state.position[0] - agent.getState().position[0] * this.state.parameters.separation)
            separation[1] += (this.state.position[1] - agent.getState().position[1] * this.state.parameters.separation)
        })

        separation[0] = -separation[0]
        separation[1] = -separation[1]

        // Cohesion
        const cohesion = [0, 0];
        this.state.agentsWithinPerception.forEach(agent => {
            cohesion[0] += agent.getState().position[0]
            cohesion[1] += agent.getState().position[1]
        })

        cohesion[0] = cohesion[0] / this.state.agentsWithinPerception.length
        cohesion[1] = cohesion[1] / this.state.agentsWithinPerception.length

        cohesion[0] = (cohesion[0] - this.state.position[0]) * this.state.parameters.cohesion
        cohesion[1] = (cohesion[1] - this.state.position[1]) * this.state.parameters.cohesion

        // Alignment
        const alignment = [0,0]
        this.state.agentsWithinPerception.forEach(agent => {
            alignment[0] += (this.state.velocity[0] - agent.getState().velocity[0] * this.state.parameters.alignment)
            alignment[1] += (this.state.velocity[1] - agent.getState().velocity[1] * this.state.parameters.alignment)
        })

        alignment[0] = -alignment[0]
        alignment[1] = -alignment[1]

        let newVelocity = this.state.velocity

        newVelocity[0] = separation[0] + cohesion[0] + alignment[0]
        newVelocity[1] = separation[1] + cohesion[1] + alignment[1]

        // console.log('new Velocity: ', newVelocity)

        return MathUtils.normalizeVelocity(newVelocity)
    }

    update = (deltaTime) => {
        // Calculate Boids stuff here
        let newVelocity = this.state.velocity

        if (this.state.agentsWithinPerception.length !== 0) {
            newVelocity = this.calculateNewNormalizedVelocity()
        }

        const speed = this.maxSpeed * this.state.currentSpeed

        this.state.velocity = newVelocity

        // Adapt according to time which has passed since last frame
        const moveVelocity = [
            newVelocity[0] * deltaTime * speed,
            newVelocity[1] * deltaTime * speed,
        ]

        this.state.rotation = parseFloat(MathUtils.angleFromVelocity(moveVelocity))

        this.move(moveVelocity)
        this.state.agentsWithinPerception = []
    }

    setSpeed = (newSpeed) =>
    {
        this.state.currentSpeed = newSpeed / 100
    }
}

export default Boid2
import Drawable from "./Drawable";
import {MathUtils} from "../utils/MathHelpers";

class Perception extends Drawable
{
    constructor(simulationSetings, agent, perception, perceptionOffset = 90)
    {
        super(null, simulationSetings);
        this.agent = agent
        this.drawPerceptionLocally = this.drawPerceptionLocally.bind(this)
        this.perception = perception
        this.perceptionOffset = perceptionOffset
    }

    checkIfPointWithinPerception = (x, y) => {
        const agentState = this.agent.getState()
        const between = [
            agentState.position[0] - x,
            agentState.position[1] - y
        ]

        const length = MathUtils.calculateMagnitude(between)

        // Need to check triangle here as well
        if (length < this.perception.radius)
        {
            // console.log(`found friend at: ${x}/${y}`)
            return true
        }

        return false
    }

    calculatePerception = (perception, perceptionOffset = 0) =>
    {
        const gameContext = this.simulationSettings.gameContext
        const position = [0, 0]

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
            perception.radius,
            MathUtils.deg2rad(perceptionOffset + perception.startAngle)
        )
        gameContext.lineTo(
            arcStartPoint[0],
            arcStartPoint[1]
        )
        const arcEndPoint = MathUtils.getPointOnArc(
            position[0],
            position[1],
            perception.radius,
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

    draw = () =>
    {
        const state = this.agent.getState()
        super.draw(state.position[0], state.position[1], 1, MathUtils.deg2rad(state.rotation), this.drawPerceptionLocally);
    }

    drawPerceptionLocally = (perception, perceptionOffset) => {
        const gameContext = this.simulationSettings.gameContext
        this.calculatePerception(this.perception, this.perceptionOffset)
        gameContext.stroke();
    }

    setPerception = (perception) => {
        this.perception = {...this.perception, ...perception}
    }
}
export default Perception
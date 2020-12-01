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

        const distance = [
            agentState.position[0] - x,
            agentState.position[1] - y
        ]

        const rotationRad = MathUtils.deg2rad(this.agent.getState().rotation)

        const relativePosition = [
            Math.cos(rotationRad) * distance[0] - Math.sin(rotationRad) * distance[1],
            Math.sin(rotationRad) * distance[0] + Math.cos(rotationRad) * distance[1]
        ]

        const between = [
            x - agentState.position[0],
            y - agentState.position[1]
        ]

        const betweenRotated = MathUtils.rotateVector(between, -this.agent.getState().rotation)

        // console.log(`rotation: ${this.agent.getState().rotation}, agent position: ${agentState.position}, to check position: ${x},${y}, relative Position: ${betweenRotated}` )
        const gameContext = this.simulationSettings.gameContext

        this.simulationSettings.gameContext.setTransform(1, 0, 0, 1, agentState.position[0], agentState.position[1]); // sets scale and origin
        this.simulationSettings.gameContext.rotate(
            MathUtils.deg2rad(this.agent.getState().rotation)
        );

        const startVector = MathUtils.getPointOnArc(
            0,
            0,
            this.perception.radius,
            MathUtils.deg2rad(this.perceptionOffset + this.perception.startAngle));

        const endVector = MathUtils.getPointOnArc(
            0,
            0,
            this.perception.radius,
            MathUtils.deg2rad(this.perceptionOffset + this.perception.endAngle));

        gameContext.beginPath();
        gameContext.strokeStyle = "red";
        gameContext.arc(betweenRotated[0], betweenRotated[1], 15, 0, 2 * Math.PI);
        gameContext.stroke();

        gameContext.beginPath();
        gameContext.strokeStyle = "blue";
        gameContext.arc(startVector[0], startVector[1], 15, 0, 2 * Math.PI);
        gameContext.stroke();

        gameContext.beginPath();
        gameContext.strokeStyle = "green";
        gameContext.arc(endVector[0], endVector[1], 15, 0, 2 * Math.PI);
        gameContext.stroke();

        // gameContext.beginPath();
        // gameContext.strokeStyle = "green";
        // gameContext.arc(between[0], between[1], 15, 0, 2 * Math.PI);
        // gameContext.stroke();

        return MathUtils.isPointInArc(this.perception, this.perceptionOffset, betweenRotated)
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
        const arcStartPoint = MathUtils.getPointOnArc(
            position[0],
            position[1],
            perception.radius,
            MathUtils.deg2rad(perceptionOffset + perception.startAngle)
        )
        gameContext.moveTo(
            position[0],
            position[1]
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
        gameContext.moveTo(
            position[0],
            position[1]
        )
        gameContext.lineTo(
            arcEndPoint[0],
            arcEndPoint[1]
        )

        const startArcVector = [
            arcStartPoint[0] - position[0],
            arcStartPoint[1] - position[1]
        ]
        const endArcVector = [
            arcEndPoint[0] - position[0],
            arcEndPoint[1] - position[1]
        ]
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
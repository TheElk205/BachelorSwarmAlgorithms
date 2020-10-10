import {MathUtils} from "../utils/MathHelpers";

const defaultState = {
    isLoaded: false,
    size: [25, 25],
    position: [1, 1],
    currentSpeed: 0.5,
    rotation: 45, //degree
    velocity: [1, 1],
    perception: {
        radius: 50,
        startAngle: -135,
        endAngle: 135
    },
    parameters: {
        separation: 1,
        cohesion: 1,
        alignment: 1
    },
    agentsWithinPerception: []
}

export default defaultState

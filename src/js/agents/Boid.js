import {MathUtils} from "../utils/MathHelpers";
import defaultState from "./defaultState";

export const Boid = (gameContext, gameCanvas, startState = {}) => {
  console.log("Creating Test Agent")

  const maxSpeed = 0.1

  const angleOffset = 0

  const state = {
    ...defaultState,
    ...startState,
    id: MathUtils.uuidv4()
  }

  console.log("Created agent with id: ", state.id)

  state.rotation = MathUtils.angleFromVelocity(state.velocity)
  state.velocity = MathUtils.normalizeVelocity(state.velocity)

  let agent = new Image()
  agent.onload = () => {
    console.log('Agent loaded')
    console.log(gameCanvas.width)
    state.isLoaded = true
  }
  agent.src = '../img/Agent/Agent.png'

  console.log("Angle in radiants: ", MathUtils.deg2rad(state.perception.startAngle))
  const move = (moveVelocity) => {

    state.position[0] += state.velocity[0] * moveVelocity[0]
    state.position[1] += state.velocity[1] * moveVelocity[1]

    // Reset when moving out of the canvas
    state.position[0] = state.position[0] % gameCanvas.width
    state.position[1] = state.position[1] % gameCanvas.height
  }

  const calculatePerception = (perception) =>
  {
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
        MathUtils.deg2rad(angleOffset + perception.startAngle),
        MathUtils.deg2rad(angleOffset + perception.endAngle)
    );
    gameContext.moveTo(
        position[0],
        position[1]
    )
    const arcStartPoint = MathUtils.getPointOnArc(
        position[0],
        position[1],
        state.perception.radius,
        MathUtils.deg2rad(angleOffset + perception.startAngle)
    )
    gameContext.lineTo(
        arcStartPoint[0],
        arcStartPoint[1]
    )
    const arcEndPoint = MathUtils.getPointOnArc(
        position[0],
        position[1],
        state.perception.radius,
        MathUtils.deg2rad(angleOffset + perception.endAngle)
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

  const localTransformation = (functionBody) =>
  {
    gameContext.save()

    gameContext.translate(
        state.position[0],
        state.position[1]
    )

    gameContext.rotate(MathUtils.deg2rad(state.rotation))

    functionBody()

    gameContext.restore()
  }

  const isPointInPerception = (perception, x, y) =>
  {
    calculatePerception(perception)
    // Maype i need to translate this point?? Not quite sure
    if (gameContext.isPointInPath(x, y))
    {
      console.log(`Point (${x} / ${y}) is is within perception`)
    }
  }

  const addAgentIfWithinPerception = (perception, otherAgent) =>
  {
    if (otherAgent.getState().id === state.id)
    {
      return // Its me!
    }
    calculatePerception(perception)
    const between = [
        state.position[0] - otherAgent.getState().position[0],
        state.position[1] - otherAgent.getState().position[1]
        ]

    const length = MathUtils.calculateMagnitude(between)

    if (length < state.perception.radius)
    {
      state.agentsWithinPerception.push(otherAgent)
      // console.log("found friend no: ", state.agentsWithinPerception.length)
    }
  }

  // no need to use save and restore between calls as it sets the transform rather
  // than multiply it like ctx.rotate ctx.translate ctx.scale and ctx.transform
  // Also combining the scale and origin into the one call makes it quicker
  // x,y position of image center
  // scale scale of image
  // rotation in radians.
  const drawImage = (image, x, y, scale, rotation) => {
    gameContext.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    gameContext.rotate(rotation);
    gameContext.drawImage(image, -image.width / 2, -image.height / 2);
  }

  return {
    // helper
    setSpeed: (newSpeed) =>
    {
      state.currentSpeed = newSpeed / 100
    },
    setPerception: (newPerception) =>
    {
      state.perception = {
        ...state.perception,
        ...newPerception
      }
    },
    addAgentIfWithinPerception: (agent) => {
      addAgentIfWithinPerception(state.perception, agent)
    },
    update: (deltaTime) => {
      // Calculate Boids stuff here
      let newVelocity = state.velocity

      if (state.agentsWithinPerception.length > 0)
      {
        // console.log(`agent ${state.id} has ${state.agentsWithinPerception.length} agents within perception`)
        // Separation
        const separation = [0, 0];
        state.agentsWithinPerception.forEach(agent => {
          separation[0] += (state.position[0] - agent.getState().position[0] * state.parameters.separation)
          separation[1] += (state.position[1] - agent.getState().position[1] * state.parameters.separation)
        })

        separation[0] = -separation[0]
        separation[1] = -separation[1]

        // Cohesion
        const cohesion = [0, 0];
        state.agentsWithinPerception.forEach(agent => {
          cohesion[0] += agent.getState().position[0]
          cohesion[1] += agent.getState().position[1]
        })

        cohesion[0] = cohesion[0] / state.agentsWithinPerception.length
        cohesion[1] = cohesion[1] / state.agentsWithinPerception.length

        cohesion[0] = (cohesion[0] - state.position[0]) * state.parameters.cohesion
        cohesion[1] = (cohesion[1] - state.position[1]) * state.parameters.cohesion

        // Alignment
        const alignment = [0,0]
        state.agentsWithinPerception.forEach(agent => {
          alignment[0] += (state.velocity[0] - agent.getState().velocity[0] * state.parameters.alignment)
          alignment[1] += (state.velocity[1] - agent.getState().velocity[1] * state.parameters.alignment)
        })

        alignment[0] = -alignment[0]
        alignment[1] = -alignment[1]

        newVelocity[0] = separation[0] + cohesion[0] + alignment[0]
        newVelocity[1] = separation[1] + cohesion[1] + alignment[1]

        // console.log('new Velocity: ', newVelocity)

      }

      newVelocity = MathUtils.normalizeVelocity(newVelocity)
      const speed = maxSpeed * state.currentSpeed

      state.velocity = newVelocity
      state.rotation = MathUtils.angleFromVelocity(newVelocity)

      const moveVelocity = [
        newVelocity[0] * deltaTime * speed,
        newVelocity[1] * deltaTime * speed,
      ]

      move(moveVelocity)
      state.agentsWithinPerception = []
    },
    drawDebug: () => {
      if (!state.isLoaded)
      {
        return
      }

      localTransformation(() => {
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
      })
    },
    draw: () => {
      if (!state.isLoaded)
      {
        return
      }
      localTransformation(() => {
        drawImage(agent,
            state.position[0],
            state.position[1],
            0.5,
            state.rotation
        )
      })
    },
    getState: () =>
    {
      return state
    }
  }
}

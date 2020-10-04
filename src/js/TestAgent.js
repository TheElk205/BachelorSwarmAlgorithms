import {MathUtils} from "./MathHelpers";

export const TestAgent = (gameContext, gameCanvas, startState = {}) => {
  console.log("Creating Test Agent")

  const maxSpeed = 0.1

  const angleOffset = -90

  const state = {
    isLoaded: false,
    size: [25, 25],
    position: [1, 1],
    currentSpeed: 0.5,
    rotation: 45, //degree
    perception: {
      radius: 50,
      startAngle: -135,
      endAngle: 135
    },
    ...startState
  }

  let agent = new Image()
  agent.onload = () => {
    console.log('Agent loaded')
    console.log(gameCanvas.width)
    state.isLoaded = true
  }
  agent.src = './img/Agent/Agent.png'

  console.log("Angle in radiants: ", MathUtils.deg2rad(state.perception.startAngle))
  const move = (xOffset, zOffset) => {
    state.position[0] += xOffset
    state.position[1] += zOffset

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
    if (gameContext.isPointInPath(x, y))
    {
      console.log("Yes it is")
    }
  }

  return {
    // helper
    setSpeed: (newSpeed) =>
    {
      state.currentSpeed = newSpeed / 100
    },
    update: (deltaTime) => {
      const speed = maxSpeed * state.currentSpeed
      move(deltaTime * speed, deltaTime * speed)
    },
    drawDebug: () => {
      if (!state.isLoaded)
      {
        return
      }

      localTransformation(() => {
        drawPerception(state.perception)
        isPointInPerception(state.perception, 300, 320)
      })
    },
    draw: () => {
      if (!state.isLoaded)
      {
        return
      }
      localTransformation(() => {
        gameContext.drawImage(agent,
            -state.size[0] / 2,
            -state.size[1] / 2,
            state.size[0],
            state.size[1],
        )
      })
    }
  }
}

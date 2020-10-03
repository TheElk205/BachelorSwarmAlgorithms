export const TestAgent = (gameContext, gameCanvas) => {
  console.log("Creating Test Agent")

  const maxSpeed = 0.1

  const state = {
    isLoaded: false,
    size: [25, 25],
    position: [1, 1],
    currentSpeed: 0.5
  }

  let agent = new Image()
  agent.onload = () => {
    console.log('Agent loaded')
    console.log(gameCanvas.width)
    state.isLoaded = true
  }
  agent.src = './img/Agent/Agent.png'

  const move = (xOffset, zOffset) => {
    state.position[0] += xOffset
    state.position[1] += zOffset

    // Reset when moving out of the canvas
    state.position[0] = state.position[0] % gameCanvas.width
    state.position[1] = state.position[1] % gameCanvas.height
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
    draw: () => {
      if (!state.isLoaded)
      {
        return
      }
      gameContext.drawImage(agent,
        state.position[0],
        state.position[1],
        state.size[0],
        state.size[1],
        )
    }
  }
}

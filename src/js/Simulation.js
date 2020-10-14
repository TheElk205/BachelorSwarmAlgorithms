const Simulation = () =>
{
    const cvs = document.getElementById('canvas')
    const ctx = cvs.getContext('2d')

    return {
        gameSettings: {
            numberOfAgents: 20,
            fps: 30,
            debugEnabled: true
        },
        gameContext : ctx,
        canvas: cvs
    }
}

export default Simulation
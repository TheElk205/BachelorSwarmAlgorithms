

const Simulation = () =>
{
    const cvs = document.getElementById('canvas')
    const ctx = cvs.getContext('2d')

    return {
        gameSettings: {
            numberOfAgents: 15,
            fps: 60,
            debugEnabled: true
        },
        gameContext : ctx,
        canvas: cvs
    }
}

export default Simulation
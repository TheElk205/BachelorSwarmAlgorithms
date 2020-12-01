import Simulation from "../Simulation";

class Drawable {
    constructor(assetPath, parent = null, simulationSettings = Simulation()) {

        if (assetPath != null)
        {
            this.image = new Image()
            this.image.onload = () => {
                console.log('Agent loaded')
                console.log(simulationSettings.canvas.width)
                this.isLoaded = true
            }
            this.image.src = assetPath
        }
        else {
            this.image = null
            this.isLoaded = true
        }


        this.simulationSettings = simulationSettings
        this.parent = parent
    }

    // no need to use save and restore between calls as it sets the transform rather
    // than multiply it like ctx.rotate ctx.translate ctx.scale and ctx.transform
    // Also combining the scale and origin into the one call makes it quicker
    // x,y position of image center
    // scale scale of image
    // rotation in radians.
    draw( x, y, scale, rotationRadians, additinalDrawing = null)
    {
        if (!this.isLoaded)
        {
            return
        }
        this.simulationSettings.gameContext.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.simulationSettings.gameContext.rotate(rotationRadians);
        if (this.image !== null && this.image !== undefined) {
            this.simulationSettings.gameContext.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
        }

        if (additinalDrawing !== null)
        {
            additinalDrawing()
        }
    }
}

export default Drawable;
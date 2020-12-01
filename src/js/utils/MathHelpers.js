export class MathUtils {
    static deg2rad = (degrees) => {
        return degrees * (3.14 / 180.0)
    }

    static rad2deg = (rad) => {
        return rad / (Math.PI / 180.0)
    }

    static getPointOnArc(cx,cy,radius,angle_rad){
        return [cx+Math.cos(angle_rad)*radius,cy+Math.sin(angle_rad)*radius];
    }

    static rotateVector(vector, angleDegree)
    {
        const angleRad = this.deg2rad(angleDegree)
        return [
            Math.cos(angleRad) * vector[0] - Math.sin(angleRad) * vector[1],
            Math.sin(angleRad) * vector[0] + Math.cos(angleRad) * vector[1],
        ]

    }

    // All points have to be relative to 0
    static isPointInArc(perception, perceptionOffset, toCheckPoint) {
        if (perception.endAngle > 90)
        {
            console.log(`angle of ${perception.startAngle} not supported yet`)
            return false;
        }

        const startVector = MathUtils.getPointOnArc(
            0,
            0,
            perception.radius,
            MathUtils.deg2rad(perceptionOffset + perception.startAngle));

        const endVector = MathUtils.getPointOnArc(
            0,
            0,
            perception.radius,
            MathUtils.deg2rad(perceptionOffset + perception.endAngle));
        console.log(`ToCheck: ${toCheckPoint}, StartVector: ${startVector}, EndVector: ${endVector}`)

        const isClockwise = this.areVectorsClockwise(startVector, toCheckPoint);
        const isCounterclockwise = !this.areVectorsClockwise(endVector, toCheckPoint);
        const isInRadius = this.calculateMagnitude(toCheckPoint) <= perception.radius;

        console.log(`clockwise: ${isClockwise}, counterClockwise: ${isCounterclockwise} in Radius: ${isInRadius}`)
        console.log(`Is in: ${isClockwise && isCounterclockwise && isInRadius}`)
    }

    static areVectorsClockwise(v1, v2)  {
        return -v1[0]*v2[1] + v1[0]*v2[0] > 0;
    }

    static uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static angleBetweenVectors(v0, v1) {
        const multiplied = v0[0]*v1[0] + v0[1]*v1[1]
        const v0Abs = Math.sqrt(v0[0]*v0[0] + v0[1]*v0[1])
        const v1Abs = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1])

        return Math.acos(multiplied / (v0Abs * v1Abs))
    }

    static angleFromVelocity(velocity) {
        const angleRad = Math.atan2(velocity[1], velocity[0])
        // console.log(`Angle from velocity; ${angleRad}`)
        return MathUtils.rad2deg(angleRad)
    }

    static normalizeVelocity(velocity) {
        const magnitude = MathUtils.calculateMagnitude(velocity)
        return [velocity[0] / magnitude, velocity[1] / magnitude]
    }

    static calculateMagnitude(vector) {
        return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1])
    }
}
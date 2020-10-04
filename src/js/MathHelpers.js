export class MathUtils {
    static deg2rad = (degrees) => {
        return degrees * (3.14 / 180.0)
    }

    static rad2deg = (rad) => {
        return rad / (3.14 / 180.0)
    }

    static getPointOnArc(cx,cy,radius,angle_rad){
        return [cx+Math.cos(angle_rad)*radius,cy+Math.sin(angle_rad)*radius];
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
        return MathUtils.rad2deg(Math.atan2(velocity[1], velocity[0]))
    }

    static normalizeVelocity(velocity) {
        const magnitude = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1])
        return [velocity[0] / magnitude, velocity[1] / magnitude]
    }
}
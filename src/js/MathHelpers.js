export class MathUtils {
    static deg2rad = (degrees) => {
        return degrees * (3.14/ 180)
    }
    static getPointOnArc(cx,cy,radius,angle_rad){
        return [cx+Math.cos(angle_rad)*radius,cy+Math.sin(angle_rad)*radius];
    }
}
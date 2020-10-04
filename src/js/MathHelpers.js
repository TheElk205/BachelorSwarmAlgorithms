export class MathUtils {
    static deg2rad = (degrees) => {
        return degrees * (3.14 / 180.0)
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
}
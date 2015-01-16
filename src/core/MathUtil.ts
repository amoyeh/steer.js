module steer {

    export class MathUtil {

        public static ONED: number = Math.PI / 180;

        public static getElementPosition(element: any): { x: number; y: number } {
            var elem = element, tagname = "", x = 0, y = 0;
            while ((typeof (elem) == "object") && (typeof (elem.tagName) != "undefined")) {
                y += elem.offsetTop;
                x += elem.offsetLeft;
                tagname = elem.tagName.toUpperCase();
                if (tagname == "BODY") elem = 0;
                if (typeof (elem) == "object") {
                    if (typeof (elem.offsetParent) == "object")
                        elem = elem.offsetParent;
                }
            }
            return { x: x, y: y };
        }

        public static dist(x1: number, y1: number, x2: number, y2: number): number {
            var dx: number = x2 - x1;
            var dy: number = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        }

        public static isPointOnWall(sx: number, sy: number, ex: number, ey: number, checkX: number, checkY: number): boolean {
            var dist1: number = MathUtil.dist(sx, sy, checkX, checkY);
            var dist2: number = MathUtil.dist(checkX, checkY, ex, ey);
            var dist3: number = MathUtil.dist(sx, sy, ex, ey);
            return ((dist1 + dist2) == dist3);
        }
        public static range(min: number, max: number, round: boolean = true): number {
            if (round) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
                return Math.random() * (max - min) + min;
            }
        }
        public static degree(value: number): number {
            return value / MathUtil.ONED;
        }

        public static radian(value: number): number {
            return value * MathUtil.ONED;
        }

        public static rgbToHex(r: number, g: number, b: number): string {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        public static hexToRgb(hex: any): { r: number; g: number; b: number } {
            if (!isNaN(hex)) {
                //if hex is number, convert to #RRGGBB format
                hex = "#" + hex.toString(16);
            }
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
        }

        // limits value to the range min..max
        static clamp(val: number, min: number, max: number): number {
            return Math.max(min, Math.min(max, val));
        }

        static angleBtweenPt(pt1: any, pt2: any): number {
            return Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
        }

        /** map the given value from one range to another, ex: map(0.5, 0, 1, 10 , 20) = 15 
        @param {number} value - the value in the first range
        @param {number} low - first range lower value
        @param {number} high - first range higher value
        @param {number} low2 - second range lower value
        @param {number} high2 - second range higher value
        @returns {number} result value in second range
        */
        static map(value: number, low: number, high: number, low2: number, high2: number): number {
            var percent: number = (value - low) / (high - low);
            return low2 + percent * (high2 - low2);
        }

        // return true if the rectangle and circle are colliding
        static rectCircleCollide(circle: { x: number; y: number; r: number }, rect: { x: number; y: number; w: number; h: number }): boolean {
            var distX = Math.abs(circle.x - rect.x - rect.w / 2);
            var distY = Math.abs(circle.y - rect.y - rect.h / 2);
            if (distX > (rect.w / 2 + circle.r)) { return false; }
            if (distY > (rect.h / 2 + circle.r)) { return false; }
            if (distX <= (rect.w / 2)) { return true; }
            if (distY <= (rect.h / 2)) { return true; }
            var dx = distX - rect.w / 2;
            var dy = distY - rect.h / 2;
            return (dx * dx + dy * dy <= (circle.r * circle.r));
        }

        //static function to check collision
        //=========================================================================================
        static intersectLineLine(a1: Vector, a2: Vector, b1: Vector, b2: Vector): { hit: boolean; data: any; denom: number } {
            var result = { hit: false, data: null, denom: null };
            var denom: number = ((b2.y - b1.y) * (a2.x - a1.x)) - ((b2.x - b1.x) * (a2.y - a1.y));
            result.denom = denom;
            if (denom == 0) return result; //lines are parallel
            var a: number = a1.y - b1.y;
            var b: number = a1.x - b1.x;
            var nr1: number = ((b2.x - b1.x) * a) - ((b2.y - b1.y) * b);
            var nr2: number = ((a2.x - a1.x) * a) - ((a2.y - a1.y) * b);
            a = nr1 / denom;
            b = nr2 / denom;
            if (a > 0 && a < 1 && b > 0 && b < 1) {
                var intersectX: number = a1.x + (a * (a2.x - a1.x));
                var intersectY: number = a1.y + (a * (a2.y - a1.y));
                result.hit = true;
                result.data = [new steer.Vector(intersectX, intersectY)];
            }
            return result;
        }

        static intersectCircleLine(a1: Vector, a2: Vector, c: Vector, r: number): { hit: boolean; data: any } {
            var result = { hit: false, data: null };
            var a: number = (a2.x - a1.x) * (a2.x - a1.x) + (a2.y - a1.y) * (a2.y - a1.y);
            var b: number = 2 * ((a2.x - a1.x) * (a1.x - c.x) + (a2.y - a1.y) * (a1.y - c.y));
            var cc: number = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y - 2 * (c.x * a1.x + c.y * a1.y) - r * r;
            var deter: number = b * b - 4 * a * cc;
            if (deter < 0) {
                //no intersection
            } else if (deter == 0) {
                //tangent, line right on circle
            } else {
                var e: number = Math.sqrt(deter);
                var u1: number = (-b + e) / (2 * a);
                var u2: number = (-b - e) / (2 * a);
                var intersectData: Vector[] = [];
                if (u1 > 0 && u1 < 1) {
                    intersectData.push(Vector.lerp(a1, a2, u1));
                }
                if (u2 > 0 && u2 < 1) {
                    intersectData.push(Vector.lerp(a1, a2, u2));
                }
                if (intersectData.length > 0) {
                    result.hit = true;
                    result.data = intersectData;
                }
            }
            return result;
        }
        //=========================================================================================



    }

} 
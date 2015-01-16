var steer;
(function (steer) {
    var MathUtil = (function () {
        function MathUtil() {
        }
        MathUtil.getElementPosition = function (element) {
            var elem = element, tagname = "", x = 0, y = 0;
            while ((typeof (elem) == "object") && (typeof (elem.tagName) != "undefined")) {
                y += elem.offsetTop;
                x += elem.offsetLeft;
                tagname = elem.tagName.toUpperCase();
                if (tagname == "BODY")
                    elem = 0;
                if (typeof (elem) == "object") {
                    if (typeof (elem.offsetParent) == "object")
                        elem = elem.offsetParent;
                }
            }
            return { x: x, y: y };
        };
        MathUtil.dist = function (x1, y1, x2, y2) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        };
        MathUtil.isPointOnWall = function (sx, sy, ex, ey, checkX, checkY) {
            var dist1 = MathUtil.dist(sx, sy, checkX, checkY);
            var dist2 = MathUtil.dist(checkX, checkY, ex, ey);
            var dist3 = MathUtil.dist(sx, sy, ex, ey);
            return ((dist1 + dist2) == dist3);
        };
        MathUtil.range = function (min, max, round) {
            if (round === void 0) { round = true; }
            if (round) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            else {
                return Math.random() * (max - min) + min;
            }
        };
        MathUtil.degree = function (value) {
            return value / MathUtil.ONED;
        };
        MathUtil.radian = function (value) {
            return value * MathUtil.ONED;
        };
        MathUtil.rgbToHex = function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };
        MathUtil.hexToRgb = function (hex) {
            if (!isNaN(hex)) {
                hex = "#" + hex.toString(16);
            }
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
        };
        MathUtil.clamp = function (val, min, max) {
            return Math.max(min, Math.min(max, val));
        };
        MathUtil.angleBtweenPt = function (pt1, pt2) {
            return Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
        };
        MathUtil.map = function (value, low, high, low2, high2) {
            var percent = (value - low) / (high - low);
            return low2 + percent * (high2 - low2);
        };
        MathUtil.rectCircleCollide = function (circle, rect) {
            var distX = Math.abs(circle.x - rect.x - rect.w / 2);
            var distY = Math.abs(circle.y - rect.y - rect.h / 2);
            if (distX > (rect.w / 2 + circle.r)) {
                return false;
            }
            if (distY > (rect.h / 2 + circle.r)) {
                return false;
            }
            if (distX <= (rect.w / 2)) {
                return true;
            }
            if (distY <= (rect.h / 2)) {
                return true;
            }
            var dx = distX - rect.w / 2;
            var dy = distY - rect.h / 2;
            return (dx * dx + dy * dy <= (circle.r * circle.r));
        };
        MathUtil.intersectLineLine = function (a1, a2, b1, b2) {
            var result = { hit: false, data: null, denom: null };
            var denom = ((b2.y - b1.y) * (a2.x - a1.x)) - ((b2.x - b1.x) * (a2.y - a1.y));
            result.denom = denom;
            if (denom == 0)
                return result;
            var a = a1.y - b1.y;
            var b = a1.x - b1.x;
            var nr1 = ((b2.x - b1.x) * a) - ((b2.y - b1.y) * b);
            var nr2 = ((a2.x - a1.x) * a) - ((a2.y - a1.y) * b);
            a = nr1 / denom;
            b = nr2 / denom;
            if (a > 0 && a < 1 && b > 0 && b < 1) {
                var intersectX = a1.x + (a * (a2.x - a1.x));
                var intersectY = a1.y + (a * (a2.y - a1.y));
                result.hit = true;
                result.data = [new steer.Vector(intersectX, intersectY)];
            }
            return result;
        };
        MathUtil.intersectCircleLine = function (a1, a2, c, r) {
            var result = { hit: false, data: null };
            var a = (a2.x - a1.x) * (a2.x - a1.x) + (a2.y - a1.y) * (a2.y - a1.y);
            var b = 2 * ((a2.x - a1.x) * (a1.x - c.x) + (a2.y - a1.y) * (a1.y - c.y));
            var cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y - 2 * (c.x * a1.x + c.y * a1.y) - r * r;
            var deter = b * b - 4 * a * cc;
            if (deter < 0) {
            }
            else if (deter == 0) {
            }
            else {
                var e = Math.sqrt(deter);
                var u1 = (-b + e) / (2 * a);
                var u2 = (-b - e) / (2 * a);
                var intersectData = [];
                if (u1 > 0 && u1 < 1) {
                    intersectData.push(steer.Vector.lerp(a1, a2, u1));
                }
                if (u2 > 0 && u2 < 1) {
                    intersectData.push(steer.Vector.lerp(a1, a2, u2));
                }
                if (intersectData.length > 0) {
                    result.hit = true;
                    result.data = intersectData;
                }
            }
            return result;
        };
        MathUtil.ONED = Math.PI / 180;
        return MathUtil;
    })();
    steer.MathUtil = MathUtil;
})(steer || (steer = {}));

var steer;
(function (steer) {
    var Vector = (function () {
        function Vector(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector.add = function (v1, v2) {
            return new Vector(v1.x + v2.x, v1.y + v2.y);
        };
        Vector.sub = function (v1, v2) {
            return new Vector(v1.x - v2.x, v1.y - v2.y);
        };
        Vector.mult = function (v1, value) {
            return new Vector(v1.x * value, v1.y * value);
        };
        Vector.div = function (v, value) {
            return new Vector(v.x / value, v.y / value);
        };
        Vector.fromAngle = function (angle, magnitude) {
            if (magnitude === void 0) { magnitude = 1; }
            var newVector = new Vector();
            newVector.x = Math.cos(angle) * magnitude;
            newVector.y = Math.sin(angle) * magnitude;
            return newVector;
        };
        Vector.setAngle = function (vector, angle) {
            var mag = vector.mag();
            vector.x = Math.cos(angle) * mag;
            vector.y = Math.sin(angle) * mag;
        };
        Vector.fromb2Vec = function (b2Vec, multiply30) {
            if (multiply30 === void 0) { multiply30 = false; }
            if (multiply30) {
                return new Vector(b2Vec.x * 30, b2Vec.y * 30);
            }
            else {
                return new Vector(b2Vec.x, b2Vec.y);
            }
        };
        Vector.lerp = function (v1, v2, fraction) {
            var tempV = Vector.sub(v2, v1);
            tempV.mult(fraction);
            tempV.add(v1);
            return tempV;
        };
        Vector.angleBetween = function (a, b) {
            var dotValue = a.dot(b);
            return Math.acos(dotValue / (a.mag() * b.mag()));
        };
        Vector.random = function (xmin, xmax, ymin, ymax) {
            var result = new steer.Vector();
            result.x = steer.MathUtil.map(Math.random(), 0, 1, xmin, xmax);
            result.y = steer.MathUtil.map(Math.random(), 0, 1, ymin, ymax);
            return result;
        };
        Vector.getNormalPoint = function (point, linePtA, linePtB) {
            var pa = Vector.sub(point, linePtA);
            var ba = Vector.sub(linePtB, linePtA);
            ba.normalize().mult(pa.dot(ba));
            return Vector.add(linePtA, ba);
        };
        Vector.equal = function (a, b) {
            return (a.x == b.x && a.y == b.y);
        };
        Vector.distanceSq = function (a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return dx * dx + dy * dy;
        };
        Vector.distance = function (a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Vector.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vector.prototype.clone = function () {
            return new Vector(this.x, this.y);
        };
        Vector.prototype.mag = function () {
            var toX = this.x;
            var toY = this.y;
            return Math.sqrt(toX * toX + toY * toY);
        };
        Vector.prototype.magSq = function () {
            var toX = this.x;
            var toY = this.y;
            return (toX * toX + toY * toY);
        };
        Vector.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        };
        Vector.prototype.addm = function (value) {
            this.x += value;
            this.y += value;
            return this;
        };
        Vector.prototype.addxy = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        Vector.prototype.subxy = function (x, y) {
            this.x -= x;
            this.y -= y;
            return this;
        };
        Vector.prototype.sub = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        };
        Vector.prototype.subm = function (value) {
            this.x -= value;
            this.y -= value;
            return this;
        };
        Vector.prototype.mult = function (value) {
            this.x *= value;
            this.y *= value;
            return this;
        };
        Vector.prototype.div = function (v) {
            this.x /= v;
            this.y /= v;
            return this;
        };
        Vector.prototype.dist = function (other) {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Vector.prototype.distSq = function (other) {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return dx * dx + dy * dy;
        };
        Vector.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };
        Vector.prototype.normalize = function () {
            var m = this.mag();
            if (m > 0)
                this.div(m);
            return this;
        };
        Vector.prototype.normalizeThanMult = function (value) {
            this.normalize();
            this.mult(value);
            return this;
        };
        Vector.prototype.limit = function (highVal) {
            if (this.mag() > highVal) {
                this.normalize();
                this.mult(highVal);
            }
            return this;
        };
        Vector.prototype.min = function (lowVal) {
            if (this.mag() < lowVal) {
                this.normalize();
                this.mult(lowVal);
            }
            return this;
        };
        Vector.prototype.heading = function () {
            return (-Math.atan2(-this.y, this.x));
        };
        Vector.prototype.headingDegree = function () {
            var deg = (-Math.atan2(-this.y, this.x));
            return deg / steer.MathUtil.ONED;
        };
        Vector.prototype.decimal = function (decimal) {
            var dval = Math.pow(10, decimal);
            this.x = Math.round(this.x * dval) / dval;
            this.y = Math.round(this.y * dval) / dval;
            return this;
        };
        Vector.prototype.isZero = function () {
            return (this.x == 0 && this.y == 0);
        };
        Vector.prototype.makeB2Vec = function (divide30) {
            if (divide30 === void 0) { divide30 = false; }
            if (divide30) {
                return new box2d.b2Vec2(this.x / 30, this.y / 30);
            }
            else {
                return new box2d.b2Vec2(this.x, this.y);
            }
        };
        Vector.prototype.fromB2Vec = function (other, time30) {
            if (time30 === void 0) { time30 = true; }
            this.x = other.x * 30;
            this.y = other.y * 30;
        };
        Vector.prototype.reverse = function () {
            this.x *= -1;
            this.y *= -1;
            return this;
        };
        Vector.prototype.toString = function (decimal) {
            if (decimal === void 0) { decimal = 2; }
            if (decimal > 0) {
                var dval = Math.pow(10, decimal);
                var mag = Math.round(this.mag() * dval) / dval;
                return "(" + Math.round(this.x * dval) / dval + "," + Math.round(this.y * dval) / dval + ") mag:" + mag;
            }
            else {
                return "(" + this.x + "," + this.y + ") mag: " + this.mag();
            }
        };
        return Vector;
    })();
    steer.Vector = Vector;
})(steer || (steer = {}));

module steer {

    export class Vector {

        //STATIC Functions
        //=========================================================================================
        /** create a vector that has value of both vector x and y added
        @param {steer.Vector} v1 - x and y value to use from first vector 
        @param {steer.Vector} v2 - x and y value to use from second vector 
        @returns {steer.Vector} new vector based on (v1.x + v2.x, v1.y + v2.y)
         */
        static add(v1: Vector, v2: Vector): Vector {
            return new Vector(v1.x + v2.x, v1.y + v2.y);
        }
        /** create a vector that has value of first vector subtract second vector's x and y
        @param {steer.Vector} v1 - x and y value to use from first vector 
        @param {steer.Vector} v2 - x and y value to use from second vector 
        @returns {steer.Vector} new vector based on (v1.x - v2.x, v1.y - v2.y)
         */
        static sub(v1: Vector, v2: Vector): Vector {
            return new Vector(v1.x - v2.x, v1.y - v2.y);
        }
        /** create a vector that has value of first vector mutiply second vector's x and y
        @param {steer.Vector} v1 - x and y value to use from first vector 
        @param {steer.Vector} v2 - x and y value to use from second vector 
        @returns {steer.Vector} new vector based on (v1.x * v2.x, v1.y * v2.y)
         */
        static mult(v1: Vector, value: number): Vector {
            return new Vector(v1.x * value, v1.y * value);
        }
        /** create a vector that has value of vector's x and y divided by input value
        @param {steer.Vector} v - x and y value to use from
        @param {number} value - divide by value
        @returns {steer.Vector} new vector based on (v.x / value, v.y/value)
         */
        static div(v: Vector, value: number): Vector {
            return new Vector(v.x / value, v.y / value);
        }
        /** create a vector based from input angle
       @param {steer.Vector} angle - angle in radian
       @param {number} magnitude - the length of the new vector, default 1
       @returns {steer.Vector} new vector from the angle and magnitute input
        */
        static fromAngle(angle: number, magnitude: number= 1): Vector {
            var newVector: steer.Vector = new Vector();
            newVector.x = Math.cos(angle) * magnitude;
            newVector.y = Math.sin(angle) * magnitude;
            return newVector;
        }
        /** set vector to new direction, magnitude remain unchanged
        @param {steer.Vector} vector - vector to change
        @param {number} angle - angle in radian
        */
        static setAngle(vector: Vector, angle: number): void {
            var mag: number = vector.mag();
            vector.x = Math.cos(angle) * mag;
            vector.y = Math.sin(angle) * mag;
        }
        static fromb2Vec(b2Vec: box2d.b2Vec2, multiply30: boolean = false): Vector {
            if (multiply30) {
                return new Vector(b2Vec.x * 30, b2Vec.y * 30);
            } else {
                return new Vector(b2Vec.x, b2Vec.y);
            }
        }
        /** Calculates linear interpolation from one vector to another vector.
        @param {steer.Vector} v1 - first vector use for caculation
        @param {steer.Vector} v2 - second vector use for caculation
        @param {number} fraction - interpolation to use, 0 ~ 1 , 0 being at v1 position and 1 being at v2 position

        */
        static lerp(v1: Vector, v2: Vector, fraction: number): Vector {
            var tempV: Vector = Vector.sub(v2, v1);
            tempV.mult(fraction);
            tempV.add(v1);
            return tempV;
        }
        /** caculate the angle between two vector
        @param {steer.Vector} v1 - first vector use for caculation
        @param {steer.Vector} v2 - second vector use for caculation
        @returns {number} angle in radian
        */
        static angleBetween(a: Vector, b: Vector): number {
            var dotValue: number = a.dot(b);
            return Math.acos(dotValue / (a.mag() * b.mag()));
        }


        /** create a random vector
        @param {number} xmin - the x minimum 
        @param {number} xmax - the x maximum
        @param {number} ymin - the y minimum 
        @param {number} ymax - the y maximum
        @returns {steer.Vector} random vector from range
        */
        static random(xmin: number, xmax: number, ymin: number, ymax: number): Vector {
            var result: steer.Vector = new steer.Vector();
            result.x = MathUtil.map(Math.random(), 0, 1, xmin, xmax);
            result.y = MathUtil.map(Math.random(), 0, 1, ymin, ymax);
            return result;
        }
        /** get the normal point on the line which is perpendicular from given point 
        @ param {steer.vector} point - the given point
        @ param {steer.vector} linePtA - the first point of the line
        @ param {steer.vector} linePtB - the second point of the line
        @returns {steer.Vector} point on the line which is perpendicular to given point
        */
        static getNormalPoint(point: Vector, linePtA: Vector, linePtB: Vector): Vector {
            var pa: Vector = Vector.sub(point, linePtA); //point to lineA
            var ba: Vector = Vector.sub(linePtB, linePtA); //lineB to lineA
            ba.normalize().mult(pa.dot(ba));
            return Vector.add(linePtA, ba);
        }
        /** check to see if two given vector has the same x and y value
        @returns {boolean} true if both given vector has same x and y value
        */
        static equal(a: Vector, b: Vector): boolean {
            return (a.x == b.x && a.y == b.y);
        }

        /**
        distance between two Vector or b2Vec without squareroot it
        @param a - a vector or b2Vec
        @param b - a vector or b2Vec
        @returns {number}  distance between two Vector or b2Vec without squareroot it
        */
        static distanceSq(a: any, b: any): number {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return dx * dx + dy * dy;
        }

        /**
        distance between two Vector or b2Vec
        @param a - a vector or b2Vec
        @param b - a vector or b2Vec
        @returns {number}  distance between two Vector or b2Vec
        */
        static distance(a: any, b: any): number {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        //=========================================================================================

        /** @property {number} x - x value*/
        public x: number;
        /** @property {number} y - x value*/
        public y: number;

        /** create a new vector , default is (0,0)
        @param {number} x - given x
        @param {number} y - given y
        */
        constructor(x: number= 0, y: number= 0) {
            this.x = x;
            this.y = y;
        }

        /** set x and y to given value
        @param {number} x - given x
        @param {number} y - given y
        */
        setTo(x: number, y: number): Vector {
            this.x = x;
            this.y = y;
            return this;
        }

        /** duplicate a new vector that has same x and y value
        @return {steer.Vector} new vector that has same x and y
        */
        clone(): Vector {
            return new Vector(this.x, this.y);
        }
        /** get the magnitude of this vector
        @return {number} the magnitude (length) of this vector
        */
        mag(): number {
            var toX: number = this.x;
            var toY: number = this.y;
            return Math.sqrt(toX * toX + toY * toY);
        }
        /** get the magnitude of this vector betore square root, for fast distance comparison
        @return {number} the magnitude (length) of this vector without squre root
        */
        magSq(): number {
            var toX: number = this.x;
            var toY: number = this.y;
            return (toX * toX + toY * toY);
        }
        /** add x and y value from other vector's x and y value
        @param {steer.Vector} other - given vector to add value
        */
        add(other: Vector): Vector {
            this.x += other.x;
            this.y += other.y;
            return this;
        }

        /** add x and y value from a value 
        @param {number} value - value to add
        */
        addm(value: number): Vector {
            this.x += value;
            this.y += value;
            return this;
        }

        /** add x and y from given x and y
        @param {number} x - x value to add
        @param {number} y - y value to add
        */
        addxy(x: number, y: number): Vector {
            this.x += x;
            this.y += y;
            return this;
        }
        /** subtract x and y from given x and y
        @param {number} x - x value to subtract
        @param {number} y - y value to subtract
        */
        subxy(x: number, y: number): Vector {
            this.x -= x;
            this.y -= y;
            return this;
        }
        /** subtract x and y from given vector's x and y
        @param {steer.Vector} other - given vector to subtract value
        */
        sub(other: Vector): Vector {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        }

        /** subtract x and y from given value
        @param {number} value - value to subtract
        */
        subm(value: number): Vector {
            this.x -= value;
            this.y -= value;
            return this;
        }

        /** multiply x and y from given value
        @param {number} value - value to multiply
        */
        mult(value: number): Vector {
            this.x *= value;
            this.y *= value;
            return this;
        }

        /** divide x and y from given value
        @param {number} value - value to divide
        */
        div(v: number): Vector {
            this.x /= v;
            this.y /= v;
            return this;
        }

        /** distance to other vector
        @param {steer.Vector} other - other vector to get distance from
        @return {number} distance to other vector
        */
        dist(other: Vector): number {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /** distance to other vector without square root, for fast distance comparison
        @param {steer.Vector} other - other vector to get distance from
        @return {number} distance to other vector
       */
        distSq(other: Vector): number {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return dx * dx + dy * dy;
        }

        /** dot value to other vector 
        @param {steer.Vector} other - other vector
        @return {number} dot value result
        */
        dot(other: Vector): number {
            return this.x * other.x + this.y * other.y;
        }

        /** normalize the magnitude of this vector, the result x and y are from 0 to 1*/
        normalize(): Vector {
            var m: number = this.mag();
            if (m > 0) this.div(m);
            return this;
        }
        /** normalize the magnitude of this vector, then multiply it to new value to scale up
        @param {number} value - value to multiply
        */
        normalizeThanMult(value: number): Vector {
            this.normalize();
            this.mult(value);
            return this;
        }

        /** if the magnitude is higher then the input value, scale it down to the given value 
        @param {number} highVal - value input
        */
        limit(highVal: number): Vector {
            if (this.mag() > highVal) {
                this.normalize();
                this.mult(highVal);
            }
            return this;
        }
        /** if the magnitude is lesser then the input value, scale it up to the given value 
        @param {number} lowVal - value input
        */
        min(lowVal: number): Vector {
            if (this.mag() < lowVal) {
                this.normalize();
                this.mult(lowVal);
            }
            return this;
        }

        /** get the direction of this vector 
        @returns {number} direction value in radian
        */
        heading(): number {
            return (-Math.atan2(-this.y, this.x));
        }

        /** get the direction of this vector 
        @returns {number} direction value in degree
        */
        headingDegree(): number {
            var deg: number = (-Math.atan2(-this.y, this.x));
            return deg / MathUtil.ONED;
        }

        /** round the vector to given decimal n-th position, ex: 3.125 decimal 1 = 3.1 , decimal 2 = 3.12
        */
        decimal(decimal: number): Vector {
            var dval = Math.pow(10, decimal);
            this.x = Math.round(this.x * dval) / dval;
            this.y = Math.round(this.y * dval) / dval;
            return this;
        }

        /** see if this vector has x and y value set to 0
        @returns {boolean} the result comparison
        */
        isZero(): boolean {
            return (this.x == 0 && this.y == 0);
        }

        /** make a box2d b2Vec from this x and y value , 1/30 of steer.vector */
        makeB2Vec(divide30: boolean = false): box2d.b2Vec2 {
            if (divide30) {
                return new box2d.b2Vec2(this.x / 30, this.y / 30);
            } else {
                return new box2d.b2Vec2(this.x, this.y);
            }
        }
        /** get a b2Vec value and convert it to steer.Vector value , 30 times of b2Vec value */
        fromB2Vec(other: box2d.b2Vec2, time30:boolean = true): void {
            this.x = other.x * 30;
            this.y = other.y * 30;
        }

        /** reverse the vector */
        reverse(): Vector {
            this.x *= -1;
            this.y *= -1;
            return this;
        }

        /** get the vector value in text (x,y), used in debugging to print value out 
        @returns {string} the result value in string 
        */
        toString(decimal: number= 2): string {
            if (decimal > 0) {
                var dval = Math.pow(10, decimal);
                var mag: number = Math.round(this.mag() * dval) / dval;
                return "(" + Math.round(this.x * dval) / dval + "," + Math.round(this.y * dval) / dval + ") mag:" + mag;
            } else {
                return "(" + this.x + "," + this.y + ") mag: " + this.mag();
            }
        }

    }

} 
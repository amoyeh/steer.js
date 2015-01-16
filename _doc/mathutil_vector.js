/**
core steer.js objects
@namespace steer
*/
steer = {};

//========================================================================================================================
//========================================================================================================================
// Vector.ts          src/core
//========================================================================================================================
//========================================================================================================================
/**
@constructor
@param {number} x - x coordinate
@param {number} y - y coordinate
*/
steer.Vector = function () {
    /** @property {number} x - x coordinate */
    this.x;
    /** @property {number} y - y coordinate */
    this.y;
}

/** set x and y to given value
@param {number} x - given x
@param {number} y - given y
@returns {steer.Vector} return self
*/
steer.Vector.prototype.setTo = function () { };
/** duplicate a new vector that has same x and y value
@return {steer.Vector} return new vector that has same x and y
*/
steer.Vector.prototype.clone = function () { };

/** get the magnitude of this vector
@return {number} return the magnitude (length) of this vector
*/
steer.Vector.prototype.mag = function () { };

/** get the magnitude of this vector without square root, usually used shorter distance comparison
@return {number} return the magnitude (length) of this vector without squre root
*/
steer.Vector.prototype.magSq = function () { };


/** add x and y value from other vector's x and y value
@param {steer.Vector} other - given vector to add value
@returns {steer.Vector} return self
*/
steer.Vector.prototype.add = function () { };

/** add x and y value from a value 
@param {number} value - value to add
@returns {steer.Vector} return self
*/
steer.Vector.prototype.addm = function () { };

/** add x and y from given x and y
@param {number} x - x value to add
@param {number} y - y value to add
@returns {steer.Vector} return self
*/
steer.Vector.prototype.addxy = function () { };

/** subtract x and y from given x and y
@param {number} x - x value to subtract
@param {number} y - y value to subtract
@returns {steer.Vector} return self
*/
steer.Vector.prototype.subxy = function () { };

/** subtract x and y from given vector's x and y
@param {steer.Vector} other - given vector to subtract value
@returns {steer.Vector} return self
*/
steer.Vector.prototype.sub = function () { };

/** subtract x and y from given value
@param {number} value - value to subtract
@returns {steer.Vector} return self
*/
steer.Vector.prototype.subm = function () { };

/** multiply x and y from given value
@param {number} value - value to multiply
@returns {steer.Vector} return self
*/
steer.Vector.prototype.mult = function () { };

/** divide x and y from given value
@param {number} value - value to divide
@returns {steer.Vector} return self
*/
steer.Vector.prototype.div = function () { };

/** distance to other vector
@param {steer.Vector} other - other vector to get distance from
@returns {number} return distance to other vector
*/
steer.Vector.prototype.dist = function () { };

/** distance to other vector without square root
@param {steer.Vector} other - other vector to get distance from
@returns {number} return distance to other vector without square root
*/
steer.Vector.prototype.distSq = function () { };

/** dot value to other vector 
@param {steer.Vector} other - other vector
@returns {number} return dot value result
*/
steer.Vector.prototype.dot = function () { };

/** normalize the magnitude of this vector, the result x and y are from 0 to 1
@returns {steer.Vector} return self
*/
steer.Vector.prototype.normalize = function () { };

/** normalize the magnitude of this vector, then multiply it to new value to scale up
@param {number} value - value to multiply
@returns {steer.Vector} return self
*/
steer.Vector.prototype.normalizeThanMult = function () { }


/** if the magnitude is higher then the input value, scale it down to the given value 
@param {number} highVal - value input
@returns {steer.Vector} return self
*/
steer.Vector.prototype.limit = function () { }

/** if the magnitude is lesser then the input value, scale it up to the given value 
@param {number} lowVal - value input
@returns {steer.Vector} return self
*/
steer.Vector.prototype.min = function () { }

/** get the direction of this vector 
@returns {number} return direction value in radian
*/
steer.Vector.prototype.heading = function () { }

/** get the direction of this vector 
@returns {number} return direction value in degree
*/
steer.Vector.prototype.headingDegree = function () { }

/** round the vector to given decimal n-th position, ex: 3.125 decimal 1 = 3.1 , decimal 2 = 3.12
@returns {steer.Vector} return self
*/
steer.Vector.prototype.decimal = function () { }

/** see if this vector has x and y value set to 0
@returns {boolean} return true if both x and y are zero
*/
steer.Vector.prototype.isZero = function () { }

/** make a new box2d b2Vec from this x and y value 
@param {boolean} [divide30=false] - true to divide this steer.Vector x and y by 30
@returns {box2d.b2Vec2} return new box2d vector
*/
steer.Vector.prototype.makeB2Vec = function () { }

/** set this vector value from box2d b2vec2
@param {box2d.b2Vec2} other - source box2d vector
@param {boolean} [time30=false] - true to multiply x and y values by 30
@returns {box2d.b2Vec2} return new box2d vector
*/
steer.Vector.prototype.fromB2Vec = function () { }

/** reverse the vector
@returns {steer.Vector} return self
*/
steer.Vector.prototype.reverse = function () { }

/** get the detail vector value in text , used in debugging to print value out 
@param {number} decimal - decimal position in output x and y
@returns {string} return the result value in string ex: (5.2,11.5) mag:123
*/
steer.Vector.prototype.toString = function () { }

/** create a vector that has value of both vector x and y added
@param {steer.Vector} v1 - x and y value to use from first vector 
@param {steer.Vector} v2 - x and y value to use from second vector 
@returns {steer.Vector} return new vector based on (v1.x + v2.x, v1.y + v2.y)
*/
steer.Vector.add = function () { };

/** create a vector that has value of first vector subtract second vector's x and y
@param {steer.Vector} v1 - x and y value to use from first vector 
@param {steer.Vector} v2 - x and y value to use from second vector 
@returns {steer.Vector} return new vector based on (v1.x - v2.x, v1.y - v2.y)
*/
steer.Vector.sub = function () { };

/** create a vector that has value of first vector mutiply second vector's x and y
@param {steer.Vector} v1 - x and y value to use from first vector 
@param {steer.Vector} v2 - x and y value to use from second vector 
@returns {steer.Vector} return new vector based on (v1.x * v2.x, v1.y * v2.y)
 */
steer.Vector.mult = function () { };

/** create a vector that has value of vector's x and y divided by input value
@param {steer.Vector} v - x and y value to use from
@param {number} value - divide by value
@returns {steer.Vector} return new vector based on (v.x / value, v.y/value)
 */
steer.Vector.div = function () { };

/** create a vector based from input angle
@param {steer.Vector} angle - angle in radian
@param {number} magnitude - the length of the new vector, default 1
@returns {steer.Vector} return new vector from the angle and magnitute input
*/
steer.Vector.fromAngle = function () { };

/** set vector to new direction, magnitude remain unchanged
@param {steer.Vector} vector - vector to change
@param {number} return angle angle in radian
*/
steer.Vector.setAngle = function () { };


/** create a steer.Vector from box2d box2d.b2Vec2
@param {box2d.b2Vec2} b2Vec - source box2d vector
@param {boolean} multiply30 - mutiply source value by 30 to the result vector
@returns {steer.Vector} return converted vector
*/
steer.Vector.fromb2Vec = function () { };

/** Calculates linear interpolation from one vector to another vector.
@param {steer.Vector} v1 - first vector use for caculation
@param {steer.Vector} v2 - second vector use for caculation
@param {number} fraction interpolation to use, 0 ~ 1 , 0 being at v1 position and 1 being at v2 position
@returns {number} return result position in vector
*/
steer.Vector.lerp = function () { };

/** caculate the angle between two vector
@param {steer.Vector} v1 - first vector use for caculation
@param {steer.Vector} v2 - second vector use for caculation
@returns {number} return angle in radian
*/
steer.Vector.angleBetween = function () { };

/** create a random vector
@param {number} xmin - the x minimum 
@param {number} xmax - the x maximum
@param {number} ymin - the y minimum 
@param {number} ymax - the y maximum
@returns {steer.Vector} return random vector from range
*/
steer.Vector.random = function () { };

/** get the normal point on the line which is perpendicular from given point 
@ param {steer.vector} point - the given point
@ param {steer.vector} linePtA - the first point of the line
@ param {steer.vector} linePtB - the second point of the line
@returns {steer.Vector} return point on the line which is perpendicular to given point
*/
steer.Vector.getNormalPoint = function () { };

/** check to see if two given vector has the same x and y value
@ param {steer.vector} a - first vector
@ param {steer.vector} b - second vector
@returns {boolean} return true if both given vector has same x and y value
*/
steer.Vector.equal = function () { };

/**
distance between two Vector or b2Vec without square root
@param a - a steer.Vector or box2d.b2vec2
@param b - a steer.Vector or box2d.b2vec2
@returns {number} return distance between two Vector or b2Vec without squareroot it
*/
steer.Vector.distanceSq = function () { };

/**
distance between two Vector or b2Vec
@param a - a steer.Vector or box2d.b2vec2
@param b - a steer.Vector or box2d.b2vec2
@returns {number} return distance between two Vector or b2Vec without squareroot it
*/
steer.Vector.distance = function () { };



//========================================================================================================================
//========================================================================================================================
// MathUtil          src/core
//========================================================================================================================
//========================================================================================================================
/**
static Math Utility helper class
@constructor
*/
steer.MathUtil = function () { }

/**@property {number} ONED - one degree in radian , about 0.01745 */
steer.MathUtil.ONED;

/**
static Math Utility helper class
@param {number} min - minimum value
@param {number} max - maxmium value
@param {boolean} [round=true] - round the value
@returns {number} returns result value
*/
steer.MathUtil.range = function () { };

/**
get the degree value from radian
@param {number} radian - radian value
@returns {number} returns degree value
*/
steer.MathUtil.degree = function () { };

/**
get the radian value from degree
@param {number} degree - degree value
@returns {number} returns radian value
*/
steer.MathUtil.radian = function () { };

/**
get the hex color code from r g b
@param {number} r - red value
@param {number} g - green value
@param {number} b - blue value
@returns {string} returns code code in hex format
*/
steer.MathUtil.rgbToHex = function () { };

/**
get the r , g , b numeric color values from hex
@param {number} hex - hex value
@returns {object} returns object that contains r g b numeric values {r:number, g:number, b:number}
*/
steer.MathUtil.hexToRgb = function () { };

/**
find the angle between two point
@param {object} pt1 - point 1 object that has {x:number, y:number} values
@param {object} pt2 - point 2 object that has {x:number, y:number} values
@returns {number} returns the angle between two point in radian
*/
steer.MathUtil.angleBtweenPt = function () { };


/** 
map the given value from one range to another, ex: map(0.5, 0, 1, 10 , 20) = 15 
@param {number} value - the value in the first range
@param {number} low - first range lower value
@param {number} high - first range higher value
@param {number} low2 - second range lower value
@param {number} high2 - second range higher value
@returns {number} result value in second range
*/
steer.MathUtil.map = function () { };

/**
check if rectangle and circle collides
@param {object} circle - circle object in format { x: number; y: number; r: number }
@param {object} rectangle - rectangle object in format { x: number; y: number; w: number; h: number }
@returns {boolean} return true if collide
*/
steer.MathUtil.rectCircleCollide = function () { };

/**
check to see if line a and b intersect
@param {steer.Vector} a1 - line a point 1
@param {steer.Vector} a2 - line a point 2
@param {steer.Vector} b1 - line b point 1
@param {steer.Vector} b2 - line b point 2
@returns {boolean} return true if two line intersect
*/
steer.MathUtil.intersectLineLine = function () { };

/**
check to see if line and circle intersect
@param {steer.Vector} a1 - line point 1
@param {steer.Vector} a2 - line point 2
@param {steer.Vector} c - circle position
@param {steer.Vector} r - circle radius
@returns {boolean} return true if line and circle intersect
*/
steer.MathUtil.intersectCircleLine = function () { };

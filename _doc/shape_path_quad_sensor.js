//========================================================================================================================
//========================================================================================================================
// PathInfo          src/item/BezierPath
//========================================================================================================================
//========================================================================================================================
/**
information used to create Path
@constructor
@param {steer.Vector} startPt - the start position of this path
@param {number} pathWidth - width of this path
@param {number} interpolateSize - 
how many segments to generate between each key point, more segments create smoother moving force on unit, 
yet too many segments might result in jaggy unit movement, recommanded setting (3 ~ 8).
*/
steer.item.PathInfo = function () {

    /** @property {steer.Vector} startPt - start position*/
    this.startPt;

    /** @property {number} pathWidth - the width of this path */
    this.pathWidth;

    /** @property {steer.Vector[]} segments - segments of this path*/
    this.segments;

    /** @property {number} interpolateSize - how many segments to generate between each key point, more segments create smoother moving force on unit, 
    yet too many segments might result in jaggy unit movement, recommanded setting (3 ~ 8).*/
    this.interpolateSize;

}

//public curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, tox: number, toy: number): void {

/**
Bezier curve to target position
@param {number} cp1x - the first control point x
@param {number} cp1y - the first control point y
@param {number} cp2x - the second control point x
@param {number} cp2y - the second control point y
@param {number} tox - target x
@param {number} toy - target y
@returns {steer.item.PathInfo} return target PathInfo
*/
steer.item.PathInfo.prototype.curveTo = function () { };

/**
line to target position
@param {number} tox - target x
@param {number} toy - target y
@returns {steer.item.PathInfo} return target PathInfo
*/
steer.item.PathInfo.prototype.lineTo = function () { };

/**
clear all path informations
*/
steer.item.PathInfo.prototype.reset = function () { };


/**
convert html SVGPathElement path to PathInfo data
@param {SVGPathElement} svgPath - the source html SVGPathElement
@param {steer.item.PathInfo} pathInfo - the target PathInfo class to fill path data
@returns {steer.item.PathInfo} return target PathInfo
*/
steer.item.PathInfo.fillSVGPathElement = function () { };



//========================================================================================================================
//========================================================================================================================
// Path          src/item/BezierPath
//========================================================================================================================
//========================================================================================================================
/**
Path stores a list of segments for units to follow.
@constructor
*/
steer.item.Path = function () {

    /** @property {steer.Vector[]} segments - path segments*/
    this.segments;

    /** @property {number} pathWidth - the width of this path */
    this.pathWidth;

}



//========================================================================================================================
//========================================================================================================================
// Circle          src/item/Circle
//========================================================================================================================
//========================================================================================================================
/**
Circle shape object in the steer.js domain
@extends steer.item.ItemEntity
@constructor
@param {box2d.b2Body} b2body - given box2d b2body object
@param {number} radius - radius of the circle
@param {string} name- identity name of this object
*/
steer.item.Circle = function () {

    /** @property {number} radius - radius of the circle*/
    this.radius;

    /** @property {number} pathWidth - the width of this path */
    this.pathWidth;

}



//========================================================================================================================
//========================================================================================================================
// Edge          src/item/Edge
//========================================================================================================================
//========================================================================================================================
/**
Edge is consisted of lines that behave like walls in the steer.js domain
@extends steer.item.ItemEntity
@constructor
@param {box2d.b2Body} b2body - given box2d b2body object
@param {string} name- identity name of this object
*/
steer.item.Edge = function () {

}



//========================================================================================================================
//========================================================================================================================
// GridMap          src/item/GridMap
//========================================================================================================================
//========================================================================================================================
/**
two dimensional GripMap used for grid-based path finding or as force map
@extends steer.item.ItemBase
@constructor
@param {number} x - x position
@param {number} y - y position
@param {steer.Vector} blockSize - the width and height of each block in the grid
@param {steer.Vector} gridSize - the size of how many blocks in each row and column
@param {string} name- identity name of this object
*/
steer.item.GridMap = function () {

    /** @property {steer.Vector} blockSize - the width and height of each block in the grid */
    this.blockSize;

    /** @property {steer.Vector} gridSize - the size of how many blocks in each row and column */
    this.gridSize;

    /** @property {number} w - the total width of grid (blockSize.x * gridSize.x) */
    this.w;

    /** @property {number} h - the total height of grid (blockSize.x * gridSize.x) */
    this.h;

    /** @property {number} h - the total height of grid (blockSize.x * gridSize.x) */
    this.h;

    /** @property {number} x - x position */
    this.x;

    /** @property {number} y - y position */
    this.y;

    /** @property {steer.Vector[]} velocityData - force data of this grid (two dimensional array) */
    this.velocityData;

    /** @property {Object} pathData - path data used for pathfinding  */
    this.pathData;

}

/** clear pathData and set every block to walkable */
steer.item.GridMap.prototype.clearPathGrid = function () { };

/** 
find walkable path from pathfinding algorithm
@param {number} startx - start position x
@param {number} starty - start position x
@param {number} endx - end position x
@param {number} endy - end position x
@param {number} pathWidth - the pathwidth to result PathInfo
@param {number} interpolateSize - the interpolateSize to result PathInfo
*/
steer.item.GridMap.prototype.findPath = function () { };



//========================================================================================================================
//========================================================================================================================
// Polygon          src/item/Polygon
//========================================================================================================================
//========================================================================================================================
/**
Polygon shape object in the steer.js domain
@extends steer.item.ItemEntity
@constructor
@param {box2d.b2Body} b2body - given box2d b2body object
@param {string} name- identity name of this object
*/
steer.item.Polygon = function () {

}



//========================================================================================================================
//========================================================================================================================
// Quad          src/item/Quad
//========================================================================================================================
//========================================================================================================================
/**
Polygon shape object in the steer.js domain
@constructor
@param {number} x - x position
@param {number} y - y position
@param {number} w - quadtree area width
@param {number} h - quadtree area height
@param {number} maxChildren - max number of items to hold in this area, it will futher split evenly to 4 child area when exceed
@param {number} maxDepth - how many level deep can this quaddata split. 
*/
steer.item.QuadTree = function () {

}

/**
select possible collision candidates  
@param {steer.item.ItemEntity} item - target item to check 
@param {boolean} [optimizeDist=false] - also check for item distance in the process
@returns {steer.item.QuadSelector[]} return a list of possible collision candidates 
*/
steer.item.QuadTree.prototype.quadTreeSelect = function () { };



//========================================================================================================================
//========================================================================================================================
// QuadSelector          src/item/Quad
//========================================================================================================================
//========================================================================================================================
/**
Selector used in QuadTree, contains a list of possible collision candidates and the area information
@constructor
@param {number} x - x position
@param {number} y - y position
@param {number} w - area width
@param {number} h - area height
@param {object[]} data - a list of possible collision candidates in the domain
*/
steer.item.QuadSelector = function () {
}



//========================================================================================================================
//========================================================================================================================
// Sensor          src/item/Sensor
//========================================================================================================================
//========================================================================================================================
/**
area that item can pass through and apply optional force or event when reached
@extends steer.item.ItemEntity
@constructor
@param {box2d.b2Body} b2body - given box2d b2body object
@param {string} name- identity name of this object
*/
steer.item.Sensor = function () {

}

/**
act as force area that push unit by given force
@param {steer.Vector} force - force to apply when reached
*/
steer.item.Sensor.prototype.asForcePushVector = function(){};
/**
act as force area that push unit away 
@param {number} forceMagnitude - force to apply when reached
*/
steer.item.Sensor.prototype.asForcePushCenter = function(){};

/**
act as force area that pull unit in to the Sensor center
@param {number} forceMagnitude - force to apply when reached
*/
steer.item.Sensor.prototype.asForcePullCenter = function(){};

/**
act as event sensor that call given function when reached
@param {Function} eventStart - the event to fire when enter the area
@param {Function} eventEnd - the event to fire when leaving the area
*/
steer.item.Sensor.prototype.asEventSensor = function(){};
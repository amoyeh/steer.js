/**
namespace for controlling behavioral force
@namespace steer.controls
*/
steer.controls = {};

//========================================================================================================================
//========================================================================================================================
// Behavior.ts          src/controls/Behavior
//========================================================================================================================
//========================================================================================================================

/** 
static Behavior class used to apply item behavioral forces
@constructor
*/
steer.controls.Behavior = function () { }

/**
Caculate force that makes unit seek to target position when applied
@param {steer.item.Unit} unit - unit
@param {steer.Vector} target - target position
@returns {steer.Vector} returns force to seeking position
*/
steer.controls.Behavior.seek = function () { };

/**
Caculate force that makes unit flee to target position when applied
@param {steer.item.Unit} unit - unit
@param {steer.Vector} target - flee from position
@returns {steer.Vector} returns force to flee from position
*/
steer.controls.Behavior.flee = function () { };

/**
Caculate force that moves unit away from other shapes (Circle and Polygons). it uses unit's raycast line for detection.
@param {steer.item.Unit} unit - unit
@returns {steer.Vector} returns force to move unit away from potential collision shapes
*/
steer.controls.Behavior.avoidObstacle = function () { };

/**
Caculate force that makes unit pursuit to target future position when applied
@param {steer.item.Unit} unit - the unit 
@param {steer.item.Unit} target - the target unit to seek
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.pursuit = function () { };

/**
Caculate force that makes unit evade from target future position when applied
@param {steer.item.Unit} unit - unit to apply force
@param {steer.item.Unit} target - target to evade
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.evade = function () { };

/**
Caculate force that makes unit seek to the target location and if close enough, slow down to stop.
@param {steer.item.Unit} unit - unit
@param {steer.Vector} target - target position
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.arrive = function () { };

/**
Caculate force that make unit seperate other based on its seperation radius
@param {steer.item.Unit} unit - unit
@param {steer.item.Unit[]} list - units to check
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.separation = function () { };

/**
Caculate force that make unit to move to other's directions base on its alignment radius
@param {steer.item.Unit} unit - unit
@param {steer.item.Unit[]} list - units to check
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.align = function () { };

/**
Caculate force that make unit close to other units' position base on its cohesion radius
@param {steer.item.Unit} unit - unit
@param {steer.item.Unit[]} list - units to check
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.cohesion = function () { };

/**
Initialize path setting on unit before following the path
@param {steer.item.Unit} unit - unit
@param {steer.item.Path} path - path to follow
@param {boolean} initOnshortestPt - check the closest segment on the path as start point
@param {boolean} loopOnPath - loop on path when reach last segment
@param {number} pathSeekAheadAmt - 
how many segments further to check on the path. 
setting to 1 would make unit follow path segments one after other, 
setting this to high number would make unit seek to closest segment in the future and might skip following some segments on the path.
*/
steer.controls.Behavior.initPathUnit = function () { };

/**
Caculate force that make unit follow path
steer.controls.Behavior.initPathUnit() must be called once when assigning unit the path to seek
@param {steer.item.Unit} unit - unit
@param {steer.item.Path} path - path to follow
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.followPath = function () { };

/**
Initialize wander behavior on the unit
@param {steer.item.Unit} unit - unit
@param {number} wanderRadius - the wandering circle radius
@param {number} wanderRatioDeg - amount of angle to turn randomly in each update
*/
steer.controls.Behavior.initWander = function () { };

/**
Caculate force that make unit moving in random direction
steer.controls.Behavior.initWander() must be called once on unit before caculate wander behavior
@param {steer.item.Unit} unit - unit
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.wander = function () { };

/**
Caculate force that make unit avoid other units. Unit and other's velocity and directions are also considered in the caculation 
@param {steer.item.Unit} unit - unit
@param {steer.item.Unit[]} list - units to check
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.avoidUnit = function () { };


/**
Caculate force based on given GridMap velocityData
@param {steer.item.Unit} unit - unit
@param {steer.item.GridMap} gridmap - Gridmap that contains velocityData
@returns {steer.Vector} returns result force from caculation
*/
steer.controls.Behavior.gridmapForce = function () { };
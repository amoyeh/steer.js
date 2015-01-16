//========================================================================================================================
//========================================================================================================================
// Domain          src/core/Domain
//========================================================================================================================
//========================================================================================================================

/**
a given domain contains all items and can be used to simulate force and movement on every update
@constructor 
*/
steer.Domain = function () {

    /** @property {box2d.b2World} b2World - box2d b2World reference */
    this.b2World;

    /** @property {object[]} items - contains all items */
    this.items;

    /** @property {object[]} autoItems - contains all automatic update items such as Scene */
    this.autoItems;

    /** @property {object[]} gridMaps - contains all gridmaps in the domain */
    this.gridMaps;

    /** @property {BaseRender[]} renderers - contains all BaseRenders */
    this.renderers;

    /** @property {steer.item.QuadTree} selector - QuadTree selector */
    this.selector;

}

/*
create box2d world
@param {box2d.b2Vec2} gravity - gravity in the box2d world
*/
steer.Domain.prototype.createB2World = function () { };

/*
create box2d debug display provided by box2d library
@param {string} canvasId - html canvas element id that used as display
@param {number} flags - check what to draw in bitmask format ex: box2d.b2DrawFlags.e_none | box2d.b2DrawFlags.e_shapeBit | box2d.b2DrawFlags.e_centerOfMassBit
*/
steer.Domain.prototype.createBox2dDebugDraw = function () { };

/*
add a renderer to domain , when domain calls preUpdate() update() or intergrate(),
all the related functions in the renderer list are also fired.
@param {steer.BaseRender} renderer - renderer derived from BaseRender
*/
steer.Domain.prototype.addRenderer = function () { };

/*
remove renderer from domain
@param {steer.BaseRender} renderer - renderer to remove
*/
steer.Domain.prototype.removeRenderer = function () { };

/*
remove an item from domain
@param {steer.item.ItemBase} item - item to remove
*/
steer.Domain.prototype.remove = function () { };

/*
setup QuadTree selector to this domain
@param {steer.item.QuadTree} selector - QuadTree selector to add
*/
steer.Domain.prototype.setupSelector = function () { };

/*
call preUpdate before apply any force in logic loop, 
it caches all necessary raycast and velocity info of each unit to increase caculation perfermance
*/
steer.Domain.prototype.preUpdate = function () { };

/*
apply force to every units in the update
*/
steer.Domain.prototype.update = function () { };

/*
integrate unit position in rendering update
@param {number} delta - time elapsed
*/
steer.Domain.prototype.integrate = function () { };



//========================================================================================================================
//========================================================================================================================
// SteerTimer          src/core/SteerTimer
//========================================================================================================================
//========================================================================================================================
/**
timer to control when to update
@constructor 
 @param {number} TPS - how many logic update per second
*/
steer.SteerTimer = function () {

    /** @property {number} TPS - how many logic update per second */
    this.TPS;
}

/** start the update process */
steer.SteerTimer.prototype.start = function () { };

/** 
update TPS value (Logic update per second)
@param {number} TPS - how many logic update per second
*/
steer.SteerTimer.prototype.updateTPS = function () { };

/** 
is this timer running
@returns {boolean} - return true if Timer is running updates
*/
steer.SteerTimer.prototype.isRunning = function () { };

/** stop update */
steer.SteerTimer.prototype.stop = function () { };
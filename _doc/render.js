/**
steer.js visual rendering namespace
@namespace steer.render
*/
steer.render = {};

//========================================================================================================================
//========================================================================================================================
// DebugColors          src/render/DebugColors
//========================================================================================================================
//========================================================================================================================

/** 
static class that stores color settings. Used to draw shapes in debugging mode
@constructor
*/
steer.render.DebugColors = function () { }

/**@property {number} DC_PATH_FILL - color codes used to draw path*/
steer.render.DebugColors.DC_PATH_FILL;

/**@property {number} DC_PATH_FILL_SA - alpha value used to drawing path line */
steer.render.DebugColors.DC_PATH_FILL_SA;

/**@property {number} DC_PATH_FILL_A - alpha value used to drawing path width */
steer.render.DebugColors.DC_PATH_FILL_A;

/**@property {number} DC_PATH_GUIDE - color code used to draw path guide on unit */
steer.render.DebugColors.DC_PATH_GUIDE;

/**@property {number} DC_PATH_GUIDE_A - alpha value used to draw unit to path information */
steer.render.DebugColors.DC_PATH_GUIDE_A;

/**@property {number} DC_PATH_GUIDE_A2 - alpha value used to draw unit to path seeking point information */
steer.render.DebugColors.DC_PATH_GUIDE_A2;

/**@property {number} DC_WANDER - color code used to wander guide on unit */
steer.render.DebugColors.DC_WANDER;

/**@property {number} DC_WANDER_A - alpha value used to draw to wander guide on unit */
steer.render.DebugColors.DC_WANDER_A;

/**@property {number} DC_ALIGNMENT - color code used to draw alignment radius */
steer.render.DebugColors.DC_ALIGNMENT;

/**@property {number} DC_ALIGNMENT_A - alpha value used to draw alignment radius */
steer.render.DebugColors.DC_ALIGNMENT_A;

/**@property {number} DC_COHESION - color code used to draw cohesion radius */
steer.render.DebugColors.DC_COHESION;

/**@property {number} DC_COHESION_A - alpha value used to draw cohesion radius */
steer.render.DebugColors.DC_COHESION_A;

/**@property {number} DC_SEPARATION - color code used to draw separation radius */
steer.render.DebugColors.DC_SEPARATION;

/**@property {number} DC_SEPARATION_A - alpha value used to draw separation radius */
steer.render.DebugColors.DC_SEPARATION_A;

/**@property {number} DC_RAYCAST - color code used to draw raycast line on unit */
steer.render.DebugColors.DC_RAYCAST;

/**@property {number} DC_RAYCAST_A - alpha value used to draw raycast line on unit */
steer.render.DebugColors.DC_RAYCAST_A;

/**@property {number} DC_STATIC - color code used to draw static items */
steer.render.DebugColors.DC_STATIC;

/**@property {number} DC_STATIC_A - alpha value used to draw static items */
steer.render.DebugColors.DC_STATIC_A;

/**@property {number} DC_DYNAMIC - color code used to draw dynamic items */
steer.render.DebugColors.DC_DYNAMIC;

/**@property {number} DC_DYNAMIC_A - alpha value used to draw dynamic items */
steer.render.DebugColors.DC_DYNAMIC_A;

/**@property {number} DC_QUAD - color code used to draw quadtree */
steer.render.DebugColors.DC_QUAD;

/**@property {number} DC_QUAD_A - alpha value used to draw quadtree */
steer.render.DebugColors.DC_QUAD_A;

/**@property {number} DC_SENSOR - color code used to draw Sensor */
steer.render.DebugColors.DC_SENSOR;

/**@property {number} DC_SENSOR_A - alpha value used to draw Sensor */
steer.render.DebugColors.DC_SENSOR_A;

/**@property {number} DC_SENSOR_STATIC - color code used to draw static Sensor */
steer.render.DebugColors.DC_SENSOR_STATIC;

/**@property {number} DC_SENSOR_STATIC_A - alpha value used to draw static Sensor */
steer.render.DebugColors.DC_SENSOR_STATIC_A;

/**@property {number} DC_GRID - color code used to draw grid*/
steer.render.DebugColors.DC_GRID;

/**@property {number} DC_GRID_A - alpha value used to draw grid*/
steer.render.DebugColors.DC_GRID_A;

/**@property {number} DC_GRID_BLOCK - color code used to draw non-walkable block on grid */
steer.render.DebugColors.DC_GRID_BLOCK;

/**@property {number} DC_GRID_BLOCK_A - alpha value used to draw non-walkable block on grid */
steer.render.DebugColors.DC_GRID_BLOCK_A;

/**@property {number} DC_AVOID_FRONT - color code used to draw unit avoidance on the front angle */
steer.render.DebugColors.DC_AVOID_FRONT;

/**@property {number} DC_AVOID_SIDE - color code used to draw unit avoidance on the side angle */
steer.render.DebugColors.DC_AVOID_SIDE;

/**@property {number} DC_AVOID_PARALLEL - color code used to draw unit avoidance on the parallel angle */
steer.render.DebugColors.DC_AVOID_PARALLEL;



//========================================================================================================================
//========================================================================================================================
// DebugDrawInfo          src/render/DebugDrawInfo
//========================================================================================================================
//========================================================================================================================
/** 
stores custom drawing setting on unit, applied when rendered by using DebugRenderers
@constructor
*/
steer.render.DebugDrawInfo = function () {
    /**@property {number} drawMask - bitmasks setting , used to decide what to draw in DebugRenderers. ex: steer.render.DebugDrawInfo.SHOW_FILL | steer.render.DebugDrawInfo.SHOW_EDGE */
    this.drawMask;
}

/**@property {number} SHOW_FILL - draw fill*/
steer.render.DebugDrawInfo.SHOW_FILL;

/**@property {number} SHOW_EDGE - draw edge*/
steer.render.DebugDrawInfo.SHOW_EDGE;

/**@property {number} UNIT_SEPARATION - draw sepration radius on unit */
steer.render.DebugDrawInfo.UNIT_SEPARATION;

/**@property {number} UNIT_ALIGNMENT - draw alignment radius on unit */
steer.render.DebugDrawInfo.UNIT_ALIGNMENT;

/**@property {number} UNIT_COHESION - draw cohesion radius on unit */
steer.render.DebugDrawInfo.UNIT_COHESION;

/**@property {number} UNIT_RAYCAST - draw raycast lines on unit */
steer.render.DebugDrawInfo.UNIT_COHESION;

/**@property {number} UNIT_WANDER - draw wander radius and lines on unit */
steer.render.DebugDrawInfo.UNIT_WANDER;

/**@property {number} UNIT_PATH_INFO - draw unit follow path guides on unit*/
steer.render.DebugDrawInfo.UNIT_PATH_INFO;

/**@property {number} BOUNDING_BOX - draw bounding box on unit*/
steer.render.DebugDrawInfo.UNIT_PATH_INFO;

/**@property {number} AVOID_FORCE - draw unit avoidance force on unit*/
steer.render.DebugDrawInfo.AVOID_FORCE;


/**
create a DebugDrawInfo object to the target unit 
@param {steer.item.ItemBase} item -target unit
@returns {steer.render.DebugDrawInfo} return unit's DebugDrawInfo
*/
steer.render.DebugDrawInfo.create = function(){};

/**
check if target contains DebugDrawInfo setting
@param {steer.item.ItemBase} item -target unit
@returns {boolean} return true if exist
*/
steer.render.DebugDrawInfo.exist = function(){};

/**
check if target contains DebugDrawInfo setting
@param {steer.item.ItemBase} item -target unit
@returns {boolean} return true if exist
*/
steer.render.DebugDrawInfo.exist = function(){};

/**
get DebugDrawInfo object of the target unit, return null if not exist.
@param {steer.item.ItemBase} item -target unit
@returns {steer.render.DebugDrawInfo} return unit's DebugDrawInfo, null if not exist.
*/
steer.render.DebugDrawInfo.getInfo = function () { };



//========================================================================================================================
//========================================================================================================================
// IDisplayUpdate          src/core/Domain
//========================================================================================================================
//========================================================================================================================
/**
implement this interface to update display items.
@constructor
*/
steer.render.IDisplayUpdate = function () {}

/**
every time when render update fired, call this function to update step
@param {number} delta - time elapsed since last update
*/
steer.render.IDisplayUpdate.prototype.updateStep = function(){};

/**
every time when item update fired, call this function to update target item
@param {obejct} item - target item
@param {obejct} xto - the new x position of the item
@param {obejct} yto - the new y position of the item
@param {obejct} rto - the new rotation of the item
@param {obejct} delta - time elapsed since last update
*/
steer.render.IDisplayUpdate.prototype.updateItem = function(){};



//========================================================================================================================
//========================================================================================================================
// BaseRender          src/core/Domain
//========================================================================================================================
//========================================================================================================================
/** 
Base Render Class
@constructor 
@param {steer.Domain} domain - domain object
@param {number} w - width
@param {number} h - height
*/
steer.BaseRender = function () {}

/** call in domain.preUpdate function */
steer.BaseRender.prototype.preDomainUpdate = function () { };

/**
call in domain.preUpdate function
@param {number} delta - time elapsed
*/
steer.BaseRender.prototype.update = function () { };

/**
intergrate item position using given delta
@param {number} delta - time elapsed
*/
steer.BaseRender.prototype.intergrate = function () { };

/**
called on every item in intergration event, used to update item position
@param {steer.item.ItemBase} item - item to apply update
@param {number} delta - time elapsed
*/
steer.BaseRender.prototype.itemRender = function () { };

/**
called after all item finish intergration, used to render view
@param {number} delta - time elapsed
*/
steer.BaseRender.prototype.visualRender = function () { };


//========================================================================================================================
//========================================================================================================================
// PixiDebugRenderer          src/render/PixiDebugRenderer
//========================================================================================================================
//========================================================================================================================
/** 
Debug Renderer using Pixi Renderer
@extends steer.BaseRender
@constructor 
@param {steer.Domain} domain - domain object
@param {PIXI.Stage} stage - PIXI.Stage class reference
@param {PIXI.IPixiRenderer} renderer - PIXI.IPixiRenderer class reference
@param {number} w - width
@param {number} h - height
*/
steer.render.PixiDebugRenderer = function () {

    /**@property {PIXI.Stage} pixiStage - PIXI Stage Object reference*/
    this.pixiStage;

    /**@property {PIXI.IPixiRenderer} pixiRenderer - PIXI IPixiRenderer Object reference*/
    this.pixiRenderer;

    /**@property {PIXI.DisplayObjectContainer} container -PIXI DisplayObjectContainer that contains all pixi graphic items for debugging*/
    this.container;

    /**@property {PIXI.Graphics} guideGrahpic -PIXI Graphics object for drawing custom shapes */
    this.guideGrahpic;

    /**@property {PIXI.Graphics} quadGraphic - PIXI Graphics object used to draw quadtree */
    this.quadGraphic;

}

/** 
draw a cirle on guideGrahpic
@param {(steer.Vector|box2d.b2Vec2)} position - draw position in box2d coordinate
@param {number} color - color code
@param {number} [radius=0.03] - radius in box2d coordinate
@param {number} [alpha=1] - alpha value 
*/
steer.render.PixiDebugRenderer.prototype.drawDot = function () { };

/** 
draw a line from given point
@param {(steer.Vector|box2d.b2Vec2)} fromPos - draw line from position in box2d coordinate
@param {(steer.Vector|box2d.b2Vec2)} toPos - draw line to position in box2d coordinate
@param {number} color - color code
@param {number} [width=0.03] - line width in box2d coordinate
@param {number} [alpha=1] - alpha value 
*/
steer.render.PixiDebugRenderer.prototype.drawSegment = function () { };

/** 
draw a rectangle from given point
@param {number} x - rectangle x position in box2d coordinate
@param {number} y - rectangle y position in box2d coordinate
@param {number} w - rectangle width in box2d coordinate
@param {number} h - rectangle height in box2d coordinate
@param {number} color - color code
@param {number} [alpha=1] - alpha value 
*/
steer.render.PixiDebugRenderer.prototype.drawRectangle = function () { };
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var steer;
(function (steer) {
    var render;
    (function (render) {
        var PixiDebugRenderer = (function (_super) {
            __extends(PixiDebugRenderer, _super);
            function PixiDebugRenderer(domain, stage, renderer, w, h) {
                _super.call(this, domain, w, h);
                this.remakeCounter = 0;
                this.pixiRenderer = renderer;
                this.pixiStage = stage;
                PixiDebugRenderer.instance = this;
                this.container = new PIXI.DisplayObjectContainer();
                this.guideContainer = new PIXI.DisplayObjectContainer();
                this.pixiStage.addChild(this.container);
                this.pixiStage.addChild(this.guideContainer);
                this.container.scale = new PIXI.Point(30, 30);
                this.guideContainer.scale = new PIXI.Point(30, 30);
                this.container.position = new PIXI.Point(0, 0);
                this.guideContainer.position = new PIXI.Point(0, 0);
                this.guideGrahpic = new PIXI.Graphics();
                this.quadGraphic = new PIXI.Graphics();
                this.guideContainer.addChild(this.guideGrahpic);
                this.guideContainer.addChild(this.quadGraphic);
            }
            PixiDebugRenderer.prototype.recreateContainer = function () {
                this.domain.items.each(function (item) {
                    if (item.pixiDebugItem)
                        item.pixiDebugItem = undefined;
                });
                this.domain.autoItems.each(function (item) {
                    if (item.pixiDebugItem)
                        item.pixiDebugItem = undefined;
                });
                this.domain.gridMaps.each(function (item) {
                    if (item.pixiDebugItem)
                        item.pixiDebugItem = undefined;
                });
                this.pixiStage.removeChild(this.container);
                this.container.removeStageReference();
                this.container = undefined;
                this.container = new PIXI.DisplayObjectContainer();
                this.container.scale = new PIXI.Point(30, 30);
                this.pixiStage.addChild(this.container);
            };
            PixiDebugRenderer.prototype.visualRender = function (delta) {
                var _this = this;
                this.domain.gridMaps.each(function (item) {
                    if (item.pixiDebugItem == null) {
                        var graphic = new PIXI.Graphics();
                        item.pixiDebugItem = graphic;
                        _this.container.addChild(graphic);
                        _this.drawGridmap(item);
                    }
                });
                this.pixiRenderer.render(this.pixiStage);
            };
            PixiDebugRenderer.prototype.itemRender = function (item, delta) {
                var xto, yto, rto = 0;
                if (item.b2body) {
                    xto = item.getb2X();
                    yto = item.getb2Y();
                    rto = item.b2body.GetAngle();
                }
                if (item.dynamic) {
                    xto = item.getb2X() + (item.diffPosition.x * delta);
                    yto = item.getb2Y() + (item.diffPosition.y * delta);
                    rto = item.b2body.GetAngle() + (item.diffRotation * delta);
                }
                var itemType = item.constructor["name"];
                if (item.pixiDebugItem == null) {
                    var graphic = new PIXI.Graphics();
                    item.pixiDebugItem = graphic;
                    this.container.addChild(graphic);
                    var color = (item.dynamic) ? render.DebugColors.DC_DYNAMIC : render.DebugColors.DC_STATIC;
                    var alpha = (item.dynamic) ? render.DebugColors.DC_DYNAMIC_A : render.DebugColors.DC_STATIC_A;
                    switch (itemType) {
                        case "Unit":
                            this.makeCircle(xto, yto, rto, item, color, alpha);
                            break;
                        case "Circle":
                            this.makeCircle(xto, yto, rto, item, color, alpha);
                            break;
                        case "Polygon":
                            this.makePolygon(xto, yto, rto, item, color, alpha);
                            break;
                        case "Edge":
                            this.makeEdge(xto, yto, rto, item, color, alpha);
                            break;
                        case "Path":
                            this.makePath(item);
                            break;
                        case "Sensor":
                            this.makeSensor(xto, yto, rto, item);
                            break;
                    }
                }
                else {
                    if (item.dynamic) {
                        switch (itemType) {
                            case "Unit":
                                this.updateUnitInfo(xto, yto, rto, item);
                                break;
                            case "Circle":
                                this.updateCircle(xto, yto, rto, item, render.DebugColors.DC_DYNAMIC, render.DebugColors.DC_DYNAMIC_A);
                                break;
                            case "Polygon":
                                this.updatePolygon(xto, yto, rto, item, render.DebugColors.DC_DYNAMIC, render.DebugColors.DC_DYNAMIC_A);
                                break;
                            case "Edge":
                                this.makeEdge(xto, yto, rto, item, render.DebugColors.DC_DYNAMIC, render.DebugColors.DC_DYNAMIC_A);
                                break;
                            case "Sensor":
                                this.makeSensor(xto, yto, rto, item);
                                break;
                            case "Path":
                                break;
                        }
                    }
                }
            };
            PixiDebugRenderer.prototype.preDomainUpdate = function () {
                this.drawQuadTree();
            };
            PixiDebugRenderer.prototype.makeCircle = function (xto, yto, rto, item, color, alpha) {
                var g = item.pixiDebugItem;
                g.clear();
                g.beginFill(color, alpha);
                g.drawCircle(0, 0, item.radius);
                g.position.x = xto;
                g.position.y = yto;
                g.rotation = rto;
                g.endFill();
            };
            PixiDebugRenderer.prototype.updateCircle = function (xto, yto, rto, item, color, alpha) {
                var g = item.pixiDebugItem;
                g.position.x = xto;
                g.position.y = yto;
                g.rotation = rto;
            };
            PixiDebugRenderer.prototype.updateUnitInfo = function (xto, yto, rto, item) {
                var g = item.pixiDebugItem;
                g.clear();
                var color = render.DebugDrawInfo.getColor(item, render.DebugColors.DC_DYNAMIC);
                var alpha = render.DebugDrawInfo.getAlpha(item, render.DebugColors.DC_DYNAMIC_A);
                if (!item.dynamic) {
                    color = render.DebugColors.DC_STATIC;
                    alpha = render.DebugColors.DC_STATIC_A;
                }
                g.beginFill(color, alpha);
                g.drawCircle(0, 0, item.radius);
                g.position.x = xto;
                g.position.y = yto;
                g.rotation = rto;
                g.endFill();
                var ddinfo = render.DebugDrawInfo.getInfo(item);
                if (ddinfo == null)
                    return;
                if (item.c_rayInfo == null)
                    return;
                g.lineStyle(0.03, render.DebugColors.DC_RAYCAST, render.DebugColors.DC_RAYCAST_A);
                if (ddinfo.drawMask & render.DebugDrawInfo.UNIT_RAYCAST) {
                    var rayPts = item.c_rayInfo;
                    for (var s = 0; s < rayPts.length; s += 2) {
                        var ix = item.getb2X();
                        var iy = item.getb2Y();
                        g.moveTo(rayPts[s].x - ix - 0.5, rayPts[s].y - iy - 0.5);
                        g.lineTo(rayPts[s + 1].x - ix - 0.5, rayPts[s + 1].y - iy - 0.5);
                    }
                }
                if (ddinfo.drawMask & render.DebugDrawInfo.UNIT_SEPARATION) {
                    g.lineStyle(0.03, render.DebugColors.DC_SEPARATION, render.DebugColors.DC_SEPARATION_A);
                    g.drawCircle(-0.5, -0.5, item.separateRadius);
                }
                if (ddinfo.drawMask & render.DebugDrawInfo.UNIT_COHESION) {
                    g.lineStyle(0.03, render.DebugColors.DC_COHESION, render.DebugColors.DC_COHESION_A);
                    g.drawCircle(-0.5, -0.5, item.cohesionRadius);
                }
                if (ddinfo.drawMask & render.DebugDrawInfo.UNIT_ALIGNMENT) {
                    g.lineStyle(0.03, render.DebugColors.DC_ALIGNMENT, render.DebugColors.DC_ALIGNMENT_A);
                    g.drawCircle(-0.5, -0.5, item.alignRadius);
                }
                if (ddinfo.drawMask & render.DebugDrawInfo.UNIT_WANDER) {
                    g.lineStyle(0.03, render.DebugColors.DC_WANDER, render.DebugColors.DC_WANDER_A);
                    var rxto = -0.5;
                    var ryto = -0.5;
                    g.drawCircle(rxto, ryto, item.wanderRadius);
                    var minAng = item.velocity.heading() - (item.wanderRatioDeg * .5);
                    var addAng = item.velocity.heading() + (item.wanderRatioDeg * .5);
                    g.moveTo(-.5, -.5);
                    g.lineTo(-.5 + Math.cos(minAng) * item.wanderRadius, -.5 + Math.sin(minAng) * item.wanderRadius);
                    g.moveTo(-.5, -.5);
                    g.lineTo(-.5 + Math.cos(addAng) * item.wanderRadius, -.5 + Math.sin(addAng) * item.wanderRadius);
                }
                if (ddinfo.drawMask & render.DebugDrawInfo.UNIT_PATH_INFO) {
                    if (ddinfo.pathPredict) {
                        g.lineStyle(0.03, render.DebugColors.DC_PATH_GUIDE, render.DebugColors.DC_PATH_GUIDE_A);
                        g.drawCircle(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5, 0.05);
                        g.drawCircle(ddinfo.pathNormal.x - .5, ddinfo.pathNormal.y - .5, 0.05);
                        g.moveTo(-.5, -.5);
                        g.lineTo(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5);
                        g.lineTo(ddinfo.pathNormal.x - .5, ddinfo.pathNormal.y - .5);
                        g.moveTo(-.5, -.5);
                        g.lineStyle(0.15, render.DebugColors.DC_PATH_GUIDE, render.DebugColors.DC_PATH_GUIDE_A2);
                        g.lineTo(ddinfo.pathOnFront.x - .5, ddinfo.pathOnFront.y - .5);
                    }
                }
                if (ddinfo.drawMask & render.DebugDrawInfo.BOUNDING_BOX) {
                    var bbox = item.getBoundingBox();
                    g.lineStyle(0.03, render.DebugColors.DC_QUAD, render.DebugColors.DC_QUAD_A);
                    g.drawRect(bbox.x - item.getb2Position().x - .5, bbox.y - item.getb2Position().y - .5, bbox.w, bbox.h);
                }
                if (ddinfo.drawMask & render.DebugDrawInfo.AVOID_FORCE) {
                    if (ddinfo.avoidForce) {
                        g.lineStyle(0.05, ddinfo.avoidColor, 0.8);
                        if (ddinfo.avoidForce) {
                            g.moveTo(-.5, -.5);
                            g.lineTo(ddinfo.avoidForce.x - .5, ddinfo.avoidForce.y - .5);
                            g.drawCircle(ddinfo.avoidForce.x - .5, ddinfo.avoidForce.y - .5, 0.05);
                        }
                        if (ddinfo.avoidHitLoc) {
                            g.lineStyle(0.05, ddinfo.avoidColor, 0.4);
                            g.moveTo(-.5, -.5);
                            g.lineTo(ddinfo.avoidHitLoc.x - .5, ddinfo.avoidHitLoc.y - .5);
                        }
                    }
                }
            };
            PixiDebugRenderer.prototype.makePolygon = function (xto, yto, rto, item, color, alpha) {
                var g = item.pixiDebugItem;
                g.clear();
                g.beginFill(color, alpha);
                for (var t = 0; t < item.shapeLen; t++) {
                    for (var m = 0; m < item.shapes[t].m_count; m++) {
                        var vertice = item.shapes[t].m_vertices[m];
                        if (m == 0) {
                            g.moveTo(vertice.x, vertice.y);
                        }
                        else {
                            g.lineTo(vertice.x, vertice.y);
                        }
                        if (m + 1 == item.shapes[t].m_count) {
                            g.lineTo(item.shapes[t].m_vertices[0].x, item.shapes[t].m_vertices[0].y);
                        }
                    }
                }
                g.position.x = xto;
                g.position.y = yto;
                g.rotation = rto;
                g.endFill();
            };
            PixiDebugRenderer.prototype.updatePolygon = function (xto, yto, rto, item, color, alpha) {
                var g = item.pixiDebugItem;
                g.position.x = xto;
                g.position.y = yto;
                g.rotation = rto;
            };
            PixiDebugRenderer.prototype.makeSensor = function (xto, yto, rto, item) {
                var color = (item.dynamic) ? render.DebugColors.DC_SENSOR : render.DebugColors.DC_SENSOR_STATIC;
                var alpha = (item.dynamic) ? render.DebugColors.DC_SENSOR_A : render.DebugColors.DC_SENSOR_STATIC_A;
                if (item.shapeType == steer.item.Sensor.SHAPE_BOX) {
                    this.makePolygon(xto, yto, rto, item, color, alpha);
                }
                else {
                    this.makeCircle(xto, yto, rto, item, color, alpha);
                }
                var g = item.pixiDebugItem;
                if (item.forceType == steer.item.Sensor.FORCE_PUSH_CENTER) {
                    g.beginFill(0xFFFFFF, .2);
                    var v = .2;
                    g.moveTo(-v, -v);
                    g.lineTo(0, -v * 2);
                    g.lineTo(v, -v);
                    g.moveTo(-v, -v);
                    g.lineTo(-v * 2, 0);
                    g.lineTo(-v, v);
                    g.moveTo(v, -v);
                    g.lineTo(v * 2, 0);
                    g.lineTo(v, v);
                    g.moveTo(-v, v);
                    g.lineTo(0, v * 2);
                    g.lineTo(v, v);
                    g.endFill();
                }
                if (item.forceType == steer.item.Sensor.FORCE_PULL_CENTER) {
                    g.beginFill(0xFFFFFF, .2);
                    var v = .2;
                    g.moveTo(-v, -v * 2);
                    g.lineTo(0, -v);
                    g.lineTo(v, -v * 2);
                    g.moveTo(-v * 2, -v);
                    g.lineTo(-v, 0);
                    g.lineTo(-v * 2, v);
                    g.moveTo(v * 2, -v);
                    g.lineTo(v, 0);
                    g.lineTo(v * 2, v);
                    g.moveTo(-v, v * 2);
                    g.lineTo(0, v);
                    g.lineTo(v, v * 2);
                    g.endFill();
                }
                if (item.forceType == steer.item.Sensor.FORCE_PUSH_VECTOR) {
                    g.beginFill(0xFFFFFF, .3);
                    g.drawCircle(Math.cos(item.forceAngle) * -.15, Math.sin(item.forceAngle) * -.15, 0.05);
                    var xto1 = Math.cos(item.forceAngle + 1.5707) * .2;
                    var yto1 = Math.sin(item.forceAngle + 1.5707) * .2;
                    var xto2 = Math.cos(item.forceAngle) * .35;
                    var yto2 = Math.sin(item.forceAngle) * .35;
                    var xto3 = Math.cos(item.forceAngle - 1.5707) * .2;
                    var yto3 = Math.sin(item.forceAngle - 1.5707) * .2;
                    g.endFill();
                    g.beginFill(0xFFFFFF, .3);
                    g.moveTo(xto1, yto1);
                    g.lineTo(xto2, yto2);
                    g.lineTo(xto3, yto3);
                    g.endFill();
                }
            };
            PixiDebugRenderer.prototype.makeEdge = function (xto, yto, rto, item, color, alpha) {
                var g = item.pixiDebugItem;
                g.lineStyle(0.03, color, alpha);
                g.position.x = xto - 0.5;
                g.position.y = yto - 0.5;
                g.rotation = rto;
                for (var t = 0; t < item.shapeLen; t++) {
                    var loopShape = item.shapes[t];
                    g.moveTo(loopShape.m_vertex1.x, loopShape.m_vertex1.y);
                    g.lineTo(loopShape.m_vertex2.x, loopShape.m_vertex2.y);
                }
            };
            PixiDebugRenderer.prototype.makePath = function (item) {
                var g = item.pixiDebugItem;
                g.position.x = 0;
                g.position.y = 0;
                g.lineStyle(0.03, render.DebugColors.DC_PATH_FILL, render.DebugColors.DC_PATH_FILL_SA);
                var plen = item.segments.length;
                for (var k = 0; k < plen; k++) {
                    var seg = item.segments[k];
                    g.drawCircle(seg.x - .5, seg.y - .5, 0.05);
                }
                var dlen = item.drawInfo.length;
                g.moveTo(item.segments[0].x - .5, item.segments[0].y - .5);
                for (var k = 0; k < dlen; k++) {
                    var di = item.drawInfo[k];
                    if (di.type == steer.item.PathDrawInfo.TYPE_LINE) {
                        g.lineTo(di.end.x - .5, di.end.y - .5);
                    }
                    if (di.type == steer.item.PathDrawInfo.TYPE_BEZIER) {
                        g.bezierCurveTo(di.cp1.x - .5, di.cp1.y - .5, di.cp2.x - .5, di.cp2.y - .5, di.end.x - .5, di.end.y - .5);
                    }
                }
                var iw = item.pathWidth + 0.000001;
                g.lineStyle(iw, render.DebugColors.DC_PATH_FILL, render.DebugColors.DC_PATH_FILL_A);
                g.moveTo(item.segments[0].x - .5, item.segments[0].y - .5);
                for (var k = 0; k < dlen; k++) {
                    var di = item.drawInfo[k];
                    if (di.type == steer.item.PathDrawInfo.TYPE_LINE) {
                        g.lineTo(di.end.x - .5, di.end.y - .5);
                    }
                    if (di.type == steer.item.PathDrawInfo.TYPE_BEZIER) {
                        g.bezierCurveTo(di.cp1.x - .5, di.cp1.y - .5, di.cp2.x - .5, di.cp2.y - .5, di.end.x - .5, di.end.y - .5);
                    }
                }
            };
            PixiDebugRenderer.prototype.drawGridmap = function (item) {
                var g = item.pixiDebugItem;
                g.clear();
                g.position.x = item.x;
                g.position.y = item.y;
                g.lineStyle(0.03, render.DebugColors.DC_GRID, render.DebugColors.DC_GRID_A);
                for (var y = 0; y < item.gridSize.y + 1; y++) {
                    var ys = item.blockSize.y * y;
                    var xto = item.gridSize.x * item.blockSize.x;
                    g.moveTo(0 - .5, ys - .5);
                    g.lineTo(xto - .5, ys - .5);
                }
                for (var x = 0; x < item.gridSize.x + 1; x++) {
                    var xs = item.blockSize.x * x;
                    var yto = item.gridSize.y * item.blockSize.y;
                    g.moveTo(xs - .5, 0 - .5);
                    g.lineTo(xs - .5, yto - .5);
                }
                if (item.velocityData) {
                    for (var lx = 0; lx < item.gridSize.x; lx++) {
                        for (var ly = 0; ly < item.gridSize.y; ly++) {
                            if (item.velocityData[lx]) {
                                if (item.velocityData[lx][ly]) {
                                    var xpos = item.blockSize.x * (lx + 0.5) - .5;
                                    var ypos = item.blockSize.y * (ly + 0.5) - .5;
                                    g.moveTo(xpos, ypos);
                                    var dirVec = item.velocityData[lx][ly].clone().normalize();
                                    var dirDrawX = dirVec.x * item.blockSize.x * .4;
                                    var dirDrawY = dirVec.y * item.blockSize.y * .4;
                                    g.lineTo(xpos + dirDrawX, ypos + dirDrawY);
                                }
                            }
                        }
                    }
                }
                if (item.pathData) {
                    g.lineStyle(0, 0x000000, 0);
                    for (var lx = 0; lx < item.gridSize.x; lx++) {
                        for (var ly = 0; ly < item.gridSize.y; ly++) {
                            if (!item.pathData.isWalkableAt(lx, ly)) {
                                var xpos = item.blockSize.x * lx;
                                var ypos = item.blockSize.y * ly;
                                g.beginFill(render.DebugColors.DC_GRID_BLOCK, render.DebugColors.DC_GRID_BLOCK_A);
                                g.drawRect(xpos, ypos, item.blockSize.x, item.blockSize.y);
                                g.endFill();
                            }
                        }
                    }
                }
            };
            PixiDebugRenderer.prototype.drawDot = function (position, color, radius, alpha) {
                if (radius === void 0) { radius = 0.03; }
                if (alpha === void 0) { alpha = 1; }
                var g = this.guideGrahpic;
                g.lineStyle(0.03, color, alpha);
                g.drawCircle(position.x - 0.5, position.y - 0.5, radius);
                g.endFill();
            };
            PixiDebugRenderer.prototype.drawSegment = function (fromPos, toPos, color, width, alpha) {
                if (width === void 0) { width = 0.03; }
                if (alpha === void 0) { alpha = 1; }
                var g = this.guideGrahpic;
                g.lineStyle(width, color, alpha);
                g.moveTo(fromPos.x - 0.5, fromPos.y - 0.5);
                g.lineTo(toPos.x - 0.5, toPos.y - 0.5);
            };
            PixiDebugRenderer.prototype.drawRectangle = function (x, y, w, h, color, alpha) {
                var g = this.guideGrahpic;
                g.lineStyle(0.03, color, alpha);
                g.drawRect(x - .5, y - .5, w, h);
                g.endFill();
            };
            PixiDebugRenderer.prototype.drawQuadTree = function () {
                this.quadGraphic.clear();
                if (this.domain.selector.rootNode) {
                    this.drawTreeNode(this.domain.selector.rootNode);
                }
            };
            PixiDebugRenderer.prototype.drawTreeNode = function (targetNode) {
                if (targetNode.nodes.length > 0) {
                    for (var i = 0; i < targetNode.nodes.length; i++) {
                        this.drawTreeNode(targetNode.nodes[i]);
                    }
                }
                var g = this.quadGraphic;
                g.lineStyle(0.03, render.DebugColors.DC_QUAD, render.DebugColors.DC_QUAD_A);
                g.drawRect(targetNode.x - .5, targetNode.y - .5, targetNode.width, targetNode.height);
            };
            return PixiDebugRenderer;
        })(steer.BaseRender);
        render.PixiDebugRenderer = PixiDebugRenderer;
    })(render = steer.render || (steer.render = {}));
})(steer || (steer = {}));

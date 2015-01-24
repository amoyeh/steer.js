module steer.render {

    export class PixiDebugRenderer extends BaseRender {

        public pixiStage: PIXI.Stage;
        public pixiRenderer: PIXI.IPixiRenderer;
        public container: PIXI.DisplayObjectContainer;
        public guideContainer: PIXI.DisplayObjectContainer; //for drawing custom datas
        public guideGrahpic: PIXI.Graphics;
        public quadGraphic: PIXI.Graphics;
        //for easier singleton access when debugging, only for development testing purpose
        public static instance: PixiDebugRenderer;

        constructor(domain: Domain, stage: PIXI.Stage, renderer: PIXI.IPixiRenderer, w: number, h: number) {
            super(domain, w, h);
            this.pixiRenderer = renderer;
            this.pixiStage = stage;
            PixiDebugRenderer.instance = this; //instance for debugging only
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

        //pixi has weird memory leak problem , remove all items and recreate again to prevent it
        private remakeCounter: number = 0;
        public recreateContainer(): void {
            this.domain.items.each((item: any) => {
                if (item.pixiDebugItem) item.pixiDebugItem = undefined;
            });
            this.domain.autoItems.each((item: any) => {
                if (item.pixiDebugItem) item.pixiDebugItem = undefined;
            });
            this.domain.gridMaps.each((item: any) => {
                if (item.pixiDebugItem) item.pixiDebugItem = undefined;
            });
            this.pixiStage.removeChild(this.container);
            this.container.removeStageReference();
            this.container = undefined;
            this.container = new PIXI.DisplayObjectContainer();
            this.container.scale = new PIXI.Point(30, 30);
            this.pixiStage.addChild(this.container);

        }

        public visualRender(delta: number): void {
            this.domain.gridMaps.each((item: item.GridMap) => {
                if (item.pixiDebugItem == null) {
                    var graphic: PIXI.Graphics = new PIXI.Graphics();
                    item.pixiDebugItem = graphic;
                    this.container.addChild(graphic);
                    this.drawGridmap(item);
                }
            });
            this.pixiRenderer.render(this.pixiStage);
            //pixi has weird memory leak problem , remove all items and recreate again to prevent it
            //this.remakeCounter++;
            //if (this.remakeCounter > 100) {
            //    this.remakeCounter = 0;
            //    this.recreateContainer();
            //}
        }

        public itemRender(item: any, delta: number) {
            var xto: number, yto: number, rto: number = 0;
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
            var itemType: string = item.constructor["name"];
            if (item.pixiDebugItem == null) {
                //item making
                var graphic: PIXI.Graphics = new PIXI.Graphics();
                item.pixiDebugItem = graphic;
                this.container.addChild(graphic);
                var color = (item.dynamic) ? DebugColors.DC_DYNAMIC : DebugColors.DC_STATIC;
                var alpha = (item.dynamic) ? DebugColors.DC_DYNAMIC_A : DebugColors.DC_STATIC_A;
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
            } else {
                //item exist already, see if we update it
                if (item.dynamic) {
                    switch (itemType) {
                        case "Unit":
                            this.updateUnitInfo(xto, yto, rto, item);
                            break;
                        case "Circle":
                            this.updateCircle(xto, yto, rto, item, DebugColors.DC_DYNAMIC, DebugColors.DC_DYNAMIC_A);
                            break;
                        case "Polygon":
                            this.updatePolygon(xto, yto, rto, item, DebugColors.DC_DYNAMIC, DebugColors.DC_DYNAMIC_A);
                            break;
                        case "Edge":
                            this.makeEdge(xto, yto, rto, item, DebugColors.DC_DYNAMIC, DebugColors.DC_DYNAMIC_A);
                            break;
                        case "Sensor":
                            this.makeSensor(xto, yto, rto, item);
                            break;
                        case "Path":
                            break;
                    }
                }
            }
        }

        public preDomainUpdate(): void {
            this.drawQuadTree();
        }

        public makeCircle(xto: number, yto: number, rto: number, item: item.ItemEntity, color: number, alpha: number): void {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.clear();
            g.beginFill(color, alpha);
            g.drawCircle(0, 0, (<item.Circle>item).radius);
            g.position.x = xto;
            g.position.y = yto;
            g.rotation = rto;
            g.endFill();
        }

        public updateCircle(xto: number, yto: number, rto: number, item: item.ItemEntity, color: number, alpha: number): void {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.position.x = xto;
            g.position.y = yto;
            g.rotation = rto;
        }

        public updateUnitInfo(xto: number, yto: number, rto: number, item: item.Unit): void {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.clear();
            var color: number = DebugDrawInfo.getColor(item, DebugColors.DC_DYNAMIC);
            var alpha: number = DebugDrawInfo.getAlpha(item, DebugColors.DC_DYNAMIC_A);
            if (!item.dynamic) {
                color = DebugColors.DC_STATIC;
                alpha = DebugColors.DC_STATIC_A;
            }
            g.beginFill(color, alpha);
            g.drawCircle(0, 0, item.radius);
            g.position.x = xto;
            g.position.y = yto;
            g.rotation = rto;
            g.endFill();
            var ddinfo: DebugDrawInfo = DebugDrawInfo.getInfo(item);
            if (ddinfo == null) return;
            if (item.c_rayInfo == null) return; //raycasting is not ready yet, not from domain update
            g.lineStyle(0.03, DebugColors.DC_RAYCAST, DebugColors.DC_RAYCAST_A);
            if (ddinfo.drawMask & DebugDrawInfo.UNIT_RAYCAST) {
                var rayPts: steer.Vector[] = item.c_rayInfo;
                if (item.c_velocityLength > 0.7) {
                    for (var s: number = 0; s < rayPts.length; s += 2) {
                        var ix: number = item.getb2X();
                        var iy: number = item.getb2Y();
                        g.moveTo(rayPts[s].x - ix - 0.5, rayPts[s].y - iy - 0.5);
                        g.lineTo(rayPts[s + 1].x - ix - 0.5, rayPts[s + 1].y - iy - 0.5);
                    }
                }
                
            }
            if (ddinfo.drawMask & DebugDrawInfo.UNIT_SEPARATION) {
                g.lineStyle(0.03, DebugColors.DC_SEPARATION, DebugColors.DC_SEPARATION_A);
                g.drawCircle(-0.5, -0.5, item.separateRadius);
            }
            if (ddinfo.drawMask & DebugDrawInfo.UNIT_COHESION) {
                g.lineStyle(0.03, DebugColors.DC_COHESION, DebugColors.DC_COHESION_A);
                g.drawCircle(-0.5, -0.5, item.cohesionRadius);
            }
            if (ddinfo.drawMask & DebugDrawInfo.UNIT_ALIGNMENT) {
                g.lineStyle(0.03, DebugColors.DC_ALIGNMENT, DebugColors.DC_ALIGNMENT_A);
                g.drawCircle(-0.5, -0.5, item.alignRadius);
            }
            if (ddinfo.drawMask & DebugDrawInfo.UNIT_WANDER) {
                g.lineStyle(0.03, DebugColors.DC_WANDER, DebugColors.DC_WANDER_A);
                var rxto = - 0.5;
                var ryto = - 0.5;
                g.drawCircle(rxto, ryto, item.wanderRadius);
                var minAng: number = item.velocity.heading() - (item.wanderRatioDeg * .5);
                var addAng: number = item.velocity.heading() + (item.wanderRatioDeg * .5);
                g.moveTo(-.5, -.5);
                g.lineTo(-.5 + Math.cos(minAng) * item.wanderRadius, -.5 + Math.sin(minAng) * item.wanderRadius);
                g.moveTo(-.5, -.5);
                g.lineTo(-.5 + Math.cos(addAng) * item.wanderRadius, -.5 + Math.sin(addAng) * item.wanderRadius);
            }
            if (ddinfo.drawMask & DebugDrawInfo.UNIT_PATH_INFO) {
                if (ddinfo.pathPredict) {
                    g.lineStyle(0.05, DebugColors.DC_PATH_GUIDE, DebugColors.DC_PATH_GUIDE_A);
                    g.drawCircle(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5, 0.05);
                    g.drawCircle(ddinfo.pathNormal.x - .5, ddinfo.pathNormal.y - .5, 0.05);
                    g.moveTo(-.5, -.5);
                    g.lineTo(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5);
                    g.lineTo(ddinfo.pathNormal.x - .5, ddinfo.pathNormal.y - .5);

                    g.drawCircle(ddinfo.pathOnFront.x - .5, ddinfo.pathOnFront.y - .5, 0.1);
                    g.moveTo(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5);
                    g.lineTo(ddinfo.pathOnFront.x - .5, ddinfo.pathOnFront.y - .5);
                    //g.lineStyle(0.2, DebugColors.DC_PATH_GUIDE, DebugColors.DC_PATH_GUIDE_A2);
                }
            }
            if (ddinfo.drawMask & DebugDrawInfo.BOUNDING_BOX) {
                var bbox = item.getBoundingBox();
                g.lineStyle(0.03, DebugColors.DC_QUAD, DebugColors.DC_QUAD_A);
                g.drawRect(bbox.x - item.getb2Position().x - .5, bbox.y - item.getb2Position().y - .5, bbox.w, bbox.h);
            }
            if (ddinfo.drawMask & DebugDrawInfo.AVOID_FORCE) {
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
        }

        public makePolygon(xto: number, yto: number, rto: number, item: item.Polygon, color: number, alpha: number): void {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.clear();
            g.beginFill(color, alpha);
            for (var t: number = 0; t < item.shapeLen; t++) {
                for (var m: number = 0; m < item.shapes[t].m_count; m++) {
                    var vertice = item.shapes[t].m_vertices[m];
                    if (m == 0) {
                        g.moveTo(vertice.x, vertice.y);
                    } else {
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
        }

        public updatePolygon(xto: number, yto: number, rto: number, item: item.Polygon, color: number, alpha: number): void {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.position.x = xto;
            g.position.y = yto;
            g.rotation = rto;
        }

        public makeSensor(xto: number, yto: number, rto: number, item: item.Sensor) {

            var color: number = (item.dynamic) ? DebugColors.DC_SENSOR : DebugColors.DC_SENSOR_STATIC;
            var alpha: number = (item.dynamic) ? DebugColors.DC_SENSOR_A : DebugColors.DC_SENSOR_STATIC_A;
            if (item.shapeType == steer.item.Sensor.SHAPE_BOX) {
                this.makePolygon(xto, yto, rto, item, color, alpha);
            } else {
                this.makeCircle(xto, yto, rto, item, color, alpha);
            }

            var g: PIXI.Graphics = item.pixiDebugItem;
            if (item.forceType == steer.item.Sensor.FORCE_PUSH_CENTER) {
                g.beginFill(0xFFFFFF, .2);
                var v: number = .2;
                //top arrow
                g.moveTo(-v, -v);
                g.lineTo(0, -v * 2);
                g.lineTo(v, -v);
                //left arrow
                g.moveTo(-v, -v);
                g.lineTo(-v * 2, 0);
                g.lineTo(-v, v);
                //right arrow
                g.moveTo(v, -v);
                g.lineTo(v * 2, 0);
                g.lineTo(v, v);
                //bottom arrow
                g.moveTo(-v, v);
                g.lineTo(0, v * 2);
                g.lineTo(v, v);
                g.endFill();
            }
            if (item.forceType == steer.item.Sensor.FORCE_PULL_CENTER) {
                g.beginFill(0xFFFFFF, .2);
                var v: number = .2;
                //top arrow
                g.moveTo(-v, -v * 2);
                g.lineTo(0, -v);
                g.lineTo(v, -v * 2);
                //left arrow
                g.moveTo(-v * 2, -v);
                g.lineTo(-v, 0);
                g.lineTo(-v * 2, v);
                //right arrow
                g.moveTo(v * 2, -v);
                g.lineTo(v, 0);
                g.lineTo(v * 2, v);
                //bottom arrow
                g.moveTo(-v, v * 2);
                g.lineTo(0, v);
                g.lineTo(v, v * 2);
                g.endFill();
            }
            if (item.forceType == steer.item.Sensor.FORCE_PUSH_VECTOR) {
                g.beginFill(0xFFFFFF, .3);
                g.drawCircle(Math.cos(item.forceAngle) * -.15, Math.sin(item.forceAngle) * -.15, 0.05);

                var xto1: number = Math.cos(item.forceAngle + 1.5707) * .2;
                var yto1: number = Math.sin(item.forceAngle + 1.5707) * .2;
                //g.drawCircle(xto1, yto1, 0.05);

                var xto2: number = Math.cos(item.forceAngle) * .35;
                var yto2: number = Math.sin(item.forceAngle) * .35;
                //g.drawCircle(xto2, yto2, 0.05);

                var xto3: number = Math.cos(item.forceAngle - 1.5707) * .2;
                var yto3: number = Math.sin(item.forceAngle - 1.5707) * .2;
                //g.drawCircle(xto3, yto3, 0.05);

                g.endFill();
                g.beginFill(0xFFFFFF, .3);
                g.moveTo(xto1, yto1);
                g.lineTo(xto2, yto2);
                g.lineTo(xto3, yto3);
                g.endFill();

                //g.beginFill(0xFFFFFF, .3);
                //g.moveTo(0, -.1);
                //var xto: number = Math.cos(item.forceAngle + 1.5707) * .2;
                //var yto: number = Math.sin(item.forceAngle + 1.5707) * .2 - .1;
                //g.lineTo(xto, yto);
                //xto = Math.cos(item.forceAngle) * .2;
                //yto = Math.sin(item.forceAngle) * .2 - .1;
                //g.lineTo(xto, yto);
                //xto = Math.cos(item.forceAngle - 1.5707) * .2;
                //yto = Math.sin(item.forceAngle - 1.5707) * .2 - .1;
                //g.lineTo(xto, yto);
                //g.lineTo(0, -.1);
                //g.endFill();
            }
        }

        public makeEdge(xto: number, yto: number, rto: number, item: item.Edge, color: number, alpha: number): void {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.lineStyle(0.03, color, alpha);
            g.position.x = xto - 0.5;
            g.position.y = yto - 0.5;
            g.rotation = rto;
            for (var t: number = 0; t < item.shapeLen; t++) {
                var loopShape: box2d.b2EdgeShape = item.shapes[t];
                g.moveTo(loopShape.m_vertex1.x, loopShape.m_vertex1.y);
                g.lineTo(loopShape.m_vertex2.x, loopShape.m_vertex2.y);
            }
        }

        public makePath(item: item.Path) {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.position.x = 0;
            g.position.y = 0;
            g.lineStyle(0.03, DebugColors.DC_PATH_FILL, DebugColors.DC_PATH_FILL_SA);
            var plen: number = item.segments.length;
            for (var k: number = 0; k < plen; k++) {
                var seg: Vector = item.segments[k];
                g.drawCircle(seg.x - .5, seg.y - .5, 0.05);
            }
            var dlen: number = item.drawInfo.length;
            g.moveTo(item.segments[0].x - .5, item.segments[0].y - .5);
            for (var k: number = 0; k < dlen; k++) {
                var di: item.PathDrawInfo = item.drawInfo[k];
                if (di.type == steer.item.PathDrawInfo.TYPE_LINE) {
                    g.lineTo(di.end.x - .5, di.end.y - .5);
                }
                if (di.type == steer.item.PathDrawInfo.TYPE_BEZIER) {
                    g.bezierCurveTo(di.cp1.x - .5, di.cp1.y - .5, di.cp2.x - .5, di.cp2.y - .5, di.end.x - .5, di.end.y - .5);
                }
            }
            //weird pixi scaled bug, needs to make it decimal
            var iw: number = item.pathWidth + 0.000001;
            g.lineStyle(iw, DebugColors.DC_PATH_FILL, DebugColors.DC_PATH_FILL_A);
            g.moveTo(item.segments[0].x - .5, item.segments[0].y - .5);
            for (var k: number = 0; k < dlen; k++) {
                var di: item.PathDrawInfo = item.drawInfo[k];
                if (di.type == steer.item.PathDrawInfo.TYPE_LINE) {
                    g.lineTo(di.end.x - .5, di.end.y - .5);
                }
                if (di.type == steer.item.PathDrawInfo.TYPE_BEZIER) {
                    g.bezierCurveTo(di.cp1.x - .5, di.cp1.y - .5, di.cp2.x - .5, di.cp2.y - .5, di.end.x - .5, di.end.y - .5);
                }
            }
        }


        public drawGridmap(item: item.GridMap): void {
            var g: PIXI.Graphics = item.pixiDebugItem;
            g.clear();
            g.position.x = item.x;
            g.position.y = item.y;
            g.lineStyle(0.03, DebugColors.DC_GRID, DebugColors.DC_GRID_A);
            for (var y: number = 0; y < item.gridSize.y + 1; y++) {
                var ys: number = item.blockSize.y * y;
                var xto: number = item.gridSize.x * item.blockSize.x;
                g.moveTo(0 - .5, ys - .5);
                g.lineTo(xto - .5, ys - .5);
            }
            for (var x: number = 0; x < item.gridSize.x + 1; x++) {
                var xs: number = item.blockSize.x * x;
                var yto: number = item.gridSize.y * item.blockSize.y;
                g.moveTo(xs - .5, 0 - .5);
                g.lineTo(xs - .5, yto - .5);
            }
            if (item.velocityData) {
                for (var lx: number = 0; lx < item.gridSize.x; lx++) {
                    for (var ly: number = 0; ly < item.gridSize.y; ly++) {
                        if (item.velocityData[lx]) {
                            if (item.velocityData[lx][ly]) {
                                var xpos: number = item.blockSize.x * (lx + 0.5) - .5;
                                var ypos: number = item.blockSize.y * (ly + 0.5) - .5;
                                g.moveTo(xpos, ypos);
                                var dirVec: steer.Vector = item.velocityData[lx][ly].clone().normalize();
                                var dirDrawX: number = dirVec.x * item.blockSize.x * .4;
                                var dirDrawY: number = dirVec.y * item.blockSize.y * .4;
                                g.lineTo(xpos + dirDrawX, ypos + dirDrawY);
                            }
                        }
                    }
                }
            }
            if (item.pathData) {
                g.lineStyle(0, 0x000000, 0);
                for (var lx: number = 0; lx < item.gridSize.x; lx++) {
                    for (var ly: number = 0; ly < item.gridSize.y; ly++) {
                        if (!item.pathData.isWalkableAt(lx, ly)) {
                            var xpos: number = item.blockSize.x * lx;
                            var ypos: number = item.blockSize.y * ly;
                            g.beginFill(DebugColors.DC_GRID_BLOCK, DebugColors.DC_GRID_BLOCK_A);
                            g.drawRect(xpos, ypos, item.blockSize.x, item.blockSize.y);
                            g.endFill();
                        }
                    }
                }
            }
        }
        public drawDot(position: any, color: number, radius: number= 0.03, alpha: number= 1): void {
            var g: PIXI.Graphics = this.guideGrahpic;
            //g.beginFill(color, alpha);
            g.lineStyle(0.03, color, alpha);
            g.drawCircle(position.x - 0.5, position.y - 0.5, radius);
            g.endFill();
        }
        public drawSegment(fromPos: any, toPos: any, color: number, width: number= 0.03, alpha: number= 1): void {
            var g: PIXI.Graphics = this.guideGrahpic;
            g.lineStyle(width, color, alpha);
            g.moveTo(fromPos.x - 0.5, fromPos.y - 0.5);
            g.lineTo(toPos.x - 0.5, toPos.y - 0.5);
        }
        public drawRectangle(x: number, y: number, w: number, h: number, color: number, alpha: number): void {
            var g: PIXI.Graphics = this.guideGrahpic;
            g.lineStyle(0.03, color, alpha);
            g.drawRect(x - .5, y - .5, w, h);
            g.endFill();
        }
        public drawQuadTree(): void {
            this.quadGraphic.clear();
            if (this.domain.selector.rootNode) {
                this.drawTreeNode(this.domain.selector.rootNode);
            }
        }
        private drawTreeNode(targetNode: steer.item.QuadNode): void {
            if (targetNode.nodes.length > 0) {
                for (var i = 0; i < targetNode.nodes.length; i++) {
                    this.drawTreeNode(targetNode.nodes[i]);
                }
            }
            var g: PIXI.Graphics = this.quadGraphic;
            g.lineStyle(0.03, DebugColors.DC_QUAD, DebugColors.DC_QUAD_A);
            g.drawRect(targetNode.x - .5, targetNode.y - .5, targetNode.width, targetNode.height);
        }

    }

} 
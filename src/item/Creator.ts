module steer.item {

    export class Creator {

        public static pixelCreateFormat: boolean = true;

        public static domain: Domain;

        public static cloneObject(source): any {
            if (Object.prototype.toString.call(source) === '[object Array]') {
                var clone: any = [];
                for (var i = 0; i < source.length; i++) {
                    clone[i] = Creator.cloneObject(source[i]);
                }
                return clone;
            } else if (typeof (source) == "object") {
                var clone: any = {};
                for (var prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        clone[prop] = Creator.cloneObject(source[prop]);
                    }
                }
                return clone;
            } else {
                return source;
            }
        }

        public static setDomainReference(domain: Domain): void {
            Creator.domain = domain;
        }

        public static createInfoCheckDefault(createInfo: CreateInfo): CreateInfo {
            var copyInfo: CreateInfo = Creator.cloneObject(createInfo);
            if (copyInfo.x == null) copyInfo.x = 0;
            if (copyInfo.y == null) copyInfo.y = 0;
            if (copyInfo.dynamic == null) copyInfo.dynamic = false;
            if (Creator.pixelCreateFormat) {
                if (copyInfo.x) copyInfo.x /= 30;
                if (copyInfo.y) copyInfo.y /= 30;
                if (copyInfo.radius) copyInfo.radius /= 30;
                if (copyInfo.widthHalf) copyInfo.widthHalf /= 30;
                if (copyInfo.heightHalf) copyInfo.heightHalf /= 30;
                if (copyInfo.maxSpeed) copyInfo.maxSpeed /= 30;
                if (copyInfo.maxForce) copyInfo.maxForce /= 30;
                if (copyInfo.blockSize) copyInfo.blockSize = new Vector(copyInfo.blockSize.x / 30, copyInfo.blockSize.y / 30);
            }
            //convert from steer.vector to box2d.b2vec2
            if (createInfo.vertices) {
                copyInfo.vertices = [];
                var ptLen: number = createInfo.vertices.length;
                for (var k: number = 0; k < ptLen; k++) {
                    if (Creator.pixelCreateFormat) {
                        copyInfo.vertices.push(new box2d.b2Vec2(createInfo.vertices[k].x / 30, createInfo.vertices[k].y / 30));
                    } else {
                        copyInfo.vertices.push(new box2d.b2Vec2(createInfo.vertices[k].x, createInfo.vertices[k].y));
                    }
                }
            }
            return copyInfo;
        }

        public static createFixtureDef(): box2d.b2FixtureDef {
            var fixDef: any = new box2d.b2FixtureDef();
            fixDef.density = 1;
            fixDef.friction = 0;
            fixDef.restitution = 0;
            return fixDef;
        }

        public static createCircle(createInfo: CreateInfo): Circle {

            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);
            if (cinfo.radius == null) console.error("createCircle CreateInfo radius is null");


            //create body from bodyDef
            var ballDef: any = new box2d.b2BodyDef();
            ballDef.type = box2d.b2BodyType.b2_staticBody;
            if (cinfo.dynamic) ballDef.type = box2d.b2BodyType.b2_dynamicBody;
            ballDef.position.SetXY(cinfo.x, cinfo.y);
            var b2BodyNew = Creator.domain.b2World.CreateBody(ballDef);

            //create fixture and add shape to it
            var cirleShape = new box2d.b2CircleShape();
            cirleShape.m_radius = cinfo.radius;
            var fixDef: box2d.b2FixtureDef = Creator.createFixtureDef();
            fixDef.filter.categoryBits = ItemEntity.FILTER_STATIC | ItemEntity.FILTER_UNIT;
            fixDef.shape = cirleShape;
            b2BodyNew.CreateFixture(fixDef);

            var newCircle: Circle = new Circle(b2BodyNew, cinfo.radius, cinfo.name);
            newCircle.domain = Creator.domain;
            newCircle.dynamic = (cinfo.dynamic == true);
            b2BodyNew.SetUserData({ name: newCircle.name, entity: newCircle });
            Creator.domain.items.add(newCircle);

            return newCircle;

        }

        public static createUnit(createInfo: CreateInfo): Unit {

            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);
            if (cinfo.radius == null) console.error("createCircle CreateInfo radius null");
            if (cinfo.maxSpeed == null) console.error("createCircle CreateInfo maxSpeed null");
            if (cinfo.maxForce == null) console.error("createUnit CreateInfo maxForce null");

            //create body from bodyDef
            var ballDef: any = new box2d.b2BodyDef();
            ballDef.type = box2d.b2BodyType.b2_dynamicBody;
            if (cinfo.dynamic == false) ballDef.type = box2d.b2BodyType.b2_staticBody;
            ballDef.position.SetXY(cinfo.x, cinfo.y);
            ballDef.fixedRotation = true;
            var b2BodyNew = Creator.domain.b2World.CreateBody(ballDef);

            //create fixture and add shape to it
            var cirleShape = new box2d.b2CircleShape();
            cirleShape.m_radius = cinfo.radius;
            var fixDef: box2d.b2FixtureDef = Creator.createFixtureDef();
            fixDef.shape = cirleShape;
            fixDef.filter.categoryBits = ItemEntity.FILTER_UNIT;
            if (createInfo.canCollide == false) fixDef.filter.maskBits = ItemEntity.FILTER_STATIC;
            b2BodyNew.CreateFixture(fixDef);
            b2BodyNew.SetBullet(true);

            var newUnit: Unit = new Unit(b2BodyNew, cinfo.radius, cinfo.maxSpeed, cinfo.maxForce, cinfo.name);
            newUnit.domain = Creator.domain;
            newUnit.dynamic = (cinfo.dynamic == true);
            b2BodyNew.SetUserData({ name: newUnit.name, entity: newUnit });
            Creator.domain.items.add(newUnit);

            return newUnit;

        }

        public static createPolygon(createInfo: CreateInfo): Polygon {

            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);
            if (cinfo.dynamic == null) cinfo.dynamic = false;

            var boxDef: any = new box2d.b2BodyDef();
            boxDef.type = box2d.b2BodyType.b2_staticBody;
            if (cinfo.dynamic) boxDef.type = box2d.b2BodyType.b2_dynamicBody;

            var polygonShape = new box2d.b2PolygonShape();

            //create polygon as Box
            if (cinfo.asBoxCenter) {

                if (cinfo.widthHalf == null) console.error("createPolygon asBox widthHalf is null");
                if (cinfo.heightHalf == null) console.error("createPolygon asBox heightHalf is null");
                var xto: number = (cinfo.asBoxTopLeft) ? cinfo.x + cinfo.widthHalf : cinfo.x;
                var yto: number = (cinfo.asBoxTopLeft) ? cinfo.y + cinfo.heightHalf : cinfo.y;

                boxDef.position.SetXY(xto, yto);
                var b2BodyNew = Creator.domain.b2World.CreateBody(boxDef);
                polygonShape.SetAsBox(cinfo.widthHalf, cinfo.heightHalf);

            }

            if (cinfo.asPolygon) {

                if (cinfo.vertices == null) {
                    console.error("createPolygon asPolygon vertices is null");
                } else if (cinfo.vertices.length < 3) {
                    console.error("createPolygon asPolygon vertices less then 3");
                }

                boxDef.position.SetXY(cinfo.x, cinfo.y);
                var b2BodyNew = Creator.domain.b2World.CreateBody(boxDef);
                polygonShape.Set(cinfo.vertices, cinfo.vertices.length);
            }

            var fixDef: box2d.b2FixtureDef = Creator.createFixtureDef();
            fixDef.filter.categoryBits = ItemEntity.FILTER_STATIC | ItemEntity.FILTER_UNIT;
            fixDef.shape = polygonShape;
            b2BodyNew.CreateFixture(fixDef);
            b2BodyNew.SetAngularDamping(10);
            b2BodyNew.SetLinearDamping(10);
            var newPolygon: Polygon = new Polygon(b2BodyNew, cinfo.name);
            newPolygon.dynamic = (cinfo.dynamic == true);
            b2BodyNew.SetUserData({ name: newPolygon.name, entity: newPolygon });
            Creator.domain.items.add(newPolygon);
            return newPolygon;

            //fixDef.filter.categoryBits = ItemEntity.FILTER_UNIT;

            return null;

        }

        public static createPolygonBorder(createInfo: CreateInfo): Polygon[] {

            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);

            if (cinfo.asPolygonBorder) {

                if (cinfo.polygonBorderWidth == null || cinfo.polygonBorderTL == null || cinfo.polygonBorderBR == null) {
                    console.error("createPolygon asPolygonBorder polygonBorderWidth and polygonBorderTL and polygonBorderBR must be set");
                }

                //top one location
                var b: number = cinfo.polygonBorderWidth;
                var halfb: number = cinfo.polygonBorderWidth * .5;
                var sx: number = cinfo.polygonBorderTL.x;
                var sy: number = cinfo.polygonBorderTL.y;
                var ex: number = cinfo.polygonBorderBR.x;
                var ey: number = cinfo.polygonBorderBR.y;
                var w: number = (ex - sx) * .5;
                var h: number = (ey - sy) * .5;
                if (cinfo.polygonBorderInside) {
                    var topInfo: steer.item.CreateInfo = { x: sx, y: sy, widthHalf: w, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var topPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(topInfo);
                    var btmInfo: steer.item.CreateInfo = { x: sx, y: ey - b, widthHalf: w, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var bottomPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(btmInfo);
                    var leftInfo: steer.item.CreateInfo = { x: sx, y: sy + b, widthHalf: halfb, heightHalf: h - b, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var leftPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(leftInfo);
                    var rightInfo: steer.item.CreateInfo = { x: ex - b, y: sy + b, widthHalf: halfb, heightHalf: h - b, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var rightPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(rightInfo);
                    return [topPolygon, rightPolygon, bottomPolygon, leftPolygon];
                } else {
                    var topInfo: steer.item.CreateInfo = { x: sx - b, y: sy - b, widthHalf: w + b, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var topPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(topInfo);
                    var btmInfo: steer.item.CreateInfo = { x: sx - b, y: ey, widthHalf: w + b, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var bottomPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(btmInfo);
                    var leftInfo: steer.item.CreateInfo = { x: sx - b, y: sy, widthHalf: halfb, heightHalf: h, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var leftPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(leftInfo);
                    var rightInfo: steer.item.CreateInfo = { x: ex, y: sy, widthHalf: halfb, heightHalf: h, asBoxCenter: true, asBoxTopLeft: true, properties: ~ItemEntity.DYNAMIC };
                    var rightPolygon: steer.item.Polygon = steer.item.Creator.createPolygon(rightInfo);
                    return [topPolygon, rightPolygon, bottomPolygon, leftPolygon];
                }
            }

        }

        public static createEdge(createInfo: CreateInfo): Edge {

            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);
            cinfo.dynamic = false;

            var bodyDef: any = new box2d.b2BodyDef();
            bodyDef.type = box2d.b2BodyType.b2_staticBody;
            bodyDef.position.SetXY(cinfo.x, cinfo.y);
            var b2BodyNew = Creator.domain.b2World.CreateBody(bodyDef);

            //create fixture and add all edge shapes
            var fixDef: box2d.b2FixtureDef = Creator.createFixtureDef();
            var edgeShape = new box2d.b2EdgeShape();
            fixDef.shape = edgeShape;
            fixDef.filter.categoryBits = ItemEntity.FILTER_STATIC | ItemEntity.FILTER_UNIT;

            for (var k: number = 0; k + 1 < cinfo.vertices.length; k++) {
                edgeShape.Set(cinfo.vertices[k], cinfo.vertices[k + 1]);
                b2BodyNew.CreateFixture(fixDef);
            }

            var newEdge: Edge = new Edge(b2BodyNew, cinfo.name);
            newEdge.domain = Creator.domain;
            newEdge.dynamic = false;
            b2BodyNew.SetUserData({ name: newEdge.name, entity: newEdge });
            Creator.domain.items.add(newEdge);

            return newEdge;

        }

        //autoItems
        public static createSensorArea(createInfo: CreateInfo): Sensor {

            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);

            var bodyDef: any = new box2d.b2BodyDef();
            bodyDef.type = box2d.b2BodyType.b2_staticBody;
            var fixDef: box2d.b2FixtureDef = Creator.createFixtureDef();
            fixDef.isSensor = true;

            if (cinfo.asCircle) {
                if (cinfo.radius == null) console.error("createSensorArea asCircle radius null");
                bodyDef.position.SetXY(cinfo.x, cinfo.y);
                var b2Body = Creator.domain.b2World.CreateBody(bodyDef);
                var cirleShape = new box2d.b2CircleShape();
                cirleShape.m_radius = cinfo.radius;
                fixDef.shape = cirleShape;
            }

            if (cinfo.asBoxCenter) {
                if (cinfo.heightHalf == null || cinfo.widthHalf == null) console.error("createSensorArea asBox heightHalf or widthHalf null");
                var xto: number = (cinfo.asBoxTopLeft) ? cinfo.x + cinfo.widthHalf : cinfo.x;
                var yto: number = (cinfo.asBoxTopLeft) ? cinfo.y + cinfo.heightHalf : cinfo.y;
                bodyDef.position.SetXY(xto, yto);
                var b2Body = Creator.domain.b2World.CreateBody(bodyDef);
                var polygonShape = new box2d.b2PolygonShape();
                polygonShape.SetAsBox(cinfo.widthHalf, cinfo.heightHalf);
                fixDef.shape = polygonShape;
            }

            b2Body.CreateFixture(fixDef);
            var newSensor: Sensor = new Sensor(b2Body, cinfo.name);
            if (cinfo.asBoxCenter) {
                newSensor.shapeType = Sensor.SHAPE_BOX;
            } else {
                newSensor.shapeType = Sensor.SHAPE_CIRCLE;
                newSensor.radius = cinfo.radius;
            }
            newSensor.dynamic = cinfo.dynamic;
            newSensor.shapeType = (cinfo.asBoxCenter) ? Sensor.SHAPE_BOX : Sensor.SHAPE_CIRCLE;
            b2Body.SetUserData({ name: newSensor.name, entity: newSensor });
            Creator.domain.autoItems.add(newSensor);
            return newSensor;

        }

        //gridmaps
        public static createGridmap(createInfo: CreateInfo): GridMap {
            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);
            var errors: string[] = Creator.checkRequireInfos(createInfo, "x,y,blockSize,gridSize");
            if (errors.length > 0) {
                console.error("createGridmap missing properties: " + errors.join(","));
                return;
            }
            var gridmap: GridMap = new GridMap(cinfo.x, cinfo.y, cinfo.blockSize, cinfo.gridSize, cinfo.name);
            Creator.domain.gridMaps.add(gridmap);
            return gridmap;
        }

        public static createPath(createInfo: CreateInfo): Path {
            if (!Creator.domain) console.error("Creator Domain reference not found!");
            var cinfo: CreateInfo = Creator.createInfoCheckDefault(createInfo);
            var errors: string[] = Creator.checkRequireInfos(createInfo, "pathInfo");
            if (errors.length > 0) {
                console.error("createBezierPath missing properties: " + errors.join(","));
                return;
            }
            var path: Path = PathInfo.createPath(cinfo.pathInfo, Creator.pixelCreateFormat);
            Creator.domain.items.add(path);
            return path;
        }

        private static checkRequireInfos(createInfo: CreateInfo, list: string): string[] {
            var lists: string[] = list.split(",");
            var len: number = lists.length;
            var errors: string[] = [];
            for (var s: number = 0; s < len; s++) {
                if (createInfo[lists[s]] == null) errors.push(lists[s]);
            }
            return errors;
        }

    }

}

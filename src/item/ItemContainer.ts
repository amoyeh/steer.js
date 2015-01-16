module steer.item {

    export interface CreateInfo {
        x?: number;
        y?: number;
        name?: string;
        maxSpeed?: number;
        maxForce?: number;
        radius?: number;
        widthHalf?: number;
        heightHalf?: number;
        asBoxCenter?: boolean;
        asBoxTopLeft?: boolean;
        asPolygon?: boolean;
        asEdge?: boolean;
        asPolygonBorder?: boolean;
        polygonBorderWidth?: number;
        polygonBorderTL?: Vector;
        polygonBorderBR?: Vector;
        polygonBorderInside?: boolean;
        pathWidth?: number;
        dynamic?: boolean;
        canCollide?: boolean;
        vertices?: any[]; //used when creating shapes
        asCircle?: boolean;
        sensorForce?: steer.Vector;
        sensorForceType?: number;
        blockSize?: steer.Vector;
        gridSize?: steer.Vector;
        pathInfo?: PathInfo;
    }

    export class ItemBase {

        //automatic id counter for every item types
        private static uniqueNameCounters: { [type: string]: number } = {};
        private static addCounter(type: string): string {
            if (ItemBase.uniqueNameCounters[type] == null) ItemBase.uniqueNameCounters[type] = 0;
            ItemBase.uniqueNameCounters[type]++;
            return ItemBase.uniqueNameCounters[type].toString(36);
        }

        name: string;
        type: string;
        domain: Domain;

        constructor(name?: string) {
            //use object class name as the type string & counter key name
            var objectName: string = this.constructor["name"];
            if (name == null) name = objectName + "_" + ItemBase.addCounter(objectName);
            this.name = name;
            this.type = objectName;
        }

        //override at child
        public remove(): void { }

    }

    export class ItemEntity extends ItemBase {

        //bitwise properties
        public static NO_UNIT_COLLIDE: number = 1;
        public static DYNAMIC: number = 2;

        public static FILTER_UNIT: number = 1;
        public static FILTER_STATIC: number = 2;

        public b2body: box2d.b2Body;

        //intergration
        public lastPosition: box2d.b2Vec2;
        public diffPosition: box2d.b2Vec2;
        public lastRotation: number;
        public diffRotation: number;

        public dynamic: boolean;

        public pixiDebugItem: any;
        public threeDebugItem: any;

        constructor(b2body: box2d.b2Body, name?: string) {
            super(name);
            this.b2body = b2body;
            this.diffPosition = new box2d.b2Vec2(0, 0);
            this.diffRotation = 0;
        }

        public getb2X(): number {
            return this.b2body.GetPosition().x;
        }
        public getb2Y(): number {
            return this.b2body.GetPosition().y;
        }
        public getPixelX(): number {
            return this.b2body.GetPosition().x * 30;
        }
        public getPixelY(): number {
            return this.b2body.GetPosition().y * 30;
        }
        public getb2Position(): Vector {
            return new Vector(this.b2body.GetPosition().x, this.b2body.GetPosition().y);
        }
        public getSteerPosition(): Vector {
            return new Vector(this.b2body.GetPosition().x * 30, this.b2body.GetPosition().y * 30);
        }
        public setb2Position(x: number, y: number): void {
            this.b2body.SetPosition(new box2d.b2Vec2(x, y));
        }
        public setSteerPosition(x: number, y: number): void {
            this.b2body.SetPosition(new box2d.b2Vec2(x / 30, y / 30));
        }
        public updateBeforeStep(): void {
            if (this.dynamic) {
                this.lastPosition = this.b2body.GetPosition().Clone();
                this.lastRotation = this.b2body.GetAngle();
            }
        }
        public updateAfterStep(): void {
            if (this.dynamic) {
                var diffx: number = (this.b2body.GetPosition().x - this.lastPosition.x);
                var diffy: number = (this.b2body.GetPosition().y - this.lastPosition.y);
                this.diffPosition = new box2d.b2Vec2(diffx, diffy);
                this.diffRotation = this.b2body.GetAngle() - this.lastRotation;
            }
        }
        public setDynamic(isDynamic: boolean): void {
            if (this.b2body) {
                if (this.b2body.GetType() === box2d.b2BodyType.b2_dynamicBody) {
                    this.b2body.SetType(box2d.b2BodyType.b2_staticBody);
                } else if (this.b2body.GetType() === box2d.b2BodyType.b2_staticBody) {
                    this.b2body.SetType(box2d.b2BodyType.b2_dynamicBody);
                }
                this.dynamic = isDynamic;
            }
        }

        public setCollisionMask(maskBits: number): void {
            var fixture: box2d.b2Fixture = this.b2body.GetFixtureList();
            while (fixture != null) {
                var b2Filter = fixture.GetFilterData();
                b2Filter.maskBits = maskBits;
                fixture.SetFilterData(b2Filter);
                fixture = fixture.GetNext();
            }
        }

        public setBodyAngle(radian: number, toDegree: boolean = true): void {
            if (this.b2body) {
                if (toDegree) {
                    this.b2body.SetTransformVecRadians(this.b2body.GetPosition(), MathUtil.radian(radian));
                } else {
                    this.b2body.SetTransformVecRadians(this.b2body.GetPosition(), radian);
                }
            }
        }

        public getBoundingBox(): { x: number; y: number; w: number; h: number } {
            if (this.b2body) {
                var bodyAABB:any = new box2d.b2AABB();
                bodyAABB.lowerBound = new box2d.b2Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
                bodyAABB.upperBound = new box2d.b2Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
                for (var f = this.b2body.GetFixtureList(); f; f = f.GetNext()) {
                    var shape: any = f.GetShape();
                    for (var c: number = 0; c < shape.GetChildCount(); c++) {
                        bodyAABB.Combine1(f.GetAABB(c));
                    }
                }
                var tx: number = bodyAABB.lowerBound.x;
                var ty: number = bodyAABB.lowerBound.y;
                var tw: number = bodyAABB.upperBound.x - tx;
                var th: number = bodyAABB.upperBound.y - ty;
                return { x: tx, y: ty, w: tw, h: th };
            }
            return null;
        }

        //remove items from display renderer and box2d world
        public remove(): void {
            if (this.pixiDebugItem) {
                this.pixiDebugItem.clear();
                this.pixiDebugItem.stage.removeChild(this.pixiDebugItem);
                this.pixiDebugItem.parent.removeChild(this.pixiDebugItem);
                this.pixiDebugItem.removeStageReference();
                this.pixiDebugItem = undefined;
            }
            if (this.b2body) {
                this.b2body.SetUserData(undefined);
                this.b2body.GetWorld().DestroyBody(this.b2body);
                this.b2body = undefined;
            }
            if (this.threeDebugItem) {
            }
            this.domain = undefined;
        }

    }

    export class ItemDatas {

        public itemList: ItemBase[];
        public itemDict: Object;

        constructor() {
            this.itemList = [];
            this.itemDict = [];
        }

        add(item: ItemBase): void {
            if (this.exist(item)) {
                console.error("item name exist: " + item.name);
            } else {
                this.itemDict[item.name] = item;
                this.itemList.push(item);
            }
        }

        public getItem(name: string): ItemBase {
            return this.itemDict[name];
        }

        remove(item: any): void {
            var target: ItemBase;
            if (typeof item == "string") {
                target = this.itemDict[item];
            } else {
                target = item;
            }
            if (this.exist(target)) {
                delete this.itemDict[target.name];
                var itemLength = this.itemList.length;
                while (itemLength--) {
                    if (this.itemList[itemLength] === target) {
                        this.itemList.splice(itemLength, 1);
                        break;
                    }
                }
            }
        }

        exist(item: any): boolean {
            if (typeof item == "string") {
                //parameter is string name
                return (this.itemDict[item] != null);
            } else {
                //parameter is item object
                return (this.itemDict[item.name] != null);
            }
        }

        each(callBack: Function, itemType?: string) {
            if (itemType) {
                //trim itemType
                var itemTypeData: string[] = itemType.split(",");
                var typeLen: number = itemTypeData.length;
                while (typeLen--) itemTypeData[typeLen] = itemTypeData[typeLen].trim();
                var itemLength = this.itemList.length;
                while (itemLength--) {
                    if (itemTypeData.indexOf(this.itemList[itemLength].type) > -1) {
                        callBack(this.itemList[itemLength]);
                    }
                }
            } else {
                var itemLength = this.itemList.length;
                while (itemLength--) {
                    callBack(this.itemList[itemLength]);
                }
            }
        }

        getList(itemType?: string): ItemBase[] {
            var result: ItemBase[] = [];
            if (itemType) {
                //trim itemType
                var itemTypeData: string[] = itemType.split(",");
                var typeLen: number = itemTypeData.length;
                while (typeLen--) itemTypeData[typeLen] = itemTypeData[typeLen].trim();
                var itemLength = this.itemList.length;
                while (itemLength--) {
                    if (itemTypeData.indexOf(this.itemList[itemLength].type) > -1) {
                        result.push(this.itemList[itemLength]);
                    }
                }
            } else {
                result = this.itemList.concat(result);
            }
            return result;
        }
    }
} 
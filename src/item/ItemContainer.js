var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var steer;
(function (steer) {
    var item;
    (function (_item) {
        var ItemBase = (function () {
            function ItemBase(name) {
                var objectName = this.constructor["name"];
                if (name == null)
                    name = objectName + "_" + ItemBase.addCounter(objectName);
                this.name = name;
                this.type = objectName;
            }
            ItemBase.addCounter = function (type) {
                if (ItemBase.uniqueNameCounters[type] == null)
                    ItemBase.uniqueNameCounters[type] = 0;
                ItemBase.uniqueNameCounters[type]++;
                return ItemBase.uniqueNameCounters[type].toString(36);
            };
            ItemBase.prototype.remove = function () {
            };
            ItemBase.uniqueNameCounters = {};
            return ItemBase;
        })();
        _item.ItemBase = ItemBase;
        var ItemEntity = (function (_super) {
            __extends(ItemEntity, _super);
            function ItemEntity(b2body, name) {
                _super.call(this, name);
                this.b2body = b2body;
                this.diffPosition = new box2d.b2Vec2(0, 0);
                this.diffRotation = 0;
            }
            ItemEntity.prototype.getb2X = function () {
                return this.b2body.GetPosition().x;
            };
            ItemEntity.prototype.getb2Y = function () {
                return this.b2body.GetPosition().y;
            };
            ItemEntity.prototype.getPixelX = function () {
                return this.b2body.GetPosition().x * 30;
            };
            ItemEntity.prototype.getPixelY = function () {
                return this.b2body.GetPosition().y * 30;
            };
            ItemEntity.prototype.getb2Position = function () {
                return new steer.Vector(this.b2body.GetPosition().x, this.b2body.GetPosition().y);
            };
            ItemEntity.prototype.getSteerPosition = function () {
                return new steer.Vector(this.b2body.GetPosition().x * 30, this.b2body.GetPosition().y * 30);
            };
            ItemEntity.prototype.setb2Position = function (x, y) {
                this.b2body.SetPosition(new box2d.b2Vec2(x, y));
            };
            ItemEntity.prototype.setSteerPosition = function (x, y) {
                this.b2body.SetPosition(new box2d.b2Vec2(x / 30, y / 30));
            };
            ItemEntity.prototype.updateBeforeStep = function () {
                if (this.dynamic) {
                    this.lastPosition = this.b2body.GetPosition().Clone();
                    this.lastRotation = this.b2body.GetAngle();
                }
            };
            ItemEntity.prototype.updateAfterStep = function () {
                if (this.dynamic) {
                    var diffx = (this.b2body.GetPosition().x - this.lastPosition.x);
                    var diffy = (this.b2body.GetPosition().y - this.lastPosition.y);
                    this.diffPosition = new box2d.b2Vec2(diffx, diffy);
                    this.diffRotation = this.b2body.GetAngle() - this.lastRotation;
                }
            };
            ItemEntity.prototype.setDynamic = function (isDynamic) {
                if (this.b2body) {
                    if (this.b2body.GetType() === box2d.b2BodyType.b2_dynamicBody) {
                        this.b2body.SetType(box2d.b2BodyType.b2_staticBody);
                    }
                    else if (this.b2body.GetType() === box2d.b2BodyType.b2_staticBody) {
                        this.b2body.SetType(box2d.b2BodyType.b2_dynamicBody);
                    }
                    this.dynamic = isDynamic;
                }
            };
            ItemEntity.prototype.setCollisionMask = function (maskBits) {
                var fixture = this.b2body.GetFixtureList();
                while (fixture != null) {
                    var b2Filter = fixture.GetFilterData();
                    b2Filter.maskBits = maskBits;
                    fixture.SetFilterData(b2Filter);
                    fixture = fixture.GetNext();
                }
            };
            ItemEntity.prototype.setBodyAngle = function (radian, toDegree) {
                if (toDegree === void 0) { toDegree = true; }
                if (this.b2body) {
                    if (toDegree) {
                        this.b2body.SetTransformVecRadians(this.b2body.GetPosition(), steer.MathUtil.radian(radian));
                    }
                    else {
                        this.b2body.SetTransformVecRadians(this.b2body.GetPosition(), radian);
                    }
                }
            };
            ItemEntity.prototype.getBoundingBox = function () {
                if (this.b2body) {
                    var bodyAABB = new box2d.b2AABB();
                    bodyAABB.lowerBound = new box2d.b2Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
                    bodyAABB.upperBound = new box2d.b2Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
                    for (var f = this.b2body.GetFixtureList(); f; f = f.GetNext()) {
                        var shape = f.GetShape();
                        for (var c = 0; c < shape.GetChildCount(); c++) {
                            bodyAABB.Combine1(f.GetAABB(c));
                        }
                    }
                    var tx = bodyAABB.lowerBound.x;
                    var ty = bodyAABB.lowerBound.y;
                    var tw = bodyAABB.upperBound.x - tx;
                    var th = bodyAABB.upperBound.y - ty;
                    return { x: tx, y: ty, w: tw, h: th };
                }
                return null;
            };
            ItemEntity.prototype.remove = function () {
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
            };
            ItemEntity.NO_UNIT_COLLIDE = 1;
            ItemEntity.DYNAMIC = 2;
            ItemEntity.FILTER_UNIT = 1;
            ItemEntity.FILTER_STATIC = 2;
            return ItemEntity;
        })(ItemBase);
        _item.ItemEntity = ItemEntity;
        var ItemDatas = (function () {
            function ItemDatas() {
                this.itemList = [];
                this.itemDict = [];
            }
            ItemDatas.prototype.add = function (item) {
                if (this.exist(item)) {
                    console.error("item name exist: " + item.name);
                }
                else {
                    this.itemDict[item.name] = item;
                    this.itemList.push(item);
                }
            };
            ItemDatas.prototype.getItem = function (name) {
                return this.itemDict[name];
            };
            ItemDatas.prototype.remove = function (item) {
                var target;
                if (typeof item == "string") {
                    target = this.itemDict[item];
                }
                else {
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
            };
            ItemDatas.prototype.exist = function (item) {
                if (typeof item == "string") {
                    return (this.itemDict[item] != null);
                }
                else {
                    return (this.itemDict[item.name] != null);
                }
            };
            ItemDatas.prototype.each = function (callBack, itemType) {
                if (itemType) {
                    var itemTypeData = itemType.split(",");
                    var typeLen = itemTypeData.length;
                    while (typeLen--)
                        itemTypeData[typeLen] = itemTypeData[typeLen].trim();
                    var itemLength = this.itemList.length;
                    while (itemLength--) {
                        if (itemTypeData.indexOf(this.itemList[itemLength].type) > -1) {
                            callBack(this.itemList[itemLength]);
                        }
                    }
                }
                else {
                    var itemLength = this.itemList.length;
                    while (itemLength--) {
                        callBack(this.itemList[itemLength]);
                    }
                }
            };
            ItemDatas.prototype.getList = function (itemType) {
                var result = [];
                if (itemType) {
                    var itemTypeData = itemType.split(",");
                    var typeLen = itemTypeData.length;
                    while (typeLen--)
                        itemTypeData[typeLen] = itemTypeData[typeLen].trim();
                    var itemLength = this.itemList.length;
                    while (itemLength--) {
                        if (itemTypeData.indexOf(this.itemList[itemLength].type) > -1) {
                            result.push(this.itemList[itemLength]);
                        }
                    }
                }
                else {
                    result = this.itemList.concat(result);
                }
                return result;
            };
            return ItemDatas;
        })();
        _item.ItemDatas = ItemDatas;
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

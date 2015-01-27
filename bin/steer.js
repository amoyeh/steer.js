var steer;
(function (steer) {
    var Event = (function () {
        function Event(type, target, values) {
            this.type = type;
            if (target)
                this.target = target;
            if (values)
                this.values = values;
        }
        Event.prototype.toString = function () {
            return "[event] type: " + this.type + " target: " + this.target + " values: " + this.values;
        };
        Event.LOGIC_UPDATE = "logicUpdate";

        Event.RENDER_UPDATE = "renderUpdate";

        Event.RENDER = "render";

        Event.RESIZE = "resize";
        return Event;
    })();
    steer.Event = Event;

    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.callBacks = [];
        }
        EventDispatcher.prototype.addEvent = function (type, func) {
            if (this.callBacks[type] == null) {
                this.callBacks[type] = [];
            }
            this.callBacks[type].push({ func: func });
        };
        EventDispatcher.prototype.removeEvent = function (type, func) {
            if (this.callBacks[type] != null) {
                var callbackLen = this.callBacks[type].length;
                for (var k = 0; k < callbackLen; k++) {
                    if (this.callBacks[type][k].func === func) {
                        this.callBacks[type].splice(k, 1);
                        break;
                    }
                }
            }
        };
        EventDispatcher.prototype.fireEvent = function (event) {
            if (this.callBacks[event.type] != null) {
                var callbackLen = this.callBacks[event.type].length;
                for (var k = 0; k < callbackLen; k++) {
                    this.callBacks[event.type][k].func(event);
                }
            }
        };
        return EventDispatcher;
    })();
    steer.EventDispatcher = EventDispatcher;
})(steer || (steer = {}));
var steer;
(function (steer) {
    var MathUtil = (function () {
        function MathUtil() {
        }
        MathUtil.getElementPosition = function (element) {
            var elem = element, tagname = "", x = 0, y = 0;
            while ((typeof (elem) == "object") && (typeof (elem.tagName) != "undefined")) {
                y += elem.offsetTop;
                x += elem.offsetLeft;
                tagname = elem.tagName.toUpperCase();
                if (tagname == "BODY")
                    elem = 0;
                if (typeof (elem) == "object") {
                    if (typeof (elem.offsetParent) == "object")
                        elem = elem.offsetParent;
                }
            }
            return { x: x, y: y };
        };

        MathUtil.dist = function (x1, y1, x2, y2) {
            var dx = x2 - x1;
            var dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        };

        MathUtil.isPointOnWall = function (sx, sy, ex, ey, checkX, checkY) {
            var dist1 = MathUtil.dist(sx, sy, checkX, checkY);
            var dist2 = MathUtil.dist(checkX, checkY, ex, ey);
            var dist3 = MathUtil.dist(sx, sy, ex, ey);
            return ((dist1 + dist2) == dist3);
        };
        MathUtil.range = function (min, max, round) {
            if (typeof round === "undefined") { round = true; }
            if (round) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
                return Math.random() * (max - min) + min;
            }
        };
        MathUtil.degree = function (value) {
            return value / MathUtil.ONED;
        };

        MathUtil.radian = function (value) {
            return value * MathUtil.ONED;
        };

        MathUtil.rgbToHex = function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };

        MathUtil.hexToRgb = function (hex) {
            if (!isNaN(hex)) {
                hex = "#" + hex.toString(16);
            }
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
        };

        MathUtil.clamp = function (val, min, max) {
            return Math.max(min, Math.min(max, val));
        };

        MathUtil.angleBtweenPt = function (pt1, pt2) {
            return Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
        };

        MathUtil.map = function (value, low, high, low2, high2) {
            var percent = (value - low) / (high - low);
            return low2 + percent * (high2 - low2);
        };

        MathUtil.rectCircleCollide = function (circle, rect) {
            var distX = Math.abs(circle.x - rect.x - rect.w / 2);
            var distY = Math.abs(circle.y - rect.y - rect.h / 2);
            if (distX > (rect.w / 2 + circle.r)) {
                return false;
            }
            if (distY > (rect.h / 2 + circle.r)) {
                return false;
            }
            if (distX <= (rect.w / 2)) {
                return true;
            }
            if (distY <= (rect.h / 2)) {
                return true;
            }
            var dx = distX - rect.w / 2;
            var dy = distY - rect.h / 2;
            return (dx * dx + dy * dy <= (circle.r * circle.r));
        };

        MathUtil.intersectLineLine = function (a1, a2, b1, b2) {
            var result = { hit: false, data: null, denom: null };
            var denom = ((b2.y - b1.y) * (a2.x - a1.x)) - ((b2.x - b1.x) * (a2.y - a1.y));
            result.denom = denom;
            if (denom == 0)
                return result;
            var a = a1.y - b1.y;
            var b = a1.x - b1.x;
            var nr1 = ((b2.x - b1.x) * a) - ((b2.y - b1.y) * b);
            var nr2 = ((a2.x - a1.x) * a) - ((a2.y - a1.y) * b);
            a = nr1 / denom;
            b = nr2 / denom;
            if (a > 0 && a < 1 && b > 0 && b < 1) {
                var intersectX = a1.x + (a * (a2.x - a1.x));
                var intersectY = a1.y + (a * (a2.y - a1.y));
                result.hit = true;
                result.data = [new steer.Vector(intersectX, intersectY)];
            }
            return result;
        };

        MathUtil.intersectCircleLine = function (a1, a2, c, r) {
            var result = { hit: false, data: null };
            var a = (a2.x - a1.x) * (a2.x - a1.x) + (a2.y - a1.y) * (a2.y - a1.y);
            var b = 2 * ((a2.x - a1.x) * (a1.x - c.x) + (a2.y - a1.y) * (a1.y - c.y));
            var cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y - 2 * (c.x * a1.x + c.y * a1.y) - r * r;
            var deter = b * b - 4 * a * cc;
            if (deter < 0) {
            } else if (deter == 0) {
            } else {
                var e = Math.sqrt(deter);
                var u1 = (-b + e) / (2 * a);
                var u2 = (-b - e) / (2 * a);
                var intersectData = [];
                if (u1 > 0 && u1 < 1) {
                    intersectData.push(steer.Vector.lerp(a1, a2, u1));
                }
                if (u2 > 0 && u2 < 1) {
                    intersectData.push(steer.Vector.lerp(a1, a2, u2));
                }
                if (intersectData.length > 0) {
                    result.hit = true;
                    result.data = intersectData;
                }
            }
            return result;
        };
        MathUtil.ONED = Math.PI / 180;
        return MathUtil;
    })();
    steer.MathUtil = MathUtil;
})(steer || (steer = {}));
var steer;
(function (steer) {
    var Vector = (function () {
        function Vector(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vector.add = function (v1, v2) {
            return new Vector(v1.x + v2.x, v1.y + v2.y);
        };

        Vector.sub = function (v1, v2) {
            return new Vector(v1.x - v2.x, v1.y - v2.y);
        };

        Vector.mult = function (v1, value) {
            return new Vector(v1.x * value, v1.y * value);
        };

        Vector.div = function (v, value) {
            return new Vector(v.x / value, v.y / value);
        };

        Vector.fromAngle = function (angle, magnitude) {
            if (typeof magnitude === "undefined") { magnitude = 1; }
            var newVector = new Vector();
            newVector.x = Math.cos(angle) * magnitude;
            newVector.y = Math.sin(angle) * magnitude;
            return newVector;
        };

        Vector.setAngle = function (vector, angle) {
            var mag = vector.mag();
            vector.x = Math.cos(angle) * mag;
            vector.y = Math.sin(angle) * mag;
        };
        Vector.fromb2Vec = function (b2Vec, multiply30) {
            if (typeof multiply30 === "undefined") { multiply30 = false; }
            if (multiply30) {
                return new Vector(b2Vec.x * 30, b2Vec.y * 30);
            } else {
                return new Vector(b2Vec.x, b2Vec.y);
            }
        };

        Vector.lerp = function (v1, v2, fraction) {
            var tempV = Vector.sub(v2, v1);
            tempV.mult(fraction);
            tempV.add(v1);
            return tempV;
        };

        Vector.angleBetween = function (a, b) {
            var dotValue = a.dot(b);
            return Math.acos(dotValue / (a.mag() * b.mag()));
        };

        Vector.random = function (xmin, xmax, ymin, ymax) {
            var result = new steer.Vector();
            result.x = steer.MathUtil.map(Math.random(), 0, 1, xmin, xmax);
            result.y = steer.MathUtil.map(Math.random(), 0, 1, ymin, ymax);
            return result;
        };

        Vector.getNormalPoint = function (point, linePtA, linePtB) {
            var pa = Vector.sub(point, linePtA);
            var ba = Vector.sub(linePtB, linePtA);
            ba.normalize().mult(pa.dot(ba));
            return Vector.add(linePtA, ba);
        };

        Vector.equal = function (a, b) {
            return (a.x == b.x && a.y == b.y);
        };

        Vector.distanceSq = function (a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return dx * dx + dy * dy;
        };

        Vector.distance = function (a, b) {
            var dx = a.x - b.x;
            var dy = a.y - b.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        Vector.prototype.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };

        Vector.prototype.clone = function () {
            return new Vector(this.x, this.y);
        };

        Vector.prototype.mag = function () {
            var toX = this.x;
            var toY = this.y;
            return Math.sqrt(toX * toX + toY * toY);
        };

        Vector.prototype.magSq = function () {
            var toX = this.x;
            var toY = this.y;
            return (toX * toX + toY * toY);
        };

        Vector.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        };

        Vector.prototype.addm = function (value) {
            this.x += value;
            this.y += value;
            return this;
        };

        Vector.prototype.addxy = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };

        Vector.prototype.subxy = function (x, y) {
            this.x -= x;
            this.y -= y;
            return this;
        };

        Vector.prototype.sub = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        };

        Vector.prototype.subm = function (value) {
            this.x -= value;
            this.y -= value;
            return this;
        };

        Vector.prototype.mult = function (value) {
            this.x *= value;
            this.y *= value;
            return this;
        };

        Vector.prototype.div = function (v) {
            this.x /= v;
            this.y /= v;
            return this;
        };

        Vector.prototype.dist = function (other) {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        Vector.prototype.distSq = function (other) {
            var dx = this.x - other.x;
            var dy = this.y - other.y;
            return dx * dx + dy * dy;
        };

        Vector.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };

        Vector.prototype.normalize = function () {
            var m = this.mag();
            if (m > 0)
                this.div(m);
            return this;
        };

        Vector.prototype.normalizeThanMult = function (value) {
            this.normalize();
            this.mult(value);
            return this;
        };

        Vector.prototype.limit = function (highVal) {
            if (this.mag() > highVal) {
                this.normalize();
                this.mult(highVal);
            }
            return this;
        };

        Vector.prototype.min = function (lowVal) {
            if (this.mag() < lowVal) {
                this.normalize();
                this.mult(lowVal);
            }
            return this;
        };

        Vector.prototype.heading = function () {
            return (-Math.atan2(-this.y, this.x));
        };

        Vector.prototype.headingDegree = function () {
            var deg = (-Math.atan2(-this.y, this.x));
            return deg / steer.MathUtil.ONED;
        };

        Vector.prototype.decimal = function (decimal) {
            var dval = Math.pow(10, decimal);
            this.x = Math.round(this.x * dval) / dval;
            this.y = Math.round(this.y * dval) / dval;
            return this;
        };

        Vector.prototype.isZero = function () {
            return (this.x == 0 && this.y == 0);
        };

        Vector.prototype.makeB2Vec = function (divide30) {
            if (typeof divide30 === "undefined") { divide30 = false; }
            if (divide30) {
                return new box2d.b2Vec2(this.x / 30, this.y / 30);
            } else {
                return new box2d.b2Vec2(this.x, this.y);
            }
        };

        Vector.prototype.fromB2Vec = function (other, time30) {
            if (typeof time30 === "undefined") { time30 = true; }
            this.x = other.x * 30;
            this.y = other.y * 30;
        };

        Vector.prototype.reverse = function () {
            this.x *= -1;
            this.y *= -1;
            return this;
        };

        Vector.prototype.toString = function (decimal) {
            if (typeof decimal === "undefined") { decimal = 2; }
            if (decimal > 0) {
                var dval = Math.pow(10, decimal);
                var mag = Math.round(this.mag() * dval) / dval;
                return "(" + Math.round(this.x * dval) / dval + "," + Math.round(this.y * dval) / dval + ") mag:" + mag;
            } else {
                return "(" + this.x + "," + this.y + ") mag: " + this.mag();
            }
        };
        return Vector;
    })();
    steer.Vector = Vector;
})(steer || (steer = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var steer;
(function (steer) {
    var SteerTimer = (function (_super) {
        __extends(SteerTimer, _super);
        function SteerTimer(TPS) {
            _super.call(this);
            this.TPS = TPS;
            this.tpsValue = this.TPS / 1000;
            this.logicTicker = null;
        }
        SteerTimer.prototype.start = function () {
            if (!this.isRunning()) {
                this.accumulateLogicTime = 0;
                this.lastLogicUpdate = Date.now();
                this.LogicPerMsec = Math.round(1000 / this.TPS);
                this.logicIntervalUpdate();
            }
        };

        SteerTimer.prototype.updateTPS = function (value) {
            this.stop();
            this.TPS = value;
            this.start();
        };

        SteerTimer.prototype.isRunning = function () {
            return (this.requestAnimateId != null);
        };

        SteerTimer.prototype.stop = function () {
            if (this.requestAnimateId) {
                window.cancelAnimationFrame(this.requestAnimateId);
                this.requestAnimateId = undefined;
            }
        };

        SteerTimer.prototype.logicIntervalUpdate = function () {
            var timeDiff = Date.now() - this.lastLogicUpdate;
            this.accumulateLogicTime += timeDiff;
            this.lastLogicUpdate = Date.now();
            while (this.accumulateLogicTime > this.LogicPerMsec) {
                this.accumulateLogicTime -= this.LogicPerMsec;
                this.fireEvent(new steer.Event(steer.Event.LOGIC_UPDATE, this, { delta: this.LogicPerMsec }));
            }
            var intergrate = (this.accumulateLogicTime / this.LogicPerMsec);
            this.fireEvent(new steer.Event(steer.Event.RENDER_UPDATE, this, { delta: intergrate }));

            var self = this;
            this.requestAnimateId = window.requestAnimationFrame(function () {
                self.logicIntervalUpdate();
            });
        };
        return SteerTimer;
    })(steer.EventDispatcher);
    steer.SteerTimer = SteerTimer;
})(steer || (steer = {}));
var steer;
(function (steer) {
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
                    } else if (this.b2body.GetType() === box2d.b2BodyType.b2_staticBody) {
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
                if (typeof toDegree === "undefined") { toDegree = true; }
                if (this.b2body) {
                    if (toDegree) {
                        this.b2body.SetTransformVecRadians(this.b2body.GetPosition(), steer.MathUtil.radian(radian));
                    } else {
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
                this.selector = undefined;
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
                } else {
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
            };

            ItemDatas.prototype.exist = function (item) {
                if (typeof item == "string") {
                    return (this.itemDict[item] != null);
                } else {
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
                } else {
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
                } else {
                    result = this.itemList.concat(result);
                }
                return result;
            };
            return ItemDatas;
        })();
        _item.ItemDatas = ItemDatas;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var Circle = (function (_super) {
            __extends(Circle, _super);
            function Circle(b2Body, radius, name) {
                _super.call(this, b2Body, name);
                this.radius = radius;
                this.lastPosition = this.b2body.GetPosition().Clone();
                this.lastRotation = this.b2body.GetAngle();
            }
            return Circle;
        })(item.ItemEntity);
        item.Circle = Circle;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var Unit = (function (_super) {
            __extends(Unit, _super);
            function Unit(b2Body, radius, maxSpeed, maxForce, name) {
                if (typeof maxSpeed === "undefined") { maxSpeed = 10; }
                if (typeof maxForce === "undefined") { maxForce = 1; }
                _super.call(this, b2Body, radius, name);
                this.separateRadius = 0;
                this.cohesionRadius = 0;
                this.alignRadius = 0;
                this.pathVelocityRatio = 2;
                this.pathOnFrontRatio = 2;
                this.pathAtIndex = 0;
                this.pathSeekAheadAmt = 1;
                this.loopOnPath = false;
                this.rayFrontRatio = 4;
                this.canCollide = true;
                this.mass = 1;
                this.maxSpeed = maxSpeed;

                this.maxForce = maxForce;
                this.velocity = new steer.Vector(0, 0);
                this.acceleration = new steer.Vector(0, 0);
                this.diffPosition = new box2d.b2Vec2(0, 0);
                this.c_averageVelocity = new steer.Vector();
                this.separateRadius = this.radius + Unit.UnitSperateGap;
                this.cohesionRadius = this.alignRadius = this.radius;
                this.oldVelocities = [];
            }
            Unit.prototype.applyForce = function (force, mult) {
                if (typeof mult === "undefined") { mult = 1; }
                if (mult != 1)
                    force.mult(mult);
                this.acceleration.add(force);
            };

            Unit.prototype.addAverageData = function (newOne) {
                if (this.oldVelocities.length > 2)
                    this.oldVelocities.shift();
                this.oldVelocities.push(newOne);
            };

            Unit.prototype.averageVelocity = function () {
                return this.velocity.clone();
            };

            Unit.prototype.update = function (delta) {
                if (!this.dynamic) {
                    this.velocity.setTo(0, 0);
                    this.acceleration.setTo(0, 0);
                    return;
                }

                this.acceleration.div(this.mass).mult(delta);
                var oldVelocity = this.velocity.clone();
                this.addAverageData(this.velocity.clone());
                this.velocity.add(this.acceleration).limit(this.maxSpeed);
                var averageVelocity = this.velocity.clone().add(oldVelocity).div(2);
                this.b2body.SetAwake(true);
                this.b2body.SetLinearVelocity(averageVelocity.mult(delta).makeB2Vec());
                this.acceleration.setTo(0, 0);
            };

            Unit.prototype.getRaycast = function (useGlobal) {
                if (typeof useGlobal === "undefined") { useGlobal = false; }
                var result = [];
                var atx = this.getb2X();
                var aty = this.getb2Y();
                var avgVelocity = this.averageVelocity();
                var heading = avgVelocity.heading();
                var velocityLength = this.c_velocityLength;

                var baseAngle = 0;
                var speedRatio = (1 - avgVelocity.mag() / this.maxSpeed) * 25;
                baseAngle = Math.round(speedRatio + 5);

                var angSideAdd = heading + (steer.MathUtil.ONED * 90);
                var a1x = Math.cos(angSideAdd) * (this.radius + Unit.UnitSperateGap);
                var a1y = Math.sin(angSideAdd) * (this.radius + Unit.UnitSperateGap);
                var angAdd = heading + (steer.MathUtil.ONED * (baseAngle));
                var a2x = (Math.cos(angAdd) * velocityLength) + a1x;
                var a2y = (Math.sin(angAdd) * velocityLength) + a1y;
                if (useGlobal)
                    a1x += atx, a1y += aty, a2x += atx, a2y += aty;
                result.push(new steer.Vector(a1x, a1y), new steer.Vector(a2x, a2y));

                var angSideSub = heading - (steer.MathUtil.ONED * 90);
                var s1x = Math.cos(angSideSub) * (this.radius + Unit.UnitSperateGap);
                var s1y = Math.sin(angSideSub) * (this.radius + Unit.UnitSperateGap);
                var angSub = heading - (steer.MathUtil.ONED * (baseAngle));
                var s2x = (Math.cos(angSub) * velocityLength) + s1x;
                var s2y = (Math.sin(angSub) * velocityLength) + s1y;
                if (useGlobal)
                    s1x += atx, s1y += aty, s2x += atx, s2y += aty;
                result.push(new steer.Vector(s1x, s1y), new steer.Vector(s2x, s2y));

                var c1x = Math.cos(heading) * (this.radius + Unit.UnitSperateGap);
                var c1y = Math.sin(heading) * (this.radius + Unit.UnitSperateGap);
                var c2x = (Math.cos(heading) * (velocityLength - this.separateRadius)) + c1x;
                var c2y = (Math.sin(heading) * (velocityLength - this.separateRadius)) + c1y;
                if (useGlobal)
                    c1x += atx, c1y += aty, c2x += atx, c2y += aty;
                result.push(new steer.Vector(c1x, c1y), new steer.Vector(c2x, c2y));

                return result;
            };

            Unit.prototype.setCanCollideOtherUnit = function (canCollide) {
                this.canCollide = canCollide;

                var fixture = this.b2body.GetFixtureList();
                var filter = fixture.GetFilterData();

                this.b2body.DestroyFixture(fixture);

                var cirleShape = new box2d.b2CircleShape();
                cirleShape.m_radius = this.radius;
                var fixDef = item.Creator.createFixtureDef();
                fixDef.shape = cirleShape;
                fixDef.filter.categoryBits = item.ItemEntity.FILTER_UNIT;
                fixDef.filter.maskBits = item.ItemEntity.FILTER_STATIC | item.ItemEntity.FILTER_UNIT;
                if (!canCollide) {
                    fixDef.filter.maskBits = item.ItemEntity.FILTER_STATIC;
                }
                this.b2body.CreateFixture(fixDef);
            };

            Unit.prototype.prepareUpdateCache = function () {
                var avgVelocity = this.averageVelocity();
                this.currentRayFront = (avgVelocity.mag() * this.rayFrontRatio + this.separateRadius);
                var minLength = this.separateRadius;
                var velocityLength = this.currentRayFront;
                if (velocityLength < minLength)
                    velocityLength = minLength;
                this.c_velocityLength = velocityLength;
                this.c_rayInfo = this.getRaycast(true);
                this.avoidInfo = {};
            };

            Unit.prototype.setb2Position = function (x, y) {
                this.b2body.SetPosition(new box2d.b2Vec2(x, y));
            };
            Unit.prototype.setSteerPosition = function (x, y) {
                this.b2body.SetPosition(new box2d.b2Vec2(x / 30, y / 30));
            };

            Unit.prototype.getBoundingBox = function () {
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
                    var rayInfo = this.c_rayInfo;
                    var maxRadius = Math.max(this.separateRadius, this.cohesionRadius, this.alignRadius);
                    var lowerV = new box2d.b2Vec2(this.getb2X() - maxRadius, this.getb2Y() - maxRadius);
                    var upperV = new box2d.b2Vec2(this.getb2X() + maxRadius, this.getb2Y() + maxRadius);
                    bodyAABB.Combine1({ lowerBound: lowerV, upperBound: upperV });
                    if (this.averageVelocity().mag() > 0) {
                        if (steer.Vector.distance(rayInfo[0], this.getb2Position()) < this.c_velocityLength) {
                            for (var s = 0; s < rayInfo.length; s += 2) {
                                bodyAABB.Combine1({ lowerBound: rayInfo[s], upperBound: rayInfo[s + 1] });
                                bodyAABB.Combine1({ lowerBound: rayInfo[s + 1], upperBound: rayInfo[s] });
                            }
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

            Unit.prototype.resetVelocity = function () {
                this.oldVelocities = [];
                this.velocity.setTo(0, 0);
                this.acceleration.setTo(0, 0);
                this.b2body.SetLinearVelocity(new box2d.b2Vec2(0, 0));
                this.updateBeforeStep();
            };
            Unit.UnitSperateGap = 0.1;
            return Unit;
        })(item.Circle);
        item.Unit = Unit;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var Polygon = (function (_super) {
            __extends(Polygon, _super);
            function Polygon(b2Body, name) {
                _super.call(this, b2Body, name);
                this.shapes = [];
                this.shapeLen = 0;
                var fixture = b2Body.GetFixtureList();
                while (fixture != null) {
                    if (fixture.GetType() == box2d.b2ShapeType.e_polygonShape) {
                        this.shapes.push(fixture.GetShape());
                        this.shapeLen++;
                    }
                    fixture = fixture.GetNext();
                }
                this.lastPosition = this.b2body.GetPosition().Clone();
                this.lastRotation = this.b2body.GetAngle();
            }
            return Polygon;
        })(item.ItemEntity);
        item.Polygon = Polygon;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var Edge = (function (_super) {
            __extends(Edge, _super);
            function Edge(b2Body, name) {
                _super.call(this, b2Body, name);
                var fixture = b2Body.GetFixtureList();
                this.shapes = [];
                this.shapeLen = 0;
                while (fixture != null) {
                    var shape = fixture.GetShape();
                    if (shape.m_type == box2d.b2ShapeType.e_edgeShape) {
                        this.shapes.push(shape);
                        this.shapeLen++;
                    }
                    fixture = fixture.GetNext();
                }
                this.lastPosition = this.b2body.GetPosition().Clone();
                this.lastRotation = this.b2body.GetAngle();
            }
            return Edge;
        })(item.ItemEntity);
        item.Edge = Edge;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var PathInfo = (function () {
            function PathInfo(startPt, pathWidth, interpolateSize) {
                if (typeof interpolateSize === "undefined") { interpolateSize = 10; }
                this.startPt = startPt;
                this.pathWidth = pathWidth;
                this.interpolateSize = interpolateSize;
                this.reset();
            }
            PathInfo.fillSVGPathElement = function (path, pathInfo) {
                PathInfo.svgConvertToAbsolute(path);
                var data = steer.item.PathInfo.parseSVG(path.getAttribute("d"));
                pathInfo.reset();

                var sx = pathInfo.startPt.x;
                var sy = pathInfo.startPt.y;
                for (var s = 0; s < data.length; s++) {
                    switch (data[s][0]) {
                        case "L":
                        case "l":
                            pathInfo.lineTo(data[s][1] + sx, data[s][2] + sy);
                            break;
                        case "M":
                        case "m":
                            pathInfo.startPt = new steer.Vector(data[s][1] + sx, data[s][2] + sy);
                            break;
                        case "C":
                        case "c":
                            pathInfo.curveTo(data[s][1] + sx, data[s][2] + sy, data[s][3] + sx, data[s][4] + sy, data[s][5] + sx, data[s][6] + sy);
                            break;
                        case "S":
                        case "s":
                            pathInfo.curveTo(data[s - 1][5] + sx, data[s - 1][6] + sy, data[s][1] + sx, data[s][2] + sy, data[s][3] + sx, data[s][4] + sy);
                            break;
                    }
                }
                return pathInfo;
            };

            PathInfo.parseSVG = function (path) {
                var data = [];
                var svgObjLen = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
                var svgSegment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
                path.replace(svgSegment, function (_, command, args) {
                    var type = command.toLowerCase();
                    args = PathInfo.parseSvgEntry(args);

                    if (type == 'm' && args.length > 2) {
                        data.push([command].concat(args.splice(0, 2)));
                        type = 'l';
                        command = command == 'm' ? 'l' : 'L';
                    }
                    while (true) {
                        if (args.length == svgObjLen[type]) {
                            args.unshift(command);
                            return data.push(args);
                        }
                        if (args.length < svgObjLen[type])
                            throw new Error('malformed path data');
                        data.push([command].concat(args.splice(0, svgObjLen[type])));
                    }
                });
                return data;
            };

            PathInfo.parseSvgEntry = function (args) {
                args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig);
                return args ? args.map(Number) : [];
            };
            PathInfo.svgConvertToAbsolute = function (path) {
                var x0, y0, x1, y1, x2, y2;
                var segs = path.pathSegList;
                for (var x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; ++i) {
                    var seg = segs.getItem(i), c = seg.pathSegTypeAsLetter;
                    if (/[MLHVCSQTA]/.test(c)) {
                        if ('x' in seg)
                            x = seg.x;
                        if ('y' in seg)
                            y = seg.y;
                    } else {
                        if ('x1' in seg)
                            x1 = x + seg.x1;
                        if ('x2' in seg)
                            x2 = x + seg.x2;
                        if ('y1' in seg)
                            y1 = y + seg.y1;
                        if ('y2' in seg)
                            y2 = y + seg.y2;
                        if ('x' in seg)
                            x += seg.x;
                        if ('y' in seg)
                            y += seg.y;
                        switch (c) {
                            case 'm':
                                segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                                break;
                            case 'l':
                                segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                                break;
                            case 'h':
                                segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                                break;
                            case 'v':
                                segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                                break;
                            case 'c':
                                segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                                break;
                            case 's':
                                segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                                break;
                            case 'q':
                                segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                                break;
                            case 't':
                                segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                                break;
                            case 'a':
                                segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                                break;
                            case 'z':
                            case 'Z':
                                x = x0;
                                y = y0;
                                break;
                        }
                    }

                    if (c == 'M' || c == 'm')
                        x0 = x, y0 = y;
                }
            };

            PathInfo.interpolate = function (percent, start, cp1, cp2, end) {
                function B1(t) {
                    return t * t * t;
                }
                function B2(t) {
                    return 3 * t * t * (1 - t);
                }
                function B3(t) {
                    return 3 * t * (1 - t) * (1 - t);
                }
                function B4(t) {
                    return (1 - t) * (1 - t) * (1 - t);
                }
                var pos = new steer.Vector();
                pos.x = start.x * B1(percent) + cp1.x * B2(percent) + cp2.x * B3(percent) + end.x * B4(percent);
                pos.y = start.y * B1(percent) + cp1.y * B2(percent) + cp2.y * B3(percent) + end.y * B4(percent);
                return pos;
            };

            PathInfo.createPath = function (pathInfo, div30) {
                if (typeof div30 === "undefined") { div30 = false; }
                var copySegs = [];
                var copyDraws = [];
                for (var s = 0; s < pathInfo.segments.length; s++) {
                    var newSeg = new steer.Vector(pathInfo.segments[s].x, pathInfo.segments[s].y);
                    copySegs.push((div30) ? newSeg.div(30) : newSeg);
                }
                for (var k = 0; k < pathInfo.drawInfo.length; k++) {
                    var copy = pathInfo.drawInfo[k];
                    var pdi = new PathDrawInfo(new steer.Vector(copy.start.x, copy.start.y), new steer.Vector(copy.end.x, copy.end.y), copy.type);
                    if (copy.cp1)
                        pdi.setControlPt(new steer.Vector(copy.cp1.x, copy.cp1.y), new steer.Vector(copy.cp2.x, copy.cp2.y));
                    if (div30) {
                        pdi.start.div(30);
                        pdi.end.div(30);
                        if (pdi.cp1) {
                            pdi.cp1.div(30);
                            pdi.cp2.div(30);
                        }
                    }
                    copyDraws.push(pdi);
                }
                return new Path((div30) ? pathInfo.pathWidth / 30 : pathInfo.pathWidth, copySegs, copyDraws);
            };

            PathInfo.prototype.curveTo = function (cp1x, cp1y, cp2x, cp2y, tox, toy) {
                if (this.segments.length == 0)
                    this.segments.push(this.startPt.clone());
                var startPt = this.segments[this.segments.length - 1];
                var addSegs = [];
                for (var k = this.interpolateSize - 1; k > -1; k--) {
                    var pt = PathInfo.interpolate(k / (this.interpolateSize - 1), startPt, new steer.Vector(cp1x, cp1y), new steer.Vector(cp2x, cp2y), new steer.Vector(tox, toy));
                    addSegs.push(pt);
                }
                if (this.segments.length >= 2)
                    addSegs.shift();
                this.segments = this.segments.concat(addSegs);
                var drawinfo = new PathDrawInfo(startPt.clone(), new steer.Vector(tox, toy), PathDrawInfo.TYPE_BEZIER);
                drawinfo.setControlPt(new steer.Vector(cp1x, cp1y), new steer.Vector(cp2x, cp2y));
                this.drawInfo.push(drawinfo);
                return this;
            };

            PathInfo.prototype.lineInterpolate = function (start, end) {
                var result = [];
                var xabs = Math.abs(start.x - end.x);
                var yabs = Math.abs(start.y - end.y);
                var xdiff = end.x - start.x;
                var ydiff = end.y - start.y;
                var length = steer.Vector.distance(end, start);
                var intSize = Math.floor(length / 200);
                var rate = length / intSize;
                var xrate = xdiff / intSize;
                var yrate = ydiff / intSize;
                for (var s = 0; s < intSize; s++) {
                    var addVec = new steer.Vector(start.x + (xrate * s), start.y + (yrate * s));
                    this.segments.push(addVec);
                }
                this.segments.push(end);
            };

            PathInfo.prototype.lineTo = function (tox, toy) {
                if (this.segments.length == 0)
                    this.segments.push(this.startPt.clone());
                var startPt = this.segments[this.segments.length - 1];
                this.lineInterpolate(startPt, new steer.Vector(tox, toy));

                var drawinfo = new PathDrawInfo(startPt.clone(), new steer.Vector(tox, toy), PathDrawInfo.TYPE_LINE);
                this.drawInfo.push(drawinfo);
                return this;
            };

            PathInfo.prototype.reset = function () {
                this.segments = [];
                this.drawInfo = [];
            };
            return PathInfo;
        })();
        item.PathInfo = PathInfo;

        var PathDrawInfo = (function () {
            function PathDrawInfo(start, end, type) {
                this.start = start;
                this.end = end;
                this.type = type;
            }
            PathDrawInfo.prototype.setControlPt = function (cp1, cp2) {
                this.cp1 = cp1;
                this.cp2 = cp2;
            };

            PathDrawInfo.prototype.clone = function (div30) {
                var newOne = new PathDrawInfo(this.start.clone(), this.end.clone(), this.type);
                if (div30) {
                    newOne.start.div(30);
                    newOne.end.div(30);
                }
                if (this.type == PathDrawInfo.TYPE_BEZIER) {
                    newOne.setControlPt(this.cp1.clone(), this.cp2.clone());
                    if (div30) {
                        newOne.cp1.div(30);
                        newOne.cp2.div(30);
                    }
                }
                return newOne;
            };
            PathDrawInfo.TYPE_LINE = 0;
            PathDrawInfo.TYPE_BEZIER = 1;
            return PathDrawInfo;
        })();
        item.PathDrawInfo = PathDrawInfo;

        var Path = (function (_super) {
            __extends(Path, _super);
            function Path(pathWidth, segments, drawInfo) {
                _super.call(this, null);
                this.segments = segments;
                this.drawInfo = drawInfo;
                this.pathWidth = pathWidth;
            }
            Path.prototype.remove = function () {
                if (this.pixiDebugItem) {
                    if (this.pixiDebugItem.parent) {
                        this.pixiDebugItem.parent.removeChild(this.pixiDebugItem);
                        this.pixiDebugItem.removeStageReference();
                        this.pixiDebugItem = null;
                    }
                }
                this.domain = null;
            };
            return Path;
        })(item.ItemBase);
        item.Path = Path;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var Sensor = (function (_super) {
            __extends(Sensor, _super);
            function Sensor(b2Body, name) {
                _super.call(this, b2Body, name);
                this.overLapItems = [];
                this.shapes = [];
                this.shapeLen = 0;
                var fixture = b2Body.GetFixtureList();
                while (fixture != null) {
                    if (fixture.GetType() == box2d.b2ShapeType.e_polygonShape) {
                        this.shapes.push(fixture.GetShape());
                        this.shapeLen++;
                    }
                    fixture = fixture.GetNext();
                }
                this.lastPosition = this.b2body.GetPosition().Clone();
                this.lastRotation = this.b2body.GetAngle();
                this.overLapItems = [];
            }
            Sensor.prototype.asForcePushVector = function (force) {
                this.forceType = Sensor.FORCE_PUSH_VECTOR;
                this.pushForce = force.clone().mult(0.01);
                this.forceAngle = this.pushForce.heading();
            };
            Sensor.prototype.asForcePushCenter = function (forceMagnitude) {
                this.forceType = Sensor.FORCE_PUSH_CENTER;
                this.forceMagnitude = forceMagnitude * 0.01;
            };
            Sensor.prototype.asForcePullCenter = function (forceMagnitude) {
                this.forceType = Sensor.FORCE_PULL_CENTER;
                this.forceMagnitude = forceMagnitude * 0.01;
            };
            Sensor.prototype.asEventSensor = function (eventStart, eventEnd) {
                this.eventStart = eventStart;
                this.eventEnd = eventEnd;
            };

            Sensor.prototype.update = function () {
                var olen = this.overLapItems.length;
                for (var key in this.overLapItems) {
                    var unit = this.overLapItems[key];
                    switch (this.forceType) {
                        case Sensor.FORCE_PUSH_VECTOR:
                            unit.applyForce(steer.Vector.fromAngle(this.pushForce.heading() + this.b2body.GetAngle(), this.pushForce.mag()));
                            break;
                        case Sensor.FORCE_PUSH_CENTER:
                            var angleVec = steer.Vector.sub(unit.getb2Position(), this.getb2Position());
                            angleVec.normalizeThanMult(this.forceMagnitude);
                            unit.applyForce(angleVec);
                            break;
                        case Sensor.FORCE_PULL_CENTER:
                            var angleVec = steer.Vector.sub(this.getb2Position(), unit.getb2Position());
                            unit.applyForce(angleVec.normalizeThanMult(this.forceMagnitude));
                            break;
                    }
                }
            };
            Sensor.FORCE_PUSH_VECTOR = 1;
            Sensor.FORCE_PUSH_CENTER = 2;
            Sensor.FORCE_PULL_CENTER = 3;

            Sensor.SHAPE_BOX = 1;
            Sensor.SHAPE_CIRCLE = 2;
            return Sensor;
        })(item.ItemEntity);
        item.Sensor = Sensor;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var Creator = (function () {
            function Creator() {
            }
            Creator.cloneObject = function (source) {
                if (Object.prototype.toString.call(source) === '[object Array]') {
                    var clone = [];
                    for (var i = 0; i < source.length; i++) {
                        clone[i] = Creator.cloneObject(source[i]);
                    }
                    return clone;
                } else if (typeof (source) == "object") {
                    var clone = {};
                    for (var prop in source) {
                        if (source.hasOwnProperty(prop)) {
                            clone[prop] = Creator.cloneObject(source[prop]);
                        }
                    }
                    return clone;
                } else {
                    return source;
                }
            };

            Creator.setDomainReference = function (domain) {
                Creator.domain = domain;
            };

            Creator.createInfoCheckDefault = function (createInfo) {
                var copyInfo = Creator.cloneObject(createInfo);
                if (copyInfo.x == null)
                    copyInfo.x = 0;
                if (copyInfo.y == null)
                    copyInfo.y = 0;
                if (copyInfo.dynamic == null)
                    copyInfo.dynamic = false;
                if (Creator.pixelCreateFormat) {
                    if (copyInfo.x)
                        copyInfo.x /= 30;
                    if (copyInfo.y)
                        copyInfo.y /= 30;
                    if (copyInfo.radius)
                        copyInfo.radius /= 30;
                    if (copyInfo.widthHalf)
                        copyInfo.widthHalf /= 30;
                    if (copyInfo.heightHalf)
                        copyInfo.heightHalf /= 30;
                    if (copyInfo.maxSpeed)
                        copyInfo.maxSpeed /= 30;
                    if (copyInfo.maxForce)
                        copyInfo.maxForce /= 30;
                    if (copyInfo.blockSize)
                        copyInfo.blockSize = new steer.Vector(copyInfo.blockSize.x / 30, copyInfo.blockSize.y / 30);
                }

                if (createInfo.vertices) {
                    copyInfo.vertices = [];
                    var ptLen = createInfo.vertices.length;
                    for (var k = 0; k < ptLen; k++) {
                        if (Creator.pixelCreateFormat) {
                            copyInfo.vertices.push(new box2d.b2Vec2(createInfo.vertices[k].x / 30, createInfo.vertices[k].y / 30));
                        } else {
                            copyInfo.vertices.push(new box2d.b2Vec2(createInfo.vertices[k].x, createInfo.vertices[k].y));
                        }
                    }
                }
                return copyInfo;
            };

            Creator.createFixtureDef = function () {
                var fixDef = new box2d.b2FixtureDef();
                fixDef.density = 1;
                fixDef.friction = 0;
                fixDef.restitution = 0;
                return fixDef;
            };

            Creator.createCircle = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);
                if (cinfo.radius == null)
                    console.error("createCircle CreateInfo radius is null");

                var ballDef = new box2d.b2BodyDef();
                ballDef.type = box2d.b2BodyType.b2_staticBody;
                ballDef.linearDamping = 1000;
                ballDef.angularDamping = 1000;
                if (cinfo.dynamic)
                    ballDef.type = box2d.b2BodyType.b2_dynamicBody;
                ballDef.position.SetXY(cinfo.x, cinfo.y);
                var b2BodyNew = Creator.domain.b2World.CreateBody(ballDef);

                var cirleShape = new box2d.b2CircleShape();
                cirleShape.m_radius = cinfo.radius;
                var fixDef = Creator.createFixtureDef();
                fixDef.filter.categoryBits = item.ItemEntity.FILTER_STATIC | item.ItemEntity.FILTER_UNIT;
                fixDef.shape = cirleShape;
                b2BodyNew.CreateFixture(fixDef);

                var newCircle = new item.Circle(b2BodyNew, cinfo.radius, cinfo.name);
                newCircle.domain = Creator.domain;
                newCircle.dynamic = (cinfo.dynamic == true);
                b2BodyNew.SetUserData({ name: newCircle.name, entity: newCircle });
                Creator.domain.items.add(newCircle);

                return newCircle;
            };

            Creator.createUnit = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);
                if (cinfo.radius == null)
                    console.error("createCircle CreateInfo radius null");
                if (cinfo.maxSpeed == null)
                    console.error("createCircle CreateInfo maxSpeed null");
                if (cinfo.maxForce == null)
                    console.error("createUnit CreateInfo maxForce null");

                var ballDef = new box2d.b2BodyDef();
                ballDef.type = box2d.b2BodyType.b2_dynamicBody;
                ballDef.linearDamping = 0;
                ballDef.angularDamping = 0;
                if (cinfo.dynamic == false)
                    ballDef.type = box2d.b2BodyType.b2_staticBody;
                ballDef.position.SetXY(cinfo.x, cinfo.y);
                ballDef.fixedRotation = true;
                var b2BodyNew = Creator.domain.b2World.CreateBody(ballDef);

                var cirleShape = new box2d.b2CircleShape();
                cirleShape.m_radius = cinfo.radius;
                var fixDef = Creator.createFixtureDef();
                fixDef.shape = cirleShape;
                fixDef.filter.categoryBits = item.ItemEntity.FILTER_UNIT;
                if (createInfo.canCollide == false)
                    fixDef.filter.maskBits = item.ItemEntity.FILTER_STATIC;
                b2BodyNew.CreateFixture(fixDef);
                b2BodyNew.SetBullet(true);

                var newUnit = new item.Unit(b2BodyNew, cinfo.radius, cinfo.maxSpeed, cinfo.maxForce, cinfo.name);
                newUnit.domain = Creator.domain;
                newUnit.dynamic = (cinfo.dynamic == true);
                b2BodyNew.SetUserData({ name: newUnit.name, entity: newUnit });
                Creator.domain.items.add(newUnit);

                return newUnit;
            };

            Creator.createPolygon = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);
                if (cinfo.dynamic == null)
                    cinfo.dynamic = false;

                var boxDef = new box2d.b2BodyDef();
                boxDef.type = box2d.b2BodyType.b2_staticBody;
                boxDef.linearDamping = 1000;
                boxDef.angularDamping = 1000;
                if (cinfo.dynamic)
                    boxDef.type = box2d.b2BodyType.b2_dynamicBody;

                var polygonShape = new box2d.b2PolygonShape();

                if (cinfo.asBoxCenter) {
                    if (cinfo.widthHalf == null)
                        console.error("createPolygon asBox widthHalf is null");
                    if (cinfo.heightHalf == null)
                        console.error("createPolygon asBox heightHalf is null");
                    var xto = (cinfo.asBoxTopLeft) ? cinfo.x + cinfo.widthHalf : cinfo.x;
                    var yto = (cinfo.asBoxTopLeft) ? cinfo.y + cinfo.heightHalf : cinfo.y;

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

                var fixDef = Creator.createFixtureDef();
                fixDef.filter.categoryBits = item.ItemEntity.FILTER_STATIC | item.ItemEntity.FILTER_UNIT;
                fixDef.shape = polygonShape;
                b2BodyNew.CreateFixture(fixDef);
                var newPolygon = new item.Polygon(b2BodyNew, cinfo.name);
                newPolygon.dynamic = (cinfo.dynamic == true);
                b2BodyNew.SetUserData({ name: newPolygon.name, entity: newPolygon });
                Creator.domain.items.add(newPolygon);
                return newPolygon;

                return null;
            };

            Creator.createPolygonBorder = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);

                if (cinfo.asPolygonBorder) {
                    if (cinfo.polygonBorderWidth == null || cinfo.polygonBorderTL == null || cinfo.polygonBorderBR == null) {
                        console.error("createPolygon asPolygonBorder polygonBorderWidth and polygonBorderTL and polygonBorderBR must be set");
                    }

                    var b = cinfo.polygonBorderWidth;
                    var halfb = cinfo.polygonBorderWidth * .5;
                    var sx = cinfo.polygonBorderTL.x;
                    var sy = cinfo.polygonBorderTL.y;
                    var ex = cinfo.polygonBorderBR.x;
                    var ey = cinfo.polygonBorderBR.y;
                    var w = (ex - sx) * .5;
                    var h = (ey - sy) * .5;
                    if (cinfo.polygonBorderInside) {
                        var topInfo = { x: sx, y: sy, widthHalf: w, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var topPolygon = steer.item.Creator.createPolygon(topInfo);
                        var btmInfo = { x: sx, y: ey - b, widthHalf: w, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var bottomPolygon = steer.item.Creator.createPolygon(btmInfo);
                        var leftInfo = { x: sx, y: sy + b, widthHalf: halfb, heightHalf: h - b, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var leftPolygon = steer.item.Creator.createPolygon(leftInfo);
                        var rightInfo = { x: ex - b, y: sy + b, widthHalf: halfb, heightHalf: h - b, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var rightPolygon = steer.item.Creator.createPolygon(rightInfo);
                        return [topPolygon, rightPolygon, bottomPolygon, leftPolygon];
                    } else {
                        var topInfo = { x: sx - b, y: sy - b, widthHalf: w + b, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var topPolygon = steer.item.Creator.createPolygon(topInfo);
                        var btmInfo = { x: sx - b, y: ey, widthHalf: w + b, heightHalf: halfb, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var bottomPolygon = steer.item.Creator.createPolygon(btmInfo);
                        var leftInfo = { x: sx - b, y: sy, widthHalf: halfb, heightHalf: h, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var leftPolygon = steer.item.Creator.createPolygon(leftInfo);
                        var rightInfo = { x: ex, y: sy, widthHalf: halfb, heightHalf: h, asBoxCenter: true, asBoxTopLeft: true, properties: ~item.ItemEntity.DYNAMIC };
                        var rightPolygon = steer.item.Creator.createPolygon(rightInfo);
                        return [topPolygon, rightPolygon, bottomPolygon, leftPolygon];
                    }
                }
            };

            Creator.createEdge = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);
                cinfo.dynamic = false;

                var bodyDef = new box2d.b2BodyDef();
                bodyDef.type = box2d.b2BodyType.b2_staticBody;
                bodyDef.position.SetXY(cinfo.x, cinfo.y);
                bodyDef.linearDamping = 0;
                bodyDef.angularDamping = 0;
                var b2BodyNew = Creator.domain.b2World.CreateBody(bodyDef);

                var fixDef = Creator.createFixtureDef();
                var edgeShape = new box2d.b2EdgeShape();
                fixDef.shape = edgeShape;
                fixDef.filter.categoryBits = item.ItemEntity.FILTER_STATIC | item.ItemEntity.FILTER_UNIT;

                for (var k = 0; k + 1 < cinfo.vertices.length; k++) {
                    edgeShape.Set(cinfo.vertices[k], cinfo.vertices[k + 1]);
                    b2BodyNew.CreateFixture(fixDef);
                }

                var newEdge = new item.Edge(b2BodyNew, cinfo.name);
                newEdge.domain = Creator.domain;
                newEdge.dynamic = false;
                b2BodyNew.SetUserData({ name: newEdge.name, entity: newEdge });
                Creator.domain.items.add(newEdge);

                return newEdge;
            };

            Creator.createSensorArea = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);

                var bodyDef = new box2d.b2BodyDef();
                bodyDef.type = box2d.b2BodyType.b2_staticBody;
                var fixDef = Creator.createFixtureDef();
                fixDef.isSensor = true;

                if (cinfo.asCircle) {
                    if (cinfo.radius == null)
                        console.error("createSensorArea asCircle radius null");
                    bodyDef.position.SetXY(cinfo.x, cinfo.y);
                    var b2Body = Creator.domain.b2World.CreateBody(bodyDef);
                    var cirleShape = new box2d.b2CircleShape();
                    cirleShape.m_radius = cinfo.radius;
                    fixDef.shape = cirleShape;
                }

                if (cinfo.asBoxCenter) {
                    if (cinfo.heightHalf == null || cinfo.widthHalf == null)
                        console.error("createSensorArea asBox heightHalf or widthHalf null");
                    var xto = (cinfo.asBoxTopLeft) ? cinfo.x + cinfo.widthHalf : cinfo.x;
                    var yto = (cinfo.asBoxTopLeft) ? cinfo.y + cinfo.heightHalf : cinfo.y;
                    bodyDef.position.SetXY(xto, yto);
                    var b2Body = Creator.domain.b2World.CreateBody(bodyDef);
                    var polygonShape = new box2d.b2PolygonShape();
                    polygonShape.SetAsBox(cinfo.widthHalf, cinfo.heightHalf);
                    fixDef.shape = polygonShape;
                }

                b2Body.CreateFixture(fixDef);
                var newSensor = new item.Sensor(b2Body, cinfo.name);
                if (cinfo.asBoxCenter) {
                    newSensor.shapeType = item.Sensor.SHAPE_BOX;
                } else {
                    newSensor.shapeType = item.Sensor.SHAPE_CIRCLE;
                    newSensor.radius = cinfo.radius;
                }
                newSensor.dynamic = cinfo.dynamic;
                newSensor.shapeType = (cinfo.asBoxCenter) ? item.Sensor.SHAPE_BOX : item.Sensor.SHAPE_CIRCLE;
                b2Body.SetUserData({ name: newSensor.name, entity: newSensor });
                Creator.domain.autoItems.add(newSensor);
                return newSensor;
            };

            Creator.createGridmap = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);
                var errors = Creator.checkRequireInfos(createInfo, "x,y,blockSize,gridSize");
                if (errors.length > 0) {
                    console.error("createGridmap missing properties: " + errors.join(","));
                    return;
                }
                var gridmap = new item.GridMap(cinfo.x, cinfo.y, cinfo.blockSize, cinfo.gridSize, cinfo.name);
                Creator.domain.gridMaps.add(gridmap);
                return gridmap;
            };

            Creator.createPath = function (createInfo) {
                if (!Creator.domain)
                    console.error("Creator Domain reference not found!");
                var cinfo = Creator.createInfoCheckDefault(createInfo);
                var errors = Creator.checkRequireInfos(createInfo, "pathInfo");
                if (errors.length > 0) {
                    console.error("createBezierPath missing properties: " + errors.join(","));
                    return;
                }
                var path = item.PathInfo.createPath(cinfo.pathInfo, Creator.pixelCreateFormat);
                Creator.domain.items.add(path);
                return path;
            };

            Creator.checkRequireInfos = function (createInfo, list) {
                var lists = list.split(",");
                var len = lists.length;
                var errors = [];
                for (var s = 0; s < len; s++) {
                    if (createInfo[lists[s]] == null)
                        errors.push(lists[s]);
                }
                return errors;
            };
            Creator.pixelCreateFormat = true;
            return Creator;
        })();
        item.Creator = Creator;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (_item) {
        var QuadNode = (function () {
            function QuadNode(x, y, w, h, depth, maxChildren, maxDepth) {
                if (typeof maxChildren === "undefined") { maxChildren = 3; }
                if (typeof maxDepth === "undefined") { maxDepth = 4; }
                this.items = [];
                this.nodes = [];
                this.x = x;
                this.y = y;
                this.width = w;
                this.height = h;
                this.depth = depth;
                this.maxChildren = maxChildren;
                this.maxDepth = maxDepth;
            }
            QuadNode.prototype.retrieve = function (selector, callback, instance) {
                var _this = this;
                var itemsLen = this.items.length;
                for (var i = 0; i < itemsLen; ++i) {
                    (instance) ? callback.call(instance, this.items[i]) : callback(this.items[i]);
                }
                if (this.nodes.length) {
                    this.findOverlappingNodes(selector, function (dir) {
                        _this.nodes[dir].retrieve(selector, callback, instance);
                    });
                }
            };

            QuadNode.prototype.findOverlappingNodes = function (item, callback) {
                if (item.x < this.x + (this.width / 2)) {
                    if (item.y < this.y + (this.height / 2)) {
                        callback(QuadNode.TOP_LEFT);
                    }
                    if (item.y + item.height >= this.y + this.height / 2) {
                        callback(QuadNode.BOTTOM_LEFT);
                    }
                }
                if (item.x + item.width >= this.x + (this.width / 2)) {
                    if (item.y < this.y + (this.height / 2)) {
                        callback(QuadNode.TOP_RIGHT);
                    }
                    if (item.y + item.height >= this.y + this.height / 2) {
                        callback(QuadNode.BOTTOM_RIGHT);
                    }
                }
            };

            QuadNode.prototype.findInsertNode = function (item) {
                if (item.x + item.width < this.x + (this.width / 2)) {
                    if (item.y + item.height < this.y + (this.height / 2)) {
                        return QuadNode.TOP_LEFT;
                    }
                    if (item.y >= this.y + (this.height / 2)) {
                        return QuadNode.BOTTOM_LEFT;
                    }
                    return QuadNode.PARENT;
                }
                if (item.x >= this.x + (this.width / 2)) {
                    if (item.y + item.height < this.y + (this.height / 2)) {
                        return QuadNode.TOP_RIGHT;
                    }
                    if (item.y >= this.y + (this.height / 2)) {
                        return QuadNode.BOTTOM_RIGHT;
                    }
                    return QuadNode.PARENT;
                }
                return QuadNode.PARENT;
            };

            QuadNode.prototype.insert = function (item) {
                var dirType;
                if (this.nodes.length > 0) {
                    dirType = this.findInsertNode(item);
                    if (dirType === QuadNode.PARENT) {
                        this.items.push(item);
                        item.parent = this;
                    } else {
                        this.nodes[dirType].insert(item);
                        item.parent = this.nodes[dirType];
                    }
                } else {
                    this.items.push(item);
                    item.parent = this;
                    if (this.items.length > this.maxChildren && this.depth < this.maxDepth) {
                        this.divide();
                    }
                }
            };

            QuadNode.prototype.divide = function () {
                var tw, th, i, oldChildren;
                var childrenDepth = this.depth + 1;
                tw = (this.width / 2);
                th = (this.height / 2);

                this.nodes.push(new QuadNode(this.x, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));

                this.nodes.push(new QuadNode(this.x + tw, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));

                this.nodes.push(new QuadNode(this.x, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));

                this.nodes.push(new QuadNode(this.x + tw, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
                oldChildren = this.items;
                this.items = [];
                for (i = 0; i < oldChildren.length; i++) {
                    this.insert(oldChildren[i]);
                }
            };

            QuadNode.prototype.clear = function () {
                var nodeLen = this.nodes.length;
                while (nodeLen--)
                    this.nodes[nodeLen].clear();
                this.items = [];
                this.nodes = [];
            };
            QuadNode.TOP_LEFT = 0;
            QuadNode.TOP_RIGHT = 1;
            QuadNode.BOTTOM_LEFT = 2;
            QuadNode.BOTTOM_RIGHT = 3;
            QuadNode.PARENT = 4;
            return QuadNode;
        })();
        _item.QuadNode = QuadNode;

        var QuadSelector = (function () {
            function QuadSelector(x, y, width, height, data) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.data = data;
            }
            QuadSelector.prototype.toString = function () {
                return "x:" + this.x + " y:" + this.y + " w: " + this.width + " h: " + this.height;
            };
            return QuadSelector;
        })();
        _item.QuadSelector = QuadSelector;

        var QuadTree = (function () {
            function QuadTree(x, y, w, h, maxChildren, maxDepth) {
                if (typeof maxChildren === "undefined") { maxChildren = 3; }
                if (typeof maxDepth === "undefined") { maxDepth = 4; }
                this.drawDebug = false;
                this.rootNode = new QuadNode(x, y, w, h, 0, maxChildren, maxDepth);
            }
            QuadTree.prototype.insert = function (item) {
                this.rootNode.insert(item);
            };

            QuadTree.prototype.retrieve = function (selector, callback, instance) {
                return this.rootNode.retrieve(selector, callback, instance);
            };

            QuadTree.prototype.clear = function () {
                this.rootNode.clear();
            };

            QuadTree.prototype.getItemSelector = function (itemIn) {
                var result;
                if (itemIn["b2body"] != null) {
                    var item = itemIn;
                    var bbox = item.getBoundingBox();

                    result = new QuadSelector(bbox.x, bbox.y, bbox.w, bbox.h, itemIn);
                }
                return result;
            };

            QuadTree.prototype.quadTreeSelect = function (item) {
                var result = [];

                var useSelector = item.selector;
                this.retrieve(useSelector, function (itemFound) {
                    if (itemFound.data != item) {
                        result.push(itemFound);
                    }
                });

                return (result.length > 0) ? result : null;
            };
            return QuadTree;
        })();
        _item.QuadTree = QuadTree;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (item) {
        var GridMap = (function (_super) {
            __extends(GridMap, _super);
            function GridMap(x, y, blockSize, gridSize, name) {
                _super.call(this, name);
                this.x = x;
                this.y = y;
                this.blockSize = blockSize;
                this.gridSize = gridSize;
                this.w = this.blockSize.x * this.gridSize.x;
                this.h = this.blockSize.y * this.gridSize.y;
            }
            GridMap.prototype.remove = function () {
                if (this.pixiDebugItem) {
                    this.pixiDebugItem.clear();
                    this.pixiDebugItem.stage.removeChild(this.pixiDebugItem);
                    this.pixiDebugItem.parent.removeChild(this.pixiDebugItem);
                    this.pixiDebugItem.removeStageReference();
                    this.pixiDebugItem = undefined;
                }
                this.domain = null;
            };

            GridMap.prototype.toCenter = function (x, y) {
                var xto = this.blockSize.x * 30 * x + (this.blockSize.x * 15);
                var yto = this.blockSize.y * 30 * y + (this.blockSize.y * 15);
                return new steer.Vector(xto, yto);
            };

            GridMap.prototype.clearPathGrid = function () {
                if (this.pathData) {
                    for (var lx = 0; lx < this.gridSize.x; lx++) {
                        for (var ly = 0; ly < this.gridSize.y; ly++) {
                            this.pathData.setWalkableAt(lx, ly, true);
                        }
                    }
                }
            };

            GridMap.prototype.findPath = function (startx, starty, endx, endy, pathWidth, integrateSize) {
                var finder = new PF.JumpPointFinder({
                    allowDiagonal: false,
                    heuristic: PF.Heuristic.chebyshev
                });
                var path = finder.findPath(startx, starty, endx, endy, this.pathData.clone());
                path = PF.Util.compressPath(path);

                var startLoc = this.toCenter(startx, starty);
                var endLoc = this.toCenter(endx, endy);
                var pathInfo = new steer.item.PathInfo(startLoc, pathWidth, integrateSize);
                for (var s = 1; s < path.length; s++) {
                    var loopLoc = this.toCenter(path[s][0], path[s][1]);
                    pathInfo.lineTo(loopLoc.x, loopLoc.y);
                }
                return pathInfo;
            };
            return GridMap;
        })(item.ItemBase);
        item.GridMap = GridMap;
    })(steer.item || (steer.item = {}));
    var item = steer.item;
})(steer || (steer = {}));
var steer;
(function (steer) {
    var BaseRender = (function () {
        function BaseRender(domain, w, h) {
            this.domain = domain;
            this.w = w;
            this.h = h;
        }
        BaseRender.prototype.preDomainUpdate = function () {
        };

        BaseRender.prototype.domainUpdate = function () {
        };

        BaseRender.prototype.integrate = function (delta) {
            var _this = this;
            this.domain.items.each(function (item) {
                _this.itemRender(item, delta);
            });

            this.domain.autoItems.each(function (item) {
                _this.itemRender(item, delta);
            });
            this.visualRender(delta);
        };

        BaseRender.prototype.itemRender = function (item, delta) {
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

            if (this.updateObject)
                this.updateObject.updateItem(item, xto, yto, rto, delta);
        };

        BaseRender.prototype.visualRender = function (delta) {
            if (this.updateObject)
                this.updateObject.updateStep(delta);
        };
        return BaseRender;
    })();
    steer.BaseRender = BaseRender;

    var Domain = (function () {
        function Domain() {
            this.items = new steer.item.ItemDatas();
            this.autoItems = new steer.item.ItemDatas();
            this.gridMaps = new steer.item.ItemDatas();
            box2d.b2_maxTranslation = 30;
            this.renderers = [];
        }
        Domain.prototype.createB2World = function (gravity) {
            this.b2World = new box2d.b2World(gravity);
            this.contactManager = new steer.ContactManager(this);
            this.b2World.SetContactListener(this.contactManager);
        };

        Domain.prototype.createBox2dDebugDraw = function (canvasId, flag) {
            if (this.b2World == null) {
                console.error("createCanvasDebugDraw() error , b2World not found... ");
                return;
            }
            this.box2dDebugDraw = new DebugDraw(document.getElementById(canvasId));
            this.b2World.SetDebugDraw(this.box2dDebugDraw);
            this.box2dDebugDraw.SetFlags(flag);
        };

        Domain.prototype.clearAll = function () {
        };

        Domain.prototype.addRenderer = function (renderer) {
            var found = false;
            for (var t = 0; t < this.renderers.length; t++) {
                if (this.renderers[t] === renderer) {
                    found = true;
                    break;
                }
            }
            if (!found)
                this.renderers.push(renderer);
        };

        Domain.prototype.removeRenderer = function (renderer) {
            for (var t = 0; t < this.renderers.length; t++) {
                if (this.renderers[t] === renderer) {
                    this.renderers[t] = null;
                    this.renderers.splice(t);
                    break;
                }
            }
        };

        Domain.prototype.remove = function (item) {
            switch (item.constructor["name"]) {
                case "Unit":
                case "Circle":
                case "Polygon":
                case "Edge":
                case "Path":
                    this.items.remove(item);
                    item.remove();
                    break;
                case "Sensor":
                    this.autoItems.remove(item);
                    item.remove();
                    break;
                case "GridMap":
                    this.gridMaps.remove(item);
                    item.remove();
                    break;
            }
            item = null;
        };

        Domain.prototype.setupSelector = function (selector) {
            this.selector = selector;
        };

        Domain.prototype.preUpdate = function () {
            var _this = this;
            this.items.each(function (item) {
                item.prepareUpdateCache();
            }, "Unit");

            if (this.selector) {
                this.selector.clear();
                this.items.each(function (item) {
                    if (item["b2body"] != null) {
                        var entity = item;
                        var itemSelector = _this.selector.getItemSelector(item);
                        if (itemSelector) {
                            _this.selector.insert(itemSelector);
                            entity.selector = itemSelector;
                        }
                    }
                });
            }

            if (this.selector) {
                for (var s = 0; s < this.renderers.length; s++) {
                    this.renderers[s].preDomainUpdate();
                }
            }
        };

        Domain.prototype.update = function (delta) {
            this.autoItems.each(function (item) {
                if (item["update"]) {
                    item["update"]();
                }
            }, "Sensor");

            this.items.each(function (item) {
                if (item["updateBeforeStep"]) {
                    item["updateBeforeStep"]();
                    if (item.constructor["name"] == "Unit") {
                        item.update(delta);
                    }
                }
            });

            this.b2World.Step(0.016, 10, 10);
            if (this.b2World.m_debugDraw) {
                this.b2World.DrawDebugData();
            }

            this.items.each(function (item) {
                if (item["updateAfterStep"]) {
                    item["updateAfterStep"]();
                }
            });

            for (var s = 0; s < this.renderers.length; s++) {
                this.renderers[s].domainUpdate();
            }
        };

        Domain.prototype.integrate = function (delta) {
            for (var s = 0; s < this.renderers.length; s++) {
                this.renderers[s].integrate(delta);
            }
        };
        return Domain;
    })();
    steer.Domain = Domain;
})(steer || (steer = {}));
var steer;
(function (steer) {
    var ContactManager = (function () {
        function ContactManager(domain) {
            this.domain = domain;
            this.domain.b2World.SetContactListener(this);
        }
        ContactManager.prototype.PostSolve = function (contact, impulse) {
        };
        ContactManager.prototype.PreSolve = function (contact, oldManifold) {
        };

        ContactManager.prototype.BeginContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if (((!fixtureA.IsSensor()) && fixtureB.IsSensor()) || (fixtureA.IsSensor() && (!fixtureB.IsSensor()))) {
                var sensorOne = (fixtureA.IsSensor()) ? fixtureA : fixtureB;
                var targetOne = (fixtureA.IsSensor()) ? fixtureB : fixtureA;

                var sensor = sensorOne.GetBody().GetUserData().entity;
                if (targetOne.GetBody().GetUserData().entity.constructor["name"] === "Unit") {
                    sensor.overLapItems[targetOne.GetBody().GetUserData().name] = targetOne.GetBody().GetUserData().entity;
                    if (sensor.eventStart) {
                        setTimeout(function () {
                            sensor.eventStart.apply(sensor);
                        }, 1);
                    }
                }
            }
        };

        ContactManager.prototype.EndContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if (((!fixtureA.IsSensor()) && fixtureB.IsSensor()) || (fixtureA.IsSensor() && (!fixtureB.IsSensor()))) {
                var sensorOne = (fixtureA.IsSensor()) ? fixtureA : fixtureB;
                var targetOne = (fixtureA.IsSensor()) ? fixtureB : fixtureA;
                var sensor = sensorOne.GetBody().GetUserData().entity;
                if (sensor.eventEnd) {
                    setTimeout(function () {
                        sensor.eventEnd.apply(sensor);
                    }, 1);
                }
                delete sensor.overLapItems[targetOne.GetBody().GetUserData().name];
            }
        };
        return ContactManager;
    })();
    steer.ContactManager = ContactManager;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (controls) {
        var BasicControls = (function () {
            function BasicControls() {
            }
            BasicControls.seek = function (unit, vector) {
                return steer.Vector.sub(vector, unit.getb2Position()).limit(unit.maxForce);
            };

            BasicControls.flee = function (unit, vector) {
                return steer.Vector.sub(unit.getb2Position(), vector).limit(unit.maxForce);
            };

            BasicControls.pursuit = function (unit, target) {
                var offset = steer.Vector.sub(target.getb2Position(), unit.getb2Position());
                var distanceDelta = offset.mag() / target.maxSpeed;
                var targetVelAvg = target.averageVelocity().mult(distanceDelta);
                var futureAt = target.getb2Position().add(targetVelAvg);
                return BasicControls.seek(unit, futureAt);
            };

            BasicControls.evade = function (unit, target) {
                var offset = steer.Vector.sub(target.getb2Position(), unit.getb2Position());
                var distanceDelta = offset.mag() / target.maxSpeed;
                var targetVelAvg = target.averageVelocity().mult(distanceDelta);
                var futureAt = target.getb2Position().add(targetVelAvg);
                return BasicControls.flee(unit, futureAt);
            };

            BasicControls.arrival = function (unit, vector, slowDownRatio) {
                if (typeof slowDownRatio === "undefined") { slowDownRatio = 2; }
                var offset = steer.Vector.sub(vector, unit.getb2Position());
                var distance = offset.mag();
                if (distance < unit.maxSpeed * slowDownRatio) {
                    var mapValue = steer.MathUtil.map(distance, 0, unit.maxSpeed * slowDownRatio, 0, unit.maxSpeed);
                    if (Math.abs(mapValue) < 0.01)
                        mapValue = 0;
                    offset.normalize().mult(mapValue);
                } else {
                    offset.normalize().mult(unit.maxSpeed);
                }
                var dest = steer.Vector.sub(offset, unit.velocity).limit(unit.maxForce).div(30);
                return dest;
            };

            BasicControls.separation = function (unit, list) {
                var sum = new steer.Vector(0, 0);
                var len = list.length;
                var count = 0;
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var distance = steer.Vector.distance(unit.getb2Position(), list[s].getb2Position());
                        var calcuateRadius = list[s].separateRadius + unit.separateRadius;
                        if (distance < calcuateRadius) {
                            var diff = steer.Vector.sub(unit.getb2Position(), list[s].getb2Position());
                            diff.div(distance);
                            sum.add(diff);
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    sum.div(count);
                    sum.normalizeThanMult(unit.maxSpeed);
                    sum.sub(unit.velocity);
                    sum.limit(unit.maxForce);
                }
                return sum;
            };

            BasicControls.align = function (unit, list) {
                var sum = new steer.Vector(0, 0);
                var len = list.length;
                var count = 0;
                for (var s = 0; s < len; s++) {
                    if (unit !== list[s]) {
                        var distance = steer.Vector.distance(unit.getb2Position(), list[s].getb2Position());
                        var calcuateRadius = list[s].alignRadius + unit.alignRadius;
                        if (distance < calcuateRadius) {
                            sum.add(list[s].velocity);
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    sum.div(count).normalizeThanMult(unit.maxSpeed);
                    sum.limit(unit.maxForce);
                }
                return sum;
            };

            BasicControls.cohesion = function (unit, list) {
                var sum = new steer.Vector(0, 0);
                var len = list.length;
                var count = 0;
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var distance = steer.Vector.distance(unit.getb2Position(), list[s].getb2Position());
                        var calcuateRadius = list[s].cohesionRadius + unit.cohesionRadius;
                        if (distance < calcuateRadius) {
                            sum.add(list[s].getb2Position());
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    sum.div(count);
                    return BasicControls.seek(unit, sum);
                }
                return sum;
            };

            BasicControls.initWander = function (unit, wanderRadius, wanderRatioDeg) {
                unit.wanderRadius = wanderRadius;
                unit.wanderRatioDeg = wanderRatioDeg * Math.PI / 180;
                unit.wanderCurrentAngle = (Math.random() * Math.PI * 2);
            };

            BasicControls.wander = function (unit) {
                if (unit.wanderRadius == null || unit.wanderRatioDeg == null || unit.wanderCurrentAngle == null) {
                    console.error("unit calling wander behavior without initWander function() ");
                    return new steer.Vector();
                }
                var circleCenter = unit.velocity.clone();
                unit.wanderCurrentAngle += (unit.wanderRatioDeg * 0.5) - (Math.random() * unit.wanderRatioDeg);
                var wanderFoce = steer.Vector.fromAngle(unit.wanderCurrentAngle);
                wanderFoce.mult(unit.wanderRadius);
                wanderFoce.add(circleCenter);
                return wanderFoce;
            };
            return BasicControls;
        })();
        controls.BasicControls = BasicControls;
    })(steer.controls || (steer.controls = {}));
    var controls = steer.controls;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (controls) {
        var AvoidControls = (function () {
            function AvoidControls() {
            }
            AvoidControls.avoidObstacle = function (unit) {
                var hitCallbacks = [];
                var rayInfo = unit.c_rayInfo;

                for (var s = 0; s < rayInfo.length; s += 2) {
                    var callBack = new box2d.RaycastCallback();
                    callBack.ptStart = rayInfo[s].makeB2Vec();
                    callBack.ptEnd = rayInfo[s + 1].makeB2Vec();
                    unit.domain.b2World.RayCast(callBack, callBack.ptStart, callBack.ptEnd);
                    if (callBack.m_hit) {
                        hitCallbacks.push(callBack);
                    }
                }

                var shortestPt;
                var shortestNormal;
                var shortestFixture;
                var rayPtS, rayPtE;
                var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);

                if (hitCallbacks.length > 0) {
                    var shortestDist = 10000000;
                    for (var k = 0; k < hitCallbacks.length; k++) {
                        var loopDist = steer.Vector.distanceSq(hitCallbacks[k].m_point, unit.getb2Position());
                        if (loopDist < shortestDist) {
                            shortestDist = loopDist;
                            shortestPt = hitCallbacks[k].m_point;
                            shortestNormal = hitCallbacks[k].m_normal;
                            shortestFixture = hitCallbacks[k].fixture;
                            rayPtS = hitCallbacks[k].ptStart;
                            rayPtE = hitCallbacks[k].ptEnd;
                        }
                    }

                    if (ddinfo) {
                        if (ddinfo.drawMask & steer.render.DebugDrawInfo.AVOID_FORCE) {
                            ddinfo.avoidColor = 0xCC6666;
                            ddinfo.avoidHitLoc = steer.Vector.fromb2Vec(shortestPt).sub(unit.getb2Position());
                        }
                    }

                    if (shortestFixture.GetType() == box2d.b2ShapeType.e_circleShape) {
                        var checkRange = unit.maxSpeed * unit.rayFrontRatio;
                        var distanceHitToUnit = checkRange - steer.Vector.distance(shortestPt, unit.getb2Position());
                        if (distanceHitToUnit > 0) {
                            var circlePos = shortestFixture.GetBody().GetPosition();
                            var ppt = steer.Vector.getNormalPoint(steer.Vector.fromb2Vec(circlePos), rayInfo[4], rayInfo[5]);
                            var futureppt = steer.Vector.sub(ppt, unit.getb2Position()).normalizeThanMult(1).add(ppt);

                            var awayForce = checkRange - (checkRange - distanceHitToUnit);
                            var bounceAng = steer.Vector.sub(futureppt, steer.Vector.fromb2Vec(circlePos)).heading();

                            var resultForce = steer.Vector.fromAngle(bounceAng).mult(awayForce * 0.02);
                            if (ddinfo) {
                                if (ddinfo.drawMask & steer.render.DebugDrawInfo.AVOID_FORCE) {
                                    ddinfo.avoidColor = 0xCC6666;
                                    ddinfo.avoidForce = resultForce.clone().mult(100);
                                }
                            }
                            return resultForce;
                        }

                        return new steer.Vector();
                    } else {
                        var normalHeading = -Math.atan2(-shortestNormal.y, shortestNormal.x);
                        var bounceAng = normalHeading * 2 - Math.PI - unit.averageVelocity().heading();
                        var distToObstacle = steer.Vector.distance(shortestPt, unit.getb2Position());
                        var awayForce = unit.c_velocityLength - distToObstacle;

                        var resultForce = steer.Vector.fromAngle(bounceAng).mult(awayForce * 0.01);

                        if (ddinfo) {
                            if (ddinfo.drawMask & steer.render.DebugDrawInfo.AVOID_FORCE) {
                                ddinfo.avoidColor = 0xCC6666;
                                ddinfo.avoidForce = resultForce.clone().mult(100);
                            }
                        }
                        return resultForce;
                    }
                }
                if (ddinfo) {
                    ddinfo.avoidForce = null;
                    ddinfo.avoidHitLoc = null;
                }
                console.log("no");
                return new steer.Vector();
            };

            AvoidControls.avoidUnit = function (unit, list) {
                var len = list.length;
                var threat;
                var unitHitAt;
                var threatHitAt;
                var closestDist = Number.MAX_VALUE;
                var resultVec = new steer.Vector();
                var closestFutureHit;
                var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var other = list[s];
                        var realDist = unit.getb2Position().dist(other.getb2Position());
                        if (realDist < closestDist) {
                            closestDist = realDist;
                            var checkDist = (unit.radius + other.radius) * 10;
                            var hitDist = AvoidControls.predictFutureHitDist(unit, other);
                            closestFutureHit = hitDist;

                            if (((hitDist > 0) && (hitDist < checkDist))) {
                                var unitTravel = steer.Vector.mult(unit.averageVelocity(), hitDist);
                                var otherTravel = steer.Vector.mult(other.averageVelocity(), hitDist);
                                var unitFrontAdd = unit.averageVelocity().clone().normalizeThanMult(unit.radius);
                                var otherFrontAdd = other.averageVelocity().clone().normalizeThanMult(other.radius);
                                unitHitAt = unit.getb2Position().add(unitTravel).add(unitFrontAdd);
                                threatHitAt = other.getb2Position().add(otherTravel).add(otherFrontAdd);
                                threat = other;
                            }
                        }
                    }
                }

                if (threat != null) {
                    var checkDistRatio = (unit.radius + other.radius + unit.c_velocityLength + other.c_velocityLength) * .5;
                    var threatNormal = threat.averageVelocity().clone().normalize();
                    var unitNormal = unit.averageVelocity().clone().normalize();

                    var angle = 0.707;

                    var sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.5)));
                    var parallelness = unitNormal.dot(threatNormal);

                    if (parallelness < -angle) {
                        if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                            var offset = steer.Vector.sub(threatHitAt, unit.getb2Position());
                            var sideDot = offset.dot(sideVec);
                            resultVec = sideVec;
                            if (ddinfo) {
                                ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_FRONT;
                                ddinfo.avoidForce = resultVec.clone();
                                ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                            }
                        }
                    } else {
                        if (parallelness > angle) {
                            if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                                var unitToDist = unit.getb2Position().dist(unitHitAt);
                                var threatToDist = threat.getb2Position().dist(unitHitAt);

                                if (unitToDist >= threatToDist) {
                                    if (!unit.avoidInfo.parallelAvoid) {
                                        unit.avoidInfo.parallelAvoid = threat.avoidInfo.parallelAvoid = true;

                                        var utDist = unit.getb2Position().dist(unitHitAt);
                                        var ttDist = threat.getb2Position().dist(unitHitAt);
                                        if (utDist > ttDist) {
                                            var offset = steer.Vector.sub(threat.getb2Position(), unit.getb2Position());
                                            var angleBetween = offset.dot(sideVec);
                                            sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 1)));
                                            if (angleBetween > 0)
                                                sideVec = steer.Vector.fromAngle((unitNormal.heading() - (Math.PI * 1)));
                                        }
                                        if (ddinfo) {
                                            ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_PARALLEL;
                                            ddinfo.avoidForce = resultVec.clone();
                                            ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                                        }
                                        resultVec = sideVec;
                                    }
                                }
                            }
                        } else {
                            if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                                var unitToDist = unit.getb2Position().dist(threatHitAt);
                                var threatToDist = threat.getb2Position().dist(unitHitAt);

                                if (unitToDist >= threatToDist) {
                                    if (!unit.avoidInfo.parallelAvoid) {
                                        unit.avoidInfo.parallelAvoid = threat.avoidInfo.parallelAvoid = true;

                                        var hitDirVector = threatHitAt.clone().sub(unit.getb2Position());
                                        var rayDirVector = unit.c_rayInfo[5].clone().sub(unit.c_rayInfo[4]);
                                        var offDeg = steer.Vector.angleBetween(hitDirVector, rayDirVector) * 4;
                                        resultVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI - offDeg)));
                                        if (ddinfo) {
                                            ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_SIDE;
                                            ddinfo.avoidForce = resultVec.clone();
                                            ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (resultVec.isZero()) {
                    if (ddinfo) {
                        ddinfo.avoidForce = null;
                        ddinfo.avoidHitLoc = null;
                    }
                }
                return resultVec.div(200);
            };

            AvoidControls.predictFutureHitDist = function (unit, other) {
                var relVelocity = steer.Vector.sub(other.averageVelocity(), unit.averageVelocity());
                var relSpeed = relVelocity.mag();

                if (relSpeed == 0)
                    return 0;
                var relTangent = steer.Vector.div(relVelocity, relSpeed);
                var unitFrontAdd = unit.averageVelocity().clone().normalizeThanMult(unit.radius);
                var otherFrontAdd = other.averageVelocity().clone().normalizeThanMult(other.radius);
                var relLocation = steer.Vector.sub(unit.getb2Position().add(unitFrontAdd), other.getb2Position().add(otherFrontAdd));

                var projection = relTangent.dot(relLocation);
                return (projection / relSpeed);
            };
            return AvoidControls;
        })();
        controls.AvoidControls = AvoidControls;
    })(steer.controls || (steer.controls = {}));
    var controls = steer.controls;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (controls) {
        var PathAreaControls = (function () {
            function PathAreaControls() {
            }
            PathAreaControls.initPathUnit = function (unit, path, initOnshortestPt, loopOnPath, pathSeekAheadAmt) {
                if (typeof initOnshortestPt === "undefined") { initOnshortestPt = true; }
                if (typeof loopOnPath === "undefined") { loopOnPath = false; }
                if (typeof pathSeekAheadAmt === "undefined") { pathSeekAheadAmt = 1; }
                var closeDist = Number.MAX_VALUE;
                var closestPt;
                var closeIndex = 0;
                var ptSize = path.segments.length;
                if (initOnshortestPt) {
                    for (var s = 0; s < ptSize; s++) {
                        var dist = steer.Vector.distanceSq(unit.getb2Position(), path.segments[s]);
                        if (dist < closeDist) {
                            closeDist = dist;
                            closestPt = path.segments[s];
                            closeIndex = s;
                        }
                    }
                }
                unit.pathAtIndex = closeIndex;
                unit.loopOnPath = loopOnPath;
                unit.pathSeekAheadAmt = pathSeekAheadAmt;
            };

            PathAreaControls.followPath = function (unit, path) {
                if (unit.pathAtIndex + 1 >= path.segments.length && unit.loopOnPath == false) {
                    var lastPathPoint = path.segments[path.segments.length - 1];
                    return controls.Behavior.arrival(unit, lastPathPoint);
                }

                var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);

                var ahead = unit.velocity.clone();
                ahead.normalizeThanMult(unit.maxSpeed * unit.pathVelocityRatio);
                if (ddinfo != null)
                    ddinfo.pathPredict = ahead.clone();
                var predictLoc = steer.Vector.add(unit.getb2Position(), ahead);

                var pathPt1 = path.segments[unit.pathAtIndex];
                var pathPt2 = (path.segments[unit.pathAtIndex + 1]) ? path.segments[unit.pathAtIndex + 1] : path.segments[0];

                var normalPoint = steer.Vector.getNormalPoint(predictLoc, pathPt1, pathPt2);
                if (ddinfo != null)
                    ddinfo.pathNormal = normalPoint.clone().sub(unit.getb2Position());

                var furtherPts = path.segments.concat(path.segments);
                var shortest = Number.MAX_VALUE;
                var shortestIndex = -1;
                var shortestPt;
                for (var f = 1; f < (unit.pathSeekAheadAmt + 1); f++) {
                    var loopDist = steer.Vector.distanceSq(unit.getb2Position(), furtherPts[unit.pathAtIndex + f]);
                    if (furtherPts[unit.pathAtIndex + f]) {
                        if (loopDist < shortest) {
                            shortest = loopDist;
                            shortestIndex = unit.pathAtIndex + f;
                            shortestPt = furtherPts[unit.pathAtIndex + f];
                        }
                    }
                }
                var maxRange = (unit.radius + path.pathWidth);
                if (steer.Vector.distance(unit.getb2Position(), shortestPt) <= (maxRange)) {
                    if (unit.pathAtIndex < path.segments.length) {
                        unit.pathAtIndex = shortestIndex;
                        if (unit.pathAtIndex >= path.segments.length) {
                            if (unit.loopOnPath)
                                unit.pathAtIndex = 0;
                        }
                    }
                }

                var frontLoc = steer.Vector.fromAngle(steer.MathUtil.angleBtweenPt(pathPt1, pathPt2), unit.maxSpeed * unit.pathOnFrontRatio);
                var pathdv = steer.Vector.sub(pathPt2, pathPt1);
                var normaldv = steer.Vector.sub(normalPoint, pathPt1);

                var distPt12 = steer.Vector.sub(pathPt2, pathPt1).mag();
                var distUnitPt2 = steer.Vector.sub(pathPt2, unit.getb2Position()).mag();

                var target;

                if (steer.Vector.angleBetween(pathdv, normaldv) > 1.5707) {
                    target = steer.Vector.add(pathPt1, frontLoc);
                    if (ddinfo != null)
                        ddinfo.pathOnFront = target.clone().sub(unit.getb2Position());
                    return controls.Behavior.seek(unit, target);
                } else if (distUnitPt2 * .5 > distPt12 || unit.velocity.mag() < unit.maxSpeed * .5) {
                    target = pathPt2;
                    if (ddinfo != null)
                        ddinfo.pathOnFront = target.clone().sub(unit.getb2Position());
                    return controls.Behavior.seek(unit, target);
                } else {
                    target = steer.Vector.add(normalPoint, frontLoc);
                    if (ddinfo != null)
                        ddinfo.pathOnFront = target.clone().sub(unit.getb2Position());
                    var distance = steer.Vector.distance(predictLoc, normalPoint) + unit.radius;

                    if (distance > (path.pathWidth) * 0.5 || unit.velocity.mag() < (unit.maxSpeed * .5)) {
                        return controls.Behavior.seek(unit, target);
                    }
                }
                return new steer.Vector(0, 0);
            };

            PathAreaControls.gridmapForce = function (unit, gridmap) {
                if (gridmap.velocityData == null)
                    return new steer.Vector();

                var unitCir = { x: unit.getb2X(), y: unit.getb2Y(), r: unit.radius };
                var gridmapRec = { x: gridmap.x, y: gridmap.y, w: gridmap.w, h: gridmap.h };
                if (steer.MathUtil.rectCircleCollide(unitCir, gridmapRec)) {
                    var sx = unit.getb2X() - gridmap.x - unit.radius;
                    var ex = sx + (unit.radius * 2);
                    var sy = unit.getb2Y() - gridmap.y - unit.radius;
                    var ey = sy + (unit.radius * 2);
                    var xspos = Math.floor(sx / gridmap.blockSize.x);
                    var xepos = Math.floor(ex / gridmap.blockSize.x);
                    var yspos = Math.floor(sy / gridmap.blockSize.y);
                    var yepos = Math.floor(ey / gridmap.blockSize.y);
                    if (xspos < 0)
                        xspos = 0;
                    if (yspos < 0)
                        yspos = 0;
                    if (xspos >= gridmap.gridSize.x)
                        xspos = gridmap.gridSize.x;
                    if (yspos >= gridmap.gridSize.y)
                        yspos = gridmap.gridSize.y;
                    if (xspos == xepos)
                        xepos += 1;
                    if (yspos == yepos)
                        yepos += 1;

                    var addCount = 0;
                    var addForce = new steer.Vector();
                    for (var lx = xspos; lx < xepos; lx++) {
                        for (var ly = yspos; ly < yepos; ly++) {
                            if (lx > -1 && ly > -1 && lx < gridmap.gridSize.x && ly < gridmap.gridSize.y) {
                                if (gridmap.velocityData[lx][ly]) {
                                    addForce.add(gridmap.velocityData[lx][ly]);
                                    addCount++;
                                }
                            }
                        }
                    }

                    addForce.div(addCount);
                    return addForce;
                }

                return new steer.Vector();
            };
            return PathAreaControls;
        })();
        controls.PathAreaControls = PathAreaControls;
    })(steer.controls || (steer.controls = {}));
    var controls = steer.controls;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (controls) {
        var Behavior = (function () {
            function Behavior() {
            }
            Behavior.seek = function (unit, vector) {
                return controls.BasicControls.seek(unit, vector);
            };

            Behavior.avoidObstacle = function (unit) {
                return controls.AvoidControls.avoidObstacle(unit);
            };

            Behavior.flee = function (unit, vector) {
                return controls.BasicControls.flee(unit, vector);
            };

            Behavior.pursuit = function (unit, target) {
                return controls.BasicControls.pursuit(unit, target);
            };

            Behavior.evade = function (unit, target) {
                return controls.BasicControls.evade(unit, target);
            };

            Behavior.arrival = function (unit, vector, slowDownRatio) {
                if (typeof slowDownRatio === "undefined") { slowDownRatio = 2; }
                return controls.BasicControls.arrival(unit, vector, slowDownRatio);
            };

            Behavior.separation = function (unit, list) {
                return controls.BasicControls.separation(unit, list);
            };

            Behavior.align = function (unit, list) {
                return controls.BasicControls.align(unit, list);
            };

            Behavior.cohesion = function (unit, list) {
                return controls.BasicControls.cohesion(unit, list);
            };

            Behavior.initPathUnit = function (unit, path, initOnshortestPt, loopOnPath, pathSeekAheadAmt) {
                if (typeof initOnshortestPt === "undefined") { initOnshortestPt = true; }
                if (typeof loopOnPath === "undefined") { loopOnPath = false; }
                if (typeof pathSeekAheadAmt === "undefined") { pathSeekAheadAmt = 1; }
                return controls.PathAreaControls.initPathUnit(unit, path, initOnshortestPt, loopOnPath, pathSeekAheadAmt);
            };

            Behavior.followPath = function (unit, path) {
                return controls.PathAreaControls.followPath(unit, path);
            };

            Behavior.initWander = function (unit, wanderRadius, wanderRatioDeg) {
                return controls.BasicControls.initWander(unit, wanderRadius, wanderRatioDeg);
            };

            Behavior.wander = function (unit) {
                return controls.BasicControls.wander(unit);
            };

            Behavior.unalignedAvoidance = function (unit, list) {
                return new steer.Vector();
            };

            Behavior.avoidUnit = function (unit, list) {
                return controls.AvoidControls.avoidUnit(unit, list);
            };

            Behavior.gridmapForce = function (unit, grid) {
                return controls.PathAreaControls.gridmapForce(unit, grid);
            };
            return Behavior;
        })();
        controls.Behavior = Behavior;
    })(steer.controls || (steer.controls = {}));
    var controls = steer.controls;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (render) {
        var DebugColors = (function () {
            function DebugColors() {
            }
            DebugColors.rgbaToHex = function (rgba) {
                var rgbData = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                return (rgbData && rgbData.length === 4) ? "#" + ("0" + parseInt(rgbData[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgbData[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgbData[3], 10).toString(16)).slice(-2) : '';
            };

            DebugColors.hexToRgba = function (hex, opacity) {
                hex = hex.replace('#', '');
                var r = parseInt(hex.substring(0, 2), 16);
                var g = parseInt(hex.substring(2, 4), 16);
                var b = parseInt(hex.substring(4, 6), 16);
                var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
                return result;
            };
            DebugColors.DC_PATH_FILL = 0x9650A0;
            DebugColors.DC_PATH_FILL_SA = 0.4;
            DebugColors.DC_PATH_FILL_A = 0.1;
            DebugColors.DC_PATH_GUIDE = 0x33FFFF;
            DebugColors.DC_PATH_GUIDE_A = 0.3;
            DebugColors.DC_PATH_GUIDE_A2 = 0.2;

            DebugColors.DC_WANDER = 0x969696;
            DebugColors.DC_WANDER_A = 0.5;
            DebugColors.DC_ALIGNMENT = 0x50825A;
            DebugColors.DC_ALIGNMENT_A = 0.3;
            DebugColors.DC_COHESION = 0x5A8282;
            DebugColors.DC_COHESION_A = 0.3;
            DebugColors.DC_SEPARATION = 0xE65050;
            DebugColors.DC_SEPARATION_A = 0.3;
            DebugColors.DC_RAYCAST = 0x1E8C1E;
            DebugColors.DC_RAYCAST_A = 0.3;
            DebugColors.DC_STATIC = 0x606060;
            DebugColors.DC_STATIC_A = 0.3;
            DebugColors.DC_DYNAMIC = 0xA0A0A0;
            DebugColors.DC_DYNAMIC_A = 0.3;
            DebugColors.DC_QUAD = 0x55CCCC;
            DebugColors.DC_QUAD_A = 0.5;
            DebugColors.DC_SENSOR = 0xFFDD88;
            DebugColors.DC_SENSOR_A = 0.3;
            DebugColors.DC_SENSOR_STATIC = 0xFFDD88;
            DebugColors.DC_SENSOR_STATIC_A = 0.1;
            DebugColors.DC_GRID = 0x66FFFF;
            DebugColors.DC_GRID_A = 0.1;
            DebugColors.DC_GRID_BLOCK = 0x66FFFF;
            DebugColors.DC_GRID_BLOCK_A = 0.1;

            DebugColors.DC_AVOID_FRONT = 0xDD9999;
            DebugColors.DC_AVOID_SIDE = 0xFFDD66;
            DebugColors.DC_AVOID_PARALLEL = 0x6699DD;
            return DebugColors;
        })();
        render.DebugColors = DebugColors;
    })(steer.render || (steer.render = {}));
    var render = steer.render;
})(steer || (steer = {}));
var steer;
(function (steer) {
    (function (render) {
        var DebugDrawInfo = (function () {
            function DebugDrawInfo(toItem) {
                if (typeof toItem === "undefined") { toItem = null; }
                this.drawMask = DebugDrawInfo.SHOW_FILL | DebugDrawInfo.SHOW_EDGE;
                if (toItem)
                    this.toItemName = toItem.name;
            }
            DebugDrawInfo.create = function (item) {
                var newOne = new DebugDrawInfo(item);
                DebugDrawInfo.allInfos[item.name] = newOne;
                return newOne;
            };

            DebugDrawInfo.exist = function (item) {
                if (DebugDrawInfo.allInfos[item.name])
                    return true;
                return false;
            };

            DebugDrawInfo.getAlpha = function (item, defaultAlpha) {
                if (DebugDrawInfo.allInfos[item.name]) {
                    if (DebugDrawInfo.allInfos[item.name].alpha) {
                        return DebugDrawInfo.allInfos[item.name].alpha;
                    }
                }
                return defaultAlpha;
            };
            DebugDrawInfo.getColor = function (item, defaultColor) {
                if (DebugDrawInfo.allInfos[item.name]) {
                    if (DebugDrawInfo.allInfos[item.name].color) {
                        return DebugDrawInfo.allInfos[item.name].color;
                    }
                }
                return defaultColor;
            };

            DebugDrawInfo.getInfo = function (item) {
                if (DebugDrawInfo.allInfos[item.name]) {
                    return DebugDrawInfo.allInfos[item.name];
                }
                return null;
            };
            DebugDrawInfo.SHOW_FILL = 1;
            DebugDrawInfo.SHOW_EDGE = 2;
            DebugDrawInfo.UNIT_SEPARATION = 4;
            DebugDrawInfo.UNIT_ALIGNMENT = 8;
            DebugDrawInfo.UNIT_COHESION = 16;
            DebugDrawInfo.UNIT_RAYCAST = 32;
            DebugDrawInfo.UNIT_WANDER = 64;
            DebugDrawInfo.UNIT_PATH_INFO = 128;
            DebugDrawInfo.BOUNDING_BOX = 256;
            DebugDrawInfo.AVOID_FORCE = 512;

            DebugDrawInfo.allInfos = {};
            return DebugDrawInfo;
        })();
        render.DebugDrawInfo = DebugDrawInfo;
    })(steer.render || (steer.render = {}));
    var render = steer.render;
})(steer || (steer = {}));
var steer;
(function (steer) {
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
                } else {
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
                    if (item.c_velocityLength >= 0.8) {
                        for (var s = 0; s < rayPts.length; s += 2) {
                            var ix = item.getb2X();
                            var iy = item.getb2Y();
                            g.moveTo(rayPts[s].x - ix - 0.5, rayPts[s].y - iy - 0.5);
                            g.lineTo(rayPts[s + 1].x - ix - 0.5, rayPts[s + 1].y - iy - 0.5);
                        }
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
                        g.lineStyle(0.05, render.DebugColors.DC_PATH_GUIDE, render.DebugColors.DC_PATH_GUIDE_A);
                        g.drawCircle(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5, 0.05);
                        g.drawCircle(ddinfo.pathNormal.x - .5, ddinfo.pathNormal.y - .5, 0.05);
                        g.moveTo(-.5, -.5);
                        g.lineTo(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5);
                        g.lineTo(ddinfo.pathNormal.x - .5, ddinfo.pathNormal.y - .5);

                        g.drawCircle(ddinfo.pathOnFront.x - .5, ddinfo.pathOnFront.y - .5, 0.1);
                        g.moveTo(ddinfo.pathPredict.x - .5, ddinfo.pathPredict.y - .5);
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
                } else {
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
                if (typeof radius === "undefined") { radius = 0.03; }
                if (typeof alpha === "undefined") { alpha = 1; }
                var g = this.guideGrahpic;

                g.lineStyle(0.03, color, alpha);
                g.drawCircle(position.x - 0.5, position.y - 0.5, radius);
                g.endFill();
            };
            PixiDebugRenderer.prototype.drawSegment = function (fromPos, toPos, color, width, alpha) {
                if (typeof width === "undefined") { width = 0.03; }
                if (typeof alpha === "undefined") { alpha = 1; }
                var g = this.guideGrahpic;
                g.lineStyle(width, color, alpha);
                g.moveTo(fromPos.x - 0.5, fromPos.y - 0.5);
                g.lineTo(toPos.x - 0.5, toPos.y - 0.5);
            };
            PixiDebugRenderer.prototype.drawRectangle = function (x, y, w, h, color, alpha, width) {
                if (typeof width === "undefined") { width = 0.03; }
                var g = this.guideGrahpic;
                g.lineStyle(width, color, alpha);
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
    })(steer.render || (steer.render = {}));
    var render = steer.render;
})(steer || (steer = {}));

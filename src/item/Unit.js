var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var steer;
(function (steer) {
    var item;
    (function (item) {
        var Unit = (function (_super) {
            __extends(Unit, _super);
            function Unit(b2Body, radius, maxSpeed, maxForce, name) {
                if (maxSpeed === void 0) { maxSpeed = 10; }
                if (maxForce === void 0) { maxForce = 1; }
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
                if (mult === void 0) { mult = 1; }
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
                if (useGlobal === void 0) { useGlobal = false; }
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
                        for (var s = 0; s < rayInfo.length; s += 2) {
                            bodyAABB.Combine1({ lowerBound: rayInfo[s], upperBound: rayInfo[s + 1] });
                            bodyAABB.Combine1({ lowerBound: rayInfo[s + 1], upperBound: rayInfo[s] });
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
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

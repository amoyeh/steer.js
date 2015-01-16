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
                this.force = force;
                this.forceAngle = this.force.heading();
            };
            Sensor.prototype.asForcePushCenter = function (forceMagnitude) {
                this.forceType = Sensor.FORCE_PUSH_CENTER;
                this.forceMagnitude = forceMagnitude;
            };
            Sensor.prototype.asForcePullCenter = function (forceMagnitude) {
                this.forceType = Sensor.FORCE_PULL_CENTER;
                this.forceMagnitude = forceMagnitude;
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
                            unit.applyForce(steer.Vector.fromAngle(this.force.heading() + this.b2body.GetAngle(), this.force.mag()));
                            break;
                        case Sensor.FORCE_PUSH_CENTER:
                            var angleVec = steer.Vector.sub(unit.getb2Position(), this.getb2Position());
                            unit.applyForce(angleVec.normalizeThanMult(this.forceMagnitude));
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
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

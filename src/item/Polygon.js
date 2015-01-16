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
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

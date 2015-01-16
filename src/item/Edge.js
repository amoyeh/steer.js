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
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

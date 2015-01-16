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
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

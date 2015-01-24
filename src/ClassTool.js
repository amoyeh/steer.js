box2d.RaycastCallback = function () {
    box2d.b2RayCastCallback.call(this); // base class constructor
    this.m_point = new box2d.b2Vec2();
    this.m_normal = new box2d.b2Vec2();
}
goog.inherits(box2d.RaycastCallback, box2d.b2RayCastCallback);
box2d.RaycastCallback.prototype.m_hit = false;
box2d.RaycastCallback.prototype.m_point = null;
box2d.RaycastCallback.prototype.m_normal = null;
box2d.RaycastCallback.prototype.fixture = null;
box2d.RaycastCallback.prototype.ptStart = null;
box2d.RaycastCallback.prototype.ptEnd = null;
box2d.RaycastCallback.prototype.ReportFixture = function (fixture, point, normal, fraction) {
    var body = fixture.GetBody();
    this.m_hit = true;
    this.fixture = fixture;
    this.m_point.Copy(point);
    this.m_normal.Copy(normal);
    return fraction;
}

//(function () {
//    var lastTime = 0;
//    var vendors = ['ms', 'moz', 'webkit', 'o'];
//    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
//        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
//                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
//    }
//    if (!window.requestAnimationFrame)
//        window.requestAnimationFrame = function (callback, element) {
//            var currTime = new Date().getTime();
//            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//            var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
//            lastTime = currTime + timeToCall;
//            return id;
//        };
//    if (!window.cancelAnimationFrame)
//        window.cancelAnimationFrame = function (id) {
//            clearTimeout(id);
//        };
//}())
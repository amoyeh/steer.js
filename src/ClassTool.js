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
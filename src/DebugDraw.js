goog.provide('DebugDraw');
goog.require('box2d');
goog.require('goog.string.format');
DebugDraw = function (canvas) {
    box2d.b2Draw.call(this); // base class constructor
    this.m_canvas = canvas;
    this.m_ctx = (this.m_canvas.getContext("2d"));
    this.m_settings = { canvasScale: 1, viewZoom: 1 };
}
goog.inherits(DebugDraw, box2d.b2Draw);
DebugDraw.prototype.m_canvas = null;
DebugDraw.prototype.m_ctx = null;
DebugDraw.prototype.m_settings = null;
DebugDraw.prototype.PushTransform = function (xf) {
    var ctx = this.m_ctx;
    ctx.save();
    ctx.scale(30, 30);
    ctx.translate(xf.p.x, xf.p.y);
    ctx.rotate(xf.q.GetAngleRadians());
}
DebugDraw.prototype.PopTransform = function (xf) {
    var ctx = this.m_ctx;
    ctx.restore();
}
DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
    if (!vertexCount) return;
    var ctx = this.m_ctx;
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i < vertexCount; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
};
DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
    if (!vertexCount) return;
    var ctx = this.m_ctx;
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var i = 1; i < vertexCount; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = color.MakeStyleString(0.5);
    ctx.fill();
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
};
DebugDraw.prototype.DrawCircle = function (center, radius, color) {

    if (!radius) return;

    var ctx = this.m_ctx;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true);
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.lineWidth = 0.03;
    ctx.stroke();
};
DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
    if (!radius) return;
    var ctx = this.m_ctx;
    var cx = center.x;
    var cy = center.y;
    ctx.lineWidth = 0.03;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, box2d.b2_pi * 2, true);
    ctx.moveTo(cx, cy);
    ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
    ctx.fillStyle = color.MakeStyleString(0.5);
    ctx.fill();
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.stroke();
};
DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
    var ctx = this.m_ctx;
    ctx.lineWidth = 0.03;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.stroke();
};
DebugDraw.prototype.DrawTransform = function (xf) {
    var ctx = this.m_ctx;

    this.PushTransform(xf);
    ctx.scale(0.03, 0.03);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(1, 0);
    ctx.strokeStyle = box2d.b2Color.RED.MakeStyleString(1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 1);
    ctx.strokeStyle = box2d.b2Color.GREEN.MakeStyleString(1);
    ctx.stroke();

    this.PopTransform(xf);
};
DebugDraw.prototype.DrawPoint = function (p, size, color) {
    var ctx = this.m_ctx;
    ctx.fillStyle = color.MakeStyleString();
    size /= this.m_settings.viewZoom;
    size /= this.m_settings.canvasScale;
    var hsize = size / 2;
    ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
}
DebugDraw.prototype.DrawString = function (x, y, format, var_args) {
    var ctx = this.m_ctx;

    var args = Array.prototype.slice.call(arguments);
    var string = goog.string.format.apply(null, args.slice(2));

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = '18pt helvetica';//'9pt lucida console';
    var color = DebugDraw.prototype.DrawString.s_color;
    ctx.fillStyle = color.MakeStyleString();
    ctx.fillText(string, x, y);
    ctx.restore();
}
DebugDraw.prototype.DrawString.s_color = new box2d.b2Color(0.9, 0.6, 0.6);
DebugDraw.prototype.DrawStringWorld = function (x, y, format, var_args) {
    var p = DebugDraw.prototype.DrawStringWorld.s_p.SetXY(x, y);

    // world -> viewport
    var vt = this.m_settings.viewCenter;
    box2d.b2SubVV(p, vt, p);
    var vr = this.m_settings.viewRotation;
    box2d.b2MulTRV(vr, p, p);
    var vs = this.m_settings.viewZoom;
    box2d.b2MulSV(vs, p, p);

    // viewport -> canvas
    var cs = this.m_settings.canvasScale;
    box2d.b2MulSV(cs, p, p);
    p.y *= -1;
    var cc = DebugDraw.prototype.DrawStringWorld.s_cc.SetXY(0.5 * this.m_canvas.width, 0.5 * this.m_canvas.height);
    box2d.b2AddVV(p, cc, p);

    var ctx = this.m_ctx;

    var args = Array.prototype.slice.call(arguments);
    var string = goog.string.format.apply(null, args.slice(2));

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = '18pt helvetica';//'9pt lucida console';
    var color = DebugDraw.prototype.DrawStringWorld.s_color;
    ctx.fillStyle = color.MakeStyleString();
    ctx.fillText(string, p.x, p.y);
    ctx.restore();
}
DebugDraw.prototype.DrawStringWorld.s_p = new box2d.b2Vec2();
DebugDraw.prototype.DrawStringWorld.s_cc = new box2d.b2Vec2();
DebugDraw.prototype.DrawStringWorld.s_color = new box2d.b2Color(0.5, 0.9, 0.5);
DebugDraw.prototype.DrawAABB = function (aabb, color) {
    var ctx = this.m_ctx;
    ctx.strokeStyle = color.MakeStyleString();
    ctx.lineWidth = 0.03;
    var x = aabb.lowerBound.x;
    var y = aabb.lowerBound.y;
    var w = aabb.upperBound.x - aabb.lowerBound.x;
    var h = aabb.upperBound.y - aabb.lowerBound.y;
    ctx.strokeRect(x, y, w, h);
}
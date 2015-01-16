var steer;
(function (steer) {
    var controls;
    (function (controls) {
        var PathAreaControls = (function () {
            function PathAreaControls() {
            }
            PathAreaControls.initPathUnit = function (unit, path, initOnshortestPt, loopOnPath, pathSeekAheadAmt) {
                if (initOnshortestPt === void 0) { initOnshortestPt = true; }
                if (loopOnPath === void 0) { loopOnPath = false; }
                if (pathSeekAheadAmt === void 0) { pathSeekAheadAmt = 1; }
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
                    return controls.Behavior.arrive(unit, lastPathPoint);
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
                }
                else if (distUnitPt2 * .5 > distPt12 || unit.velocity.mag() < unit.maxSpeed * .5) {
                    target = pathPt2;
                    if (ddinfo != null)
                        ddinfo.pathOnFront = target.clone().sub(unit.getb2Position());
                    return controls.Behavior.seek(unit, target);
                }
                else {
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
    })(controls = steer.controls || (steer.controls = {}));
})(steer || (steer = {}));

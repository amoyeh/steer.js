module steer.controls {

    export class PathAreaControls {

        static initPathUnit(unit: item.Unit, path: item.Path, initOnshortestPt: boolean = true, loopOnPath: boolean = false, pathSeekAheadAmt: number= 1): void {
            var closeDist: number = Number.MAX_VALUE;
            var closestPt: Vector;
            var closeIndex: number = 0;
            var ptSize: number = path.segments.length;
            if (initOnshortestPt) {
                for (var s: number = 0; s < ptSize; s++) {
                    var dist: number = Vector.distanceSq(unit.getb2Position(), path.segments[s]);
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
        }

        static followPath(unit: item.Unit, path: item.Path): Vector {

            //at last index using arrive when not looping
            if (unit.pathAtIndex + 1 >= path.segments.length && unit.loopOnPath == false) {
                var lastPathPoint: Vector = path.segments[path.segments.length - 1];
                return Behavior.arrival(unit, lastPathPoint);
            }

            var ddinfo: render.DebugDrawInfo = render.DebugDrawInfo.getInfo(unit);

            ///the unit future predict location
            var ahead: Vector = unit.velocity.clone();
            ahead.normalizeThanMult(unit.maxSpeed * unit.pathVelocityRatio);
            if (ddinfo != null) ddinfo.pathPredict = ahead.clone();
            var predictLoc: Vector = Vector.add(unit.getb2Position(), ahead);

            //PixiDebugRender.instance.drawDot(predictLoc, 0x0066FF, 0.05, 1);
            //PixiDebugRender.instance.drawSegment(unit.getb2Position(), predictLoc, 0x00FFFF, 0.05, 0.5);

            //the perpendicular point between predict point and the point on bezier
            var pathPt1: Vector = path.segments[unit.pathAtIndex];
            var pathPt2: Vector = (path.segments[unit.pathAtIndex + 1]) ? path.segments[unit.pathAtIndex + 1] : path.segments[0];
            //PixiDebugRender.instance.drawDot(pathPt1, 0x00CC11, 0.05, 0.5);
            //PixiDebugRender.instance.drawDot(pathPt2, 0x00CC11, 0.05, 0.5);
            var normalPoint: Vector = Vector.getNormalPoint(predictLoc, pathPt1, pathPt2);
            if (ddinfo != null) ddinfo.pathNormal = normalPoint.clone().sub(unit.getb2Position());
            //PixiDebugRender.instance.drawDot(normalPoint, 0x66CC99, 0.05, 0.5);
            //PixiDebugRender.instance.drawSegment(predictLoc, normalPoint, 0x00FFFF, 0.05, 0.5);
            //PixiDebugRender.instance.drawSegment(normalPoint, pathPt1, 0x00FFFF, 0.05, 0.5);

            //if we reach the destination ahead, seek cloest point ahead
            var furtherPts: Vector[] = path.segments.concat(path.segments);
            var shortest: number = Number.MAX_VALUE;
            var shortestIndex: number = -1;
            var shortestPt: Vector;
            for (var f: number = 1; f < (unit.pathSeekAheadAmt + 1); f++) {
                var loopDist: number = Vector.distanceSq(unit.getb2Position(), furtherPts[unit.pathAtIndex + f]);
                if (furtherPts[unit.pathAtIndex + f]) {
                    if (loopDist < shortest) {
                        shortest = loopDist;
                        shortestIndex = unit.pathAtIndex + f;
                        shortestPt = furtherPts[unit.pathAtIndex + f];
                    }
                }
            }
            var maxRange: number = (unit.radius + path.pathWidth);
            if (Vector.distance(unit.getb2Position(), shortestPt) <= (maxRange)) {
                if (unit.pathAtIndex < path.segments.length) {
                    unit.pathAtIndex = shortestIndex;
                    if (unit.pathAtIndex >= path.segments.length) {
                        if (unit.loopOnPath) unit.pathAtIndex = 0;
                    }
                }
            }

            //the target point to seek (the future point on the path)
            var frontLoc: Vector = Vector.fromAngle(MathUtil.angleBtweenPt(pathPt1, pathPt2), unit.maxSpeed * unit.pathOnFrontRatio);
            var pathdv: steer.Vector = Vector.sub(pathPt2, pathPt1);
            var normaldv: steer.Vector = Vector.sub(normalPoint, pathPt1);

            var distPt12: number = Vector.sub(pathPt2, pathPt1).mag();
            var distUnitPt2: number = Vector.sub(pathPt2, unit.getb2Position()).mag();

            var target: Vector;
            //if the normal point is opposide direction (1.5707-> 90degree) from the path point, we use path point1 as normal and seek to it
            if (Vector.angleBetween(pathdv, normaldv) > 1.5707) {
                target = Vector.add(pathPt1, frontLoc);
                if (ddinfo != null) ddinfo.pathOnFront = target.clone().sub(unit.getb2Position());
                return Behavior.seek(unit, target);
            } else if (distUnitPt2 * .5 > distPt12 || unit.velocity.mag() < unit.maxSpeed * .5) {
                target = pathPt2;
                if (ddinfo != null) ddinfo.pathOnFront = target.clone().sub(unit.getb2Position());
                return Behavior.seek(unit, target);
            } else {
                target = Vector.add(normalPoint, frontLoc);
                if (ddinfo != null) ddinfo.pathOnFront = target.clone().sub(unit.getb2Position());
                var distance: number = Vector.distance(predictLoc, normalPoint) + unit.radius;
                //return UnitBehavior.seek  if we are in the path area, if speed is too slow also seek
                if (distance > (path.pathWidth) * 0.5 || unit.velocity.mag() < (unit.maxSpeed * .5)) {
                    return Behavior.seek(unit, target);
                }
            }
            return new Vector(0, 0);
        }

        static gridmapForce(unit: item.Unit, gridmap: item.GridMap): Vector {

            if (gridmap.velocityData == null) return new Vector();

            var unitCir: any = { x: unit.getb2X(), y: unit.getb2Y(), r: unit.radius };
            var gridmapRec: any = { x: gridmap.x, y: gridmap.y, w: gridmap.w, h: gridmap.h };
            if (MathUtil.rectCircleCollide(unitCir, gridmapRec)) {
                var sx: number = unit.getb2X() - gridmap.x - unit.radius;
                var ex: number = sx + (unit.radius * 2);
                var sy: number = unit.getb2Y() - gridmap.y - unit.radius;
                var ey: number = sy + (unit.radius * 2);
                var xspos: number = Math.floor(sx / gridmap.blockSize.x);
                var xepos: number = Math.floor(ex / gridmap.blockSize.x);
                var yspos: number = Math.floor(sy / gridmap.blockSize.y);
                var yepos: number = Math.floor(ey / gridmap.blockSize.y);
                if (xspos < 0) xspos = 0;
                if (yspos < 0) yspos = 0;
                if (xspos >= gridmap.gridSize.x) xspos = gridmap.gridSize.x;
                if (yspos >= gridmap.gridSize.y) yspos = gridmap.gridSize.y;
                if (xspos == xepos) xepos += 1;
                if (yspos == yepos) yepos += 1;
                //console.log(xspos + " , " + xepos+" | "+yspos+" , "+yepos);
                var addCount: number = 0;
                var addForce: Vector = new Vector();
                for (var lx: number = xspos; lx < xepos; lx++) {
                    for (var ly: number = yspos; ly < yepos; ly++) {
                        if (lx > -1 && ly > -1 && lx < gridmap.gridSize.x && ly < gridmap.gridSize.y) {
                            if (gridmap.velocityData[lx][ly]) {
                                addForce.add(gridmap.velocityData[lx][ly]);
                                addCount++;
                            }
                        }
                    }
                }
                //console.log(addForce);
                addForce.div(addCount);
                return addForce;
            }

            return new Vector();
        }

    }

} 
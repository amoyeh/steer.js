module steer.controls {

    export class AvoidControls {

        static avoidObstacle(unit: item.Unit): steer.Vector {

            //get front left and right ray 
            var hitCallbacks: box2d.RaycastCallback[] = [];
            var rayInfo: steer.Vector[] = unit.c_rayInfo;
            //[0,1]adding angle point.
            //[2,3]subtract angle point
            //[4,5]center direct point
            for (var s: number = 0; s < rayInfo.length; s += 2) {
                //starting  & ending points in ray
                var callBack: box2d.RaycastCallback = new box2d.RaycastCallback();
                callBack.ptStart = rayInfo[s].makeB2Vec();
                callBack.ptEnd = rayInfo[s + 1].makeB2Vec();
                unit.domain.b2World.RayCast(callBack, callBack.ptStart, callBack.ptEnd);
                if (callBack.m_hit) {
                    hitCallbacks.push(callBack);
                }
            }

            //get the shortest points from ray
            var shortestPt: box2d.b2Vec2;
            var shortestNormal: box2d.b2Vec2;
            var shortestFixture: box2d.b2Fixture;
            var rayPtS: box2d.b2Vec2, rayPtE: box2d.b2Vec2;

            if (hitCallbacks.length > 0) {
                var shortestDist: number = 10000000;
                for (var k: number = 0; k < hitCallbacks.length; k++) {
                    var loopDist: number = Vector.distanceSq(hitCallbacks[k].m_point, unit.getb2Position());
                    if (loopDist < shortestDist) {
                        shortestDist = loopDist;
                        shortestPt = hitCallbacks[k].m_point;
                        shortestNormal = hitCallbacks[k].m_normal;
                        shortestFixture = hitCallbacks[k].fixture;
                        rayPtS = hitCallbacks[k].ptStart;
                        rayPtE = hitCallbacks[k].ptEnd;
                    }
                }

                //the normal point from the surface (for display only)
                //var normalExtendPt: box2d.b2Vec2 = box2d.b2AddVV(shortestPt, box2d.b2MulSV(1, shortestNormal, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                //PixiDebugRender.instance.drawDot(shortestPt, 0xCC6666);
                //PixiDebugRender.instance.drawDot(normalExtendPt, 0xCC6666);
                //PixiDebugRender.instance.drawSegment(shortestPt, normalExtendPt,0xCC6666);

                ////if it is circle, apply 90 degree prependicular force
                if (shortestFixture.GetType() == box2d.b2ShapeType.e_circleShape) {
                    //the force to push away when close, hardcoded number
                    var checkRange: number = unit.maxSpeed * unit.rayFrontRatio;
                    var distanceHitToUnit = checkRange - Vector.distance(shortestPt, unit.getb2Position());
                    if (distanceHitToUnit > 0) {

                        //get perpendicular point from circle center --> to unit's center ray (rayInfo[4], rayInfo[5])
                        var circlePos: box2d.b2Vec2 = shortestFixture.GetBody().GetPosition();
                        var ppt: Vector = Vector.getNormalPoint(Vector.fromb2Vec(circlePos), rayInfo[4], rayInfo[5]);
                        var futureppt: Vector = Vector.sub(ppt, unit.getb2Position()).normalizeThanMult(1).add(ppt);
                        //PixiDebugRender.instance.drawDot(ppt, 0xCC6666);
                        //PixiDebugRender.instance.drawDot(futureppt, 0xCC6666);

                        //push away force
                        var awayForce = checkRange - (checkRange - distanceHitToUnit);
                        var bounceAng: number = Vector.sub(futureppt, Vector.fromb2Vec(circlePos)).heading();
                        var resultForce: Vector = Vector.fromAngle(bounceAng).mult(awayForce);
                        //CanvasDebugRender.instance.drawSegment(Vector.fromb2Vec(circlePos), Vector.add(Vector.fromb2Vec(circlePos), resultForce));
                        return resultForce;
                    }
                    //when hit circle yet distance is far..
                    return new Vector();
                } else {

                    //reflection point and force , based on current heading and velocity
                    var normalHeading = -Math.atan2(-shortestNormal.y, shortestNormal.x);
                    var bounceAng = normalHeading * 2 - Math.PI - unit.velocity.heading();
                    var distToObstacle: number = Vector.distance(shortestPt, unit.getb2Position());
                    var awayForce: number = unit.c_velocityLength - distToObstacle;

                    var resultForce: Vector = Vector.fromAngle(bounceAng).mult(awayForce);
                    //CanvasDebugRender.instance.drawSegment(shortestPt, Vector.add(Vector.fromb2Vec(shortestPt), resultForce));
                    return resultForce;

                }

            }
            return new Vector(); //when hits nothing

        }

        static avoidUnit(unit: item.Unit, list: item.Unit[]): Vector {

            var len: number = list.length;
            var threat: item.Unit;
            var unitHitLocation: Vector;
            var threatHitLocation: Vector;
            var closestDist: number = Number.MAX_VALUE;
            for (var s: number = 0; s < len; s++) {
                if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                    var hitDist: number = AvoidControls.predictFutureHitDist(unit, list[s]);
                    //when to check and apply avoidance
                    //if future hit position is about half of both unit's velocity distance
                    var velocityCheckDist: number = (unit.c_velocityLength + list[s].c_velocityLength);
                    if (velocityCheckDist < 3) velocityCheckDist = 3;
                    if ((hitDist > 0) && (hitDist < velocityCheckDist)) {
                        // if the two will be close enough to collide
                        var collisionDangerThreshold: number = velocityCheckDist;
                        var compareResult = AvoidControls.computeFutureHitPos(unit, list[s], hitDist);
                        if (compareResult.distance < collisionDangerThreshold) {
                            //only store closest one as threat
                            if (hitDist < closestDist) {
                                closestDist = hitDist;
                                threat = list[s];
                                unitHitLocation = compareResult.unitLoc;
                                threatHitLocation = compareResult.otherLoc;

                            }
                        }
                    }
                }
            }
            var ddinfo = render.DebugDrawInfo.getInfo(unit);
            var resultVec: Vector = new Vector();
            var unitNormal: Vector = unit.velocity.clone().normalize();
            var sideVec: Vector = Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.5)));
            if (threat != null) {
                var threatNormal: Vector = threat.velocity.clone().normalize();
                //angle between threat's velocity and uit
                var parallelness: number = unitNormal.dot(threatNormal);
                var angle: number = 0.707; //about 45 degree  , 0.5235 = 30deg;
                if (parallelness < -angle) {

                    // other object is heading on the target, using threatHitLocation as avoid point
                    //-----------------------------------------------------------------------------
                    if (threatHitLocation.clone().sub(unit.getb2Position()).mag() <= ((unit.c_velocityLength + threat.c_velocityLength) * .4)) {
                        var offset: Vector = Vector.sub(threatHitLocation, unit.getb2Position());
                        var sideDot: number = offset.dot(sideVec);
                        resultVec = sideVec;
                    }
                    //-----------------------------------------------------------------------------
                    if (ddinfo) {
                        ddinfo.avoidColor = render.DebugColors.DC_AVOID_FRONT;
                        ddinfo.avoidForce = resultVec.clone();
                        ddinfo.avoidHitLoc = threatHitLocation.clone().sub(unit.getb2Position());
                    }
                    //PixiDebugRender.instance.drawSegment(unit.getb2Position(), threatHitLocation, 0xDD6666, 0.05, 1);
                    //var drawSide: Vector = sideVec.clone().add(unit.getb2Position());
                    //PixiDebugRender.instance.drawDot(drawSide, 0xDD9999, 0.05, 1);
                    //PixiDebugRender.instance.drawSegment(unit.getb2Position(), drawSide, 0xDD9999, 0.05, 1);
                } else {
                    if (parallelness > angle) {

                        //steer away only
                        //-----------------------------------------------------------------------------
                        //var offset: Vector = Vector.sub(threat.getb2Position(), unit.getb2Position());
                        //var angleBetween: number = offset.dot(sideVec);
                        //sideVec = Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.7)));
                        //if (angleBetween > 0) sideVec = Vector.fromAngle((unitNormal.heading() - (Math.PI * 0.7)));
                        //resultVec = sideVec;
                        //-----------------------------------------------------------------------------

                        //slow down and steer behind
                        //-----------------------------------------------------------------------------
                        var unitToDist: number = unit.getb2Position().distSq(unitHitLocation);
                        var threatToDist: number = threat.getb2Position().distSq(unitHitLocation);
                        if (unitToDist > threatToDist) {
                            var offset: Vector = Vector.sub(unitHitLocation, unit.getb2Position());
                            var angleBetween: number = offset.dot(sideVec);
                            //to the opposide off direction
                            resultVec = Vector.fromAngle((unitNormal.heading() + (Math.PI * 1.2)));
                            if (angleBetween > 0) resultVec = Vector.fromAngle((unitNormal.heading() - (Math.PI * 1.2)));
                            if (ddinfo) {
                                ddinfo.avoidColor = render.DebugColors.DC_AVOID_PARALLEL;
                                ddinfo.avoidForce = resultVec.clone();
                                ddinfo.avoidHitLoc = threatHitLocation.clone().sub(unit.getb2Position());
                            }
                            //PixiDebugRender.instance.drawSegment(unit.getb2Position(), threatHitLocation, 0xFFDD66, 0.05, 1);
                            //var drawSide: Vector = resultVec.clone().add(unit.getb2Position());
                            //PixiDebugRender.instance.drawDot(drawSide, 0xFFDD99, 0.05, 0.3);
                            //PixiDebugRender.instance.drawSegment(unit.getb2Position(), drawSide, 0xFFDD99, 0.05, 1);
                        }
                        //-----------------------------------------------------------------------------
                    } else {

                        //perpendicular way (bigger than 45 degree) slower down when too close
                        //-----------------------------------------------------------------------------
                        //first check if ray hit's other unit
                        var hitLoc: steer.Vector = null;
                        var lineCirHit = MathUtil.intersectCircleLine(unit.getb2Position(), unit.c_rayInfo[5], threat.getb2Position(), threat.radius);
                        if (lineCirHit.hit) {
                            hitLoc = lineCirHit.data[0];
                        } else {
                            //check if two unit's ray hits in the future
                            var lineHit = MathUtil.intersectLineLine(unit.getb2Position(), unit.c_rayInfo[5], threat.getb2Position(), threat.c_rayInfo[5]);
                            if (lineHit.hit) {
                                hitLoc = lineHit.data[0];
                            }
                        }
                        if (hitLoc) {
                            if (hitLoc.clone().sub(unit.getb2Position()).mag() < (unit.velocity.mag() * 4)) {
                                if (Vector.distanceSq(unit.getb2Position(), hitLoc) >= Vector.distanceSq(threat.getb2Position(), hitLoc)) {
                                    resultVec = Vector.fromAngle((unitNormal.heading() + (Math.PI * 1)));
                                    resultVec.mult(2);
                                    if (ddinfo) {
                                        ddinfo.avoidColor = render.DebugColors.DC_AVOID_SIDE;
                                        ddinfo.avoidForce = resultVec.clone();
                                        ddinfo.avoidHitLoc = threatHitLocation.clone().sub(unit.getb2Position());
                                    }
                                    //var drawSide: Vector = resultVec.clone().add(unit.getb2Position());
                                    //PixiDebugRender.instance.drawDot(hitLoc, 0x6699DD, 0.05, 1);
                                    //PixiDebugRender.instance.drawDot(drawSide, 0x6699DD, 0.05, 1);
                                    //PixiDebugRender.instance.drawSegment(unit.getb2Position(), drawSide, 0x6699DD, 0.05, 1);
                                }
                            }
                        }
                    }
                }
            }
            resultVec.div(2);
            if (resultVec.isZero()) {
                if (ddinfo) {
                    ddinfo.avoidForce = null;
                    ddinfo.avoidHitLoc = null;
                }
            }
            return resultVec;
        }

        static predictFutureHitDist(unit: item.Unit, other: item.Unit): number {
            //relative velocity
            var relVelocity: Vector = Vector.sub(other.velocity, unit.velocity);
            var relSpeed: number = relVelocity.mag();
            //parallel paths, the vehicles will always be at the same distance
            if (relSpeed == 0) return 0;
            var relTangent: Vector = Vector.div(relVelocity, relSpeed);
            var relLocation: Vector = Vector.sub(unit.getb2Position(), other.getb2Position());
            var projection: number = relTangent.dot(relLocation);
            return projection / relSpeed;
        }

        static computeFutureHitPos(unit: item.Unit, other: item.Unit, relDist: number): { unitLoc: Vector; otherLoc: Vector; distance: number } {
            var unitTravel: Vector = Vector.mult(unit.velocity, relDist);
            var otherTravel: Vector = Vector.mult(other.velocity, relDist);
            var unitFinal: Vector = Vector.add(unit.getb2Position(), unitTravel);
            var otherFinal: Vector = Vector.add(other.getb2Position(), otherTravel);
            return { unitLoc: unitFinal, otherLoc: otherFinal, distance: Vector.distance(unit.getb2Position(), other.getb2Position()) };
        }

    }

} 
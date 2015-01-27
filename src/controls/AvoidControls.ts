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
            var ddinfo = render.DebugDrawInfo.getInfo(unit);

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

                if (ddinfo) {
                    if (ddinfo.drawMask & render.DebugDrawInfo.AVOID_FORCE) {
                        ddinfo.avoidColor = 0xCC6666;
                        ddinfo.avoidHitLoc = Vector.fromb2Vec(shortestPt).sub(unit.getb2Position());
                    }
                }

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
                        //push away force
                        var awayForce = checkRange - (checkRange - distanceHitToUnit);
                        var bounceAng: number = Vector.sub(futureppt, Vector.fromb2Vec(circlePos)).heading();
                        //0.02 hard coded to simulate smoother avoid force (Circle)
                        var resultForce: Vector = Vector.fromAngle(bounceAng).mult(awayForce * 0.02);
                        if (ddinfo) {
                            if (ddinfo.drawMask & render.DebugDrawInfo.AVOID_FORCE) {
                                ddinfo.avoidColor = 0xCC6666;
                                ddinfo.avoidForce = resultForce.clone().mult(100);
                            }
                        }
                        return resultForce;
                    }
                    //when hit circle yet distance is far..
                    return new Vector();
                } else {
                    //reflection point and force , based on current heading and velocity
                    var normalHeading = -Math.atan2(-shortestNormal.y, shortestNormal.x);
                    var bounceAng = normalHeading * 2 - Math.PI - unit.averageVelocity().heading();
                    var distToObstacle: number = Vector.distance(shortestPt, unit.getb2Position());
                    var awayForce: number = unit.c_velocityLength - distToObstacle;
                    //0.01 hard coded to simulate smoother avoid force
                    var resultForce: Vector = Vector.fromAngle(bounceAng).mult(awayForce * 0.01);
                    //steer.render.PixiDebugRenderer.instance.drawSegment(unit.getb2Position(), resultForce.clone().add(unit.getb2Position()), 0xCC6666);

                    if (ddinfo) {
                        if (ddinfo.drawMask & render.DebugDrawInfo.AVOID_FORCE) {
                            ddinfo.avoidColor = 0xCC6666;
                            ddinfo.avoidForce = resultForce.clone().mult(100);
                        }
                    }
                    return resultForce;
                }
            }
            if (ddinfo) {
                ddinfo.avoidForce = null;
                ddinfo.avoidHitLoc = null;
            }
            console.log("no");
            return new Vector(); //when hits nothing
        }

        static avoidUnit(unit: item.Unit, list: item.Unit[]): Vector {

            var len: number = list.length;
            var threat: item.Unit;
            var unitHitAt: Vector;
            var threatHitAt: Vector;
            var closestDist: number = Number.MAX_VALUE;
            var resultVec: Vector = new Vector();
            var closestFutureHit: number;
            var ddinfo = render.DebugDrawInfo.getInfo(unit);
            for (var s: number = 0; s < len; s++) {
                if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                    var other: item.Unit = list[s];
                    var realDist = unit.getb2Position().dist(other.getb2Position());
                    if (realDist < closestDist) {
                        closestDist = realDist;
                        var checkDist: number = (unit.radius + other.radius) * 10;
                        var hitDist: number = AvoidControls.predictFutureHitDist(unit, other);
                        closestFutureHit = hitDist;
                        //if future hit distance or close enough to hit
                        if (((hitDist > 0) && (hitDist < checkDist))) {
                            var unitTravel: Vector = Vector.mult(unit.averageVelocity(), hitDist);
                            var otherTravel: Vector = Vector.mult(other.averageVelocity(), hitDist);
                            var unitFrontAdd = unit.averageVelocity().clone().normalizeThanMult(unit.radius);
                            var otherFrontAdd = other.averageVelocity().clone().normalizeThanMult(other.radius);
                            unitHitAt = unit.getb2Position().add(unitTravel).add(unitFrontAdd);
                            threatHitAt = other.getb2Position().add(otherTravel).add(otherFrontAdd);
                            threat = other;
                        }
                    }
                }
            }

            if (threat != null) {

                ////angle between threat's velocity and uit
                //steer.render.PixiDebugRenderer.instance.drawDot(threatHitAt, 0xFF9999, 0.1, 1);
                //steer.render.PixiDebugRenderer.instance.drawSegment(unit.getb2Position(), threatHitAt, 0x99FF99, 0.05, 1);
                var checkDistRatio: number = (unit.radius + other.radius + unit.c_velocityLength + other.c_velocityLength) * .5;
                var threatNormal: Vector = threat.averageVelocity().clone().normalize();
                var unitNormal: Vector = unit.averageVelocity().clone().normalize();
                //0.707about 45 degree  , 0.5235 = 30deg;
                var angle: number = 0.707;

                var sideVec: Vector = Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.5)));
                var parallelness: number = unitNormal.dot(threatNormal);

                if (parallelness < -angle) {
                    //console.log("--opposite--");
                    //-----------------------------------------------------------------------------
                    if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                        var offset: Vector = Vector.sub(threatHitAt, unit.getb2Position());
                        var sideDot: number = offset.dot(sideVec);
                        resultVec = sideVec;
                        if (ddinfo) {
                            ddinfo.avoidColor = render.DebugColors.DC_AVOID_FRONT;
                            ddinfo.avoidForce = resultVec.clone();
                            ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                        }
                    }
                    //-----------------------------------------------------------------------------
                } else {
                    if (parallelness > angle) {
                        //console.log("--parallel--");
                        //first check if hiting threat is close enough
                        if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                            var unitToDist: number = unit.getb2Position().dist(unitHitAt);
                            var threatToDist: number = threat.getb2Position().dist(unitHitAt);
                            //console.log("unitToDist: " + unitToDist + " | threatToDist: " + threatToDist);
                            if (unitToDist >= threatToDist) {
                                if (!unit.avoidInfo.parallelAvoid) {
                                    //prevent same distance unit to apply twice
                                    unit.avoidInfo.parallelAvoid = threat.avoidInfo.parallelAvoid = true;
                                    //only apply to the behind unit
                                    var utDist: number = unit.getb2Position().dist(unitHitAt);
                                    var ttDist: number = threat.getb2Position().dist(unitHitAt);
                                    if (utDist > ttDist) {
                                        var offset: Vector = Vector.sub(threat.getb2Position(), unit.getb2Position());
                                        var angleBetween: number = offset.dot(sideVec);
                                        sideVec = Vector.fromAngle((unitNormal.heading() + (Math.PI * 1)));
                                        if (angleBetween > 0) sideVec = Vector.fromAngle((unitNormal.heading() - (Math.PI * 1)));
                                    }
                                    if (ddinfo) {
                                        ddinfo.avoidColor = render.DebugColors.DC_AVOID_PARALLEL;
                                        ddinfo.avoidForce = resultVec.clone();
                                        ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                                    }
                                    resultVec = sideVec;
                                }
                            }
                        }
                    } else {
                        //console.log("--perpendicular--");
                        //perpendicular (bigger than 45 degree) slower down when too close
                        //-----------------------------------------------------------------------------
                        //first check if hiting threat is close enough
                        if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                            var unitToDist: number = unit.getb2Position().dist(threatHitAt);
                            var threatToDist: number = threat.getb2Position().dist(unitHitAt);
                            //steer.render.PixiDebugRenderer.instance.drawDot(unitHitAt, 0x66FFDD, 0.3, 1);
                            //console.log(unit.name + " > unitToDist: " + unitToDist + " | threatToDist: " + threatToDist);
                            if (unitToDist >= threatToDist) {
                                if (!unit.avoidInfo.parallelAvoid) {
                                    //prevent same distance unit to apply twice
                                    unit.avoidInfo.parallelAvoid = threat.avoidInfo.parallelAvoid = true;
                                    //find angle between current heading and unit hit
                                    var hitDirVector: Vector = threatHitAt.clone().sub(unit.getb2Position());
                                    var rayDirVector: Vector = unit.c_rayInfo[5].clone().sub(unit.c_rayInfo[4]);
                                    var offDeg = Vector.angleBetween(hitDirVector, rayDirVector) * 4;
                                    resultVec = Vector.fromAngle((unitNormal.heading() + (Math.PI - offDeg)));
                                    if (ddinfo) {
                                        ddinfo.avoidColor = render.DebugColors.DC_AVOID_SIDE;
                                        ddinfo.avoidForce = resultVec.clone();
                                        ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (resultVec.isZero()) {
                if (ddinfo) {
                    ddinfo.avoidForce = null;
                    ddinfo.avoidHitLoc = null;
                }
            }
            return resultVec.div(200);
        }

        static predictFutureHitDist(unit: item.Unit, other: item.Unit): number {
            //relative velocity
            var relVelocity: Vector = Vector.sub(other.averageVelocity(), unit.averageVelocity());
            var relSpeed: number = relVelocity.mag();
            //parallel paths, the vehicles will always be at the same distance
            if (relSpeed == 0) return 0;
            var relTangent: Vector = Vector.div(relVelocity, relSpeed);
            var unitFrontAdd = unit.averageVelocity().clone().normalizeThanMult(unit.radius);
            var otherFrontAdd = other.averageVelocity().clone().normalizeThanMult(other.radius);
            var relLocation: Vector = Vector.sub(unit.getb2Position().add(unitFrontAdd), other.getb2Position().add(otherFrontAdd));
            //var relLocation: Vector = Vector.sub(unit.getb2Position(), other.getb2Position());
            var projection: number = relTangent.dot(relLocation);
            return (projection / relSpeed);
        }

    }

} 
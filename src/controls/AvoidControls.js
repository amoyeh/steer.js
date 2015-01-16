var steer;
(function (steer) {
    var controls;
    (function (controls) {
        var AvoidControls = (function () {
            function AvoidControls() {
            }
            AvoidControls.avoidObstacle = function (unit) {
                var hitCallbacks = [];
                var rayInfo = unit.c_rayInfo;
                for (var s = 0; s < rayInfo.length; s += 2) {
                    var callBack = new box2d.RaycastCallback();
                    callBack.ptStart = rayInfo[s].makeB2Vec();
                    callBack.ptEnd = rayInfo[s + 1].makeB2Vec();
                    unit.domain.b2World.RayCast(callBack, callBack.ptStart, callBack.ptEnd);
                    if (callBack.m_hit) {
                        hitCallbacks.push(callBack);
                    }
                }
                var shortestPt;
                var shortestNormal;
                var shortestFixture;
                var rayPtS, rayPtE;
                if (hitCallbacks.length > 0) {
                    var shortestDist = 10000000;
                    for (var k = 0; k < hitCallbacks.length; k++) {
                        var loopDist = steer.Vector.distanceSq(hitCallbacks[k].m_point, unit.getb2Position());
                        if (loopDist < shortestDist) {
                            shortestDist = loopDist;
                            shortestPt = hitCallbacks[k].m_point;
                            shortestNormal = hitCallbacks[k].m_normal;
                            shortestFixture = hitCallbacks[k].fixture;
                            rayPtS = hitCallbacks[k].ptStart;
                            rayPtE = hitCallbacks[k].ptEnd;
                        }
                    }
                    if (shortestFixture.GetType() == box2d.b2ShapeType.e_circleShape) {
                        var checkRange = unit.maxSpeed * unit.rayFrontRatio;
                        var distanceHitToUnit = checkRange - steer.Vector.distance(shortestPt, unit.getb2Position());
                        if (distanceHitToUnit > 0) {
                            var circlePos = shortestFixture.GetBody().GetPosition();
                            var ppt = steer.Vector.getNormalPoint(steer.Vector.fromb2Vec(circlePos), rayInfo[4], rayInfo[5]);
                            var futureppt = steer.Vector.sub(ppt, unit.getb2Position()).normalizeThanMult(1).add(ppt);
                            var awayForce = checkRange - (checkRange - distanceHitToUnit);
                            var bounceAng = steer.Vector.sub(futureppt, steer.Vector.fromb2Vec(circlePos)).heading();
                            var resultForce = steer.Vector.fromAngle(bounceAng).mult(awayForce);
                            return resultForce;
                        }
                        return new steer.Vector();
                    }
                    else {
                        var normalHeading = -Math.atan2(-shortestNormal.y, shortestNormal.x);
                        var bounceAng = normalHeading * 2 - Math.PI - unit.velocity.heading();
                        var distToObstacle = steer.Vector.distance(shortestPt, unit.getb2Position());
                        var awayForce = unit.c_velocityLength - distToObstacle;
                        var resultForce = steer.Vector.fromAngle(bounceAng).mult(awayForce);
                        return resultForce;
                    }
                }
                return new steer.Vector();
            };
            AvoidControls.avoidUnit = function (unit, list) {
                var len = list.length;
                var threat;
                var unitHitLocation;
                var threatHitLocation;
                var closestDist = Number.MAX_VALUE;
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var hitDist = AvoidControls.predictFutureHitDist(unit, list[s]);
                        var velocityCheckDist = (unit.c_velocityLength + list[s].c_velocityLength);
                        if (velocityCheckDist < 3)
                            velocityCheckDist = 3;
                        if ((hitDist > 0) && (hitDist < velocityCheckDist)) {
                            var collisionDangerThreshold = velocityCheckDist;
                            var compareResult = AvoidControls.computeFutureHitPos(unit, list[s], hitDist);
                            if (compareResult.distance < collisionDangerThreshold) {
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
                var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);
                var resultVec = new steer.Vector();
                var unitNormal = unit.velocity.clone().normalize();
                var sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.5)));
                if (threat != null) {
                    var threatNormal = threat.velocity.clone().normalize();
                    var parallelness = unitNormal.dot(threatNormal);
                    var angle = 0.707;
                    if (parallelness < -angle) {
                        if (threatHitLocation.clone().sub(unit.getb2Position()).mag() <= ((unit.c_velocityLength + threat.c_velocityLength) * .4)) {
                            var offset = steer.Vector.sub(threatHitLocation, unit.getb2Position());
                            var sideDot = offset.dot(sideVec);
                            resultVec = sideVec;
                        }
                        if (ddinfo) {
                            ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_FRONT;
                            ddinfo.avoidForce = resultVec.clone();
                            ddinfo.avoidHitLoc = threatHitLocation.clone().sub(unit.getb2Position());
                        }
                    }
                    else {
                        if (parallelness > angle) {
                            var unitToDist = unit.getb2Position().distSq(unitHitLocation);
                            var threatToDist = threat.getb2Position().distSq(unitHitLocation);
                            if (unitToDist > threatToDist) {
                                var offset = steer.Vector.sub(unitHitLocation, unit.getb2Position());
                                var angleBetween = offset.dot(sideVec);
                                resultVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 1.2)));
                                if (angleBetween > 0)
                                    resultVec = steer.Vector.fromAngle((unitNormal.heading() - (Math.PI * 1.2)));
                                if (ddinfo) {
                                    ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_PARALLEL;
                                    ddinfo.avoidForce = resultVec.clone();
                                    ddinfo.avoidHitLoc = threatHitLocation.clone().sub(unit.getb2Position());
                                }
                            }
                        }
                        else {
                            var hitLoc = null;
                            var lineCirHit = steer.MathUtil.intersectCircleLine(unit.getb2Position(), unit.c_rayInfo[5], threat.getb2Position(), threat.radius);
                            if (lineCirHit.hit) {
                                hitLoc = lineCirHit.data[0];
                            }
                            else {
                                var lineHit = steer.MathUtil.intersectLineLine(unit.getb2Position(), unit.c_rayInfo[5], threat.getb2Position(), threat.c_rayInfo[5]);
                                if (lineHit.hit) {
                                    hitLoc = lineHit.data[0];
                                }
                            }
                            if (hitLoc) {
                                if (hitLoc.clone().sub(unit.getb2Position()).mag() < (unit.velocity.mag() * 4)) {
                                    if (steer.Vector.distanceSq(unit.getb2Position(), hitLoc) >= steer.Vector.distanceSq(threat.getb2Position(), hitLoc)) {
                                        resultVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 1)));
                                        resultVec.mult(2);
                                        if (ddinfo) {
                                            ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_SIDE;
                                            ddinfo.avoidForce = resultVec.clone();
                                            ddinfo.avoidHitLoc = threatHitLocation.clone().sub(unit.getb2Position());
                                        }
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
            };
            AvoidControls.predictFutureHitDist = function (unit, other) {
                var relVelocity = steer.Vector.sub(other.velocity, unit.velocity);
                var relSpeed = relVelocity.mag();
                if (relSpeed == 0)
                    return 0;
                var relTangent = steer.Vector.div(relVelocity, relSpeed);
                var relLocation = steer.Vector.sub(unit.getb2Position(), other.getb2Position());
                var projection = relTangent.dot(relLocation);
                return projection / relSpeed;
            };
            AvoidControls.computeFutureHitPos = function (unit, other, relDist) {
                var unitTravel = steer.Vector.mult(unit.velocity, relDist);
                var otherTravel = steer.Vector.mult(other.velocity, relDist);
                var unitFinal = steer.Vector.add(unit.getb2Position(), unitTravel);
                var otherFinal = steer.Vector.add(other.getb2Position(), otherTravel);
                return { unitLoc: unitFinal, otherLoc: otherFinal, distance: steer.Vector.distance(unit.getb2Position(), other.getb2Position()) };
            };
            return AvoidControls;
        })();
        controls.AvoidControls = AvoidControls;
    })(controls = steer.controls || (steer.controls = {}));
})(steer || (steer = {}));

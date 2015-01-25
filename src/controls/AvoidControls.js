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
                var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);
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
                    if (ddinfo) {
                        if (ddinfo.drawMask & steer.render.DebugDrawInfo.AVOID_FORCE) {
                            ddinfo.avoidColor = 0xCC6666;
                            ddinfo.avoidHitLoc = steer.Vector.fromb2Vec(shortestPt).sub(unit.getb2Position());
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
                            var resultForce = steer.Vector.fromAngle(bounceAng).mult(awayForce * 0.02);
                            if (ddinfo) {
                                if (ddinfo.drawMask & steer.render.DebugDrawInfo.AVOID_FORCE) {
                                    ddinfo.avoidColor = 0xCC6666;
                                    ddinfo.avoidForce = resultForce.clone().mult(100);
                                }
                            }
                            return resultForce;
                        }
                        return new steer.Vector();
                    }
                    else {
                        var normalHeading = -Math.atan2(-shortestNormal.y, shortestNormal.x);
                        var bounceAng = normalHeading * 2 - Math.PI - unit.averageVelocity().heading();
                        var distToObstacle = steer.Vector.distance(shortestPt, unit.getb2Position());
                        var awayForce = unit.c_velocityLength - distToObstacle;
                        var resultForce = steer.Vector.fromAngle(bounceAng).mult(awayForce * 0.01);
                        if (ddinfo) {
                            if (ddinfo.drawMask & steer.render.DebugDrawInfo.AVOID_FORCE) {
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
                return new steer.Vector();
            };
            AvoidControls.avoidUnit = function (unit, list) {
                var len = list.length;
                var threat;
                var unitHitAt;
                var threatHitAt;
                var closestDist = Number.MAX_VALUE;
                var resultVec = new steer.Vector();
                var closestFutureHit;
                var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var other = list[s];
                        var realDist = unit.getb2Position().dist(other.getb2Position());
                        if (realDist < closestDist) {
                            closestDist = realDist;
                            var checkDist = (unit.radius + other.radius) * 10;
                            var hitDist = AvoidControls.predictFutureHitDist(unit, other);
                            closestFutureHit = hitDist;
                            if (((hitDist > 0) && (hitDist < checkDist))) {
                                var unitTravel = steer.Vector.mult(unit.averageVelocity(), hitDist);
                                var otherTravel = steer.Vector.mult(other.averageVelocity(), hitDist);
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
                    var checkDistRatio = (unit.radius + other.radius + unit.c_velocityLength + other.c_velocityLength) * .5;
                    var threatNormal = threat.averageVelocity().clone().normalize();
                    var unitNormal = unit.averageVelocity().clone().normalize();
                    var angle = 0.707;
                    var sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.5)));
                    var parallelness = unitNormal.dot(threatNormal);
                    if (parallelness < -angle) {
                        if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                            var offset = steer.Vector.sub(threatHitAt, unit.getb2Position());
                            var sideDot = offset.dot(sideVec);
                            resultVec = sideVec;
                            if (ddinfo) {
                                ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_FRONT;
                                ddinfo.avoidForce = resultVec.clone();
                                ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                            }
                        }
                    }
                    else {
                        if (parallelness > angle) {
                            if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                                var unitToDist = unit.getb2Position().dist(unitHitAt);
                                var threatToDist = threat.getb2Position().dist(unitHitAt);
                                if (unitToDist >= threatToDist) {
                                    if (!unit.avoidInfo.parallelAvoid) {
                                        unit.avoidInfo.parallelAvoid = threat.avoidInfo.parallelAvoid = true;
                                        var utDist = unit.getb2Position().dist(unitHitAt);
                                        var ttDist = threat.getb2Position().dist(unitHitAt);
                                        if (utDist > ttDist) {
                                            var offset = steer.Vector.sub(threat.getb2Position(), unit.getb2Position());
                                            var angleBetween = offset.dot(sideVec);
                                            sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 1)));
                                            if (angleBetween > 0)
                                                sideVec = steer.Vector.fromAngle((unitNormal.heading() - (Math.PI * 1)));
                                        }
                                        if (ddinfo) {
                                            ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_PARALLEL;
                                            ddinfo.avoidForce = resultVec.clone();
                                            ddinfo.avoidHitLoc = threatHitAt.clone().sub(unit.getb2Position());
                                        }
                                        resultVec = sideVec;
                                    }
                                }
                            }
                        }
                        else {
                            if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= checkDistRatio) {
                                var unitToDist = unit.getb2Position().dist(threatHitAt);
                                var threatToDist = threat.getb2Position().dist(unitHitAt);
                                if (unitToDist >= threatToDist) {
                                    if (!unit.avoidInfo.parallelAvoid) {
                                        unit.avoidInfo.parallelAvoid = threat.avoidInfo.parallelAvoid = true;
                                        var hitDirVector = threatHitAt.clone().sub(unit.getb2Position());
                                        var rayDirVector = unit.c_rayInfo[5].clone().sub(unit.c_rayInfo[4]);
                                        var offDeg = steer.Vector.angleBetween(hitDirVector, rayDirVector) * 4;
                                        resultVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI - offDeg)));
                                        if (ddinfo) {
                                            ddinfo.avoidColor = steer.render.DebugColors.DC_AVOID_SIDE;
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
            };
            AvoidControls.predictFutureHitDist = function (unit, other) {
                var relVelocity = steer.Vector.sub(other.averageVelocity(), unit.averageVelocity());
                var relSpeed = relVelocity.mag();
                if (relSpeed == 0)
                    return 0;
                var relTangent = steer.Vector.div(relVelocity, relSpeed);
                var unitFrontAdd = unit.averageVelocity().clone().normalizeThanMult(unit.radius);
                var otherFrontAdd = other.averageVelocity().clone().normalizeThanMult(other.radius);
                var relLocation = steer.Vector.sub(unit.getb2Position().add(unitFrontAdd), other.getb2Position().add(otherFrontAdd));
                var projection = relTangent.dot(relLocation);
                return (projection / relSpeed);
            };
            return AvoidControls;
        })();
        controls.AvoidControls = AvoidControls;
    })(controls = steer.controls || (steer.controls = {}));
})(steer || (steer = {}));

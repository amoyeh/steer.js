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
                            var resultForce = steer.Vector.fromAngle(bounceAng).mult(awayForce * 0.02);
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
                        if ((hitDist > 0) && (hitDist < velocityCheckDist)) {
                            var compareResult = AvoidControls.computeFutureHitPos(unit, list[s], hitDist);
                            if (compareResult.distance < velocityCheckDist) {
                                if (hitDist < closestDist) {
                                    closestDist = hitDist;
                                    threat = list[s];
                                    unitHitLocation = compareResult.unitLoc;
                                    threatHitLocation = compareResult.otherLoc;
                                    steer.render.PixiDebugRenderer.instance.drawDot(threatHitLocation, 0x99FF99, 0.05, 1);
                                    steer.render.PixiDebugRenderer.instance.drawDot(unitHitLocation, 0x99FF99, 0.05, 1);
                                }
                            }
                        }
                    }
                }
                var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);
                var resultVec = new steer.Vector();
                var unitNormal = unit.averageVelocity().clone().normalize();
                var sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.5)));
                if (threat != null) {
                    var hitCheckDist = (unit.c_velocityLength + threat.c_velocityLength);
                    var threatNormal = threat.averageVelocity().clone().normalize();
                    var parallelness = unitNormal.dot(threatNormal);
                    var angle = 0.707;
                    if (parallelness < -angle) {
                        console.log("opposite ! " + ("mag: " + threatHitLocation.clone().sub(unit.getb2Position()).mag()) + "   hitCheckDist: " + hitCheckDist);
                        if (threatHitLocation.clone().sub(unit.getb2Position()).mag() <= hitCheckDist) {
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
                            console.log("parallelness");
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
                            console.log("perpendicular");
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
                                if (hitLoc.clone().sub(unit.getb2Position()).mag() < (unit.averageVelocity().mag() * 4)) {
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
            AvoidControls.avoidUnit2 = function (unit, list) {
                var len = list.length;
                var threat;
                var unitHitAt;
                var threatHitAt;
                var closestDist = Number.MAX_VALUE;
                var resultVec = new steer.Vector();
                var closestFutureHit;
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var other = list[s];
                        var realDist = unit.getb2Position().dist(other.getb2Position());
                        if (realDist < closestDist) {
                            closestDist = realDist;
                            var checkDist = (unit.radius + other.radius) * 1.5;
                            var hitDist = AvoidControls.predictFutureHitDist(unit, other);
                            closestFutureHit = hitDist;
                            if (((hitDist > 0) && (hitDist < checkDist)) || realDist < checkDist) {
                                var unitTravel = steer.Vector.mult(unit.averageVelocity(), hitDist);
                                unitHitAt = unit.getb2Position().add(unitTravel);
                                var otherTravel = steer.Vector.mult(other.averageVelocity(), hitDist);
                                threatHitAt = other.getb2Position().add(otherTravel);
                                threat = other;
                            }
                        }
                    }
                }
                if (threat != null) {
                    var ddinfo = steer.render.DebugDrawInfo.getInfo(unit);
                    var threatNormal = threat.averageVelocity().clone().normalize();
                    var unitNormal = unit.averageVelocity().clone().normalize();
                    var parallelness = unitNormal.dot(threatNormal);
                    var angle = 0.707;
                    var sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 0.5)));
                    if (parallelness < -angle) {
                        console.log("--opposite--");
                        var forceDistCheck = (unit.radius + other.radius) * 1.5;
                        if (closestFutureHit > 0 && closestFutureHit < forceDistCheck) {
                            if (threatHitAt.clone().sub(unit.getb2Position()).mag() <= forceDistCheck) {
                                var offset = steer.Vector.sub(threatHitAt, unit.getb2Position());
                                var sideDot = offset.dot(sideVec);
                                resultVec = sideVec;
                                resultVec.div(10);
                            }
                            if (ddinfo) {
                            }
                        }
                    }
                    else {
                        console.log("--parallelness or side --");
                        if (closestDist < (unit.radius + other.radius) * 1.5) {
                            var unitToDist = unit.getb2Position().distSq(unitHitAt);
                            var threatToDist = threat.getb2Position().distSq(unitHitAt);
                            if (unitToDist <= threatToDist) {
                                if (!unit.avoidInfo.parallelAvoid) {
                                    unit.avoidInfo.parallelAvoid = threat.avoidInfo.parallelAvoid = true;
                                    var unitToRayDist = unit.getb2Position().dist(unit.c_rayInfo[5]);
                                    var threatToRayDist = threat.getb2Position().dist(unit.c_rayInfo[5]);
                                    if (unitToRayDist > threatToRayDist) {
                                        var offset = steer.Vector.sub(threat.getb2Position(), unit.getb2Position());
                                        var angleBetween = offset.dot(sideVec);
                                        sideVec = steer.Vector.fromAngle((unitNormal.heading() + (Math.PI * 1.2)));
                                        if (angleBetween > 0)
                                            sideVec = steer.Vector.fromAngle((unitNormal.heading() - (Math.PI * 1.2)));
                                        if (ddinfo) {
                                        }
                                        resultVec = sideVec.div(50);
                                        steer.render.PixiDebugRenderer.instance.drawSegment(unit.getb2Position(), threatHitAt, 0xFFDD66, 0.05, 1);
                                        var drawSide = resultVec.clone().add(unit.getb2Position());
                                        steer.render.PixiDebugRenderer.instance.drawDot(drawSide, 0xFFDD99, 0.05, 0.3);
                                        steer.render.PixiDebugRenderer.instance.drawSegment(unit.getb2Position(), drawSide, 0xFFDD99, 0.05, 1);
                                    }
                                }
                            }
                        }
                    }
                }
                return resultVec;
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
            AvoidControls.computeFutureHitPos = function (unit, other, relDist) {
                var unitTravel = steer.Vector.mult(unit.averageVelocity(), relDist);
                var otherTravel = steer.Vector.mult(other.averageVelocity(), relDist);
                var unitFrontAdd = unit.averageVelocity().clone().normalizeThanMult(unit.radius);
                var otherFrontAdd = other.averageVelocity().clone().normalizeThanMult(other.radius);
                var unitFinal = steer.Vector.add(unit.getb2Position().add(unitFrontAdd), unitTravel);
                var otherFinal = steer.Vector.add(other.getb2Position().add(otherFrontAdd), otherTravel);
            };
            return AvoidControls;
        })();
        controls.AvoidControls = AvoidControls;
    })(controls = steer.controls || (steer.controls = {}));
})(steer || (steer = {}));

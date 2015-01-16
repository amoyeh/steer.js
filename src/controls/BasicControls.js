var steer;
(function (steer) {
    var controls;
    (function (controls) {
        var BasicControls = (function () {
            function BasicControls() {
            }
            BasicControls.seek = function (unit, vector) {
                var desired = steer.Vector.sub(vector, unit.getb2Position()).limit(unit.maxSpeed);
                var steerVec = steer.Vector.sub(desired, unit.velocity).limit(unit.maxForce);
                return steerVec;
            };
            BasicControls.flee = function (unit, vector) {
                var desired = steer.Vector.sub(unit.getb2Position(), vector).limit(unit.maxSpeed);
                var steerVec = steer.Vector.sub(desired, unit.velocity).limit(unit.maxForce);
                return steerVec;
            };
            BasicControls.pursuit = function (unit, target) {
                var targetFuture = target.getb2Position().clone();
                var targetSpeed = target.velocity.clone();
                targetFuture.add(targetSpeed);
                return BasicControls.seek(unit, targetFuture);
            };
            BasicControls.evade = function (unit, target) {
                var targetFuture = target.getb2Position().clone();
                var targetSpeed = target.velocity.clone();
                targetFuture.add(targetSpeed);
                return BasicControls.flee(unit, targetFuture);
            };
            BasicControls.arrive = function (unit, vector) {
                var desired = steer.Vector.sub(vector, unit.getb2Position());
                var distance = desired.mag();
                var slowDownRange = unit.maxSpeed * 2;
                desired.normalize();
                if (distance < slowDownRange) {
                    var multValue = steer.MathUtil.map(distance, 0, slowDownRange, 0, unit.maxSpeed);
                    desired.mult(multValue);
                }
                else {
                    desired.mult(unit.maxSpeed);
                }
                var steerVec = steer.Vector.sub(desired, unit.velocity).limit(unit.maxForce);
                return steerVec;
            };
            BasicControls.separation = function (unit, list) {
                var sum = new steer.Vector(0, 0);
                var len = list.length;
                var count = 0;
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var distance = steer.Vector.distance(unit.getb2Position(), list[s].getb2Position());
                        var calcuateRadius = list[s].separateRadius + unit.separateRadius;
                        if (distance < calcuateRadius) {
                            var diff = steer.Vector.sub(unit.getb2Position(), list[s].getb2Position());
                            diff.div(distance);
                            sum.add(diff);
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    sum.div(count);
                    sum.normalizeThanMult(unit.maxSpeed);
                    sum.sub(unit.velocity);
                    sum.limit(unit.maxForce);
                }
                return sum;
            };
            BasicControls.align = function (unit, list) {
                var sum = new steer.Vector(0, 0);
                var len = list.length;
                var count = 0;
                for (var s = 0; s < len; s++) {
                    if (unit !== list[s]) {
                        var distance = steer.Vector.distance(unit.getb2Position(), list[s].getb2Position());
                        var calcuateRadius = list[s].alignRadius + unit.alignRadius;
                        if (distance < calcuateRadius) {
                            sum.add(list[s].velocity);
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    sum.div(count).normalizeThanMult(unit.maxSpeed);
                    sum.sub(unit.velocity).limit(unit.maxForce);
                }
                return sum;
            };
            BasicControls.cohesion = function (unit, list) {
                var sum = new steer.Vector(0, 0);
                var len = list.length;
                var count = 0;
                for (var s = 0; s < len; s++) {
                    if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                        var distance = steer.Vector.distance(unit.getb2Position(), list[s].getb2Position());
                        var calcuateRadius = list[s].cohesionRadius + unit.cohesionRadius;
                        if (distance < calcuateRadius) {
                            sum.add(list[s].getb2Position());
                            count++;
                        }
                    }
                }
                if (count > 0) {
                    sum.div(count);
                    return BasicControls.seek(unit, sum);
                }
                return sum;
            };
            BasicControls.initWander = function (unit, wanderRadius, wanderRatioDeg) {
                unit.wanderRadius = wanderRadius;
                unit.wanderRatioDeg = wanderRatioDeg * Math.PI / 180;
                unit.wanderCurrentAngle = (Math.random() * Math.PI * 2);
            };
            BasicControls.wander = function (unit) {
                if (unit.wanderRadius == null || unit.wanderRatioDeg == null || unit.wanderCurrentAngle == null) {
                    console.error("unit calling wander behavior without initWander function() ");
                    return new steer.Vector();
                }
                var circleCenter = unit.velocity.clone();
                unit.wanderCurrentAngle += (unit.wanderRatioDeg * 0.5) - (Math.random() * unit.wanderRatioDeg);
                var wanderFoce = steer.Vector.fromAngle(unit.wanderCurrentAngle);
                wanderFoce.mult(unit.wanderRadius);
                wanderFoce.add(circleCenter);
                return wanderFoce;
            };
            return BasicControls;
        })();
        controls.BasicControls = BasicControls;
    })(controls = steer.controls || (steer.controls = {}));
})(steer || (steer = {}));

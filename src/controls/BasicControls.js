var steer;
(function (steer) {
    var controls;
    (function (controls) {
        var BasicControls = (function () {
            function BasicControls() {
            }
            BasicControls.seek = function (unit, vector) {
                return steer.Vector.sub(vector, unit.getb2Position()).limit(unit.maxForce);
            };
            BasicControls.flee = function (unit, vector) {
                return steer.Vector.sub(unit.getb2Position(), vector).limit(unit.maxForce);
            };
            BasicControls.pursuit = function (unit, target) {
                var offset = steer.Vector.sub(target.getb2Position(), unit.getb2Position());
                var distanceDelta = offset.mag() / target.maxSpeed;
                var targetVelAvg = target.averageVelocity().mult(distanceDelta);
                var futureAt = target.getb2Position().add(targetVelAvg);
                return BasicControls.seek(unit, futureAt);
            };
            BasicControls.evade = function (unit, target) {
                var offset = steer.Vector.sub(target.getb2Position(), unit.getb2Position());
                var distanceDelta = offset.mag() / target.maxSpeed;
                var targetVelAvg = target.averageVelocity().mult(distanceDelta);
                var futureAt = target.getb2Position().add(targetVelAvg);
                return BasicControls.flee(unit, futureAt);
            };
            BasicControls.arrival = function (unit, vector, slowDownRatio) {
                if (slowDownRatio === void 0) { slowDownRatio = 2; }
                var offset = steer.Vector.sub(vector, unit.getb2Position());
                var distance = offset.mag();
                if (distance < unit.maxSpeed * slowDownRatio) {
                    var mapValue = steer.MathUtil.map(distance, 0, unit.maxSpeed * slowDownRatio, 0, unit.maxSpeed);
                    if (Math.abs(mapValue) < 0.01)
                        mapValue = 0;
                    offset.normalize().mult(mapValue);
                }
                else {
                    offset.normalize().mult(unit.maxSpeed);
                }
                var dest = steer.Vector.sub(offset, unit.velocity).limit(unit.maxForce).div(30);
                return dest;
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
                    sum.limit(unit.maxForce);
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

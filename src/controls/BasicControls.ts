module steer.controls {

    export class BasicControls {

        static seek(unit: item.Unit, vector: Vector): Vector {
            var desired: Vector = Vector.sub(vector, unit.getb2Position()).limit(unit.maxSpeed);
            var steerVec: Vector = Vector.sub(desired, unit.velocity).limit(unit.maxForce);
            return steerVec;
        }

        static flee(unit: item.Unit, vector: Vector): Vector {
            var desired: Vector = Vector.sub(unit.getb2Position(), vector).limit(unit.maxSpeed);
            var steerVec: Vector = Vector.sub(desired, unit.velocity).limit(unit.maxForce);
            //steer.PixiDebugRender.instance.drawDot(vector, 0xCC9933, 0.05, 0.5);
            return steerVec;
        }

        static pursuit(unit: item.Unit, target: item.Unit): Vector {
            //var distance: Vector = Vector.sub(target.getb2Position(), unit.getb2Position());
            //var predictValue: number = distance.mag() / unit.maxSpeed;
            //var targetFuture: Vector = Vector.add(target.getb2Position(), Vector.mult(target.velocity, predictValue));
            ////steer.PixiDebugRender.instance.drawDot(targetFuture, 0xCC9933, 0.05, 0.5);
            ////steer.PixiDebugRender.instance.drawSegment(unit.getb2Position(), targetFuture, 0xCC9933, 0.1, 0.5);
            var targetFuture: steer.Vector = target.getb2Position().clone();
            var targetSpeed: steer.Vector = target.velocity.clone();
            targetFuture.add(targetSpeed);
            return BasicControls.seek(unit, targetFuture);
        }

        static evade(unit: item.Unit, target: item.Unit): Vector {
            var targetFuture: steer.Vector = target.getb2Position().clone();
            var targetSpeed: steer.Vector = target.velocity.clone();
            targetFuture.add(targetSpeed);
            return BasicControls.flee(unit, targetFuture);
        }

        static arrive(unit: item.Unit, vector: Vector): Vector {
            var desired: Vector = Vector.sub(vector, unit.getb2Position());
            var distance: number = desired.mag();
            // when to slow down, set to unit's max speed * 2
            var slowDownRange: number = unit.maxSpeed * 2;
            desired.normalize();
            if (distance < slowDownRange) {
                var multValue: number = MathUtil.map(distance, 0, slowDownRange, 0, unit.maxSpeed);
                desired.mult(multValue);
            } else {
                desired.mult(unit.maxSpeed);
            }
            var steerVec: Vector = Vector.sub(desired, unit.velocity).limit(unit.maxForce);
            return steerVec;
        }

        static separation(unit: item.Unit, list: item.Unit[]): Vector {
            //check the how close the collision occur, distance is the radius plus the velocity magnitude
            //used to store all the vector caculation info
            var sum: Vector = new Vector(0, 0);
            var len: number = list.length;
            var count: number = 0;
            for (var s: number = 0; s < len; s++) {
                if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                    var distance: number = Vector.distance(unit.getb2Position(), list[s].getb2Position());
                    var calcuateRadius: number = list[s].separateRadius + unit.separateRadius;
                    if (distance < calcuateRadius) {
                        var diff: Vector = Vector.sub(unit.getb2Position(), list[s].getb2Position());
                        diff.div(distance);
                        sum.add(diff);
                        count++;
                    }
                }
            }
            if (count > 0) {
                //get the average force and apply steer formular
                sum.div(count);
                sum.normalizeThanMult(unit.maxSpeed);
                sum.sub(unit.velocity);
                sum.limit(unit.maxForce);
            }
            return sum;
        }

        static align(unit: item.Unit, list: item.Unit[]): Vector {
            //used to store all the vector caculation info
            var sum: Vector = new Vector(0, 0);
            var len: number = list.length;
            var count: number = 0;
            for (var s: number = 0; s < len; s++) {
                if (unit !== list[s]) {
                    var distance: number = Vector.distance(unit.getb2Position(), list[s].getb2Position());
                    var calcuateRadius: number = list[s].alignRadius + unit.alignRadius;
                    if (distance < calcuateRadius) {
                        //apply alignment to same velocity
                        sum.add(list[s].velocity);
                        count++;
                    }
                }
            }
            if (count > 0) {
                // to average center
                sum.div(count).normalizeThanMult(unit.maxSpeed);
                sum.sub(unit.velocity).limit(unit.maxForce);
            }
            return sum;
        }

        static cohesion(unit: item.Unit, list: item.Unit[]): Vector {
            //used to store all the vector caculation info
            var sum: Vector = new Vector(0, 0);
            var len: number = list.length;
            var count: number = 0;
            for (var s: number = 0; s < len; s++) {
                if ((unit !== list[s]) && (list[s] instanceof steer.item.Unit)) {
                    var distance: number = Vector.distance(unit.getb2Position(), list[s].getb2Position());
                    var calcuateRadius: number = list[s].cohesionRadius + unit.cohesionRadius;
                    if (distance < calcuateRadius) {
                        sum.add(list[s].getb2Position());
                        count++;
                    }
                }
            }
            if (count > 0) {
                sum.div(count); // to average center
                return BasicControls.seek(unit, sum);
            }
            return sum;
        }

        static initWander(unit: item.Unit, wanderRadius: number, wanderRatioDeg: number): void {
            unit.wanderRadius = wanderRadius;
            unit.wanderRatioDeg = wanderRatioDeg * Math.PI / 180;
            unit.wanderCurrentAngle = (Math.random() * Math.PI * 2);
        }

        static wander(unit: item.Unit): Vector {
            if (unit.wanderRadius == null || unit.wanderRatioDeg == null || unit.wanderCurrentAngle == null) {
                console.error("unit calling wander behavior without initWander function() ");
                return new Vector();
            }
            var circleCenter: Vector = unit.velocity.clone();
            unit.wanderCurrentAngle += (unit.wanderRatioDeg * 0.5) - (Math.random() * unit.wanderRatioDeg);
            var wanderFoce: Vector = Vector.fromAngle(unit.wanderCurrentAngle);
            wanderFoce.mult(unit.wanderRadius);
            wanderFoce.add(circleCenter);
            return wanderFoce;
        }


    }

}
module steer.controls {

    export class BasicControls {

        static seek(unit: item.Unit, vector: Vector): Vector {
            return Vector.sub(vector, unit.getb2Position()).limit(unit.maxForce);
        }

        static flee(unit: item.Unit, vector: Vector): Vector {
            return Vector.sub(unit.getb2Position(), vector).limit(unit.maxForce);
        }

        static pursuit(unit: item.Unit, target: item.Unit): Vector {
            var offset: Vector = Vector.sub(target.getb2Position(), unit.getb2Position());
            var distanceDelta: number = offset.mag() / target.maxSpeed;
            var targetVelAvg: Vector = target.averageVelocity().mult(distanceDelta);
            var futureAt: Vector = target.getb2Position().add(targetVelAvg);
            return BasicControls.seek(unit, futureAt);
        }

        static evade(unit: item.Unit, target: item.Unit): Vector {
            var offset: Vector = Vector.sub(target.getb2Position(), unit.getb2Position());
            var distanceDelta: number = offset.mag() / target.maxSpeed;
            var targetVelAvg: Vector = target.averageVelocity().mult(distanceDelta);
            var futureAt: Vector = target.getb2Position().add(targetVelAvg);
            return BasicControls.flee(unit, futureAt);
        }

        static arrival(unit: item.Unit, vector: Vector, slowDownRatio: number= 2): Vector {

            //method1 original way
            //------------------------------------------------------
            //var offset: Vector = Vector.sub(vector, unit.getb2Position());
            //var distance: number = offset.mag();
            //var slowDownRange: number = unit.maxSpeed * slowDownRatio;
            //if (distance < slowDownRange) {
            //    offset.normalize().mult(unit.maxSpeed * (distance / slowDownRange))
            //} else {
            //    offset.normalize().mult(unit.maxSpeed);
            //}
            //return offset.sub(unit.velocity);

            //method 2, distance map based
            //------------------------------------------------------
            var offset: Vector = Vector.sub(vector, unit.getb2Position());
            var distance: number = offset.mag();
            if (distance < unit.maxSpeed * slowDownRatio) {
                var mapValue: number = MathUtil.map(distance, 0, unit.maxSpeed * slowDownRatio, 0, unit.maxSpeed);
                if (Math.abs(mapValue) < 0.01) mapValue = 0;
                offset.normalize().mult(mapValue);
            } else {
                offset.normalize().mult(unit.maxSpeed);
            }
            var dest: Vector = Vector.sub(offset, unit.velocity).limit(unit.maxForce).div(30);
            return dest;

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
                sum.limit(unit.maxForce);
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
module steer.item {

    export class Unit extends Circle {

        /** extra seperate radius value to unit, used unalignedAvoidance and unit separateRadius*/
        public static UnitSperateGap: number = 0.1;

        /** @property {number} maxmium speed */
        public maxSpeed: number;
        /** @property {number} maxmium turnning force */
        public maxForce: number;
        /** @property {steer.Vector} current velocity */
        public velocity: Vector;
        /** @property {steer.Vector} acceleration used for Euler method caculation, reset to zero after each update. */
        public acceleration: Vector;

        //used for flocking[separation, cohesion, aligment]
        public separateRadius: number = 0;
        public cohesionRadius: number = 0;
        public alignRadius: number = 0;

        //used for wandering
        public wanderRadius: number;
        public wanderCurrentAngle: number;
        public wanderRatioDeg: number;

        //used for path following
        //(velocity * pathAheadLookRatio) as basic future seek point 
        public pathVelocityRatio: number = 2;

        //after got predict point perpendicular on the path, the seek point on the path ahead 
        //formular = point perpendicular on the path +  (maxSpeed * pathLookAhead)
        public pathOnFrontRatio: number = 2;
        public pathAtIndex: number = 0;
        public pathSeekAheadAmt: number = 1;
        public loopOnPath: boolean = false;

        //for raycasting
        public currentRayFront: number;
        public rayFrontRatio: number = 4;

        //see if this unit can collide with other units
        public canCollide: boolean = true;

        /** cache value for update uses */
        public c_averageVelocity: Vector;
        public c_velocityLength: number;
        public c_rayInfo: Vector[];

        public mass: number = 1;
        public data: any;

        private oldVelocities: Vector[];

        public avoidInfo: any;

        constructor(b2Body: box2d.b2Body, radius: number, maxSpeed: number = 10, maxForce: number = 1, name?: string) {

            super(b2Body, radius, name);
            this.maxSpeed = maxSpeed;
            //this.mass = this.maxSpeed * 30; //box2d 30 times bigger
            this.maxForce = maxForce;
            this.velocity = new Vector(0, 0);
            this.acceleration = new Vector(0, 0);
            this.diffPosition = new box2d.b2Vec2(0, 0);
            this.c_averageVelocity = new Vector();
            this.separateRadius = this.radius + Unit.UnitSperateGap;
            this.cohesionRadius = this.alignRadius = this.radius;
            this.oldVelocities = [];

        }

        public applyForce(force: Vector, mult: number= 1): void {
            if (mult != 1) force.mult(mult);
            this.acceleration.add(force);
        }

        public addAverageData(newOne: steer.Vector): void {
            if (this.oldVelocities.length > 2) this.oldVelocities.shift();
            this.oldVelocities.push(newOne);
        }

        public averageVelocity(): Vector {
            //var len: number = this.oldVelocities.length;
            //if (len == 0) return new Vector();
            //var accumulated: Vector = new Vector();
            //for (var s: number = 0; s < len; s++) {
            //    accumulated.add(this.oldVelocities[s]);
            //}
            //return accumulated.div(len);
            //return this.c_averageVelocity;
            return this.velocity.clone();
        }

        public update(delta: number): void {
            if (!this.dynamic) {
                this.velocity.setTo(0, 0);
                this.acceleration.setTo(0, 0);
                return;
            }
            /*
            improved Euler’s method implementation, store 4 average velocities and caculate its average
            -------------------------------------------------------------------
                applyForce() -> acceleration caculated then ...
                acceleration /= mass;
                velocity += acceleration * timeDelta;
                velocity limit to max speed
                store current velocity to array oldVelocities max 4
                averageVelocity = oldVelocities get average
                position += averageVelocity * timeDelta;
            */
            //this.acceleration.mult(delta);
            //this.velocity.add(this.acceleration).limit(this.maxSpeed);
            //this.addVelocityData(this.velocity.clone());
            //var averageVelocity: Vector = this.averageVelocity();
            //this.b2body.SetAwake(true);
            //this.b2body.SetLinearVelocity(averageVelocity.mult(delta).makeB2Vec());
            //this.acceleration.setTo(0, 0);

            //method. velocities average
            this.acceleration.div(this.mass).mult(delta);
            var oldVelocity: Vector = this.velocity.clone();
            this.addAverageData(this.velocity.clone());
            this.velocity.add(this.acceleration).limit(this.maxSpeed);
            var averageVelocity: Vector = this.velocity.clone().add(oldVelocity).div(2);
            this.b2body.SetAwake(true);
            this.b2body.SetLinearVelocity(averageVelocity.mult(delta).makeB2Vec());
            this.acceleration.setTo(0, 0);
        }

        private getRaycast(useGlobal: boolean = false): Vector[] {

            var result: Vector[] = [];
            var atx: number = this.getb2X();
            var aty: number = this.getb2Y();
            var avgVelocity = this.averageVelocity();
            var heading: number = avgVelocity.heading();
            var velocityLength: number = this.c_velocityLength;

            //angle between 5 ~ 30, base on unit current speed, 
            var baseAngle: number = 0;
            var speedRatio: number = (1 - avgVelocity.mag() / this.maxSpeed) * 25;
            baseAngle = Math.round(speedRatio + 5);

            //angle adding one, first one attach on the side
            var angSideAdd: number = heading + (MathUtil.ONED * 90);
            var a1x: number = Math.cos(angSideAdd) * (this.radius + Unit.UnitSperateGap);
            var a1y: number = Math.sin(angSideAdd) * (this.radius + Unit.UnitSperateGap);
            var angAdd: number = heading + (MathUtil.ONED * (baseAngle));
            var a2x: number = (Math.cos(angAdd) * velocityLength) + a1x;
            var a2y: number = (Math.sin(angAdd) * velocityLength) + a1y;
            if (useGlobal) a1x += atx, a1y += aty, a2x += atx, a2y += aty;
            result.push(new Vector(a1x, a1y), new Vector(a2x, a2y));

            //angle subtracting one
            var angSideSub: number = heading - (MathUtil.ONED * 90);
            var s1x: number = Math.cos(angSideSub) * (this.radius + Unit.UnitSperateGap);
            var s1y: number = Math.sin(angSideSub) * (this.radius + Unit.UnitSperateGap);
            var angSub: number = heading - (MathUtil.ONED * (baseAngle));
            var s2x: number = (Math.cos(angSub) * velocityLength) + s1x;
            var s2y: number = (Math.sin(angSub) * velocityLength) + s1y;
            if (useGlobal) s1x += atx, s1y += aty, s2x += atx, s2y += aty;
            result.push(new Vector(s1x, s1y), new Vector(s2x, s2y));

            //angle at center
            var c1x: number = Math.cos(heading) * (this.radius + Unit.UnitSperateGap);
            var c1y: number = Math.sin(heading) * (this.radius + Unit.UnitSperateGap);
            var c2x: number = (Math.cos(heading) * (velocityLength - this.separateRadius)) + c1x;
            var c2y: number = (Math.sin(heading) * (velocityLength - this.separateRadius)) + c1y;
            if (useGlobal) c1x += atx, c1y += aty, c2x += atx, c2y += aty;
            result.push(new Vector(c1x, c1y), new Vector(c2x, c2y));

            //angle from subtracting angle end to adding angle end
            //result.push(new Vector(a2x, a2y), new Vector(s2x, s2y));

            return result;

        }

        public setCanCollideOtherUnit(canCollide: boolean): void {

            this.canCollide = canCollide;
            //the unit only has one fixture
            var fixture: box2d.b2Fixture = this.b2body.GetFixtureList();
            var filter: box2d.b2Filter = fixture.GetFilterData();
            //destroy and recreate, box2d update fixture not working well in js version
            this.b2body.DestroyFixture(fixture);

            //create fixture and add shape to it
            var cirleShape = new box2d.b2CircleShape();
            cirleShape.m_radius = this.radius;
            var fixDef: box2d.b2FixtureDef = Creator.createFixtureDef();
            fixDef.shape = cirleShape;
            fixDef.filter.categoryBits = ItemEntity.FILTER_UNIT;
            fixDef.filter.maskBits = ItemEntity.FILTER_STATIC | ItemEntity.FILTER_UNIT;
            if (!canCollide) {
                fixDef.filter.maskBits = ItemEntity.FILTER_STATIC;
            }
            this.b2body.CreateFixture(fixDef);

        }

        /** cache caculated informations, saving time to caculate again and again when use these values in each update */
        public prepareUpdateCache(): void {
            var avgVelocity: Vector = this.averageVelocity();
            this.currentRayFront = (avgVelocity.mag() * this.rayFrontRatio + this.separateRadius);
            var minLength: number = this.separateRadius;
            var velocityLength: number = this.currentRayFront;
            if (velocityLength < minLength) velocityLength = minLength;
            this.c_velocityLength = velocityLength;
            this.c_rayInfo = this.getRaycast(true);
            this.avoidInfo = {};
        }

        public setb2Position(x: number, y: number): void {
            //if (!this.dynamic) console.error("setb2Position on static item : " + this.name);
            this.b2body.SetPosition(new box2d.b2Vec2(x, y));
        }
        public setSteerPosition(x: number, y: number): void {
            this.b2body.SetPosition(new box2d.b2Vec2(x / 30, y / 30));
        }

        public getBoundingBox(): { x: number; y: number; w: number; h: number } {
            if (this.b2body) {
                var bodyAABB: any = new box2d.b2AABB();
                bodyAABB.lowerBound = new box2d.b2Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
                bodyAABB.upperBound = new box2d.b2Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
                for (var f = this.b2body.GetFixtureList(); f; f = f.GetNext()) {
                    var shape: any = f.GetShape();
                    for (var c: number = 0; c < shape.GetChildCount(); c++) {
                        bodyAABB.Combine1(f.GetAABB(c));
                    }
                }
                var rayInfo: Vector[] = this.c_rayInfo;

                var maxRadius: number = Math.max(this.separateRadius, this.cohesionRadius, this.alignRadius);
                var lowerV: box2d.b2Vec2 = new box2d.b2Vec2(this.getb2X() - maxRadius, this.getb2Y() - maxRadius);
                var upperV: box2d.b2Vec2 = new box2d.b2Vec2(this.getb2X() + maxRadius, this.getb2Y() + maxRadius);
                bodyAABB.Combine1({ lowerBound: lowerV, upperBound: upperV });
                //this.averageVelocity().mag
                if (this.averageVelocity().mag() > 0) {
                    for (var s: number = 0; s < rayInfo.length; s += 2) {
                        bodyAABB.Combine1({ lowerBound: rayInfo[s], upperBound: rayInfo[s + 1] });
                        bodyAABB.Combine1({ lowerBound: rayInfo[s + 1], upperBound: rayInfo[s] });
                    }
                }
                var tx: number = bodyAABB.lowerBound.x;
                var ty: number = bodyAABB.lowerBound.y;
                var tw: number = bodyAABB.upperBound.x - tx;
                var th: number = bodyAABB.upperBound.y - ty;
                return { x: tx, y: ty, w: tw, h: th };
            }
            return null;
        }

        public resetVelocity(): void {
            this.oldVelocities = [];
            this.velocity.setTo(0, 0);
            this.acceleration.setTo(0, 0);
            this.b2body.SetLinearVelocity(new box2d.b2Vec2(0, 0));
            this.updateBeforeStep();
        }
    }

}
module steer.item {

    export class Sensor extends ItemEntity {

        public static FORCE_PUSH_VECTOR: number = 1;
        public static FORCE_PUSH_CENTER: number = 2;
        public static FORCE_PULL_CENTER: number = 3;

        public static SHAPE_BOX: number = 1;
        public static SHAPE_CIRCLE: number = 2;

        public pushForce: steer.Vector;
        public forceType: number;
        public forceAngle: number;
        public forceMagnitude: number;
        public isForceArea: boolean;
        public shapeType: number;

        public overLapItems: steer.item.ItemEntity[] = [];

        public shapes: box2d.b2PolygonShape[];
        public shapeLen: number;
        public radius: number;
        public eventStart: Function;
        public eventEnd: Function;

        constructor(b2Body: box2d.b2Body, name?: string) {
            super(b2Body, name);
            this.shapes = [];
            this.shapeLen = 0;
            var fixture: box2d.b2Fixture = b2Body.GetFixtureList();
            while (fixture != null) {
                if (fixture.GetType() == box2d.b2ShapeType.e_polygonShape) {
                    this.shapes.push(fixture.GetShape());
                    this.shapeLen++;
                }
                fixture = fixture.GetNext();
            }
            this.lastPosition = this.b2body.GetPosition().Clone();
            this.lastRotation = this.b2body.GetAngle();
            this.overLapItems = [];
        }

        public asForcePushVector(force: steer.Vector): void {
            this.forceType = Sensor.FORCE_PUSH_VECTOR;
            this.pushForce = force.clone().mult(0.01);
            this.forceAngle = this.pushForce.heading();
        }
        public asForcePushCenter(forceMagnitude: number): void {
            this.forceType = Sensor.FORCE_PUSH_CENTER;
            this.forceMagnitude = forceMagnitude * 0.01;
        }
        public asForcePullCenter(forceMagnitude: number): void {
            this.forceType = Sensor.FORCE_PULL_CENTER;
            this.forceMagnitude = forceMagnitude * 0.01;
        }
        public asEventSensor(eventStart: Function, eventEnd: Function): void {
            this.eventStart = eventStart;
            this.eventEnd = eventEnd;
        }

        public update(): void {
            var olen: number = this.overLapItems.length;
            for (var key in this.overLapItems) {
                var unit: Unit = <Unit>this.overLapItems[key];
                switch (this.forceType) {
                    case Sensor.FORCE_PUSH_VECTOR:
                        unit.applyForce(Vector.fromAngle(this.pushForce.heading() + this.b2body.GetAngle(), this.pushForce.mag()));
                        break;
                    case Sensor.FORCE_PUSH_CENTER:
                        var angleVec: steer.Vector = Vector.sub(unit.getb2Position(), this.getb2Position());
                        angleVec.normalizeThanMult(this.forceMagnitude);
                        unit.applyForce(angleVec);
                        break;
                    case Sensor.FORCE_PULL_CENTER:
                        var angleVec: steer.Vector = Vector.sub(this.getb2Position(), unit.getb2Position());
                        unit.applyForce(angleVec.normalizeThanMult(this.forceMagnitude));
                        break;
                }
            }
        }

    }

} 
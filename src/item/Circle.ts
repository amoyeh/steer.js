module steer.item {

    export class Circle extends ItemEntity {

        public radius: number;

        constructor(b2Body: box2d.b2Body, radius: number, name?: string) {
            super(b2Body, name);
            this.radius = radius;
            this.lastPosition = this.b2body.GetPosition().Clone();
            this.lastRotation = this.b2body.GetAngle();
        }

    }

} 
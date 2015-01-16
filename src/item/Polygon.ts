module steer.item {

    export class Polygon extends ItemEntity {

        public shapes: box2d.b2PolygonShape[];
        public shapeLen: number;

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
        }

    }

}  
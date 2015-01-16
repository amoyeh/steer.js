module steer.item {

    export class Edge extends ItemEntity {

        public shapes: box2d.b2EdgeShape[];
        public shapeLen: number;

        constructor(b2Body: box2d.b2Body, name?: string) {
            super(b2Body, name);
            var fixture: box2d.b2Fixture = b2Body.GetFixtureList();
            this.shapes = [];
            this.shapeLen = 0;
            while (fixture != null) {
                var shape = fixture.GetShape();
                if (shape.m_type == box2d.b2ShapeType.e_edgeShape) {
                    this.shapes.push(shape);
                    this.shapeLen++;
                }
                fixture = fixture.GetNext();
            }
            this.lastPosition = this.b2body.GetPosition().Clone();
            this.lastRotation = this.b2body.GetAngle();
        }

    }

}  
module steer {

    /** contact event calls before every domain step */
    export class ContactManager {

        public domain: Domain;

        constructor(domain: Domain) {
            this.domain = domain;
            this.domain.b2World.SetContactListener(this);
        }

        public PostSolve(contact, impulse): void {
        }
        public PreSolve(contact, oldManifold): void {
        }
        //In the b2Contactlistner method property or position changing is impossible
        public BeginContact(contact): void {
            //sensor event handle
            var fixtureA: box2d.b2Fixture = contact.GetFixtureA();
            var fixtureB: box2d.b2Fixture = contact.GetFixtureB();
            if (((!fixtureA.IsSensor()) && fixtureB.IsSensor()) || (fixtureA.IsSensor() && (!fixtureB.IsSensor()))) {
                var sensorOne: box2d.b2Fixture = (fixtureA.IsSensor()) ? fixtureA : fixtureB;
                var targetOne: box2d.b2Fixture = (fixtureA.IsSensor()) ? fixtureB : fixtureA;
                //var sensorPos: steer.Vector = Vector.fromb2Vec(sensorOne.GetBody().GetPosition());
                var sensor: steer.item.Sensor = sensorOne.GetBody().GetUserData().entity;
                if (targetOne.GetBody().GetUserData().entity.constructor["name"] === "Unit") {
                    sensor.overLapItems[targetOne.GetBody().GetUserData().name] = targetOne.GetBody().GetUserData().entity;
                    if (sensor.eventStart) {
                        //box2d doesnot allow property change in contact event, call it later
                        setTimeout(function () {
                            sensor.eventStart.apply(sensor);
                        }, 1);
                    }
                }
            }
        }
        //In the b2Contactlistner method property or position changing is impossible
        public EndContact(contact): void {
            var fixtureA: box2d.b2Fixture = contact.GetFixtureA();
            var fixtureB: box2d.b2Fixture = contact.GetFixtureB();
            if (((!fixtureA.IsSensor()) && fixtureB.IsSensor()) || (fixtureA.IsSensor() && (!fixtureB.IsSensor()))) {
                var sensorOne: box2d.b2Fixture = (fixtureA.IsSensor()) ? fixtureA : fixtureB;
                var targetOne: box2d.b2Fixture = (fixtureA.IsSensor()) ? fixtureB : fixtureA;
                var sensor: steer.item.Sensor = sensorOne.GetBody().GetUserData().entity;
                if (sensor.eventEnd) {
                    //box2d doesnot allow property change in contact event, call it later
                    setTimeout(function () {
                        sensor.eventEnd.apply(sensor);
                    }, 1);
                }
                delete sensor.overLapItems[targetOne.GetBody().GetUserData().name];
            }
        }

    }

}

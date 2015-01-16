var steer;
(function (steer) {
    var ContactManager = (function () {
        function ContactManager(domain) {
            this.domain = domain;
            this.domain.b2World.SetContactListener(this);
        }
        ContactManager.prototype.PostSolve = function (contact, impulse) {
        };
        ContactManager.prototype.PreSolve = function (contact, oldManifold) {
        };
        ContactManager.prototype.BeginContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if (((!fixtureA.IsSensor()) && fixtureB.IsSensor()) || (fixtureA.IsSensor() && (!fixtureB.IsSensor()))) {
                var sensorOne = (fixtureA.IsSensor()) ? fixtureA : fixtureB;
                var targetOne = (fixtureA.IsSensor()) ? fixtureB : fixtureA;
                var sensor = sensorOne.GetBody().GetUserData().entity;
                if (targetOne.GetBody().GetUserData().entity.constructor["name"] === "Unit") {
                    sensor.overLapItems[targetOne.GetBody().GetUserData().name] = targetOne.GetBody().GetUserData().entity;
                    if (sensor.eventStart) {
                        setTimeout(function () {
                            sensor.eventStart.apply(sensor);
                        }, 1);
                    }
                }
            }
        };
        ContactManager.prototype.EndContact = function (contact) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if (((!fixtureA.IsSensor()) && fixtureB.IsSensor()) || (fixtureA.IsSensor() && (!fixtureB.IsSensor()))) {
                var sensorOne = (fixtureA.IsSensor()) ? fixtureA : fixtureB;
                var targetOne = (fixtureA.IsSensor()) ? fixtureB : fixtureA;
                var sensor = sensorOne.GetBody().GetUserData().entity;
                if (sensor.eventEnd) {
                    setTimeout(function () {
                        sensor.eventEnd.apply(sensor);
                    }, 1);
                }
                delete sensor.overLapItems[targetOne.GetBody().GetUserData().name];
            }
        };
        return ContactManager;
    })();
    steer.ContactManager = ContactManager;
})(steer || (steer = {}));

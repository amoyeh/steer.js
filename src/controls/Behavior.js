var steer;
(function (steer) {
    var controls;
    (function (controls) {
        var Behavior = (function () {
            function Behavior() {
            }
            Behavior.seek = function (unit, vector) {
                return controls.BasicControls.seek(unit, vector);
            };
            Behavior.avoidObstacle = function (unit) {
                return controls.AvoidControls.avoidObstacle(unit);
            };
            Behavior.flee = function (unit, vector) {
                return controls.BasicControls.flee(unit, vector);
            };
            Behavior.pursuit = function (unit, target) {
                return controls.BasicControls.pursuit(unit, target);
            };
            Behavior.evade = function (unit, target) {
                return controls.BasicControls.evade(unit, target);
            };
            Behavior.arrival = function (unit, vector, slowDownRatio) {
                if (slowDownRatio === void 0) { slowDownRatio = 2; }
                return controls.BasicControls.arrival(unit, vector, slowDownRatio);
            };
            Behavior.separation = function (unit, list) {
                return controls.BasicControls.separation(unit, list);
            };
            Behavior.align = function (unit, list) {
                return controls.BasicControls.align(unit, list);
            };
            Behavior.cohesion = function (unit, list) {
                return controls.BasicControls.cohesion(unit, list);
            };
            Behavior.initPathUnit = function (unit, path, initOnshortestPt, loopOnPath, pathSeekAheadAmt) {
                if (initOnshortestPt === void 0) { initOnshortestPt = true; }
                if (loopOnPath === void 0) { loopOnPath = false; }
                if (pathSeekAheadAmt === void 0) { pathSeekAheadAmt = 1; }
                return controls.PathAreaControls.initPathUnit(unit, path, initOnshortestPt, loopOnPath, pathSeekAheadAmt);
            };
            Behavior.followPath = function (unit, path) {
                return controls.PathAreaControls.followPath(unit, path);
            };
            Behavior.initWander = function (unit, wanderRadius, wanderRatioDeg) {
                return controls.BasicControls.initWander(unit, wanderRadius, wanderRatioDeg);
            };
            Behavior.wander = function (unit) {
                return controls.BasicControls.wander(unit);
            };
            Behavior.unalignedAvoidance = function (unit, list) {
                return new steer.Vector();
            };
            Behavior.avoidUnit = function (unit, list) {
                return controls.AvoidControls.avoidUnit(unit, list);
            };
            Behavior.gridmapForce = function (unit, grid) {
                return controls.PathAreaControls.gridmapForce(unit, grid);
            };
            return Behavior;
        })();
        controls.Behavior = Behavior;
    })(controls = steer.controls || (steer.controls = {}));
})(steer || (steer = {}));

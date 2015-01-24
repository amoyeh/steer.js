var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var steer;
(function (steer) {
    var SteerTimer = (function (_super) {
        __extends(SteerTimer, _super);
        function SteerTimer(TPS) {
            _super.call(this);
            this.TPS = TPS;
            this.tpsValue = this.TPS / 1000;
            this.logicTicker = null;
        }
        SteerTimer.prototype.start = function () {
            this.accumulateLogicTime = 0;
            this.lastLogicUpdate = Date.now();
            this.LogicPerMsec = Math.round(1000 / this.TPS);
            this.logicIntervalUpdate();
        };
        SteerTimer.prototype.updateTPS = function (value) {
            this.stop();
            this.TPS = value;
            this.start();
        };
        SteerTimer.prototype.isRunning = function () {
            return (this.requestAnimateId != null);
        };
        SteerTimer.prototype.stop = function () {
            if (this.requestAnimateId) {
                window.cancelAnimationFrame(this.requestAnimateId);
                this.requestAnimateId = undefined;
            }
        };
        SteerTimer.prototype.logicIntervalUpdate = function () {
            var timeDiff = Date.now() - this.lastLogicUpdate;
            this.accumulateLogicTime += timeDiff;
            this.lastLogicUpdate = Date.now();
            while (this.accumulateLogicTime > this.LogicPerMsec) {
                this.accumulateLogicTime -= this.LogicPerMsec;
                this.fireEvent(new steer.Event(steer.Event.LOGIC_UPDATE, this, { delta: this.LogicPerMsec }));
            }
            var intergrate = (this.accumulateLogicTime / this.LogicPerMsec);
            this.fireEvent(new steer.Event(steer.Event.RENDER_UPDATE, this, { delta: intergrate }));
            var self = this;
            this.requestAnimateId = window.requestAnimationFrame(function () {
                self.logicIntervalUpdate();
            });
        };
        return SteerTimer;
    })(steer.EventDispatcher);
    steer.SteerTimer = SteerTimer;
})(steer || (steer = {}));

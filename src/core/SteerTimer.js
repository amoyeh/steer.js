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
            this.logicTicker = null;
        }
        SteerTimer.prototype.start = function () {
            var _this = this;
            this.accumulateLogicTime = 0;
            this.lastLogicUpdate = Date.now();
            this.LogicPerMsec = Math.round(1000 / this.TPS);
            this.logicTicker = setInterval(function () {
                _this.logicIntervalUpdate();
            }, SteerTimer.INTERVAL_RATE);
        };
        SteerTimer.prototype.updateTPS = function (value) {
            this.stop();
            this.TPS = value;
            this.start();
        };
        SteerTimer.prototype.isRunning = function () {
            return (this.logicTicker != null);
        };
        SteerTimer.prototype.stop = function () {
            clearInterval(this.logicTicker);
            this.logicTicker = null;
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
        };
        SteerTimer.INTERVAL_RATE = 17;
        return SteerTimer;
    })(steer.EventDispatcher);
    steer.SteerTimer = SteerTimer;
})(steer || (steer = {}));

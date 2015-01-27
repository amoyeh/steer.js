module steer {

    export class SteerTimer extends steer.EventDispatcher {

        public TPS: number; //update caculate Logic per second, (10 TPS means 10 times per second)
        private tpsValue: number;
        private logicTicker: number;
        private accumulateLogicTime: number;
        public lastLogicUpdate: number;
        public LogicPerMsec: number;

        private requestAnimateId: number;


        constructor(TPS: number) {
            super();
            this.TPS = TPS;
            this.tpsValue = this.TPS / 1000;
            this.logicTicker = null;
        }

        public start(): void {
            if (!this.isRunning()) {
                this.accumulateLogicTime = 0;
                this.lastLogicUpdate = Date.now();
                this.LogicPerMsec = Math.round(1000 / this.TPS);
                this.logicIntervalUpdate();
            }
        }

        public updateTPS(value: number): void {
            this.stop();
            this.TPS = value;
            this.start();
        }

        public isRunning(): boolean {
            return (this.requestAnimateId != null);
        }

        public stop(): void {
            if (this.requestAnimateId) {
                window.cancelAnimationFrame(this.requestAnimateId);
                this.requestAnimateId = undefined;
            }
        }

        public logicIntervalUpdate(): void {
            var timeDiff: number = Date.now() - this.lastLogicUpdate;
            this.accumulateLogicTime += timeDiff;
            this.lastLogicUpdate = Date.now();
            while (this.accumulateLogicTime > this.LogicPerMsec) {
                //console.log("fire! "+this.accumulateLogicTime+" | "+this.LogicPerMsec);
                this.accumulateLogicTime -= this.LogicPerMsec;
                this.fireEvent(new steer.Event(steer.Event.LOGIC_UPDATE, this, { delta: this.LogicPerMsec }));
            }
            var intergrate: number = (this.accumulateLogicTime / this.LogicPerMsec);
            this.fireEvent(new steer.Event(steer.Event.RENDER_UPDATE, this, { delta: intergrate }));
            //using request animation frame to update
            var self = this;
            this.requestAnimateId = window.requestAnimationFrame(function () { self.logicIntervalUpdate(); });
        }

    }
}

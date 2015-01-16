module steer {

    export class SteerTimer extends steer.EventDispatcher {

        //interval running rate, default 1/60 sec => about 17 msec
        public static INTERVAL_RATE: number = 17;

        public TPS: number; //update caculate Logic per second, (10 TPS means 10 times per second)
        private logicTicker: number;
        private accumulateLogicTime: number;
        public lastLogicUpdate: number;
        public LogicPerMsec: number;

        constructor(TPS: number) {
            super();
            this.TPS = TPS;
            this.logicTicker = null;
        }

        public start(): void {
            this.accumulateLogicTime = 0;
            this.lastLogicUpdate = Date.now();
            this.LogicPerMsec = Math.round(1000 / this.TPS);
            this.logicTicker = setInterval(() => { this.logicIntervalUpdate(); }, SteerTimer.INTERVAL_RATE);
        }

        public updateTPS(value: number): void {
            this.stop();
            this.TPS = value;
            this.start();
        }

        public isRunning(): boolean {
            return (this.logicTicker != null);
        }

        public stop(): void {
            clearInterval(this.logicTicker);
            this.logicTicker = null;
        }

        private logicIntervalUpdate(): void {
            var timeDiff: number = Date.now() - this.lastLogicUpdate;
            this.accumulateLogicTime += timeDiff;
            this.lastLogicUpdate = Date.now();
            while (this.accumulateLogicTime > this.LogicPerMsec) {
                this.accumulateLogicTime -= this.LogicPerMsec;
                this.fireEvent(new steer.Event(steer.Event.LOGIC_UPDATE, this, { delta: this.LogicPerMsec }));
            }
            var intergrate: number = (this.accumulateLogicTime / this.LogicPerMsec);
            this.fireEvent(new steer.Event(steer.Event.RENDER_UPDATE, this, { delta: intergrate }));
        }

    }
}

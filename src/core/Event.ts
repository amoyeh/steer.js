module steer {

    export class Event {

        /*when SteerTimer Logic timer updates*/
        public static LOGIC_UPDATE: string = "logicUpdate";

        /*when SteerTimer render timer updates*/
        public static RENDER_UPDATE: string = "renderUpdate";

        public static RENDER: string = "render";

        /*when html window resize*/
        public static RESIZE: string = "resize";

        public type: string;
        public target: any;
        public values: any;

        constructor(type: string, target?: any, values?: any) {
            this.type = type;
            if (target) this.target = target;
            if (values) this.values = values;
        }
        toString(): string {
            return "[event] type: " + this.type + " target: " + this.target + " values: " + this.values;
        }
    }

    export class EventDispatcher {
        private callBacks: { type: string; callbacks: any[] }[] = [];
        addEvent(type: string, func: any): void {
            if (this.callBacks[type] == null) {
                this.callBacks[type] = [];
            }
            this.callBacks[type].push({ func: func });
        }
        removeEvent(type: string, func: any) {
            if (this.callBacks[type] != null) {
                var callbackLen: number = this.callBacks[type].length;
                for (var k: number = 0; k < callbackLen; k++) {
                    if (this.callBacks[type][k].func === func) {
                        this.callBacks[type].splice(k, 1);
                        break;
                    }
                }
            }
        }
        fireEvent(event: Event) {
            if (this.callBacks[event.type] != null) {
                var callbackLen: number = this.callBacks[event.type].length;
                for (var k: number = 0; k < callbackLen; k++) {
                    this.callBacks[event.type][k].func(event);
                }
            }
        }
    }
} 
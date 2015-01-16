var steer;
(function (steer) {
    var Event = (function () {
        function Event(type, target, values) {
            this.type = type;
            if (target)
                this.target = target;
            if (values)
                this.values = values;
        }
        Event.prototype.toString = function () {
            return "[event] type: " + this.type + " target: " + this.target + " values: " + this.values;
        };
        Event.LOGIC_UPDATE = "logicUpdate";
        Event.RENDER_UPDATE = "renderUpdate";
        Event.RENDER = "render";
        Event.RESIZE = "resize";
        return Event;
    })();
    steer.Event = Event;
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.callBacks = [];
        }
        EventDispatcher.prototype.addEvent = function (type, func) {
            if (this.callBacks[type] == null) {
                this.callBacks[type] = [];
            }
            this.callBacks[type].push({ func: func });
        };
        EventDispatcher.prototype.removeEvent = function (type, func) {
            if (this.callBacks[type] != null) {
                var callbackLen = this.callBacks[type].length;
                for (var k = 0; k < callbackLen; k++) {
                    if (this.callBacks[type][k].func === func) {
                        this.callBacks[type].splice(k, 1);
                        break;
                    }
                }
            }
        };
        EventDispatcher.prototype.fireEvent = function (event) {
            if (this.callBacks[event.type] != null) {
                var callbackLen = this.callBacks[event.type].length;
                for (var k = 0; k < callbackLen; k++) {
                    this.callBacks[event.type][k].func(event);
                }
            }
        };
        return EventDispatcher;
    })();
    steer.EventDispatcher = EventDispatcher;
})(steer || (steer = {}));

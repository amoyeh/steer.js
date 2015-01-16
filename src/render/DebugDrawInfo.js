var steer;
(function (steer) {
    var render;
    (function (render) {
        var DebugDrawInfo = (function () {
            function DebugDrawInfo(toItem) {
                if (toItem === void 0) { toItem = null; }
                this.drawMask = DebugDrawInfo.SHOW_FILL | DebugDrawInfo.SHOW_EDGE;
                if (toItem)
                    this.toItemName = toItem.name;
            }
            DebugDrawInfo.create = function (item) {
                var newOne = new DebugDrawInfo(item);
                DebugDrawInfo.allInfos[item.name] = newOne;
                return newOne;
            };
            DebugDrawInfo.exist = function (item) {
                if (DebugDrawInfo.allInfos[item.name])
                    return true;
                return false;
            };
            DebugDrawInfo.getAlpha = function (item, defaultAlpha) {
                if (DebugDrawInfo.allInfos[item.name]) {
                    if (DebugDrawInfo.allInfos[item.name].alpha) {
                        return DebugDrawInfo.allInfos[item.name].alpha;
                    }
                }
                return defaultAlpha;
            };
            DebugDrawInfo.getColor = function (item, defaultColor) {
                if (DebugDrawInfo.allInfos[item.name]) {
                    if (DebugDrawInfo.allInfos[item.name].color) {
                        return DebugDrawInfo.allInfos[item.name].color;
                    }
                }
                return defaultColor;
            };
            DebugDrawInfo.getInfo = function (item) {
                if (DebugDrawInfo.allInfos[item.name]) {
                    return DebugDrawInfo.allInfos[item.name];
                }
                return null;
            };
            DebugDrawInfo.SHOW_FILL = 1;
            DebugDrawInfo.SHOW_EDGE = 2;
            DebugDrawInfo.UNIT_SEPARATION = 4;
            DebugDrawInfo.UNIT_ALIGNMENT = 8;
            DebugDrawInfo.UNIT_COHESION = 16;
            DebugDrawInfo.UNIT_RAYCAST = 32;
            DebugDrawInfo.UNIT_WANDER = 64;
            DebugDrawInfo.UNIT_PATH_INFO = 128;
            DebugDrawInfo.BOUNDING_BOX = 256;
            DebugDrawInfo.AVOID_FORCE = 512;
            DebugDrawInfo.allInfos = {};
            return DebugDrawInfo;
        })();
        render.DebugDrawInfo = DebugDrawInfo;
    })(render = steer.render || (steer.render = {}));
})(steer || (steer = {}));

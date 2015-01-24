var steer;
(function (steer) {
    var render;
    (function (render) {
        var DebugColors = (function () {
            function DebugColors() {
            }
            DebugColors.rgbaToHex = function (rgba) {
                var rgbData = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                return (rgbData && rgbData.length === 4) ? "#" + ("0" + parseInt(rgbData[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgbData[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgbData[3], 10).toString(16)).slice(-2) : '';
            };
            DebugColors.hexToRgba = function (hex, opacity) {
                hex = hex.replace('#', '');
                var r = parseInt(hex.substring(0, 2), 16);
                var g = parseInt(hex.substring(2, 4), 16);
                var b = parseInt(hex.substring(4, 6), 16);
                var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
                return result;
            };
            DebugColors.DC_PATH_FILL = 0x9650A0;
            DebugColors.DC_PATH_FILL_SA = 0.4;
            DebugColors.DC_PATH_FILL_A = 0.1;
            DebugColors.DC_PATH_GUIDE = 0x33FFFF;
            DebugColors.DC_PATH_GUIDE_A = 0.3;
            DebugColors.DC_PATH_GUIDE_A2 = 0.2;
            DebugColors.DC_WANDER = 0x969696;
            DebugColors.DC_WANDER_A = 0.5;
            DebugColors.DC_ALIGNMENT = 0x50825A;
            DebugColors.DC_ALIGNMENT_A = 0.3;
            DebugColors.DC_COHESION = 0x5A8282;
            DebugColors.DC_COHESION_A = 0.3;
            DebugColors.DC_SEPARATION = 0xE65050;
            DebugColors.DC_SEPARATION_A = 0.3;
            DebugColors.DC_RAYCAST = 0x1E8C1E;
            DebugColors.DC_RAYCAST_A = 0.3;
            DebugColors.DC_STATIC = 0x606060;
            DebugColors.DC_STATIC_A = 0.3;
            DebugColors.DC_DYNAMIC = 0xA0A0A0;
            DebugColors.DC_DYNAMIC_A = 0.3;
            DebugColors.DC_QUAD = 0x55CCCC;
            DebugColors.DC_QUAD_A = 0.5;
            DebugColors.DC_SENSOR = 0xFFDD88;
            DebugColors.DC_SENSOR_A = 0.3;
            DebugColors.DC_SENSOR_STATIC = 0xFFDD88;
            DebugColors.DC_SENSOR_STATIC_A = 0.1;
            DebugColors.DC_GRID = 0x66FFFF;
            DebugColors.DC_GRID_A = 0.1;
            DebugColors.DC_GRID_BLOCK = 0x66FFFF;
            DebugColors.DC_GRID_BLOCK_A = 0.1;
            DebugColors.DC_AVOID_FRONT = 0xDD9999;
            DebugColors.DC_AVOID_SIDE = 0xFFDD66;
            DebugColors.DC_AVOID_PARALLEL = 0x6699DD;
            return DebugColors;
        })();
        render.DebugColors = DebugColors;
    })(render = steer.render || (steer.render = {}));
})(steer || (steer = {}));

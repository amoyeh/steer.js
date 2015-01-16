module steer.render {

    export class DebugColors {

        public static DC_PATH_FILL: number = 0x9650A0;
        public static DC_PATH_FILL_SA: number = 0.4;
        public static DC_PATH_FILL_A: number = 0.1;
        public static DC_PATH_GUIDE: number = 0x33FFFF;
        public static DC_PATH_GUIDE_A: number = 0.2;
        public static DC_PATH_GUIDE_A2: number = 0.05;

        public static DC_WANDER: number = 0x969696;
        public static DC_WANDER_A: number = 0.5;
        public static DC_ALIGNMENT: number = 0x50825A;
        public static DC_ALIGNMENT_A: number = 0.3;
        public static DC_COHESION: number = 0x5A8282;
        public static DC_COHESION_A: number = 0.3;
        public static DC_SEPARATION: number = 0xE65050;
        public static DC_SEPARATION_A: number = 0.3;
        public static DC_RAYCAST: number = 0x1E8C1E;
        public static DC_RAYCAST_A: number = 0.3;
        public static DC_STATIC: number = 0x606060;
        public static DC_STATIC_A: number = 0.3;
        public static DC_DYNAMIC: number = 0xA0A0A0;
        public static DC_DYNAMIC_A: number = 0.3;
        public static DC_QUAD: number = 0x55CCCC;
        public static DC_QUAD_A: number = 0.5;
        public static DC_SENSOR: number = 0xFFDD88;
        public static DC_SENSOR_A: number = 0.3;
        public static DC_SENSOR_STATIC: number = 0xFFDD88;
        public static DC_SENSOR_STATIC_A: number = 0.1;
        public static DC_GRID: number = 0x66FFFF;
        public static DC_GRID_A: number = 0.1;
        public static DC_GRID_BLOCK: number = 0x66FFFF;
        public static DC_GRID_BLOCK_A: number = 0.1;

        public static DC_AVOID_FRONT: number = 0xDD9999;
        public static DC_AVOID_SIDE: number = 0xFFDD66;
        public static DC_AVOID_PARALLEL: number = 0x6699DD;

        public static rgbaToHex(rgba: string): string {
            var rgbData = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgbData && rgbData.length === 4) ? "#" +
                ("0" + parseInt(rgbData[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgbData[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgbData[3], 10).toString(16)).slice(-2) : '';
        }

        public static hexToRgba(hex: string, opacity: number): string {
            hex = hex.replace('#', '');
            var r: number = parseInt(hex.substring(0, 2), 16);
            var g: number = parseInt(hex.substring(2, 4), 16);
            var b: number = parseInt(hex.substring(4, 6), 16);
            var result: string = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
            return result;
        }

    }

} 
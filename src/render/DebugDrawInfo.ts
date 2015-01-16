module steer.render {

    export class DebugDrawInfo {

        public static SHOW_FILL: number = 1;
        public static SHOW_EDGE: number = 2;
        public static UNIT_SEPARATION: number = 4;
        public static UNIT_ALIGNMENT: number = 8;
        public static UNIT_COHESION: number = 16;
        public static UNIT_RAYCAST: number = 32;
        public static UNIT_WANDER: number = 64;
        public static UNIT_PATH_INFO: number = 128;
        public static BOUNDING_BOX: number = 256;
        public static AVOID_FORCE: number = 512;

        //=========================================================================================
        //helper static functions 
        //=========================================================================================
        public static allInfos: { [name: string]: DebugDrawInfo; } = {};

        //default styles
        //private static defaultUnitInfo: DebugDrawInfo;
        //private static defaultAreaInfo: DebugDrawInfo;

        /**create a custom visual debug render setting to an unit */
        public static create(item: item.ItemBase): DebugDrawInfo {
            var newOne: DebugDrawInfo = new DebugDrawInfo(item);
            DebugDrawInfo.allInfos[item.name] = newOne;
            return newOne;
        }

        public static exist(item: item.ItemBase): boolean {
            if (DebugDrawInfo.allInfos[item.name]) return true;
            return false;
        }

        public static getAlpha(item: item.ItemBase, defaultAlpha: number): number {
            if (DebugDrawInfo.allInfos[item.name]) {
                if (DebugDrawInfo.allInfos[item.name].alpha) {
                    return DebugDrawInfo.allInfos[item.name].alpha;
                }
            }
            return defaultAlpha;
        }
        public static getColor(item: item.ItemBase, defaultColor: number): number {
            if (DebugDrawInfo.allInfos[item.name]) {
                if (DebugDrawInfo.allInfos[item.name].color) {
                    return DebugDrawInfo.allInfos[item.name].color;
                }
            }
            return defaultColor;
        }

        /* get current debug render setting from a unit, if not found default one is provided */
        public static getInfo(item: item.ItemBase): DebugDrawInfo {
            if (DebugDrawInfo.allInfos[item.name]) {
                return DebugDrawInfo.allInfos[item.name];
            }
            return null;
        }
        ////=========================================================================================

        public toItemName: string;

        //custom unit color, if not provided, rainbow color generator is used
        public color: number;
        public alpha: number;

        //if drawing flocking behaviors, only updates when value changes
        public oldSeparateRad: number;
        public oldAlignRad: number;
        public oldCohesionRad: number;

        //for follow path logic to draw debug information
        public pathPredict: Vector;
        public pathNormal: Vector;
        public pathOnFront: Vector;

        public avoidForce: Vector;
        public avoidHitLoc: Vector;
        public avoidColor: number;

        public drawMask: number = DebugDrawInfo.SHOW_FILL | DebugDrawInfo.SHOW_EDGE;

        constructor(toItem: item.ItemBase= null) {
            if (toItem) this.toItemName = toItem.name;
        }

    }

} 
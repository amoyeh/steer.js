module steer {

    export class ClassLoader {

        private loadPos: number = 0;
        private loadList: string[];
        public basePath: string;
        private callback: any;
        private shaderList: string[];

        constructor(basePath: string) {
            this.basePath = basePath;
        }

        public load(callback: any): void {

            this.callback = callback;
            this.loadPos = 0;

            //also used in grunt concat part
            //--------------------------------------------------------------------------
            var list = [

                "core/Event.js",
                "core/MathUtil.js",
                "core/Vector.js",
                "core/SteerTimer.js",
                
                "item/ItemContainer.js",
                "item/Circle.js",
                "item/Unit.js",
                "item/Polygon.js",
                "item/Edge.js",
                "item/BezierPath.js",
                "item/Sensor.js",
                "item/Creator.js",
                "item/Quad.js",
                "item/GridMap.js",

                "core/Domain.js",
                "core/ContactManager.js",
                "controls/BasicControls.js",
                "controls/AvoidControls.js",
                "controls/PathAreaControl.js",
                "controls/Behavior.js",

                "render/DebugColors.js",
                "render/DebugDrawInfo.js",
                "render/PixiDebugRenderer.js",
 
                
                //external
                "pathfinding.js",
                "three.min.js",
                "box2d.js",

                //js only file, concat these in grunt build 
                "ClassTool.js",
                "DebugDraw.js"


            ];

            var basepath: string = this.basePath;
            var listWithPath = list.map(function (filepath) { return basepath + filepath });
            //--------------------------------------------------------------------------

            this.loadList = listWithPath;
            this.loadScript(this);
        }

        public loadScript(self: ClassLoader): void {
            var script = document.createElement('script');
            script.type = "text/javascript";
            // Attach handlers for all browsers
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var done = false;
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    done = true;
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                    self.loadPos++;
                    if (self.loadPos < self.loadList.length) {
                        self.loadScript(self);
                    } else {
                        self.callback();
                    }
                }
            };
            script.src = self.loadList[self.loadPos];
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }

} 
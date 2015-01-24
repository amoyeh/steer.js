var steer;
(function (steer) {
    var ClassLoader = (function () {
        function ClassLoader(basePath) {
            this.loadPos = 0;
            this.basePath = basePath;
        }
        ClassLoader.prototype.load = function (callback) {
            this.callback = callback;
            this.loadPos = 0;
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
                "pathfinding.js",
                "three.min.js",
                "box2d.js",
                "ClassTool.js",
                "DebugDraw.js"
            ];
            var basepath = this.basePath;
            var listWithPath = list.map(function (filepath) {
                return basepath + filepath;
            });
            this.loadList = listWithPath;
            this.loadScript(this);
        };
        ClassLoader.prototype.loadScript = function (self) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            var done = false;
            script.onload = script.onreadystatechange = function () {
                if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                    done = true;
                    script.onload = script.onreadystatechange = null;
                    self.loadPos++;
                    if (self.loadPos < self.loadList.length) {
                        self.loadScript(self);
                    }
                    else {
                        self.callback();
                    }
                }
            };
            script.src = self.loadList[self.loadPos];
            document.getElementsByTagName('head')[0].appendChild(script);
        };
        return ClassLoader;
    })();
    steer.ClassLoader = ClassLoader;
})(steer || (steer = {}));

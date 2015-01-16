var steer;
(function (steer) {
    var render;
    (function (render) {
        var ThreeDebugRender = (function () {
            function ThreeDebugRender(domain, scene, camera, renderer, w, h) {
                this.w = w;
                this.h = h;
                this.scene = scene;
                this.camera = camera;
                this.renderer = renderer;
                this.debugLayer = new THREE.Object3D();
                this.scene.add(this.debugLayer);
            }
            ThreeDebugRender.prototype.setupDebugScene = function () {
                this.renderer.setClearColor(0x181818, 1);
                this.scene.fog = new THREE.Fog(0x181818, 500, 6000);
                if (this.gridHelper == null) {
                    this.gridHolder = new THREE.Object3D();
                    this.debugLayer.add(this.gridHolder);
                    this.gridHelper = new THREE.GridHelper(10000, 40);
                    this.gridHelper.rotation.set(steer.MathUtil.ONED * 90, steer.MathUtil.ONED * 45, 0);
                    this.gridHelper.setColors(0x222222, 0x222222);
                    this.gridHolder.add(this.gridHelper);
                    this.gridHelper.position.z = -2;
                }
                this.updateCameraPixelDist();
                this.renderer.render(this.scene, this.camera);
            };
            ThreeDebugRender.prototype.updateCameraPixelDist = function () {
                var fov = 45 * (Math.PI / 180);
                this.camera.position.z = this.h / (2 * Math.tan(fov / 2));
            };
            ThreeDebugRender.prototype.intergrate = function (delta) {
            };
            ThreeDebugRender.prototype.createItemVisual = function (xto, yto, rto, item) {
            };
            ThreeDebugRender.prototype.updateItemVisial = function (xto, yto, rto, item) {
            };
            ThreeDebugRender.prototype.updateUnitInfo = function (xto, yto, rto, item) {
            };
            ThreeDebugRender.prototype.makeCircle = function (xto, yto, rto, item, color, alpha) {
            };
            ThreeDebugRender.prototype.makePolygon = function (xto, yto, rto, item, color, alpha) {
            };
            ThreeDebugRender.prototype.makeEdge = function (xto, yto, rto, item) {
            };
            ThreeDebugRender.prototype.drawGridmap = function (item) {
            };
            ThreeDebugRender.prototype.drawDot = function (position, color, radius, alpha) {
                if (radius === void 0) { radius = 0.03; }
                if (alpha === void 0) { alpha = 1; }
            };
            ThreeDebugRender.prototype.drawSegment = function (fromPos, toPos, color, width, alpha) {
                if (width === void 0) { width = 0.03; }
                if (alpha === void 0) { alpha = 1; }
            };
            ThreeDebugRender.prototype.drawRectangle = function (x, y, w, h, color, alpha) {
            };
            ThreeDebugRender.prototype.drawQuadTree = function () {
            };
            ThreeDebugRender.prototype.drawTreeNode = function (targetNode) {
            };
            return ThreeDebugRender;
        })();
        render.ThreeDebugRender = ThreeDebugRender;
    })(render = steer.render || (steer.render = {}));
})(steer || (steer = {}));

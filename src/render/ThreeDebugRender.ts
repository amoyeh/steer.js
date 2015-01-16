module steer.render {

    export class ThreeDebugRender {

        public w: number;
        public h: number;
        public domain: Domain;
        //public pixiStage: PIXI.Stage;
        //public pixiRenderer: PIXI.IPixiRenderer;
        //public container: PIXI.DisplayObjectContainer;
        //public guideContainer: PIXI.DisplayObjectContainer; //for drawing custom datas
        //public guideGrahpic: PIXI.Graphics;
        //for easier singleton access when debugging, only for development testing purpose
        public static instance: PixiDebugRenderer;

        public scene: THREE.Scene;
        public camera: THREE.PerspectiveCamera;
        public renderer: THREE.WebGLRenderer;

        //THREE.js 3d gridHelper used when debug the scene by calling setupDebugScene()
        public gridHelper: THREE.GridHelper;
        public gridHolder: THREE.Object3D;

        //layer that contains all debug used shape and items
        public debugLayer: THREE.Object3D;

        constructor(domain: Domain, scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, w: number, h: number) {
            //this.domain = domain;
            //this.pixiRenderer = renderer;
            //this.pixiStage = stage;
            //this.w = w;
            //this.h = h;
            //PixiDebugRender.instance = this; //instance for debugging only
            //this.container = new PIXI.DisplayObjectContainer();
            //this.guideContainer = new PIXI.DisplayObjectContainer();
            //this.pixiStage.addChild(this.container);
            //this.pixiStage.addChild(this.guideContainer);
            //this.container.scale = new PIXI.Point(30, 30);
            //this.guideContainer.scale = new PIXI.Point(30, 30);
            //this.container.position = new PIXI.Point(0, 0);
            //this.guideContainer.position = new PIXI.Point(0, 0);
            //this.guideGrahpic = new PIXI.Graphics();
            //this.guideContainer.addChild(this.guideGrahpic);
            this.w = w;
            this.h = h;
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            this.debugLayer = new THREE.Object3D();
            this.scene.add(this.debugLayer);
        }

        // Steer.js style debug scene setup
        public setupDebugScene(): void {
            this.renderer.setClearColor(0x181818, 1);
            this.scene.fog = new THREE.Fog(0x181818, 500, 6000);
            if (this.gridHelper == null) {
                this.gridHolder = new THREE.Object3D();
                this.debugLayer.add(this.gridHolder);
                this.gridHelper = new THREE.GridHelper(10000, 40);
                this.gridHelper.rotation.set(MathUtil.ONED * 90, MathUtil.ONED * 45, 0);
                this.gridHelper.setColors(0x222222, 0x222222);
                this.gridHolder.add(this.gridHelper);
                this.gridHelper.position.z = -2;
            }
            this.updateCameraPixelDist();
            this.renderer.render(this.scene, this.camera);
        }

        public updateCameraPixelDist(): void {
            var fov: number = 45 * (Math.PI / 180);
            this.camera.position.z = this.h / (2 * Math.tan(fov / 2));
        }

        public intergrate(delta: number): void {
            //this.domain.items.each((item: any) => {
            //    var itemType: string = item.constructor["name"];
            //    switch (itemType) {
            //        case "Unit":
            //        case "Circle":
            //        case "Polygon":
            //        case "Edge":
            //            var xto: number = item.getb2X();
            //            var yto: number = item.getb2Y();
            //            var rto: number = item.b2body.GetAngle();
            //            if (item.dynamic) {
            //                xto = item.getb2X() + (item.diffPosition.x * delta);
            //                yto = item.getb2Y() + (item.diffPosition.y * delta);
            //                rto = item.b2body.GetAngle() + (item.diffRotation * delta);
            //            }
            //            if (item.pixiDebugItem == null) {
            //                var graphic: PIXI.Graphics = new PIXI.Graphics();
            //                item.pixiDebugItem = graphic;
            //                this.container.addChild(graphic);
            //                this.createItemVisual(xto, yto, rto, item);
            //            }
            //            if (itemType == "Unit") {
            //                this.updateUnitInfo(xto, yto, rto, item);
            //            } else {
            //                this.updateItemVisial(xto, yto, rto, item);
            //            }
            //            break;
            //        case "PathList":
            //            if (item.pixiDebugItem == null) {
            //                var graphic: PIXI.Graphics = new PIXI.Graphics();
            //                item.pixiDebugItem = graphic;
            //                this.container.addChild(graphic);
            //                this.makePathList(item);
            //            }
            //            break;
            //    }
            //});
            //this.domain.gridMaps.each((item: GridMap) => {
            //    if (item.pixiDebugItem == null) {
            //        var graphic: PIXI.Graphics = new PIXI.Graphics();
            //        item.pixiDebugItem = graphic;
            //        this.container.addChild(graphic);
            //        this.drawGridmap(item);
            //    }
            //});

            //this.domain.autoItems.each((item: any) => {
            //    var itemType: string = item.constructor["name"];
            //    switch (itemType) {
            //        case "Sensor":
            //            if (item.pixiDebugItem == null) {
            //                var xto: number = item.getb2X();
            //                var yto: number = item.getb2Y();
            //                var rto: number = item.b2body.GetAngle();
            //                var graphic: PIXI.Graphics = new PIXI.Graphics();
            //                item.pixiDebugItem = graphic;
            //                this.container.addChild(graphic);
            //                this.createItemVisual(xto, yto, rto, item);
            //            }
            //            break;
            //    }
            //});
            //this.pixiRenderer.render(this.pixiStage);
        }

        public createItemVisual(xto: number, yto: number, rto: number, item: any): void {
            //var color: number = DebugColors.DC_DYNAMIC;
            //var alpha: number = DebugColors.DC_DYNAMIC_A;
            //if (!item.dynamic) {
            //    color = DebugColors.DC_STATIC;
            //    alpha = DebugColors.DC_STATIC_A;
            //}
            //switch (item.constructor["name"]) {
            //    case "Unit":
            //        this.makeCircle(xto, yto, rto, item, color, alpha);
            //        break;
            //    case "Circle":
            //        this.makeCircle(xto, yto, rto, item, color, alpha);
            //        break;
            //    case "Polygon":
            //        this.makePolygon(xto, yto, rto, <Polygon>item, color, alpha);
            //        break;
            //    case "Edge":
            //        this.makeEdge(xto, yto, rto, <Edge>item);
            //        break;
            //    case "Sensor":
            //        if ((<Sensor>item).shapeType == Sensor.SHAPE_BOX) {
            //            this.makePolygon(xto, yto, rto, item, DebugColors.DC_SENSOR, DebugColors.DC_SENSOR_A);
            //        } else {
            //            this.makeCircle(xto, yto, rto, item, DebugColors.DC_SENSOR, DebugColors.DC_SENSOR_A);
            //        }
            //        break;
            //}
        }

        public updateItemVisial(xto: number, yto: number, rto: number, item: item.ItemEntity): void {

        }

        public updateUnitInfo(xto: number, yto: number, rto: number, item: item.Unit): void {

        }

        public makeCircle(xto: number, yto: number, rto: number, item: item.ItemEntity, color: number, alpha: number): void {

        }

        public makePolygon(xto: number, yto: number, rto: number, item: item.Polygon, color: number, alpha: number): void {

        }

        public makeEdge(xto: number, yto: number, rto: number, item: item.Edge): void {

        }

        public drawGridmap(item: item.GridMap): void {

        }

        public drawDot(position: any, color: number, radius: number = 0.03, alpha: number = 1): void {

        }
        public drawSegment(fromPos: any, toPos: any, color: number, width: number = 0.03, alpha: number = 1): void {

        }
        public drawRectangle(x: number, y: number, w: number, h: number, color: number, alpha: number): void {

        }
        public drawQuadTree(): void {

        }
        private drawTreeNode(targetNode: steer.item.QuadNode): void {

        }

    }

} 
module steer {

    export interface IDisplayUpdate {
        updateStep(delta: number): void;
        updateItem(item: any, xto: number, yto: number, rto: number, delta: number): void;
    }

    export class BaseRender {

        public w: number;
        public h: number;
        public domain: Domain;
        public updateObject: IDisplayUpdate;

        constructor(domain: Domain, w: number, h: number) {
            this.domain = domain;
            this.w = w;
            this.h = h;
        }

        //when Domain.preUpdate() called
        public preDomainUpdate(): void {

        }

        //when Domain.update() called
        public domainUpdate(): void {

        }

        //used in RENDER Update
        public integrate(delta: number): void {
            //basic items
            this.domain.items.each((item: any) => {
                this.itemRender(item, delta);
            });
            //Sensor
            this.domain.autoItems.each((item: any) => {
                this.itemRender(item, delta);
            });
            this.visualRender(delta);
        }

        //used in RENDER Update, loop on every item
        public itemRender(item: any, delta: number): void {
            var xto: number, yto: number, rto: number = 0;
            if (item.b2body) {
                xto = item.getb2X();
                yto = item.getb2Y();
                rto = item.b2body.GetAngle();
            }
            if (item.dynamic) {
                xto = item.getb2X() + (item.diffPosition.x * delta);
                yto = item.getb2Y() + (item.diffPosition.y * delta);
                rto = item.b2body.GetAngle() + (item.diffRotation * delta);
            }
            //custom update uses IDisplayUpdate
            if (this.updateObject) this.updateObject.updateItem(item, xto, yto, rto, delta);
        }

        //used in RENDER Update after every item looped
        public visualRender(delta: number): void {
            //custom update uses IDisplayUpdate
            if (this.updateObject) this.updateObject.updateStep(delta);
        }

    }

    export class Domain {

        public b2World: box2d.b2World;
        public items: item.ItemDatas;
        /**store items that has build-in update logics. eg: Sensors */
        public autoItems: item.ItemDatas;
        /**store gridmaps*/
        public gridMaps: item.ItemDatas;
        public renderers: BaseRender[];

        public debugViewLayer: THREE.Object3D;

        /** box2d DebugDraw provided by box2d framework*/
        public box2dDebugDraw: any;

        public contactManager: ContactManager;
        public selector: item.QuadTree;

        constructor() {
            this.items = new item.ItemDatas();
            this.autoItems = new item.ItemDatas();
            this.gridMaps = new item.ItemDatas();
            box2d.b2_maxTranslation = 30;
            this.renderers = [];
        }

        //create a box2d world with contact listener setup
        public createB2World(gravity: box2d.b2Vec2): void {
            this.b2World = new box2d.b2World(gravity);
            this.contactManager = new ContactManager(this);
            this.b2World.SetContactListener(this.contactManager);
        }

        public createBox2dDebugDraw(canvasId: string, flag: number): any {
            if (this.b2World == null) {
                console.error("createCanvasDebugDraw() error , b2World not found... ");
                return;
            }
            this.box2dDebugDraw = new DebugDraw(document.getElementById(canvasId));
            this.b2World.SetDebugDraw(this.box2dDebugDraw);
            this.box2dDebugDraw.SetFlags(flag);
        }

        //TODO 
        public clearAll(): void {

        }

        public addRenderer(renderer: any) {
            var found: boolean = false;
            for (var t: number = 0; t < this.renderers.length; t++) {
                if (this.renderers[t] === renderer) {
                    found = true;
                    break;
                }
            }
            if (!found) this.renderers.push(renderer);
        }

        public removeRenderer(renderer: any) {
            for (var t: number = 0; t < this.renderers.length; t++) {
                if (this.renderers[t] === renderer) {
                    this.renderers[t] = null;
                    this.renderers.splice(t);
                    break;
                }
            }
        }

        public remove(item: item.ItemBase): void {
            //Sensor belongs to autoItems, gridmap belongs to gridMaps
            switch (item.constructor["name"]) {
                case "Unit":
                case "Circle":
                case "Polygon":
                case "Edge":
                case "Path":
                    this.items.remove(item);
                    item.remove();
                    break;
                case "Sensor":
                    this.autoItems.remove(item);
                    item.remove();
                    break;
                case "GridMap":
                    this.gridMaps.remove(item);
                    item.remove();
                    break;
            }
            item = null;
        }

        public setupSelector(selector: item.QuadTree): void {
            this.selector = selector;
        }

        public preUpdate(): void {
            this.items.each((item: item.Unit) => {
                item.prepareUpdateCache();
            }, "Unit");
            //if we have QuadTree selector, update it
            if (this.selector) {
                this.selector.clear();
                this.items.each((item: any) => {
                    if (item["b2body"] != null) {
                        var entity: item.ItemEntity = item;
                        var itemSelector: item.QuadSelector = this.selector.getItemSelector(item);
                        if (itemSelector) {
                            this.selector.insert(itemSelector);
                            entity.selector = itemSelector;
                        }
                    }
                });
            }
            //update every DebugRender QuadTree
            if (this.selector) {
                for (var s: number = 0; s < this.renderers.length; s++) {
                    this.renderers[s].preDomainUpdate();
                    //if (this.selector) this.renderers[s].drawQuadTree();
                }
            }
        }

        public update(delta: number): void {

            //Sensor update
            this.autoItems.each((item: item.ItemBase) => {
                if (item["update"]) {
                    item["update"]();
                }
            }, "Sensor");

            //all movable item updates, units also update force
            this.items.each((item: item.ItemBase) => {
                if (item["updateBeforeStep"]) {
                    item["updateBeforeStep"]();
                    if (item.constructor["name"] == "Unit") {
                        (<item.Unit>item).update(delta);
                    }
                }
            });

            this.b2World.Step(0.016, 10, 10);
            if (this.b2World.m_debugDraw) {
                this.b2World.DrawDebugData();
            }

            this.items.each((item: item.ItemBase) => {
                if (item["updateAfterStep"]) {
                    item["updateAfterStep"]();
                }
            });

            for (var s: number = 0; s < this.renderers.length; s++) {
                this.renderers[s].domainUpdate();
            }

        }
        //in RENDER EVENT update 1/60 per second
        public integrate(delta: number): void {
            for (var s: number = 0; s < this.renderers.length; s++) {
                this.renderers[s].integrate(delta);
            }
        }

    }

} 
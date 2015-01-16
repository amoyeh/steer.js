module steer.item {

    export class QuadNode {

        public static TOP_LEFT: number = 0;
        public static TOP_RIGHT: number = 1;
        public static BOTTOM_LEFT: number = 2;
        public static BOTTOM_RIGHT: number = 3;
        public static PARENT: number = 4;

        public items: QuadSelector[];
        public nodes: QuadNode[];
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public depth: number;
        public maxChildren: number;
        public maxDepth: number;

        constructor(x: number, y: number, w: number, h: number, depth: number, maxChildren: number = 3, maxDepth: number = 4) {
            this.items = [];
            this.nodes = [];
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.depth = depth;
            this.maxChildren = maxChildren;
            this.maxDepth = maxDepth;
        }

        //terates all items that match the selector and invokes the supplied callback on them
        public retrieve(selector: QuadSelector, callback: any, instance?: any): void {
            var itemsLen: number = this.items.length;
            for (var i = 0; i < itemsLen; ++i) {
                (instance) ? callback.call(instance, this.items[i]) : callback(this.items[i]);
            }
            if (this.nodes.length) {
                this.findOverlappingNodes(selector, (dir: number) => {
                    this.nodes[dir].retrieve(selector, callback, instance);
                });
            }
        }

        //Finds the regions the item overlaps with. See constants defined above. The callback is called for every region the item overlaps.
        public findOverlappingNodes(item: QuadSelector, callback: any): void {
            if (item.x < this.x + (this.width / 2)) {
                if (item.y < this.y + (this.height / 2)) {
                    callback(QuadNode.TOP_LEFT);
                }
                if (item.y + item.height >= this.y + this.height / 2) {
                    callback(QuadNode.BOTTOM_LEFT);
                }
            }
            if (item.x + item.width >= this.x + (this.width / 2)) {
                if (item.y < this.y + (this.height / 2)) {
                    callback(QuadNode.TOP_RIGHT);
                }
                if (item.y + item.height >= this.y + this.height / 2) {
                    callback(QuadNode.BOTTOM_RIGHT);
                }
            }
        }

        public findInsertNode(item: QuadSelector): any {
            if (item.x + item.width < this.x + (this.width / 2)) {
                if (item.y + item.height < this.y + (this.height / 2)) {
                    return QuadNode.TOP_LEFT;
                }
                if (item.y >= this.y + (this.height / 2)) {
                    return QuadNode.BOTTOM_LEFT;
                }
                return QuadNode.PARENT;
            }
            if (item.x >= this.x + (this.width / 2)) {
                if (item.y + item.height < this.y + (this.height / 2)) {
                    return QuadNode.TOP_RIGHT;
                }
                if (item.y >= this.y + (this.height / 2)) {
                    return QuadNode.BOTTOM_RIGHT;
                }
                return QuadNode.PARENT;
            }
            return QuadNode.PARENT;
        }

        public insert(item: any): void {
            var i: any;
            if (this.nodes.length > 0) {
                i = this.findInsertNode(item);
                if (i === QuadNode.PARENT) {
                    this.items.push(item);
                } else {
                    this.nodes[i].insert(item);
                }
            } else {
                this.items.push(item);
                if (this.items.length > this.maxChildren && this.depth < this.maxDepth) {
                    this.divide();
                }
            }
        }

        public divide(): void {
            var tw: number, th: number, i: number, oldChildren: any;
            var childrenDepth: number = this.depth + 1;
            tw = (this.width / 2);
            th = (this.height / 2);
            //top left
            this.nodes.push(new QuadNode(this.x, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            //top right
            this.nodes.push(new QuadNode(this.x + tw, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            //bottom left
            this.nodes.push(new QuadNode(this.x, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            //bottom right
            this.nodes.push(new QuadNode(this.x + tw, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
            oldChildren = this.items;
            this.items = [];
            for (i = 0; i < oldChildren.length; i++) {
                this.insert(oldChildren[i]);
            }
        }

        public clear(): void {
            var nodeLen: number = this.nodes.length;
            while (nodeLen--) this.nodes[nodeLen].clear();
            this.items = [];
            this.nodes = [];
        }

    }

    export class QuadSelector {

        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public data: any;

        constructor(x: number, y: number, width: number, height: number, data?: any) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.data = data;
        }

        public toString(): string {
            return "x:" + this.x + " y:" + this.y + " w: " + this.width + " h: " + this.height;
        }

    }

    export class QuadTree {

        public rootNode: QuadNode;

        public drawDebug: boolean = false;

        constructor(x: number, y: number, w: number, h: number, maxChildren: number = 3, maxDepth: number = 4) {
            this.rootNode = new QuadNode(x, y, w, h, 0, maxChildren, maxDepth);
        }

        public insert(item: QuadSelector): void {
            this.rootNode.insert(item);
        }

        public retrieve(selector: QuadSelector, callback: any, instance?: any): void {
            return this.rootNode.retrieve(selector, callback, instance);
        }

        public clear(): void {
            this.rootNode.clear();
        }

        public getItemSelector(itemIn: any): QuadSelector {
            var result: QuadSelector;
            if (itemIn["b2body"] != null) {
                var item: ItemEntity = (<ItemEntity>itemIn);
                var bbox = item.getBoundingBox();
                //PixiDebugRender.instance.drawRectangle(bbox.x, bbox.y, bbox.w, bbox.h, 0xFF3300, 1);
                result = new QuadSelector(bbox.x, bbox.y, bbox.w, bbox.h, itemIn);
            }
            return result;
        }

        public quadTreeSelect(item: ItemEntity, optimizeDist: boolean = false): QuadSelector[] {
            var result: QuadSelector[] = [];
            var selector: QuadSelector = this.getItemSelector(item);
            if (selector) {
                if (optimizeDist) {
                    var bbox = item.getBoundingBox();
                    var bp = new Vector(bbox.x + bbox.w * .5, bbox.y + bbox.h * .5);
                    var blen = (bbox.w + bbox.h) * 2;
                }
                this.retrieve(selector, (itemFound: any) => {
                    if (itemFound.data != item) {
                        if (optimizeDist) {
                            var cx = itemFound.x + itemFound.width * .5;
                            var cy = itemFound.y + itemFound.height * .5;
                            if (Vector.distanceSq(bp, new Vector(cx, cy)) < (blen * blen)) {
                                render.PixiDebugRenderer.instance.drawDot(new Vector(cx, cy), 0xFF33FF, 0.1, 1);
                                result.push(itemFound);
                            }
                        } else {
                            result.push(itemFound);
                        }
                    }
                });
            }
            return (result.length > 0) ? result : null;
        }

    }

}

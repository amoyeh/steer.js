var steer;
(function (steer) {
    var item;
    (function (_item) {
        var QuadNode = (function () {
            function QuadNode(x, y, w, h, depth, maxChildren, maxDepth) {
                if (maxChildren === void 0) { maxChildren = 3; }
                if (maxDepth === void 0) { maxDepth = 4; }
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
            QuadNode.prototype.retrieve = function (selector, callback, instance) {
                var _this = this;
                var itemsLen = this.items.length;
                for (var i = 0; i < itemsLen; ++i) {
                    (instance) ? callback.call(instance, this.items[i]) : callback(this.items[i]);
                }
                if (this.nodes.length) {
                    this.findOverlappingNodes(selector, function (dir) {
                        _this.nodes[dir].retrieve(selector, callback, instance);
                    });
                }
            };
            QuadNode.prototype.findOverlappingNodes = function (item, callback) {
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
            };
            QuadNode.prototype.findInsertNode = function (item) {
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
            };
            QuadNode.prototype.insert = function (item) {
                var dirType;
                if (this.nodes.length > 0) {
                    dirType = this.findInsertNode(item);
                    if (dirType === QuadNode.PARENT) {
                        this.items.push(item);
                        item.parent = this;
                    }
                    else {
                        this.nodes[dirType].insert(item);
                        item.parent = this.nodes[dirType];
                    }
                }
                else {
                    this.items.push(item);
                    item.parent = this;
                    if (this.items.length > this.maxChildren && this.depth < this.maxDepth) {
                        this.divide();
                    }
                }
            };
            QuadNode.prototype.divide = function () {
                var tw, th, i, oldChildren;
                var childrenDepth = this.depth + 1;
                tw = (this.width / 2);
                th = (this.height / 2);
                this.nodes.push(new QuadNode(this.x, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
                this.nodes.push(new QuadNode(this.x + tw, this.y, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
                this.nodes.push(new QuadNode(this.x, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
                this.nodes.push(new QuadNode(this.x + tw, this.y + th, tw, th, childrenDepth, this.maxChildren, this.maxDepth));
                oldChildren = this.items;
                this.items = [];
                for (i = 0; i < oldChildren.length; i++) {
                    this.insert(oldChildren[i]);
                }
            };
            QuadNode.prototype.clear = function () {
                var nodeLen = this.nodes.length;
                while (nodeLen--)
                    this.nodes[nodeLen].clear();
                this.items = [];
                this.nodes = [];
            };
            QuadNode.TOP_LEFT = 0;
            QuadNode.TOP_RIGHT = 1;
            QuadNode.BOTTOM_LEFT = 2;
            QuadNode.BOTTOM_RIGHT = 3;
            QuadNode.PARENT = 4;
            return QuadNode;
        })();
        _item.QuadNode = QuadNode;
        var QuadSelector = (function () {
            function QuadSelector(x, y, width, height, data) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.data = data;
            }
            QuadSelector.prototype.toString = function () {
                return "x:" + this.x + " y:" + this.y + " w: " + this.width + " h: " + this.height;
            };
            return QuadSelector;
        })();
        _item.QuadSelector = QuadSelector;
        var QuadTree = (function () {
            function QuadTree(x, y, w, h, maxChildren, maxDepth) {
                if (maxChildren === void 0) { maxChildren = 3; }
                if (maxDepth === void 0) { maxDepth = 4; }
                this.drawDebug = false;
                this.rootNode = new QuadNode(x, y, w, h, 0, maxChildren, maxDepth);
            }
            QuadTree.prototype.insert = function (item) {
                this.rootNode.insert(item);
            };
            QuadTree.prototype.retrieve = function (selector, callback, instance) {
                return this.rootNode.retrieve(selector, callback, instance);
            };
            QuadTree.prototype.clear = function () {
                this.rootNode.clear();
            };
            QuadTree.prototype.getItemSelector = function (itemIn) {
                var result;
                if (itemIn["b2body"] != null) {
                    var item = itemIn;
                    var bbox = item.getBoundingBox();
                    result = new QuadSelector(bbox.x, bbox.y, bbox.w, bbox.h, itemIn);
                }
                return result;
            };
            QuadTree.prototype.quadTreeSelect = function (item) {
                var result = [];
                var useSelector = item.selector;
                this.retrieve(useSelector, function (itemFound) {
                    if (itemFound.data != item) {
                        result.push(itemFound);
                    }
                });
                return (result.length > 0) ? result : null;
            };
            return QuadTree;
        })();
        _item.QuadTree = QuadTree;
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

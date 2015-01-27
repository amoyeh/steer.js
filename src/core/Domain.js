var steer;
(function (steer) {
    var BaseRender = (function () {
        function BaseRender(domain, w, h) {
            this.domain = domain;
            this.w = w;
            this.h = h;
        }
        BaseRender.prototype.preDomainUpdate = function () {
        };
        BaseRender.prototype.domainUpdate = function () {
        };
        BaseRender.prototype.integrate = function (delta) {
            var _this = this;
            this.domain.items.each(function (item) {
                _this.itemRender(item, delta);
            });
            this.domain.autoItems.each(function (item) {
                _this.itemRender(item, delta);
            });
            this.visualRender(delta);
        };
        BaseRender.prototype.itemRender = function (item, delta) {
            var xto, yto, rto = 0;
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
            if (this.updateObject)
                this.updateObject.updateItem(item, xto, yto, rto, delta);
        };
        BaseRender.prototype.visualRender = function (delta) {
            if (this.updateObject)
                this.updateObject.updateStep(delta);
        };
        return BaseRender;
    })();
    steer.BaseRender = BaseRender;
    var Domain = (function () {
        function Domain() {
            this.items = new steer.item.ItemDatas();
            this.autoItems = new steer.item.ItemDatas();
            this.gridMaps = new steer.item.ItemDatas();
            box2d.b2_maxTranslation = 30;
            this.renderers = [];
        }
        Domain.prototype.createB2World = function (gravity) {
            this.b2World = new box2d.b2World(gravity);
            this.contactManager = new steer.ContactManager(this);
            this.b2World.SetContactListener(this.contactManager);
        };
        Domain.prototype.createBox2dDebugDraw = function (canvasId, flag) {
            if (this.b2World == null) {
                console.error("createCanvasDebugDraw() error , b2World not found... ");
                return;
            }
            this.box2dDebugDraw = new DebugDraw(document.getElementById(canvasId));
            this.b2World.SetDebugDraw(this.box2dDebugDraw);
            this.box2dDebugDraw.SetFlags(flag);
        };
        Domain.prototype.clearAll = function () {
        };
        Domain.prototype.addRenderer = function (renderer) {
            var found = false;
            for (var t = 0; t < this.renderers.length; t++) {
                if (this.renderers[t] === renderer) {
                    found = true;
                    break;
                }
            }
            if (!found)
                this.renderers.push(renderer);
        };
        Domain.prototype.removeRenderer = function (renderer) {
            for (var t = 0; t < this.renderers.length; t++) {
                if (this.renderers[t] === renderer) {
                    this.renderers[t] = null;
                    this.renderers.splice(t);
                    break;
                }
            }
        };
        Domain.prototype.remove = function (item) {
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
        };
        Domain.prototype.setupSelector = function (selector) {
            this.selector = selector;
        };
        Domain.prototype.preUpdate = function () {
            var _this = this;
            this.items.each(function (item) {
                item.prepareUpdateCache();
            }, "Unit");
            if (this.selector) {
                this.selector.clear();
                this.items.each(function (item) {
                    if (item["b2body"] != null) {
                        var entity = item;
                        var itemSelector = _this.selector.getItemSelector(item);
                        if (itemSelector) {
                            _this.selector.insert(itemSelector);
                            entity.selector = itemSelector;
                        }
                    }
                });
            }
            if (this.selector) {
                for (var s = 0; s < this.renderers.length; s++) {
                    this.renderers[s].preDomainUpdate();
                }
            }
        };
        Domain.prototype.update = function (delta) {
            this.autoItems.each(function (item) {
                if (item["update"]) {
                    item["update"]();
                }
            }, "Sensor");
            this.items.each(function (item) {
                if (item["updateBeforeStep"]) {
                    item["updateBeforeStep"]();
                    if (item.constructor["name"] == "Unit") {
                        item.update(delta);
                    }
                }
            });
            this.b2World.Step(0.016, 10, 10);
            if (this.b2World.m_debugDraw) {
                this.b2World.DrawDebugData();
            }
            this.items.each(function (item) {
                if (item["updateAfterStep"]) {
                    item["updateAfterStep"]();
                }
            });
            for (var s = 0; s < this.renderers.length; s++) {
                this.renderers[s].domainUpdate();
            }
        };
        Domain.prototype.integrate = function (delta) {
            for (var s = 0; s < this.renderers.length; s++) {
                this.renderers[s].integrate(delta);
            }
        };
        return Domain;
    })();
    steer.Domain = Domain;
})(steer || (steer = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var steer;
(function (steer) {
    var item;
    (function (item) {
        var GridMap = (function (_super) {
            __extends(GridMap, _super);
            function GridMap(x, y, blockSize, gridSize, name) {
                _super.call(this, name);
                this.x = x;
                this.y = y;
                this.blockSize = blockSize;
                this.gridSize = gridSize;
                this.w = this.blockSize.x * this.gridSize.x;
                this.h = this.blockSize.y * this.gridSize.y;
            }
            GridMap.prototype.remove = function () {
                if (this.pixiDebugItem) {
                    this.pixiDebugItem.clear();
                    this.pixiDebugItem.stage.removeChild(this.pixiDebugItem);
                    this.pixiDebugItem.parent.removeChild(this.pixiDebugItem);
                    this.pixiDebugItem.removeStageReference();
                    this.pixiDebugItem = undefined;
                }
                this.domain = null;
            };
            GridMap.prototype.toCenter = function (x, y) {
                var xto = this.blockSize.x * 30 * x + (this.blockSize.x * 15);
                var yto = this.blockSize.y * 30 * y + (this.blockSize.y * 15);
                return new steer.Vector(xto, yto);
            };
            GridMap.prototype.clearPathGrid = function () {
                if (this.pathData) {
                    for (var lx = 0; lx < this.gridSize.x; lx++) {
                        for (var ly = 0; ly < this.gridSize.y; ly++) {
                            this.pathData.setWalkableAt(lx, ly, true);
                        }
                    }
                }
            };
            GridMap.prototype.findPath = function (startx, starty, endx, endy, pathWidth, integrateSize) {
                var finder = new PF.JumpPointFinder({
                    allowDiagonal: false,
                    heuristic: PF.Heuristic.chebyshev
                });
                var path = finder.findPath(startx, starty, endx, endy, this.pathData.clone());
                path = PF.Util.compressPath(path);
                var startLoc = this.toCenter(startx, starty);
                var endLoc = this.toCenter(endx, endy);
                var pathInfo = new steer.item.PathInfo(startLoc, pathWidth, integrateSize);
                for (var s = 1; s < path.length; s++) {
                    var loopLoc = this.toCenter(path[s][0], path[s][1]);
                    pathInfo.lineTo(loopLoc.x, loopLoc.y);
                }
                return pathInfo;
            };
            return GridMap;
        })(item.ItemBase);
        item.GridMap = GridMap;
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

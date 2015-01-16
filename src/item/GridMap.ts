module steer.item {

    export class GridMap extends ItemBase {

        public blockSize: steer.Vector;
        public gridSize: steer.Vector;
        public w: number;
        public h: number;
        public x: number;
        public y: number;

        public pixiDebugItem: any;
        public threeDebugItem: any;

        public velocityData: steer.Vector[][];
        public pathData: any;

        constructor(x: number, y: number, blockSize: steer.Vector, gridSize: steer.Vector, name?: string) {
            super(name);
            this.x = x;
            this.y = y;
            this.blockSize = blockSize;
            this.gridSize = gridSize;
            this.w = this.blockSize.x * this.gridSize.x;
            this.h = this.blockSize.y * this.gridSize.y;
        }

        public remove(): void {
            if (this.pixiDebugItem) {
                this.pixiDebugItem.clear();
                this.pixiDebugItem.stage.removeChild(this.pixiDebugItem);
                this.pixiDebugItem.parent.removeChild(this.pixiDebugItem);
                this.pixiDebugItem.removeStageReference();
                this.pixiDebugItem = undefined;
            }
            this.domain = null;
        }

        private toCenter(x: number, y: number): Vector {
            var xto = this.blockSize.x * 30 * x + (this.blockSize.x * 15);
            var yto = this.blockSize.y * 30 * y + (this.blockSize.y * 15);
            return new Vector(xto, yto);
        }

        public clearPathGrid(): void {
            if (this.pathData) {
                for (var lx = 0; lx < this.gridSize.x; lx++) {
                    for (var ly = 0; ly < this.gridSize.y; ly++) {
                        this.pathData.setWalkableAt(lx, ly, true);
                    }
                }
            }
        }

        public findPath(startx: number, starty: number, endx: number, endy: number, pathWidth: number, integrateSize: number): PathInfo {
            //PF.Grid
            //pathData
            var finder = new PF.JumpPointFinder({
                allowDiagonal: false,
                heuristic: PF.Heuristic.chebyshev
            });
            var path = finder.findPath(startx, starty, endx, endy, this.pathData.clone());
            path = PF.Util.compressPath(path);

            var startLoc: Vector = this.toCenter(startx, starty);
            var endLoc: Vector = this.toCenter(endx, endy);
            var pathInfo: steer.item.PathInfo = new steer.item.PathInfo(startLoc, pathWidth, integrateSize);
            for (var s: number = 1; s < path.length; s++) {
                var loopLoc: Vector = this.toCenter(path[s][0], path[s][1]);
                pathInfo.lineTo(loopLoc.x, loopLoc.y);
            }
            return pathInfo;
            //var newPath = PF.Util.smoothenPath(grid, path);
        }

    }

}   
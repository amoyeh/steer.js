module steer.item {

    export class PathInfo {


        //SVG path analyzer, convert SVGPathElement relative path to absolute
        //====================================================================================
        //====================================================================================
        public static fillSVGPathElement(path: SVGPathElement, pathInfo: PathInfo): PathInfo {
            PathInfo.svgConvertToAbsolute(path);
            var data: any[] = steer.item.PathInfo.parseSVG(path.getAttribute("d"));
            pathInfo.reset();
            //for (var s: number = 0; s < data.length; s++) {
            //    for (var q: number = 1; q < data[s].length; q++) {
            //        if (!isNaN(data[s][q])) {
            //            data[s][q] /= 30;
            //        }
            //    }
            //}
            var sx: number = pathInfo.startPt.x;
            var sy: number = pathInfo.startPt.y;
            for (var s = 0; s < data.length; s++) {
                switch (data[s][0]) {
                    case "L":
                    case "l":
                        pathInfo.lineTo(data[s][1] + sx, data[s][2] + sy);
                        break;
                    case "M":
                    case "m":
                        pathInfo.startPt = new Vector(data[s][1] + sx, data[s][2] + sy);
                        break;
                    case "C":
                    case "c":
                        pathInfo.curveTo(data[s][1] + sx, data[s][2] + sy, data[s][3] + sx, data[s][4] + sy, data[s][5] + sx, data[s][6] + sy);
                        break;
                    case "S":
                    case "s":
                        // smooth curveto draws a cubic Bezier curve from current pen point to x, y
                        //x2, y2 is the end control point.The start control point is is assumed to be the same as the end control point 
                        //of the previous curve.
                        //S	x2,y2 x,y
                        pathInfo.curveTo(data[s-1][5] + sx, data[s-1][6] + sy, data[s][1] + sx, data[s][2] + sy, data[s][3] + sx, data[s][4] + sy);
                        break;
                }
            }
            return pathInfo;
        }

        public static parseSVG(path: string): any[] {
            var data: any = [];
            var svgObjLen: any = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
            var svgSegment: any = /([astvzqmhlc])([^astvzqmhlc]*)/ig
            path.replace(svgSegment, function (_, command, args) {
                var type = command.toLowerCase()
                args = PathInfo.parseSvgEntry(args)
                // overloaded moveTo
                if (type == 'm' && args.length > 2) {
                    data.push([command].concat(args.splice(0, 2)))
                    type = 'l'
                    command = command == 'm' ? 'l' : 'L'
                }
                while (true) {
                    if (args.length == svgObjLen[type]) {
                        args.unshift(command)
                        return data.push(args)
                    }
                    if (args.length < svgObjLen[type]) throw new Error('malformed path data')
                    data.push([command].concat(args.splice(0, svgObjLen[type])))
                }
            });
            return data;
        }

        public static parseSvgEntry(args): any {
            args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig)
            return args ? args.map(Number) : [];
        }
        public static svgConvertToAbsolute(path: SVGPathElement): void {
            var x0, y0, x1, y1, x2, y2;
            var segs: any = path.pathSegList;
            for (var x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; ++i) {
                var seg = segs.getItem(i), c = seg.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(c)) {
                    if ('x' in seg) x = seg.x;
                    if ('y' in seg) y = seg.y;
                } else {
                    if ('x1' in seg) x1 = x + seg.x1;
                    if ('x2' in seg) x2 = x + seg.x2;
                    if ('y1' in seg) y1 = y + seg.y1;
                    if ('y2' in seg) y2 = y + seg.y2;
                    if ('x' in seg) x += seg.x;
                    if ('y' in seg) y += seg.y;
                    switch (c) {
                        case 'm': segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i); break;
                        case 'l': segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i); break;
                        case 'h': segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i); break;
                        case 'v': segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i); break;
                        case 'c': segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i); break;
                        case 's': segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i); break;
                        case 'q': segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i); break;
                        case 't': segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i); break;
                        case 'a': segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i); break;
                        case 'z': case 'Z': x = x0; y = y0; break;
                    }
                }
                // Record the start of a subpath
                if (c == 'M' || c == 'm') x0 = x, y0 = y;
            }
        }
        //====================================================================================
        //====================================================================================


        public static interpolate(percent: number, start: Vector, cp1: Vector, cp2: Vector, end: Vector): Vector {
            function B1(t) { return t * t * t }
            function B2(t) { return 3 * t * t * (1 - t) }
            function B3(t) { return 3 * t * (1 - t) * (1 - t) }
            function B4(t) { return (1 - t) * (1 - t) * (1 - t) }
            var pos = new steer.Vector();
            pos.x = start.x * B1(percent) + cp1.x * B2(percent) + cp2.x * B3(percent) + end.x * B4(percent);
            pos.y = start.y * B1(percent) + cp1.y * B2(percent) + cp2.y * B3(percent) + end.y * B4(percent);
            return pos;
        }

        public static createPath(pathInfo: PathInfo, div30: boolean = false) {
            var copySegs: Vector[] = [];
            var copyDraws: PathDrawInfo[] = [];
            for (var s: number = 0; s < pathInfo.segments.length; s++) {
                var newSeg: steer.Vector = new Vector(pathInfo.segments[s].x, pathInfo.segments[s].y);
                copySegs.push((div30) ? newSeg.div(30) : newSeg);
            }
            for (var k: number = 0; k < pathInfo.drawInfo.length; k++) {
                var copy: any = pathInfo.drawInfo[k];
                var pdi: PathDrawInfo = new PathDrawInfo(new Vector(copy.start.x, copy.start.y), new Vector(copy.end.x, copy.end.y), copy.type);
                if (copy.cp1) pdi.setControlPt(new Vector(copy.cp1.x, copy.cp1.y), new Vector(copy.cp2.x, copy.cp2.y));
                if (div30) {
                    pdi.start.div(30);
                    pdi.end.div(30);
                    if (pdi.cp1) {
                        pdi.cp1.div(30);
                        pdi.cp2.div(30);
                    }
                }
                copyDraws.push(pdi);
            }
            return new Path((div30) ? pathInfo.pathWidth / 30 : pathInfo.pathWidth, copySegs, copyDraws);
        }

        public startPt: Vector;
        public pathWidth: number;
        public segments: Vector[];
        //used only in debugging
        public drawInfo: PathDrawInfo[]; 
        public interpolateSize: number;

        constructor(startPt: Vector, pathWidth: number, interpolateSize: number = 10) {
            this.startPt = startPt;
            this.pathWidth = pathWidth;
            this.interpolateSize = interpolateSize;
            this.reset();
        }

        public curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, tox: number, toy: number): PathInfo {
            if (this.segments.length == 0) this.segments.push(this.startPt.clone());
            var startPt: Vector = this.segments[this.segments.length - 1];
            var addSegs: Vector[] = [];
            for (var k: number = this.interpolateSize - 1; k > -1; k--) {
                var pt: Vector = PathInfo.interpolate(k / (this.interpolateSize - 1), startPt, new Vector(cp1x, cp1y), new Vector(cp2x, cp2y), new Vector(tox, toy));
                addSegs.push(pt);
            }
            if (this.segments.length >= 2) addSegs.shift(); //when weld existing points, the first adding vector is duplicated
            this.segments = this.segments.concat(addSegs);
            var drawinfo: PathDrawInfo = new PathDrawInfo(startPt.clone(), new Vector(tox, toy), PathDrawInfo.TYPE_BEZIER);
            drawinfo.setControlPt(new Vector(cp1x, cp1y), new Vector(cp2x, cp2y));
            this.drawInfo.push(drawinfo);
            return this;
        }

        public lineInterpolate(start: Vector, end: Vector): void {
            var result: Vector[] = [];
            var xabs: number = Math.abs(start.x - end.x);
            var yabs: number = Math.abs(start.y - end.y);
            var xdiff: number = end.x - start.x;
            var ydiff: number = end.y - start.y;
            var length: number = Vector.distance(end, start);
            var intSize: number = Math.floor(length / 200);
            var rate: number = length / intSize;
            var xrate: number = xdiff / intSize;
            var yrate: number = ydiff / intSize;
            for (var s: number = 0; s < intSize; s++) {
                var addVec: Vector = new Vector(start.x + (xrate * s), start.y + (yrate * s));
                this.segments.push(addVec);
            }
            this.segments.push(end);
        }

        public lineTo(tox: number, toy: number): PathInfo {
            if (this.segments.length == 0) this.segments.push(this.startPt.clone());
            var startPt: Vector = this.segments[this.segments.length - 1];
            this.lineInterpolate(startPt, new Vector(tox, toy));
            //this.segments.push(new Vector(tox, toy));
            var drawinfo: PathDrawInfo = new PathDrawInfo(startPt.clone(), new Vector(tox, toy), PathDrawInfo.TYPE_LINE);
            this.drawInfo.push(drawinfo);
            return this;
        }

        public reset(): void {
            this.segments = [];
            this.drawInfo = [];
        }

    }

    //used in debugging to draw informations on the path
    export class PathDrawInfo {

        public static TYPE_LINE: number = 0;
        public static TYPE_BEZIER: number = 1;

        public type: number;
        public start: Vector;
        public end: Vector;
        public cp1: Vector;
        public cp2: Vector;

        constructor(start: Vector, end: Vector, type: number) {
            this.start = start;
            this.end = end;
            this.type = type;
        }

        public setControlPt(cp1: Vector, cp2: Vector): void {
            this.cp1 = cp1;
            this.cp2 = cp2;
        }

        public clone(div30: boolean): PathDrawInfo {
            var newOne: PathDrawInfo = new PathDrawInfo(this.start.clone(), this.end.clone(), this.type);
            if (div30) {
                newOne.start.div(30);
                newOne.end.div(30);
            }
            if (this.type == PathDrawInfo.TYPE_BEZIER) {
                newOne.setControlPt(this.cp1.clone(), this.cp2.clone());
                if (div30) {
                    newOne.cp1.div(30);
                    newOne.cp2.div(30);
                }
            }
            return newOne;
        }

    }

    export class Path extends ItemBase {

        public segments: Vector[];
        public drawInfo: PathDrawInfo[];
        public pathWidth: number;
        public pixiDebugItem: any;
        public threeDebugItem: any;

        constructor(pathWidth: number, segments: Vector[], drawInfo: PathDrawInfo[]) {
            super(null);
            this.segments = segments;
            this.drawInfo = drawInfo;
            this.pathWidth = pathWidth;
        }

        public remove(): void {
            if (this.pixiDebugItem) {
                if (this.pixiDebugItem.parent) {
                    this.pixiDebugItem.parent.removeChild(this.pixiDebugItem);
                    this.pixiDebugItem.removeStageReference();
                    this.pixiDebugItem = null;
                }
            }
            this.domain = null;
        }

    }

} 
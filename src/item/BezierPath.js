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
        var PathInfo = (function () {
            function PathInfo(startPt, pathWidth, interpolateSize) {
                if (interpolateSize === void 0) { interpolateSize = 10; }
                this.startPt = startPt;
                this.pathWidth = pathWidth;
                this.interpolateSize = interpolateSize;
                this.reset();
            }
            PathInfo.fillSVGPathElement = function (path, pathInfo) {
                PathInfo.svgConvertToAbsolute(path);
                var data = steer.item.PathInfo.parseSVG(path.getAttribute("d"));
                pathInfo.reset();
                var sx = pathInfo.startPt.x;
                var sy = pathInfo.startPt.y;
                for (var s = 0; s < data.length; s++) {
                    switch (data[s][0]) {
                        case "L":
                        case "l":
                            pathInfo.lineTo(data[s][1] + sx, data[s][2] + sy);
                            break;
                        case "M":
                        case "m":
                            pathInfo.startPt = new steer.Vector(data[s][1] + sx, data[s][2] + sy);
                            break;
                        case "C":
                        case "c":
                            pathInfo.curveTo(data[s][1] + sx, data[s][2] + sy, data[s][3] + sx, data[s][4] + sy, data[s][5] + sx, data[s][6] + sy);
                            break;
                        case "S":
                        case "s":
                            pathInfo.curveTo(data[s - 1][5] + sx, data[s - 1][6] + sy, data[s][1] + sx, data[s][2] + sy, data[s][3] + sx, data[s][4] + sy);
                            break;
                    }
                }
                return pathInfo;
            };
            PathInfo.parseSVG = function (path) {
                var data = [];
                var svgObjLen = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
                var svgSegment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
                path.replace(svgSegment, function (_, command, args) {
                    var type = command.toLowerCase();
                    args = PathInfo.parseSvgEntry(args);
                    if (type == 'm' && args.length > 2) {
                        data.push([command].concat(args.splice(0, 2)));
                        type = 'l';
                        command = command == 'm' ? 'l' : 'L';
                    }
                    while (true) {
                        if (args.length == svgObjLen[type]) {
                            args.unshift(command);
                            return data.push(args);
                        }
                        if (args.length < svgObjLen[type])
                            throw new Error('malformed path data');
                        data.push([command].concat(args.splice(0, svgObjLen[type])));
                    }
                });
                return data;
            };
            PathInfo.parseSvgEntry = function (args) {
                args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig);
                return args ? args.map(Number) : [];
            };
            PathInfo.svgConvertToAbsolute = function (path) {
                var x0, y0, x1, y1, x2, y2;
                var segs = path.pathSegList;
                for (var x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; ++i) {
                    var seg = segs.getItem(i), c = seg.pathSegTypeAsLetter;
                    if (/[MLHVCSQTA]/.test(c)) {
                        if ('x' in seg)
                            x = seg.x;
                        if ('y' in seg)
                            y = seg.y;
                    }
                    else {
                        if ('x1' in seg)
                            x1 = x + seg.x1;
                        if ('x2' in seg)
                            x2 = x + seg.x2;
                        if ('y1' in seg)
                            y1 = y + seg.y1;
                        if ('y2' in seg)
                            y2 = y + seg.y2;
                        if ('x' in seg)
                            x += seg.x;
                        if ('y' in seg)
                            y += seg.y;
                        switch (c) {
                            case 'm':
                                segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                                break;
                            case 'l':
                                segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                                break;
                            case 'h':
                                segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                                break;
                            case 'v':
                                segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                                break;
                            case 'c':
                                segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                                break;
                            case 's':
                                segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                                break;
                            case 'q':
                                segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                                break;
                            case 't':
                                segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                                break;
                            case 'a':
                                segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                                break;
                            case 'z':
                            case 'Z':
                                x = x0;
                                y = y0;
                                break;
                        }
                    }
                    if (c == 'M' || c == 'm')
                        x0 = x, y0 = y;
                }
            };
            PathInfo.interpolate = function (percent, start, cp1, cp2, end) {
                function B1(t) {
                    return t * t * t;
                }
                function B2(t) {
                    return 3 * t * t * (1 - t);
                }
                function B3(t) {
                    return 3 * t * (1 - t) * (1 - t);
                }
                function B4(t) {
                    return (1 - t) * (1 - t) * (1 - t);
                }
                var pos = new steer.Vector();
                pos.x = start.x * B1(percent) + cp1.x * B2(percent) + cp2.x * B3(percent) + end.x * B4(percent);
                pos.y = start.y * B1(percent) + cp1.y * B2(percent) + cp2.y * B3(percent) + end.y * B4(percent);
                return pos;
            };
            PathInfo.createPath = function (pathInfo, div30) {
                if (div30 === void 0) { div30 = false; }
                var copySegs = [];
                var copyDraws = [];
                for (var s = 0; s < pathInfo.segments.length; s++) {
                    var newSeg = new steer.Vector(pathInfo.segments[s].x, pathInfo.segments[s].y);
                    copySegs.push((div30) ? newSeg.div(30) : newSeg);
                }
                for (var k = 0; k < pathInfo.drawInfo.length; k++) {
                    var copy = pathInfo.drawInfo[k];
                    var pdi = new PathDrawInfo(new steer.Vector(copy.start.x, copy.start.y), new steer.Vector(copy.end.x, copy.end.y), copy.type);
                    if (copy.cp1)
                        pdi.setControlPt(new steer.Vector(copy.cp1.x, copy.cp1.y), new steer.Vector(copy.cp2.x, copy.cp2.y));
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
            };
            PathInfo.prototype.curveTo = function (cp1x, cp1y, cp2x, cp2y, tox, toy) {
                if (this.segments.length == 0)
                    this.segments.push(this.startPt.clone());
                var startPt = this.segments[this.segments.length - 1];
                var addSegs = [];
                for (var k = this.interpolateSize - 1; k > -1; k--) {
                    var pt = PathInfo.interpolate(k / (this.interpolateSize - 1), startPt, new steer.Vector(cp1x, cp1y), new steer.Vector(cp2x, cp2y), new steer.Vector(tox, toy));
                    addSegs.push(pt);
                }
                if (this.segments.length >= 2)
                    addSegs.shift();
                this.segments = this.segments.concat(addSegs);
                var drawinfo = new PathDrawInfo(startPt.clone(), new steer.Vector(tox, toy), PathDrawInfo.TYPE_BEZIER);
                drawinfo.setControlPt(new steer.Vector(cp1x, cp1y), new steer.Vector(cp2x, cp2y));
                this.drawInfo.push(drawinfo);
                return this;
            };
            PathInfo.prototype.lineInterpolate = function (start, end) {
                var result = [];
                var xabs = Math.abs(start.x - end.x);
                var yabs = Math.abs(start.y - end.y);
                var xdiff = end.x - start.x;
                var ydiff = end.y - start.y;
                var length = steer.Vector.distance(end, start);
                var intSize = Math.floor(length / 200);
                var rate = length / intSize;
                var xrate = xdiff / intSize;
                var yrate = ydiff / intSize;
                for (var s = 0; s < intSize; s++) {
                    var addVec = new steer.Vector(start.x + (xrate * s), start.y + (yrate * s));
                    this.segments.push(addVec);
                }
                this.segments.push(end);
            };
            PathInfo.prototype.lineTo = function (tox, toy) {
                if (this.segments.length == 0)
                    this.segments.push(this.startPt.clone());
                var startPt = this.segments[this.segments.length - 1];
                this.lineInterpolate(startPt, new steer.Vector(tox, toy));
                var drawinfo = new PathDrawInfo(startPt.clone(), new steer.Vector(tox, toy), PathDrawInfo.TYPE_LINE);
                this.drawInfo.push(drawinfo);
                return this;
            };
            PathInfo.prototype.reset = function () {
                this.segments = [];
                this.drawInfo = [];
            };
            return PathInfo;
        })();
        item.PathInfo = PathInfo;
        var PathDrawInfo = (function () {
            function PathDrawInfo(start, end, type) {
                this.start = start;
                this.end = end;
                this.type = type;
            }
            PathDrawInfo.prototype.setControlPt = function (cp1, cp2) {
                this.cp1 = cp1;
                this.cp2 = cp2;
            };
            PathDrawInfo.prototype.clone = function (div30) {
                var newOne = new PathDrawInfo(this.start.clone(), this.end.clone(), this.type);
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
            };
            PathDrawInfo.TYPE_LINE = 0;
            PathDrawInfo.TYPE_BEZIER = 1;
            return PathDrawInfo;
        })();
        item.PathDrawInfo = PathDrawInfo;
        var Path = (function (_super) {
            __extends(Path, _super);
            function Path(pathWidth, segments, drawInfo) {
                _super.call(this, null);
                this.segments = segments;
                this.drawInfo = drawInfo;
                this.pathWidth = pathWidth;
            }
            Path.prototype.remove = function () {
                if (this.pixiDebugItem) {
                    if (this.pixiDebugItem.parent) {
                        this.pixiDebugItem.parent.removeChild(this.pixiDebugItem);
                        this.pixiDebugItem.removeStageReference();
                        this.pixiDebugItem = null;
                    }
                }
                this.domain = null;
            };
            return Path;
        })(item.ItemBase);
        item.Path = Path;
    })(item = steer.item || (steer.item = {}));
})(steer || (steer = {}));

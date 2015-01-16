declare module THREE {

    export var ParticleBasicMaterial: any;

    export class TrackballControls {

        constructor(camera: THREE.Camera, element: HTMLElement);
        rotateSpeed: number;
        zoomSpeed: number;
        panSpeed: number;
        noZoom: boolean;
        noPan: boolean;
        staticMoving: boolean;
        dynamicDampingFactor: number;

        update(delta: number);
        reset();

    }

    export var EffectComposer: any;

    export var RenderPass: any;
    export var ShaderPass: any;
    export var FilmPass: any;
    export var BloomPass: any;
    export var DotScreenPass: any;

    export var CopyShader: any;
    export var DotScreenShader: any;
    export var RGBShiftShader: any;
    export var FXAAShader: any;
    export var VignetteShader: any;
    export var FilmShader: any;
    export var DotMatrixShader: any;

}

declare var dat: any;

declare module SAT {

    export class Vector {
        constructor(x: number, y: number);
    }

    export class Circle {
        constructor(position: SAT.Vector, radious: number);
    }

    export class Polygon {
        constructor(position: SAT.Vector, points: SAT.Vector[]);
    }

    export class Box {
        constructor(position: SAT.Vector, width: number, height: number);
    }

    export class Response {
        /** The first object in the collision.*/
        a: any;
        /** The second object in the collison.*/
        b: any;
        /** Magnitude of the overlap on the shortest colliding axis. */
        overlap: number;
        /** The shortest colliding axis(unit-vector) */
        overlapN: SAT.Vector;
        /** The overlap vector(i.e.overlapN.scale(overlap, overlap)).If this vector is subtracted from the position of a, a and b will no longer be colliding. */
        overlapV: SAT.Vector;
        /** Whether the first object is completely inside the second. */
        aInB: boolean;
        /** Whether the second object is completely inside the first. */
        bInA: boolean;
    }

    export class SAT {
        static pointInCircle(point: SAT.Vector, circle: SAT.Circle): boolean;
        static pointInPolygon(point: SAT.Vector, polygon: SAT.Polygon): boolean;
        static testCircleCircle(a: SAT.Circle, b: SAT.Circle, r: SAT.Response): boolean;
        static testPolygonCircle(p: SAT.Polygon, c: SAT.Circle, r: SAT.Response): boolean;
        static testCirclePolygon(c: SAT.Circle, p: SAT.Polygon, r: SAT.Response): boolean;
        static testPolygonPolygon(p1: SAT.Polygon, p2: SAT.Polygon, r: SAT.Response): boolean;
    }


}
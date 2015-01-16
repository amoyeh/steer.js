declare module PF {

    class Node {
        x: number;
        y: number;
        walkable: boolean;
    }

    class Grid {
        width: number;
        height: number;
        constructor(width: number, height: number, matrix?: any);
        getNodeAt(x: number, y: number): any;
        isWalkableAt(x: number, y: number): boolean;
        isInside(x: number, y: number): boolean;
        setWalkableAt(x: number, y: number, walkable: boolean): void;
        clone(): Grid;
    }

    class PathFinder {
        constructor(args: any);
        findPath(x1: number, y1: number, x2: number, y2: number, grid: Grid);
    }

    class JumpPointFinder extends PathFinder { }
    class AStarFinder extends PathFinder { }
    class BreadthFirstFinder extends PathFinder { }
    class BestFirstFinder extends PathFinder { }
    class DijkstraFinder extends PathFinder { }
    class BiAStarFinder extends PathFinder { }
    class BiBestFirstFinder extends PathFinder { }
    class BiDijkstraFinder extends PathFinder { }
    class BiBreadthFirstFinder extends PathFinder { }
    class OrthogonalJumpPointFinder extends PathFinder { }
    class Trace extends PathFinder { }

    class Util {
        static smoothenPath(grid: Grid, path: any);
        static compressPath(path: any);
        static expandPath(path: any);
    }

    class Heuristic {
        static manhattan: string;
        static chebyshev: string;
        static euclidean: string;

    }

}



//declare module mynamespace {
//    class MyClass {
//        data: string;
//        constructor(duration?: number, value?: string);
//        callUpdate1(): boolean;
//        callUpdate2(): string;
//    }
//}
//interface MyStatic {
//    call: any;
//}
//declare var MyStatic: MyStatic;



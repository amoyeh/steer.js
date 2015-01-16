module steer.controls {

    /** core static class used to caculate unit force*/
    export class Behavior {

        static seek(unit: item.Unit, vector: Vector): Vector {
            return BasicControls.seek(unit, vector);
        }

        static avoidObstacle(unit: item.Unit): Vector {
            return AvoidControls.avoidObstacle(unit);
        }

        /**
        apply flee force to the unit
        @unit the target unit to apply force
        @vector the point to seek
        */
        static flee(unit: item.Unit, vector: Vector): Vector {
            return BasicControls.flee(unit, vector);
        }

        /**
        apply pursuit force , the pursuer will seek target's future position
        @unit the pursuer 
        @target the target to seek
        */
        static pursuit(unit: item.Unit, target: item.Unit): Vector {
            return BasicControls.pursuit(unit, target);
        }

        /**
        evade from the target's future position
        @unit the unit to apply evade force
        @target the target to evade
        */
        static evade(unit: item.Unit, target: item.Unit): Vector {
            return BasicControls.evade(unit, target);
        }

        /**
        seek to the target location and if close enough, slow down to stop
        @unit the unit to apply force
        @target the point to arrive
        */
        static arrive(unit: item.Unit, vector: Vector): Vector {
            return BasicControls.arrive(unit, vector);
        }

        static separation(unit: item.Unit, list: item.Unit[]): Vector {
            return BasicControls.separation(unit, list);
        }

        static align(unit: item.Unit, list: item.Unit[]): Vector {
            return BasicControls.align(unit, list);
        }

        static cohesion(unit: item.Unit, list: item.Unit[]): Vector {
            return BasicControls.cohesion(unit, list);
        }

        static initPathUnit(unit: item.Unit, path: item.Path, initOnshortestPt: boolean = true, loopOnPath: boolean = false, pathSeekAheadAmt: number= 1): void {
            return PathAreaControls.initPathUnit(unit, path, initOnshortestPt, loopOnPath, pathSeekAheadAmt);
        }

        static followPath(unit: item.Unit, path: item.Path): Vector {
            return PathAreaControls.followPath(unit, path);
        }

        static initWander(unit: item.Unit, wanderRadius: number, wanderRatioDeg: number): void {
            return BasicControls.initWander(unit, wanderRadius, wanderRatioDeg);
        }

        static wander(unit: item.Unit): Vector {
            return BasicControls.wander(unit);
        }

        static unalignedAvoidance(unit: item.Unit, list: item.Unit[]): Vector {
            return new Vector();
        }

        static avoidUnit(unit: item.Unit, list: item.Unit[]): Vector {
            return AvoidControls.avoidUnit(unit, list);
        }


        static gridmapForce(unit: item.Unit, grid: item.GridMap): Vector {
            return PathAreaControls.gridmapForce(unit, grid);
        }



        //static areaForce(unit: Unit, areas: steer.Area[]): Vector {
        //    return PathAreaControls.areaFoce(unit, areas);
        //}

        //static avoidQueue(unit: Unit, list: Unit[], predictAheadTime: number = 30): Vector {
        //    return AvoidControls.avoidQueue(unit, list, predictAheadTime);
        //}
    }

} 
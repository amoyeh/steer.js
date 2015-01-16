declare module box2d {

    export var b2_maxTranslation: number;
    export var b2_pi_over_180: number;
    export var b2_180_over_pi: number;
    export var b2_two_pi: number;
    export var b2Vec2_zero: b2Vec2;
    export var DEBUG: boolean;
    export var ENABLE_ASSERTS: boolean;
    export var b2_maxFloat: number;
    export var b2_epsilon: number;
    export var b2_epsilon_sq: number;
    export var b2_pi: number;
    export var b2_maxManifoldPoints: number;
    export var b2_maxPolygonVertices: number;
    export var b2_aabbExtension: number;
    export var b2_aabbMultiplier: number;
    export var b2_linearSlop: number;
    export var b2_angularSlop: number;
    export var b2_polygonRadius: number;
    export var b2_maxSubSteps: number;
    export var b2_maxTOIContacts: number;
    export var b2_velocityThreshold: number;
    export var b2_maxLinearCorrection: number;
    export var b2_maxAngularCorrection: number;
    export var b2_maxTranslation: number;
    export var b2_maxTranslationSquared: number;
    export var b2_maxRotation: number;
    export var b2_maxRotationSquared: number;
    export var b2_baumgarte: number;
    export var b2_toiBaumgarte: number;
    export var b2_timeToSleep: number;
    export var b2_linearSleepTolerance: number;
    export var b2_angularSleepTolerance: number;
    export var b2_version: b2Version;
    export var b2_changelist: number;

    export function b2ParseInt(v: string): number;
    export function b2ParseUInt(v: string): number;
    export function b2MakeArray(length: number, init: Function): any[];
    export function b2MakeNumberArray(length: number): number[];
    export function b2Alloc(size: number): any;
    export function b2Free(mem: any): void;
    export function b2Log(var_args: any): void;
    export function b2Assert(condition: boolean, opt_message: string, var_args: any): void;
    export function b2Abs(n: number): number;
    export function b2Min(a: number, b: number): number;
    export function b2Max(a: number, b: number): number;
    export function b2Clamp(a: number, lo: number, hi: number): number;
    export function b2Swap(a: number[], b: number[]): void;
    export function b2IsValid(n: number): boolean;
    export function b2Sq(n: number): number;
    export function b2InvSqrt(n: number): number;
    export function b2Sqrt(n: number): number;
    export function b2Pow(x: number, y: number): number;
    export function b2DegToRad(degree: number): number;
    export function b2RadToDeg(radians: number): number;
    export function b2Cos(radians: number): number;
    export function b2Sin(radians: number): number;
    export function b2Acos(n: number): number;
    export function b2Asin(n: number): number;
    export function b2Atan2(y: number, x: number): number;
    export function b2NextPowerOfTwo(x: number): number;
    export function b2IsPowerOfTwo(x: number): boolean;
    export function b2Random(): number;
    export function b2RandomRange(low: number, high: number): number;
    export function b2AbsV(v: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2MinV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2MaxV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2ClampV(v: b2Vec2, lo: b2Vec2, hi: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2RotateV(v: b2Vec2, c: number, s: number, out: b2Vec2): b2Vec2;
    export function b2RotateRadiansV(v: b2Vec2, radians: number, out: b2Vec2): b2Vec2;
    export function b2RotateDegreesV(v: b2Vec2, degrees: number, out: b2Vec2): b2Vec2;
    export function b2DotVV(a: b2Vec2, b: b2Vec2): number;
    export function b2CrossVV(a: b2Vec2, b: b2Vec2): number;
    export function b2CrossVS(v: b2Vec2, s: number, out: b2Vec2): b2Vec2;
    export function b2CrossVOne(v: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2CrossSV(s: number, v: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2CrossOneV(v: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2AddVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2SubVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2MulSV(s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2AddVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2SubVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2AddVCrossSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2MidVV(s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2ExtVV(s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2IsEqualToV(a: b2Vec2, b: b2Vec2): boolean;
    export function b2DistanceVV(a: b2Vec2, b: b2Vec2): number;
    export function b2DistanceSquaredVV(a: b2Vec2, b: b2Vec2): number;
    export function b2NegV(v: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2DotV3V3(a: b2Vec3, b: b2Vec3): number;
    export function b2CrossV3V3(a: b2Vec3, b: b2Vec3, out: b2Vec3): b2Vec3;
    export function b2AbsM(M: b2Mat22, out: b2Mat22): b2Mat22;
    export function b2MulMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Mat22;
    export function b2MulTMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Mat22;
    export function b2AddMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    export function b2MulMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    export function b2MulTMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    export function b2MulXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2MulTXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2;
    export function b2MulXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
    export function b2MulTXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
    export function b2PairLessThan(pair1: b2Pair, pair2: b2Pair): number;
    export function b2TimeOfImpact(output: b2TOIOutput, input: b2TOIInput): void;
    export function b2MixFriction(friction1: number, friction2: number): number;
    export function b2MixRestitution(restitution1: number, restitution2: number): number;

    export class b2Timer {
        m_start: number;
        Reset(): b2Timer;
        GetMilliseconds(): number;
    }

    export class b2Counter {
        m_count: number;
        m_min_count: number;
        m_max_count: number;
        GetCount(): number;
        GetMinCount(): number;
        GetMaxCount(): number;
        ResetCount(): number;
        ResetMinCount(): void;
        ResetMaxCount(): void;
        Increment(): void;
        Decrement(): void;
    }

    export class b2Version {
        major: number;
        minor: number;
        revision: number;
        constructor(major: number, minor: number, revision: number);
        toString(): string;
    }

    export class b2Vec3 {

        static ZERO: b2Vec3;
        static s_t0: b2Vec3;

        x: number;
        y: number;
        z: number;
        constructor(x: number, y: number, z: number);
        Clone(): b2Vec3;
        SetZero(): b2Vec3;
        SetXYZ(x: number, y: number, z: number): b2Vec3;
        Copy(other: b2Vec3): b2Vec3;
        SelfNeg(): b2Vec3;
        SelfAdd(v: b2Vec3): b2Vec3;
        SelfAddXYZ(x: number, y: number, z: number): b2Vec3;
        SelfSub(v: b2Vec3): b2Vec3;
        SelfSubXYZ(x: number, y: number, z: number): b2Vec3;
        SelfMul(s: number): b2Vec3;

    }
    //export function b2Vec3(x: number, y: number, z: number): b2Vec2;

    export class b2Mat22 {
        static IDENTITY: b2Mat22;
        static FromSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        static FromAngleRadians(radians: number): b2Mat22;
        ex: b2Vec2;
        ey: b2Vec2;
        Clone(): b2Mat22;
        SetSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        SetVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        SetAngle(radians: number): b2Mat22;
        SetAngleRadians(radians: number): b2Mat22;
        SetAngleDegrees(degree: number): b2Mat22;
        Copy(other: b2Mat22): b2Mat22;
        SetIdentity(): b2Mat22;
        SetZero(): b2Mat22;
        GetAngle(): number;
        GetAngleRadians(): number;
        GetInverse(out: b2Mat22): b2Mat22;
        Solve(b_x: number, b_y: number, out: b2Vec2): b2Vec2;
        SelfAbs(): b2Mat22;
        SelfInv(): b2Mat22;
        SelfAddM(m: b2Mat22): b2Mat22;
        SelfSubM(m: b2Mat22): b2Mat22;
    }

    export class b2Mat33 {
        ex: b2Vec3;
        ey: b2Vec3;
        ez: b2Vec3;
        IDENTITY: b2Mat33;
        Clone(): b2Vec3;
        SetVVV(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3): b2Mat33;
        Copy(other: b2Mat33): b2Mat33;
        SetIdentity(): b2Mat33;
        SetZero(): b2Mat33;
        SelfAddM(M: b2Mat33): b2Mat33;
        Solve33(b_x: number, b_y: number, b_z: number, out: b2Vec3): b2Vec3;
        Solve22(b_x: number, b_y: number, out: b2Vec2): b2Vec2;
        GetInverse22(M: b2Mat33): void;
        GetSymInverse33(M: b2Mat33): void;
        b2MulM33V3(A: b2Mat33, v: b2Vec3, out: b2Vec3): b2Vec3;
        b2MulM33XYZ(A: b2Mat33, x: number, y: number, z: number, out: b2Vec3): b2Vec3;
        b2MulM33V2(A: b2Mat33, v: b2Vec2, out: b2Vec2): b2Vec2;
        b2MulM33XY(A: b2Mat33, x: number, y: number, out: b2Vec2): b2Vec2;
    }

    export class b2Rot {
        angle: number;
        s: number;
        c: number;
        static IDENTITY: b2Rot;
        constructor(angle: number);
        Clone(): b2Rot;
        Copy(other: b2Rot): b2Rot;
        SetAngle(angle: number): b2Rot;
        SetAngleRadians(radians: number): b2Rot;
        SetAngleDegrees(radians: number): b2Rot;
        SetIdentity(): b2Rot;
        GetAngle(): number;
        GetAngleRadians(): number;
        GetAngleDegrees(): number;
        GetXAxis(out: b2Vec2): b2Vec2;
        GetYAxis(out: b2Vec2): b2Vec2;
        b2MulRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
        b2MulTRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
        b2MulRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Rot;
        b2MulTRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Rot;
    }

    export class b2Transform {
        static IDENTITY: b2Transform;
        p: b2Vec2;
        q: b2Rot;
        Clone(): b2Transform;
        Copy(other: b2Transform): b2Transform;
        SetIdentity(): b2Transform;
        SetPositionRotation(position: b2Vec2, q: b2Rot): b2Transform;
        SetPositionAngleRadians(position: b2Vec2, a: number): b2Transform;
        SetPosition(position: b2Vec2): b2Transform;
        SetPositionXY(x: number, y: number): b2Transform;
        SetRotation(rotation: number): b2Transform;
        SetRotationAngleRadians(radians: number): b2Transform;
        GetPosition(): b2Vec2;
        GetRotation(): b2Rot;
        GetRotationAngle(): number;
        GetRotationAngleRadians(): number;
        GetAngle(): number;
        GetAngleRadians(): number;
    }

    export class b2Vec2 {

        static ZERO: b2Vec2;
        static UNITX: b2Vec2;
        static UNITY: b2Vec2;
        static s_t0: b2Vec2;
        static s_t1: b2Vec2;
        static s_t2: b2Vec2;
        static s_t3: b2Vec2;
        static MakeArray(len: number): b2Vec2[];

        constructor(x?: number, y?: number)
        x: number;
        y: number;

        Clone(): b2Vec2;
        SetZero(): void;
        SetXY(x: number, y: number): void;
        Copy(other: b2Vec2): b2Vec2;
        SelfAdd(v: b2Vec2): b2Vec2;
        SelfAddXY(x: number, y: number): b2Vec2;
        SelfSub(v: b2Vec2): b2Vec2;
        SelfSubXY(x: number, y: number): b2Vec2;
        SelfMul(s: number): b2Vec2;
        SelfMulAdd(s: number, v: b2Vec2): b2Vec2;
        SelfMulSub(s: number, v: b2Vec2): b2Vec2;
        Dot(v: b2Vec2): number;
        Cross(v: b2Vec2): number;
        Length(): number;
        GetLength(): number;
        LengthSquared(): number;
        GetLengthSquared(): number;
        Normalize(): number;
        SelfNormalize(): b2Vec2;
        SelfRotate(c: number, s: number): b2Vec2;
        SelfRotateRadians(radian: number): b2Vec2;
        SelfRotateDegrees(degree: number): b2Vec2;
        IsValid(): boolean;
        SelfCrossVS(s: number): b2Vec2;
        SelfCrossSV(s: number): b2Vec2;
        SelfMinV(v: b2Vec2): b2Vec2;
        SelfMaxV(v: b2Vec2): b2Vec2;
        SelfAbs(): b2Vec2;
        SelfNeg(): b2Vec2;
        SelfSkew(): b2Vec2;

    }

    export class b2Sweep {
        localCenter: b2Vec2;
        c0: b2Vec2;
        c: b2Vec2;
        a0: number;
        a: number;
        alpha: number;
        Clone(): b2Sweep;
        Copy(other: b2Sweep): b2Sweep;
        GetTransform(xf: b2Transform, beta: number): b2Transform;
        Advance(alpha: number): void;
        Normalize(): void;
    }

    export class b2GrowableStack {
        m_stack: any[];
        m_count: number;
        Reset(): b2GrowableStack;
        Push(element: any): void;
        Pop(): any;
        GetCount(): number;
    }

    export class b2Color {
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r: number, g: number, b: number, a: number);
        SetRGB(rr: number, gg: number, bb: number): b2Color;
        MakeStyleString(alpha: number): string;
        static MakeStyleString(r: number, g: number, b: number, a: number): string;
        static RED: b2Color;
        static GREEN: b2Color;
        static BLUE: b2Color;
    }

    export class b2DrawFlags {
        static e_none: number;
        static e_shapeBit: number;
        static e_jointBit: number;
        static e_aabbBit: number;
        static e_centerOfMassBit: number;
        static e_controllerBit: number;
    }

    export class b2Draw {
        m_drawFlags: number;
        SetFlags(flags: number): void;
        GetFlags(): number;
        AppendFlags(flags: number): void;
        ClearFlags(flags: number): void;
        PushTransform(xf: b2Transform): void;
        PopTransform(xf: b2Transform): void;
        DrawPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void;
        DrawSolidPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void;
        DrawCircle(center: b2Vec2, radius: number, color: b2Color): void;
        DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void;
        DrawSegment(p1: b2Vec2, p2: b2Vec2, color: number);
        DrawTransform(xf: b2Transform): void;
    }

    export class b2MassData {
        center: b2Vec2;
        mass: number;
        I: number;
    }

    export class b2ShapeType {
        static e_unknown: number;
        static e_circleShape: number;
        static e_edgeShape: number;
        static e_polygonShape: number;
        static e_chainShape: number;
        static e_shapeTypeCount: number;
    }

    export class b2Shape {
        m_type: number;
        m_radius: number;
        center: b2Vec2;
        mass: number;
        I: number;
        constructor(type?: number, radius?: number);
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetType(): number;
        GetChildCount(): number;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(): void;

    }

    export class b2ChainShape extends b2Shape {
        static s_edgeShape: b2EdgeShape;
        m_prevVertex: b2Vec2;
        m_nextVertex: b2Vec2;
        m_vertices: b2Vec2[];
        m_count: number;
        m_hasPrevVertex: boolean;
        m_hasNextVertex: boolean;
        Clear(): void;
        CreateLoop(vertices: b2Vec2[], count: number): b2ChainShape;
        CreateChain(vertices: b2Vec2[], count: number): b2ChainShape;
        SetPrevVertex(prevVertex: b2Vec2): b2ChainShape;
        SetNextVertex(nextVertex: b2Vec2): b2ChainShape;
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetChildCount(): number;
        GetChildEdge(edge: b2EdgeShape, index: number): void;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(): void;
    }

    export class b2CircleShape extends b2Shape {
        m_radius: number;
        m_p: b2Vec2;
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetChildCount(): number;
        TestPoint(transform: b2Transform, p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(): void;
    }

    export class b2EdgeShape extends b2Shape {
        m_vertex0: b2Vec2;
        m_vertex1: b2Vec2;
        m_vertex2: b2Vec2;
        m_vertex3: b2Vec2;
        m_hasVertex0: boolean;
        m_hasVertex3: boolean;
        Set(v1: b2Vec2, v2: b2Vec2): b2EdgeShape;
        SetAsEdge(v1: b2Vec2, v2: b2Vec2): b2EdgeShape;
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetChildCount(): number;
        TestPoint(transform: b2Transform, p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(): void;
    }

    export class b2PolygonShape extends b2Shape {
        static ComputeCentroid(vs: b2Vec2[], count: number, out: b2Vec2): b2Vec2;
        m_centroid: b2Vec2;
        m_vertices: box2d.b2Vec2[];
        m_normals: b2Vec2;
        m_count: number;
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        SetAsBox(hx: number, hy: number): b2PolygonShape;
        SetAsOrientedBox(hx: number, hy: number, center: b2Vec2, angle: number): b2PolygonShape;
        Set(vertices: box2d.b2Vec2[], count: number): b2PolygonShape;
        SetAsVector(vertices: b2Vec2[], count: number): b2PolygonShape;
        SetAsArray(vertices: b2Vec2[], count: number): b2PolygonShape;
        GetChildCount(): number;
        TestPoint(transform: b2Transform, p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        Validate(): boolean;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(): void;
    }

    export class b2TreeNode {
        m_id: number;
        aabb: b2AABB;
        userData: any;
        parent: b2TreeNode;
        child1: b2TreeNode;
        child2: b2TreeNode;
        height: number;
        IsLeaf: boolean;
    }

    export class b2DynamicTree {

        static s_stack: b2GrowableStack;
        static s_r: b2Vec2;
        static s_v: b2Vec2;
        static s_abs_v: b2Vec2;
        static s_segmentAABB: b2AABB;
        static s_subInput: b2RayCastInput;
        static s_combinedAABB: b2AABB;
        static s_aabb: b2AABB;

        m_root: b2TreeNode;
        m_freeList: b2TreeNode;
        m_path: number;
        m_insertionCount: number;
        s_node_id: number;

        GetUserData(): b2TreeNode;
        GetFatAABB(proxy: b2TreeNode): b2AABB;
        Query(callback: Function, aabb: b2AABB): void;
        AllocateNode(): void;
        FreeNode(node: b2TreeNode): void;
        CreateProxy(aabb: b2AABB, userData: any): b2TreeNode;
        DestroyProxy(proxy: b2TreeNode): void;
        MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): boolean;
        InsertLeaf(leaf: b2TreeNode): void;
        RemoveLeaf(leaf: b2TreeNode): void;
        Balance(A: b2TreeNode): b2TreeNode;
        GetHeight(): number;
        GetAreaRatio(): number;
        ComputeHeightNode(node: b2TreeNode): number;
        ComputeHeight(): number;
        ValidateStructure(index: b2TreeNode): void;
        ValidateMetrics(index: b2TreeNode): void;
        Validate(): void;
        GetMaxBalance(): number;
        RebuildBottomUp(): void;
        ShiftOrigin(newOrigin: b2Vec2): void;
    }

    export class RaycastCallback {
        m_hit: boolean;
        m_point: box2d.b2Vec2;
        m_normal: box2d.b2Vec2;
        fixture: box2d.b2Fixture;
        ptStart: box2d.b2Vec2;
        ptEnd: box2d.b2Vec2;
    }

    export class b2Body {
        m_xf: b2Transform;
        m_out_xf: b2Transform;
        m_sweep: b2Sweep;
        m_out_sweep: b2Sweep;

        //FIX m_jointList: b2JointEdge;
        //FIX m_contactList: b2ContactEdge;

        m_prev: b2Body;
        m_next: b2Body;
        m_linearVelocity: b2Vec2;
        m_out_linearVelocity: b2Vec2;
        m_angularVelocity: number;
        m_linearDamping: number;
        m_angularDamping: number;
        m_gravityScale: number;
        m_torque: number;
        m_sleepTime: number;
        m_type: number;
        m_mass: number;
        m_invMass: number;
        m_I: number;
        m_invI: number;
        m_userData: any;
        m_fixtureList: b2Fixture;
        m_fixtureCount: number;
        //FIX m_controllerList:b2ControllerEdge;
        m_controllerCount: number;
        m_force: b2Vec2;
        m_flags: number;
        m_islandIndex: number;
        m_world: b2World;

        CreateFixture(def: b2FixtureDef): b2Fixture;
        CreateFixture2(shape: b2Shape, density: number): b2Fixture;
        DestroyFixture(fixture: b2Fixture): void;
        SetTransformVecRadians(position: b2Vec2, angle: number): void;
        SetTransformXYRadians(x: number, y: number, angle: number): void;
        SetTransform(xf: b2Transform): void;
        GetTransform(out: b2Transform): b2Transform;
        GetPosition(out?: b2Vec2): b2Vec2;
        SetPosition(position: b2Vec2): void;
        SetPositionXY(x: number, y: number): void;
        GetAngle(): number;
        GetAngleRadians(): number;
        GetAngleDegrees(): number;
        SetAngle(angle: number): void;
        SetAngleRadians(angle: number): void;
        SetAngleDegrees(degree: number): void;
        GetWorldCenter(out: b2Vec2): b2Vec2;
        GetLocalCenter(out: b2Vec2): b2Vec2;
        SetLinearVelocity(v: b2Vec2): void;
        GetLinearVelocity(out: b2Vec2): b2Vec2;

        SetAngularVelocity(w: number): void;
        GetAngularVelocity(): number;
        GetDefinition(bd: b2BodyDef): b2BodyDef;
        ApplyForce(force: b2Vec2, point: b2Vec2, wake: boolean): void;
        ApplyForceToCenter(force: b2Vec2, wake: boolean): void;
        ApplyTorque(torque: number, wake: boolean): void;
        ApplyLinearImpulse(impulse: b2Vec2, point: b2Vec2, wake: boolean): void;
        ApplyAngularImpulse(impulse: number, wake: boolean): void;
        GetMass(): number;
        GetInertia(): number;
        GetMassData(data: b2MassData): b2MassData;
        SetMassData(massData: b2MassData): void;
        ResetMassData(): void;
        GetWorldPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetWorldVector(localVector: b2Vec2, out: b2Vec2): b2Vec2;
        GetLocalPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetLocalVector(localVector: b2Vec2, out: b2Vec2): b2Vec2;
        GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetLinearVelocityFromLocalPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetLinearDamping(): number;
        SetLinearDamping(linearDamping: number): void;
        GetAngularDamping(): number;
        SetAngularDamping(angularDamping: number): void;
        GetGravityScale(): number;
        SetGravityScale(scale: number): void;
        SetType(type: number): void;
        GetType(): number;
        SetBullet(flag: boolean): void;
        IsBullet(): boolean;
        SetSleepingAllowed(flag: boolean): void;
        IsSleepingAllowed(): boolean;
        SetAwake(flag: boolean): void;
        IsAwake(): boolean;
        SetActive(flag: boolean): void;
        IsActive(): boolean;
        SetFixedRotation(flag: boolean): void;
        IsFixedRotation(): boolean;
        GetFixtureList(): b2Fixture;
        //FIX GetJointList(): b2JointEdge;
        //FIX GetContactList(): b2ContactEdge;
        GetNext(): b2Body;
        GetUserData(): any;
        SetUserData(data: any): void;
        GetWorld(): b2World;
        SynchronizeFixtures(): void;
        SynchronizeTransform(): void;
        ShouldCollide(other: b2Body): boolean;
        Advance(alpha: number): void;
        Dump(): void;
        //FIX GetControllerList(): b2ControllerEdge;
        GetControllerCount(): number;
    }

    export class b2BodyType {
        public static b2_dynamicBody: number;
        public static b2_staticBody: number;
        public static b2_kinematicBody: number;
    }

    export class b2BodyDef {
        Position: b2Vec2;
        linearVelocity: b2Vec2;
        type: number;
        angle: number;
        angularVelocity: number;
        linearDamping: number;
        angularDamping: number;
        allowSleep: boolean;
        awake: boolean;
        fixedRotation: boolean;
        bullet: boolean;
        active: boolean;
        userData: any;
        gravityScale: number;
    }

    export class b2BodyFlag {
        e_none: number;
        e_islandFlag: number;
        e_awakeFlag: number;
        e_autoSleepFlag: number;
        e_bulletFlag: number;
        e_fixedRotationFlag: number;
        e_activeFlag: number;
        e_toiFlag: number;
    }

    export class b2Pair {
        proxyA: b2TreeNode;
        proxyB: b2TreeNode;
    }

    export class b2BroadPhase {
        m_tree: b2DynamicTree;
        m_proxyCount: number;
        m_moveCount: number;
        m_moveBuffer: b2TreeNode[];
        m_pairCount: number;
        m_pairBuffer: b2Pair[];
        CreateProxy(aabb: b2AABB, userData: any): b2TreeNode;
        DestroyProxy(proxy: b2TreeNode): void;
        MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): void;
        TouchProxy(proxy: b2TreeNode): void;
        GetFatAABB(proxy: b2TreeNode): b2AABB;
        GetUserData(proxy: b2TreeNode): any;
        TestOverlap(proxyA: b2TreeNode, proxyB: b2TreeNode): boolean;
        GetProxyCount(): number;
        GetTreeHeight(): number;
        GetTreeBalance(): number;
        GetTreeQuality(): number;
        ShiftOrigin(newOrigin: b2Vec2): void;
        UpdatePairs(contactManager): void;
        Query(callback: Function, aabb: b2AABB): void;
        RayCast(callback: Function, input: b2RayCastInput): void;
        BufferMove(proxy: b2TreeNode): void;
        UnBufferMove(proxy: b2TreeNode): void;
    }

    export class b2CollideCircles {
        static s_pA: b2Vec2;
        static s_pB: b2Vec2;
        constructor(manifold, circleA, xfA, circleB, xfB);
    }

    export class b2CollidePolygonAndCircle {
        static s_c: b2Vec2;
        static s_cLocal: b2Vec2;
        static s_faceCenter: b2Vec2;
        constructor(manifold: b2Manifold, polygonA: b2PolygonShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform);
    }

    export class b2CollideEdgeAndCircle {
        static s_Q: b2Vec2;
        static s_e: b2Vec2;
        static s_d: b2Vec2;
        static s_e1: b2Vec2;
        static s_e2: b2Vec2;
        static s_P: b2Vec2;
        static s_n: b2Vec2;
        static s_id: b2ContactID;
        constructor(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform);
    }

    export class b2EPAxisType {
        e_unknown: number;
        e_edgeA: number;
        e_edgeB: number;
    }

    export class b2EPAxis {
        type: number;
        index: number;
        separation: number;
    }

    export class b2TempPolygon {
        vertices: b2Vec2[];
        normals: b2Vec2[];
        count: number;
    }

    export class b2ReferenceFace {
        i1: number;
        i2: number;
        v1: b2Vec2;
        v2: b2Vec2;
        normal: b2Vec2;
        sideNormal1: b2Vec2;
        sideNormal2: b2Vec2;
        sideOffset1: number;
        sideOffset2: number;
    }

    export class b2EPColliderVertexType {
        e_isolated: number;
        e_concave: number;
        e_convex: number;
    }

    export class b2EPCollider {
        m_polygonB: b2TempPolygon;
        m_xf: b2Transform;
        m_centroidB: b2Vec2;
        m_v0: b2Vec2;
        m_v1: b2Vec2;
        m_v2: b2Vec2;
        m_v3: b2Vec2;
        m_normal: b2Vec2;
        m_normal0: b2Vec2;
        m_normal1: b2Vec2;
        m_normal2: b2Vec2;
        m_type1: number;
        m_type2: number;
        m_lowerLimit: b2Vec2;
        m_upperLimit: b2Vec2;
        m_radius: number;
        m_front: boolean;
        Collide(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, polygonB: b2PolygonShape, xfB: b2Transform): void;
        ComputeEdgeSeparation(out: b2EPAxis): b2EPAxis;
        ComputePolygonSeparation(out: b2EPAxis): b2EPAxis;
    }

    export class b2CollideEdgeAndPolygon {
        static s_collider: b2EPCollider;
        constructor(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, polygonB: b2PolygonShape, xfB: b2Transform);
    }

    export class b2FindMaxSeparation {
        static s_xf: b2Transform;
        static s_n: b2Vec2;
        static s_v1: b2Vec2;
        constructor(edgeIndex: number[], poly1: b2PolygonShape, xf1: b2Transform, poly2: b2PolygonShape, xf2: b2Transform);
    }

    export class b2FindIncidentEdge {
        static s_normal1: b2Vec2;
        constructor(c: b2ClipVertex, poly1: b2PolygonShape, xf1: b2Transform, edge1: number, poly2: b2PolygonShape, xf2: b2Transform);
    }

    export class b2CollidePolygons {
        constructor(manifold: b2Manifold, polyA: b2PolygonShape, xfA: b2Transform, polyB: b2PolygonShape, xfB: b2Transform);
    }

    export class b2ContactFeatureType {
        e_vertex: number;
        e_face: number;
    }

    export class b2ContactFeature {
        _id: number;
        _indexA: number;
        _indexB: number;
        _typeA: number;
        _typeB: number;
        constructor(id: number);
    }

    export class b2ContactID {
        cf: b2ContactFeature;
        key: number;
        Copy(o: b2ContactID): b2ContactID;
        Clone(): b2ContactID;
    }

    export class b2ManifoldPoint {
        localPoint: b2Vec2;
        id: b2ContactID;
        normalImpulse: number;
        tangentImpulse: number;
        MakeArray(length: number): b2ManifoldPoint[];
        Reset(): void;
        Copy(o: b2ManifoldPoint): b2ManifoldPoint;
    }

    export class b2ManifoldType {
        e_unknown: number;
        e_circles: number;
        e_faceA: number;
        e_faceB: number;
    }

    export class b2Manifold {
        points: b2ManifoldPoint[];
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        type: number;
        pointCount: number;
        Reset(): void;
        Copy(o: b2Manifold): b2Manifold;
        Clone(): b2Manifold;
    }

    export class b2WorldManifold {
        normal: b2Vec2;
        points: b2Vec2;
        separations: number[];
        Initialize(manifold: b2Manifold, xfA: b2Transform, radiusA: number, xfB: b2Transform, radiusB: number): void;
    }

    export class b2PointState {
        b2_nullState: number;
        b2_addState: number;
        b2_persistState: number;
        b2_removeState: number;
    }

    export function b2GetPointStates(state1: b2PointState[], state2: b2PointState[], manifold1: b2Manifold, manifold2: b2Manifold): void;

    export class b2ClipVertex {
        v: b2Vec2;
        id: b2ContactID;
        MakeArray(length: number): b2ClipVertex[];
        Copy(other: b2ClipVertex): b2ClipVertex;
    }

    export class b2RayCastInput {
        p1: b2Vec2;
        p2: b2Vec2;
        maxFraction: number;
        Copy(o: b2RayCastInput): b2RayCastInput;
    }

    export class b2RayCastOutput {
        normal: b2Vec2;
        fraction: number;
        Copy(o: b2RayCastOutput): b2RayCastOutput;
    }

    export class b2AABB {
        static Combine(aabb1: b2AABB, aabb2: b2AABB, out: b2AABB): b2AABB;
        lowerBound: box2d.b2Vec2;
        upperBound: box2d.b2Vec2;
        m_out_center: box2d.b2Vec2;
        m_out_extent: box2d.b2Vec2;
        Copy(o: b2AABB): b2AABB;
        IsValid(): boolean;
        GetCenter(): b2Vec2;
        GetExtents(): b2Vec2;
        GetPerimeter(): number;
        Combine1(aabb: b2AABB): b2AABB;
        Combine2(aabb1: b2AABB, aabb2: b2AABB): b2AABB;
        Contains(aabb: b2AABB): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput): boolean;
        TestOverlap(other: b2AABB): boolean;
    }

    export function b2TestOverlapAABB(a: b2AABB, b: b2AABB): boolean;
    export function b2ClipSegmentToLine(vOut: b2ClipVertex[], vIn: b2ClipVertex[], normal: b2Vec2, offset: number, vertexIndexA: number): number;
    export function b2TestOverlapShape(shapeA: b2Shape, indexA: number, shapeB: b2Shape, indexB: number, xfA: b2Transform, xfB: b2Transform): boolean;

    export class b2DistanceProxy {
        m_buffer: b2Vec2[];
        m_vertices: b2Vec2[];
        m_count: number;
        m_radius: number;
        Reset(): b2DistanceProxy;
        SetShape(shape: b2Shape, index: number): void;
        GetSupport(d: b2Vec2): number;
        GetSupportVertex(d: b2Vec2, out: b2Vec2): b2Vec2;
        GetVertexCount(): number;
        GetVertex(index: number): b2Vec2;
    }

    export class b2SimplexCache {
        metric: number;
        count: number;
        indexA: number;
        indexB: number;
        Reset(): b2SimplexCache;
    }

    export class b2DistanceInput {
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        transformA: b2Transform;
        transformB: b2Transform;
        useRadii: boolean;
        Reset(): b2DistanceInput;
    }

    export class b2DistanceOutput {
        pointA: b2Vec2;
        pointB: b2Vec2;
        distance: number;
        iterations: number;
        Reset(): b2DistanceOutput;
    }

    export var b2_gjkCalls: number;
    export var b2_gjkIters: number;
    export var b2_gjkMaxIters: number;
    export var g_blockSolve: boolean;

    export class b2SimplexVertex {
        wA: b2Vec2;
        wB: b2Vec2;
        w: b2Vec2;
        a: number;
        indexA: number;
        indexB: number;
        Copy(o: b2SimplexVertex): b2SimplexVertex;
    }

    export class b2Simplex {
        m_v1: b2SimplexVertex;
        m_v2: b2SimplexVertex;
        m_v3: b2SimplexVertex;
        m_vertices: b2SimplexVertex[];
        m_count: number;
        ReadCache(cache: b2SimplexCache, proxyA: b2DistanceProxy, transformA: b2Transform, proxyB: b2DistanceProxy, transformB: b2Transform): void;
        WriteCache(cache: b2SimplexCache): void;
        GetSearchDirection(out: b2Vec2): b2Vec2;
        GetClosestPoint(out: b2Vec2): b2Vec2;
        GetWitnessPoints(pA: b2Vec2, pB: b2Vec2): b2Vec2;
        GetMetric(): number;
        Solve2(): void;
        Solve3(): void;
        static s_e12: b2Vec2;
        static s_e13: b2Vec2;
        static s_e23: b2Vec2;
    }

    export class b2Distance {
        static s_simplex: b2Simplex;
        static s_saveA: number[];
        static s_saveB: number[];
        static s_p: b2Vec2;
        static s_d: b2Vec2;
        static s_normal: b2Vec2;
        static s_supportA: b2Vec2;
        static s_supportB: b2Vec2;
        constructor(output: b2DistanceOutput, cache: b2SimplexCache, input: b2DistanceInput);
    }

    export class b2TOIInput {
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        sweepA: b2Sweep;
        sweepB: b2Sweep;
        tMax: number;
    }

    export class b2TOIOutputState {
        e_unknown: number;
        e_failed: number;
        e_overlapped: number;
        e_touching: number;
        e_separated: number;
    }

    export class b2TOIOutput {
        state: number;
        t: number;
    }

    export class b2SeparationFunctionType {
        e_unknown: number;
        e_points: number;
        e_faceA: number;
        e_faceB: number;
    }

    export class b2SeparationFunction {
        m_sweepA: b2Sweep;
        m_sweepB: b2Sweep;
        m_localPoint: b2Vec2;
        m_axis: b2Vec2;
        m_type: number;
        Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, sweepA: b2Sweep, proxyB: b2DistanceProxy, sweepB: b2Sweep, t1: number);
        FindMinSeparation(indexA: number[], indexB: number[], t: number): number;
        Evaluate(indexA: number, indexB: number, t: number): number;
    }

    export class b2Profile {
        step: number;
        collide: number;
        solve: number;
        solveInit: number;
        solveVelocity: number;
        solvePosition: number;
        broadphase: number;
        solveTOI: number;
        Reset(): b2Profile;
    }

    export class b2TimeStep {
        dt: number;
        inv_dt: number;
        dtRatio: number;
        velocityIterations: number;
        positionIterations: number;
        warmStarting: boolean;
        Copy(step: b2TimeStep): b2TimeStep;
    }

    export class b2Position {
        c: b2Vec2;
        a: number;
        static MakeArray(length: number): b2Position[];
    }

    export class b2Velocity {
        v: b2Vec2;
        w: number;
        static MakeArray(length: number): b2Velocity[];
    }

    export class b2SolverData {
        step: b2TimeStep;
        positions: b2Position;
        velocities: b2Velocity;
    }

    export class b2Contact {
        m_flags: number;
        m_prev: b2Contact;
        m_next: b2Contact;
        m_nodeA: b2ContactEdge;
        m_nodeB: b2ContactEdge;
        m_fixtureA: b2Fixture;
        m_fixtureB: b2Fixture;
        m_indexA: number;
        m_indexB: number;
        m_manifold: b2Manifold;
        m_toiCount: number;
        m_toi: number;
        m_friction: number;
        m_restitution: number;
        m_tangentSpeed: number;
        m_oldManifold: b2Manifold;
        GetManifold(): b2Manifold;
        GetWorldManifold(worldManifold: b2WorldManifold): void;
        IsTouching(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        GetNext(): b2Contact;
        GetFixtureA(): b2Fixture;
        GetChildIndexA(): number;
        GetFixtureB(): b2Fixture;
        GetChildIndexB(): number;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
        FlagForFiltering(): void;
        SetFriction(friction: number): void;
        GetFriction(): number;
        ResetFriction(): void;
        SetRestitution(friction: number): void;
        GetRestitution(): number;
        ResetRestitution(): void;
        SetTangentSpeed(speed: number): void;
        GetTangentSpeed(): number;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Update(listener: b2ContactListener): void;
        ComputeTOI(sweepA: b2Sweep, sweepB: b2Sweep): number;
    }

    export class b2DestructionListener {
        SayGoodbyeJoint(joint: b2Joint): void;
        SayGoodbyeFixture(fixture: b2Fixture): void;
    }

    export class b2ContactFilter {
        static b2_defaultFilter: b2ContactFilter;
        ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
    }

    export class b2ContactImpulse {
        normalImpulses: number[];
        tangentImpulses: number[];
        count: number;
    }

    export class b2ContactListener {
        b2_defaultListener: b2ContactListener;
        BeginContact(contact: b2Contact): void;
        EndContact(contact: b2Contact): void;
        PreSolve(contact: b2Contact, oldManifold: b2Manifold): void;
        PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void;
    }

    export class b2QueryCallback {
        ReportFixture(fixture: b2Fixture): boolean;
    }

    export class b2RayCastCallback {
        ReportFixture(fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
    }

    export class b2ContactEdge {
        other: b2Body;
        contact: b2Contact;
        prev: b2ContactEdge;
        next: b2ContactEdge;
    }

    export class b2ContactFlag {
        e_none: number;
        e_islandFlag: number;
        e_touchingFlag: number;
        e_enabledFlag: number;
        e_filterFlag: number;
        e_bulletHitFlag: number;
        e_toiFlag: number;
    }

    export class b2ChainAndCircleContact extends b2Contact {
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }

    export class b2ChainAndPolygonContact extends b2Contact {
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }

    export class b2EdgeAndCircleContact extends b2Contact {
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }

    export class b2EdgeAndPolygonContact extends b2Contact {
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }

    export class b2PolygonAndCircleContact extends b2Contact {
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }

    export class b2PolygonContact extends b2Contact {
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }

    export class b2CircleContact extends b2Contact {
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }

    export class b2ContactRegister {
        createFcn: any;
        destroyFcn: any;
        private: boolean;
    }

    export class b2ContactFactory {
        constructor(allocator: any);
        m_allocator: any;
        AddType(createFcn: any, destroyFcn: any, type1: number, type2: number);
        InitializeRegisters(): void;
        Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Destroy(contact: b2Contact): void;
    }

    export class b2VelocityConstraintPoint {
        static MakeArray(length: number): b2VelocityConstraintPoint[];
        rA: b2Vec2;
        rB: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        normalMass: number;
        tangentMass: number;
        velocityBias: number;
    }

    export class b2ContactVelocityConstraint {
        points: b2VelocityConstraintPoint[];
        normal: b2Vec2;
        tangent: b2Vec2;
        normalMass: b2Mat22;
        K: b2Mat22;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
        invIA: number;
        invIB: number;
        friction: number;
        restitution: number;
        tangentSpeed: number;
        pointCount: number;
        contactIndex: number;
        static MakeArray(length: number): b2ContactVelocityConstraint[];
    }

    export class b2ContactPositionConstraint {
        static MakeArrayz(length: number): b2ContactPositionConstraint[];
        localPoints: b2Vec2[];
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
        localCenterA: b2Vec2;
        localCenterB: b2Vec2;
        invIA: number;
        invIB: number;
        type: number;
        radiusA: number;
        radiusB: number;
        pointCount: number;
    }

    export class b2ContactSolverDef {
        step: b2TimeStep;
        contacts: b2Contact[];
        count: number;
        positions: b2Position[];
        velocities: b2Velocity[];
        allocator: any;
    }

    export class b2ContactSolver {
        m_step: b2TimeStep;
        m_positions: b2Position[];
        m_velocities: b2Velocity[];
        m_allocator: any;
        m_positionConstraints: b2ContactPositionConstraint[];
        m_velocityConstraints: b2ContactVelocityConstraint[];
        m_contacts: b2Contact[];
        m_count: number;
        Initialize(def: b2ContactSolverDef): b2ContactSolver;
        InitializeVelocityConstraints(): void;
        WarmStart(): void;
        SolveVelocityConstraints: void;
        StoreImpulses(): void;
        SolvePositionConstraints(): boolean;
        SolveTOIPositionConstraints(toiIndexA: number, toiIndexB: number): boolean;
    }

    export class b2PositionSolverManifold {
        normal: b2Vec2;
        point: b2Vec2;
        separation: number;
        Initialize(pc: b2ContactPositionConstraint, xfA: b2Transform, xfB: b2Transform, index: number): void;
    }

    export class b2JointType {
        e_unknownJoint: number;
        e_revoluteJoint: number;
        e_prismaticJoint: number;
        e_distanceJoint: number;
        e_pulleyJoint: number;
        e_mouseJoint: number;
        e_gearJoint: number;
        e_wheelJoint: number;
        e_weldJoint: number;
        e_frictionJoint: number;
        e_ropeJoint: number;
        e_motorJoint: number;
        e_areaJoint: number;
    }

    export class b2LimitState {
        e_inactiveLimit: number;
        e_atLowerLimit: number;
        e_atUpperLimit: number;
        e_equalLimits: number;
    }

    export class b2Jacobian {
        linear: b2Vec2;
        angularA: number;
        angularB: number;
        SetZero(): b2Jacobian;
        Set(x: b2Vec2, a1: number, a2: number): b2Jacobian;
    }

    export class b2JointEdge {
        other: b2Body;
        joint: b2Joint;
        prev: b2JointEdge;
        next: b2JointEdge;
    }

    export class b2JointDef {
        constructor(type: number);
        userData: any;
        bodyA: b2Body;
        bodyB: b2Body;
        collideConnected: boolean;
    }

    export class b2Joint {
        constructor(def: b2JointDef);
        m_type: b2JointType;
        m_prev: b2Joint;
        m_next: b2Joint;
        m_edgeA: b2JointEdge;
        m_edgeB: b2JointEdge;
        m_bodyA: b2Body;
        m_bodyB: b2Body;
        m_index: number;
        m_islandFlag: boolean;
        m_collideConnected: boolean;
        m_userData: any;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetType(): b2JointType;
        GetBodyA(): b2Body;
        GetBodyB(): b2Body;
        GetNext(): b2Joint;
        GetUserData(): any;
        SetUserData(data: any): void;
        GetCollideConnected(): boolean;
        Dump(): void;
        IsActive(): boolean;
        ShiftOrigin(newOrigin: b2Vec2): void;
    }

    export class b2AreaJointDef extends b2JointDef {
        world: b2World;
        bodies: b2Body[];
        frequencyHz: number;
        dampingRatio: number;
        AddBody(body: b2Body): void;
    }
    export class b2AreaJoint extends b2Joint {
        constructor(def: b2AreaJointDef);
        m_bodies: b2Body[];
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_impulse: number;
        m_targetLengths: any;
        m_targetArea: number;
        m_normals: any;
        m_joints: any;
        m_deltas: any;
        m_delta: any;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(): void;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }

    export class b2DistanceJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        length: number;
        frequencyHz: number;
        dampingRatio: number;
        Initialize(b1: b2Body, b2: b2Body, anchor1: b2Vec2, anchor2: b2Vec2): void;
    }
    export class b2DistanceJoint extends b2Joint {
        constructor(def: b2DistanceJointDef);
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_bias: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_gamma: number;
        m_impulse: number;
        m_length: number;
        m_indexA: number;
        m_indexB: number;
        m_u: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        SetLength(length: number): void;
        GetLength(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(): void;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }

    export class b2FrictionJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxForce: number;
        maxTorque: number;
        Initialize(b1: b2Body, b2: b2Body, anchor1: b2Vec2, anchor2: b2Vec2): void;
    }
    export class b2FrictionJoint extends b2Joint {
        constructor(def: b2FrictionJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_linearMass: b2Mat22;
        m_angularMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;

        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        Dump(): void;
    }

    export class b2GearJointDef extends b2JointDef {
        joint1: b2Joint;
        joint2: b2Joint;
        ratio: number;
    }
    export class b2GearJoint extends b2Joint {
        constructor(def: b2GearJointDef);
        m_joint1: b2Joint;
        m_joint2: b2Joint;
        m_typeA: b2JointType;
        m_typeB: b2JointType;
        m_bodyC: b2Body;
        m_bodyD: b2Body;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localAnchorC: b2Vec2;
        m_localAnchorD: b2Vec2;
        m_localAxisC: b2Vec2;
        m_localAxisD: b2Vec2;
        m_referenceAngleA: number;
        m_referenceAngleB: number;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_indexC: number;
        m_indexD: number;
        m_lcA: b2Vec2;
        m_lcB: b2Vec2;
        m_lcC: b2Vec2;
        m_lcD: b2Vec2;
        m_mA: number;
        m_mB: number;
        m_mC: number;
        m_mD: number;
        m_iA: number;
        m_iB: number;
        m_iC: number;
        m_iD: number;
        m_JvAC: b2Vec2;
        m_JvBD: b2Vec2;
        m_JwA: number;
        m_JwB: number;
        m_JwC: number;
        m_JwD: number;
        m_mass: number;
        m_qA: number;
        m_qB: number;
        m_qC: number;
        m_qD: number;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_lalcC: b2Vec2;
        m_lalcD: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetJoint1(): b2Joint;
        GetJoint2(): b2Joint;
        GetRatio(): number;
        SetRatio(): number;
        Dump(): void;
    }

    export class b2MotorJointDef extends b2JointDef {
        linearOffset: b2Vec2;
        angularOffset: number;
        maxForce: number;
        maxTorque: number;
        correctionFactor: number;
        Initialize(bA: b2Body, bB: b2Body): void;
    }
    export class b2MotorJoint extends b2Joint {
        constructor(def: b2MotorJointDef);

        m_linearOffset: b2Vec2;
        m_angularOffset: number;
        m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_correctionFactor: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_linearError: b2Vec2;
        m_angularError: number;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_linearMass: b2Mat22;
        m_angularMass: number;
        m_qA: number;
        m_qB: number;
        m_K: b2Mat22;

        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        SetCorrectionFactor(factor: number): void;
        GetCorrectionFactor(): number;
        SetLinearOffset(linearOffset: b2Vec2): void;
        GetLinearOffset(linearOffset: b2Vec2): b2Vec2;
        SetAngularOffset(angularOffset: number): void;
        GetAngularOffset(): number;
        SetMaxForce(foce: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        Dump(): void;
    }

    export class b2MouseJointDef extends b2JointDef {
        target: b2Vec2;
        maxForce: number;
        frequencyHz: number;
        dampingRatio: number;
    }
    export class b2MouseJoint extends b2Joint {
        constructor(def: b2MouseJointDef);
        m_localAnchorB: b2Vec2;
        m_targetA: b2Vec2;
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_beta: number;
        m_impulse: number;
        m_maxForce: number;
        m_gamma: number;
        m_indexA: number;
        m_indexB: number;
        m_rB: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassB: number;
        m_invIB: number;
        m_mass: number;
        m_C: b2Vec2;
        m_qB: b2Rot;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;

        SetTarget(target: b2Vec2): void;
        GetTarget(out: b2Vec2): b2Vec2;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        Dump(): void;
    }

    export class b2JointFactory {
        static Create(def: b2JointDef, allocator: any): b2Joint;
        static Destroy(def: b2JointDef, allocator: any): void;
    }

    export class b2PrismaticJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        localAxisA: b2Vec2;
        referenceAngle: number;
        enableLimit: boolean;
        lowerTranslation: number;
        upperTranslation: number;
        enableMotor: boolean;
        maxMotorForce: number;
        motorSpeed: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    }
    export class b2PrismaticJoint extends b2Joint {
        constructor(def: b2PrismaticJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localXAxisA: b2Vec2;
        m_localYAxisA: b2Vec2;
        m_referenceAngle: number;
        m_impulse: b2Vec3;
        m_motorImpulse: number;
        m_lowerTranslation: number;
        m_upperTranslation: number;
        m_maxMotorForce: number;
        m_motorSpeed: number;
        m_enableLimit: boolean;
        m_enableMotor: boolean;
        m_limitState: b2LimitState;
        m_indexA: number;
        m_indexB: number;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_axis: b2Vec2;
        m_perp: b2Vec2;
        m_s1: number;
        m_s2: number;
        m_a1: number;
        m_a2: number;
        m_K3: b2Mat33;
        m_K2: b2Mat22;
        m_motorMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        GetLocalAxisA(out: b2Vec2): b2Vec2;
        GetReferenceAngle(): number;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorForce(force: number): void;
        GetMaxMotorForce(): number;
        GetMotorForce(inv_dt: number): number;
        Dump(): void;
    }

    export var b2_minPulleyLength: number;
    export class b2PulleyJointDef extends b2JointDef {
        groundAnchorA: b2Vec2;
        groundAnchorB: b2Vec2;
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        lengthA: number;
        lengthB: number;
        ratio: number;
        Initialize(bA: b2Body, bB: b2Body, groundA: b2Vec2, groundB: b2Vec2, anchorA: b2Vec2, anchorB: b2Vec2, r: number): void;
    }
    export class b2PulleyJoint extends b2Joint {
        constructor(def: b2PulleyJointDef);
        m_groundAnchorA: b2Vec2;
        m_groundAnchorB: b2Vec2;
        m_lengthA: number;
        m_lengthB: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_uA: b2Vec2;
        m_uB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetGroundAnchorA(out: b2Vec2): b2Vec2;
        GetGroundAnchorB(out: b2Vec2): b2Vec2;
        GetLengthA(): number;
        GetLengthB(): number;
        GetRatio(): number;
        GetCurrentLengthA(): number;
        GetCurrentLengthB(): number;
        Dump(): void;
    }

    export class b2RevoluteJointDef extends b2JointDef {
        referenceAngle: number;
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        enableLimit: boolean;
        enableMotor: boolean;
        lowerAngle: number;
        upperAngle: number;
        motorSpeed: number;
        maxMotorTorque: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }
    export class b2RevoluteJoint extends b2Joint {
        constructor(def: b2RevoluteJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_impulse: number;
        m_motorImpulse: number;
        m_enableMotor: boolean;
        m_maxMotorTorque: number;
        m_motorSpeed: number;
        m_enableLimit: boolean;
        m_referenceAngle: number;
        m_lowerAngle: number;
        m_upperAngle: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: b2Mat33;
        m_motorMass: number;
        m_limitState: b2LimitState;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        GetReferenceAngle(): number;
        GetJointAngle(): number;
        GetJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: number): void;
        GetMotorTorque(inv_dt: number): number;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: number): void;
        GetMaxMotorTorque(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: number): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        SetMotorSpeed(speed: number): void;
        Dump(): void;
    }

    export class b2RopeJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxLength: number;
    }
    export class b2RopeJoint extends b2Joint {
        constructor(def: b2RopeJointDef);
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_maxLength: number;
        m_length: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_u: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_state: b2LimitState;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        SetMaxLength(length: number): void;
        GetMaxLength(): number;
        GetLimitState(): b2LimitState;
        Dump(): void;
    }

    export class b2WeldJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        referenceAngle: number;
        frequencyHz: number;
        dampingRatio: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }
    export class b2WeldJoint extends b2Joint {
        constructor(def: b2WeldJointDef);
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_bias: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_referenceAngle: number;
        m_gamma: number;
        m_impulse: b2Vec3;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: b2Mat33;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat33;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        GetLocalAnchorB(out: b2Vec2): b2Vec2;
        GetReferenceAngle(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(): void;
    }

    export class b2WheelJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        localAxisA: b2Vec2;
        enableMotor: boolean;
        maxMotorTorque: number;
        motorSpeed: number;
        frequencyHz: number;
        dampingRatio: number;
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    }
    export class b2WheelJoint extends b2Joint {
        constructor(def: b2WheelJointDef);

        m_frequencyHz: number;
        m_dampingRatio: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localXAxisA: b2Vec2;
        m_localYAxisA: b2Vec2;
        m_impulse: number;
        m_motorImpulse: number;
        m_springImpulse: number;
        m_maxMotorTorque: number;
        m_motorSpeed: number;
        m_enableMotor: boolean;
        m_indexA: number;
        m_indexB: number;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_ax: b2Vec2;
        m_ay: b2Vec2;
        m_sAx: number;
        m_sBx: number;
        m_sAy: number;
        m_sBy: number;
        m_mass: number;
        m_motorMass: number;
        m_springMass: number;
        m_bias: number;
        m_gamma: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;

        GetMotorSpeed(): number;
        GetMaxMotorTorque(): number;
        SetSpringFrequencyHz(hz: number): void;
        GetSpringFrequencyHz(): number;
        SetSpringDampingRatio(ratio: number): void;
        GetSpringDampingRatio(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetDefinition(def: b2WheelJointDef): b2WheelJointDef;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(out: b2Vec2): b2Vec2;
        GetLocalAnchorB(out: b2Vec2): b2Vec2;

        GetLocalAxisA(out: b2Vec2): b2Vec2;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: number): void;
        SetMotorSpeed(speed: number): void;
        SetMaxMotorTorque(force: number): void;
        GetMotorTorque(inv_dt: number): number;
        Dump(): void;
    }

    export class b2Filter {
        maskBits: number;
        groupIndex: number;
        categoryBits: number;
        Clone(): b2Filter;
        Copy(other: b2Filter): b2Filter;
    }

    export class b2FixtureDef {
        density: number;
        friction: number;
        restitution: number;
        shape: b2Shape;
        userData: any;
        filter: b2Filter;
        isSensor: boolean;
    }

    export class b2FixtureProxy {
        static MakeArray(length: number): b2FixtureProxy[];
        aabb: b2AABB;
        fixture: b2Fixture;
        childIndex: number;
        proxy: b2TreeNode;
    }

    export class b2Fixture {
        m_density: number;
        m_next: b2Fixture;
        m_body: b2Body;
        m_shape: b2Shape;
        m_friction: number;
        m_restitution: number;
        m_proxies: b2FixtureProxy[];
        m_proxyCount: number;
        m_filter: b2Filter;
        m_isSensor: boolean;
        m_userData: any;
        GetType(): number;
        GetShape(): any;
        IsSensor(): boolean;
        GetFilterData(): b2Filter;
        GetUserData(): any;
        SetUserData(data: any): void;
        GetBody(): b2Body;
        SetDensity(density: number): void;
        GetDensity(): number;
        SetFriction(friction: number): void;
        GetFriction(): number;
        SetRestitution(restitution: number): void;
        GetRestitution(): number;
        TestPoint(p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, childIndex: number): boolean;
        GetMassData(massData: b2MassData): b2MassData;
        GetAABB(childIndex: number): b2AABB;
        Create(body: b2Body, def: b2FixtureDef): void;
        Destroy(): void;
        CreateProxies(broadPhase: b2BroadPhase, xf: b2Transform): void;
        DestroyProxies(broadPhase: b2BroadPhase): void;
        Synchronize(broadPhase: b2BroadPhase, transform1: b2Transform, transform2: b2Transform): void;
        SetFilterData(filter: b2Filter): void;
        Refilter(): void;
        SetSensor(sensor: boolean): void;
        Dump(bodyIndex: number): void;
        GetNext(): b2Fixture;
    }

    export class b2ContactManager {
        m_broadPhase: b2BroadPhase;
        m_contactList: b2Contact;
        m_contactCount: number;
        m_contactFilter: b2ContactFilter;
        m_contactListener: b2ContactListener;
        m_allocator: any;
        m_contactFactory: b2ContactFactory;
        Destroy(c: b2Contact): void;
        Collide(): void;
        FindNewContacts(): void;
        AddPair(proxyUserDataA: b2FixtureProxy, proxyUserDataB: b2FixtureProxy);
    }

    export class b2Island {
        m_allocator: any;
        m_listener: b2ContactListener;
        m_bodies: b2Body;
        m_contacts: b2Contact[];
        m_positions: b2Position;
        m_joints: b2Joint[];
        m_velocities: b2Velocity[];
        m_bodyCount: number;
        m_jointCount: number;
        m_contactCount: number;
        m_bodyCapacity: number;
        m_contactCapacity: number;
        m_jointCapacity: number;
        Initialize(bodyCapacity: number, contactCapacity: number, jointCapacity: number, allocator: any, listener: b2ContactListener): void;
        Clear(): void;
        AddBody(body: b2Body): void;
        AddJoint(joint: b2Joint): void;
        Solve(profile: b2Profile, step: b2TimeStep, gravity: b2Vec2, allowSleep: boolean);
        SolveTOI(subStep: b2TimeStep, toiIndexA: number, toiIndexB: number);
        Report(constraints: b2ContactVelocityConstraint[]): void;
    }

    export class b2WorldFlag {
        e_none: number;
        e_newFixture: number;
        e_locked: number;
        e_clearForces: number;
    }

    export class b2Controller {

    }

    export class b2World {
        constructor(gravity: b2Vec2);
        m_flags: number;
        m_contactManager: b2ContactManager;
        m_bodyList: b2Body;
        m_jointList: b2Joint;
        m_bodyCount: number;
        m_jointCount: number;
        m_gravity: b2Vec2;
        m_out_gravity: b2Vec2;
        m_allowSleep: boolean;
        m_destructionListener: b2DestructionListener;
        m_debugDraw: b2Draw;
        m_inv_dt0: number;
        m_warmStarting: boolean;
        m_continuousPhysics: boolean;
        m_subStepping: boolean;
        m_stepComplete: boolean;
        m_profile: b2Profile;
        m_island: b2Island;
        s_stack: b2Body[];
        //FIX m_controllerList: b2Controller;
        m_controllerCount: number;
        SetAllowSleeping(flag: boolean): void;
        GetAllowSleeping(): boolean;
        SetWarmStarting(flag: boolean): void;
        GetWarmStarting(): boolean;
        SetContinuousPhysics(flag: boolean): void;
        GetContinuousPhysics(): boolean;
        SetSubStepping(flag: boolean): void;
        GetSubStepping(): boolean;
        GetBodyList(): b2Body;
        GetJointList(): b2Joint;
        GetContactList(): b2Contact;
        GetBodyCount(): number;
        GetContactCount(): number;
        SetGravity(gravity: b2Vec2, wake: boolean): void;
        GetGravity(out: b2Vec2): b2Vec2;
        IsLocked(): boolean;
        SetAutoClearForces(flag: boolean): void;
        GetAutoClearForces(): boolean;
        GetContactManager(): b2ContactManager;
        GetProfile(): b2Profile;
        SetDestructionListener(listener: b2DestructionListener): void;
        SetContactFilter(filter: b2ContactFilter): void;
        SetContactListener(listener: any): void;
        SetDebugDraw(debugDraw: b2Draw): void;
        CreateBody(def: b2BodyDef): b2Body;
        DestroyBody(b: b2Body): void;
        CreateJoint(def: b2JointDef): b2Joint;
        DestroyJoint(j: b2Joint): void;
        Solve(step: b2TimeStep): void;
        SolveTOI(step: b2TimeStep): void;
        Step(dt: number, velocityIterations: number, positionIterations: number): void;
        ClearForces(): void;
        QueryAABB(callback: any, aabb: b2AABB): void;
        QueryShape(callback: any, shape: b2Shape, transform: b2Transform): void;
        QueryPoint(callback: any, point: b2Vec2): void;
        RayCast(callback: any, point1: b2Vec2, point2: b2Vec2): void;
        RayCastOne(point1: b2Vec2, point2: b2Vec2): b2Fixture;
        RayCastAll(point1: b2Vec2, point2: b2Vec2, out: b2Fixture[]): b2Fixture;
        DrawShape(fixture: b2Fixture, b2color: b2Color): void;
        DrawJoint(joint: b2Joint): void;
        DrawDebugData(): void;
        SetBroadPhase(broadPhase: b2BroadPhase): void;
        GetProxyCount(): number;
        GetTreeHeight(): number;
        GetTreeBalance(): number;
        GetTreeQuality(): number;
        ShiftOrigin(newOrigin: b2Vec2): void;
        Dump(): void;
        AddController(controller: b2Controller): b2Controller;
        RemoveController(controller: b2Controller): void;
    }

    export class b2RopeDef {
        vertices: any[];
        count: number;
        masses: any[];
        gravity: b2Vec2;
        damping: number;
        k2: number;
        k3: number;
    }
    export class b2Rope {
        m_count: number;
        m_damping: number;
        GetVertexCount(): number;
        GetVertices(): b2Vec2[];
        Initialize(def: b2RopeDef): void;
        Step(iterations: number);
        SolveC2(): void;
        SetAngleRadians(angle: number): void;
        SolveC3(): void;
        Draw(draw: b2Draw): void;
    }


}

declare var DebugDraw: any;
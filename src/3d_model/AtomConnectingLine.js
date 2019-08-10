import * as THREE from "three";


function CustomSinCurve( objCoordinates ) {

    THREE.Curve.call( this );

    this.scale = 1;
    this.x1 = objCoordinates.x1;
    this.x2 = objCoordinates.x2;
    this.y1 = objCoordinates.y1;
    this.y2 = objCoordinates.y2;
    this.z1 = objCoordinates.z1;
    this.z2 = objCoordinates.z2;

}

CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function ( t ) {
    var tx = this.x1*t + this.x2 ;
    var ty = this.y1*t + this.y2;
    var tz = this.z1*t + this.z2;

    return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

};

export function createAtomConnectingLine(pointA, pointB) {
    let l = pointB[0] - pointA[0];
    let m = pointB[1] - pointA[1];
    let n = pointB[2] - pointA[2];

    var pathLine = new CustomSinCurve(
        {x1: l, x2:pointA[0],
        y1: m, y2: pointA[1],
        z1: n, z2: pointA[2]});
    var geometryLine = new THREE.TubeGeometry( pathLine, 20, 0.03, 8, false );
    var materialLine = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var mesh = new THREE.Mesh( geometryLine, materialLine );
    return mesh;
}

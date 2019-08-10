import * as THREE from "three";

export function getColorFromLetters(letters) {
    switch(letters) {
        case "H":
            return 0x5cabff;
        case "Cl":
            return 0x00ff00;
        case "Br":
            return 0xFF5E00;
        case "F":
            return 0x90E81E;
        case "Au":
            return 0xffd700;
        case "Cu":
            return 0xb87333;
        case "C":
            return 0x46265e;
        case "Na":
            return 0xdbdbdb;
        case "O":
            return 0xedf8ff;
        case "N":
            return 0xffffff;
        case "Li":
            return 0x77746b;
        case "Be":
            return 0x8c867a;
        case "Si":
            return 0x475766;
        case "Ti":
            return 0x7f7b72;
        case "P":
            return 0x813c40;
        default:
            return 0x000000;
    }
}

export function createSphereWithText(textString, coordinates, color, glass) {
    var canvasElement = document.createElement("canvas");
    canvasElement.height = 400;
    canvasElement.width = 400;
    canvasElement.style.height = 300*1.25+"px";
    canvasElement.style.width = 300*1.25+"px";
    var context = canvasElement.getContext("2d");
    context.font = "80pt FranklinGothicDemiC";
    context.fillStyle = 'white';
    context.fillText(textString, 170, 240);

    var texture = new THREE.Texture(canvasElement);
    var textMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: true});
    var textMesh = new THREE.Mesh(new THREE.CubeGeometry(1,1,1),textMaterial);
    texture.needsUpdate = true;
    textMesh.position.set(coordinates.x,coordinates.y,coordinates.z);

    var geometrySphere = new THREE.SphereGeometry(0.5,40,40, 0, Math.PI * 2, 0, Math.PI * 2);
    var materialSphere;
    if(!glass)
        materialSphere = new THREE.MeshLambertMaterial({color: color});
    else 
    {
        var loader = new THREE.TextureLoader();
        loader.load("images/abstract-art-background-1040473.jpg", function ( texture ) {
            materialSphere = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                envMap: texture,
                refractionRatio:.6,
            });                                                                  
        });
    }
    var sphere1 = new THREE.Mesh(geometrySphere, materialSphere);
    sphere1.material.needsUpdate = true;
    sphere1.position.set(coordinates.x, coordinates.y, coordinates.z);
    return {
        sphere: sphere1,
        text: textMesh 
    }
}
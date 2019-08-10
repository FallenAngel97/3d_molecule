import React, { Component } from 'react';
import * as THREE from 'three';
import { createSphereWithText, getColorFromLetters } from '../3d_model/SphereWithText';
import { createAtomConnectingLine } from '../3d_model/AtomConnectingLine';

class ThreeScene extends Component{
    constructor(props) {
        super(props);
        this.compoundSpheres = [];
        this.INTERSECTED = null;
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.renderScene = this.renderScene.bind(this);
    }
    onDocumentMouseMove( event ) {
        event.preventDefault();
        this.mouse.x = ( ( event.clientX - this.renderer.domElement.offsetLeft ) / this.renderer.domElement.clientWidth ) * 2 - 1;;
        this.mouse.y = - ( ( event.clientY - this.renderer.domElement.offsetTop ) / this.renderer.domElement.clientHeight ) * 2 + 1;
    }
    componentDidMount(){
        const width = this.threeRootElement.clientWidth
        const height = this.threeRootElement.clientHeight

        //ADD SCENE
        this.scene = new THREE.Scene()
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );

        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            90,
            width / height,
            1,
            1000
        )
        this.camera.position.z = this.props.cameraZoom || 4

        this.connectingLines = [];
        this.mainElement = 0; 

        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ alpha:true, antialias: true })
        this.renderer.setSize(width, height)
        this.threeRootElement.appendChild(this.renderer.domElement)

        // Shadows
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.x = -50;
        light.position.y = 50;
        this.scene.add(light);
        this.scene.add( new THREE.AmbientLight( 0x212223) );

        this.group = new THREE.Group();

        this.scene.add(this.group);

        this.scene.updateMatrixWorld(true);
        
        if(this.props.formula.length>0) {
            let chemicalElements = this.props.formula.split(/(?=[A-Z])/);
            this.compoundSpheres.map((element) => {
                this.scene.remove(element.text);
                this.scene.remove(element.sphere);
                this.group.remove(element.sphere);
                this.group.remove(element.text);
            });
            this.connectingLines.map((line) => {
                this.scene.remove(line);
                this.group.remove(line);
            });
            let indices = [];
            if(chemicalElements.length==1 && chemicalElements[0].length==0)
                return;
            switch(chemicalElements.length) {
                case 1:
                    indices = [{x:0,y:0,z:0}];
                    break;
                case 2:
                    indices = [{x:0.5, y:0.5, z: 0.5}, {x:-0.5, y:-0.5, z:-0.5}];
                    break;
                case 3:
                    indices = [{x:0, y:1.5, z:0},
                        {x:1.5*Math.cos(Math.PI/6), y: 1.5*Math.sin(Math.PI/6), z:0},
                        {x:1.5*-Math.cos(Math.PI/6), y: 1.5*Math.sin(Math.PI/6), z: 0}];
                    break;
                case 4:
                    indices = [{x:0,y:0,z:0},
                        {x:0,y:1.5,z:0}, 
                        {x:-1.5*Math.cos(Math.PI/6), y:-1.5/2, z:0}, 
                        {x:1.5*Math.cos(Math.PI/6),y:-1.5/2, z:0}]
                    break;
                case 5:
                /*
                        *3
    
                        *0 
                    *4     *5
                        *2
                */
                    let bottomCoordinate = 1-(Math.sqrt(20.48/(3*Math.sqrt(6))));
                    indices = [
                        {x:0,y:0,z:0},
                        {x:0,y:bottomCoordinate, z:0.8*Math.cos(Math.PI/6)},
                        {x:0,y:1,z:0},
                        {x:-1.6/Math.sqrt(6), y:bottomCoordinate, z: -1.6*Math.sin(Math.PI/3)/Math.sqrt(6)},
                        {x:1.6/Math.sqrt(6), y:bottomCoordinate, z: -1.6*Math.sin(Math.PI/3)/Math.sqrt(6)}
                    ]
                    break;
                default:
                    indices = [];
            }
            if(indices.length == 0) return;
            this.compoundSpheres = [];
            this.connectingLines=[];
            chemicalElements.map((element, index) => {
                let x = indices[index].x;
                let y = indices[index].y;
                let z = indices[index].z;
    
                var compSphere = createSphereWithText(element, {x:x, y:y, z:z}, getColorFromLetters(element));
                this.compoundSpheres.push(compSphere);
                this.group.add(compSphere.text);
                this.group.add(compSphere.sphere);
                if(index==0)
                    this.mainElement = compSphere;
            });
            for(let i=0;i<this.compoundSpheres.length;i++) {
                if(this.compoundSpheres[i] == this.mainElement)
                    continue;
    
                let x1 = indices[i].x;
                let y1 = indices[i].y;
                let z1 = indices[i].z;
    
                var connectingLine = createAtomConnectingLine([x1,y1,z1], [this.mainElement.sphere.position.x,this.mainElement.sphere.position.y, this.mainElement.sphere.position.z]);
                this.connectingLines.push(connectingLine);
                this.group.add(connectingLine);
            }
        }

        this.start();

    }

    componentWillReceiveProps(nextProps) {
        let chemicalElements = nextProps.formula.split(/(?=[A-Z])/);
        this.compoundSpheres.map((element) => {
            this.scene.remove(element.text);
            this.scene.remove(element.sphere);
            this.group.remove(element.sphere);
            this.group.remove(element.text);
        });
        this.connectingLines.map((line) => {
            this.scene.remove(line);
            this.group.remove(line);
        });
        let indices = [];
        if(chemicalElements.length==1 && chemicalElements[0].length==0)
            return;
        switch(chemicalElements.length) {
            case 1:
                indices = [{x:0,y:0,z:0}];
                break;
            case 2:
                indices = [{x:0.5, y:0.5, z: 0.5}, {x:-0.5, y:-0.5, z:-0.5}];
                break;
            case 3:
                indices = [{x:0, y:1.5, z:0},
                    {x:1.5*Math.cos(Math.PI/6), y: 1.5*Math.sin(Math.PI/6), z:0},
                    {x:1.5*-Math.cos(Math.PI/6), y: 1.5*Math.sin(Math.PI/6), z: 0}];
                break;
            case 4:
                indices = [{x:0,y:0,z:0},
                    {x:0,y:1.5,z:0}, 
                    {x:-1.5*Math.cos(Math.PI/6), y:-1.5/2, z:0}, 
                    {x:1.5*Math.cos(Math.PI/6),y:-1.5/2, z:0}]
                break;
            case 5:
            /*
                    *3

                    *0 
                *4     *5
                    *2
            */
                let bottomCoordinate = 1-(Math.sqrt(20.48/(3*Math.sqrt(6))));
                indices = [
                    {x:0,y:0,z:0},
                    {x:0,y:bottomCoordinate, z:0.8*Math.cos(Math.PI/6)},
                    {x:0,y:1,z:0},
                    {x:-1.6/Math.sqrt(6), y:bottomCoordinate, z: -1.6*Math.sin(Math.PI/3)/Math.sqrt(6)},
                    {x:1.6/Math.sqrt(6), y:bottomCoordinate, z: -1.6*Math.sin(Math.PI/3)/Math.sqrt(6)}
                ]
                break;
            default:
                indices = [];
        }
        if(indices.length == 0) return;
        this.compoundSpheres = [];
        this.connectingLines=[];
        chemicalElements.map((element, index) => {
            let x = indices[index].x;
            let y = indices[index].y;
            let z = indices[index].z;

            var compSphere = createSphereWithText(element, {x:x, y:y, z:z}, getColorFromLetters(element));
            this.compoundSpheres.push(compSphere);
            this.group.add(compSphere.text);
            this.group.add(compSphere.sphere);
            if(index==0)
                this.mainElement = compSphere;
        });
        
        for(let i=0;i<this.compoundSpheres.length;i++) {
            if(this.compoundSpheres[i] == this.mainElement)
                continue;

            let x1 = indices[i].x;
            let y1 = indices[i].y;
            let z1 = indices[i].z;

            var connectingLine = createAtomConnectingLine([x1,y1,z1], [this.mainElement.sphere.position.x,this.mainElement.sphere.position.y, this.mainElement.sphere.position.z]);
            this.connectingLines.push(connectingLine);
            this.group.add(connectingLine);
        }
    }

    componentWillUnmount(){
        this.stop()
        this.compoundSpheres = [];
        this.threeRootElement.removeChild(this.renderer.domElement)
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
        this.group.rotation.x += 0.01;
        this.group.rotation.y += 0.01;

        this.compoundSpheres.map((element) => {
            element.text.lookAt(this.camera.position);
        });
        // this.raycaster.setFromCamera( this.mouse, this.camera );
        // let objs = [];
        // this.compoundSpheres.map((element)=> {
        //     objs.push(element.sphere);
        // });
        // var intersects = this.raycaster.intersectObjects( objs );
        // if ( intersects.length > 0 ) {
        //     if ( this.INTERSECTED != intersects[ 0 ].object ) {
        //         if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
        //         this.INTERSECTED = intersects[ 0 ].object;
        //         this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
        //         this.INTERSECTED.material.emissive.setHex( 0xff0000 );
        //     }
        // } else {
        //     if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
        //     this.INTERSECTED = null;
        // }
        this.renderer.render(this.scene, this.camera);
    }

    render(){
        let size = this.props.size || '400'
        return(
            <div
                style={{ position:'static', display:'inline-block', width: size+'px', height: size+'px', verticalAlign: 'middle' }}
                ref={(mount) => { this.threeRootElement = mount }}
            />
        )
    }
}

export default ThreeScene
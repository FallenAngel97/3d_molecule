import React from "react";
import * as THREE from "three";
import "./ResultScene.scss";
import { createSphereWithText, getColorFromLetters } from '../3d_model/SphereWithText';
import { createAtomConnectingLine } from '../3d_model/AtomConnectingLine';

export default class ResultScene extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            formula: '',
            nameOfReaction: ''
        }
        this.compoundSpheres = [];
        this.connectingLines = [];
        this.addToResult = this.addToResult.bind(this);
        this.reactionNameChanged = this.reactionNameChanged.bind(this);
    }

    getNeededFormula(elements) {
        let combined = elements.join('').split(/(?=[A-Z])/).sort();
        var moleculesArray = [];
        var current = null;
        var cnt = 0;
        for (var i = 0; i < combined.length; i++) {
            if (combined[i] != current) {
                if (cnt > 0) {
                    moleculesArray.push({molecule:current, count: cnt});
                }
                current = combined[i];
                cnt = 1;
            } else {
                cnt++;
            }
        }
        if (cnt > 0) {
            moleculesArray.push({molecule:current, count: cnt});
        }
        return moleculesArray;
    }

    reactionNameChanged(event) {
        this.setState({nameOfReaction: event.target.value});
    }

    addToResult(e) {
        this.setState({formula:this.state.formula+e.target.innerHTML});
    }

    componentDidMount(){
        const width = this.threeRootElement.clientWidth
        const height = this.threeRootElement.clientHeight

        //ADD SCENE
        this.scene = new THREE.Scene()
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
        this.camera = new THREE.PerspectiveCamera(
            90,
            width / height,
            1,
            1000
        )
        
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
        this.camera.position.z = 4
        this.start();
    }
    componentWillUnmount(){
        this.stop()
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

    componentDidUpdate(prevProp) {
        if(this.state.formula.length>0) {
            let chemicalElements = this.state.formula.split(/(?=[A-Z])/);
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
    }

    renderScene() {
        this.group.rotation.x += 0.01;
        this.group.rotation.y += 0.01;
        this.compoundSpheres.map((element) => {
            element.text.lookAt(this.camera.position);
        });
        this.renderer.render(this.scene, this.camera);
    }
    render() {
        return(
            <>
                <div style={{ marginTop:'10px' }}>
                {this.getNeededFormula(this.props.molecules).map((element)=>
                    {
                        return <div key={element.molecule} className='resultSphereHolder'>
                            <div onClick={this.addToResult} className={"singleSphereResult "+element.molecule+"_letter"} >{element.molecule}</div>
                        </div>
                    })}
                </div>
                <input type='text' value={this.state.nameOfReaction} onChange={this.reactionNameChanged} id='name_of_reaction' placeholder="Имя реакции" />
                <div style={{ position:'static', width: '1000px', height: '400px' }}
                ref={(mount) => { this.threeRootElement = mount }} />
            </>
        )
    }
}
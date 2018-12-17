import soundFile from '../assets/sound/AESTHETICS PLEASE - Run From Love.mp3';
import Sound from './Sound.js';
let OrbitControls = require('three-orbit-controls')(THREE)
import objFile from '../assets/model/SabineCut.obj';
let Stats = require('stats-js')

import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/shaders/CopyShader'

import 'three/examples/js/shaders/DotScreenShader'
import 'three/examples/js/shaders/LuminosityHighPassShader';
import 'three/examples/js/postprocessing/UnrealBloomPass';

import TimeLineMax from "gsap/TimeLineMax";

import * as dat from 'dat.gui';
import { TimelineMax } from 'gsap';

var renderer;

// TODO : add Dat.GUI
// TODO : add Stats

class LoadSound {
    constructor() {
        this.sound = new Sound(soundFile,125,0,this.startSound.bind(this),false)
    }
    startSound() {
        this.sound.play();
    }
}

export default class App {

    constructor() {

        //Stats
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = '0px';
        document.body.appendChild( this.stats.domElement );

        // Sound
        this.play = new LoadSound();

        //GSAP
        this.tl = new TimelineMax({
            delay:0.5,
            repeat:3,
            repeatDelay:2,
            // onUpdate:updateStats,
            // onRepeat:updateReps,
            // onComplete:restart
        });
        //modelObj.children[2].position

        //THREE SCENE
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );

        this.camera.position.z = 20;
        this.controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();

        //this.model = new LoaderObj();
        var loader = new THREE.OBJLoader();
        loader.load(objFile,
            ( modelObj )=> {
                modelObj.traverse( function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshPhongMaterial({color: 0xfafbfc});
                        child.castShadow = true; //default is false
                        child.receiveShadow = true; //default is false
                    }
                })
                modelObj.scale.set(0.1,0.1,0.1)
                modelObj.position.y = 0.5;
                this.scene.add( modelObj );
                console.log(modelObj)

                //Gui
                let gui = new dat.GUI();
                let grpElem = gui.addFolder('Group');
                    let grpPos = grpElem.addFolder('Group Position');
                        grpPos.add(modelObj.position, 'x', -10, 10).listen();
                        grpPos.add(modelObj.position, 'y', -10, 10).listen();
                        grpPos.add(modelObj.position, 'z', -10, 10).listen();
                    let grpScale = grpElem.addFolder('Group Scale');
                        grpScale.add(modelObj.scale, 'x', 0, 1).listen();
                        grpScale.add(modelObj.scale, 'y', 0, 1).listen();
                        grpScale.add(modelObj.scale, 'z', 0, 1).listen();
                let hairElem = gui.addFolder('Hair');
                    let hairPos = hairElem.addFolder('Hair position');
                        hairPos.add(modelObj.children[2].position, 'x', -100, 100).listen();
                        hairPos.add(modelObj.children[2].position, 'y', -100, 100).listen();
                        hairPos.add(modelObj.children[2].position, 'z', -100, 100).listen();
                    let hairRotate = hairElem.addFolder('Hair Rotation');
                        hairRotate.add(modelObj.children[2].rotation, 'x', 0, Math.PI*2).listen();
                        hairRotate.add(modelObj.children[2].rotation, 'y', 0, Math.PI*2).listen();
                        hairRotate.add(modelObj.children[2].rotation, 'z', 0, Math.PI*2).listen();
                let headElem = gui.addFolder('Head');
                    let headPos = headElem.addFolder('Head position');
                        headPos.add(modelObj.children[3].position, 'x', -100, 100).listen();
                        headPos.add(modelObj.children[3].position, 'y', -100, 100).listen();
                        headPos.add(modelObj.children[3].position, 'z', -100, 100).listen();
                    let headRotate = headElem.addFolder('Head Rotation');
                        headRotate.add(modelObj.children[3].rotation, 'x', 0, 10).listen();
                        headRotate.add(modelObj.children[3].rotation, 'y', 0, 10).listen();
                        headRotate.add(modelObj.children[3].rotation, 'z', 0, 10).listen();
                let chestElem = gui.addFolder('Chest');
                    let chestPos = chestElem.addFolder('Chest position');
                        chestPos.add(modelObj.children[0].position, 'x', -100, 100).listen();
                        chestPos.add(modelObj.children[0].position, 'y', -100, 100).listen();
                        chestPos.add(modelObj.children[0].position, 'z', -100, 100).listen();
                    let chestRotate = chestElem.addFolder('Chest Rotation');
                        chestRotate.add(modelObj.children[0].rotation, 'x', 0, 10).listen();
                        chestRotate.add(modelObj.children[0].rotation, 'y', 0, 10).listen();
                        chestRotate.add(modelObj.children[0].rotation, 'z', 0, 10).listen();
                let hipElem = gui.addFolder('Hip');
                    let hipPos = hipElem.addFolder('Hip position');
                        hipPos.add(modelObj.children[4].position, 'x', -100, 100).listen();
                        hipPos.add(modelObj.children[4].position, 'y', -100, 100).listen();
                        hipPos.add(modelObj.children[4].position, 'z', -100, 100).listen();
                    let hipRotate = hipElem.addFolder('Hip Rotation');
                        hipRotate.add(modelObj.children[4].rotation, 'x', 0, 10).listen();
                        hipRotate.add(modelObj.children[4].rotation, 'y', 0 , 10).listen();
                        hipRotate.add(modelObj.children[4].rotation, 'z', 0, 10).listen();
                let legElem = gui.addFolder('Leg');
                    let legPos = legElem.addFolder('Leg position');
                        legPos.add(modelObj.children[5].position, 'x', -100, 100).listen();
                        legPos.add(modelObj.children[5].position, 'y', -100, 100).listen();
                        legPos.add(modelObj.children[5].position, 'z', -100, 100).listen();
                    let legRotate = legElem.addFolder('Leg Rotation');
                        legRotate.add(modelObj.children[5].rotation, 'x', 0, 10).listen();
                        legRotate.add(modelObj.children[5].rotation, 'y', 0, 10).listen();
                        legRotate.add(modelObj.children[5].rotation, 'z', 0, 10).listen();
                let footElem = gui.addFolder('Foot');
                    let footPos = footElem.addFolder('Foot position');
                        footPos.add(modelObj.children[1].position, 'x', -100, 100).listen();
                        footPos.add(modelObj.children[1].position, 'y', -100, 100).listen();
                        footPos.add(modelObj.children[1].position, 'z', -100, 100).listen();
                    let footRotate = footElem.addFolder('Foot Rotation');
                        footRotate.add(modelObj.children[1].rotation, 'x', 0, 10).listen();
                        footRotate.add(modelObj.children[1].rotation, 'y', 0, 10).listen();
                        footRotate.add(modelObj.children[1].rotation, 'z', 0, 10).listen();
            },
            (xhr) => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            (error) => {
                console.log( 'An error happened' );
            }
        );
        //LIGHT
        //Hemisphere
        this.hemiLight = new THREE.HemisphereLight( 0xaaa59f, 0x555565, 1 );
        this.scene.add( this.hemiLight );
        //Directional
        this.dirLight = new THREE.DirectionalLight( 0x707077, 1 )
        this.dirLight.castShadow = true
        this.dirLight.shadowMapWidth = 2048; // default is 512
        this.dirLight.shadowMapHeight = 2048; // default is 512
        this.dirLight.shadow.camera.near = 0.01;       // default 0.5
        this.dirLight.shadow.camera.far = 500;      // default 500
        this.dirLight.shadow.camera.top = -18;     
        this.dirLight.shadow.camera.bottom = 18;      
        this.dirLight.shadow.camera.left = -18; 
        this.dirLight.shadow.camera.right = 18;
        this.scene.add(this.dirLight)

        this.dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
        this.scene.add( this.dirLightHelper );



        //BACKGROUND
        let bgSize = 50;
        let backgroundGeo = new THREE.BoxGeometry( bgSize, bgSize, bgSize );
        let backgroundMat = new THREE.MeshPhongMaterial( { color: 0xfcfbfa, side: THREE.BackSide, shadowSide: THREE.BackSide } );
        this.backgroundMesh = new THREE.Mesh( backgroundGeo, backgroundMat );
        this.backgroundMesh.receiveShadow = true; //default is false
        this.backgroundMesh.position.y = bgSize*0.5;
        // this.scene.add( this.backgroundMesh );

        let groundGeo = new THREE.CircleGeometry( bgSize*10, 128 );
        let groundMat = new THREE.MeshPhongMaterial( { color: 0xfcfbfa, side: THREE.BackSide, shadowSide: THREE.BackSide } );
        this.groundMesh = new THREE.Mesh( groundGeo, groundMat );
        this.groundMesh.receiveShadow = true; //default is false
        this.groundMesh.rotation.x = Math.PI*0.5;
        this.scene.add( this.groundMesh );


        //RENDERER
    	this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
        this.renderer.setClearColor( '#eee' )
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this));

    }
    //UPDATE
    render(bloomPass) {
        this.stats.begin();
        let time = Date.now()/1000;

        this.dirLight.position.x = Math.sin(time)*6
        this.dirLight.position.y = 15
        this.dirLight.position.z = Math.cos(time)*6

        //RENDER
    	this.renderer.render( this.scene, this.camera ); //Default

        this.stats.end();
    }

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
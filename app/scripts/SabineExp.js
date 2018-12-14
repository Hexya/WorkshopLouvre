import soundFile from '../assets/sound/AESTHETICS PLEASE - Run From Love.mp3';
import Sound from './Sound.js';
//import LoaderObj from './LoaderObj.js';
let OrbitControls = require('three-orbit-controls')(THREE)
import objFile from '../assets/model/Marie.obj';
let Stats = require('stats-js')

import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/shaders/CopyShader'

import 'three/examples/js/shaders/DotScreenShader'
import 'three/examples/js/shaders/LuminosityHighPassShader';
import 'three/examples/js/postprocessing/UnrealBloomPass';

import * as dat from 'dat.gui';

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

        //Gui
        const gui = new dat.GUI();

        // Sound
        this.play = new LoadSound();

        //THREE SCENE
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );


        this.camera.position.z = 50;
        this.controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();

        //this.model = new LoaderObj();
        var loader = new THREE.OBJLoader();
        loader.load(objFile,
            ( modelObj )=> {
                modelObj.traverse( function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshLambertMaterial({color: 0xfafbfc});
                        child.castShadow = true; //default is false
                    }
                })
                modelObj.scale.set(0.01,0.01,0.01)
                modelObj.position.y = +0.5;
                this.scene.add( modelObj );
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
        this.hemiLight = new THREE.HemisphereLight( 0xffff00, 0x0000ff, 1 );
        this.scene.add( this.hemiLight );


        this.ambientLight = new THREE.AmbientLight( 0x0f0f0f, 1 );
        // this.scene.add( this.ambientLight );
        //Directional
        this.dirLight = new THREE.DirectionalLight( 0x0000ff, 0.5 )
        this.dirLight.castShadow = true
        this.dirLight.shadowMapWidth = 1024; // default is 512
        this.dirLight.shadowMapHeight = 1024; // default is 512  
        this.dirLight.position.x = -1
        this.dirLight.position.y = 8
        this.dirLight.position.z = 6
        this.scene.add(this.dirLight)

        this.dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
        this.scene.add( this.dirLightHelper );



        //BACKGROUND
        let bgSize = 50;
        let backgroundGeo = new THREE.BoxGeometry( bgSize, bgSize, bgSize );
        let backgroundMat = new THREE.MeshLambertMaterial( { color: 0xfcfbfa, side: THREE.DoubleSide, shadowSide: THREE.DoubleSide } );
        this.backgroundMesh = new THREE.Mesh( backgroundGeo, backgroundMat );
        this.backgroundMesh.receiveShadow = true; //default is false
        this.backgroundMesh.position.y = -bgSize*0.5;
        this.scene.add( this.backgroundMesh );


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

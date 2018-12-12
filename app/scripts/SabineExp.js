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

        this.play = new LoadSound();


        //THREE SCENE
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.001, 10 );

        this.camera.position.x = 0.3;
        this.camera.position.y = 0.3;
        this.camera.position.z = Math.pow(1.7, -17);

        this.controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();

        //this.model = new LoaderObj();
        var loader = new THREE.OBJLoader();
        loader.load(objFile,
            ( modelObj )=> {
                //modelObj.scale.set(0.0001,0.0001,0.0001)
                modelObj.scale.set(0.0005,0.0005,0.0005)
                var lambert = new THREE.MeshLambertMaterial({color: 0xffffff});
                this.scene.add( modelObj );
                modelObj.position.y = -0.1;
                modelObj.material = lambert;
                console.log(modelObj)
                //modelObj.material = new THREE.MeshNormalMaterial()
                //modelObj.material.shading = THREE.SmoothShading;
            },
            (xhr) => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            (error) => {
                console.log( 'An error happened' );
            }
        );


        //LIGHT
            //Directional
            this.light = new THREE.DirectionalLight({color: 0x0000ff,intensity : 1})
            this.light.position.x = -0.5
            this.light.position.y = 0.8
            this.scene.add(this.light)

        //TORUS
        let geoTorus = new THREE.TorusGeometry( 0.09, 0.002, 30,80 );
        let matTorus = new THREE.MeshNormalMaterial();
        this.torus = new THREE.Mesh( geoTorus, matTorus );
        this.scene.add(this.torus)

        let geoTorusM = new THREE.TorusGeometry( 0.095, 0.003, 30,80 );
        let matTorusM = new THREE.MeshNormalMaterial();
        this.torusM = new THREE.Mesh( geoTorusM, matTorusM );
        this.scene.add(this.torusM)

        let geoTorusS = new THREE.TorusGeometry( 0.1, 0.004, 30,80 );
        let matTorusS = new THREE.MeshNormalMaterial();
        this.torusS = new THREE.Mesh( geoTorusS, matTorusS );
        this.scene.add(this.torusS)


        //RENDERER
    	this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
        this.renderer.setClearColor( '#eee' )
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

            //ROTATE TORUS

            this.torus.rotation.x += 0.01;
            this.torus.rotation.y += 0.03;
            this.torus.rotation.z += 0.02;

            this.torusS.rotation.x += 0.03;
            this.torusS.rotation.y += 0.02;
            this.torusS.rotation.z += 0.01;

            this.torusM.rotation.x += 0.02;
            this.torusM.rotation.y -= 0.02;
            this.torusM.rotation.z += 0.03;

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

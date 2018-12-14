import soundFile from '../assets/sound/AESTHETICS PLEASE - Run From Love.mp3';
import Sound from './Sound.js';
let OrbitControls = require('three-orbit-controls')(THREE)
import objFile from '../assets/model/model.obj';
import mtlFile from '../assets/model/materials.mtl';
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

        this.camera.position.z = .5;
        this.camera.position.y = .5;

        this.controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();

        //LOADER
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load(mtlFile, materials => {
            materials.preload();
            console.log(materials)
            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials )
            loader.load(objFile,
                ( modelObj )=> {
                    /* modelObj.traverse( function ( child ) {
                        if ( child instanceof THREE.Mesh ) {
                            child.material = new THREE.MeshLambertMaterial({normalMap: materials});
                            child.castShadow = true; //Light
                        }
                    } ); */
                    //modelObj.scale.set(0.0001,0.0001,0.0001)
                    // modelObj.scale.set(0.005,0.005,0.005)
                    this.scene.add( modelObj );
                    console.log(modelObj)
                },
                (xhr) => {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },
                (error) => {
                    console.log( 'An error happened' );
                }
            );

        });

        /*var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( '../app/assets/model/rose.mtl',( materials ) =>{
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.load(objFile, ( object ) => {
                object.traverse( function ( child ) {
                    if ( child instanceof THREE.Mesh ) {
                        child.material = new THREE.MeshLambertMaterial({normalMap: materials});
                        child.castShadow = true; //Light
                    }
                } );
                object.scale.set(0.005,0.005,0.005)
                this.scene.add(object);
            });
        });*/


        //LIGHT
        //Directional
        this.light = new THREE.DirectionalLight({color: 0x0000ff,intensity : 1})
        this.light.position.x = -0.5
        this.light.position.y = 0.8
        this.light.castShadow = true; //Light
        this.scene.add(this.light)

        //PLANE

        let geometry = new THREE.PlaneBufferGeometry( 3, 3, 3 );
        let material = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
        let plane = new THREE.Mesh( geometry, material );
        plane.receiveShadow = true;
        this.scene.add( plane );
        plane.rotation.x = 1.6;

        //RENDERER
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
        this.renderer.setClearColor( '#eee' )
        this.renderer.shadowMap.enabled = true; //Light
        this.renderer.shadowMap.type = THREE.PCFShadowMap; //Light
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

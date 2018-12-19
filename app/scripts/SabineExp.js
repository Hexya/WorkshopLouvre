import soundFile from '../assets/sound/AESTHETICS PLEASE - Run From Love.mp3';
import Sound from './Sound.js';
let OrbitControls = require('three-orbit-controls')(THREE)
import objFile from '../assets/model/SabineXp.obj';

import imgSprite from '../assets/img/atlasFish_Back_transp.png';
import daeModel from '../assets/model/try.dae';

let firstSceneTemplate = require('./Templates/firstSceneTemplate.tpl');
let secSceneTemplate = require('./Templates/secSceneTemplate.tpl');
let thirdSceneTemplate = require('./Templates/thirdSceneTemplate.tpl');
let fourthSceneTemplate = require('./Templates/fourthSceneTemplate.tpl');
let fifthSceneTemplate = require('./Templates/fifthSceneTemplate.tpl');
let sixthSceneTemplate = require('./Templates/sixthSceneTemplate.tpl');
let seventhSceneTemplate = require('./Templates/seventhSceneTemplate.tpl');


let Stats = require('stats-js')

import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/shaders/CopyShader'

import 'three/examples/js/shaders/DotScreenShader'
import 'three/examples/js/shaders/LuminosityHighPassShader';
import 'three/examples/js/postprocessing/UnrealBloomPass';

import * as dat from 'dat.gui';
import { TimelineMax, Power4 } from 'gsap';

let step = 0;
let currentStep = 0;
let timerStep = 0;
let spriteAnimator;
let clock = new THREE.Clock();


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

        this.registerEvents();

        // Stats
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = '0px';
        document.body.appendChild( this.stats.domElement );

        // Mouse  // TO-DO : Parallax effect
        let mouseX = 0.5;
        let mouseY = 0.5;
        document.addEventListener("mousemove", onMouseMove);
        function onMouseMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        // Sound
        this.play = new LoadSound();

        //THREE SCENE
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
        this.camera.position.z = 11;
        this.camera.position.y = 6;
        //this.controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();


        // let meshesPosAndRotations = {
        //     'Hair': {
        //         posX: -3.3,
        //         posY: 0.21,
        //         posZ: -0.5,
        //         rotX: 0,
        //         rotY: 0,
        //         rotZ: -0.5
        //     },
        //     'Head': {
        //         posX: -2.37,
        //         posY: 0.18,
        //         posZ: 1.4,
        //         rotX: -0.25,
        //         rotY: 0,
        //         rotZ: -0.1
        //     },
        //     'Chest': {
        //         posX: -7.3,
        //         posY: 0.49,
        //         posZ: -7.3,
        //         rotX: 4.5,
        //         rotY: 0,
        //         rotZ: 5
        //     },
        //     'Hip': {
        //         posX: 5.5,
        //         posY: 0.7,
        //         posZ: -9.6,
        //         rotX: 0,
        //         rotY: 0,
        //         rotZ: 0
        //     },
        //     'Leg': {
        //         posX: 4.4,
        //         posY: 0.6,
        //         posZ: 3.4,
        //         rotX: 2,
        //         rotY: 1,
        //         rotZ: 5.4
        //     },
        //     'Foot': {
        //         posX: -10,
        //         posY: 0.31,
        //         posZ: -1.9,
        //         rotX: 0,
        //         rotY: 1,
        //         rotZ: 0
        //     }
        // }

        var loader = new THREE.OBJLoader();
        loader.load(objFile,
            ( modelObj )=> {
                modelObj.traverse( function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshPhongMaterial({color: 0xfafbfc});
                        child.castShadow = true; //default is false
                        child.receiveShadow = true; //default is false
                        // console.log(child.name)

                        child.scale.set(0.1,0.1,0.1);
                        //child.position.x = Math.random()*20-10;
                        //child.position.z = Math.random()*20-10;

                        switch (child.name) {
                            case 'Hair':
                                child.position.x = -3.3;
                                child.position.y = 0.21;
                                child.position.z = 6.4;
                                child.rotation.z = -0.5;
                                break;
                            case 'Head':
                                child.position.x = -2.37;
                                child.position.y = 0.18;
                                child.position.z = 1.4;
                                child.rotation.x = -0.25;
                                child.rotation.z = -0.1;
                                break;
                            case 'Chest':
                                child.position.x = -7.3;
                                child.position.y = 0.49;
                                child.position.z = -7.3;
                                child.rotation.x = 4.5;
                                child.rotation.z = 5;
                                break;
                            case 'Hip':
                                child.position.x = 5.5;
                                child.position.y = 0.7;
                                child.position.z = -9.6;
                                break;
                            case 'Leg':
                                child.position.x = 4.4;
                                child.position.y = 0.6;
                                child.position.z = 3.4;
                                child.rotation.x = 2;
                                child.rotation.y = 1;
                                child.rotation.z = 5.4;
                                break;
                            case 'Foot':
                                child.position.x = -10;
                                child.position.y = 0.31;
                                child.position.z = -1.9;
                                child.rotation.y = 1;
                                break;
                        }
                    }
                })
                this.scene.add( modelObj );
                this.initGsap();
                this.tl.pause();

                this.parameters(modelObj);

                // Remove Loader
                this.loaded()
            },
            (xhr) => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            (error) => {
                console.log( 'An error happened' );
            }
        );


        //LIGHT
        //Hemisphere (subtle ambient)
        this.hemiLight = new THREE.HemisphereLight( 0xbbbebf, 0x3c4849, 1 );
        this.scene.add( this.hemiLight );
        //Directional (with shadow)
        this.dirLight = new THREE.DirectionalLight( 0x707077, 1 )
        this.dirLight.castShadow = true
        this.dirLight.shadow.mapSize.height = 2048; // default is 512
        this.dirLight.shadow.mapSize.width = 2048; // default is 512

        this.dirLight.shadow.camera.near = 0.1;       // default 0.5
        this.dirLight.shadow.camera.far = 500;      // default 500

        this.dirLight.shadow.camera.top *= 2.1;     // defaults are  top:5 ; bottom:-5 ; left:-5 ; right:5
        this.dirLight.shadow.camera.bottom *= 2.1;      
        this.dirLight.shadow.camera.left *= 2.1;  
        this.dirLight.shadow.camera.right *= 2.1;
        
        this.dirLight.position.set(-6,15,10);

        this.scene.add(this.dirLight)

        this.dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
        this.scene.add( this.dirLightHelper );

        //BACKGROUND
        let bgSize = 500;

        let groundGeo = new THREE.CircleGeometry( bgSize, 128 );
        let groundMat = new THREE.MeshPhongMaterial( { color: 0x81b6bc, side: THREE.BackSide, shadowSide: THREE.BackSide } );
        this.groundMesh = new THREE.Mesh( groundGeo, groundMat );
        this.groundMesh.receiveShadow = true; //default is false
        this.groundMesh.rotation.x = Math.PI*0.5;
        this.scene.add( this.groundMesh );

        // Target Sphere
        let targetGeo = new THREE.SphereGeometry( 0.02, 16, 16 );
        let targetMat = new THREE.MeshBasicMaterial( { color: 0xff2020} );
        this.targetMesh = new THREE.Mesh( targetGeo, targetMat );
        this.scene.add( this.targetMesh );
        
        //ANIM PLANE
        let textureLoader = new THREE.TextureLoader();
        let spriteAnimTexture = textureLoader.load( imgSprite );
        spriteAnimTexture.premultiplyAlpha = true;
        spriteAnimTexture.needsUpdate = true;

        spriteAnimator = new this.textureAnimator( spriteAnimTexture, 20, 12, 240, 1000/24 ); // texture, #horiz, #vert, #total, duration.
        console.log("spriteAnimator :", spriteAnimator)
        let spriteAnimMaterial = new THREE.SpriteMaterial( {
            map: spriteAnimTexture,
            side:THREE.DoubleSide,
            transparent:true,
            alphaTest:0.001
        } );
        spriteAnimMaterial.map.premultiplyAlpha = true;
        spriteAnimMaterial.map.needsUpdate = true;
        spriteAnimMaterial.blending = THREE.CustomBlending;
        spriteAnimMaterial.blendEquation = THREE.AddEquation; // default is AddEquation
        spriteAnimMaterial.blendSrc = THREE.SrcAlphaFactor;
        spriteAnimMaterial.blendDst = THREE.OneFactor;

        
        let spriteAnim = new THREE.Sprite( spriteAnimMaterial );

        spriteAnim.position.y = this.camera.position.y;
        spriteAnim.position.z = this.camera.position.z -1;

        this.scene.add(spriteAnim);


        //RENDERER
    	this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
        this.renderer.setClearColor( '#BBFFFF' )
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap; 
        this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.setAnimationLoop( this.render.bind(this));
        //document.querySelector('#main canvas').style.webkitFilter = "blur(3px)";

    }

    textureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
        // note: texture passed by reference, will be updated by the update function.
        this.tilesHorizontal = tilesHoriz;
        this.tilesVertical = tilesVert;
        // how many images does this spritesheet contain?
        // usually equals tilesHoriz * tilesVert, but not necessarily,
        // if there at blank tiles at the bottom of the spritesheet.
        this.numberOfTiles = numTiles;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

        // how long should each image be displayed?
        this.tileDisplayDuration = tileDispDuration;

        // how long has the current image been displayed?
        this.currentDisplayTime = 0;

        // which image is currently being displayed?
        this.currentTile = 0;

        this.update = function (milliSec) {
            this.currentDisplayTime += milliSec;
            while (this.currentDisplayTime > this.tileDisplayDuration) {
                this.currentDisplayTime -= this.tileDisplayDuration;
                this.currentTile++;
                if (this.currentTile == this.numberOfTiles)
                    this.currentTile = 0;
                var currentColumn = this.currentTile % this.tilesHorizontal;
                texture.offset.x = currentColumn / this.tilesHorizontal;
                var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
                texture.offset.y = currentRow / this.tilesVertical;
            }
        };
    }

    registerEvents() {
        window.addEventListener('mousewheel', this.mouseWheel.bind(this))
    }

    mouseWheel(e) {
        console.log(timerStep)
        if(timerStep == 1) {
            setTimeout(()=>{
                timerStep = 0;
            }, 1500)
        }
        if(timerStep == 0) {
            if (e.wheelDelta > 100) {
                if(step != 0) {
                    step -= 1;
                    //console.log(step);
                    this.reverseScene(step);
                }
                timerStep = 1;
            }
            if (e.wheelDelta < -100) {
                if(step != 7) {
                    step += 1;
                    //console.log(step);
                    this.updateScene(step);
                }
                timerStep = 1;
            }
        }
    }

    updateScene() {
        console.log("step:", step);
        console.log("nextstep:", step + 1);
        console.log("prevtstep:", step - 1 );
        switch (step) {
            case 0:switc
                break;
            case 1:
                this.tl.play()
                document.querySelector('#main canvas').classList.add('nonblurred');
                this.toggleTpl('init-scene', 'first-scene', firstSceneTemplate)
                console.log('first step')
                break;
            case 2:
                this.tl.play()
                this.toggleTpl('first-scene', 'sec-scene', secSceneTemplate)
                console.log('sec step')
                break;
            case 3:
                this.tl.play()
                this.toggleTpl('sec-scene', 'third-scene', thirdSceneTemplate)
                console.log('third step')
                break;
            case 4:
                this.tl.play()
                this.toggleTpl('third-scene', 'fourth-scene', fourthSceneTemplate)
                console.log('fourth scene');
                break;
            case 5:
                this.tl.play()
                this.toggleTpl('fourth-scene', 'fifth-scene', fifthSceneTemplate)
                console.log('fifth step');
                break;
            case 6:
                this.tl.play()
                this.toggleTpl('fifth-scene', 'sixth-scene', sixthSceneTemplate)
                console.log('sixth step');
                break;
            case 7:
                this.toggleTpl('sixth-scene', 'seventh-scene', seventhSceneTemplate)
                console.log('seventh step');
                break;
        }
    }
    reverseScene() {
        console.log("step:", step);
        switch (step) {
            case 0:
                this.tl.reverse()
                document.querySelector('#main canvas').classList.remove('nonblurred');
                break;
            case 1:
                this.tl.reverse();
                this.toggleTpl('init-scene', 'first-scene', firstSceneTemplate)
                console.log('first step')
                break;
            case 2:
                this.tl.reverse();
                this.toggleTpl('first-scene', 'sec-scene', secSceneTemplate)
                console.log('sec step')
                break;
            case 3:
                this.tl.reverse();
                this.toggleTpl('sec-scene', 'third-scene', thirdSceneTemplate)
                console.log('third step')
                break;
            case 4:
                this.tl.reverse();
                this.toggleTpl('third-scene', 'fourth-scene', fourthSceneTemplate)
                console.log('fourth scene');
                break;
            case 5:
                this.tl.reverse();
                this.toggleTpl('fourth-scene', 'fifth-scene', fifthSceneTemplate)
                console.log('fifth step');
                break;
            case 6:
                this.tl.reverse();
                this.toggleTpl('fifth-scene', 'sixth-scene', sixthSceneTemplate)
                console.log('sixth step');
                break;
            case 7:
                this.toggleTpl('sixth-scene', 'seventh-scene', seventhSceneTemplate)
                console.log('seventh step');
                break;
        }
    }
    //GSAP
    initGsap() {
        this.tl = new TimelineMax({
            delay:0,
            repeat:0,
            // onUpdate:updateStats,
            // onRepeat:updateReps,
            // onComplete:restart
        });

        this.tl
                .add('intro')
                .to(this.targetMesh.position, 0,{
                    x: 0,
                    z: 0,
                    ease:Power1.easeInOut
                    },
                    'intro')

                .add('step1') // Hair Scene
                .to(this.targetMesh.position, 1.0,{
                    x: this.scene.children[6].children[5].position.x+0.5,
                    y: this.scene.children[6].children[5].position.y+2,
                    z: this.scene.children[6].children[5].position.z,
                    ease:Power1.easeInOut
                    },
                    'step1')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[6].children[5].position.x-0.5,
                    y: 2,
                    z: this.scene.children[6].children[5].position.z+1.5,
                    ease:Power1.easeInOut
                    },
                    'step1+=0.5')
                .to(this.scene.children[6].children[5].position, 1.3,{ // Hair float position
                    y: this.scene.children[6].children[5].position.y+2,
                    ease:Power1.easeInOut
                    },
                    'step1+=0.5')
                .to(this.scene.children[6].children[5].rotation, 1.9,{ // Hair float rotation
                    x: 0.1,
                    y: Math.PI*2,
                    z: 0,
                    ease:Power1.easeInOut
                    },
                    'step1+=0.5')
                .addPause()

                .add('step2') // Hip scene
                .to(this.targetMesh.position,1.0,{
                    x: this.scene.children[6].children[1].position.x-0.5,
                    y: this.scene.children[6].children[1].position.y+1,
                    z: this.scene.children[6].children[1].position.z,
                    ease:Power1.easeInOut
                    },
                    'step2')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[6].children[1].position.x-1,
                    y: 2.5,
                    z: this.scene.children[6].children[1].position.z+3,
                    ease:Power1.easeInOut
                    },
                    'step2+=0.5')
                .to(this.scene.children[6].children[5].position, 1.0,{ // Hair back to ground position
                    y: this.scene.children[6].children[5].position.y,
                    ease:Power1.easeInOut
                    },
                    'step2')
                .to(this.scene.children[6].children[5].rotation, 1.6,{ // Hair back to ground rotation
                    y: this.scene.children[6].children[5].rotation.y,
                    z: this.scene.children[6].children[5].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step2')
                .to(this.scene.children[6].children[1].position, 1.3,{ // Hip float position
                    y: this.scene.children[6].children[1].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step2+=0.5')
                .to(this.scene.children[6].children[1].rotation, 1.9,{ // Hip float rotation
                    y: this.scene.children[6].children[1].rotation.y + Math.PI*2 - 0.2,
                    z: this.scene.children[6].children[1].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step2+=0.5')
                .addPause()

                .add('step3') // Foot scene
                .to(this.targetMesh.position,1.0,{
                    x: this.scene.children[6].children[3].position.x+0.5,
                    y: this.scene.children[6].children[3].position.y+1,
                    z: this.scene.children[6].children[3].position.z,
                    ease:Power1.easeInOut
                    },
                    'step3')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[6].children[3].position.x,
                    z: this.scene.children[6].children[3].position.z+5,
                    ease:Power1.easeInOut
                    },
                    'step3+=0.5')
                .to(this.scene.children[6].children[1].position, 1.0,{ // Hip back to ground position
                    y: this.scene.children[6].children[1].position.y,
                    ease:Power1.easeInOut
                    },
                    'step3')
                .to(this.scene.children[6].children[1].rotation, 1.6,{ // Hip back to ground rotation
                    y: this.scene.children[6].children[1].rotation.y,
                    z: this.scene.children[6].children[1].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step3')
                .to(this.scene.children[6].children[3].position, 1.3,{ // Foot float position
                    y: this.scene.children[6].children[3].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step3+=0.5')
                .to(this.scene.children[6].children[3].rotation, 1.9,{ // Foot float rotation
                    y: this.scene.children[6].children[3].rotation.y + Math.PI*2 - 0.2,
                    z: this.scene.children[6].children[3].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step3+=0.5')
                .addPause()

                .add('step4') // Chest scene
                .to(this.targetMesh.position, 1.0,{
                    x: this.scene.children[6].children[0].position.x+0.5,
                    y: this.scene.children[6].children[0].position.y+1,
                    z: this.scene.children[6].children[0].position.z,
                    ease:Power1.easeInOut
                    },
                    'step4')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[6].children[0].position.x,
                    z: this.scene.children[6].children[0].position.z+2,
                    ease:Power1.easeInOut
                    },
                    'step4+=0.5')
                .to(this.scene.children[6].children[3].position, 1.0,{ // Foot back to ground position
                    y: this.scene.children[6].children[3].position.y,
                    ease:Power1.easeInOut
                    },
                    'step4')
                .to(this.scene.children[6].children[3].rotation, 1.6,{ // Foot back to ground rotation
                    y: this.scene.children[6].children[3].rotation.y,
                    z: this.scene.children[6].children[3].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step4')
                .to(this.scene.children[6].children[0].position, 1.3,{ // Chest float position
                    y: this.scene.children[6].children[0].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step4+=0.5')
                .to(this.scene.children[6].children[0].rotation, 1.9,{ // Chest float rotation
                    y: this.scene.children[6].children[0].rotation.y + Math.PI*2 - 0.2,
                    z: this.scene.children[6].children[0].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step4+=0.5')
                .addPause()

                .add('step5') // Leg scene
                .to(this.targetMesh.position, 1.0,{
                    x: this.scene.children[6].children[2].position.x-0.5,
                    y: this.scene.children[6].children[2].position.y+1,
                    z: this.scene.children[6].children[2].position.z,
                    ease:Power1.easeInOut
                    },
                    'step5')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[6].children[2].position.x,
                    z: this.scene.children[6].children[2].position.z+2,
                    ease:Power1.easeInOut
                    },
                    'step5+=0.5')
                .to(this.scene.children[6].children[0].position, 1.0,{ // Chest back to ground position
                    y: this.scene.children[6].children[0].position.y,
                    ease:Power1.easeInOut
                    },
                    'step5')
                .to(this.scene.children[6].children[0].rotation, 1.6,{ // Chest back to ground rotation
                    y: this.scene.children[6].children[0].rotation.y,
                    z: this.scene.children[6].children[0].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step5')
                .to(this.scene.children[6].children[2].position, 1.3,{ // Leg float position
                    y: this.scene.children[6].children[2].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step5+=0.5')
                .to(this.scene.children[6].children[2].rotation, 1.9,{ // Leg float rotation
                    y: this.scene.children[6].children[2].rotation.y + Math.PI*2 - 0.2,
                    z: this.scene.children[6].children[2].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step5+=0.5')
                .addPause()
                
                .add('step6') // Head scene
                .to(this.targetMesh.position, 1.0,{
                    x: this.scene.children[6].children[4].position.x+0.5,
                    y: this.scene.children[6].children[4].position.y+1,
                    z: this.scene.children[6].children[4].position.z,
                    ease:Power1.easeInOut
                    },
                    'step6')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[6].children[4].position.x,
                    z: this.scene.children[6].children[4].position.z+2,
                    ease:Power1.easeInOut
                    },
                    'step6+=0.5')
                .to(this.scene.children[6].children[2].position, 1.0,{ // Leg back to ground position
                    y: this.scene.children[6].children[2].position.y,
                    ease:Power1.easeInOut
                    },
                    'step6')
                .to(this.scene.children[6].children[2].rotation, 1.6,{ // Leg back to ground rotation
                    y: this.scene.children[6].children[2].rotation.y,
                    z: this.scene.children[6].children[2].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step6')
                .to(this.scene.children[6].children[4].position, 1.3,{ // Head float position
                    y: this.scene.children[6].children[4].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step6+=0.5')
                .to(this.scene.children[6].children[4].rotation, 1.9,{ // Head float rotation
                    y: this.scene.children[6].children[4].rotation.y + Math.PI*2 - 0.2,
                    z: this.scene.children[6].children[4].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step6+=0.5')
                .addPause()
    }

    toggleTpl(latestScene, activeScene, template) {
        document.querySelector(".scene-cont").classList.add('remove-scene');
        setTimeout(()=> {
            document.querySelector(".scene-cont").classList.remove(latestScene);
            document.querySelector(".scene-cont").classList.remove('remove-scene');
            document.querySelector(".scene-cont").classList.add(activeScene);
            document.querySelector(".scene-cont").innerHTML = template;
        },1000)
    }

    loaded() {
        document.querySelector('.loader').classList.add('remove-scene')
        setTimeout(()=> {
            document.querySelector('.loader').remove();
            document.querySelector('.scene-cont').style.display = 'block';
        },500)
    }

    //REQUEST ANIMATION LOOP
    render() {
        this.stats.begin();
        let time = Date.now()/1000;

        var delta = clock.getDelta();
        spriteAnimator.update(1000 * delta);

        // this.dirLight.position.x = Math.sin(time)*6
        // this.dirLight.position.y = 15
        // this.dirLight.position.z = Math.cos(time)*6

        this.camera.lookAt(this.targetMesh.position);

        //RENDER
    	this.renderer.render( this.scene, this.camera ); //Default

        this.stats.end();
    }

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    parameters(modelObj) {
        //Gui
        console.log(modelObj)
        let gui = new dat.GUI();

        let Meshes = gui.addFolder('Meshes');
        let grpElem = Meshes.addFolder('Group');
        let grpPos = grpElem.addFolder('Group Position');
        grpPos.add(modelObj.position, 'x', -10, 10).listen();
        grpPos.add(modelObj.position, 'y', -4, 4).listen();
        grpPos.add(modelObj.position, 'z', -10, 10).listen();
        let grpScale = grpElem.addFolder('Group Scale');
        grpScale.add(modelObj.scale, 'x', 0, 1).listen();
        grpScale.add(modelObj.scale, 'y', 0, 1).listen();
        grpScale.add(modelObj.scale, 'z', 0, 1).listen();
        let hairElem = Meshes.addFolder('Hair');
        let hairPos = hairElem.addFolder('Hair position');
        hairPos.add(modelObj.children[5].position, 'x', -10, 10).listen();
        hairPos.add(modelObj.children[5].position, 'y', -4, 4).listen();
        hairPos.add(modelObj.children[5].position, 'z', -10, 10).listen();
        let hairRotate = hairElem.addFolder('Hair Rotation');
        hairRotate.add(modelObj.children[5].rotation, 'x', -Math.PI, Math.PI).listen();
        hairRotate.add(modelObj.children[5].rotation, 'y', -Math.PI, Math.PI).listen();
        hairRotate.add(modelObj.children[5].rotation, 'z', -Math.PI, Math.PI).listen();
        let headElem = Meshes.addFolder('Head');
        let headPos = headElem.addFolder('Head position');
        headPos.add(modelObj.children[4].position, 'x', -10, 10).listen();
        headPos.add(modelObj.children[4].position, 'y', -4, 4).listen();
        headPos.add(modelObj.children[4].position, 'z', -10, 10).listen();
        let headRotate = headElem.addFolder('Head Rotation');
        headRotate.add(modelObj.children[4].rotation, 'x', -Math.PI, Math.PI).listen();
        headRotate.add(modelObj.children[4].rotation, 'y', -Math.PI, Math.PI).listen();
        headRotate.add(modelObj.children[4].rotation, 'z', -Math.PI, Math.PI).listen();
        let chestElem = Meshes.addFolder('Chest');
        let chestPos = chestElem.addFolder('Chest position');
        chestPos.add(modelObj.children[0].position, 'x', -10, 10).listen();
        chestPos.add(modelObj.children[0].position, 'y', -4, 4).listen();
        chestPos.add(modelObj.children[0].position, 'z', -10, 10).listen();
        let chestRotate = chestElem.addFolder('Chest Rotation');
        chestRotate.add(modelObj.children[0].rotation, 'x', -Math.PI, Math.PI).listen();
        chestRotate.add(modelObj.children[0].rotation, 'y', -Math.PI, Math.PI).listen();
        chestRotate.add(modelObj.children[0].rotation, 'z', -Math.PI, Math.PI).listen();
        let hipElem = Meshes.addFolder('Hip');
        let hipPos = hipElem.addFolder('Hip position');
        hipPos.add(modelObj.children[1].position, 'x', -10, 10).listen();
        hipPos.add(modelObj.children[1].position, 'y', -4, 4).listen();
        hipPos.add(modelObj.children[1].position, 'z', -10, 10).listen();
        let hipRotate = hipElem.addFolder('Hip Rotation');
        hipRotate.add(modelObj.children[1].rotation, 'x', -Math.PI, Math.PI).listen();
        hipRotate.add(modelObj.children[1].rotation, 'y', -Math.PI, Math.PI).listen();
        hipRotate.add(modelObj.children[1].rotation, 'z', -Math.PI, Math.PI).listen();
        let legElem = Meshes.addFolder('Leg');
        let legPos = legElem.addFolder('Leg position');
        legPos.add(modelObj.children[2].position, 'x', -10, 10).listen();
        legPos.add(modelObj.children[2].position, 'y', -4, 4).listen();
        legPos.add(modelObj.children[2].position, 'z', -10, 10).listen();
        let legRotate = legElem.addFolder('Leg Rotation');
        legRotate.add(modelObj.children[2].rotation, 'x', -Math.PI, Math.PI).listen();
        legRotate.add(modelObj.children[2].rotation, 'y', -Math.PI, Math.PI).listen();
        legRotate.add(modelObj.children[2].rotation, 'z', -Math.PI, Math.PI).listen();
        let footElem = Meshes.addFolder('Foot');
        let footPos = footElem.addFolder('Foot position');
        footPos.add(modelObj.children[3].position, 'x', -10, 10).listen();
        footPos.add(modelObj.children[3].position, 'y', -4, 4).listen();
        footPos.add(modelObj.children[3].position, 'z', -10, 10).listen();
        let footRotate = footElem.addFolder('Foot Rotation');
        footRotate.add(modelObj.children[3].rotation, 'x', -Math.PI, Math.PI).listen();
        footRotate.add(modelObj.children[3].rotation, 'y', -Math.PI, Math.PI).listen();
        footRotate.add(modelObj.children[3].rotation, 'z', -Math.PI, Math.PI).listen();

        let Camera = gui.addFolder('Camera');
        let CameraPos = Camera.addFolder('Camera Position');
        CameraPos.add(this.camera.position, 'x',
                this.scene.children[6].children[1].position.x-4,
                this.scene.children[6].children[1].position.x+4
            ).listen();
        CameraPos.add(this.camera.position, 'y',
                this.scene.children[6].children[1].position.y-4,
                this.scene.children[6].children[1].position.y+4
            ).listen();
        CameraPos.add(this.camera.position, 'z',
                this.scene.children[6].children[1].position.z-4,
                this.scene.children[6].children[1].position.z+4
            ).listen();
    }
}
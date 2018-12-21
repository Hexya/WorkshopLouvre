import Sound from './Sound.js';
let OrbitControls = require('three-orbit-controls')(THREE)
import objFile from '../assets/model/SabineXp.obj';

import imgSprite1 from '../assets/img/Sprites/COURONNE.png';
import imgSprite2 from '../assets/img/Sprites/CARTHAGE.png';
import imgSprite3 from '../assets/img/Sprites/FIRE.png';
import imgSprite4 from '../assets/img/Sprites/BACKFISH.png';
import imgSprite5 from '../assets/img/Sprites/FRONTFISH.png';
import imgSprite6 from '../assets/img/Sprites/RECONSTRUCTON.png';
import imgSprite7 from '../assets/img/Sprites/LOUVRE.png';

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
let isFinalSceneTransition = false;
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
        //this.play = new LoadSound();

        //THREE SCENE
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.01, 10000 );
        this.camera.position.x = 3;
        this.camera.position.y = 8;
        this.camera.position.z = 15;
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
        //         posX: -4.7,
        //         posY: 0.49,
        //         posZ: -8.4,
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
                                child.position.x = -4.7;
                                child.position.y = 0.49;
                                child.position.z = -8.4;
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
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                let percent = (xhr.loaded / xhr.total * 100);
                document.querySelector('.load-progress').innerHTML = Math.floor(percent) +'%';
                document.querySelector('.loader .loaded-svg').style.height = Math.floor(percent) + 'px';
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
        this.dirLight = new THREE.DirectionalLight( 0x707077, 0.8 )
        this.dirLight.castShadow = true
        this.dirLight.shadow.mapSize.height = 2048; // default is 512
        this.dirLight.shadow.mapSize.width = 2048; // default is 512

        this.dirLight.shadow.camera.near = 0.1;       // default 0.5
        this.dirLight.shadow.camera.far = 500;      // default 500

        this.dirLight.shadow.camera.top *= 2.1;     // defaults are  top:5 ; bottom:-5 ; left:-5 ; right:5
        this.dirLight.shadow.camera.bottom *= 2.1;      
        this.dirLight.shadow.camera.left *= 2.1;  
        this.dirLight.shadow.camera.right *= 2.1;
        
        this.dirLight.position.set(-4,5,3);

        this.scene.add(this.dirLight)

        // this.dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
        // this.scene.add( this.dirLightHelper );

        //BACKGROUND
        let bgSize = 500;

        let groundGeo = new THREE.CircleGeometry( bgSize, 128 );
        let groundMat = new THREE.MeshPhongMaterial( { color: 0x81b6bc, side: THREE.BackSide, shadowSide: THREE.BackSide, shininess: 0 } );
        this.groundMesh = new THREE.Mesh( groundGeo, groundMat );
        this.groundMesh.receiveShadow = true; //default is false
        this.groundMesh.rotation.x = Math.PI*0.5;
        this.scene.add( this.groundMesh );

        // Target Sphere
        let targetGeo = new THREE.SphereGeometry( 0.00002, 0.0016, 0.0016 );
        let targetMat = new THREE.MeshBasicMaterial( { color: 0xff2020, opacity: 0.2, transparent: true} );
        this.targetMesh = new THREE.Mesh( targetGeo, targetMat );
        this.scene.add( this.targetMesh );
        
        //ANIM PLANE
        let spriteAnimeTextures = [];
        let imgSprites = [imgSprite1, imgSprite2, imgSprite3, imgSprite4, imgSprite5, imgSprite6, imgSprite7]
        let vertical = [29, 19, 8, 14, 17, 19, 19]
        let horizontal = [4, 4, 13, 18, 18, 4, 4]
        let totalImg = [113, 76, 102, 234, 288, 74, 72]
        this.spriteAnimMaterial = []
        this.spriteAnim = [];
        this.spriteAnimator = [];
        for(let i=0; i<7; i++) {
            let textureLoader = new THREE.TextureLoader();
            spriteAnimeTextures[i] = textureLoader.load(imgSprites[i]);
            spriteAnimeTextures[i].premultiplyAlpha = true;
            spriteAnimeTextures[i].needsUpdate = true;

            this.spriteAnimator[i] = new this.textureAnimator(spriteAnimeTextures[i], horizontal[i], vertical[i], totalImg[i], 1000 / 24); // texture, #horiz, #vert, #total, duration.
            //console.log("spriteAnimator :", spriteAnimator)
            this.spriteAnimMaterial[i] = new THREE.SpriteMaterial({
                map: spriteAnimeTextures[i],
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.001,
                opacity: 0
            });
            this.spriteAnimMaterial[i].map.premultiplyAlpha = true;
            this.spriteAnimMaterial[i].map.needsUpdate = true;
            this.spriteAnimMaterial[i].blending = THREE.CustomBlending;
            this.spriteAnimMaterial[i].blendEquation = THREE.AddEquation; // default is AddEquation
            this.spriteAnimMaterial[i].blendSrc = THREE.SrcAlphaFactor;
            this.spriteAnimMaterial[i].blendDst = THREE.OneFactor;

            this.spriteAnim[i] = new THREE.Sprite(this.spriteAnimMaterial[i]);

            // this.spriteAnim[i].scale.x = 2;
            // this.spriteAnim[i].scale.y = 2;

            this.scene.add(this.spriteAnim[i]);
        }
        //COURONNE
        this.spriteAnim[0].position.x = -3.15;
        this.spriteAnim[0].position.y = 2.19;
        this.spriteAnim[0].position.z = 7.1;
        this.spriteAnim[0].scale.set(1.48,0.96,1);
        //CARTHAGE
        this.spriteAnim[1].position.x = 4.1;
        this.spriteAnim[1].position.y = 2;
        this.spriteAnim[1].position.z = -9;
        this.spriteAnim[1].scale.set(3.3,2,1);
        //FIRE
        this.spriteAnim[2].position.x = -9.4;
        this.spriteAnim[2].position.y = 2.5;
        this.spriteAnim[2].position.z = -2.4;
        this.spriteAnim[2].scale.set(3.3,2.3,1);
        //FISH BACK
        this.spriteAnim[3].position.x = -5.6;
        this.spriteAnim[3].position.y = 2.2;
        this.spriteAnim[3].position.z = -8.9;
        this.spriteAnim[3].scale.set(2.5,2,1);
        //FISH FRONT
        this.spriteAnim[4].position.x = -4.8;
        this.spriteAnim[4].position.y = 2.3;
        this.spriteAnim[4].position.z = -7.4;
        this.spriteAnim[4].scale.set(1.8, 1.45, 1);
        //RECONSTRUCTION
        this.spriteAnim[5].position.x = 2.9;
        this.spriteAnim[5].position.y = 1.25;
        this.spriteAnim[5].position.z = 4.8;
        this.spriteAnim[5].scale.set(2.8, 2, 1);
        //LOUVRE
        this.spriteAnim[6].position.x = -1.5;
        this.spriteAnim[6].position.y = 0.73;
        this.spriteAnim[6].position.z = 1.9;
        this.spriteAnim[6].scale.set(1.4, 1, 1);

        console.log(this.spriteAnim)

        //RENDERER
    	this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
        this.renderer.setClearColor( '#81b6bc' )
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
                texture.offset.y = tilesVert - currentRow / this.tilesVertical;
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
                this.controls = new OrbitControls(this.camera)
                this.tl.play()
                this.toggleTpl('sixth-scene', 'seventh-scene', seventhSceneTemplate)
                setTimeout(()=> {
                    document.querySelector('.more-zoom').addEventListener('mouseover', this.mouseZoom.bind(this))
                    document.querySelector('.less-zoom').addEventListener('mouseover', this.mouseUnZoom.bind(this))
                },1000);
                console.log('seventh step');
                break;
        }
    }

    mouseZoom() {
        this.camera.position.z -= 0.1;
        let continious = setTimeout(() => {this.mouseZoom();}, 10);
        document.querySelector('.more-zoom').addEventListener('mouseout', function() {
        clearInterval(continious);
        });
    }
    mouseUnZoom() {
        this.camera.position.z += 0.1;
        let continious = setTimeout(() => {this.mouseUnZoom();}, 10);
        document.querySelector('.less-zoom').addEventListener('mouseout', function() {
            clearInterval(continious);
        });
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
                    x: this.scene.children[11].children[5].position.x+0.5,
                    y: this.scene.children[11].children[5].position.y+2,
                    z: this.scene.children[11].children[5].position.z,
                    ease:Power1.easeInOut
                    },
                    'step1')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[11].children[5].position.x-0.5,
                    y: 2,
                    z: this.scene.children[11].children[5].position.z+1.5,
                    ease:Power1.easeInOut
                    },
                    'step1+=0.5')
                .to(this.scene.children[11].children[5].position, 1.3,{ // Hair float position
                    y: this.scene.children[11].children[5].position.y+2,
                    ease:Power1.easeInOut
                    },
                    'step1+=0.5')
                .to(this.scene.children[11].children[5].rotation, 1.9,{ // Hair float rotation
                    x: 0.1,
                    y: Math.PI*2,
                    z: 0,
                    ease:Power1.easeInOut
                    },
                    'step1+=0.5')
                .to(this.spriteAnimMaterial[0], 1.9,{ //fade in
                    opacity: 1
                    },
                    'step1+=2.3')
                .addPause()

                .add('step2') // Hip scene
                .to(this.targetMesh.position,1.0,{
                    x: this.scene.children[11].children[1].position.x-1,
                    y: this.scene.children[11].children[1].position.y+1,
                    z: this.scene.children[11].children[1].position.z,
                    ease:Power1.easeInOut
                    },
                    'step2')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[11].children[1].position.x-1,
                    y: 2.5,
                    z: this.scene.children[11].children[1].position.z+3,
                    ease:Power1.easeInOut
                    },
                    'step2+=0.5')
                .to(this.scene.children[11].children[5].position, 1.0,{ // Hair back to ground position
                    y: this.scene.children[11].children[5].position.y,
                    ease:Power1.easeInOut
                    },
                    'step2')
                .to(this.scene.children[11].children[5].rotation, 1.6,{ // Hair back to ground rotation
                    y: this.scene.children[11].children[5].rotation.y,
                    z: this.scene.children[11].children[5].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step2')
                .to(this.scene.children[11].children[1].position, 1.3,{ // Hip float position
                    y: this.scene.children[11].children[1].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step2+=0.5')
                .to(this.scene.children[11].children[1].rotation, 1.9,{ // Hip float rotation
                    y: this.scene.children[11].children[1].rotation.y + Math.PI*2 - 0.2,
                    z: this.scene.children[11].children[1].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step2+=0.5')
                .to(this.spriteAnimMaterial[0], 0.9,{ // fade out
                    opacity: 0
                    },
                    'step2')
                .to(this.spriteAnimMaterial[1], 1.9,{ // fade in
                    opacity: 1
                    },
                    'step2+=2.3')
                .addPause()

                .add('step3') // Foot scene
                .to(this.targetMesh.position,1.0,{
                    x: this.scene.children[11].children[3].position.x+1,
                    y: this.scene.children[11].children[3].position.y+1.7,
                    z: this.scene.children[11].children[3].position.z,
                    ease:Power1.easeInOut
                    },
                    'step3')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[11].children[3].position.x+2,
                    y: 3.5,
                    z: this.scene.children[11].children[3].position.z+1,
                    ease:Power1.easeInOut
                    },
                    'step3+=0.5')
                .to(this.scene.children[11].children[1].position, 1.0,{ // Hip back to ground position
                    y: this.scene.children[11].children[1].position.y,
                    ease:Power1.easeInOut
                    },
                    'step3')
                .to(this.scene.children[11].children[1].rotation, 1.6,{ // Hip back to ground rotation
                    y: this.scene.children[11].children[1].rotation.y,
                    z: this.scene.children[11].children[1].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step3')
                .to(this.scene.children[11].children[3].position, 1.3,{ // Foot float position
                    y: this.scene.children[11].children[3].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step3+=0.5')
                .to(this.scene.children[11].children[3].rotation, 1.9,{ // Foot float rotation
                    y: this.scene.children[11].children[3].rotation.y + Math.PI*2,
                    z: this.scene.children[11].children[3].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step3+=0.5')
                .to(this.spriteAnimMaterial[1], 0.9,{ // fade out
                    opacity: 0
                    },
                    'step3')
                .to(this.spriteAnimMaterial[2], 1.9,{ // fade in
                    opacity: 1
                    },
                    'step3+=2.3')
                .addPause()

                .add('step4') // Chest scene
                .to(this.targetMesh.position, 1.0,{
                    x: this.scene.children[11].children[0].position.x-1,
                    y: this.scene.children[11].children[0].position.y+1,
                    z: this.scene.children[11].children[0].position.z,
                    ease:Power1.easeInOut
                    },
                    'step4')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[11].children[0].position.x,
                    z: this.scene.children[11].children[0].position.z+2,
                    ease:Power1.easeInOut
                    },
                    'step4+=0.5')
                .to(this.scene.children[11].children[3].position, 1.0,{ // Foot back to ground position
                    y: this.scene.children[11].children[3].position.y,
                    ease:Power1.easeInOut
                    },
                    'step4')
                .to(this.scene.children[11].children[3].rotation, 1.6,{ // Foot back to ground rotation
                    y: this.scene.children[11].children[3].rotation.y,
                    z: this.scene.children[11].children[3].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step4')
                .to(this.scene.children[11].children[0].position, 1.3,{ // Chest float position
                    y: this.scene.children[11].children[0].position.y+1.5,
                    ease:Power1.easeInOut
                    },
                    'step4+=0.5')
                .to(this.scene.children[11].children[0].rotation, 1.9,{ // Chest float rotation
                    x: -0.3,
                    y: -1.0,
                    z: 0.2,
                    ease:Power1.easeInOut
                    },
                    'step4+=0.5')
                .to(this.spriteAnimMaterial[2], 0.9,{ // fade out
                    opacity: 0
                    },
                    'step4')
                .to(this.spriteAnimMaterial[3], 1.9,{ // fade in
                    opacity: 1
                    },
                    'step4+=2.3')
                .to(this.spriteAnimMaterial[4], 1.9,{ // fade in
                    opacity: 1
                    },
                    'step4+=2.3')
                .addPause()

                .add('step5') // Leg scene
                .to(this.targetMesh.position, 1.0,{
                    x: this.scene.children[11].children[2].position.x+4,
                    y: this.scene.children[11].children[2].position.y+1.5,
                    z: this.scene.children[11].children[2].position.z,
                    ease:Power1.easeInOut
                    },
                    'step5')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[11].children[2].position.x-4,
                    y: this.scene.children[11].children[2].position.y+0.7,
                    z: this.scene.children[11].children[2].position.z+2.5,
                    ease:Power1.easeInOut
                    },
                    'step5+=0.5')
                .to(this.scene.children[11].children[0].position, 1.0,{ // Chest back to ground position
                    y: this.scene.children[11].children[0].position.y,
                    ease:Power1.easeInOut
                    },
                    'step5')
                .to(this.scene.children[11].children[0].rotation, 1.6,{ // Chest back to ground rotation
                    y: this.scene.children[11].children[0].rotation.y,
                    z: this.scene.children[11].children[0].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step5')
                .to(this.scene.children[11].children[2].position, 1.3,{ // Leg float position
                    y: this.scene.children[11].children[2].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step5+=0.5')
                .to(this.scene.children[11].children[2].rotation, 1.9,{ // Leg float rotation
                    x: -0.15,
                    y: -0.3,
                    z: 0,
                    ease:Power1.easeInOut
                    },
                    'step5+=0.5')
                .to(this.spriteAnimMaterial[3], 0.9,{ // fade out
                    opacity: 0
                    },
                    'step5')
                .to(this.spriteAnimMaterial[4], 0.9,{ // fade out
                    opacity: 0
                    },
                    'step5')
                .to(this.spriteAnimMaterial[5], 1.9,{ // fade in
                    opacity: 1
                    },
                    'step5+=2.3')
                .addPause()
                
                .add('step6') // Head scene
                .to(this.targetMesh.position, 1.0,{
                    x: this.scene.children[11].children[4].position.x+0.3,
                    y: this.scene.children[11].children[4].position.y+1.2,
                    z: this.scene.children[11].children[4].position.z,
                    ease:Power1.easeInOut
                    },
                    'step6')
                .to(this.camera.position, 1.5,{
                    x: this.scene.children[11].children[4].position.x-0.1,
                    y: this.scene.children[11].children[4].position.y+0.8,
                    z: this.scene.children[11].children[4].position.z+1.3,
                    ease:Power1.easeInOut
                    },
                    'step6+=0.5')
                .to(this.scene.children[11].children[2].position, 1.0,{ // Leg back to ground position
                    y: this.scene.children[11].children[2].position.y,
                    ease:Power1.easeInOut
                    },
                    'step6')
                .to(this.scene.children[11].children[2].rotation, 1.6,{ // Leg back to ground rotation
                    y: this.scene.children[11].children[2].rotation.y,
                    z: this.scene.children[11].children[2].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step6')
                .to(this.scene.children[11].children[4].position, 1.3,{ // Head float position
                    y: this.scene.children[11].children[4].position.y+1,
                    ease:Power1.easeInOut
                    },
                    'step6+=0.5')
                .to(this.scene.children[11].children[4].rotation, 1.9,{ // Head float rotation
                    y: this.scene.children[11].children[4].rotation.y + Math.PI*2 - 0.2,
                    z: this.scene.children[11].children[4].rotation.z,
                    ease:Power1.easeInOut
                    },
                    'step6+=0.5')
                .to(this.spriteAnimMaterial[5], 0.9,{ // fade out
                    opacity: 0
                    },
                    'step6')
                .to(this.spriteAnimMaterial[6], 1.9,{ // fade in
                    opacity: 1
                    },
                    'step6+=2.3')
                .addPause()

                .add('step7') // Final scene
                .to(this.targetMesh.position, 1.9,{
                    x: 0,
                    y: 3.5,
                    z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7')
                .to(this.camera.position, 1.9,{
                    x: -1.5,
                    y: 5,
                    z: 10,
                    ease:Power1.easeInOut
                    },
                    'step7')
                .to(this.scene.children[11].rotation, 3.5,{
                    x: 0,
                    y: Math.PI*4,
                    z: 0,
                    ease: Sine.easeInOut
                    },
                    'step7')
                .to(this.scene.children[11].children[3].position, 1.9,{ // Foot pos
                    x: 0, y: 0.3, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.1')
                .to(this.scene.children[11].children[3].rotation, 1.3,{ // Foot rot
                    x: 0, y: 0, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.1')
                .to(this.scene.children[11].children[2].position, 1.9,{ // Legs pos
                    x: 0, y: 1.55, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.3')
                .to(this.scene.children[11].children[2].rotation, 1.3,{ // Legs rot
                    x: 0, y: 0, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.3')
                .to(this.scene.children[11].children[1].position, 1.9,{ // Hip pos
                    x: -0.15, y: 3.15, z: -0.1,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.5')
                .to(this.scene.children[11].children[1].rotation, 1.3,{ // Hip rot
                    x: 0, y: 0, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.5')
                .to(this.scene.children[11].children[0].position, 1.9,{ // Chest pos
                    x: -0.305, y: 5.05, z: -0.12,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.7')
                .to(this.scene.children[11].children[0].rotation, 1.3,{ // Chest rot
                    x: 0, y: 0, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.7')
                .to(this.scene.children[11].children[4].position, 1.9,{ // Head pos
                    x: -0.35, y: 5.92, z: 0.2,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.9')
                .to(this.scene.children[11].children[4].rotation, 1.3,{ // Head rot
                    x: 0, y: 0, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=0.9')
                .to(this.scene.children[11].children[5].position, 1.9,{ // Hair pos
                    x: -0.54, y: 6.25, z: 0.3,
                    ease:Power1.easeInOut
                    },
                    'step7+=1.1')
                .to(this.scene.children[11].children[5].rotation, 1.3,{ // Hair rot
                    x: 0, y: 0, z: 0,
                    ease:Power1.easeInOut
                    },
                    'step7+=1.1')
                .to(this.spriteAnimMaterial[6], 0.9,{ // fade out
                    opacity: 0
                    },
                    'step7')
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

        let prevStep = step - 1;
        if(step < 7 && step > 0) {
            if (step <= 3 && step > 0) {
                this.spriteAnimator[prevStep].update(1000 * delta);
            }
            if (step == 4) {
                this.spriteAnimator[prevStep].update(1000 * delta);
                this.spriteAnimator[step].update(1000 * delta);
            }
            if (step > 4) {
                this.spriteAnimator[step].update(1000 * delta);
            }
        }

        /*//UPDATE SPRITE
        let prevStep = step - 1;
        if(step < 7 && step > 0) {
            this.spriteAnim[prevStep].scale.x = 0.01;
            this.spriteAnim[prevStep].scale.y = 0.01;
            this.spriteAnim[step].scale.x = 5;
            this.spriteAnim[step].scale.y = 5;
            this.spriteAnimator[step].update(1000 * delta);
        }
        if(step == 4) {
            this.spriteAnim[5].scale.x = 5;
            this.spriteAnim[5].scale.y = 5;
            this.spriteAnimator[5].update(1000 * delta);
        } else {
            this.spriteAnim[5].scale.x = 0.01;
            this.spriteAnim[5].scale.y = 0.01;
        }
        if(step == 7) {
            this.spriteAnim[prevStep].scale.x = 0.01;
            this.spriteAnim[prevStep].scale.y = 0.01;
        }*/

        if (isFinalSceneTransition) {
            this.camera.position.x = Math.sin(time)*6
            this.camera.position.y = 15
            this.camera.position.z = Math.cos(time)*6
        }

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
        hairPos.add(modelObj.children[5].position, 'x', -1.5, 1.5).listen();
        hairPos.add(modelObj.children[5].position, 'y', 5.5, 7.5).listen();
        hairPos.add(modelObj.children[5].position, 'z', -1.5, 1.5).listen();
        let hairRotate = hairElem.addFolder('Hair Rotation');
        hairRotate.add(modelObj.children[5].rotation, 'x', -Math.PI, Math.PI).listen();
        hairRotate.add(modelObj.children[5].rotation, 'y', -Math.PI, Math.PI).listen();
        hairRotate.add(modelObj.children[5].rotation, 'z', -Math.PI, Math.PI).listen();
        let headElem = Meshes.addFolder('Head');
        let headPos = headElem.addFolder('Head position');
        headPos.add(modelObj.children[4].position, 'x', -1.5, 1.5).listen();
        headPos.add(modelObj.children[4].position, 'y', 5.8, 7.8).listen();
        headPos.add(modelObj.children[4].position, 'z', -1.5, 1.5).listen();
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
                this.scene.children[11].children[4].position.x-4,
                this.scene.children[11].children[4].position.x+4
            ).listen();
        CameraPos.add(this.camera.position, 'y',
                this.scene.children[11].children[4].position.y-4,
                this.scene.children[11].children[4].position.y+4
            ).listen();
        CameraPos.add(this.camera.position, 'z',
                this.scene.children[11].children[4].position.z-4,
                this.scene.children[11].children[4].position.z+4
            ).listen();

        let sprite1 = gui.addFolder('Sprite')
        let sprite1Pos = sprite1.addFolder('Sprite 1 position')
        sprite1Pos.add(this.spriteAnim[0].position, 'x', -4.5, -2.5).listen()
        sprite1Pos.add(this.spriteAnim[0].position, 'y', 1.5, 3.5).listen()
        sprite1Pos.add(this.spriteAnim[0].position, 'z', 5.5, 7.5).listen()
        let sprite2Pos = sprite1.addFolder('Sprite 2 position')
        sprite2Pos.add(this.spriteAnim[1].position, 'x', 2.6, 5.5).listen()
        sprite2Pos.add(this.spriteAnim[1].position, 'y', 1.1, 3.5).listen()
        sprite2Pos.add(this.spriteAnim[1].position, 'z', -10.5, -8.2).listen()
        let sprite3Pos = sprite1.addFolder('Sprite 3 position')
        sprite3Pos.add(this.spriteAnim[2].position, 'x', -10.5, -6.5).listen()
        sprite3Pos.add(this.spriteAnim[2].position, 'y', 1.2, 3.2).listen()
        sprite3Pos.add(this.spriteAnim[2].position, 'z', -2.9, -0.5).listen()
        let sprite4Pos = sprite1.addFolder('Sprite 4 position')
        sprite4Pos.add(this.spriteAnim[3].position, 'x', -8.5, -5.5).listen()
        sprite4Pos.add(this.spriteAnim[3].position, 'y', 1.5, 2.5).listen()
        sprite4Pos.add(this.spriteAnim[3].position, 'z', -11.5, -7.5).listen()
        let sprite5Pos = sprite1.addFolder('Sprite 5 position')
        sprite5Pos.add(this.spriteAnim[4].position, 'x', -5.9, -4.5).listen()
        sprite5Pos.add(this.spriteAnim[4].position, 'y', 1.5, 3.5).listen()
        sprite5Pos.add(this.spriteAnim[4].position, 'z', -8.5, -7.2).listen()
        let sprite6Pos = sprite1.addFolder('Sprite 6 position')
        sprite6Pos.add(this.spriteAnim[5].position, 'x', 1.5, 4.5).listen()
        sprite6Pos.add(this.spriteAnim[5].position, 'y', 1.2, 1.6).listen()
        sprite6Pos.add(this.spriteAnim[5].position, 'z', 3.5, 5.5).listen()
        let sprite7Pos = sprite1.addFolder('Sprite 7 position')
        sprite7Pos.add(this.spriteAnim[6].position, 'x', -1.5, 0.5).listen()
        sprite7Pos.add(this.spriteAnim[6].position, 'y', -0.5, 1.5).listen()
        sprite7Pos.add(this.spriteAnim[6].position, 'z', 0.1, 2.5).listen()
    }
}
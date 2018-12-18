import soundFile from '../assets/sound/AESTHETICS PLEASE - Run From Love.mp3';
import Sound from './Sound.js';
let OrbitControls = require('three-orbit-controls')(THREE)
import objFile from '../assets/model/SabineXp.obj';
import imgSprite from '../assets/img/spriteAqua.png';
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
let spriteAnime;
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

        //Stats
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = '0px';
        document.body.appendChild( this.stats.domElement );

        // Sound
        this.play = new LoadSound();

        //THREE SCENE
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
        this.camera.position.z = 10;
        this.camera.position.y = 5;
        //this.controls = new OrbitControls(this.camera)

        this.scene = new THREE.Scene();

        /*var col = new THREE.ColladaLoader();
        col.load( daeModel, ( collada ) => {
            console.log('dae model')
            console.log(collada.scene.children[4]);
            this.scene.add(collada.scene.children[4])
        });*/

        //this.model = new LoaderObj();
        var loader = new THREE.OBJLoader();
        loader.load(objFile,
            ( modelObj )=> {
                modelObj.traverse( function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshPhongMaterial({color: 0xfafbfc});
                        child.castShadow = true; //default is false
                        child.receiveShadow = true; //default is false
                        //console.log(child.name)

                        child.scale.set(0.1,0.1,0.1);
                        child.position.x = Math.random()*20-10;
                        child.position.z = Math.random()*20-10;
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
        this.hemiLight = new THREE.HemisphereLight( 0xbbbebf, 0x9a9acd, 1 );
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

        this.scene.add(this.dirLight)

        this.dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 10 );
        this.scene.add( this.dirLightHelper );

        /*let spriteMap = new THREE.TextureLoader().load( imgSprite );
        let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        let sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(5, 5, 1)
        sprite.position.z = -2;
        sprite.center = new THREE.Vector2( 0.5, 0 );
        this.scene.add( sprite );*/

        let runnerTexture = new THREE.ImageUtils.loadTexture( imgSprite );
        spriteAnime = new this.textureAnimator( runnerTexture, 20, 11, 190, 1000/24 ); // texture, #horiz, #vert, #total, duration.
        console.log('HEY', spriteAnime)
        let runnerMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, alphaMap: runnerTexture, side:THREE.DoubleSide, transparent:true } );
        let runnerGeometry = new THREE.PlaneGeometry(9, 6, 32);
        let runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
        this.scene.add(runner);


        //BACKGROUND
        let bgSize = 500;

        let groundGeo = new THREE.CircleGeometry( bgSize, 128 );
        let groundMat = new THREE.MeshPhongMaterial( { color: 0x9de7f0, side: THREE.BackSide, shadowSide: THREE.BackSide } );
        this.groundMesh = new THREE.Mesh( groundGeo, groundMat );
        this.groundMesh.receiveShadow = true; //default is false
        this.groundMesh.rotation.x = Math.PI*0.5;
        this.scene.add( this.groundMesh );

        // Target Sphere
        let targetGeo = new THREE.SphereGeometry( 0.08, 16, 16 );
        let targetMat = new THREE.MeshBasicMaterial( { color: 0xff2020} );
        this.targetMesh = new THREE.Mesh( targetGeo, targetMat );
        this.scene.add( this.targetMesh );

        /*let planeGeo = new THREE.PlaneBufferGeometry(5, 20, 32)
        let planeMat = new THREE.MeshBasicMaterial({color: 0xff2020})
        this.planeVisu = new THREE.Mesh(planeGeo, planeMat);
        this.scene.add( this.planeVisu )*/


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
            },1000)
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

    scrollNext() {
        if(step != 7) {
            currentStep = step;
            step += 1;
            //console.log(step);
            console.log('currentStep:',currentStep, '/ step:',step)

            this.updateScene(step, currentStep);
        }
    }
    scrollPrevious() {
        if(step != 0) {
            currentStep = step;
            step -= 1;
            //console.log(step);
            this.updateScene(step, currentStep);
        }
    }

    updateScene() {
        switch (step) {
            case 0:
                console.log('init scene');
                break;
            case 1:
                this.tl.play()
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
        switch (step) {
            case 0:
                console.log('init scene');
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
        /*this.tl.to(this.scene.children[5].position,  0.5, { y: 0, x: 4, ease:Power4.easeInOut })
               .add('test')
               .to(this.camera.position,             1.5, { y: 8, z: 5, ease:Bounce.easeOut }, 'test')
               .to(this.refMesh.position,            1.5, { x: 3, y: 5, ease:Power1.easeOut }, 'test')
               .add('test2')
               .to(this.camera.position,             1.5, { y: 18, z: 15, ease:Bounce.easeOut }, 'test2')
               .to(this.refMesh.position,            1.5, { x: 13, y: 15, ease:Power1.easeOut }, 'test2')
               .add('test3')
               .to(this.camera.position,             1.5, { y: 20, z: 16, ease:Bounce.easeOut }, 'test3')
               .to(this.refMesh.position,            1.5, { x: 15, y: 16, ease:Power1.easeOut }, 'test3')
               .add('test4')
               .to(this.camera.position,             1.5, { y: 14, z: 13, ease:Bounce.easeOut }, 'test4')
               .to(this.refMesh.position,            1.5, { x: 13, y: 14, ease:Power1.easeOut }, 'test4')*/
        this.tl
                .add('intro')
                .to(this.targetMesh.position,1.5,{
                    x: 0,
                    z: 0,
                    ease:Power1.easeOut
                    },
                    'intro')
                .add('step1')
                .to(this.targetMesh.position,1.5,{
                    x: this.scene.children[6].children[2].position.x,
                    z: this.scene.children[6].children[2].position.z,
                    ease:Power1.easeOut
                    },
                    'step1')
                .addPause()
                .add('step2')
                .to(this.targetMesh.position,1.5,{
                    x: this.scene.children[6].children[3].position.x,
                    z: this.scene.children[6].children[3].position.z,
                    ease:Power1.easeOut
                    },
                    'step2')
                .addPause()
                .add('step3')
                .to(this.targetMesh.position,1.5,{
                    x: this.scene.children[6].children[0].position.x,
                    z: this.scene.children[6].children[0].position.z,
                    ease:Power1.easeOut
                    },
                    'step3')     
                .addPause()
                .add('step4')
                .to(this.targetMesh.position,1.5,{
                    x: this.scene.children[6].children[4].position.x,
                    z: this.scene.children[6].children[4].position.z,
                    ease:Power1.easeOut
                    },
                    'step4')     
                .addPause()
                .add('step5')
                .to(this.targetMesh.position,1.5,{
                    x: this.scene.children[6].children[5].position.x,
                    z: this.scene.children[6].children[5].position.z,
                    ease:Power1.easeOut
                    },
                    'step5')
                .addPause()
                .add('step6')
                .to(this.scene.children[6].children[1].position,1.5,{
                        x: 0,
                        y: 0,
                        z: 0,
                        ease:Power1.easeOut
                    },
                    'step6')
                .add('end')
                /*.add('step6')
                .to(this.targetMesh.position,1.5,{
                    x: this.scene.children[5].children[1].position.x,
                    z: this.scene.children[5].children[1].position.z,
                    ease:Power1.easeOut
                    },
                    'step6')
                .add('end')*/
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

    //UPDATE
    render() {
        this.stats.begin();
        let time = Date.now()/1000;

        var delta = clock.getDelta();
        spriteAnime.update(1000 * delta);

        this.dirLight.position.x = Math.sin(time)*6
        this.dirLight.position.y = 15
        this.dirLight.position.z = Math.cos(time)*6

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
        hairRotate.add(modelObj.children[2].rotation, 'x', 0, 10).listen();
        hairRotate.add(modelObj.children[2].rotation, 'y', 0, 10).listen();
        hairRotate.add(modelObj.children[2].rotation, 'z', 0, 10).listen();
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
    }
}
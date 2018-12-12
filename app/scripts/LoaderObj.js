import objFile from '../assets/model/Venus.obj';
import App from './SabineExp'

export default class LoaderObj extends App {
    constructor() {
        super()
        var loader = new THREE.OBJLoader();
        loader.load(objFile,
            ( object )=> {
                object.scale.set(0.0001,0.0001,0.0001)
                this.scene.add( object );
            },
            (xhr) => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            (error) => {
                console.log( 'An error happened' );
            }
        );
    }
}
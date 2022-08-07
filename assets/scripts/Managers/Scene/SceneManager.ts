import { _decorator, Component, Node, Prefab, instantiate, Vec3, Color, director, } from 'cc';
import { SceneType } from '../../SceneType';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('SceneManager')
@menu('Managers/SceneManager')
export default class SceneManager extends Component {
    //#region editors fields and properties
    //#endregion

    //#region public fields and properties
    //#endregion
        
    //#region private fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        director.preloadScene(SceneType.Game);
    }
    //#endregion

    //#region public methods
	//#endregion

	//#region private methods
	//#endregion

	//#region event handlers
    //#endregion
}
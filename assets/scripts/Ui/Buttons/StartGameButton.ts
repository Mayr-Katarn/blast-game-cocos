import { log, _decorator, Component, director } from 'cc';
import { SceneType } from '../../SceneType';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('StartGameButton')
@menu('Ui/Buttons/StartGameButton')
export default class StartGameButton extends Component {
    //#region editors fields and properties
    //#endregion

    //#region public fields and properties
    //#endregion
        
    //#region private fields and properties
    //#endregion

	//#region life-cycle callbacks
    // #endregion

    //#region public methods
	//#endregion

	//#region private methods
    private _startGame(): void {
        director.loadScene(SceneType.Game);
    }
	//#endregion

	//#region event handlers
    public onClick(): void {
        this._startGame();
    }
    //#endregion
}
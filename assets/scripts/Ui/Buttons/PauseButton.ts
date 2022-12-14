import { log, _decorator, Component, director } from 'cc';
import { SceneType } from '../../SceneType';

//#region classes-helpers
const { ccclass, menu } = _decorator;
//#endregion

@ccclass('PauseButton')
@menu('Ui/Buttons/PauseButton')
export default class PauseButton extends Component {
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
    private _stopGame(): void {
        director.loadScene(SceneType.MainMenu);
    }
	//#endregion

	//#region event handlers
    public onClick(): void {
        this._stopGame();
    }
    //#endregion
}
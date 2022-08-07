import { log, _decorator, Component, Enum, Node, Prefab, Label, Vec3 } from 'cc';
import { GameEvent, gameEventTarget } from '../../EventEnums/GameEvents';
import BusterType from '../../GameObjects/Enums/BusterType';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
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
	//#endregion

	//#region event handlers
    public onClick(): void {
        console.log("CLICK PAUSE");
        // gameEventTarget.emit(GameEvent.TOGGLE_ACTIVE_BUSTER, this._busterType);
    }
    //#endregion
}
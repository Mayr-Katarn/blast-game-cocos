import { log, _decorator, Component, Label } from 'cc';
import { GameEvent, gameEventTarget } from '../../EventEnums/GameEvents';
import BusterType from '../../GameObjects/Enums/BusterType';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('BusterButton')
@menu('Ui/Buttons/BusterButton')
export default class BusterButton extends Component {
    //#region editors fields and properties
    @property({ type: Label })
    protected label: Label = null;
    //#endregion

    //#region public fields and properties
    //#endregion
        
    //#region private fields and properties
    private _busterType: number = BusterType.None;
    //#endregion

	//#region life-cycle callbacks
    // #endregion

    //#region public methods
    public init(
        busterType: number,
        labelText: string,
        labelFontSize: number,
    ): void {
        this._busterType = busterType;
        this.label.string = labelText;
        this.label.fontSize = labelFontSize;
    }
	//#endregion

	//#region private methods
	//#endregion

	//#region event handlers
    public onClick(): void {
        gameEventTarget.emit(GameEvent.BLOCK_TOGGLE_ACTIVE_BUSTER, this._busterType);
    }
    //#endregion
}
import { log, _decorator, Component, Enum, Node, ProgressBar } from 'cc';
import { eventTarget, GameEvent } from '../Enums/GameEvents';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('ProgressBar')
@menu('Ui/ProgressBar')
export default class UiProgressBar extends Component {
    //#region editors fields and properties
    //#endregion

    //#region private fields and properties
    private _progressBar: ProgressBar;
    //#endregion
        
    //#region public fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this._progressBar = this.getComponent(ProgressBar);
        this._eventListener(true);
    }

    public onDisable(): void {
        this._eventListener(false);
    }
    //#endregion

    //#region public methods
	//#endregion

	//#region private methods
    private _eventListener(isOn: boolean): void {
        const func: string = isOn ? "on" : "off";
        eventTarget[func](GameEvent.SET_PROGRESS, this.onSetProgress, this);
    }
	//#endregion

	//#region event handlers
    public onSetProgress(percent: number): void {
        this._progressBar.progress = percent / 100;
    }
    //#endregion
}
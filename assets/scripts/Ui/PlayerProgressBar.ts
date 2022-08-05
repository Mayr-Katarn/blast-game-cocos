import { log, _decorator, Component, Enum, Node, ProgressBar } from 'cc';
import { gameEventTarget, GameEvent } from '../EventEnums/GameEvents';
import { UiEvent, uiEventTarget } from '../EventEnums/UiEvents';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('PlayerProgressBar')
@menu('Ui/PlayerProgressBar')
export default class PlayerProgressBar extends Component {
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
        uiEventTarget[func](UiEvent.SET_PROGRESS, this.onSetProgress, this);
    }
	//#endregion

	//#region event handlers
    public onSetProgress(percent: number): void {
        this._progressBar.progress = percent / 100;
    }
    //#endregion
}
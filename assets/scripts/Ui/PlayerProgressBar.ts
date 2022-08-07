import { log, _decorator, Component, ProgressBar, ITweenOption, tween, Tween } from 'cc';
import { UiEvent, uiEventTarget } from '../EventEnums/UiEvents';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('PlayerProgressBar')
@menu('Ui/PlayerProgressBar')
export default class PlayerProgressBar extends Component {
    //#region editors fields and properties
    @property
    protected progressLineTweenDuration: number = 0.4;
    //#endregion

    //#region private fields and properties
    private _progressBar: ProgressBar;
    private _tween: Tween<ProgressBar>;
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

    private _setProgress(percent: number): void {
        this._tween?.stop();
        this._tween = tween(this._progressBar).to(
            this.progressLineTweenDuration,
            { progress: percent / 100 },
            { easing: "quadOut" }
        ).start();
    }
	//#endregion

	//#region event handlers
    public onSetProgress(percent: number): void {
        this._setProgress(percent);
    }
    //#endregion
}
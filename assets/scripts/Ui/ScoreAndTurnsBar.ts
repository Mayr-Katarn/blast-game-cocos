import { log, _decorator, Component, Enum, Node, ProgressBar, Label } from 'cc';
import { gameEventTarget, GameEvent } from '../EventEnums/GameEvents';
import { UiEvent, uiEventTarget } from '../EventEnums/UiEvents';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('ScoreAndTurnsBar')
@menu('Ui/ScoreAndTurnsBar')
export default class ScoreAndTurnsBar extends Component {
    //#region editors fields and properties
    @property({ type: Label })
    turnsLabel: Label = null;

    @property({ type: Label })
    playerScoreLabel: Label = null;
    //#endregion

    //#region private fields and properties
    //#endregion
        
    //#region public fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
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
        uiEventTarget[func](UiEvent.SET_TURNS, this.onSetTurnsLabel, this);
        uiEventTarget[func](UiEvent.SET_PLAYER_SCORE, this.onSetPlayerScoreLabel, this);
    }

    private _setTurnsLabel(turns: number): void {
        this.turnsLabel.string = `${turns}`;
    }

    private _setPlayerScoreLabel(playerScore: number): void {
        this.playerScoreLabel.string = `${playerScore}`
    }
	//#endregion

	//#region event handlers
    public onSetTurnsLabel(turns: number): void {
        this._setTurnsLabel(turns);
    }

    public onSetPlayerScoreLabel(playerScore: number): void {
        this._setPlayerScoreLabel(playerScore);
    }
    //#endregion
}
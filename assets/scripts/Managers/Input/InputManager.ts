import { log, _decorator, Component, Node, Touch } from 'cc';
import { gameEventTarget, GameEvent } from '../../EventEnums/GameEvents';
import GameAreaInputCommand from './Commands/GameAreaInputCommand';
import IInputCommand from './Commands/IInputCommand';
import UiAreaInputCommand from './Commands/UiAreaInputCommand';
import InputDirection from './Enums/InputDirection';
import { InputType } from './Enums/InputType';
import InputCatcher from './InputCatcher';

//#region classes-helpers
const { ccclass, menu } = _decorator;
//#endregion

@ccclass('InputManager')
@menu('Managers/InputManager')
export default class InputManager extends Component {
    //#region editors fields and properties
	//#endregion

	//#region public fields and properties
	//#endregion

	//#region private fields and properties
	private _commands: { [key: number]: IInputCommand } = {};
	private _isActive = true;
	//#endregion

	//#region life-cycle callbacks
	public onLoad(): void {
		gameEventTarget.on(GameEvent.INPUT, this.onInput, this);

		this._commands[InputDirection.GameArea] = new GameAreaInputCommand(this);
		this._commands[InputDirection.UiArea] = new UiAreaInputCommand(this);
	}

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
		gameEventTarget[func](GameEvent.TOGGLE_INPUT_MANAGER, this.onToggleInputManager, this);
    }
	//#endregion

	//#region event handlers
	public onInput(type: number, area: number, touch: Touch, place: InputCatcher): void {
		if (!this._isActive) return;
		const command = this._commands[area];
		
		switch (type) {
			case InputType.Down:
				command?.onDown(touch, place);
				break;

			case InputType.Move:
				command?.onMove(touch, place);
				break;

			case InputType.Up:
				command?.onUp(touch, place);
				break;
		}
	}

	public onDown(area: number, touch: Touch, place: InputCatcher): void {}
	public onMove(area: number, touch: Touch, place: InputCatcher): void {}
	public onUp(area: number, touch: Touch, place: InputCatcher): void {}

	public onToggleInputManager(isOn: boolean): void {
		this._isActive = isOn;
	}
	//#endregion
}

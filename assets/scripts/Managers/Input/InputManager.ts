import { log, _decorator, Component, EventTarget, Enum, Node, Touch } from 'cc';
import { gameEventTarget, GameEvent } from '../../EventEnums/GameEvents';
import GameAreaInputCommand from './Commands/GameAreaInputCommand';
import IInputCommand from './Commands/IInputCommand';
import UiAreaInputCommand from './Commands/UiAreaInputCommand';
import { InputDirection } from './Enums/InputDirection';
import { InputType } from './Enums/InputType';
import InputCatcher from './InputCatcher';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
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
	//#endregion

	//#region life-cycle callbacks
	public onLoad(): void {
		gameEventTarget.on(GameEvent.INPUT, this.onInput, this);

		this._commands[InputDirection.GameArea] = new GameAreaInputCommand(this);
		this._commands[InputDirection.UiArea] = new UiAreaInputCommand(this);
	}
	//#endregion

	//#region public methods
	//#endregion

	//#region private methods
	//#endregion

	//#region event handlers
	public onInput(type: number, area: number, touch: Touch, place: InputCatcher, target: Node): void {
		const command = this._commands[area];
		
		switch (type) {
			case InputType.Down:
				command?.onDown(touch, place, target);
				break;

			case InputType.Move:
				command?.onMove(touch, place, target);
				break;

			case InputType.Up:
				command?.onUp(touch, place, target);
				break;
		}
	}

	public onDown(area: number, touch: Touch, place: InputCatcher, target: Node): void {}
	public onMove(area: number, touch: Touch, place: InputCatcher, target: Node): void {}
	public onUp(area: number, touch: Touch, place: InputCatcher, target: Node): void {}
	//#endregion
}

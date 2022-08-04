import { log, _decorator, Component, EventTarget, Enum, Node, Touch } from 'cc';
import { eventTarget, GameEvent } from '../../Enums/GameEvents';
import GameAreaInputCommand from './Commands/GameAreaInputCommand';
import IInputCommand from './Commands/IInputCommand';
import UiAreaCommand from './Commands/UiAreaInputCommand';
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
	// @property({ visible: false })
	// get countActiveTouch(): number {
	// 	let count = 0;

	// 	for (let i in this.touches) {
	// 		if (this.touches[i]) {
	// 			count += 1;
	// 		}
	// 	}

	// 	return count;
	// }

	// touches: any[] = [];
	private _commands: { [key: number]: IInputCommand } = {};
	//#endregion

	//#region life-cycle callbacks
	public onLoad(): void {
		eventTarget.on(GameEvent.INPUT, this.onInput, this);

		this._commands[InputDirection.GameArea] = new GameAreaInputCommand(this);
		this._commands[InputDirection.UiArea] = new UiAreaCommand(this);
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
				// if (command) {
					command?.onDown(touch, place, target);
				// }
				break;

			case InputType.Move:
				// if (command) {
					command?.onMove(touch, place, target);
				// }
				break;

			case InputType.Up:
				// if (command) {
					command?.onUp(touch, place, target);
				// }
				break;
		}
	}

	public onDown(area: number, touch: Touch, place: InputCatcher, target: Node): void {}
	public onMove(area: number, touch: Touch, place: InputCatcher, target: Node): void {}
	public onUp(area: number, touch: Touch, place: InputCatcher, target: Node): void {}
	//#endregion
}

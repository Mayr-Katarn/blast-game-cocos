import { _decorator, Node, Touch } from 'cc';
import BusterButton from '../../../Ui/Buttons/BusterButton';
import PauseButton from '../../../Ui/Buttons/PauseButton';
import InputDirection from '../Enums/InputDirection';
import UiAreaCommandType from '../Enums/UiAreaCommandType';
import InputCatcher from '../InputCatcher';
import InputManager from '../InputManager';
import IInputCommand from './IInputCommand';

export default class UiAreaInputCommand extends IInputCommand {
	constructor(manager: InputManager) {
		super(manager);
	}

	public onDown(touch: Touch, place: InputCatcher): void {}

	public onMove(touch: Touch, place: InputCatcher): void {}

	public onUp(touch: Touch, place: InputCatcher): void {
		const inputCatcher: InputCatcher = place.node.getComponent(InputCatcher);
		
		if (inputCatcher?.direction === InputDirection.UiArea) {
			switch (inputCatcher.uiAreaCommandType) {
				case UiAreaCommandType.BusterButton:
					place.node.getComponent(BusterButton).onClick();
					break;

				case UiAreaCommandType.PauseButton:
					place.node.getComponent(PauseButton).onClick();
					break;
			}
		}
	}
}

import { _decorator, Node, Touch } from 'cc';
import BusterButton from '../../../Ui/Buttons/BusterButton';
import InputCatcher from '../InputCatcher';
import InputManager from '../InputManager';
import IInputCommand from './IInputCommand';

export default class UiAreaInputCommand extends IInputCommand {
	constructor(manager: InputManager) {
		super(manager);
	}

	public onDown(touch: Touch, place: InputCatcher, target: Node): void {
	}

	public onMove(touch: Touch, place: InputCatcher, target: Node): void {}

	public onUp(touch: Touch, place: InputCatcher, target: Node): void {
		const busterButton = place.node.getComponent(BusterButton);
		busterButton?.onClick();
	}
}

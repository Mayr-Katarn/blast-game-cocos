import { _decorator, Node, Touch } from 'cc';
import Block from '../../../GameObjects/GameField/Block';
import InputCatcher from '../InputCatcher';
import InputManager from '../InputManager';
import IInputCommand from './IInputCommand';

export default class GameAreaInputCommand extends IInputCommand {
    constructor(manager: InputManager) {
		super(manager);
	}

	public onDown(touch: Touch, place: InputCatcher, target: Node): void {
		const block: Block = place.node.getComponent(Block);
		block?.onClick();
	}

	public onMove(touch: Touch, place: InputCatcher, target: Node): void {}

	public onUp(touch: Touch, place: InputCatcher, target: Node): void {}
}


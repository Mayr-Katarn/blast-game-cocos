import { _decorator, Node, Touch } from 'cc';
import { GameEvent, gameEventTarget } from '../../../EventEnums/GameEvents';
import Block from '../../../GameObjects/GameField/Block';
import GameAreaCommandType from '../Enums/GameAreaCommandType';
import InputDirection from '../Enums/InputDirection';
import InputCatcher from '../InputCatcher';
import InputManager from '../InputManager';
import IInputCommand from './IInputCommand';

export default class GameAreaInputCommand extends IInputCommand {
    constructor(manager: InputManager) {
		super(manager);
	}

	public onDown(touch: Touch, place: InputCatcher): void {
		const inputCatcher: InputCatcher = place.node.getComponent(InputCatcher);
		
		if (inputCatcher?.direction === InputDirection.GameArea) {
			switch (inputCatcher.gameAreaCommandType) {
				case GameAreaCommandType.Block:
					place.node.getComponent(Block).onClick();
					break;
			}
		}
	}

	public onMove(touch: Touch, place: InputCatcher): void {}

	public onUp(touch: Touch, place: InputCatcher): void {}
}


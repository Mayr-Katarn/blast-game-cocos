import { log, _decorator, Component, EventTarget, Enum, Node, Touch } from 'cc';
import Block from '../../../GameObjects/Block';
import InputCatcher from '../InputCatcher';
import InputManager from '../InputManager';
import IInputCommand from './IInputCommand';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

export default class GameAreaInputCommand extends IInputCommand {
    constructor(manager: InputManager) {
		super(manager);
		this._handleSubscription(true);
	}

	_handleSubscription(isOn: boolean): void {
		const func = isOn? 'on': 'off';
		// eventTarget[func](GameEvent.TURN_CHANGE, this.onTurnChange, this);
	}

	public onDown(touch: Touch, place: InputCatcher, target: Node): void {
        // console.log('GameAreaInputCommand ~ onDown ~ touch, place, target', touch, place, target)
		const block: Block = place.node.getComponent(Block);
		block?.onClick();
	}

	public onMove(touch: Touch, place: InputCatcher, target: Node): void {}

	public onUp(touch: Touch, place: InputCatcher, target: Node): void {}
}


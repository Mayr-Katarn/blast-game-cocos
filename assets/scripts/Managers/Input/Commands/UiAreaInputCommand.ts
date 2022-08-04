import { log, _decorator, Component, EventTarget, Enum, Node, Touch } from 'cc';
import InputCatcher from '../InputCatcher';
import InputManager from '../InputManager';
import IInputCommand from './IInputCommand';

//#region classes-helpers
// const { ccclass, property, menu } = _decorator;
//#endregion

export default class UiAreaCommand extends IInputCommand {

    constructor(manager: InputManager) {
		super(manager);
	}

	public onDown(touch: Touch, place: InputCatcher, target: Node): void {
        console.log('UiAreaCommand ~ onDown ~ touch, place, target', touch, place, target)
	}

	public onUp(touch: Touch, place: InputCatcher, target: Node): void {}
}

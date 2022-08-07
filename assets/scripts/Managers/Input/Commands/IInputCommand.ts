import { Touch, Node } from "cc";
import InputCatcher from "../InputCatcher";
import InputManager from "../InputManager";

export default class IInputCommand {
	public node: any;
	public manager: { node: any; };
	public touches: any;
	public currentTouch: any;
	
	constructor(manager: InputManager) {
		this.node = manager.node;
		this.manager = manager;
	}

	public onDown(touch: Touch, place: InputCatcher) {}
	public onMove(touch: Touch, place: InputCatcher) {}
	public onUp(touch: Touch, place: InputCatcher) {}
}

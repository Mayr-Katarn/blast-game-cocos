import { Touch, Node } from "cc";
import InputCatcher from "../InputCatcher";
import InputManager from "../InputManager";

interface ITouchInfo {
	id: number
	down: any
	last: any
	current: any
}

export default class IInputCommand {
	public node: any;
	public manager: { node: any; };
	public touches: any;
	public currentTouch: any;
	
	constructor(manager: InputManager) {
		this.node = manager.node;
		this.manager = manager;
		// this.touches = manager.touches;
		// this.currentTouch = null;
	}

	public onDown(touch: Touch, place: InputCatcher, target: Node) {}
	public onMove(touch: Touch, place: InputCatcher, target: Node) {}
	public onUp(touch: Touch, place: InputCatcher, target: Node) {}

	// public refreshTouchInfo(touchInfo: ITouchInfo, touch: Touch, place: InputCatcher): void {
	// 	touchInfo.last = touchInfo.current;
	// 	// touchInfo.current = this.getTouchInfo(touch, place);
	// }

	// public findTouch(touch: Touch) {
    //     console.log('IInputCommand ~ findTouch ~ touch', touch, this.touches)
	// }

	// public destroyTouch(touch: Touch) {
    //     console.log('IInputCommand ~ findTouch ~ touch', touch)
	// }
}

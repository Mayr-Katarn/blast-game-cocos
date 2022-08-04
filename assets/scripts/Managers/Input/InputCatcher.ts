import { log, _decorator, Component, EventTarget, Enum, Node, EventTouch } from 'cc';
import { eventTarget, GameEvent } from '../../Enums/GameEvents';
import { InputDirection } from './Enums/InputDirection';
import { InputType } from './Enums/InputType';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('InputCatcher')
@menu('Input/InputCatcher')
export default class InputCatcher extends Component {

    //#region editors fields and properties
	@property({ type: InputDirection })
	public direction = InputDirection.None;

	@property({ type: Node })
	public target: Node = null;
	//#endregion

    //#region private fields and properties
    //#endregion

	//#region life-cycle callbacks
	public onEnable(): void {
		this._handleEvents(true);
	}

	public onDisable(): void {
		this._handleEvents(false);
	}
	//#endregion

	//#region public methods
	//#endregion

	//#region private methods
	private _handleEvents(actived: boolean): void {
		const func = actived ? 'on' : 'off';

		this.node[func](Node.EventType.TOUCH_START, this.onDown, this);
		this.node[func](Node.EventType.TOUCH_MOVE, this.onMove, this);
		this.node[func](Node.EventType.TOUCH_END, this.onUp, this);
		this.node[func](Node.EventType.TOUCH_CANCEL, this.onUp, this);
	}
	//#endregion

	//#region event handlers
	public onDown(event: EventTouch): void {
		eventTarget.emit(GameEvent.INPUT, InputType.Down, this.direction, event.touch, this, this.target);
	}

	public onMove(event: EventTouch): void {
		eventTarget.emit(GameEvent.INPUT, InputType.Move, this.direction, event.touch, this, this.target);
	}

	public onUp(event: EventTouch): void {
		eventTarget.emit(GameEvent.INPUT, InputType.Up, this.direction, event.touch, this, this.target);
	}
	//#endregion
}

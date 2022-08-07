import { log, _decorator, Component, Node, Label, Color, tween, UIOpacity, UITransform, view, Vec3 } from 'cc';
import { UiEvent, uiEventTarget } from '../EventEnums/UiEvents';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('FullScreenMessage')
@menu('Ui/FullScreenMessage')
export default class FullScreenMessage extends Component {
    //#region editors fields and properties
    @property({ type: Node })
    protected backgroundNode: Node = null;

    @property({ type: Node })
    protected messageContainerNode: Node = null;
    
    @property({ type: Label })
    protected messageHeaderLabel: Label = null;

    @property({ type: Label })
    protected messageTextLabel: Label = null;

    @property
    protected showTime: number = 0.3;

    @property
    protected startMessagePosition: Vec3 = new Vec3();

    @property
    protected lifeTime: number = 2;
    //#endregion
        
    //#region public fields and properties
    //#endregion

    //#region private fields and properties
    private _uiOpacity: UIOpacity;
    private _backgroundTransform: UITransform;
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this._uiOpacity = this.getComponent(UIOpacity);
        this._backgroundTransform = this.backgroundNode.getComponent(UITransform);
        this._eventListener(true);
    }

    public onDisable(): void {
        this._eventListener(false);
    }
    //#endregion

    //#region public methods
	//#endregion

	//#region private methods
    private _eventListener(isOn: boolean): void {
        const func: string = isOn ? "on" : "off";
        uiEventTarget[func](UiEvent.SET_FULL_SCREEN_MESSAGE, this.onInitFullScreenMessage, this);
    }

    
    private _initFullScreenMessage(
        headerText: string,
        text: string,
        headerColor: Color,
        callback?: Function
    ): void {
        this.messageHeaderLabel.string = headerText;
        this.messageHeaderLabel.color = headerColor;
        this.messageTextLabel.string = text;

        this._setBackgroundToFullScreen();
        this._startShadingTween();
        this._startMessageTween();
        this._startLifeTimeScheduler(callback);
    }

    private _setBackgroundToFullScreen(): void {
        this._backgroundTransform.setContentSize(view.getVisibleSizeInPixel());
    }

    private _startShadingTween(): void {
        tween(this._uiOpacity)
            .to(this.showTime, { opacity: 255 })
            .start();
    }

    private _startMessageTween(): void {
        tween(this.messageContainerNode)
            .to(this.showTime, { position: Vec3.ZERO })
            .start();
    }

    private _startLifeTimeScheduler(callback?: Function): void {
        this.scheduleOnce(() => {
            callback && callback();
            this._uiOpacity.opacity = 0;
        }, this.lifeTime);
    }
	//#endregion

	//#region event handlers
    public onInitFullScreenMessage(headerText: string, text: string, headerColor: Color, callback?: Function): void {
        this._initFullScreenMessage(headerText, text, headerColor, callback);
    }
    //#endregion
}

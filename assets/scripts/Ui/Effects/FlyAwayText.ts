import { log, _decorator, Component, Vec3, Label, tween, ITweenOption } from 'cc';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('FlyAwayText')
@menu('Ui/Effects/FlyAwayText')
export default class FlyAwayText extends Component {
    //#region editors fields and properties
    @property({ type: Label })
    protected textLabel: Label = null;

    @property
    protected effectTweenDuration: number = 0.5;

    @property
    protected effectTweenTargetPosition: Vec3 = new Vec3();
    //#endregion

    //#region public fields and properties
    //#endregion
        
    //#region private fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this.textLabel.enabled = false;
    }
    //#endregion

    //#region public methods
    public init(worldPosition: Vec3, text: string): void {
        this.node.setWorldPosition(worldPosition);
        this.textLabel.string = text;
        this._flyAwayText();
    }
	//#endregion

	//#region private methods
    private _flyAwayText(): void {
        const worldPosition: Vec3 = this.effectTweenTargetPosition.add(this.node.worldPosition);
        this.textLabel.enabled = true;

        const options: ITweenOption = {
            easing: "quadOut",
            onComplete: () => {
                this.node.destroy();
            }
        }

        tween(this.node)
            .to(this.effectTweenDuration, { worldPosition }, options)
            .start();
    }
	//#endregion

	//#region event handlers
    //#endregion
}
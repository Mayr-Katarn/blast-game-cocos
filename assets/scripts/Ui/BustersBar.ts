import { log, _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import BusterType from '../GameObjects/Enums/BusterType';
import BusterButton from './Buttons/BusterButton';

//#region classes-helpers
const { ccclass, property, menu, executeInEditMode } = _decorator;

@ccclass('BusterButtonAtBar')
class BusterButtonAtBar {
    @property({ type: BusterType })
    public busterType: number = BusterType.None;
    
    @property({ type: Prefab })
    public busterPrefab: Prefab = null;

    @property
    public labelText: string = "";

    @property
    public labelFontSize: number = 18;
}
//#endregion

@ccclass('BustersBar')
@menu('Ui/BustersBar')
// @executeInEditMode(true)
export default class BustersBar extends Component {
    //#region editors fields and properties
    @property({ type: Node, tooltip: "Родительская нода кнопок" })
    protected buttonsContainer: Node = null;

    @property
    protected offsetXBetweenButtons: number = 10;

    @property({ type: [BusterButtonAtBar] })
    protected busterButtons: BusterButtonAtBar[] = [];
    //#endregion

    //#region private fields and properties
    //#endregion
        
    //#region public fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this._createButtons();
    }

    public onDisable(): void {

    }
    //#endregion

    //#region public methods
	//#endregion

	//#region private methods
    private _createButtons(): void {
        const startX: number = -this.offsetXBetweenButtons * (this.busterButtons.length - 1) / 2;
        
        this.busterButtons.forEach((button: BusterButtonAtBar, i: number) => {
            const position: Vec3 = new Vec3(startX + this.offsetXBetweenButtons * i, 0, 0);
            const buttonNode: Node = instantiate(button.busterPrefab);
            buttonNode.setParent(this.buttonsContainer);
            buttonNode.setPosition(position);
            buttonNode.getComponent(BusterButton).init(button.busterType, button.labelText, button.labelFontSize);
        })
    }
	//#endregion

	//#region event handlers
    //#endregion
}
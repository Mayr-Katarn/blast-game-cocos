import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { UiEvent, uiEventTarget } from '../../EventEnums/UiEvents';
import FlyAwayText from '../../Ui/Effects/FlyAwayText';
import EffectType from '../../Ui/Enums/EffectType';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;

@ccclass('UiEffect')
class UiEffect {
    @property({ type: EffectType })
    public effectType: number = EffectType.FlyAwayText;
    
    @property({ type: Prefab })
    public effectPrefab: Prefab = null;
}
//#endregion

@ccclass('UiManager')
@menu('Managers/UiManager')
export default class UiManager extends Component {
    //#region editors fields and properties
    @property({ type: Node, tooltip: "Корневая родительская нода" })
    protected rootNode: Node = null;

    @property({ type: [Prefab] })
    protected uiElements: Prefab[] = [];

    @property({ type: [UiEffect] })
    protected uiEffects: UiEffect[] = [];
    //#endregion

    //#region public fields and properties
    //#endregion
        
    //#region private fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this._createUiElements();
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
        uiEventTarget[func](UiEvent.FLY_AWAY_TEXT, this.onInitFlyAwayText, this);
    }

    private _createUiElements(): void {
        this.uiElements.forEach(elementPrefab => {
            const elementNode: Node = instantiate(elementPrefab);
            elementNode.setParent(this.rootNode);
        })
    }

    private _initFlyAwayText(worldPosition: Vec3, text: string): void {
        const effectPrefab: Prefab = this._getEffect(EffectType.FlyAwayText);
        const effectNode: Node = instantiate(effectPrefab);
        effectNode.setParent(this.rootNode);
        effectNode.getComponent(FlyAwayText).init(worldPosition, text);
    }

    private _getEffect(effectType: number): Prefab {
        return this.uiEffects.find(effect => effect.effectType === effectType).effectPrefab;
    }
	//#endregion

	//#region event handlers
    public onInitFlyAwayText(worldPosition: Vec3, text: string): void {
        this._initFlyAwayText(worldPosition, text);
    }
    //#endregion
}
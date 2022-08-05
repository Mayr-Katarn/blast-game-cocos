import { log, _decorator, Component, Node, Vec3, Prefab, instantiate } from 'cc';
import { GameEvent, gameEventTarget } from '../../EventEnums/GameEvents';
import BusterType from '../../GameObjects/Enums/BusterType';
import Block from '../../GameObjects/GameField/Block';
import BombBuster from '../../GameObjects/Busters/BombBuster';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('BustersManager')
@menu('Managers/BustersManager')
export default class Busters extends Component {
    //#region editors fields and properties
    @property({ type: Node, tooltip: "Корневая родительская нода" })
    protected rootNode: Node = null;

    @property({ type: Prefab })
    protected bombBusterPrefab: Prefab = null;
    //#endregion

    //#region public fields and properties
    //#endregion

    //#region private fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
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
        gameEventTarget[func](GameEvent.ACTIVATE_BUSTER, this.onActivateBuster, this);
    }

    private _activateBuster(busterType: number, block: Block): void {
        switch (busterType) {
            case BusterType.Bomb:
                this._activateBombBuster(block.node.worldPosition);
                gameEventTarget.emit(GameEvent.TOGGLE_ACTIVE_BUSTER, BusterType.None, this);
                break;
        
            default:
                break;
        }
    }

    private _activateBombBuster(position: Vec3): void {
        const bombNode: Node = instantiate(this.bombBusterPrefab);
        const bomb: BombBuster = bombNode.getComponent(BombBuster);
        bombNode.setParent(this.rootNode);
        bomb.init(position);
    }
	//#endregion

	//#region event handlers
    public onActivateBuster(busterType: number, block: Block): void {
        this._activateBuster(busterType, block);
    }
    //#endregion
}
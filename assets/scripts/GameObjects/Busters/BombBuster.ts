import { log, _decorator, Component, Node, Vec3, ITweenOption, tween, Contact2DType, Collider2D, IPhysics2DContact, PolygonCollider2D } from 'cc';
import { GameEvent, gameEventTarget } from '../../EventEnums/GameEvents';
import Block from '../GameField/Block';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('BombBuster')
@menu('GameObjects/Busters/BombBuster')
export default class BombBuster extends Component {
    //#region editors fields and properties
    @property({ type: Node })
    protected colliderNode: Node = null;

    @property
    protected radius: number = 3;

    @property
    protected activationTweenDuration: number = 0.2;
    //#endregion

    //#region public fields and properties
    //#endregion

    //#region private fields and properties
    private _collider: PolygonCollider2D;
    private _hitedBlocks: Block[] = [];
    //#endregion

	//#region life-cycle callbacks
    //#endregion

    //#region public methods
    public init(position: Vec3): void {
        this.node.setWorldPosition(position);
        this._initCollider();
        this._activateBuster();
    }
	//#endregion

	//#region private methods
    private _initCollider(): void {
        this._collider = this.colliderNode.getComponent(PolygonCollider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this._collider.enabled = false;
    }

    private _activateBuster(): void {
        this.colliderNode.position = Vec3.ZERO;
        this.colliderNode.setScale(Vec3.ONE);
        this._collider.enabled = true;
        const scale: Vec3 = new Vec3(this.radius, this.radius, 1);

        const options: ITweenOption = {
            onComplete: () => {
                this._collider.enabled = false;
                const firstBlockWorldPosition: Vec3 = this._hitedBlocks[0].node.worldPosition;
                gameEventTarget.emit(GameEvent.ADD_SCORE, firstBlockWorldPosition, this._hitedBlocks.length);
                this.node.destroy();
            },
        }

        tween(this.colliderNode)
            .to(this.activationTweenDuration, { scale }, options)
            .start();
    }
	//#endregion

	//#region event handlers
    public onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const block: Block = otherCollider.node.parent.getComponent(Block);
        if (!block.isDestroyed && !block.isMoving) {
            block.destroyBlock(block, true);
            this._hitedBlocks.push(block);
        }
    }
    //#endregion
}
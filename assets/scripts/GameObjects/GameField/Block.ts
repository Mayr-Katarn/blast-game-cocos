import { log, _decorator, Component, Node, SpriteFrame, BoxCollider2D, Sprite, math, Collider2D, IPhysics2DContact, Vec3, Contact2DType, tween, ITweenOption, Animation, Color } from 'cc';
import { gameEventTarget, GameEvent } from '../../EventEnums/GameEvents';
import BlockType from '../Enums/BlockType';
import BusterType from '../Enums/BusterType';
import Cell from './Cell';

//#region classes-helpers
const { ccclass, property, menu, executeInEditMode } = _decorator;

enum AnimationClip {
    Destroy = "block-destruction",
    Pulse = "block-pulse"
}

@ccclass('BlockColor')
class BlockColor {
    @property({ type: SpriteFrame })
    public blockSprite: SpriteFrame = null;

    @property({ type: BlockType })
    public color: number = BlockType.Blue;
}
//#endregion

@ccclass('Block')
@menu('GameObjects/GameField/Block')
@executeInEditMode(true)
export default class Block extends Component {

    //#region editors fields and properties
    @property({ type: Sprite })
    protected renderSprite: Sprite = null;

    @property({ type: Node })
    protected crossColliderNode: Node = null;

    @property
    protected initMoveTweenDuration: number = 0.5;
    
    @property
    protected moveToBotCellTweenDuration: number = 0.1;

    @property({ type: [BlockColor] })
    protected blockColors: BlockColor[] = [];
    //#endregion

    //#region public fields and properties
    public blockType: number;
    public row: number;
    public col: number;
    public isDestroyed: boolean = false;
    public isMoving: boolean = false;
    //#endregion
    
    //#region private fields and properties
    private _collider: BoxCollider2D;
    private _animation: Animation;
    private _maxActiveColors: number = 2;
    private _initScale: Vec3;
    private _sameColorNearbyBlocks: Block[] = [];
    private _bottomCell: Cell;
    private _isFirstInit: boolean = true;
    private _activeBuster: number = BusterType.None;
    //#endregion

	//#region life-cycle callbacks
    //#endregion

    //#region public methods
    public onEnable(): void {
        this._initCollider();
        this._animation = this.getComponent(Animation);
        this._eventListener(true);
    }

    public onDisable(): void {
        this._eventListener(false);
    }

    public update(): void {
        this._checkBottomCell();
    }

    public init(
        position: Vec3,
        targetPosition: Vec3,
        row: number,
        col: number,
        maxActiveColors: number,
        cellsSum: number
    ): void {
        this._maxActiveColors = maxActiveColors > this.blockColors.length ? this.blockColors.length : maxActiveColors;
        this.row = row;
        this.col = col;
        this._sameColorNearbyBlocks = [];
        this.isDestroyed = false;
        this._bottomCell = null;
        this._setInitScale();
        this.node.setSiblingIndex(cellsSum - 1);
        this.setNewColor().setLocalPosition(position);
        this._moveTween(targetPosition);
        this._isFirstInit = false;
    }

    public setNewColor(): this {
        const index: number = math.randomRangeInt(0, this._maxActiveColors);
        const blockColor: BlockColor = this.blockColors[index];
        this.renderSprite.grayscale = false;
        this.renderSprite.color = Color.WHITE;
        this.renderSprite.node.setScale(Vec3.ONE);
        this.renderSprite.spriteFrame = blockColor.blockSprite;
        this.blockType = blockColor.color;
        return this;
    }

    public setLocalPosition(position: Vec3): this {
        this.node.position = position;
        this.crossColliderNode.position = Vec3.ZERO;
        return this;
    }

    public destroyBlock(firstBlock: Block = this, isOnlyThis = false): void {
        this.isDestroyed = true;
        if (!isOnlyThis) {
            gameEventTarget.emit(GameEvent.SET_BLOCK_IN_CHAIN, firstBlock, this)
            this._sameColorNearbyBlocks.forEach(block => !block.isDestroyed && block.destroyBlock(firstBlock));
            this._sameColorNearbyBlocks = [];
        }
        this._animation.play(AnimationClip.Destroy);
    }
	//#endregion

	//#region private methods
    private _eventListener(isOn: boolean): void {
        const func: string = isOn ? "on" : "off";
        gameEventTarget[func](GameEvent.BLOCK_RESET_COLOR, this.onResetColor, this);
        gameEventTarget[func](GameEvent.BLOCK_TOGGLE_ACTIVE_BUSTER, this.onToogleActiveBuster, this);
    }

    private _initCollider(): void {
        this._collider = this.crossColliderNode.getComponent(BoxCollider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this._collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        this._collider.enabled = false;
    }

    private _setInitScale(): void {
        const { x, y, z } = this.node.scale;
        this._initScale = new Vec3(x, y, z);
    }

    private _checkBottomCell(): void {
        if (this._isBottomCellEmpty()) this._moveToBotCell();
    }

    private _isBottomCellEmpty(): boolean {
        return !this.isDestroyed && !this.isMoving && this._bottomCell?.isEmpty;
    }

    private _moveToBotCell(): void {
        this._moveTween(this._bottomCell.node.position);
        gameEventTarget.emit(GameEvent.SET_CELL_EMPTY, true, this.row, this.col);
        gameEventTarget.emit(GameEvent.SET_CELL_EMPTY, false, this.row - 1, this.col);
        this.row = this._bottomCell.row;
        this._bottomCell = null;
        this._sameColorNearbyBlocks = [];
    }

    private _moveTween(targetPosition: Vec3): void {
        this.isMoving = true;
        this._collider.enabled = false;
        this.crossColliderNode.position = Vec3.ZERO;

        const duration: number = this._isFirstInit ? this.initMoveTweenDuration : this.moveToBotCellTweenDuration;
        const options: ITweenOption = {
            onComplete: () => {
                this.isMoving = false;
                this.crossColliderNode.position = Vec3.ZERO;
                this._collider.enabled = true;
            },
        }

        tween(this.node)
            .to(duration, { position: targetPosition }, options)
            .start();
    }
    
    private _resetColor(): void {
        this.setNewColor();
        this._resetSameColorNearbyBlocks();
    }

    private _resetSameColorNearbyBlocks(): void {
        this._collider.enabled = false;
        this._sameColorNearbyBlocks = [];
        this._collider.enabled = true;
    }

    private _setNearbyBlock(nearbyBlock: Block): void {
        if (nearbyBlock.blockType !== this.blockType) return;
        this._sameColorNearbyBlocks.push(nearbyBlock);
    }

    private _updateNearbyBlocks(): void {
        this._sameColorNearbyBlocks = this._sameColorNearbyBlocks.filter(block => !block.isDestroyed && !block.isMoving);
    }

    private _checkSameColorNearbyBlocks(): void {
        const isNoMatch: boolean = this._sameColorNearbyBlocks.length === 0;
        gameEventTarget.emit(GameEvent.SET_CELL_MATCH, isNoMatch, this.row, this.col);
    }

    private _toggleActiveBuster(busterType: number): void {
        this._activeBuster = this._activeBuster === busterType ? BusterType.None : busterType;
        this._animation.stop();
        this.node.setScale(this._initScale);

        switch (this._activeBuster) {
            case BusterType.Bomb:
                this._animation.play(AnimationClip.Pulse);
                break;

            default:
                break;
        }
    }

    private _isActiveBuster(): boolean {
        switch (this._activeBuster) {
            case BusterType.Bomb:
                gameEventTarget.emit(GameEvent.BLOCK_TOGGLE_ACTIVE_BUSTER, BusterType.None);
                gameEventTarget.emit(GameEvent.BUSTER_ACTIVATE, BusterType.Bomb, this);
                return true;
        
            default:
                return false;;
        }
    }
	//#endregion

	//#region event handlers
    public onClick(): void {
        if (this._isActiveBuster()) return;
        if (this._sameColorNearbyBlocks.length !== 0) this.destroyBlock();
    }

    public onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const otherBlock = otherCollider.node.parent.getComponent(Block);
        otherBlock && this._setNearbyBlock(otherBlock);
        this._checkSameColorNearbyBlocks();
        if (this.row === 0) return;

        const cell = otherCollider.node.getComponent(Cell);
        if (cell?.row === this.row - 1) this._bottomCell = cell;
    }

    public onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (this.isDestroyed || this.isMoving) return;
        this._updateNearbyBlocks();
        this._checkSameColorNearbyBlocks();
    }
    
    public onDestructionAnimationEnd(): void {
        gameEventTarget.emit(GameEvent.SET_CELL_EMPTY, true, this.row, this.col);
        this.node.active = false;
    }

    public onResetColor(): void {
        this._resetColor();
    }

    public onToogleActiveBuster(busterType: number): void {
        this._toggleActiveBuster(busterType);
    }
    //#endregion
}

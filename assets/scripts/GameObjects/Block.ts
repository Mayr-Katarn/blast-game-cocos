import { log, _decorator, Component, Node, SpriteFrame, BoxCollider2D, Sprite, math, Collider2D, IPhysics2DContact, Vec3, Contact2DType, tween, ITweenOption, Animation, Color } from 'cc';
import { eventTarget, GameEvent } from '../Enums/GameEvents';
import BlockType from '../Enums/BlockType';
import Cell from './Cell';

//#region classes-helpers
const { ccclass, property, menu, executeInEditMode } = _decorator;

@ccclass('BlockColor')
class BlockColor {
    @property({ type: SpriteFrame })
    public blockSprite: SpriteFrame = null;

    @property({ type: BlockType })
    public color: number = BlockType.Blue;
}

enum AnimationClip {
    Destroy = 'block-destruction',
}
//#endregion

@ccclass('Block')
@menu('GO/Block')
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
    protected toBotCellMoveTweenDuration: number = 0.1;

    @property({ type: [BlockColor] })
    protected blockColors: BlockColor[] = [];
    //#endregion

    //#region public fields and properties
    public blockType: number;
    public row: number;
    public col: number;
    public isDestroyed: boolean = false;
    public isMoving: boolean = false;
    public _sameColorNearbyBlocks: Block[] = [];
    //#endregion

    //#region private fields and properties
    private _collider: BoxCollider2D;
    private _animation: Animation;
    private _maxActiveColors: number = 2;
    private _bottomCell: Cell;
    private _isFirstInit: boolean = true;
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
        // this._updateSiblingIndex();
    }

    public init(
        position: Vec3,
        targetPosition: Vec3,
        row: number,
        col: number,
        maxActiveColors: number,
        cellsSum: number
    ): void {
        // log(position, targetPosition)
        this._maxActiveColors = maxActiveColors > this.blockColors.length ? this.blockColors.length : maxActiveColors;
        this.row = row;
        this.col = col;
        this._sameColorNearbyBlocks = [];
        this.isDestroyed = false;
        this._bottomCell = null;
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

    public onClick(): void {
        console.log("CLICK", this.row, this.col, this._sameColorNearbyBlocks);
        if (this._sameColorNearbyBlocks.length !== 0) this.destroyBlock();
    }

    public destroyBlock(firstBlock: Block = this) {
        // TODO счет
        this.isDestroyed = true;
        eventTarget.emit(GameEvent.SET_BLOCK_IN_CHAIN, firstBlock, this)
        this._sameColorNearbyBlocks.forEach(block => !block.isDestroyed && block.destroyBlock(firstBlock));
        this._sameColorNearbyBlocks = [];
        this._animation.play(AnimationClip.Destroy);
    }
	//#endregion

	//#region private methods
    private _eventListener(isOn: boolean) {
        const func: string = isOn ? "on" : "off";
        eventTarget[func](GameEvent.RESET_BLOCK_COLOR, this.onResetColor, this);
    }

    private _initCollider(): void {
        this._collider = this.crossColliderNode.getComponent(BoxCollider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this._collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        this._collider.enabled = false;
    }

    private _checkBottomCell(): void {
        if (this._isBottomCellEmpty()) this._moveToBotCell();
    }

    private _isBottomCellEmpty(): boolean {
        return !this.isDestroyed && !this.isMoving && this._bottomCell?.isEmpty;
    }

    private _moveTween(targetPosition: Vec3): void {
        this.isMoving = true;
        this._collider.enabled = false;
        this.crossColliderNode.position = Vec3.ZERO;

        const duration: number = this._isFirstInit ? this.initMoveTweenDuration : this.toBotCellMoveTweenDuration;
        const options: ITweenOption = {
            onComplete: () => {
                this.isMoving = false;
                this.crossColliderNode.position = Vec3.ZERO;
                this._collider.enabled = true;
            },
        }

        tween(this.node).to(
            duration,
            { position: targetPosition },
            options
        ).start();
    }

    private _moveToBotCell() {
        this._moveTween(this._bottomCell.node.position);
        eventTarget.emit(GameEvent.SET_CELL_EMPTY, true, this.row, this.col);
        eventTarget.emit(GameEvent.SET_CELL_EMPTY, false, this.row - 1, this.col);
        this.row = this._bottomCell.row;
        this._bottomCell = null;
        this._sameColorNearbyBlocks = [];
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

    private _setNearbyBlock(nearbyBlock: Block) {
        if (nearbyBlock.blockType !== this.blockType) return;

        this._sameColorNearbyBlocks.push(nearbyBlock);

        // if (this.row === 1 && this.col === 1) {
            // log('add', this.sameColorNearbyBlocks)
        // }
    }

    private _updateNearbyBlocks(): void {
        this._sameColorNearbyBlocks = this._sameColorNearbyBlocks.filter(block => !block.isDestroyed && !block.isMoving);
        // log('upd', this.sameColorNearbyBlocks)
    }

    private _checkSameColorNearbyBlocks() {
        const isNoMatch: boolean = this._sameColorNearbyBlocks.length === 0;
        eventTarget.emit(GameEvent.SET_CELL_MATCH, isNoMatch, this.row, this.col);
    }
	//#endregion

	//#region event handlers
    public onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const otherBlock = otherCollider.node.parent.getComponent(Block);
        otherBlock && this._setNearbyBlock(otherBlock);
        this._checkSameColorNearbyBlocks();

        if (this.row === 0) return;

        const cell = otherCollider.node.getComponent(Cell);
        if (cell?.row === this.row - 1) {
            this._bottomCell = cell;
            // console.log(`${this.row}-${this.col} | ${cell.row}-${cell.col}`)
        }

        // console.log('onBeginContact', otherCollider.node.name, block1, block2);
        // console.log(`
        //     onBeginContact\n
        //     ${selfCollider.node.name} ${block1.row} - ${block1.col}\n
        //     ${otherCollider.node.name} ${block2.row} - ${block2.col}
        // `);
    }

    public onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (this.isDestroyed || this.isMoving) return;
        // const otherBlock = otherCollider.node.parent.getComponent(Block);
        this._updateNearbyBlocks();
        this._checkSameColorNearbyBlocks();
    }
    
    public onDestructionAnimationEnd(): void {
        eventTarget.emit(GameEvent.SET_CELL_EMPTY, true, this.row, this.col);
        this.node.active = false;
    }

    public onResetColor(): void {
        this._resetColor();
    }
    //#endregion
}

// Отсутствует декомпозиция игровых сущностей
// Нет разделения логики и представления
// Магические константы в коде
// Неоптимальная реализация поиска смежных тайлов, присутствует линейный перебор просмотренных тайлов и близжайших по ключу
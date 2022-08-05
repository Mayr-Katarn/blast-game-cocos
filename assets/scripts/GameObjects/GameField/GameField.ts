import { log, _decorator, Component, Enum, Node, Prefab, Vec2, UITransform, math, CCInteger, PhysicsSystem2D, EPhysics2DDrawFlags, Vec3, instantiate, Widget } from 'cc';
import { GameEvent, gameEventTarget } from '../../EventEnums/GameEvents';
import Pool from '../../Pool/Pool';
import Block from './Block';
import Cell from './Cell';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;
//#endregion

@ccclass('GameField')
@menu('GameObjects/GameField/GameField')
export default class GameField extends Component {

    //#region editors fields and properties    
    @property({ type: Prefab, tooltip: "Префаб ячейки" })
    protected cellPrefab: Prefab = null;
    
    @property({ type: Node, tooltip: "Родительская нода для ячеек" })
    protected cellsNode: Node = null;
    
    @property({ tooltip: "Размер ячейки" })
    protected cellSize: Vec2 = new Vec2();
    
    @property({ type: Prefab, tooltip: "Префаб блока" })
    protected blockPrefab: Prefab = null;
    
    @property({ type: Node, tooltip: "Нода рендера - спрайта поля" })
    protected renderNode: Node = null;

    @property({ tooltip: "Дополнительный размер маски к размеру поля" })
    protected extraRenderSize: Vec2 = new Vec2();

    @property({ type: Node, tooltip: "Нода маски. Является робительской для блоков" })
    protected maskNode: Node = null;

    @property({ tooltip: "Дополнительный размер маски к размеру поля" })
    protected extraMaskSize: Vec2 = new Vec2();

    @property({ tooltip: "Частота срабатывания проверки поля на наличие совпадений" })
    protected noMatchCheckFieldDelay: number = 1;
    //#endregion

    //#region public fields and properties
    //#endregion

    //#region private fields and properties
    private _fieldSizeInCells: Vec2;
    private _maxActiveColors: number = 2
    private _startPosition: Vec2;
    private _blockInitY: number;
    private _cells: Cell[][] = [];
    private _blockPool: Pool<Block>;
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this._eventListener(true);
    }

    public onDisable(): void {
        this._eventListener(false);
    }

    public update(): void {
        this._checkEmptyCells();
    }
    //#endregion

    //#region public methods
    public init(fieldSizeInCells: Vec2, maxActiveColors: number): void {
        this.getComponent(Widget).updateAlignment();
        this._fieldSizeInCells = fieldSizeInCells;
        this._maxActiveColors = maxActiveColors;
        this._setFieldSizeAndStartPosition();
        this._createCells();
        this._createBlockPool();
        this._initBlocks();
        this._initFieldMatchCheck();
    }
	//#endregion

	//#region private methods
    private _eventListener(isOn: boolean) {
        const func: string = isOn ? "on" : "off";
        gameEventTarget[func](GameEvent.SET_CELL_EMPTY, this.onSetCellEmpty, this)
        gameEventTarget[func](GameEvent.SET_CELL_MATCH, this.onSetCellNoMatch, this)
    }

    private _setFieldSizeAndStartPosition(): void {
        this._fieldSizeInCells = new Vec2(Math.round(this._fieldSizeInCells.x), Math.round(this._fieldSizeInCells.y));
        const fieldSize: math.Size = new math.Size(this._fieldSizeInCells.x * this.cellSize.x, this._fieldSizeInCells.y * this.cellSize.y);
        const maskSize: math.Size = new math.Size(fieldSize.width + this.extraMaskSize.x, fieldSize.height + this.extraMaskSize.y);
        const renderSize: math.Size = new math.Size(fieldSize.width + this.extraRenderSize.x, fieldSize.height + this.extraRenderSize.y);
        const transform: UITransform = this.getComponent(UITransform);
        const maskTransform: UITransform = this.maskNode.getComponent(UITransform);
        const renderTransform: UITransform = this.renderNode.getComponent(UITransform);

        transform.setContentSize(fieldSize);
        maskTransform.setContentSize(maskSize);
        renderTransform.setContentSize(renderSize);
        
        const startX: number = -fieldSize.width / 2 + (this.cellSize.x / 2);
        const startY: number = -fieldSize.height / 2 + (this.cellSize.y / 2);
        this._startPosition = new Vec2(startX, startY);
        this._blockInitY = fieldSize.height / 2 + this.cellSize.y;
    }

    private _createCells(): void {
        for (let row = 0; row < this._fieldSizeInCells.y; row++) {
            this._cells.push([]);

            for (let col = 0; col < this._fieldSizeInCells.x; col++) {
                this._createCell(row, col);
            }
        }
    }

    private _createCell(row: number, col: number): void {
        const x: number = this._startPosition.x + this.cellSize.x * col;
        const y: number = this._startPosition.y + this.cellSize.y * row;
        const position: Vec3 = new Vec3(x, y, this.node.position.z);
        const cellNode: Node = instantiate(this.cellPrefab);
        const cell: Cell = cellNode.getComponent(Cell);
        cellNode.setParent(this.cellsNode);
        cell.init(position, row, col);
        this._cells[row].push(cell);
    }

    private _createBlockPool(): void {
        this._blockPool = new Pool<Block>(this.blockPrefab, new Block, 4, this.maskNode);
        log(this._blockPool)
    }

    private _initBlocks(): void {
        this._cells.forEach(rowCells => {
            rowCells.forEach(cell => {
                const block: Block = this._blockPool.getFreeActor(true, true);
                this._initBlock(block, cell);
            });
        });
    }

    private _initBlock(block: Block, cell: Cell): void {
        const { x, y } = cell.node.position;
        const { row, col } = cell;
        const startPosition: Vec3 = new Vec3(x, this._blockInitY, 0);
        const cellPosition: Vec3 = new Vec3(x, y, 0);
        const cellsSum: number = this._fieldSizeInCells.x * this._fieldSizeInCells.y;
        block.init(startPosition, cellPosition, row, col, this._maxActiveColors, cellsSum);
        cell.isEmpty = false;
    }

    private _initFieldMatchCheck(): void {
        this.schedule(() => {
            const isNoMatch: boolean = this._cells.every(row => row.every(col => col.isNoMatch && !col.isEmpty));
            if (isNoMatch) this._resetBlockColors();
        }, this.noMatchCheckFieldDelay);
    }

    private _resetBlockColors(): void {
        console.log('NO MATCH!!!!!------');
        this.unscheduleAllCallbacks();
        gameEventTarget.emit(GameEvent.RESET_BLOCK_COLOR);
        this._initFieldMatchCheck();
    }

    private _checkEmptyCells(): void {
        const topRow: Cell[] = this._cells[this._fieldSizeInCells.y - 1].filter(cell => cell.isEmpty);
        if (topRow.length === 0) return;

        topRow.forEach(cell => {
            const block: Block = this._blockPool.getFreeActor(false, true);
            block && this._initBlock(block, cell);
        })
    }
	//#endregion

	//#region event handlers
    public onSetCellEmpty(isEmpty: boolean, row: number, col: number): void {
        this._cells[row][col].isEmpty = isEmpty;
    }

    public onSetCellNoMatch(isNoMatch: boolean, row: number, col: number): void {
        this._cells[row][col].isNoMatch = isNoMatch;
    }
    //#endregion
}
import { log, _decorator, Component, Enum, Node, Vec2, Prefab, CCInteger, instantiate, Vec3 } from 'cc';
import { eventTarget, GameEvent } from '../../Enums/GameEvents';
import Block from '../../GameObjects/Block';
import GameField from '../../GameObjects/GameField';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;

interface IBlockChain {
    [key: number]: Block[]
}
//#endregion

@ccclass('GameManager')
@menu('Managers/GameManager')
export default class GameManager extends Component {

    //#region editors fields and properties
    @property({ type: Node, tooltip: "Корневая родительская нода" })
    protected rootNode: Node = null;

    @property({ type: Prefab, tooltip: "Префаб поля" })
    protected gameFieldPrefab: Prefab = null;

    @property({ tooltip: "Размер поля в ячейках" })
    protected fieldSizeInCells: Vec2 = new Vec2();

    @property({ type: CCInteger, min: 2, tooltip: "Максимальное количество используемых цветов для блоков"})
    protected maxActiveColors: number = 2;

    @property({ type: CCInteger, min: 1, tooltip: "Максимальное количество возможных сбросов поля до проигрыша"})
    protected maxResetFieldTimes: number = 3;

    @property({ type: CCInteger, min: 1, tooltip: "Количество ходов игрока"})
    protected playerTurns: number = 30;

    @property({ type: CCInteger, min: 1, tooltip: "Количество очков за один разрушенный блок"})
    protected playerScoreForBlock: number = 100;

    @property({ type: CCInteger, min: 100, tooltip: "Количество очков, необходимых для победы игрока"})
    protected playerTargetScore: number = 10000;
    //#endregion

    //#region private fields and properties
    private _playerScore: number = 0;
    private _blockChains: IBlockChain = {};
    private _resetFieldTimes: number = 0;
    //#endregion
        
    //#region public fields and properties
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this._eventListener(true);
    }

    public onDisable(): void {
        this._eventListener(false);
    }

    public start(): void {
        const gameField: Node = instantiate(this.gameFieldPrefab);
        gameField.parent = this.rootNode;
        gameField.setPosition(Vec3.ZERO);
        gameField.getComponent(GameField).init(this.fieldSizeInCells, this.maxActiveColors);
    }

    public update(): void {
        this._checkChains();
    }
    //#endregion

    //#region public methods
	//#endregion

	//#region private methods
    private _eventListener(isOn: boolean): void {
        const func: string = isOn ? "on" : "off";
        eventTarget[func](GameEvent.RESET_FIELD, this.onResetField, this)
        eventTarget[func](GameEvent.SET_BLOCK_IN_CHAIN, this.onSetBlockInChain, this)
    }

    private _checkChains(): void {
        const chains: string[] = Object.keys(this._blockChains);
        chains.forEach(chain => {
            if (this._blockChains[chain].length !== 0 && this._blockChains[chain].every((block: Block) => !block.node.active)){
                this._calcPlayerPoints(this._blockChains[chain].length)
                this._blockChains[chain] = [];
                // console.log(this._blockChains);
            }
        })
    }

    private _calcPlayerPoints(blockSum: number): void {
        const score: number = blockSum * this.playerScoreForBlock;
        this._playerScore += score;
        const percentageCompleted: number = this._playerScore / this.playerTargetScore * 100;
        console.log(score, percentageCompleted);
        eventTarget.emit(GameEvent.SET_PROGRESS, percentageCompleted);

        if (this._playerScore >= this.playerTargetScore){
            this._win();
        }
    }

    private _resetField(): void {
        this._resetFieldTimes++;
        if (this._resetFieldTimes >= this.maxResetFieldTimes) {
            this._gameOver();
        }
    }
    
    private _setBlockInChain(firstBlock: Block, block: Block): void {
        const id: string = `${firstBlock.row}${firstBlock.col}`;
        if (!this._blockChains[id]) {
            this._blockChains[id] = [];
        }

        this._blockChains[id].push(block)
        // log(this._blockChains)
    }

    private _win(): void {
        log("WIN")
    }

    private _gameOver(): void {
        log("GAME OVER")
    }
	//#endregion

	//#region event handlers
    public onResetField(): void {
        this._resetField();
    }

    public onSetBlockInChain(block: Block, firstBlock: Block): void {
        this._setBlockInChain(block, firstBlock);
    }
    //#endregion
}
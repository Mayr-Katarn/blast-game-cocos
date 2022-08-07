import { log, _decorator, Component, Enum, Node, Vec2, Prefab, CCInteger, instantiate, Vec3, View } from 'cc';
import { gameEventTarget, GameEvent } from '../../EventEnums/GameEvents';
import { UiEvent, uiEventTarget } from '../../EventEnums/UiEvents';
import Block from '../../GameObjects/GameField/Block';
import GameField from '../../GameObjects/GameField/GameField';

//#region classes-helpers
const { ccclass, property, menu } = _decorator;

interface IBlockChain {
    [key: number]: Block[]
}

const GameOverState = Enum({
    None: 0,
    Win: 1,
    Lose: 2
})
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

    //#region public fields and properties
    //#endregion

    //#region private fields and properties
    private _playerScore: number = 0;
    private _blockChains: IBlockChain = {};
    private _resetFieldTimes: number = 0;
    private _gameOverState: number = GameOverState.None;
    //#endregion

	//#region life-cycle callbacks
    public onEnable(): void {
        this._eventListener(true);
    }

    public onDisable(): void {
        this._eventListener(false);
    }

    public start(): void {
        this._createGameField();
        uiEventTarget.emit(UiEvent.SET_TURNS, this.playerTurns);
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
        gameEventTarget[func](GameEvent.RESET_FIELD, this.onResetField, this);
        gameEventTarget[func](GameEvent.SET_BLOCK_IN_CHAIN, this.onSetBlockInChain, this);
        gameEventTarget[func](GameEvent.ADD_SCORE, this.onAddScore, this);
        gameEventTarget[func](GameEvent.MADE_TURN, this.onMadeTurn, this);
    }

    private _createGameField(): void {
        const gameField: Node = instantiate(this.gameFieldPrefab);
        gameField.setParent(this.rootNode);
        gameField.setPosition(Vec3.ZERO);
        gameField.getComponent(GameField).init(this.fieldSizeInCells, this.maxActiveColors);
    }

    private _checkChains(): void {
        const chains: string[] = Object.keys(this._blockChains);
        chains.forEach(chain => {
            if (this._blockChains[chain].length !== 0 && this._blockChains[chain].every((block: Block) => !block.node.active)) {
                const score: number = this._calcScore(this._blockChains[chain].length);
                const firstBlockWorldPosition = this._blockChains[chain][0].node.worldPosition;

                this._sendFlyAwayText(firstBlockWorldPosition, score);
                this._updatePlayerScore(score);
                this._madeTurn();
                this._blockChains[chain] = [];
            }
        })
    }

    private _updatePlayerScore(score: number): void {
        this._playerScore += score;
        const percentageCompleted: number = this._playerScore / this.playerTargetScore * 100;
        uiEventTarget.emit(UiEvent.SET_PROGRESS, percentageCompleted);
        uiEventTarget.emit(UiEvent.SET_PLAYER_SCORE, this._playerScore);

        console.log(score, percentageCompleted);

        if (this._playerScore >= this.playerTargetScore) {
            this._win();
        }
    }

    private _calcScore(blockSum: number): number {
        return blockSum * this.playerScoreForBlock;
    }

    private _sendFlyAwayText(worldPosition: Vec3, score: number): void {
        const text: string = `+${score}`;
        uiEventTarget.emit(UiEvent.FLY_AWAY_TEXT, worldPosition, text);
    }

    private _madeTurn(): void {
        this.playerTurns--;
        uiEventTarget.emit(UiEvent.SET_TURNS, this.playerTurns);
        if (this.playerTurns <= 0) {
            this._lose();
        }
    }

    private _resetField(): void {
        this._resetFieldTimes++;
        if (this._resetFieldTimes >= this.maxResetFieldTimes) {
            this._lose();
        }
    }
    
    private _setBlockInChain(firstBlock: Block, block: Block): void {
        const id: string = `${firstBlock.row}${firstBlock.col}`;
        if (!this._blockChains[id]) {
            this._blockChains[id] = [];
        }

        this._blockChains[id].push(block)
    }

    private _win(): void {
        if (this._gameOverState === GameOverState.None) {
            this._gameOverState = GameOverState.Win;
            log("WIN")
        }
    }

    private _lose(): void {
        if (this._gameOverState === GameOverState.None) {
            this._gameOverState = GameOverState.Lose;
            log("GAME OVER")
        }
    }
	//#endregion

	//#region event handlers
    public onResetField(): void {
        this._resetField();
    }

    public onSetBlockInChain(block: Block, firstBlock: Block): void {
        this._setBlockInChain(block, firstBlock);
    }

    public onAddScore(firstBlockWorldPosition: Vec3, blockSum: number): void {
        const score: number = this._calcScore(blockSum);
        this._sendFlyAwayText(firstBlockWorldPosition, score);
        this._updatePlayerScore(score);
    }

    public onMadeTurn(): void {
        this._madeTurn();
    }
    //#endregion
}
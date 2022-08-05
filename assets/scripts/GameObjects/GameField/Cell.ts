import { _decorator, Component, Vec3 } from 'cc';

//#region classes-helpers
const { ccclass, property, menu, executeInEditMode } = _decorator;
//#endregion

@ccclass('Cell')
@menu('GameObjects/GameField/Cell')
@executeInEditMode(true)
export default class Cell extends Component {

    //#region editors fields and properties
    //#endregion

    //#region public fields and properties
    public row: number;
    public col: number;
    public isEmpty: boolean = false;
    public isNoMatch: boolean = false;
    //#endregion

    //#region private fields and properties
    //#endregion

	//#region life-cycle callbacks
    //#endregion

    //#region public methods
    public init(
        position: Vec3,
        row: number,
        col: number
    ): void {
        this.node.position = position;
        this.row = row;
        this.col = col;
    }
	//#endregion

	//#region private methods
	//#endregion

	//#region event handlers
    //#endregion
}
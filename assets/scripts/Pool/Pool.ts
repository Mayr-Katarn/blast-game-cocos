import { log, _decorator, Component, Enum, Node, Prefab, Vec2, instantiate } from 'cc';

export default class Pool<T extends Component> {
    constructor(prefab: Prefab, component: T, size: number, parent: Node) {
        this.prefab = prefab;
        this.parent = parent;
        this._component = component;
        this._createPool(size);
        console.log(this._pool);
    }

    public prefab: Prefab;
    public parent: Node;
    private _component: T;
    protected _pool: T[];

    private _createPool(size: number): void {
        this._pool = [];
        for (let i = 0; i < size; i++) this._createActor();
    }

    private _createActor(isActive: boolean = false) {
        const node: Node = instantiate(this.prefab);
        node.parent = this.parent;
        node.active = isActive;
        
        const actor: T = node.getComponent(this._component.name) as T;
        this._pool.push(actor);
        return actor;
    }

    public getFreeActor(isCreateForced: boolean = false, isActive: boolean = false): T {
        const actor: T = this._pool.find(actor => !actor.node.active);

        if (actor) {
            actor.node.active = isActive;
            return actor;
        }

        if (isCreateForced) return this._createActor(isActive);

        return null;
    }
}

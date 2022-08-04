import { Prefab, Node, Component } from "cc";
import Block from "../GameObjects/Block";
import Pool from "./Pool";

export default class BlockPool extends Pool<Block> {
    constructor(prefab: Prefab, component: Block, size: number, parent: Node) {
        super(prefab, component, size, parent);
    }
    
}
import { Enum, EventTarget } from "cc";

export const eventTarget = new EventTarget();
export enum GameEvent {
    NONE,
    
    // Input
    INPUT,

    // Game manager
    RESET_FIELD,
    SET_BLOCK_IN_CHAIN,

    // GameFIeld
    SET_CELL_EMPTY,
    SET_CELL_MATCH,

    // Block
    RESET_BLOCK_COLOR,

    // Ui
    SET_PROGRESS
}
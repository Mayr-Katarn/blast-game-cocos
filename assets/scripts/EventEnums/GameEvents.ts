import { Enum, EventTarget } from "cc";

export const gameEventTarget = new EventTarget();
export enum GameEvent {
    NONE,

    // Input
    INPUT,

    // Game manager
    RESET_FIELD,
    SET_BLOCK_IN_CHAIN,
    ADD_SCORE,
    MADE_TURN,

    // GameFIeld
    SET_CELL_EMPTY,
    SET_CELL_MATCH,

    // Block
    RESET_BLOCK_COLOR,
    TOGGLE_ACTIVE_BUSTER,
    ACTIVATE_BUSTER
}
import { Enum, EventTarget } from "cc";

export const gameEventTarget = new EventTarget();
export enum GameEvent {
    NONE,

    // Input
    INPUT,
    TOGGLE_INPUT_MANAGER,

    // Game manager
    RESET_FIELD,
    SET_BLOCK_IN_CHAIN,
    ADD_SCORE,
    MADE_TURN,

    // GameFIeld
    SET_CELL_EMPTY,
    SET_CELL_MATCH,

    // Block
    BLOCK_RESET_COLOR,
    BLOCK_TOGGLE_ACTIVE_BUSTER,

    // Buster
    BUSTER_ACTIVATE,
}
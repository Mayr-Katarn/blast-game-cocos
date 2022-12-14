import { Enum, EventTarget } from "cc";

export const uiEventTarget = new EventTarget();
export enum UiEvent {
    NONE,

    // Ui
    SET_PROGRESS,
    SET_TURNS,
    SET_PLAYER_SCORE,
    SET_FULL_SCREEN_MESSAGE,
    
    // Effects
    FLY_AWAY_TEXT,
}
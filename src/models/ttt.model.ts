
export const SquareValues = {
    X: 'X',
    O: 'O',
    None: null,
} as const;

export type SquareValue = typeof SquareValues[keyof typeof SquareValues];

export const PlayerModes = {
    TwoPlayer: 'two-player',
    AI: 'ai',
} as const;

export type PlayerMode = typeof PlayerModes[keyof typeof PlayerModes];

export const AIDifficulties = {
    Easy: 'easy',
    Medium: 'medium',
    Hard: 'hard',
} as const;

export type AIDifficulty = typeof AIDifficulties[keyof typeof AIDifficulties];


export interface GameState {
    boardSize: number;
    history: SquareValue[][];
    currentMove: number;
    isAscending: boolean;
    isPlaying: boolean;
    playerMode: PlayerMode;
    aiDifficulty: AIDifficulty
    stats: { X: number; O: number; draw: number };
    showStats: boolean;
    xIsNext: boolean;
    currentSquares: SquareValue[];
    winner: SquareValue | null;
    status: string;
}

export interface GameActions {
    handleSquareClick: (idx: number) => void;
    jumpTo: (move: number) => void;
    newGame: () => void;
    toggleSortOrder: () => void;
    togglePlayerMode: () => void;
    toggleStats: () => void;
    changeBoardSize: (size: number) => void;
    changeAIDifficulty: (difficulty: AIDifficulty) => void;
}

export interface GameContextType extends GameState, GameActions {}
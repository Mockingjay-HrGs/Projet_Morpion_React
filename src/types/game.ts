export type PlayerSymbol = 'X' | 'O';
export type CellValue = PlayerSymbol | null;

export type GameVariant = 'classic' | 'three-moves';
export type OpponentType = 'cpu' | 'local';

export interface PlayerInfo {
    name: string;
    isCPU: boolean;
    symbol: PlayerSymbol;
}

export interface MoveOrder {
    X: number[];
    O: number[];
}

export interface RoundWins {
    X: number;
    O: number;
    ties: number;
}

export interface GameState {
    variant: GameVariant;
    opponentType: OpponentType;
    players: Record<PlayerSymbol, PlayerInfo>;
    board: CellValue[];
    currentPlayer: PlayerSymbol;
    isFinished: boolean;
    winner: PlayerSymbol | 'tie' | null;
    moveOrder: MoveOrder;
    streak: Streak;
    roundWins: RoundWins;
}


export interface Streak {
    wins: number;
    ties: number;
}

export interface GameState {
    variant: GameVariant;
    opponentType: OpponentType;
    players: Record<PlayerSymbol, PlayerInfo>;
    board: CellValue[];          // 9 cases
    currentPlayer: PlayerSymbol;
    isFinished: boolean;
    winner: PlayerSymbol | 'tie' | null;
    moveOrder: MoveOrder;
    streak: Streak;
}

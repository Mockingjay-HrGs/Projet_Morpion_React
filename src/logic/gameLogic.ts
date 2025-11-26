import type {
    CellValue,
    GameVariant,
    MoveOrder,
    PlayerSymbol,
    GameState,
    OpponentType,
} from '../types/game';

export const EMPTY_BOARD: CellValue[] = Array(9).fill(null);

const WINNING_LINES: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function checkWinner(board: CellValue[]) {
    for (const [a, b, c] of WINNING_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: [a, b, c] as [number, number, number] };
        }
    }
    if (board.every((cell) => cell !== null)) {
        return { winner: 'tie' as const, line: [] as number[] };
    }
    return { winner: null, line: [] as number[] };
}

export function playMove(
    variant: GameVariant,
    board: CellValue[],
    moveOrder: MoveOrder,
    index: number,
    player: PlayerSymbol,
): { board: CellValue[]; moveOrder: MoveOrder } {
    if (board[index] !== null) return { board, moveOrder };

    if (variant === 'classic') {
        const newBoard = [...board];
        newBoard[index] = player;
        return { board: newBoard, moveOrder };
    }

    const newBoard = [...board];
    const newMoveOrder: MoveOrder = {
        X: [...moveOrder.X],
        O: [...moveOrder.O],
    };

    const playerMoves = newMoveOrder[player];

    if (playerMoves.length >= 3) {
        const firstIndex = playerMoves[0];
        newBoard[firstIndex] = null;
        playerMoves.shift();
    }

    newBoard[index] = player;
    playerMoves.push(index);

    return { board: newBoard, moveOrder: newMoveOrder };
}

export function createInitialGameState(params: {
    variant: GameVariant;
    opponentType: OpponentType;
    playerXName: string;
    playerOName: string;
}): GameState {
    const { variant, opponentType, playerXName, playerOName } = params;

    return {
        variant,
        opponentType,
        players: {
            X: {
                name: playerXName || 'Joueur 1',
                isCPU: false,
                symbol: 'X',
            },
            O: {
                name: opponentType === 'cpu' ? 'CPU' : playerOName || 'Joueur 2',
                isCPU: opponentType === 'cpu',
                symbol: 'O',
            },
        },
        board: [...EMPTY_BOARD],
        currentPlayer: 'X',
        isFinished: false,
        winner: null,
        moveOrder: { X: [], O: [] },
        streak: { wins: 0, ties: 0 },
        roundWins: { X: 0, O: 0, ties: 0 },
    };
}


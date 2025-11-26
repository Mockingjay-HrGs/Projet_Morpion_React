import type { CellValue, GameState, PlayerSymbol } from '../types/game';
import { checkWinner } from './gameLogic';

function getAvailableMoves(board: CellValue[]): number[] {
    return board
        .map((cell, index) => (cell === null ? index : -1))
        .filter((i) => i !== -1);
}

function getOpponent(player: PlayerSymbol): PlayerSymbol {
    return player === 'X' ? 'O' : 'X';
}

function getHeuristicMove(board: CellValue[], current: PlayerSymbol): number {
    const moves = getAvailableMoves(board);
    const opponent = getOpponent(current);

    // 1. Coup gagnant
    for (const idx of moves) {
        const newBoard = [...board];
        newBoard[idx] = current;
        const result = checkWinner(newBoard);
        if (result.winner === current) {
            return idx;
        }
    }

    // 2. Bloquer victoire adverse
    for (const idx of moves) {
        const newBoard = [...board];
        newBoard[idx] = opponent;
        const result = checkWinner(newBoard);
        if (result.winner === opponent) {
            return idx;
        }
    }

    // 3. Centre
    if (board[4] === null) return 4;

    // 4. Coin
    const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
    if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Sinon, random
    return moves[Math.floor(Math.random() * moves.length)];
}

export function getCpuMove(game: GameState): number | null {
    const { board, currentPlayer } = game;
    const moves = getAvailableMoves(board);
    if (moves.length === 0) return null;

    return getHeuristicMove(board, currentPlayer);
}

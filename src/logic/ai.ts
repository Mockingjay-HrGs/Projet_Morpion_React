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

function evaluateBoardFor(player: PlayerSymbol, board: CellValue[]): number {
    const result = checkWinner(board);

    if (result.winner === player) return 10;
    if (result.winner === getOpponent(player)) return -10;
    if (result.winner === 'tie') return 0;
    return 0;
}

function minimax(
    board: CellValue[],
    player: PlayerSymbol,
    current: PlayerSymbol,
    depth: number,
    isMaximizing: boolean,
): number {
    const score = evaluateBoardFor(player, board);
    const winnerInfo = checkWinner(board);

    if (winnerInfo.winner !== null || depth === 0) {
        return score;
    }

    const moves = getAvailableMoves(board);

    if (isMaximizing) {
        let best = -Infinity;
        for (const idx of moves) {
            const newBoard = [...board];
            newBoard[idx] = current;
            const value = minimax(
                newBoard,
                player,
                getOpponent(current),
                depth - 1,
                false,
            );
            if (value > best) best = value;
        }
        return best;
    } else {
        let best = Infinity;
        for (const idx of moves) {
            const newBoard = [...board];
            newBoard[idx] = current;
            const value = minimax(
                newBoard,
                player,
                getOpponent(current),
                depth - 1,
                true,
            );
            if (value < best) best = value;
        }
        return best;
    }
}

function getBestMoveClassic(board: CellValue[], cpuSymbol: PlayerSymbol): number {
    const moves = getAvailableMoves(board);

    if (moves.length === 9 && board.every((c) => c === null)) {
        return 4;
    }

    let bestScore = -Infinity;
    let bestMove = moves[0];

    for (const idx of moves) {
        const newBoard = [...board];
        newBoard[idx] = cpuSymbol;
        const score = minimax(
            newBoard,
            cpuSymbol,
            getOpponent(cpuSymbol),
            8,
            false,
        );
        if (score > bestScore) {
            bestScore = score;
            bestMove = idx;
        }
    }

    return bestMove;
}

function getHeuristicMoveThreeMoves(
    board: CellValue[],
    current: PlayerSymbol,
): number {
    const moves = getAvailableMoves(board);
    const opponent = getOpponent(current);

    // 1. Gagner si possible
    for (const idx of moves) {
        const newBoard = [...board];
        newBoard[idx] = current;
        const result = checkWinner(newBoard);
        if (result.winner === current) {
            return idx;
        }
    }

    // 2. Bloquer si l’adversaire peut gagner
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

    // 5. Sinon random
    return moves[Math.floor(Math.random() * moves.length)];
}

export function getCpuMove(game: GameState): number | null {
    const { board, currentPlayer, variant } = game;
    const moves = getAvailableMoves(board);
    if (moves.length === 0) return null;

    if (variant === 'classic') {
        return getBestMoveClassic(board, currentPlayer);
    }

    return getHeuristicMoveThreeMoves(board, currentPlayer);
}

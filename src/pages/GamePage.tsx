import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameState, PlayerSymbol } from '../types/game';
import { GameBoard } from '../components/game/GameBoard';
import { checkWinner, playMove, EMPTY_BOARD } from '../logic/gameLogic';
import { addEntryFromLostGame } from '../logic/leaderboard';
import { LogoXO } from '../components/ui/LogoXO';
import restartIcon from '../assets/icon-restart.svg';
import { SymbolX } from '../components/ui/SymbolX';
import { SymbolO } from '../components/ui/SymbolO';
import { getCpuMove } from '../logic/ai';


const CURRENT_GAME_KEY = 'morpion-current-game';

export function GamePage() {
    const navigate = useNavigate();
    const [game, setGame] = useState<GameState | null>(null);

    useEffect(() => {
        const stored = window.localStorage.getItem(CURRENT_GAME_KEY);
        if (!stored) {
            navigate('/');
            return;
        }
        const parsed: GameState = JSON.parse(stored);
        setGame(parsed);
    }, [navigate]);

    useEffect(() => {
        if (game) {
            window.localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(game));
        }
    }, [game]);

    // IA (CPU) //
    useEffect(() => {
        if (!game) return;
        if (game.isFinished) return;

        const current = game.players[game.currentPlayer];
        if (!current.isCPU) return;

        const timeout = setTimeout(() => {
            const moveIndex = getCpuMove(game);
            if (moveIndex === null) return;
            handlePlayerMove(moveIndex);
        }, 600);

        return () => clearTimeout(timeout);
    }, [game?.currentPlayer, game?.board, game?.isFinished]);


    if (!game) {
        return null;
    }

    const handlePlayerMove = (index: number) => {
        if (!game || game.isFinished) return;

        const { board: newBoard, moveOrder: newMoveOrder } = playMove(
            game.variant,
            game.board,
            game.moveOrder,
            index,
            game.currentPlayer,
        );

        if (newBoard === game.board) return;

        const { winner } = checkWinner(newBoard);

        const nextPlayer: PlayerSymbol =
            game.currentPlayer === 'X' ? 'O' : 'X';

        const updated: GameState = {
            ...game,
            board: newBoard,
            moveOrder: newMoveOrder,
            currentPlayer: nextPlayer,
            isFinished: false,
            winner: null,
        };

        if (winner) {
            updated.isFinished = true;
            updated.winner = winner;

            const newRoundWins = { ...game.roundWins };
            if (winner === 'X' || winner === 'O') {
                newRoundWins[winner] += 1;
            } else if (winner === 'tie') {
                newRoundWins.ties += 1;
            }
            updated.roundWins = newRoundWins;

            if (game.opponentType === 'cpu') {
                const humanSymbol: PlayerSymbol = game.players.X.isCPU ? 'O' : 'X';
                const cpuSymbol: PlayerSymbol = humanSymbol === 'X' ? 'O' : 'X';

                if (winner === humanSymbol) {
                    updated.streak = {
                        ...updated.streak,
                        wins: updated.streak.wins + 1,
                    };
                } else if (winner === 'tie') {
                    updated.streak = {
                        ...updated.streak,
                        ties: updated.streak.ties + 1,
                    };
                } else if (winner === cpuSymbol) {
                    addEntryFromLostGame(game);
                    updated.streak = { wins: 0, ties: 0 };
                }
            }
        }

        setGame(updated);
    };

    const handleNextRound = () => {
        if (!game) return;
        setGame({
            ...game,
            board: [...EMPTY_BOARD],
            moveOrder: { X: [], O: [] },
            currentPlayer: 'X',
            isFinished: false,
            winner: null,
        });
    };

    const handleQuit = () => {
        window.localStorage.removeItem(CURRENT_GAME_KEY);
        navigate('/');
    };

    const humanSymbol: PlayerSymbol = game.players.X.isCPU ? 'O' : 'X';
    const cpuSymbol: PlayerSymbol = humanSymbol === 'X' ? 'O' : 'X';

    const isHumanWinner = game.winner && game.winner === humanSymbol;
    const isCpuWinner = game.winner && game.winner === cpuSymbol;

    return (
        <section className="game">
            <header className="game__header">
                <LogoXO />

                <div className="game__turn-badge">
                    {game.currentPlayer === 'X' ? (
                        <SymbolX size={20} />
                    ) : (
                        <SymbolO size={20} />
                    )}
                    <span>TURN</span>
                </div>

                <button
                    type="button"
                    className="icon-button icon-button--restart"
                    onClick={handleNextRound}
                    aria-label="Recommencer la manche"
                >
                    <img src={restartIcon} alt="" draggable={false} />
                </button>
            </header>

            <GameBoard
                board={game.board}
                variant={game.variant}
                moveOrder={game.moveOrder}
                onCellClick={handlePlayerMove}
            />

            <div className="game__bottom-bar">
                <div className="score-card score-card--x">
          <span className="score-card__label">
            X ({game.players.X.isCPU ? 'CPU' : 'YOU'})
          </span>
                    <span className="score-card__value">
            {game.roundWins.X}
          </span>
                </div>

                <div className="score-card score-card--ties">
                    <span className="score-card__label">TIES</span>
                    <span className="score-card__value">
            {game.roundWins.ties}
          </span>
                </div>

                <div className="score-card score-card--o">
          <span className="score-card__label">
            O ({game.players.O.isCPU ? 'CPU' : 'YOU'})
          </span>
                    <span className="score-card__value">
            {game.roundWins.O}
          </span>
                </div>
            </div>

            {game.isFinished && (
                <div className="game__overlay">
                    <div className="game__modal">
                        {game.winner === 'tie' ? (
                            <>
                                <p className="game__modal-subtitle">ROUND TIED</p>
                                <div className="game__modal-main game__modal-main--tie">
                                    <span className="game__modal-text">NO WINNER</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="game__modal-subtitle">
                                    {isHumanWinner
                                        ? 'YOU WON!'
                                        : isCpuWinner
                                            ? 'CPU WON!'
                                            : 'ROUND END'}
                                </p>
                                <div className="game__modal-main">
                                    {game.winner === 'X' ? (
                                        <SymbolX size={52} />
                                    ) : (
                                        <SymbolO size={52} />
                                    )}
                                    <span className="game__modal-text">TAKES THE ROUND</span>
                                </div>
                            </>
                        )}

                        <div className="game__modal-actions">
                            <button
                                type="button"
                                className="btn btn--secondary-light"
                                onClick={handleQuit}
                            >
                                QUIT
                            </button>
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={handleNextRound}
                            >
                                NEXT ROUND
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

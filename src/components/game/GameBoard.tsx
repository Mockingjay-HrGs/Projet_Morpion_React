import type {CellValue, GameVariant, MoveOrder, PlayerSymbol,} from '../../types/game';
import { SymbolX } from '../ui/SymbolX';
import { SymbolO } from '../ui/SymbolO';

interface GameBoardProps {
    board: CellValue[];
    variant: GameVariant;
    moveOrder: MoveOrder;
    onCellClick: (index: number) => void;
}

export function GameBoard({
                              board,
                              variant,
                              moveOrder,
                              onCellClick,
                          }: GameBoardProps) {
    const nextToDisappear: Partial<Record<PlayerSymbol, number>> = {
        X: moveOrder.X[0],
        O: moveOrder.O[0],
    };

    return (
        <div className="board" role="grid" aria-label="Grille de morpion">
            {board.map((value, index) => {
                const willDisappear =
                    variant === 'three-moves' &&
                    value &&
                    nextToDisappear[value] === index;

                const classes =
                    'board__cell' +
                    (value ? ' board__cell--filled' : '') +
                    (willDisappear ? ' board__cell--will-disappear' : '');

                return (
                    <button
                        key={index}
                        type="button"
                        className={classes}
                        onClick={() => onCellClick(index)}
                        aria-label={
                            value ? `Case occupée par ${value}` : 'Case vide, jouer ici'
                        }
                    >
                        {value === 'X' && <SymbolX size={48} />}
                        {value === 'O' && <SymbolO size={48} />}
                    </button>
                );
            })}
        </div>
    );
}

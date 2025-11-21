import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { GameState } from '../../types/game';

const CURRENT_GAME_KEY = 'morpion-current-game';

export function Navbar() {
    const location = useLocation();
    const [hasOngoingGame, setHasOngoingGame] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(CURRENT_GAME_KEY);
            if (!stored) {
                setHasOngoingGame(false);
                return;
            }
            const game: GameState = JSON.parse(stored);
            setHasOngoingGame(!game.isFinished);
        } catch {
            setHasOngoingGame(false);
        }
    }, [location.pathname]);

    return (
        <header className="nav">
            <nav className="nav__content">
                <div className="nav__logo">XO</div>
                <ul className="nav__links">
                    <li>
                        <Link to="/">Accueil</Link>
                    </li>
                    <li>
                        <Link to="/leaderboard">Classement</Link>
                    </li>
                    {hasOngoingGame && (
                        <li>
                            <Link to="/game">Jeu</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

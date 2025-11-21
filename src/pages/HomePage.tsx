import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameVariant, OpponentType } from '../types/game';
import { createInitialGameState } from '../logic/gameLogic';

const CURRENT_GAME_KEY = 'morpion-current-game';

export function HomePage() {
    const navigate = useNavigate();

    const [variant, setVariant] = useState<GameVariant>('classic');
    const [opponentType, setOpponentType] = useState<OpponentType>('cpu');
    const [playerXName, setPlayerXName] = useState('');
    const [playerOName, setPlayerOName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (opponentType === 'cpu' && !playerXName.trim()) {
            setError('Un pseudo est requis pour jouer contre l’ordinateur.');
            return;
        }

        const gameState = createInitialGameState({
            variant,
            opponentType,
            playerXName: playerXName.trim(),
            playerOName: playerOName.trim(),
        });

        window.localStorage.setItem(CURRENT_GAME_KEY, JSON.stringify(gameState));
        navigate('/game');
    };

    const isCpu = opponentType === 'cpu';

    return (
        <section className="home">
            <div className="home__card">
                <header className="home__header">
                    <div className="home__logo">XO</div>
                    <div>
                        <h1 className="home__title">Morpion React</h1>
                        <p className="home__subtitle">
                            Choisissez votre mode et lancez une nouvelle partie.
                        </p>
                    </div>
                </header>

                <form className="home__form" onSubmit={handleSubmit}>
                    <div className="home__section">
                        <h2 className="home__section-title">Adversaire</h2>
                        <div className="home__segmented">
                            <button
                                type="button"
                                className={
                                    'home__segmented-btn' +
                                    (opponentType === 'cpu' ? ' home__segmented-btn--active' : '')
                                }
                                onClick={() => setOpponentType('cpu')}
                            >
                                VS CPU
                            </button>
                            <button
                                type="button"
                                className={
                                    'home__segmented-btn' +
                                    (opponentType === 'local'
                                        ? ' home__segmented-btn--active'
                                        : '')
                                }
                                onClick={() => setOpponentType('local')}
                            >
                                2 JOUEURS
                            </button>
                        </div>
                        <p className="home__hint">
                            {isCpu
                                ? 'Affrontez une IA simple qui joue de façon aléatoire.'
                                : 'Jouez à deux sur le même écran.'}
                        </p>
                    </div>
                    <div className="home__section home__section--opponent">
                        <h2 className="home__section-title">Variante</h2>
                        <div className="home__segmented home__segmented--wide">
                            <button
                                type="button"
                                className={
                                    'home__segmented-btn' +
                                    (variant === 'classic' ? ' home__segmented-btn--active' : '')
                                }
                                onClick={() => setVariant('classic')}
                            >
                                Classique
                            </button>
                            <button
                                type="button"
                                className={
                                    'home__segmented-btn' +
                                    (variant === 'three-moves'
                                        ? ' home__segmented-btn--active'
                                        : '')
                                }
                                onClick={() => setVariant('three-moves')}
                            >
                                3 coups
                            </button>
                        </div>
                        <p className="home__hint">
                            {variant === 'classic'
                                ? 'Le premier à aligner trois symboles gagne la manche.'
                                : 'Limité à 3 symboles : les anciens s’effacent.'}
                        </p>
                    </div>

                    <div className="home__section home__section--variant">
                        <h2 className="home__section-title">Joueurs</h2>

                        <label className="home__field">
              <span className="home__field-label">
                Pseudo Joueur 1 (X){' '}
                  {isCpu && <span className="home__field-required">*</span>}
              </span>
                            <input
                                type="text"
                                className="home__input"
                                value={playerXName}
                                onChange={(e) => setPlayerXName(e.target.value)}
                                placeholder="Votre pseudo"
                            />
                        </label>

                        {!isCpu && (
                            <label className="home__field">
                                <span className="home__field-label">Pseudo Joueur 2 (O)</span>
                                <input
                                    type="text"
                                    className="home__input"
                                    value={playerOName}
                                    onChange={(e) => setPlayerOName(e.target.value)}
                                    placeholder="Joueur 2 (optionnel)"
                                />
                            </label>
                        )}

                        {isCpu && (
                            <p className="home__info">

                                <strong> </strong>
                            </p>
                        )}

                        {error && <p className="home__error">{error}</p>}
                    </div>

                    <div className="home__summary">
                        <p>
                            <span>Mode sélectionné :</span>{' '}
                            <strong>
                                {variant === 'classic' ? 'Classique' : '3 coups'} ·{' '}
                                {isCpu ? 'VS CPU' : '2 joueurs'}
                            </strong>
                        </p>
                    </div>

                    <button type="submit" className="btn btn--primary home__submit">
                        Lancer la partie
                    </button>
                </form>
            </div>
        </section>
    );
}

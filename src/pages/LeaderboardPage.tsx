import { useState } from 'react';
import { getRankedLeaderboard, type RankedLeaderboardEntry } from '../logic/leaderboard';

export function LeaderboardPage() {
    const [entries] = useState<RankedLeaderboardEntry[]>(() => getRankedLeaderboard());

    return (
        <section className="leaderboard">
            <h1 className="leaderboard__title">Classement</h1>
            <p className="leaderboard__subtitle">
                Classement par nombre de victoires consécutives contre l’ordinateur.
            </p>

            {entries.length === 0 ? (
                <p className="leaderboard__empty">
                    Aucune partie enregistrée pour le moment. Lancez un défi contre le CPU !
                </p>
            ) : (
                <div className="leaderboard__table-wrapper">
                    <table className="leaderboard__table">
                        <thead>
                        <tr>
                            <th>Position</th>
                            <th>Joueur</th>
                            <th>Victoires consécutives</th>
                            <th>Égalités</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((entry) => (
                            <tr key={entry.id}>
                                <td>{entry.rank}</td>
                                <td>{entry.playerName}</td>
                                <td>{entry.wins}</td>
                                <td>{entry.ties}</td>
                                <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

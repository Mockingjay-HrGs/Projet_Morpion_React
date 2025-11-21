import type { GameState, PlayerSymbol } from '../types/game';

const LEADERBOARD_KEY = 'morpion-leaderboard';

export interface LeaderboardEntry {
    id: string;
    playerName: string;
    wins: number;
    ties: number;
    createdAt: string;
}

export interface RankedLeaderboardEntry extends LeaderboardEntry {
    rank: number;
}

function loadLeaderboard(): LeaderboardEntry[] {
    try {
        const stored = window.localStorage.getItem(LEADERBOARD_KEY);
        return stored ? (JSON.parse(stored) as LeaderboardEntry[]) : [];
    } catch {
        return [];
    }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
    try {
        window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    } catch {
        // ignore
    }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>) {
    const entries = loadLeaderboard();
    const newEntry: LeaderboardEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    entries.push(newEntry);
    saveLeaderboard(entries);
}

export function getRankedLeaderboard(): RankedLeaderboardEntry[] {
    const entries = loadLeaderboard();

    const sorted = [...entries].sort((a, b) => b.wins - a.wins);

    const ranked: RankedLeaderboardEntry[] = [];
    let currentRank = 0;
    let lastWins: number | null = null;

    sorted.forEach((entry, index) => {
        if (lastWins === null || entry.wins < lastWins) {
            currentRank = index + 1;
            lastWins = entry.wins;
        }
        ranked.push({ ...entry, rank: currentRank });
    });

    return ranked;
}

export function addEntryFromLostGame(game: GameState) {
    if (game.opponentType !== 'cpu') return;

    const humanSymbol: PlayerSymbol = game.players.X.isCPU ? 'O' : 'X';
    const human = game.players[humanSymbol];

    addLeaderboardEntry({
        playerName: human.name,
        wins: game.streak.wins,
        ties: game.streak.ties,
    });
}

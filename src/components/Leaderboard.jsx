import React, { useState } from 'react';

const Leaderboard = ({ leaderboardData = [], currentUserId = null }) => {
    const [timeframe, setTimeframe] = useState('week'); // week, month, allTime

    // Default leaderboard data
    const defaultData = [
        {
            id: 1,
            rank: 1,
            name: "Sarah Johnson",
            avatar: "SJ",
            points: 2850,
            streak: 45,
            badges: 12,
            change: 2
        },
        {
            id: 2,
            rank: 2,
            name: "Michael Chen",
            avatar: "MC",
            points: 2720,
            streak: 38,
            badges: 10,
            change: -1
        },
        {
            id: 3,
            rank: 3,
            name: "Emma Davis",
            avatar: "ED",
            points: 2650,
            streak: 42,
            badges: 11,
            change: 1
        },
        {
            id: 101,
            rank: 4,
            name: "You",
            avatar: "VU",
            points: 2480,
            streak: 28,
            badges: 8,
            change: 3,
            isCurrentUser: true
        },
        {
            id: 5,
            rank: 5,
            name: "James Wilson",
            avatar: "JW",
            points: 2350,
            streak: 31,
            badges: 9,
            change: 0
        },
        {
            id: 6,
            rank: 6,
            name: "Olivia Brown",
            avatar: "OB",
            points: 2180,
            streak: 25,
            badges: 7,
            change: 2
        },
        {
            id: 7,
            rank: 7,
            name: "Daniel Martinez",
            avatar: "DM",
            points: 2050,
            streak: 22,
            badges: 6,
            change: -2
        },
        {
            id: 8,
            rank: 8,
            name: "Sophia Anderson",
            avatar: "SA",
            points: 1920,
            streak: 19,
            badges: 5,
            change: 1
        }
    ];

    const data = leaderboardData.length > 0 ? leaderboardData : defaultData;

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    const getChangeIcon = (change) => {
        if (change > 0) return <span className="rank-up">↑ {change}</span>;
        if (change < 0) return <span className="rank-down">↓ {Math.abs(change)}</span>;
        return <span className="rank-same">—</span>;
    };

    return (
        <div className="leaderboard-container">
            {/* Header */}
            <div className="leaderboard-header">
                <h2>🏆 Leaderboard</h2>
                <div className="timeframe-selector">
                    <button
                        className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
                        onClick={() => setTimeframe('week')}
                    >
                        Week
                    </button>
                    <button
                        className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
                        onClick={() => setTimeframe('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`timeframe-btn ${timeframe === 'allTime' ? 'active' : ''}`}
                        onClick={() => setTimeframe('allTime')}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="podium">
                {data.slice(0, 3).sort((a, b) => {
                    if (a.rank === 1) return 0;
                    if (b.rank === 1) return 1;
                    return a.rank - b.rank;
                }).map((user, index) => (
                    <div
                        key={user.id}
                        className={`podium-place place-${user.rank}`}
                        style={{ order: user.rank === 1 ? 2 : user.rank === 2 ? 1 : 3 }}
                    >
                        <div className="podium-avatar">
                            <div className="avatar-circle" style={{
                                background: user.rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                                    user.rank === 2 ? 'linear-gradient(135deg, #C0C0C0, #808080)' :
                                        'linear-gradient(135deg, #CD7F32, #8B4513)'
                            }}>
                                {user.avatar}
                            </div>
                            <div className="rank-badge">{getRankIcon(user.rank)}</div>
                        </div>
                        <div className="podium-name">{user.name}</div>
                        <div className="podium-points">{user.points.toLocaleString()} pts</div>
                    </div>
                ))}
            </div>

            {/* Leaderboard List */}
            <div className="leaderboard-list">
                {data.map((user) => (
                    <div
                        key={user.id}
                        className={`leaderboard-item ${user.isCurrentUser || user.id === currentUserId ? 'current-user' : ''}`}
                    >
                        <div className="rank-column">
                            <span className="rank-number">{getRankIcon(user.rank)}</span>
                            {getChangeIcon(user.change)}
                        </div>

                        <div className="user-column">
                            <div className="user-avatar">{user.avatar}</div>
                            <div className="user-info">
                                <div className="user-name">
                                    {user.name}
                                    {(user.isCurrentUser || user.id === currentUserId) && (
                                        <span className="you-badge">You</span>
                                    )}
                                </div>
                                <div className="user-stats">
                                    <span>🔥 {user.streak} day streak</span>
                                    <span>🏅 {user.badges} badges</span>
                                </div>
                            </div>
                        </div>

                        <div className="points-column">
                            <div className="points-value">{user.points.toLocaleString()}</div>
                            <div className="points-label">points</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;

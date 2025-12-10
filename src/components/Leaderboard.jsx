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
        if (change > 0) return <span className="rank-up" style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>↑ {change}</span>;
        if (change < 0) return <span className="rank-down" style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>↓ {Math.abs(change)}</span>;
        return <span className="rank-same" style={{ color: 'var(--color-text-muted)' }}>—</span>;
    };

    return (
        <div className="leaderboard-container fade-in" style={{ padding: '2rem' }}>
            {/* Header */}
            <div className="leaderboard-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🏆 Leaderboard</h2>
                <div className="glass-panel" style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: 'var(--radius-full)' }}>
                    {['week', 'month', 'allTime'].map((t) => (
                        <button
                            key={t}
                            className={`btn btn-sm ${timeframe === t ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setTimeframe(t)}
                            style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem', textTransform: 'capitalize' }}
                        >
                            {t === 'allTime' ? 'All Time' : t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="podium" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
                {data.slice(0, 3).sort((a, b) => {
                    if (a.rank === 1) return 0;
                    if (b.rank === 1) return 1;
                    return a.rank - b.rank;
                }).map((user) => (
                    <div
                        key={user.id}
                        className={`podium-place place-${user.rank} glass-panel feature-card-animated`}
                        style={{
                            order: user.rank === 1 ? 2 : user.rank === 2 ? 1 : 3,
                            padding: '2rem',
                            textAlign: 'center',
                            borderRadius: 'var(--radius-xl)',
                            width: '220px',
                            background: user.rank === 1 ? 'linear-gradient(to bottom, rgba(255, 215, 0, 0.2), rgba(255, 255, 255, 0.1))' : undefined,
                            border: user.rank === 1 ? '2px solid rgba(255, 215, 0, 0.5)' : undefined,
                            transform: user.rank === 1 ? 'scale(1.1)' : 'scale(1)',
                            marginBottom: user.rank === 1 ? '2rem' : '0'
                        }}
                    >
                        <div className="podium-avatar" style={{ marginBottom: '1rem', position: 'relative' }}>
                            <div className="avatar-circle" style={{
                                width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                                color: 'white', fontWeight: 'bold',
                                background: user.rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                                    user.rank === 2 ? 'linear-gradient(135deg, #C0C0C0, #808080)' :
                                        'linear-gradient(135deg, #CD7F32, #8B4513)',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}>
                                {user.avatar}
                            </div>
                            <div className="rank-badge" style={{
                                position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                                background: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontSize: '1.2rem'
                            }}>
                                {getRankIcon(user.rank)}
                            </div>
                        </div>
                        <div className="podium-name" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '1.5rem' }}>{user.name}</div>
                        <div className="podium-points" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{user.points.toLocaleString()} pts</div>
                    </div>
                ))}
            </div>

            {/* Leaderboard List */}
            <div className="leaderboard-list glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 3fr 1fr', padding: '0 1rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', opacity: 0.7 }}>
                    <div>Rank</div>
                    <div>User</div>
                    <div style={{ textAlign: 'right' }}>Points</div>
                </div>
                {data.slice(3).map((user) => (
                    <div
                        key={user.id}
                        className={`leaderboard-item ${user.isCurrentUser || user.id === currentUserId ? 'current-user-highlight' : ''}`}
                        style={{
                            display: 'grid', gridTemplateColumns: '0.5fr 3fr 1fr', alignItems: 'center', padding: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: (user.isCurrentUser || user.id === currentUserId) ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent',
                            borderRadius: 'var(--radius-lg)',
                            marginTop: '0.5rem',
                            transition: 'background 0.2s'
                        }}
                    >
                        <div className="rank-column" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="rank-number" style={{ fontWeight: 'bold', width: '30px' }}>{user.rank}</span>
                            {getChangeIcon(user.change)}
                        </div>

                        <div className="user-column" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="user-avatar" style={{
                                width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface-alt)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold'
                            }}>
                                {user.avatar}
                            </div>
                            <div className="user-info">
                                <div className="user-name" style={{ fontWeight: '600' }}>
                                    {user.name}
                                    {(user.isCurrentUser || user.id === currentUserId) && (
                                        <span className="badge badge-primary" style={{ marginLeft: '0.5rem', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>You</span>
                                    )}
                                </div>
                                <div className="user-stats" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    🔥 {user.streak} day streak • 🏅 {user.badges} badges
                                </div>
                            </div>
                        </div>

                        <div className="points-column" style={{ textAlign: 'right' }}>
                            <div className="points-value" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.points.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;

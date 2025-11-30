import React from 'react';

const Achievements = ({ achievements = [] }) => {
    // Default achievements data
    const defaultAchievements = [
        {
            id: 1,
            title: "First Steps",
            description: "Completed your first wellness program",
            icon: "🎯",
            earned: true,
            date: "2024-01-15",
            points: 50,
            rarity: "common"
        },
        {
            id: 2,
            title: "Week Warrior",
            description: "Maintained 7-day streak",
            icon: "🔥",
            earned: true,
            date: "2024-01-22",
            points: 100,
            rarity: "rare"
        },
        {
            id: 3,
            title: "Meditation Master",
            description: "Completed 50 meditation sessions",
            icon: "🧘",
            earned: true,
            date: "2024-02-10",
            points: 200,
            rarity: "epic"
        },
        {
            id: 4,
            title: "Fitness Fanatic",
            description: "Logged 100 workout sessions",
            icon: "💪",
            earned: false,
            progress: 67,
            points: 300,
            rarity: "epic"
        },
        {
            id: 5,
            title: "Wellness Champion",
            description: "Reached 1000 wellness points",
            icon: "👑",
            earned: false,
            progress: 45,
            points: 500,
            rarity: "legendary"
        },
        {
            id: 6,
            title: "Social Butterfly",
            description: "Joined 10 group sessions",
            icon: "🦋",
            earned: false,
            progress: 30,
            points: 150,
            rarity: "rare"
        }
    ];

    const achievementData = achievements.length > 0 ? achievements : defaultAchievements;
    const earnedCount = achievementData.filter(a => a.earned).length;
    const totalPoints = achievementData.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'var(--color-text-muted)';
            case 'rare': return 'var(--color-info)';
            case 'epic': return 'var(--color-accent)';
            case 'legendary': return 'var(--color-warning)';
            default: return 'var(--color-text-secondary)';
        }
    };

    return (
        <div className="achievements-container">
            {/* Header Stats */}
            <div className="achievements-header">
                <div className="achievement-stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <div className="stat-value">{earnedCount}/{achievementData.length}</div>
                        <div className="stat-label">Achievements</div>
                    </div>
                </div>
                <div className="achievement-stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                        <div className="stat-value">{totalPoints}</div>
                        <div className="stat-label">Total Points</div>
                    </div>
                </div>
                <div className="achievement-stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <div className="stat-value">{Math.round((earnedCount / achievementData.length) * 100)}%</div>
                        <div className="stat-label">Completion</div>
                    </div>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="achievements-grid">
                {achievementData.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
                    >
                        <div className="achievement-icon" style={{
                            filter: achievement.earned ? 'none' : 'grayscale(100%) opacity(0.5)'
                        }}>
                            {achievement.icon}
                        </div>

                        <div className="achievement-content">
                            <h3 className="achievement-title">{achievement.title}</h3>
                            <p className="achievement-description">{achievement.description}</p>

                            {achievement.earned ? (
                                <div className="achievement-earned">
                                    <span className="earned-badge">✓ Earned</span>
                                    <span className="earned-date">{achievement.date}</span>
                                </div>
                            ) : (
                                achievement.progress && (
                                    <div className="achievement-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${achievement.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{achievement.progress}%</span>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="achievement-footer">
                            <span
                                className="achievement-rarity"
                                style={{ color: getRarityColor(achievement.rarity) }}
                            >
                                {achievement.rarity}
                            </span>
                            <span className="achievement-points">+{achievement.points} pts</span>
                        </div>

                        {achievement.earned && (
                            <div className="achievement-glow"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;

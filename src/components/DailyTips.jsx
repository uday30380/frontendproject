import React, { useState, useEffect } from 'react';

const tips = [
    {
        id: 1,
        title: "Stay Hydrated",
        description: "Drinking enough water is crucial for your energy levels and brain function. Aim for 8 glasses a day!",
        icon: "💧"
    },
    {
        id: 2,
        title: "Take Breaks",
        description: "Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
        icon: "👀"
    },
    {
        id: 3,
        title: "Move Your Body",
        description: "A short 10-minute walk can boost your mood and creativity significantly.",
        icon: "🚶"
    },
    {
        id: 4,
        title: "Prioritize Sleep",
        description: "Quality sleep is the foundation of good health. Try to get 7-9 hours each night.",
        icon: "😴"
    },
    {
        id: 5,
        title: "Practice Mindfulness",
        description: "Take 5 minutes to focus on your breathing. It helps reduce stress and anxiety.",
        icon: "🧘"
    }
];

const DailyTips = () => {
    const [tip, setTip] = useState(tips[0]);

    useEffect(() => {
        // Pick a random tip on mount
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setTip(randomTip);
    }, []);

    return (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--color-primary-light), white)', border: '1px solid var(--color-primary-light)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '2.5rem', background: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    {tip.icon}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary-dark)' }}>Daily Wellness Tip: {tip.title}</h3>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{tip.description}</p>
                </div>
            </div>
        </div>
    );
};

export default DailyTips;

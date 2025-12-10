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
        <div className="card glass-panel p-6 hover-scale">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {tip.icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 text-primary-dark">Daily Wellness Tip: {tip.title}</h3>
                    <p className="m-0 text-secondary">{tip.description}</p>
                </div>
            </div>
        </div>
    );
};

export default DailyTips;

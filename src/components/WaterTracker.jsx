import React, { useState, useEffect } from 'react';

const WaterTracker = () => {
    const [glasses, setGlasses] = useState(0);
    const goal = 8; // 8 glasses per day

    useEffect(() => {
        // Load today's water intake from localStorage
        const today = new Date().toDateString();
        const saved = localStorage.getItem('waterIntake');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.date === today) {
                setGlasses(data.glasses);
            } else {
                // New day, reset
                localStorage.setItem('waterIntake', JSON.stringify({ date: today, glasses: 0 }));
            }
        }
    }, []);

    const addGlass = () => {
        if (glasses < goal) {
            const newCount = glasses + 1;
            setGlasses(newCount);
            const today = new Date().toDateString();
            localStorage.setItem('waterIntake', JSON.stringify({ date: today, glasses: newCount }));
        }
    };

    const removeGlass = () => {
        if (glasses > 0) {
            const newCount = glasses - 1;
            setGlasses(newCount);
            const today = new Date().toDateString();
            localStorage.setItem('waterIntake', JSON.stringify({ date: today, glasses: newCount }));
        }
    };

    const percentage = (glasses / goal) * 100;

    return (
        <div className="water-tracker-card">
            <div className="tracker-header">
                <h3>💧 Water Intake</h3>
                <span className="tracker-goal">{glasses}/{goal} glasses</span>
            </div>

            <div className="water-progress">
                <div className="water-progress-bar">
                    <div
                        className="water-progress-fill"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <span className="water-percentage">{Math.round(percentage)}%</span>
            </div>

            <div className="water-glasses">
                {[...Array(goal)].map((_, index) => (
                    <div
                        key={index}
                        className={`water-glass ${index < glasses ? 'filled' : ''}`}
                    >
                        💧
                    </div>
                ))}
            </div>

            <div className="tracker-actions">
                <button
                    className="btn btn-sm btn-outline"
                    onClick={removeGlass}
                    disabled={glasses === 0}
                >
                    − Remove
                </button>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={addGlass}
                    disabled={glasses === goal}
                >
                    + Add Glass
                </button>
            </div>

            {glasses === goal && (
                <div className="tracker-success">
                    🎉 Great job! You've reached your daily goal!
                </div>
            )}
        </div>
    );
};

export default WaterTracker;

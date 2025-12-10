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
        <div className="card glass-panel p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold m-0">💧 Water Intake</h3>
                    <p className="text-secondary text-sm m-0 opacity-80">Stay hydrated!</p>
                </div>
                <span className="text-primary font-extrabold text-2xl">{glasses}/{goal}</span>
            </div>

            <div className="water-progress h-4 bg-gray-200 rounded-full overflow-hidden mb-2 relative">
                <div
                    className="water-progress-fill h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%`, background: 'var(--color-info)' }}
                ></div>
            </div>
            <div className="text-right text-xs font-bold text-secondary mb-6">{Math.round(percentage)}% Goal Reached</div>

            <div className="flex justify-center gap-2 flex-wrap mb-6">
                {[...Array(goal)].map((_, index) => (
                    <div
                        key={index}
                        className={`text-2xl transition-all duration-300 ${index < glasses ? 'opacity-100 scale-110' : 'opacity-30 grayscale'}`}
                    >
                        💧
                    </div>
                ))}
            </div>

            <div className="flex gap-4 justify-center">
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
                <div className="mt-6 p-4 bg-green-500/10 text-green-600 rounded-lg text-center font-bold animate-bounce">
                    🎉 Great job! You've reached your daily goal!
                </div>
            )}
        </div>
    );
};

export default WaterTracker;

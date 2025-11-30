import React, { useState, useEffect } from 'react';

const MoodTracker = () => {
    const moods = [
        { emoji: '😊', label: 'Great', value: 5, color: '#10b981' },
        { emoji: '🙂', label: 'Good', value: 4, color: '#3b82f6' },
        { emoji: '😐', label: 'Okay', value: 3, color: '#f59e0b' },
        { emoji: '😔', label: 'Low', value: 2, color: '#f97316' },
        { emoji: '😢', label: 'Sad', value: 1, color: '#ef4444' }
    ];

    const [selectedMood, setSelectedMood] = useState(null);
    const [moodHistory, setMoodHistory] = useState([]);

    useEffect(() => {
        // Load today's mood from localStorage
        const today = new Date().toDateString();
        const saved = localStorage.getItem('moodTracker');
        if (saved) {
            const data = JSON.parse(saved);
            const todayMood = data.find(m => m.date === today);
            if (todayMood) {
                setSelectedMood(todayMood.mood);
            }
            setMoodHistory(data.slice(-7)); // Last 7 days
        }
    }, []);

    const selectMood = (mood) => {
        const today = new Date().toDateString();
        setSelectedMood(mood.value);

        // Save to localStorage
        const saved = localStorage.getItem('moodTracker');
        let history = saved ? JSON.parse(saved) : [];

        // Remove today's entry if exists
        history = history.filter(m => m.date !== today);

        // Add new entry
        history.push({
            date: today,
            mood: mood.value,
            emoji: mood.emoji,
            label: mood.label
        });

        // Keep only last 30 days
        if (history.length > 30) {
            history = history.slice(-30);
        }

        localStorage.setItem('moodTracker', JSON.stringify(history));
        setMoodHistory(history.slice(-7));
    };

    const getAverageMood = () => {
        if (moodHistory.length === 0) return 0;
        const sum = moodHistory.reduce((acc, m) => acc + m.mood, 0);
        return (sum / moodHistory.length).toFixed(1);
    };

    return (
        <div className="mood-tracker-card">
            <div className="tracker-header">
                <h3>😊 How are you feeling today?</h3>
                {selectedMood && (
                    <span className="mood-selected">
                        {moods.find(m => m.value === selectedMood)?.emoji} {moods.find(m => m.value === selectedMood)?.label}
                    </span>
                )}
            </div>

            <div className="mood-options">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        className={`mood-button ${selectedMood === mood.value ? 'selected' : ''}`}
                        onClick={() => selectMood(mood)}
                        style={{
                            borderColor: selectedMood === mood.value ? mood.color : 'transparent'
                        }}
                    >
                        <span className="mood-emoji">{mood.emoji}</span>
                        <span className="mood-label">{mood.label}</span>
                    </button>
                ))}
            </div>

            {moodHistory.length > 0 && (
                <div className="mood-stats">
                    <div className="mood-stat">
                        <span className="stat-label">7-Day Average</span>
                        <span className="stat-value">{getAverageMood()} / 5.0</span>
                    </div>
                    <div className="mood-history">
                        <span className="history-label">Recent:</span>
                        <div className="history-emojis">
                            {moodHistory.slice(-5).reverse().map((m, index) => (
                                <span key={index} className="history-emoji" title={m.date}>
                                    {m.emoji}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {selectedMood && selectedMood <= 2 && (
                <div className="mood-support">
                    <p>💙 We're here for you. Consider:</p>
                    <ul>
                        <li>Talking to a counselor</li>
                        <li>Trying a meditation session</li>
                        <li>Reaching out to a friend</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MoodTracker;

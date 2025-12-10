import React, { useState, useEffect, useRef } from 'react';


const FocusTimer = () => {
    const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);

    const modes = {
        focus: { label: 'Focus', time: 25 * 60, color: 'var(--color-primary)' },
        shortBreak: { label: 'Short Break', time: 5 * 60, color: 'var(--color-success)' },
        longBreak: { label: 'Long Break', time: 15 * 60, color: 'var(--color-info)' },
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            clearInterval(timerRef.current);
            // Optional: Play sound or notification here
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(modes[mode].time);
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(modes[newMode].time);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

    return (
        <div className="card focus-timer-card">
            <div className="focus-header">
                <h3>⏱️ Focus Timer</h3>
                <div className="focus-modes">
                    {Object.keys(modes).map((m) => (
                        <button
                            key={m}
                            className={`btn btn-sm ${mode === m ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => changeMode(m)}
                        >
                            {modes[m].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="timer-display" style={{ borderColor: modes[mode].color }}>
                <div className="time-text">{formatTime(timeLeft)}</div>
                <div className="timer-status">{isActive ? 'Running' : 'Paused'}</div>

                <svg className="timer-progress-ring" width="100%" height="100%">
                    <circle
                        stroke="var(--color-border)"
                        strokeWidth="4"
                        fill="transparent"
                        r="48%"
                        cx="50%"
                        cy="50%"
                    />
                    <circle
                        stroke={modes[mode].color}
                        strokeWidth="4"
                        fill="transparent"
                        r="48%"
                        cx="50%"
                        cy="50%"
                        strokeDasharray={`${2 * Math.PI * 48}%`}
                        strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}%`}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
            </div>

            <div className="timer-controls">
                <button
                    className={`btn ${isActive ? 'btn-outline' : 'btn-primary'} btn-lg`}
                    onClick={toggleTimer}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button className="btn btn-ghost" onClick={resetTimer}>
                    Reset
                </button>
            </div>
        </div >
    );
};

export default FocusTimer;

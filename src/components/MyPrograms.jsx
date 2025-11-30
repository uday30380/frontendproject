import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyPrograms = ({ enrolledPrograms = [], programs = [], leaveProgram, userId }) => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all'); // all, ongoing, completed

    // Mock program data with progress
    const programsWithProgress = enrolledPrograms.map(programId => {
        const program = programs.find(p => p.id === programId) || {
            id: programId,
            title: 'Program',
            type: 'Wellness',
            duration: '4 weeks'
        };

        // Mock progress data
        const progress = Math.floor(Math.random() * 100);
        const status = progress === 100 ? 'completed' : progress > 0 ? 'ongoing' : 'enrolled';

        return {
            ...program,
            progress,
            status,
            startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            completedSessions: Math.floor((progress / 100) * 12),
            totalSessions: 12
        };
    });

    const filteredPrograms = filter === 'all'
        ? programsWithProgress
        : programsWithProgress.filter(p => p.status === filter);

    const stats = {
        total: programsWithProgress.length,
        ongoing: programsWithProgress.filter(p => p.status === 'ongoing').length,
        completed: programsWithProgress.filter(p => p.status === 'completed').length
    };

    return (
        <div className="my-programs-container">
            <div className="my-programs-header">
                <h1>🎯 My Programs</h1>
                <p className="my-programs-subtitle">Track your wellness journey</p>
            </div>

            {/* Stats */}
            <div className="program-stats">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Enrolled</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.ongoing}</div>
                    <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            {/* Filters */}
            <div className="program-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Programs
                </button>
                <button
                    className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`}
                    onClick={() => setFilter('ongoing')}
                >
                    In Progress
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Programs List */}
            {filteredPrograms.length > 0 ? (
                <div className="programs-list">
                    {filteredPrograms.map((program) => (
                        <div key={program.id} className="program-card">
                            <div className="program-card-header">
                                <div className="program-icon">{program.icon || '🎯'}</div>
                                <div className="program-status-badge" data-status={program.status}>
                                    {program.status === 'completed' ? '✓ Completed' :
                                        program.status === 'ongoing' ? '⏳ In Progress' : '📌 Enrolled'}
                                </div>
                            </div>

                            <h3>{program.title}</h3>
                            <p className="program-meta">
                                {program.type} • Started {program.startDate}
                            </p>

                            <div className="program-progress-section">
                                <div className="progress-header">
                                    <span>Progress</span>
                                    <span className="progress-percentage">{program.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${program.progress}%` }}
                                    ></div>
                                </div>
                                <p className="progress-sessions">
                                    {program.completedSessions} / {program.totalSessions} sessions completed
                                </p>
                            </div>

                            <div className="program-actions">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/program/${program.id}`)}
                                >
                                    {program.status === 'completed' ? 'View Details' : 'Continue'}
                                </button>
                                {program.status !== 'completed' && (
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => leaveProgram(userId, program.id)}
                                    >
                                        Leave Program
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <p>No {filter !== 'all' ? filter : ''} programs found</p>
                    <button className="btn btn-primary" onClick={() => navigate('/wellness-programs')}>
                        Browse Programs
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyPrograms;

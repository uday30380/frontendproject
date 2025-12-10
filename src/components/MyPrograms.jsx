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
        <div className="my-programs-container fade-in">
            <div className="my-programs-header glass-panel p-6 mb-8 text-center rounded-xl">
                <h1 className="text-3xl font-bold m-0">🎯 My Programs</h1>
                <p className="text-secondary text-lg mt-2">Track your wellness journey</p>
            </div>

            {/* Stats */}
            <div className="program-stats grid grid-cols-3 gap-4 mb-8">
                <div className="stat-card glass-panel text-center p-4">
                    <div className="text-3xl font-bold text-primary mb-1">{stats.total}</div>
                    <div className="text-sm text-secondary uppercase tracking-wider">Total Enrolled</div>
                </div>
                <div className="stat-card glass-panel text-center p-4">
                    <div className="text-3xl font-bold text-warning mb-1">{stats.ongoing}</div>
                    <div className="text-sm text-secondary uppercase tracking-wider">In Progress</div>
                </div>
                <div className="stat-card glass-panel text-center p-4">
                    <div className="text-3xl font-bold text-success mb-1">{stats.completed}</div>
                    <div className="text-sm text-secondary uppercase tracking-wider">Completed</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex justify-center mb-8">
                <div className="glass-panel inline-flex p-2 rounded-full gap-2">
                    <button
                        className={`btn btn-sm rounded-full px-6 transition-all ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Programs
                    </button>
                    <button
                        className={`btn btn-sm rounded-full px-6 transition-all ${filter === 'ongoing' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter('ongoing')}
                    >
                        In Progress
                    </button>
                    <button
                        className={`btn btn-sm rounded-full px-6 transition-all ${filter === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {/* Programs List */}
            {filteredPrograms.length > 0 ? (
                <div className="programs-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => (
                        <div key={program.id} className="program-card glass-panel feature-card-animated p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-3xl">{program.icon || '🎯'}</div>
                                <div className={`badge px-3 py-1 rounded-full text-xs font-bold uppercase ${program.status === 'completed' ? 'badge-success' : program.status === 'ongoing' ? 'badge-warning' : 'badge-primary'}`}>
                                    {program.status === 'completed' ? '✓ Completed' :
                                        program.status === 'ongoing' ? '⏳ In Progress' : '📌 Enrolled'}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                            <p className="text-sm text-secondary mb-6">
                                {program.type} • Started {program.startDate}
                            </p>

                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress</span>
                                    <span className="font-bold">{program.progress}%</span>
                                </div>
                                <div className="progress-bar-container h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="progress-bar-fill h-full bg-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${program.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-secondary mt-2 text-right">
                                    {program.completedSessions} / {program.totalSessions} sessions completed
                                </p>
                            </div>

                            <div className="mt-auto flex gap-4">
                                <button
                                    className="btn btn-sm btn-primary flex-1"
                                    onClick={() => navigate(`/program/${program.id}`)}
                                >
                                    {program.status === 'completed' ? 'View Details' : 'Continue'}
                                </button>
                                {program.status !== 'completed' && (
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => leaveProgram(userId, program.id)}
                                    >
                                        Leave
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-16 text-secondary bg-white/5 rounded-xl border border-white/10">
                    <div className="text-6xl mb-4 opacity-50">🎯</div>
                    <p className="text-xl mb-6">No {filter !== 'all' ? filter : ''} programs found</p>
                    <button className="btn btn-primary" onClick={() => navigate('/wellness-programs')}>
                        Browse Programs
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyPrograms;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const SavedItems = ({ savedResources = [], resources = [], savedPrograms = [], programs = [], toggleSaveResource, toggleSaveProgram, userId }) => {
    const navigate = useNavigate();

    const savedResourcesList = resources.filter(r => savedResources.includes(r.id));
    const savedProgramsList = programs.filter(p => savedPrograms.includes(p.id));

    return (
        <div className="saved-items-container fade-in" style={{ padding: '2rem' }}>
            <div className="saved-items-header glass-panel" style={{ marginBottom: '3rem', textAlign: 'center', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📚 My Saved Items</h1>
                <p className="saved-items-subtitle" style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>Quick access to your bookmarked resources and programs</p>
            </div>

            {/* Saved Resources */}
            <div className="saved-section" style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Saved Resources</h2>
                {savedResourcesList.length > 0 ? (
                    <div className="saved-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {savedResourcesList.map((resource) => (
                            <div key={resource.id} className="saved-card glass-panel feature-card-animated" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column' }}>
                                <div className="saved-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div className="saved-icon" style={{ fontSize: '2.5rem' }}>{resource.thumbnail || '📄'}</div>
                                    <button
                                        className="btn-unsave"
                                        onClick={() => toggleSaveResource(userId, resource.id)}
                                        title="Remove from saved"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                                    >
                                        ❤️
                                    </button>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{resource.title}</h3>
                                <p className="saved-meta" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                    {resource.type} • {resource.duration || resource.readTime}
                                </p>
                                <p className="saved-description" style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>{resource.description}</p>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/resource/${resource.id}`)}
                                    style={{ width: '100%' }}
                                >
                                    View Resource
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-xl)' }}>
                        <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📚</div>
                        <p style={{ marginBottom: '1rem' }}>No saved resources yet</p>
                        <button className="btn btn-outline" onClick={() => navigate('/health-resources')}>
                            Browse Resources
                        </button>
                    </div>
                )}
            </div>

            {/* Saved Programs */}
            <div className="saved-section">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Saved Programs</h2>
                {savedProgramsList.length > 0 ? (
                    <div className="saved-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {savedProgramsList.map((program) => (
                            <div key={program.id} className="saved-card glass-panel feature-card-animated" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column' }}>
                                <div className="saved-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div className="saved-icon" style={{ fontSize: '2.5rem' }}>{program.icon || '🎯'}</div>
                                    <button
                                        className="btn-unsave"
                                        onClick={() => toggleSaveProgram(userId, program.id)}
                                        title="Remove from saved"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
                                    >
                                        ❤️
                                    </button>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{program.title}</h3>
                                <p className="saved-meta" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                    {program.type} • {program.duration}
                                </p>
                                <p className="saved-description" style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>{program.description}</p>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/program/${program.id}`)}
                                    style={{ width: '100%' }}
                                >
                                    View Program
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-xl)' }}>
                        <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎯</div>
                        <p style={{ marginBottom: '1rem' }}>No saved programs yet</p>
                        <button className="btn btn-outline" onClick={() => navigate('/wellness-programs')}>
                            Browse Programs
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedItems;

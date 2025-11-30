import React from 'react';
import { useNavigate } from 'react-router-dom';

const SavedItems = ({ savedResources = [], resources = [], savedPrograms = [], programs = [], toggleSaveResource, toggleSaveProgram, userId }) => {
    const navigate = useNavigate();

    const savedResourcesList = resources.filter(r => savedResources.includes(r.id));
    const savedProgramsList = programs.filter(p => savedPrograms.includes(p.id));

    return (
        <div className="saved-items-container">
            <div className="saved-items-header">
                <h1>📚 My Saved Items</h1>
                <p className="saved-items-subtitle">Quick access to your bookmarked resources and programs</p>
            </div>

            {/* Saved Resources */}
            <div className="saved-section">
                <h2>Saved Resources</h2>
                {savedResourcesList.length > 0 ? (
                    <div className="saved-grid">
                        {savedResourcesList.map((resource) => (
                            <div key={resource.id} className="saved-card">
                                <div className="saved-card-header">
                                    <div className="saved-icon">{resource.thumbnail || '📄'}</div>
                                    <button
                                        className="btn-unsave"
                                        onClick={() => toggleSaveResource(userId, resource.id)}
                                        title="Remove from saved"
                                    >
                                        ❤️
                                    </button>
                                </div>
                                <h3>{resource.title}</h3>
                                <p className="saved-meta">
                                    {resource.type} • {resource.duration || resource.readTime}
                                </p>
                                <p className="saved-description">{resource.description}</p>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/resource/${resource.id}`)}
                                >
                                    View Resource
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📚</div>
                        <p>No saved resources yet</p>
                        <button className="btn btn-outline" onClick={() => navigate('/health-resources')}>
                            Browse Resources
                        </button>
                    </div>
                )}
            </div>

            {/* Saved Programs */}
            <div className="saved-section">
                <h2>Saved Programs</h2>
                {savedProgramsList.length > 0 ? (
                    <div className="saved-grid">
                        {savedProgramsList.map((program) => (
                            <div key={program.id} className="saved-card">
                                <div className="saved-card-header">
                                    <div className="saved-icon">{program.icon || '🎯'}</div>
                                    <button
                                        className="btn-unsave"
                                        onClick={() => toggleSaveProgram(userId, program.id)}
                                        title="Remove from saved"
                                    >
                                        ❤️
                                    </button>
                                </div>
                                <h3>{program.title}</h3>
                                <p className="saved-meta">
                                    {program.type} • {program.duration}
                                </p>
                                <p className="saved-description">{program.description}</p>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => navigate(`/program/${program.id}`)}
                                >
                                    View Program
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🎯</div>
                        <p>No saved programs yet</p>
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

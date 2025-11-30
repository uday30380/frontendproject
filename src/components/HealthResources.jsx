import React, { useState } from "react";

const categories = ["All", "Mental Health", "Fitness", "Nutrition", "Sleep"];

const HealthResources = ({ resources, trackResourceView, savedResources = [], toggleSaveResource, user }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedResource, setSelectedResource] = useState(null);

    // Use resources passed from props, fallback to empty array if undefined
    const safeResources = resources || [];

    const filteredResources = safeResources.filter((resource) => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="page-wrapper">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1>Health Resources 📚</h1>
                    <p className="section-description">
                        Explore our curated collection of articles, videos, and guides to support your wellness journey.
                    </p>

                    {/* Search Bar */}
                    <div style={{ maxWidth: '600px', margin: '0 auto 2rem', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search for resources..."
                            className="form-control"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '3rem' }}
                        />
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
                    </div>

                    {/* Category Filters */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`btn btn-sm ${selectedCategory === category ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="features-grid">
                    {filteredResources.map((resource) => {
                        const isSaved = savedResources.includes(resource.id);
                        return (
                            <div key={resource.id} className="card feature-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {user?.role === "Student" && (
                                    <button
                                        className="btn-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSaveResource(user.studentId, resource.id);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            background: isSaved ? 'var(--color-primary)' : 'rgba(255,255,255,0.8)',
                                            color: isSaved ? 'white' : 'var(--color-text-muted)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            zIndex: 2
                                        }}
                                        title={isSaved ? "Unsave" : "Save for later"}
                                    >
                                        {isSaved ? "🔖" : "🏷️"}
                                    </button>
                                )}
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{resource.thumbnail}</div>
                                <div style={{ marginBottom: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span className={`badge ${resource.category === 'Mental Health' ? 'badge-info' : resource.category === 'Fitness' ? 'badge-success' : resource.category === 'Nutrition' ? 'badge-warning' : 'badge-primary'}`}>
                                            {resource.category}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{resource.type}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{resource.title}</h3>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                        {resource.description}
                                    </p>
                                </div>
                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{resource.duration} • {resource.author}</span>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => {
                                            setSelectedResource(resource);
                                            if (trackResourceView) trackResourceView(resource.id);
                                        }}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredResources.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
                        <h3>No resources found</h3>
                        <p>Try adjusting your search or category filter.</p>
                    </div>
                )}

                {/* Resource Modal */}
                {selectedResource && (
                    <div className="modal-overlay" onClick={() => setSelectedResource(null)}>
                        <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ fontSize: '3rem' }}>{selectedResource.thumbnail}</div>
                                    <div>
                                        <h2 style={{ marginBottom: '0.25rem' }}>{selectedResource.title}</h2>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span className="badge badge-primary">{selectedResource.category}</span>
                                            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>• {selectedResource.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-ghost" onClick={() => setSelectedResource(null)}>✕</button>
                            </div>

                            <div style={{ background: 'var(--color-surface-alt)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                    [Content Placeholder: In a real app, the full article text or video player would appear here.]
                                </p>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3>Description</h3>
                                <p>{selectedResource.description}</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                <div>
                                    <strong>Author:</strong> {selectedResource.author}<br />
                                    <strong>Duration:</strong> {selectedResource.duration}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {user?.role === "Student" && (
                                        <button
                                            className={`btn ${savedResources.includes(selectedResource.id) ? "btn-primary" : "btn-outline"}`}
                                            onClick={() => toggleSaveResource(user.studentId, selectedResource.id)}
                                        >
                                            {savedResources.includes(selectedResource.id) ? "Saved" : "Save for Later"}
                                        </button>
                                    )}
                                    <button className="btn btn-primary">Start Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthResources;

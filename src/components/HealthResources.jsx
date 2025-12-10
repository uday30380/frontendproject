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
        <div className="page-wrapper fade-in">
            <div className="container mt-8">
                <div className="text-center mb-12">
                    <h1 className="hero-title mb-4">Health Resources 📚</h1>
                    <p className="section-description text-xl max-w-800 mx-auto">
                        Explore our curated collection of articles, videos, and guides to support your wellness journey.
                    </p>

                    {/* Search Bar */}
                    <div className="glass-panel max-w-800 mx-auto p-3 rounded-xl mb-4 relative">
                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder="🔍 Search for resources..."
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex justify-center gap-2 flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline"} rounded-full px-4 py-2`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="resources-grid">
                    {filteredResources.map((resource) => {
                        const isSaved = savedResources.includes(resource.id);
                        return (
                            <div key={resource.id} className="card glass-panel resource-card feature-card-animated">
                                {user?.role === "Student" && (
                                    <button
                                        className={`btn-icon absolute top-4 right-4 rounded-full w-9 h-9 flex items-center justify-center shadow-sm ${isSaved ? 'bg-primary text-white' : 'bg-white/80 text-muted'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSaveResource(user.studentId, resource.id);
                                        }}
                                        title={isSaved ? "Unsave" : "Save for later"}
                                    >
                                        {isSaved ? "🔖" : "🏷️"}
                                    </button>
                                )}
                                <div className="text-4xl mb-4 text-center">{resource.thumbnail}</div>
                                <div className="mb-auto">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`badge ${resource.category === 'Mental Health' ? 'badge-info' : resource.category === 'Fitness' ? 'badge-success' : resource.category === 'Nutrition' ? 'badge-warning' : 'badge-primary'}`}>
                                            {resource.category}
                                        </span>
                                        <span className="text-sm text-secondary font-medium">{resource.type}</span>
                                    </div>
                                    <h3 className="text-xl mb-2">{resource.title}</h3>
                                    <p className="text-secondary mb-4 line-clamp-3">
                                        {resource.description}
                                    </p>
                                </div>
                                <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-sm text-muted">{resource.duration}</span>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => {
                                            setSelectedResource(resource);
                                            if (trackResourceView) trackResourceView(resource.id);
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center p-8 text-secondary">
                        <div className="text-4xl mb-6 opacity-50">😕</div>
                        <h3>No resources found</h3>
                        <p>Try adjusting your search or category filter.</p>
                        <button className="btn btn-ghost mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}>Clear Filters</button>
                    </div>
                )}

                {/* Resource Modal */}
                {selectedResource && (
                    <div className="modal-overlay" onClick={() => setSelectedResource(null)}>
                        <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={() => setSelectedResource(null)}>✕</button>

                            <div className="p-8">
                                <div className="flex gap-6 items-start mb-8">
                                    <div className="text-6xl">{selectedResource.thumbnail}</div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">{selectedResource.title}</h2>
                                        <div className="flex gap-3 items-center">
                                            <span className="badge badge-primary">{selectedResource.category}</span>
                                            <span className="text-secondary text-sm">• {selectedResource.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="placeholder-box">
                                    <p className="text-secondary italic text-lg">
                                        [Content Placeholder: In a real app, the full article text or video player would appear here.]
                                    </p>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-xl font-bold mb-3">Description</h3>
                                    <p className="text-lg leading-relaxed">{selectedResource.description}</p>
                                </div>

                                <div className="flex justify-between items-center border-t border-white/10 pt-6">
                                    <div>
                                        <div className="mb-1"><strong>Author:</strong> {selectedResource.author}</div>
                                        <div><strong>Duration:</strong> {selectedResource.duration}</div>
                                    </div>
                                    <div className="flex gap-4">
                                        {user?.role === "Student" && (
                                            <button
                                                className={`btn ${savedResources.includes(selectedResource.id) ? "btn-primary" : "btn-outline"}`}
                                                onClick={() => toggleSaveResource(user.studentId, selectedResource.id)}
                                            >
                                                {savedResources.includes(selectedResource.id) ? "Saved" : "Save for Later"}
                                            </button>
                                        )}
                                        <button className="btn btn-success">Start Now</button>
                                    </div>
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

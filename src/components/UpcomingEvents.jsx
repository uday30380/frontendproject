import React, { useState } from 'react';

const UpcomingEvents = ({ events = [] }) => {
    const [filter, setFilter] = useState('all'); // all, workshop, session, webinar

    // Default events data
    const defaultEvents = [
        {
            id: 1,
            title: "Mindfulness Meditation Workshop",
            type: "workshop",
            date: "2024-12-05",
            time: "10:00 AM",
            duration: "2 hours",
            instructor: "Dr. Sarah Williams",
            participants: 24,
            maxParticipants: 30,
            location: "Virtual",
            description: "Learn advanced meditation techniques for stress relief",
            registered: false,
            color: "#6366f1"
        },
        {
            id: 2,
            title: "Nutrition & Wellness Webinar",
            type: "webinar",
            date: "2024-12-07",
            time: "2:00 PM",
            duration: "1 hour",
            instructor: "Chef Michael Chen",
            participants: 45,
            maxParticipants: 100,
            location: "Online",
            description: "Healthy eating habits for busy students",
            registered: true,
            color: "#10b981"
        },
        {
            id: 3,
            title: "Yoga & Flexibility Session",
            type: "session",
            date: "2024-12-08",
            time: "6:00 PM",
            duration: "1.5 hours",
            instructor: "Emma Davis",
            participants: 18,
            maxParticipants: 25,
            location: "Gym Hall A",
            description: "Beginner-friendly yoga for flexibility and relaxation",
            registered: false,
            color: "#8b5cf6"
        },
        {
            id: 4,
            title: "Mental Health Support Group",
            type: "session",
            date: "2024-12-10",
            time: "4:00 PM",
            duration: "1 hour",
            instructor: "Dr. James Wilson",
            participants: 12,
            maxParticipants: 15,
            location: "Room 204",
            description: "Safe space to share and support each other",
            registered: true,
            color: "#3b82f6"
        },
        {
            id: 5,
            title: "Fitness Bootcamp Challenge",
            type: "workshop",
            date: "2024-12-12",
            time: "7:00 AM",
            duration: "3 hours",
            instructor: "Coach Alex Turner",
            participants: 32,
            maxParticipants: 40,
            location: "Sports Complex",
            description: "High-intensity workout and team building",
            registered: false,
            color: "#f59e0b"
        },
        {
            id: 6,
            title: "Sleep Hygiene Workshop",
            type: "webinar",
            date: "2024-12-14",
            time: "8:00 PM",
            duration: "1 hour",
            instructor: "Dr. Olivia Brown",
            participants: 28,
            maxParticipants: 50,
            location: "Virtual",
            description: "Improve your sleep quality and energy levels",
            registered: false,
            color: "#ec4899"
        }
    ];

    const eventData = events.length > 0 ? events : defaultEvents;
    const filteredEvents = filter === 'all'
        ? eventData
        : eventData.filter(e => e.type === filter);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getDaysUntil = (dateString) => {
        const eventDate = new Date(dateString);
        const today = new Date();
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays < 7) return `In ${diffDays} days`;
        return formatDate(dateString);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'workshop': return '🎯';
            case 'session': return '🧘';
            case 'webinar': return '💻';
            default: return '📅';
        }
    };

    return (
        <div className="events-container">
            {/* Header */}
            <div className="events-header">
                <h2>📅 Upcoming Events</h2>
                <div className="event-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'workshop' ? 'active' : ''}`}
                        onClick={() => setFilter('workshop')}
                    >
                        Workshops
                    </button>
                    <button
                        className={`filter-btn ${filter === 'session' ? 'active' : ''}`}
                        onClick={() => setFilter('session')}
                    >
                        Sessions
                    </button>
                    <button
                        className={`filter-btn ${filter === 'webinar' ? 'active' : ''}`}
                        onClick={() => setFilter('webinar')}
                    >
                        Webinars
                    </button>
                </div>
            </div>

            {/* Events List */}
            <div className="events-list">
                {filteredEvents.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-date-badge" style={{ background: event.color }}>
                            <div className="badge-day">{new Date(event.date).getDate()}</div>
                            <div className="badge-month">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                        </div>

                        <div className="event-content">
                            <div className="event-header-row">
                                <div className="event-type">
                                    <span className="type-icon">{getTypeIcon(event.type)}</span>
                                    <span className="type-label">{event.type}</span>
                                </div>
                                <span className="event-countdown">{getDaysUntil(event.date)}</span>
                            </div>

                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-description">{event.description}</p>

                            <div className="event-details">
                                <div className="detail-item">
                                    <span className="detail-icon">⏰</span>
                                    <span>{event.time} • {event.duration}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">👤</span>
                                    <span>{event.instructor}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📍</span>
                                    <span>{event.location}</span>
                                </div>
                            </div>

                            <div className="event-footer">
                                <div className="participants-info">
                                    <div className="participants-bar">
                                        <div
                                            className="participants-fill"
                                            style={{
                                                width: `${(event.participants / event.maxParticipants) * 100}%`,
                                                background: event.color
                                            }}
                                        ></div>
                                    </div>
                                    <span className="participants-text">
                                        {event.participants}/{event.maxParticipants} participants
                                    </span>
                                </div>

                                <button
                                    className={`event-btn ${event.registered ? 'registered' : 'register'}`}
                                    style={{
                                        background: event.registered ? 'var(--color-success)' : event.color
                                    }}
                                >
                                    {event.registered ? '✓ Registered' : 'Register Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="no-events">
                    <div className="no-events-icon">📭</div>
                    <p>No {filter !== 'all' ? filter + 's' : 'events'} scheduled</p>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;

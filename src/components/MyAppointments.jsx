import React, { useState } from 'react';
import toast from 'react-hot-toast';

const MyAppointments = ({ appointments = [], user, cancelAppointment }) => {
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed

    const userAppointments = appointments.filter(apt => apt.studentId === user.studentId);

    const filteredAppointments = filter === 'all'
        ? userAppointments
        : userAppointments.filter(apt => apt.status.toLowerCase() === filter);

    const stats = {
        total: userAppointments.length,
        pending: userAppointments.filter(a => a.status === 'Pending').length,
        confirmed: userAppointments.filter(a => a.status === 'Confirmed').length,
        completed: userAppointments.filter(a => a.status === 'Completed').length
    };

    const handleCancel = (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            cancelAppointment(appointmentId);
            toast.success('Appointment cancelled');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f59e0b';
            case 'Confirmed': return '#10b981';
            case 'Rejected': return '#ef4444';
            case 'Completed': return '#6366f1';
            default: return '#94a3b8';
        }
    };

    return (
        <div className="my-appointments-container glass-panel fade-in">
            <div className="appointments-header">
                <h1>📅 My Appointments</h1>
                <p className="appointments-subtitle">Manage your wellness sessions</p>
            </div>

            {/* Stats */}
            <div className="appointment-stats">
                <div className="stat-card">
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.confirmed}</div>
                    <div className="stat-label">Confirmed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
            </div>

            {/* Filters */}
            <div className="appointment-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending
                </button>
                <button
                    className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
                    onClick={() => setFilter('confirmed')}
                >
                    Confirmed
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Appointments List */}
            {filteredAppointments.length > 0 ? (
                <div className="appointments-list">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                            <div className="appointment-card-header">
                                <div className="appointment-type">
                                    <span className="type-icon">
                                        {appointment.type === 'Counseling' ? '💬' :
                                            appointment.type === 'Mental Health' ? '🧠' :
                                                appointment.type === 'Nutrition' ? '🥗' : '💪'}
                                    </span>
                                    <div>
                                        <h3>{appointment.type} Session</h3>
                                        <p className="appointment-date">
                                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="appointment-status-badge"
                                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                                >
                                    {appointment.status}
                                </div>
                            </div>

                            {appointment.reason && (
                                <div className="appointment-reason">
                                    <strong>Reason:</strong> {appointment.reason}
                                </div>
                            )}

                            {appointment.notes && (
                                <div className="appointment-notes">
                                    <strong>Admin Notes:</strong> {appointment.notes}
                                </div>
                            )}

                            <div className="appointment-footer">
                                <span className="appointment-created">
                                    Requested {new Date(appointment.createdAt).toLocaleDateString()}
                                </span>
                                {appointment.status === 'Pending' && (
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => handleCancel(appointment.id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <p>No {filter !== 'all' ? filter : ''} appointments found</p>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;

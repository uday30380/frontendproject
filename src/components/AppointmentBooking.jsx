import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AppointmentBooking = ({ user, addAppointment, onClose }) => {
    const [formData, setFormData] = useState({
        type: 'Counseling',
        date: '',
        time: '',
        reason: ''
    });

    const appointmentTypes = [
        { value: 'Counseling', label: '💬 Counseling Session', duration: '45 min' },
        { value: 'Mental Health', label: '🧠 Mental Health Consultation', duration: '60 min' },
        { value: 'Nutrition', label: '🥗 Nutrition Guidance', duration: '30 min' },
        { value: 'Fitness', label: '💪 Fitness Assessment', duration: '45 min' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.date || !formData.time) {
            toast.error('Please select date and time');
            return;
        }

        const appointment = {
            id: Date.now(),
            studentId: user.studentId,
            studentName: user.name,
            type: formData.type,
            date: formData.date,
            time: formData.time,
            reason: formData.reason,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        addAppointment(appointment);
        toast.success('Appointment request submitted!');

        if (onClose) onClose();
    };

    return (
        <div className="appointment-booking-container glass-panel p-6">
            <div className="booking-header mb-6">
                <h2 className="text-2xl font-bold mb-2">📅 Book an Appointment</h2>
                <p className="text-secondary text-lg">Schedule a session with our wellness team</p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                    <label className="form-label">Appointment Type</label>
                    <select
                        className="form-control"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                    >
                        {appointmentTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label} ({type.duration})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Preferred Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Preferred Time</label>
                        <input
                            type="time"
                            className="form-control"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Reason (Optional)</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Briefly describe the reason for your appointment..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    ></textarea>
                </div>

                <div className="booking-info p-4 rounded-lg bg-blue-50/10 border border-blue-100/20 mb-6 text-sm text-secondary">
                    <p>ℹ️ Your appointment request will be reviewed by our team. You'll receive a confirmation within 24 hours.</p>
                </div>

                <div className="booking-actions flex justify-end gap-3">
                    {onClose && (
                        <button type="button" className="btn btn-outline" onClick={onClose}>
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn btn-primary">
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentBooking;

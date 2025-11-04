
import React from 'react';

const AdminDashboard = ({ userData }) => {
  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>🎯 AI-Enhanced Admin Dashboard</h1>
            <p>Intelligent insights, risk management, and comprehensive wellness analytics.</p>
          </div>
        </div>

        <div className="admin-tabs">
          <button className="tab-btn active">Overview</button>
          <button className="tab-btn">AI Alerts</button>
          <button className="tab-btn">Analytics</button>
          <button className="tab-btn">Events</button>
          <button className="tab-btn">Leaderboard</button>
          <button className="tab-btn">Parents</button>
          <button className="tab-btn">AI Assistant</button>
        </div>

        <div className="alert-box">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <strong>3 students</strong> require immediate attention, 
            <strong> 2 high-risk</strong> and 
            <strong> 1 medium-risk</strong> alerts detected.
            <a href="#alerts">View Risk Alerts →</a>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <div className="stat-label">Total Students</div>
              <div className="stat-value">2,847</div>
              <div className="stat-change positive">📈 +12% from last month</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div>
              <div className="stat-label">At-Risk Students</div>
              <div className="stat-value">23</div>
              <div className="stat-change warning">⚠️ 5 critical alerts</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div>
              <div className="stat-label">Engagement Score</div>
              <div className="stat-value">84%</div>
              <div className="stat-change positive">✅ Above target (80%)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div>
              <div className="stat-label">Active Programs</div>
              <div className="stat-value">18</div>
              <div className="stat-change">📊 3 starting this week</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content admin-content">
          <div className="main-content">
            <div className="quick-actions-card">
              <h3>⚡ Quick Actions</h3>
              <button className="action-btn">➕ Create New Wellness Event</button>
              <button className="action-btn">📧 Send Wellness Survey</button>
              <button className="action-btn">📊 Generate Analytics Report</button>
              <button className="action-btn">🔔 Send Parent Notifications</button>
            </div>

            <div className="events-today-card">
              <h3>📅 Today's Events</h3>
              <div className="event-list">
                {[
                  { name: 'Stress Management Workshop', time: 'Today, 2:00 PM', registered: '28/30 registered', waitlist: 5, badge: 'Workshop' },
                  { name: 'Group Counseling Session', time: 'Tomorrow, 10:00 AM', registered: '12/15 registered', waitlist: 3, badge: 'Counseling' },
                  { name: 'Yoga & Mindfulness', time: 'Friday, 5:00 PM', registered: '18/25 registered', waitlist: 0, badge: 'Fitness' }
                ].map((event, index) => (
                  <div key={index} className="admin-event-item">
                    <div className="event-header">
                      <span className="event-badge">{event.badge}</span>
                      <h4>{event.name}</h4>
                    </div>
                    <div className="event-details">
                      <div className="event-time">{event.time}</div>
                      <div className="event-stats">
                        <span>{event.registered}</span>
                        {event.waitlist > 0 && <span>{event.waitlist} waitlisted</span>}
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${(parseInt(event.registered.split('/')[0])/parseInt(event.registered.split('/')[1]))*100}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-content">
            <div className="parent-notifications-card">
              <h3>👨‍👩‍👧 Parent Notifications</h3>
              <p>Send wellness updates to parents</p>
              <div className="notification-list">
                {[
                  { type: 'Monthly Report', icon: '📊', time: 'Last sent: 2 days ago' },
                  { type: 'Event Reminder', icon: '📅', time: 'Scheduled for tomorrow' },
                  { type: 'Progress Update', icon: '📈', time: 'Last sent: 1 week ago' }
                ].map((notif, index) => (
                  <div key={index} className="notification-item">
                    <div className="notif-icon">{notif.icon}</div>
                    <div>
                      <div className="notif-type">{notif.type}</div>
                      <div className="notif-time">{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

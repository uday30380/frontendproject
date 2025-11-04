import React, { useState } from 'react';

const StudentDashboard = ({ userData }) => {
  const [progress] = useState({
    mood: 2847,
    moodGrowth: '+12% from last month',
    challenges: [
      { name: '15-Minute Morning Meditation', progress: 75, total: 100 },
      { name: 'Drink 8 Glasses of Water', progress: 5, total: 8 },
      { name: 'Take 6,000 steps', progress: 4250, total: 6000 }
    ]
  });

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, Alex Johnson! 👋</h1>
            <div className="progress-badge">
              <span className="badge badge-gold">Gold</span>
              <span className="streak">🔥 7 day streak</span>
              <span className="points">2,114 / 3,000 XP</span>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{progress.mood}</div>
            <div className="stat-change positive">{progress.moodGrowth}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">At-Risk Students</div>
            <div className="stat-value">23</div>
            <div className="stat-change warning">⚠ 5 critical alerts</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Engagement Score</div>
            <div className="stat-value">84%</div>
            <div className="stat-change positive">✓ Above target (80%)</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Programs</div>
            <div className="stat-value">18</div>
            <div className="stat-change">🗓 3 starting this week</div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="main-content">
            <div className="challenge-card">
              <h3>Today's Challenges <span className="badge badge-sm">10 Available</span></h3>
              {progress.challenges.map((challenge, index) => (
                <div key={index} className="challenge-item">
                  <div className="challenge-icon">✓</div>
                  <div className="challenge-details">
                    <div className="challenge-name">{challenge.name}</div>
                    <div className="challenge-meta">
                      {challenge.progress}/{challenge.total} {typeof challenge.total === 'string' ? '' : 'completed'}
                    </div>
                  </div>
                  <div className="challenge-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${(challenge.progress/challenge.total)*100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-outline btn-sm">Explore →</button>
            </div>

            <div className="wellness-hub-section">
              <h3>Wellness Hub</h3>
              <div className="wellness-grid">
                <div className="wellness-card">
                  <div className="wellness-icon" style={{backgroundColor: 'var(--color-bg-3)'}}>❤️</div>
                  <div>
                    <h4>Mental Health Support</h4>
                    <p>24/7 access to trained counselors</p>
                    <div className="wellness-sessions">
                      Sessions: <strong>3 remaining</strong>
                    </div>
                    <button className="btn btn-sm btn-outline">Explore →</button>
                  </div>
                </div>

                <div className="wellness-card">
                  <div className="wellness-icon" style={{backgroundColor: 'var(--color-bg-1)'}}>💪</div>
                  <div>
                    <h4>Fitness Programs</h4>
                    <p>Personalized workouts with HIIT and yoga</p>
                    <div className="wellness-sessions">
                      Next: <strong>Tomorrow</strong>
                    </div>
                    <button className="btn btn-sm btn-outline">Explore →</button>
                  </div>
                </div>

                <div className="wellness-card">
                  <div className="wellness-icon" style={{backgroundColor: 'var(--color-bg-2)'}}>🥗</div>
                  <div>
                    <h4>Nutrition Guidance</h4>
                    <p>Diet planning and healthy eating habits</p>
                    <div className="wellness-sessions">
                      Time: <strong>3-5 weeks avg</strong>
                    </div>
                    <button className="btn btn-sm btn-outline">Explore →</button>
                  </div>
                </div>

                <div className="wellness-card">
                  <div className="wellness-icon" style={{backgroundColor: 'var(--color-bg-5)'}}>💬</div>
                  <div>
                    <h4>Community Support</h4>
                    <p>Connect with peers and wellness coaches</p>
                    <div className="wellness-sessions">
                      Members: <strong>137 active conversations</strong>
                    </div>
                    <button className="btn btn-sm btn-outline">Explore →</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="goals-section">
              <h3>Weekly Goal</h3>
              <div className="goals-grid">
                {[
                  { service: 'Workout Services', sessions: '5/7 sessions', progress: 71 },
                  { service: 'Meditation Minutes', sessions: '45 of 60 minutes', progress: 75 },
                  { service: 'Healthy Meals', sessions: '21/21 meals tracked', progress: 100 }
                ].map((goal, index) => (
                  <div key={index} className="goal-card">
                    <h4>{goal.service}</h4>
                    <div className="goal-progress">{goal.sessions}</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${goal.progress}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-content">
            <div className="achievement-card">
              <h3>🏆 Achievement</h3>
              <div className="achievement-list">
                {[
                  { title: 'Level 3', subtitle: 'Keep up the great work!', xp: '1,550 XP' },
                  { title: 'Level 2', subtitle: "You're making progress!", xp: '950 XP' },
                  { title: 'Level 1', subtitle: 'Just getting started!', xp: '475 XP' }
                ].map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <div className="achievement-icon">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <div className="achievement-title">{achievement.title}</div>
                      <div className="achievement-subtitle">{achievement.subtitle}</div>
                    </div>
                    <div className="achievement-xp">{achievement.xp}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="leaderboard-card">
              <h3>🏅 LeaderBoard</h3>
              <div className="leaderboard-list">
                {[
                  { name: 'Emily Chen', score: 3240, avatar: '👩' },
                  { name: 'Marcus Lee', score: 3180, avatar: '👨' },
                  { name: 'Sarah Wilson', score: 3120, avatar: '👩' },
                  { name: 'You', score: 2847, avatar: '👤', isUser: true },
                  { name: 'Jake Smith', score: 2790, avatar: '👨' }
                ].map((user, index) => (
                  <div key={index} className={`leaderboard-item ${user.isUser ? 'is-user' : ''}`}>
                    <div className="leaderboard-rank">{index + 1}</div>
                    <div className="leaderboard-avatar">{user.avatar}</div>
                    <div className="leaderboard-name">{user.name}</div>
                    <div className="leaderboard-score">{user.score}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="events-card">
              <h3>📅 Upcoming Events</h3>
              <div className="event-list">
                {[
                  { name: 'Stress Management Workshop', date: 'Today, 2:00 PM', registered: '28/30 registered', type: 'Workshop' },
                  { name: 'Group Counseling Session', date: 'Tomorrow, 10:00 AM', registered: '12/15 registered', type: 'Counseling' },
                  { name: 'Yoga & Mindfulness', date: 'Friday, 5:00 PM', registered: '18/25 registered', type: 'Fitness' }
                ].map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-type-badge">{event.type}</div>
                    <div className="event-name">{event.name}</div>
                    <div className="event-date">{event.date}</div>
                    <div className="event-registered">{event.registered}</div>
                    <div className="event-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${parseInt(event.registered.split('/')[0])/parseInt(event.registered.split('/')[1])*100}%`}}
                        ></div>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-primary">Join</button>
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

export default StudentDashboard;

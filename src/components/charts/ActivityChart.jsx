import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ActivityChart = ({ data }) => {
    // Default data if none provided
    const chartData = data || [
        { name: 'Mon', steps: 4000, water: 4, meditation: 10 },
        { name: 'Tue', steps: 3000, water: 3, meditation: 15 },
        { name: 'Wed', steps: 2000, water: 2, meditation: 5 },
        { name: 'Thu', steps: 2780, water: 5, meditation: 20 },
        { name: 'Fri', steps: 1890, water: 4, meditation: 10 },
        { name: 'Sat', steps: 2390, water: 6, meditation: 30 },
        { name: 'Sun', steps: 3490, water: 7, meditation: 45 },
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        cursor={{ fill: '#f1f5f9' }}
                    />
                    <Bar dataKey="steps" name="Steps" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meditation" name="Meditation (min)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;

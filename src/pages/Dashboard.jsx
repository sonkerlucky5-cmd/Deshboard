import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Brush } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import '../styles/dashboard.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ minWidth: '180px' }}>
        <p className="tooltip-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} /> {data.exactDate}
        </p>
        <p className="tooltip-value">${payload[0].value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        {data.transactionsCount > 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
            {data.transactionsCount} transaction(s) this day
          </p>
        )}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { transactions } = useFinance();
  const [timeframe, setTimeframe] = useState('All Time');

  // Generate deep time-based data
  const timeSeriesData = useMemo(() => {
    // Sort all transactions chronologically
    const sortedAll = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (sortedAll.length === 0) return [];

    let currentBalance = 0;
    
    // Group transactions by exact Date string
    const dailyData = {};
    
    sortedAll.forEach(t => {
      currentBalance += t.type === 'income' ? Number(t.amount) : -Number(t.amount);
      const dateObj = new Date(t.date);
      const key = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!dailyData[key]) {
        dailyData[key] = {
          dateObj,
          balance: currentBalance,
          count: 1
        };
      } else {
        dailyData[key].balance = currentBalance;
        dailyData[key].count += 1;
      }
    });

    // Convert map to array
    const rawData = Object.keys(dailyData).sort().map(key => ({
      exactDate: new Date(key).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      shortDate: new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: dailyData[key].dateObj.getTime(),
      balance: dailyData[key].balance,
      transactionsCount: dailyData[key].count
    }));

    // Filter by timeframe
    let filteredData = rawData;
    const now = new Date();
    
    if (timeframe === 'This Month') {
      filteredData = rawData.filter(d => new Date(d.timestamp).getMonth() === now.getMonth() && new Date(d.timestamp).getFullYear() === now.getFullYear());
    } else if (timeframe === 'Last 3 Months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      filteredData = rawData.filter(d => d.timestamp >= threeMonthsAgo.getTime());
    } else if (timeframe === 'This Year') {
      filteredData = rawData.filter(d => new Date(d.timestamp).getFullYear() === now.getFullYear());
    }

    return filteredData;
  }, [transactions, timeframe]);

  // Derive stats for the top bar based on the visualization scale
  const stats = useMemo(() => {
    if (timeSeriesData.length === 0) return { start: 0, end: 0, change: 0, percentage: 0 };
    const startBalance = timeSeriesData[0].balance;
    const endBalance = timeSeriesData[timeSeriesData.length - 1].balance;
    const change = endBalance - startBalance;
    const percentage = startBalance === 0 ? 0 : (change / startBalance) * 100;
    return { startBalance, endBalance, change, percentage };
  }, [timeSeriesData]);

  return (
    <div className="dashboard-page" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="dashboard-header fade-in">
        <div>
          <h2 className="dashboard-greeting">Time Based Visualization</h2>
          <p className="dashboard-subtitle">Interactive Balance Trend & Cash Flow Timeline</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {['All Time', 'This Year', 'Last 3 Months', 'This Month'].map(tf => (
            <button 
              key={tf}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                border: '1px solid var(--border)',
                background: timeframe === tf ? 'var(--primary-gradient)' : 'var(--bg-surface)',
                color: timeframe === tf ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.3s'
              }}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="summary-cards fade-in" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="summary-card" style={{ padding: '24px' }}>
          <span className="card-title">Closing Balance</span>
          <h3 className="card-value" style={{ fontSize: '2rem' }}>${stats.endBalance.toFixed(2)}</h3>
        </div>
        <div className="summary-card" style={{ padding: '24px' }}>
          <span className="card-title">Period Change</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <span className={`trend-badge ${stats.change >= 0 ? 'positive' : 'negative'}`} style={{ fontSize: '1.2rem', padding: '6px 12px' }}>
              {stats.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              ${Math.abs(stats.change).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="summary-card" style={{ padding: '24px' }}>
          <span className="card-title">Growth</span>
          <h3 className="card-value" style={{ fontSize: '2rem', color: stats.percentage >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {stats.percentage >= 0 ? '+' : ''}{stats.percentage.toFixed(1)}%
          </h3>
        </div>
      </div>

      <div className="chart-container fade-in" style={{ flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        <div className="chart-header" style={{ marginBottom: '24px' }}>
          <h2 className="chart-title">Balance Trend Over Time</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <Calendar size={16} /> Drag the brush below to zoom into a specific timeline
          </div>
        </div>
        
        <div style={{ flex: 1, width: '100%' }}>
          {timeSeriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis 
                  dataKey="shortDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }} 
                  dy={15} 
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }} 
                  dx={-10}
                  domain={['auto', 'auto']}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--primary)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="var(--primary)" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                  activeDot={{ r: 8, fill: 'var(--primary)', stroke: 'var(--bg-surface)', strokeWidth: 3 }}
                  animationDuration={1500}
                />
                
                <Brush 
                  dataKey="shortDate" 
                  height={40} 
                  stroke="var(--border-solid)" 
                  fill="var(--bg-surface-hover)"
                  tickFormatter={() => ''}
                  style={{ marginTop: '20px' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No time series data available for the selected period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

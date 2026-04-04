import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const SummaryCard = ({ title, value, icon, colorClass, trend, trendValue, sparklineData, sparklineColor }) => {
  return (
    <div className={`summary-card fade-in`}>
      <div className="card-header">
        <span className="card-title">{title}</span>
        <div className={`card-icon ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-value">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        
        {trend && (
          <div className="card-trend">
            <span className={`trend-badge ${trend === 'up' ? 'positive' : 'negative'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}%
            </span>
            <span className="trend-text">vs last month</span>
          </div>
        )}
      </div>

      {sparklineData && (
        <div className="card-sparkline">
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={sparklineData}>
              <defs>
                 <linearGradient id={`color-${title.replace(/\s+/g,'-')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sparklineColor} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={sparklineColor} stopOpacity={0} />
                 </linearGradient>
              </defs>
              <Area 
                 type="monotone" 
                 dataKey="value" 
                 stroke={sparklineColor} 
                 strokeWidth={3} 
                 fill={`url(#color-${title.replace(/\s+/g,'-')})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;

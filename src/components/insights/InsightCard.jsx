import React from 'react';

const InsightCard = ({ title, content, value, icon, variant = 'primary', delay = 0 }) => {
  return (
    <div className={`insight-card fade-in ${variant}`} style={{ animationDelay: `${delay}s` }}>
      <div className="insight-header">
        <div className={`insight-icon ${variant}`}>
          {icon}
        </div>
        <h3 className="insight-title">{title}</h3>
      </div>
      <p className="insight-content">{content}</p>
      {value && <div className="insight-value">{value}</div>}
    </div>
  );
};

export default InsightCard;

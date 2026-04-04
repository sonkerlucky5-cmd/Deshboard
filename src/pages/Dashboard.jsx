import React from 'react';
import { useFinance } from '../context/FinanceContext';
import SummaryCard from '../components/dashboard/SummaryCard';
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { balanceHistory } from '../data/mockData';
import '../styles/dashboard.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">${payload[0].value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{payload[0].name}</p>
        <p className="tooltip-value">${payload[0].value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { transactions } = useFinance();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, current) => {
      acc[current.category] = (acc[current.category] || 0) + Number(current.amount);
      return acc;
    }, {});

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Mock mini chart data mapping directly to user action vibes
  const balanceSparkline = [{ value: 1200 }, { value: 1800 }, { value: 1400 }, { value: 2200 }, { value: 2400 }, { value: 3100 }, { value: balance }];
  const incomeSparkline = [{ value: 300 }, { value: 600 }, { value: 500 }, { value: 900 }, { value: 850 }, { value: 1100 }, { value: totalIncome || 1200 }];
  const expSparkline = [{ value: 400 }, { value: 300 }, { value: 600 }, { value: 450 }, { value: 700 }, { value: 550 }, { value: totalExpense || 600 }];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header fade-in">
        <div>
          <h2 className="dashboard-greeting">Overview Analytics <span style={{fontSize: '1.5rem'}}>🚀</span></h2>
          <p className="dashboard-subtitle">Here is a top-level summary of your financial health.</p>
        </div>
        <button className="download-report-btn">
          <Activity size={18} style={{color: "var(--primary)"}} />
          Generate Report
        </button>
      </div>

      <div className="summary-cards">
        <SummaryCard 
          title="Total Balance" 
          value={balance} 
          icon={<DollarSign size={24} strokeWidth={2.5}/>}
          colorClass="icon-blue"
          trend="up"
          trendValue={14.2}
          sparklineData={balanceSparkline}
          sparklineColor="#6366f1"
        />
        <SummaryCard 
          title="Net Income" 
          value={totalIncome} 
          icon={<ArrowUpRight size={24} strokeWidth={2.5}/>}
          colorClass="icon-green"
          trend="up"
          trendValue={8.4}
          sparklineData={incomeSparkline}
          sparklineColor="#10b981"
        />
        <SummaryCard 
          title="Total Expenses" 
          value={totalExpense} 
          icon={<ArrowDownRight size={24} strokeWidth={2.5}/>}
          colorClass="icon-red"
          trend="down"
          trendValue={2.1}
          sparklineData={expSparkline}
          sparklineColor="#f43f5e"
        />
      </div>

      <div className="charts-row">
        <div className="chart-container fade-in" style={{animationDelay: '0.1s'}}>
          <div className="chart-header">
            <h2 className="chart-title">Revenue & Cash Flow</h2>
            <select className="chart-filter"><option>This Year</option><option>Last 6 Months</option></select>
          </div>
          <div style={{ height: '350px', width: '100%', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceHistory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalanceGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--text-muted)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                   type="monotone" 
                   dataKey="balance" 
                   stroke="url(#colorBalanceGrid)" 
                   strokeWidth={4} 
                   fillOpacity={1} 
                   fill="url(#colorBalanceGrid)" 
                   activeDot={{ r: 8, fill: '#6366f1', stroke: 'var(--bg-surface)', strokeWidth: 3 }} 
                   animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container fade-in" style={{animationDelay: '0.2s'}}>
          <div className="chart-header">
            <h2 className="chart-title">Spending Architecture</h2>
          </div>
          <div style={{ height: '340px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={115}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 8px 12px ${COLORS[index % COLORS.length]}40)` }} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>No expense data to analyze yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

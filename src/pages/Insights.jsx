import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import InsightCard from '../components/insights/InsightCard';
import { TrendingUp, TrendingDown, AlertCircle, Award } from 'lucide-react';
import '../styles/insights.css';

const Insights = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});
    
    let highestCategory = '';
    let highestAmount = 0;
    
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > highestAmount) {
        highestAmount = amount;
        highestCategory = cat;
      }
    });

    const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

    let largestTx = null;
    transactions.forEach(t => {
      if (!largestTx || Number(t.amount) > Number(largestTx.amount)) {
        largestTx = t;
      }
    });

    return {
      highestCategory,
      highestAmount,
      savingsRate,
      largestTx,
      totalIncome,
      totalExpense
    };
  }, [transactions]);

  return (
    <div className="insights-page fade-in">
      <div className="insights-grid">
        <InsightCard 
          title="Top Spending Category"
          content={`Your highest spending is on ${insights.highestCategory || 'None'}, which takes up a significant portion of your budget.`}
          value={`$${insights.highestAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
          icon={<AlertCircle size={24} />}
          variant="warning"
          delay={0.1}
        />
        
        <InsightCard 
          title="Savings Rate"
          content={`You are currently saving ${insights.savingsRate}% of your total income. Aim for at least 20% for healthy finances.`}
          value={`${insights.savingsRate}%`}
          icon={insights.savingsRate >= 20 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          variant={insights.savingsRate >= 20 ? "success" : "danger"}
          delay={0.2}
        />

        {insights.largestTx && (
          <InsightCard 
            title="Largest Transaction"
            content={`Your single largest transaction was a ${insights.largestTx.type} for ${insights.largestTx.category} on ${new Date(insights.largestTx.date).toLocaleDateString()}.`}
            value={`$${Number(insights.largestTx.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}`}
            icon={<Award size={24} />}
            variant="primary"
            delay={0.3}
          />
        )}
      </div>
    </div>
  );
};

export default Insights;

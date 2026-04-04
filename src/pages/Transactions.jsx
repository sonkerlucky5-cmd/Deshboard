import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import TransactionModal from '../components/transactions/TransactionModal';
import '../styles/transactions.css';

const Transactions = () => {
  const { transactions, role, deleteTransaction, addTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.category.toLowerCase().includes(lowercasedSearch) ||
        t.amount.toString().includes(lowercasedSearch) ||
        t.type.toLowerCase().includes(lowercasedSearch)
      );
    }

    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortConfig]);

  return (
    <div className="transactions-page fade-in">
      <div className="table-header-area">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          {role === 'Admin' && (
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="table-container fade-in" style={{animationDelay: '0.1s'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Date {sortConfig.key === 'date' && <ArrowUpDown size={14} />}
                </div>
              </th>
              <th onClick={() => handleSort('category')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Category {sortConfig.key === 'category' && <ArrowUpDown size={14} />}
                </div>
              </th>
              <th onClick={() => handleSort('type')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Type {sortConfig.key === 'type' && <ArrowUpDown size={14} />}
                </div>
              </th>
              <th onClick={() => handleSort('amount')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Amount {sortConfig.key === 'amount' && <ArrowUpDown size={14} />}
                </div>
              </th>
              {role === 'Admin' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTransactions.length > 0 ? (
              filteredAndSortedTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.category}</td>
                  <td>
                    <span className={`badge ${tx.type}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500', color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                  </td>
                  {role === 'Admin' && (
                    <td>
                      <button className="icon-btn" onClick={() => deleteTransaction(tx.id)} style={{ width: '32px', height: '32px' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'Admin' ? 5 : 4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <TransactionModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={addTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;

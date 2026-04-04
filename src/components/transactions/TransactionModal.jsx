import React, { useState } from 'react';
import { X } from 'lucide-react';

const TransactionModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: Number(formData.amount)
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Transaction</h2>
          <button type="button" className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input 
              type="number" 
              name="amount" 
              className="form-input" 
              value={formData.amount} 
              onChange={handleChange} 
              placeholder="0.00"
              required 
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <input 
              type="text" 
              name="category" 
              className="form-input" 
              value={formData.category} 
              onChange={handleChange} 
              placeholder="e.g. Groceries"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              type="date" 
              name="date" 
              className="form-input" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

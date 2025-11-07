import React from 'react';

const ExpenseCard = ({ transaction, onDelete }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'Food and Drinks': '🍔',
      'Shopping': '🛍️',
      'Housing': '🏠',
      'Transportation': '🚗',
      'Vehicle': '🚙',
      'Entertainment': '🎮',
      'Other': '📦',
    };
    return icons[category] || '💰';
  };

  return (
    <div className="transaction-card">
      <div className="transaction-card-left">
        <div className="transaction-icon">
          {transaction.type === 'income' ? '💰' : getCategoryIcon(transaction.category)}
        </div>
        <div>
          <p className="transaction-title">{transaction.title}</p>
          <p className="transaction-meta">
            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="transaction-card-right">
        <p className={`transaction-amount ${transaction.type === 'income' ? 'income' : 'expense'}`}>
          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
        </p>
        <button className="delete-button" onClick={() => onDelete(transaction._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
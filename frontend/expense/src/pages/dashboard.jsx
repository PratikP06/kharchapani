import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Logo from '../assets/logo.png';
const Dashboard = ({ balance, transactions }) => {
  const [chartData, setChartData] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});

  useEffect(() => {
    if (transactions.length > 0) {
      const last7Days = transactions.slice(0, 7).reverse();
      const data = last7Days.map((t) => ({
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.abs(t.amount),
      }));
      setChartData(data);

      const totals = {};
      transactions.forEach((t) => {
        if (t.type === 'expenses') {
          totals[t.category] = (totals[t.category] || 0) + t.amount;
        }
      });
      setCategoryTotals(totals);
    }
  }, [transactions]);

  const todayTransactions = transactions.filter((t) => {
    const today = new Date().toDateString();
    return new Date(t.date).toDateString() === today;
  });

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
    <div className="dashboard">
      <div className="header">
         <div className="logo">
                <img src= {Logo} alt="" />
              </div>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back!</p>
        </div>
        <div className="balance-card">
          <p className="balance-label">Total Balance</p>
          <h2 className="balance-amount">₹{balance.toLocaleString()}</h2>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="section-title">Spending Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#4A90E2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="content-grid">
        <div className="today-section">
          <h3 className="section-title">Today</h3>
          {todayTransactions.length === 0 ? (
            <p className="empty-state">No transactions today</p>
          ) : (
            todayTransactions.map((t) => (
              <div key={t._id} className="transaction-item">
                <div className="transaction-icon">
                  {getCategoryIcon(t.category)}
                </div>
                <div className="transaction-details">
                  <p className="transaction-title">{t.title}</p>
                  <p className="transaction-category">{t.category}</p>
                </div>
                <p className={`transaction-amount ${t.type === 'income' ? 'income' : 'expense'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="categories-section">
          <h3 className="section-title">Where your money go?</h3>
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category} className="category-item">
              <div className="category-info">
                <span>{getCategoryIcon(category)}</span>
                <span className="category-name">{category}</span>
              </div>
              <span className="category-amount">₹{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
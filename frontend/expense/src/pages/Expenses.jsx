import React, { useState } from "react";
import ExpenseCard from "../components/ExpenseCard";


const Expenses = ({ transactions, onAddTransaction, onDeleteTransaction }) => {
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    category: "Other",
    type: "expense",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTransaction.title || !newTransaction.amount) return;
    onAddTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      date: new Date().toISOString(),
      _id: Date.now().toString(),
    });
    setNewTransaction({
      title: "",
      amount: "",
      category: "Other",
      type: "expense",
    });
  };

  return (
    <div className="expenses-page">
      
      <div></div>
      
      <h1 className="page-title">Transactions</h1>
      <p className="page-subtitle">Manage your expenses and income</p>

      <form onSubmit={handleSubmit} className="add-transaction-form">
        <input
          type="text"
          placeholder="Title"
          value={newTransaction.title}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, title: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, amount: e.target.value })
          }
        />
        <select
          value={newTransaction.category}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, category: e.target.value })
          }
        >
          <option>Food and Drinks</option>
          <option>Shopping</option>
          <option>Housing</option>
          <option>Transportation</option>
          <option>Vehicle</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
        <select
          value={newTransaction.type}
          onChange={(e) =>
            setNewTransaction({ ...newTransaction, type: e.target.value })
          }
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p className="empty-state">No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <ExpenseCard
              key={t._id}
              transaction={t}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Expenses;

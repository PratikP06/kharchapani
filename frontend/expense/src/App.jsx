import React, { useState } from "react";
import { useEffect } from "react";
import Login from "../src/components/Auth/Login";
import Register from "../src/components/Auth/Register";
import Sidebar from "../src/components/Sidebar";
import Dashboard from "../src/pages/dashboard";
import ExpenseCard from "../src/components/ExpenseCard";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL;

const api = {
  register: async (data) => {
    const res = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (data) => {
    const res = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getBalance: async () => {
    const res = await fetch(`${API_URL}/transaction/bal`, {
      credentials: "include",
    });
    return res.json();
  },

  getTransactions: async () => {
    const res = await fetch(`${API_URL}/transaction/all`, {
      credentials: "include",
    });
    return res.json();
  },

  addTransaction: async (data) => {
    const res = await fetch(`${API_URL}/transaction/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteTransaction: async (id) => {
    const res = await fetch(`${API_URL}/transaction/del/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },

  checkAuth: async () => {
    const res = await fetch(`${API_URL}/user/check`, {
      credentials: "include",
    });
    return res.json();
  },
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    category: "Other",
    type: "expense",
  });

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const result = await api.checkAuth();
        if (result.status === "success") {
          setUser(result.user);
          setIsAuthenticated(true);
          await fetchData();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    verifyUser();
  }, []); 

  const fetchData = async () => {
    const balanceData = await api.getBalance();
    const transactionsData = await api.getTransactions();

    if (balanceData.status === "success") {
      setBalance(balanceData.balance);
    }

    if (transactionsData.status === "success") {
      setTransactions(transactionsData.transactions);
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    await fetchData();
  };

  const handleRegister = async (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    await fetchData();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setTransactions([]);
    setBalance(0);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const data = {
      title: newTransaction.title,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      type: newTransaction.type === "income" ? "income" : "expenses", 
      date: new Date().toISOString(),
    };

    const result = await api.addTransaction(data);
    if (result.status === "success") {
      await fetchData();
      setShowAddForm(false);
      setNewTransaction({
        title: "",
        amount: "",
        category: "Other",
        type: "expense",
      });
    }
  };

  const handleDeleteTransaction = async (id) => {
    const result = await api.deleteTransaction(id);
    if (result.status === "success") {
      await fetchData();
    }
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={handleRegister}
        onShowLogin={() => setShowRegister(false)}
        api={api}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setShowRegister(true)}
        api={api}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <div className="main-content">
        {currentPage === "dashboard" ? (
          <Dashboard balance={balance} transactions={transactions} />
        ) : (
          <div className="expenses">
            <div className="header">
              <div>
                <h1 className="page-title">Transactions</h1>
                <p className="page-subtitle">Manage your expenses and income</p>
              </div>
              <button
                className="add-btn"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? "Close" : "+ Add Transaction"}
              </button>
            </div>

            {showAddForm && (
              <form
                className="add-transaction-form"
                onSubmit={handleAddTransaction}
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={newTransaction.title}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      title: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                />
                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value,
                    })
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
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <button type="submit">Save</button>
              </form>
            )}

            <div className="transactions-list">
              {transactions.length === 0 ? (
                <p className="empty-state">No transactions yet</p>
              ) : (
                transactions.map((t) => (
                  <ExpenseCard
                    key={t._id}
                    transaction={t}
                    onDelete={handleDeleteTransaction}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import './Auth.css';

const Login = ({ onLogin, onShowRegister, api }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const result = await api.login({ email, password });
    
    if (result.message === 'Login successful!') {
      onLogin(result.user);
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-div">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button onClick={handleSubmit} className="button">Sign In</button>
        </div>
        
        <p className="switch-auth">
          Don't have an account?{' '}
          <span onClick={onShowRegister} className="link">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
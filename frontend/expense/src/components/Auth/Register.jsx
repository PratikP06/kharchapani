import React, { useState } from 'react';
import './Auth.css';

const Register = ({ onRegister, onShowLogin, api }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    const result = await api.register({ name, email, password });
    
    if (result.message === 'User registered successfully') {
      onRegister(result.user);
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us today</p>
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-div">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
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
          <button onClick={handleSubmit} className="button">Sign Up</button>
        </div>
        
        <p className="switch-auth">
          Already have an account?{' '}
          <span onClick={onShowLogin} className="link">Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/user/login', { username, password });
      localStorage.setItem('token', res.data.token);
      history.push('/');
      window.location.reload();
    } catch (err) {
      console.error('Login Error:', err.response?.data);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            data-cy="login-username-input" // <-- ADD THIS LINE
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-cy="login-password-input" // <-- ADD THIS LINE
          />
        </div>
        <button type="submit" className="submit-btn" data-cy="login-submit-button"> {/* <-- ADD THIS LINE */}
          Login
        </button>
        <p className="switch-form-text">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
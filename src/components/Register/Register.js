
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/register', { username, password });
      alert('Registration successful! Please log in.');
      history.push('/login');
    } catch (err) {
      console.error('Registration Error:', err.response?.data);
      alert('Registration failed. The username may already be taken.');
    }
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            data-cy="register-username-input" // <-- ADD THIS LINE
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-cy="register-password-input" // <-- ADD THIS LINE
          />
        </div>
        <button type="submit" className="submit-btn" data-cy="register-submit-button"> {/* <-- ADD THIS LINE */}
          Register
        </button>
        <p className="switch-form-text">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
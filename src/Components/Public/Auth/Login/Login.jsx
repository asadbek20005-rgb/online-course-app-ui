import React, { useState } from 'react';
import './Login.css';

export const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('https://localhost:7265/api/public/Auth/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      setMessage('Login successful!');
    } else {
      setMessage(data.message || 'Login failed!');
    }
  } catch (error) {
    setMessage('Error: ' + error.message);
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <input
          type="text"
          placeholder="Identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

/** Response model: public record TokenDto(string accessToken, string refreshToken);
  Local storage ga save qilish kerak*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [showPasswordIntake, setShowPasswordIntake] = useState(false);
  const [adminValidationMessage, setAdminValidationMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Login successful!');
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('appikey', data.apiKey);

        const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
        if (formData.email === adminEmail) {
          setShowPasswordIntake(true);
        } else {
          onLoginSuccess();
          navigate('/'); 
        }
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('Error connecting to backend.');
      console.error('Error:', error);
    }
  };

  const handleAdminPasswordSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const adminPasswordValidationUrl = process.env.REACT_APP_ADMIN_PASSWORD_URL;
    console.log('Admin Password Validation URL:', adminPasswordValidationUrl);
    console.log('Token:', token);  
    try {
      const response = await fetch(adminPasswordValidationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdminValidationMessage('Admin validated successfully!');
        setShowPasswordIntake(false);
        onLoginSuccess();

        navigate('/admin-dashboard');
      } else {
        setAdminValidationMessage(data.message || 'Invalid admin password.');
      }
    } catch (error) {
      setAdminValidationMessage('Error connecting to admin password validation API.');
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Log In</button>
      </form>
      {message && <p>{message}</p>}

      {showPasswordIntake && (
        <div>
          <h3>Admin: Verify Password</h3>
          <form onSubmit={handleAdminPasswordSubmit}>
            <input
              type="password"
              name="password"
              placeholder="Enter Admin Password"
              value={formData.password}
              onChange={handleChange}
              required
            /><br /><br />
            <button type="submit">Verify Admin Password</button>
          </form>
          {adminValidationMessage && <p>{adminValidationMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default Login;

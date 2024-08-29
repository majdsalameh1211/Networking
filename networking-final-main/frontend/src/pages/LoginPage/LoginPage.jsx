import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { loginUser, handleInputChange } from './loginUtils';

/**
 * LoginPage component handles user login functionality.
 * It includes input fields for email and password, and links for registration and password reset.
 *
 * @param {function} setAuth - Function to set the authentication state in the parent component.
 */
const LoginPage = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }); // State to store form data (email and password).
  const [error, setError] = useState(''); // State to handle and display login errors.
  const navigate = useNavigate(); // Hook to navigate between routes.
  const { setCurrentUser } = useUser(); // Hook to set the current user in context.

  /**
   * Handle changes in the input fields and update the formData state.
   * @param {Object} e - The event object from the input field.
   */
  const handleChange = (e) => {
    handleInputChange(e, formData, setFormData);
  };

  /**
   * Handle form submission for login.
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(formData, setCurrentUser, setAuth, navigate, setError);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="login-links">
          <p>
            Don't have an account? <Link to="/register" className="login-link">Sign up</Link>
          </p>
          <p className="login-reset">
            Forgot your password? <Link to="/forgot-password" className="login-link">Reset it</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

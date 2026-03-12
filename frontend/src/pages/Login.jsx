import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Auth.css'; // We'll create this next

export const Login = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { login } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const from = location.state?.from?.pathname || '/dashboard';

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
         await login(username, password);
         navigate(from, { replace: true });
      } catch (err) {
         setError('Invalid username or password');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-card">
            <h2>Login</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
               <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                     type="text"
                     id="username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                     disabled={isLoading}
                  />
               </div>
               <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     id="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     disabled={isLoading}
                  />
               </div>
               <button type="submit" className="auth-button" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
               </button>
            </form>
         </div>
      </div>
   );
};

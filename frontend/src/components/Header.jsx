import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">🚀 Hackathon Admin</h1>
        <nav className="navbar">
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            {user && (
              <li>
                <button onClick={handleLogout} className="logout-btn" style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

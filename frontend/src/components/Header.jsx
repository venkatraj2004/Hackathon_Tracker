import React from 'react'
import './Header.css'

export function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">🚀 Hackathon Admin</h1>
        <nav className="navbar">
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#leaderboard">Leaderboard</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

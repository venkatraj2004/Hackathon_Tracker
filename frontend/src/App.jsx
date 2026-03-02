import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { Teams } from './pages/Teams'
import { Leaderboard } from './pages/Leaderboard'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'dashboard'
      setCurrentPage(hash)
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (page) => {
    window.location.hash = page
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'teams':
        return <Teams />
      case 'leaderboard':
        return <Leaderboard />
      case 'dashboard':
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import { teamService } from '../services/api'
import './Leaderboard.css'

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await teamService.getLeaderboard()
      setLeaderboard(data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="leaderboard">
      <div className="container">
        <h1>🏆 Leaderboard</h1>
        <p className="subtitle">Final rankings of all participating teams</p>

        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-team">Team Name</div>
            <div className="col-total">Total Score</div>
          </div>

          {leaderboard.map((team, index) => (
            <div key={team.teamId} className={`table-row rank-${index + 1}`}>
              <div className="col-rank">
                <span className="rank-badge">{team.rank || index + 1}</span>
              </div>
              <div className="col-team">
                <strong>{team.teamName}</strong>
              </div>
              <div className="col-total">
                <span className="total-badge">{team.total ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

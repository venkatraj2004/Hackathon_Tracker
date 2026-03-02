import React, { useState, useEffect } from 'react'
import { teamService } from '../services/api'
import { HACKATHON_INFO } from '../constants/index.js'
import './Dashboard.css'

export function Dashboard() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [formData, setFormData] = useState({ description: '', memberCount: 2 })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const data = await teamService.getAll()
      setTeams(data)
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeam = async (e) => {
    e.preventDefault()
    try {
      // TODO: Call create team API
      const newTeam = {
        id: teams.length + 1,
        ...formData,
        score: 0,
        submissionStatus: 'pending'
      }
      setTeams([...teams, newTeam])
      setFormData({ description: '', memberCount: 2 })
      setShowAddTeam(false)
    } catch (error) {
      console.error('Failed to add team:', error)
    }
  }

  const handleDelete = async (teamId) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        await teamService.delete(teamId)
        setTeams(teams.filter(t => t.id !== teamId))
      } catch (error) {
        console.error('Failed to delete team:', error)
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="header-section">
          <div>
            <h1>{HACKATHON_INFO.NAME}</h1>
            <p className="subtitle">{HACKATHON_INFO.DATE} • {HACKATHON_INFO.LOCATION}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddTeam(!showAddTeam)}>
            + Add Team
          </button>
        </div>

        {showAddTeam && (
          <form className="add-team-form" onSubmit={handleAddTeam}>
            <textarea
              placeholder="Team Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Number of Members (2-4)"
              value={formData.memberCount}
              onChange={(e) => setFormData({...formData, memberCount: parseInt(e.target.value)})}
              min="2"
              max="4"
              required
            />
            <div className="form-actions">
              <button type="submit" className="btn btn-success">Create</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddTeam(false)}>Cancel</button>
            </div>
          </form>
        )}

        <section className="teams-section">
          <h2>Participating Teams ({teams.length})</h2>
          <div className="teams-table">
            <div className="table-header">
              <div className="col-name">Team Name</div>
              <div className="col-members">Members</div>
              <div className="col-description">Description</div>
              <div className="col-status">Status</div>
              <div className="col-score">Score</div>
              <div className="col-actions">Actions</div>
            </div>
            {teams.map((team) => (
              <div className="table-row" key={team.id}>
                <div className="col-name"><strong>{team.name}</strong></div>
                <div className="col-members">{team.memberCount}</div>
                <div className="col-description">{team.description}</div>
                <div className="col-status">
                  <span className={`badge badge-${team.submissionStatus}`}>
                    {team.submissionStatus}
                  </span>
                </div>
                <div className="col-score"><strong>{team.score}/100</strong></div>
                <div className="col-actions">
                  <a href={`/teams/${team.id}`} className="btn-link">Edit</a>
                  <button className="btn-link delete" onClick={() => handleDelete(team.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

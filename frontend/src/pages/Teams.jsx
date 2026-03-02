import React, { useState, useEffect } from 'react'
import { TeamCard } from '../components/TeamCard'
import { MarksEditor } from '../components/MarksEditor'
import { teamService, marksService } from '../services/api'
import './Teams.css'

export function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeamForMarks, setSelectedTeamForMarks] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
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
      const newTeam = await teamService.create(formData)
      setTeams([...teams, newTeam])
      setFormData({ description: '', memberCount: 2 })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add team:', error)
    }
  }

  const handleDeleteTeam = (teamId) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter(t => t.id !== teamId))
    }
  }

  const handleSaveMarks = async (marksData) => {
    try {
      await marksService.updateMarks(marksData.teamId, marksData.score)
      setTeams(teams.map(t => 
        t.id === marksData.teamId 
          ? { ...t, score: marksData.score }
          : t
      ))
      setSelectedTeamForMarks(null)
    } catch (error) {
      console.error('Failed to save marks:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="teams-page">
      <div className="container">
        <div className="page-header">
          <h1>👥 Teams Management</h1>
          <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            + Add Team
          </button>
        </div>

        {showAddForm && (
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
            <div className="form-buttons">
              <button type="submit" className="btn btn-success">Create Team</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="teams-grid">
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => setSelectedTeamForMarks(team)}
              onDelete={() => handleDeleteTeam(team.id)}
            />
          ))}
        </div>

        {teams.length === 0 && (
          <div className="empty-state">
            <p>No teams yet. Create one to get started!</p>
          </div>
        )}

        {selectedTeamForMarks && (
          <MarksEditor
            team={selectedTeamForMarks}
            onSave={handleSaveMarks}
            onCancel={() => setSelectedTeamForMarks(null)}
          />
        )}
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { teamService, marksService } from '../services/api'
import { HACKATHON_INFO } from '../constants/index.js'
import { TeamCard } from '../components/TeamCard'
import { MarksEditor } from '../components/MarksEditor'
import './Dashboard.css'
import '../pages/Teams.css'

export function Dashboard() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddTeam, setShowAddTeam] = useState(false)

  // Add Team Form State
  const [teamName, setTeamName] = useState('')
  const [memberCount, setMemberCount] = useState(2)
  const [members, setMembers] = useState([{ name: '', role: '' }, { name: '', role: '' }])

  const [selectedTeamForMarks, setSelectedTeamForMarks] = useState(null)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const data = await teamService.getAll()
      // Sort by teamId descending for newest first
      setTeams(data.sort((a, b) => b.teamId - a.teamId))
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberCountChange = (count) => {
    const newCount = Math.min(Math.max(parseInt(count) || 2, 2), 4)
    setMemberCount(newCount)

    // Adjust members array size
    setMembers(prev => {
      const newMembers = [...prev]
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) {
          newMembers.push({ name: '', role: '' })
        }
      } else if (newCount < prev.length) {
        newMembers.splice(newCount)
      }
      return newMembers
    })
  }

  const handleMemberChange = (index, field, value) => {
    setMembers(prev => {
      const newMembers = [...prev]
      newMembers[index] = { ...newMembers[index], [field]: value }
      return newMembers
    })
  }

  const handleAddTeam = async (e) => {
    e.preventDefault()
    try {
      // Create team payload. Assuming teamName is passed in member for now if backend doesn't accept root teamName, 
      // but let's try to pass the members first as expected by api List<Member>.
      // We will inject the teamName into the first member's team mapping conceptually, 
      // though the backend expects just members. 
      // Let's pass the members array.
      // We will append a "Team Name: X" role or find a way. Actually, let's just create the members and hope backend handles team generation correctly.
      // Wait, teamName is needed. We will pass a single JSON containing teamName and members array if needed, but for now we follow the exact backend requirement or adjust appropriately.
      // Let's pass the full payload to register. We'll send an array of objects where we might need to include { team: {teamName: ...}, name, role }

      const payload = members.map(m => ({
        name: m.name,
        role: m.role,
        team: {
          teamName: teamName
        }
      }))

      await teamService.register(payload)

      // Refresh teams
      await fetchTeams()

      // Reset form
      setTeamName('')
      setMemberCount(2)
      setMembers([{ name: '', role: '' }, { name: '', role: '' }])
      setShowAddTeam(false)
    } catch (error) {
      console.error('Failed to add team:', error)
      alert("Failed to register team.")
    }
  }

  const handleSaveMarks = async (marksData) => {
    try {
      await marksService.updateMarks(marksData.teamId, marksData.sprintNo, marksData.score)
      await fetchTeams()
      setSelectedTeamForMarks(null)
    } catch (error) {
      console.error('Failed to save marks:', error)
      alert("Failed to save marks.")
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard teams-page">
      <div className="container">
        <div className="page-header header-section" style={{ marginBottom: "2rem" }}>
          <div>
            <h1>{HACKATHON_INFO.NAME} Dashboard</h1>
            <p className="subtitle">{HACKATHON_INFO.DATE} • {HACKATHON_INFO.LOCATION}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddTeam(!showAddTeam)}>
            {showAddTeam ? '- Cancel' : '+ Add Team'}
          </button>
        </div>

        {showAddTeam && (
          <form className="add-team-form" onSubmit={handleAddTeam} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginTop: 0 }}>Register New Team</h3>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                style={{ flex: 1 }}
              />

              <input
                type="number"
                placeholder="Members (2-4)"
                value={memberCount}
                onChange={(e) => handleMemberCountChange(e.target.value)}
                min="2"
                max="4"
                required
                style={{ width: '150px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              {members.map((member, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                  <h4 style={{ marginTop: 0 }}>Member {idx + 1}</h4>
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '0.5rem', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Developer, Designer)"
                    value={member.role}
                    onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                    required
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>

            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-success">Create Team</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddTeam(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="teams-grid">
          {teams.map(team => (
            <TeamCard
              key={team.teamId}
              team={team}
              onMarks={() => setSelectedTeamForMarks(team)}
            />
          ))}
        </div>

        {teams.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '8px' }}>
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

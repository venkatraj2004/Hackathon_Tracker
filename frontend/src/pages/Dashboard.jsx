import React, { useState, useEffect } from 'react'
import { teamService, marksService, memberService } from '../services/api'
import { HACKATHON_INFO } from '../constants/index.js'
import { TeamCard } from '../components/TeamCard'
import { MarksEditor } from '../components/MarksEditor'
import './Dashboard.css'
import '../pages/Teams.css'

export function Dashboard() {
  const [teams, setTeams] = useState([])
  const [unassignedMembers, setUnassignedMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddTeam, setShowAddTeam] = useState(false)

  // Add Team Form State
  const [memberCount, setMemberCount] = useState(2)
  // `memberId` will store the ID of the selected existing member, `role` will store their role in the team.
  const [formMembers, setFormMembers] = useState([{ memberId: '', role: '' }, { memberId: '', role: '' }])

  const [selectedTeamForMarks, setSelectedTeamForMarks] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      const [teamsData, membersData] = await Promise.all([
        teamService.getAll(),
        memberService.getAll().catch(() => []) // Fallback to empty array if endpoint fails
      ])

      // Sort by teamId descending for newest first
      setTeams(teamsData.sort((a, b) => b.teamId - a.teamId))

      // Filter out members who already have a team
      // Because the backend /members API doesn't include the team reference,
      // we check if the member ID exists in any team's member list.
      const assignedMemberIds = new Set()
      teamsData.forEach(team => {
        if (team.members) {
          team.members.forEach(m => assignedMemberIds.add(String(m.id || m.memberId)))
        }
      })

      const available = membersData.filter(m => !assignedMemberIds.has(String(m.id)))
      setUnassignedMembers(available)

    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberCountChange = (count) => {
    // Cannot exceed available members or max 4.
    const maxAllowed = Math.min(4, Math.max(2, unassignedMembers.length));
    const newCount = Math.min(Math.max(parseInt(count) || 2, 2), maxAllowed)
    setMemberCount(newCount)

    // Adjust members array size
    setFormMembers(prev => {
      const newMembers = [...prev]
      if (newCount > prev.length) {
        for (let i = prev.length; i < newCount; i++) {
          newMembers.push({ memberId: '', role: '' })
        }
      } else if (newCount < prev.length) {
        newMembers.splice(newCount)
      }
      return newMembers
    })
  }

  const handleMemberChange = (index, field, value) => {
    setFormMembers(prev => {
      const newMembers = [...prev]
      newMembers[index] = { ...newMembers[index], [field]: value }
      return newMembers
    })
  }

  // Get currently selected member IDs to disable them in other dropdowns
  const selectedMemberIds = formMembers.map(m => m.memberId).filter(Boolean)

  const handleAddTeam = async (e) => {
    e.preventDefault()
    try {
      // Validate: ensure all slots have a selected member and a role
      if (formMembers.some(m => !m.memberId || !m.role.trim())) {
        alert("Please select a member and enter a role for all slots.")
        return
      }

      // Build payload structure
      const payload = formMembers.map(m => ({
        id: parseInt(m.memberId),
        role: m.role.trim()
      }))

      await teamService.register(payload)

      // Refresh data
      await fetchData()

      // Reset form
      setMemberCount(2)
      setFormMembers([{ memberId: '', role: '' }, { memberId: '', role: '' }])
      setShowAddTeam(false)
    } catch (error) {
      console.error('Failed to add team:', error)
      alert("Failed to register team.")
    }
  }

  const handleSaveMarks = async (marksData) => {
    try {
      await marksService.updateMarks(marksData.teamId, marksData.sprintNo, marksData.score)
      await fetchData()
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

            {unassignedMembers.length < 2 && (
              <div style={{ padding: '1rem', background: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '1rem' }}>
                <strong>Warning:</strong> Need at least 2 unassigned members to form a team. Currently available: {unassignedMembers.length}.
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Members (2-4)"
                value={memberCount}
                onChange={(e) => handleMemberCountChange(e.target.value)}
                min="2"
                max={Math.min(4, Math.max(2, unassignedMembers.length))}
                required
                style={{ width: '150px' }}
                disabled={unassignedMembers.length < 2}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              {formMembers.map((member, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px' }}>
                  <h4 style={{ marginTop: 0 }}>Member {idx + 1}</h4>

                  <select
                    value={member.memberId}
                    onChange={(e) => handleMemberChange(idx, 'memberId', e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '0.5rem', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    disabled={unassignedMembers.length < 2}
                  >
                    <option value="" disabled>Select an available member</option>
                    {unassignedMembers.map(um => (
                      <option
                        key={um.id}
                        value={um.id}
                        disabled={selectedMemberIds.includes(String(um.id)) && member.memberId !== String(um.id)}
                      >
                        {um.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Role (e.g., Developer, Designer)"
                    value={member.role}
                    onChange={(e) => handleMemberChange(idx, 'role', e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    disabled={unassignedMembers.length < 2}
                  />
                </div>
              ))}
            </div>

            <div className="form-actions" style={{ marginTop: '1.5rem' }}>
              <button
                type="submit"
                className="btn btn-success"
                disabled={unassignedMembers.length < 2}
              >
                Create Team
              </button>
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

import React from 'react'
import './TeamCard.css'

export function TeamCard({ team, onMarks }) {
  const members = team.members || [];

  return (
    <div className="team-card">
      <div className="team-header">
        <h3>{team.teamName}</h3>
      </div>

      <div className="members-list">
        <strong>Members:</strong>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#555', fontSize: '0.9rem' }}>
          {members.map(m => (
            <li key={m.id}>{m.name} <em>({m.role})</em></li>
          ))}
        </ul>
      </div>

      <div className="team-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="info-item">
          <span className="label">Sprint 1:</span>
          <span className="value">{team.sprint1 ?? '-'}</span>
        </div>
        <div className="info-item">
          <span className="label">Sprint 2:</span>
          <span className="value">{team.sprint2 ?? '-'}</span>
        </div>
        <div className="info-item">
          <span className="label">Sprint 3:</span>
          <span className="value">{team.sprint3 ?? '-'}</span>
        </div>
        <div className="info-item" style={{ borderTop: '1px solid #eee', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
          <span className="label" style={{ color: '#333' }}>Total Score:</span>
          <span className="value"><strong>{team.total ?? 0}/100</strong></span>
        </div>
      </div>
      <div className="team-actions">
        <button className="btn-action btn-marks" onClick={() => onMarks(team)}>
          📊 Update Marks
        </button>
      </div>
    </div>
  )
}

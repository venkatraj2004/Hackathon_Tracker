import React from 'react'
import './TeamCard.css'

export function TeamCard({ team, onEdit, onDelete }) {
  return (
    <div className="team-card">
      <div className="team-header">
        <h3>{team.name}</h3>
        <span className={`badge badge-${team.submissionStatus}`}>
          {team.submissionStatus}
        </span>
      </div>
      <p className="team-description">{team.description}</p>
      <div className="team-info">
        <div className="info-item">
          <span className="label">Members:</span>
          <span className="value">{team.memberCount}</span>
        </div>
        <div className="info-item">
          <span className="label">Score:</span>
          <span className="value"><strong>{team.score}/100</strong></span>
        </div>
      </div>
      <div className="team-actions">
        <button className="btn-action btn-edit" onClick={() => onEdit(team.id)}>
          ✏️ Edit
        </button>
        <button className="btn-action btn-marks" onClick={() => onEdit(team.id)}>
          📊 Marks
        </button>
        <button className="btn-action btn-delete" onClick={() => onDelete(team.id)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

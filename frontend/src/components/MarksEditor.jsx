import React, { useState } from 'react'
import { MARKS_CRITERIA } from '../constants/index.js'
import './MarksEditor.css'

export function MarksEditor({ team, onSave, onCancel }) {
  const [score, setScore] = useState(team.score || 0)

  const handleScoreChange = (value) => {
    const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 100)
    setScore(numValue)
  }

  const handleSave = () => {
    onSave({ teamId: team.id, score })
  }

  return (
    <div className="marks-editor">
      <div className="marks-container">
        <h2>🎯 Mark Team: {team.name}</h2>
        
        <div className="marks-form">
          <div className="mark-item">
            <label>{MARKS_CRITERIA.TOTAL.name}</label>
            <div className="mark-input-group">
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => handleScoreChange(e.target.value)}
                className="mark-input"
              />
              <span className="mark-max">/ 100</span>
            </div>
          </div>
        </div>

        <div className="score-display">
          <span>Final Score:</span>
          <span className={`score ${score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low'}`}>
            {score} / 100
          </span>
        </div>

        <div className="marks-actions">
          <button className="btn btn-success" onClick={handleSave}>
            💾 Save Marks
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

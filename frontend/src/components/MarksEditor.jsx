import React, { useState } from 'react'
import './MarksEditor.css'

export function MarksEditor({ team, onSave, onCancel }) {
  const [sprintNo, setSprintNo] = useState(1)
  const [score, setScore] = useState(0)

  // Pre-fill score based on selected sprint if it already exists
  React.useEffect(() => {
    if (sprintNo === 1 && team.sprint1) setScore(team.sprint1)
    else if (sprintNo === 2 && team.sprint2) setScore(team.sprint2)
    else if (sprintNo === 3 && team.sprint3) setScore(team.sprint3)
    else setScore(0)
  }, [sprintNo, team])

  const handleScoreChange = (value) => {
    const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 100)
    setScore(numValue)
  }

  const handleSave = () => {
    onSave({ teamId: team.teamId, sprintNo, score })
  }

  return (
    <div className="marks-editor">
      <div className="marks-container">
        <h2>🎯 Mark Team: {team.teamName}</h2>

        <div className="marks-form">
          <div className="mark-item">
            <label>Sprint Number</label>
            <select
              value={sprintNo}
              onChange={(e) => setSprintNo(parseInt(e.target.value))}
              className="mark-input"
            >
              <option value={1}>Sprint 1</option>
              <option value={2}>Sprint 2</option>
              <option value={3}>Sprint 3</option>
            </select>
          </div>

          <div className="mark-item">
            <label>Score for Sprint {sprintNo}</label>
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
          <span>Sprint {sprintNo} Score:</span>
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

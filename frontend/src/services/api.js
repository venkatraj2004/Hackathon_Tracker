const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api'

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      // Backend returns plain string sometimes instead of JSON
      const text = await response.text()
      throw new Error(text || `API Error: ${response.statusText}`)
    }

    // Attempt to parse JSON, if it fails, return the raw text
    const text = await response.text()
    try {
      return text ? JSON.parse(text) : {}
    } catch {
      return text
    }
  } catch (error) {
    console.error('API Call failed:', error)
    throw error
  }
}

export const memberService = {
  getAll: () => apiCall('/members')
}

export const teamService = {
  getAll: () => apiCall('/teams'),
  register: (members) => apiCall('/teams/register', {
    method: 'POST',
    body: JSON.stringify(members)
  }),
  getLeaderboard: () => apiCall('/teams/leaderboard')
}

export const marksService = {
  updateMarks: (teamId, sprintNo, marks) => apiCall(`/teams/${teamId}/sprints/${sprintNo}`, {
    method: 'POST',
    body: JSON.stringify({ marks })
  })
}

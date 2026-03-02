const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

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
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) { 
    console.error('API Call failed:', error)
    throw error
  }
}

export const teamService = {
  getAll: () => apiCall('/teams'),
  getById: (id) => apiCall(`/teams/${id}`),
  create: (data) => apiCall('/teams', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/teams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/teams/${id}`, {
    method: 'DELETE'
  }),
  addMember: (teamId, memberId) => apiCall(`/teams/${teamId}/members`, {
    method: 'POST',
    body: JSON.stringify({ memberId })
  }),
  removeMember: (teamId, memberId) => apiCall(`/teams/${teamId}/members/${memberId}`, {
    method: 'DELETE'
  })
}

export const marksService = {
  getMarksByTeam: (teamId) => apiCall(`/marks?teamId=${teamId}`),
  getAll: () => apiCall('/marks'),
  updateMarks: (teamId, score) => apiCall(`/marks`, {
    method: 'POST',
    body: JSON.stringify({ teamId, score })
  }),
  getLeaderboard: () => apiCall('/marks/leaderboard')
}

export const submissionService = {
  getByTeam: (teamId) => apiCall(`/submissions?teamId=${teamId}`),
  submit: (teamId, data) => apiCall(`/submissions`, {
    method: 'POST',
    body: JSON.stringify({ teamId, ...data })
  }),
  update: (submissionId, data) => apiCall(`/submissions/${submissionId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

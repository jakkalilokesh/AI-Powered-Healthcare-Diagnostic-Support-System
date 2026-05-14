import api from './api'

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    })

    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)

    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout: async () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    try {
      await api.post('/auth/logout')
    } catch (error) {
      // backend logout optional
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token')

    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    })

    localStorage.setItem('access_token', response.data.access_token)
    localStorage.setItem('refresh_token', response.data.refresh_token)

    return response.data
  },
}
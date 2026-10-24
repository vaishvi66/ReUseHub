import api from './api'

export const TOKEN_KEY = 'token'

export const authService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    if (response.data?.access_token) {
      this.setToken(response.data.access_token)
    }
    return response.data
  },

  async register(payload) {
    const response = await api.post('/auth/register', payload)
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  logout() {
    this.removeToken()
  },
}


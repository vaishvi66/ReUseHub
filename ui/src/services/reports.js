import api from './api'

export const createReport = (payload) => api.post('/reports', payload).then((r) => r.data)
export const myReports = () => api.get('/reports/mine').then((r) => r.data)
export const getMyReports = myReports

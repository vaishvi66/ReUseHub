import api from './api'

export const getStudentDashboard = () => api.get('/dashboard/student').then((r) => r.data)
export const studentDashboard = getStudentDashboard

export const getAdminDashboard = () => api.get('/admin/dashboard').then((r) => r.data)
export const adminDashboard = getAdminDashboard

export const getSustainabilityStats = () => api.get('/dashboard/sustainability').then((r) => r.data)
export const sustainabilityStats = getSustainabilityStats

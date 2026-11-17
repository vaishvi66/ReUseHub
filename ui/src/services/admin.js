import api from './api'

export const listStudents = (verification_status) =>
  api.get('/admin/students', { params: verification_status ? { verification_status } : {} }).then((r) => r.data)

export const verifyStudent = (id, action) =>
  api.put(`/admin/students/${id}/verify`, { action }).then((r) => r.data)

export const activateStudent = (id) =>
  api.put(`/admin/students/${id}/activate`).then((r) => r.data)

export const deactivateStudent = (id) =>
  api.put(`/admin/students/${id}/deactivate`).then((r) => r.data)

export const updateStudentStatus = ({ id, status, action }) => {
  if (action) return verifyStudent(id, action)
  if (status === 'approved' || status === 'rejected') {
    return verifyStudent(id, status === 'approved' ? 'approve' : 'reject')
  }
  if (status === 'active') return activateStudent(id)
  if (status === 'deactivated') return deactivateStudent(id)
  return verifyStudent(id, status)
}

export const listAdminItems = (approval_status) =>
  api.get('/admin/items', { params: approval_status ? { approval_status } : {} }).then((r) => r.data)
export const listAllItems = listAdminItems

export const approveItem = (id) => api.put(`/admin/items/${id}/approve`).then((r) => r.data)
export const rejectItem = (id) => api.put(`/admin/items/${id}/reject`).then((r) => r.data)
export const removeItem = (id) => api.put(`/admin/items/${id}/remove`).then((r) => r.data)

export const updateAdminItemStatus = ({ id, status }) => {
  if (status === 'approved') return approveItem(id)
  if (status === 'rejected') return rejectItem(id)
  if (status === 'removed') return removeItem(id)
  return api.put(`/admin/items/${id}/${status}`).then((r) => r.data)
}

export const listAllRequests = (status) =>
  api.get('/admin/requests', { params: status ? { status } : {} }).then((r) => r.data)

export const updateRequestStatus = (idOrObj, maybeStatus) => {
  const id = typeof idOrObj === 'object' ? idOrObj.id : idOrObj
  const newStatus = typeof idOrObj === 'object' ? idOrObj.status : maybeStatus
  return api.put(`/admin/requests/${id}/status`, { status: newStatus }).then((r) => r.data)
}

export const listAllReports = (status) =>
  api.get('/admin/reports', { params: status ? { status } : {} }).then((r) => r.data)
export const getAdminReports = listAllReports

export const updateReportStatus = (idOrObj, maybeStatus) => {
  const id = typeof idOrObj === 'object' ? idOrObj.id : idOrObj
  const newStatus = typeof idOrObj === 'object' ? idOrObj.status : maybeStatus
  return api.put(`/admin/reports/${id}`, { status: newStatus }).then((r) => r.data)
}

export const adminDashboard = () => api.get('/admin/dashboard').then((r) => r.data)
export const getAdminDashboard = adminDashboard

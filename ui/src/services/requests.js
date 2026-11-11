import api from './api'

export const listRequests = (type) => api.get('/requests', { params: type ? { type } : {} }).then((r) => r.data)
export const getMyRequests = (type) => listRequests(type)
export const getRequest = (id) => api.get(`/requests/${id}`).then((r) => r.data)
export const acceptRequest = (id) => api.put(`/requests/${id}/accept`).then((r) => r.data)
export const rejectRequest = (id) => api.put(`/requests/${id}/reject`).then((r) => r.data)
export const schedulePickup = (id, payload) => api.put(`/requests/${id}/pickup`, payload).then((r) => r.data)
export const completeRequest = (id) => api.put(`/requests/${id}/complete`).then((r) => r.data)
export const markReused = (id) => api.put(`/requests/${id}/reuse`).then((r) => r.data)
export const cancelRequest = (idOrObj) => {
  const id = typeof idOrObj === 'object' && idOrObj.id ? idOrObj.id : idOrObj
  return api.put(`/requests/${id}/cancel`).then((r) => r.data)
}

export const getAdminRequests = (status) =>
  api.get('/admin/requests', { params: status ? { status } : {} }).then((r) => r.data)

export const updateRequestStatus = (idOrObj, maybeStatus) => {
  const id = typeof idOrObj === 'object' ? idOrObj.id : idOrObj
  const newStatus = typeof idOrObj === 'object' ? idOrObj.status : maybeStatus
  return api.put(`/admin/requests/${id}/status`, { status: newStatus }).then((r) => r.data)
}

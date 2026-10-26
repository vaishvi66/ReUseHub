import api from './api'

export const browseItems = (params = {}) => api.get('/items', { params }).then((r) => r.data)
export const myItems = () => api.get('/items/mine').then((r) => r.data)
export const getMyItems = myItems
export const getItem = (id) => api.get(`/items/${id}`).then((r) => r.data)
export const getItemDetail = getItem

export const createItem = (formData) =>
  api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)

export const updateItem = (idOrObj, maybeFormData) => {
  const id = typeof idOrObj === 'object' && idOrObj.id ? idOrObj.id : idOrObj
  const formData = typeof idOrObj === 'object' && idOrObj.formData ? idOrObj.formData : maybeFormData
  return api.put(`/items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
}

export const deleteItem = (idOrObj) => {
  const id = typeof idOrObj === 'object' && idOrObj.id ? idOrObj.id : idOrObj
  return api.delete(`/items/${id}`)
}

export const requestItem = (idOrObj, maybeNote) => {
  const id = typeof idOrObj === 'object' && idOrObj.id ? idOrObj.id : idOrObj
  const note = typeof idOrObj === 'object' && idOrObj.note !== undefined ? idOrObj.note : maybeNote
  return api.post(`/items/${id}/request`, { note }).then((r) => r.data)
}

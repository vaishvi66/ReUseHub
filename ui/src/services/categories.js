import api from './api'

export const listCategories = () => api.get('/categories').then((r) => r.data)
export const getCategories = listCategories
export const createCategory = (name) => api.post('/categories', { name }).then((r) => r.data)
export const updateCategory = (id, name) => api.put(`/categories/${id}`, { name }).then((r) => r.data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

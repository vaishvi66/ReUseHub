import { useState, useEffect } from 'react'
import { listCategories, createCategory, updateCategory, deleteCategory } from '../../services/categories'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null)

  const loadCategories = () => {
    setLoading(true)
    listCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
        setError('')
      })
      .catch((err) => {
        setCategories([])
        setError(err.response?.data?.detail || 'Failed to load categories.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setError('')
    setIsSubmitting(true)
    try {
      await createCategory(newName.trim())
      setNewName('')
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create category.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return
    setError('')
    try {
      await updateCategory(id, editingName.trim())
      setEditingId(null)
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update category.')
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmCat) return
    setError('')
    try {
      await deleteCategory(deleteConfirmCat.id)
      setDeleteConfirmCat(null)
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete category.')
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Categories</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organize student listings into academic and campus categories</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
          {error}
        </div>
      )}

      {/* Add Category Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs mb-8 transition-colors">
        <form onSubmit={handleCreate} className="flex gap-3 items-center">
          <input
            type="text"
            required
            placeholder="New category name (e.g. Lab Equipment)..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            {isSubmitting ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Category List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No categories defined</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {editingId === c.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs w-64 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === c.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(c.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(c.id)
                              setEditingName(c.name)
                            }}
                            className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmCat(c)}
                            className="px-2.5 py-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium rounded-lg border border-rose-200 dark:border-rose-800/80 text-xs cursor-pointer transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Category?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">"{deleteConfirmCat.name}"</span>? Categories currently assigned to items cannot be deleted.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmCat(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

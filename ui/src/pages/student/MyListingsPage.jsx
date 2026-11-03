import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { myItems, deleteItem } from '../../services/items'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { imageUrl } from '../../utils/imageUrl'
import { PackageIcon } from '../../components/Icons'

export default function MyListingsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null)

  const { categoryMap } = useCategoriesQuery()

  const loadListings = () => {
    setLoading(true)
    myItems()
      .then((data) => {
        setItems(Array.isArray(data) ? data : [])
        setError('')
      })
      .catch((err) => {
        setItems([])
        setError(err.response?.data?.detail || 'Failed to load your listings.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadListings()
  }, [])

  const handleDelete = async () => {
    if (!deleteConfirmItem) return
    setDeletingId(deleteConfirmItem.id)
    try {
      await deleteItem(deleteConfirmItem.id)
      setDeleteConfirmItem(null)
      loadListings()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete listing.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Listings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage items you have listed on the campus circular marketplace</p>
        </div>
        <Link
          to="/create-listing"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          + Create Listing
        </Link>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
            <PackageIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">You haven't listed any items</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-6">Share textbooks, study materials, or dorm gear with fellow students.</p>
          <Link
            to="/create-listing"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="h-40 bg-slate-100 dark:bg-slate-950 relative flex items-center justify-center">
                  {item.image_url ? (
                    <img src={imageUrl(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">No Image</span>
                  )}
                  <span
                    className={`absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.approval_status === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : item.approval_status === 'rejected'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                    }`}
                  >
                    {item.approval_status}
                  </span>
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/60 backdrop-blur-sm text-white capitalize">
                    {item.availability_status}
                  </span>
                </div>

                <div className="p-4">
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {categoryMap[item.category_id] || 'General'}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 truncate">{item.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {item.listing_type === 'sell' && item.price ? `₹${item.price}` : 'Free'}
                </span>

                <div className="flex items-center gap-2">
                  {item.availability_status === 'available' && (
                    <>
                      <Link
                        to={`/edit-listing/${item.id}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Listing?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">"{deleteConfirmItem.name}"</span>? Any pending requests for this item will be removed.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingId === deleteConfirmItem.id}
                className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition cursor-pointer"
              >
                {deletingId === deleteConfirmItem.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

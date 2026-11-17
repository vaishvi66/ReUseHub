import { useState, useEffect } from 'react'
import { listAllItems, approveItem, rejectItem, removeItem } from '../../services/admin'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'

export default function AdminItemsPage() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const { categoryMap } = useCategoriesQuery()

  const loadItems = () => {
    setLoading(true)
    listAllItems(filter || undefined)
      .then((data) => {
        setItems(Array.isArray(data) ? data : [])
        setActionError('')
      })
      .catch((err) => {
        setItems([])
        setActionError(err.response?.data?.detail || 'Failed to load items.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
  }, [filter])

  const handleAction = async (fn) => {
    setActionError('')
    try {
      await fn()
      loadItems()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Action failed.')
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Listing Moderation</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review student listings before publication or remove non-compliant items</p>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
          {actionError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['', 'pending', 'approved', 'rejected', 'removed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer shrink-0 ${
              filter === st
                ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {st === '' ? 'All Listings' : st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No listings found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No items matched the selected moderation filter.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Approval</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">{item.name}</td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{categoryMap[item.category_id] || '-'}</td>
                    <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300 capitalize">{item.listing_type}</td>
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {item.listing_type === 'sell' && item.price ? `₹${item.price}` : 'Free'}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{item.owner_name || 'Student'}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          item.approval_status === 'approved'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : item.approval_status === 'rejected'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                              : item.approval_status === 'removed'
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {item.approval_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 capitalize">{item.availability_status}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {item.approval_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(() => approveItem(item.id))}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(() => rejectItem(item.id))}
                              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-semibold rounded-lg transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.approval_status !== 'removed' && (
                          <button
                            onClick={() => handleAction(() => removeItem(item.id))}
                            className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium rounded-lg transition cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}

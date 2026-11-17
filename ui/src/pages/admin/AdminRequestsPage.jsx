import { useState, useEffect } from 'react'
import { listAllRequests } from '../../services/admin'

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    listAllRequests(filter || undefined)
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Campus Requests</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit trail of student exchange requests and scheduled pickups</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['', 'pending', 'accepted', 'pickup_scheduled', 'completed', 'rejected', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer shrink-0 ${
              filter === st
                ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {st === '' ? 'All Requests' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No requests found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No student transactions matched the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Pickup Schedule</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{r.item_name}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{r.requester_name || 'Requester'}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{r.owner_name || 'Owner'}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          r.status === 'completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : r.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : r.status === 'accepted'
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                : r.status === 'pickup_scheduled'
                                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {r.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {r.pickup_location ? (
                        <span>
                          {r.pickup_location} on {r.pickup_date} at {r.pickup_time}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-400 dark:text-slate-500">
                      {new Date(r.created_at).toLocaleDateString()}
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

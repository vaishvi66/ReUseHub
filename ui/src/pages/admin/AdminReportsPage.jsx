import { useState, useEffect } from 'react'
import { listAllReports, updateReportStatus } from '../../services/admin'

export default function AdminReportsPage() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')

  const loadReports = () => {
    setLoading(true)
    listAllReports(filter || undefined)
      .then((data) => {
        setReports(Array.isArray(data) ? data : [])
        setActionError('')
      })
      .catch((err) => {
        setReports([])
        setActionError(err.response?.data?.detail || 'Failed to load reports.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadReports()
  }, [filter])

  const handleAction = async (id, status) => {
    setActionError('')
    try {
      await updateReportStatus(id, status)
      loadReports()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Action failed.')
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Reports & Moderation</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review student flags on suspicious listings or inappropriate behavior</p>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
          {actionError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['', 'pending', 'under_review', 'resolved', 'dismissed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer shrink-0 ${
              filter === st
                ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {st === '' ? 'All Reports' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No reports found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No items or users currently flagged for moderation.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4">Item Target</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{r.reported_by_name || 'Student'}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">{r.reported_item_name || 'User Report'}</td>
                    <td className="py-4 px-4 font-semibold text-rose-700 dark:text-rose-400">{r.reason}</td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{r.description}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          r.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : r.status === 'under_review'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              : r.status === 'resolved'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {r.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleAction(r.id, 'under_review')}
                            className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-lg transition cursor-pointer"
                          >
                            Review
                          </button>
                        )}
                        {r.status !== 'resolved' && (
                          <button
                            onClick={() => handleAction(r.id, 'resolved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}
                        {r.status !== 'dismissed' && (
                          <button
                            onClick={() => handleAction(r.id, 'dismissed')}
                            className="px-2.5 py-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                          >
                            Dismiss
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

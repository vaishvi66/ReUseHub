import { useState, useEffect } from 'react'
import { listRequests } from '../../services/requests'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listRequests()
      .then((all) => {
        if (Array.isArray(all)) {
          setHistory(all.filter((r) => ['completed', 'cancelled', 'rejected'].includes(r.status)))
        } else {
          setHistory([])
        }
      })
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Transaction History</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Past completed, cancelled, or rejected exchanges</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto shadow-xs">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">No past transactions</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Your past exchanges and transaction history will appear here.</p>
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
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{r.item_name}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{r.requester_name || 'Requester'}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{r.owner_name || 'Owner'}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          r.status === 'completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : r.status === 'cancelled'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(r.updated_at || r.created_at).toLocaleDateString()}
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

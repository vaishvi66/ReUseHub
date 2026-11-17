import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getAdminDashboard } from '../../services/admin'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { categoryMap } = useCategoriesQuery()

  useEffect(() => {
    getAdminDashboard()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const maxCat = Math.max(1, ...(stats?.items_by_category?.map((c) => c.count) || [1]))

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.email}</span> &middot; Campus Oversight
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/students"
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition"
          >
            Review Students
          </Link>
          <Link
            to="/admin/items"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            Review Items
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className="h-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/admin/students" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 transition">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Students</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{stats?.total_students ?? 0}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Registered accounts</span>
            </Link>

            <Link to="/admin/students?filter=pending" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-600 transition">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pending Verifications</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats?.pending_verifications ?? 0}</p>
              <span className="text-[11px] text-amber-700 dark:text-amber-400/80 font-medium mt-1 block">Needs ID approval &rarr;</span>
            </Link>

            <Link to="/admin/items" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 transition">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Listings</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{stats?.total_listings ?? 0}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">All items on platform</span>
            </Link>

            <Link to="/admin/items?filter=pending" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-600 transition">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pending Approvals</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats?.pending_approvals ?? 0}</p>
              <span className="text-[11px] text-amber-700 dark:text-amber-400/80 font-medium mt-1 block">Awaiting moderation &rarr;</span>
            </Link>

            <Link to="/admin/requests" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-600 transition">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Requests</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{stats?.active_requests ?? 0}</p>
              <span className="text-[11px] text-blue-700 dark:text-blue-400/80 font-medium mt-1 block">In-flight transactions</span>
            </Link>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Completed Reuses</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats?.completed_reuses ?? 0}</p>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400/80 font-medium mt-1 block">Items saved from waste</span>
            </div>

            <Link to="/admin/reports" className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-600 transition col-span-2 sm:col-span-1">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pending Reports</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{stats?.pending_reports ?? 0}</p>
              <span className="text-[11px] text-rose-700 dark:text-rose-400/80 font-medium mt-1 block">Student flags &rarr;</span>
            </Link>
          </div>

          {/* Breakdown by Category */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-8 transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Listings by Category</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Distribution of catalog items across academic categories</p>

            <div className="space-y-3">
              {stats?.items_by_category?.map((c) => (
                <div key={c.category_id}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{categoryMap[c.category_id] || 'Category'}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{c.count} items</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full"
                      style={{ width: `${Math.max(5, (c.count / maxCat) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  )
}

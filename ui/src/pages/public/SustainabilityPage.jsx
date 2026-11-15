import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sustainabilityStats } from '../../services/dashboard'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'

export default function SustainabilityPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { categoryMap } = useCategoriesQuery()

  useEffect(() => {
    sustainabilityStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      </main>
    )
  }

  const maxCat = Math.max(1, ...(stats?.reused_by_category?.map((c) => c.count) || [1]))
  const maxType = Math.max(1, ...(stats?.items_by_listing_type?.map((t) => t.count) || [1]))

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          Campus Green Impact
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
          Sustainability Metrics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Tracking the circular economy metrics, items diverted from disposal, and student engagement across campus.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Items Listed</span>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">{stats?.total_items_listed ?? 0}</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Circulated on campus</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Items Reused</span>
          <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{stats?.total_items_reused ?? 0}</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400/80 font-medium mt-1 block">Diverted from waste</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Verified Students</span>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">{stats?.active_students ?? 0}</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Active campus accounts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Participants</span>
          <p className="text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 mt-2">{stats?.students_participated ?? 0}</p>
          <span className="text-[11px] text-teal-700 dark:text-teal-400/80 font-medium mt-1 block">Listed or requested items</span>
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Items Reused by Category</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Completed reuses across academic categories</p>

          {(!stats?.reused_by_category || stats.reused_by_category.length === 0) ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No items completed reuse yet. Be the first to reuse an item!
            </div>
          ) : (
            <div className="space-y-4">
              {stats.reused_by_category.map((cat) => (
                <div key={cat.category_id}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{categoryMap[cat.category_id] || 'Category'}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{cat.count} reused</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, (cat.count / maxCat) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listing Type Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Items by Listing Type</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Approved listings breakdown by exchange model</p>

          {(!stats?.items_by_listing_type || stats.items_by_listing_type.length === 0) ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No active listings available.
            </div>
          ) : (
            <div className="space-y-4">
              {stats.items_by_listing_type.map((t) => (
                <div key={t.listing_type}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300 capitalize">{t.listing_type === 'giveaway' ? 'Free Giveaway' : t.listing_type}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{t.count} items</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, (t.count / maxType) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link to="/" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition">
          &larr; Explore Marketplace Items
        </Link>
      </div>
    </main>
  )
}

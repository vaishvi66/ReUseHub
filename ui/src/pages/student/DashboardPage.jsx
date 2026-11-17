import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getStudentDashboard } from '../../services/dashboard'
import { listRequests } from '../../services/requests'
import { myItems } from '../../services/items'

export default function StudentDashboardPage() {
  const { user, isVerified } = useAuth()
  const [stats, setStats] = useState(null)
  const [incoming, setIncoming] = useState([])
  const [recentListings, setRecentListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isVerified) {
      setLoading(false)
      return
    }

    Promise.all([
      getStudentDashboard().catch(() => null),
      listRequests('incoming').catch(() => []),
      myItems().catch(() => []),
    ])
      .then(([statsData, reqsData, itemsData]) => {
        setStats(statsData)
        setIncoming(Array.isArray(reqsData) ? reqsData.slice(0, 5) : [])
        setRecentListings(Array.isArray(itemsData) ? itemsData.slice(0, 5) : [])
      })
      .finally(() => setLoading(false))
  }, [isVerified])

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Student Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.full_name || user?.email}</span> &middot; {user?.college}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
              user?.verification_status === 'approved'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                : user?.verification_status === 'rejected'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
            }`}
          >
            {user?.verification_status === 'approved' ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Verified Student</span>
              </>
            ) : user?.verification_status === 'rejected' ? (
              <>
                <svg className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Verification Rejected</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2.5" strokeDasharray="25 50" />
                </svg>
                <span>Pending Verification</span>
              </>
            )}
          </span>
          {isVerified && (
            <Link
              to="/create-listing"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              + New Listing
            </Link>
          )}
        </div>
      </div>

      {/* Verification Notice */}
      {!isVerified && (
        <div
          className={`p-5 rounded-2xl border mb-8 ${
            user?.verification_status === 'rejected'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300'
          }`}
        >
          <h3 className="font-bold text-sm mb-1">
            {user?.verification_status === 'rejected'
              ? 'Verification Unsuccessful'
              : 'Verification in Progress'}
          </h3>
          <p className="text-xs leading-relaxed">
            {user?.verification_status === 'rejected'
              ? 'Your student account could not be verified by campus administration. Please update your student details in your profile or reach out to college administration.'
              : 'Your student account is pending administrator verification. Once verified, you will be able to post items for sale, make requests, and schedule on-campus pickups.'}
          </p>
          <div className="mt-3">
            <Link to="/profile" className="text-xs font-bold underline hover:opacity-80">
              View or Update Profile Details &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">My Listings</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">{stats?.my_listings ?? 0}</p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">Active items</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pending Requests</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">{stats?.pending_requests ?? 0}</p>
          <span className="text-[10px] text-amber-700 dark:text-amber-400/80 mt-1 block">Awaiting your reply</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Requests</span>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{stats?.my_active_requests ?? 0}</p>
          <span className="text-[10px] text-blue-700 dark:text-blue-400/80 mt-1 block">Items you asked for</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Completed</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">{stats?.completed_transactions ?? 0}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Transactions closed</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1 transition-colors">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Items Reused</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{stats?.items_reused ?? 0}</p>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400/80 mt-1 block">Saved from waste</span>
        </div>
      </div>

      {/* Grid: Incoming Requests & My Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incoming Requests */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Incoming Requests</h3>
            <Link to="/my-requests" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
              View all &rarr;
            </Link>
          </div>

          {incoming.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No incoming requests yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {incoming.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{r.item_name}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">From {r.requester_name}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                      r.status === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : r.status === 'accepted'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {r.status?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Recent Listings */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">My Listings</h3>
            <Link to="/my-listings" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
              Manage all &rarr;
            </Link>
          </div>

          {recentListings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              You have no active listings.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentListings.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 capitalize">
                      {item.listing_type} &middot; {item.price ? `$${item.price}` : 'Free'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.approval_status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : item.approval_status === 'rejected'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {item.approval_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

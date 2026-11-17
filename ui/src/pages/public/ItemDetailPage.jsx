import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useItemDetailQuery, useRequestItemMutation } from '../../hooks'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { useAuth } from '../../hooks/useAuth'
import { getItemImageUrl } from '../../utils/imageUrl'
import { createReport } from '../../services/reports'

export default function ItemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated, isStudent, isVerified } = useAuth()
  const { categoryMap } = useCategoriesQuery()

  const { data: item, isLoading, isError, error } = useItemDetailQuery(id)
  const requestMutation = useRequestItemMutation()

  const [note, setNote] = useState('')
  const [requestSuccess, setRequestSuccess] = useState('')
  const [requestError, setRequestError] = useState('')

  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDesc, setReportDesc] = useState('')
  const [reportSuccess, setReportSuccess] = useState('')
  const [reportError, setReportError] = useState('')

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 animate-pulse h-96" />
      </main>
    )
  }

  if (isError || !item) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center text-slate-400 dark:text-slate-500 text-2xl font-bold mb-4">
          ?
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Item Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This listing may have been removed or already reused.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition">
          Back to Marketplace
        </Link>
      </main>
    )
  }

  const isOwner = user && user.id === item.owner_id
  const canRequest = isStudent && isVerified && !isOwner && item.availability_status === 'available'

  const handleRequest = async (e) => {
    e.preventDefault()
    setRequestError('')
    setRequestSuccess('')
    try {
      await requestMutation.mutateAsync({ id: item.id, note })
      setRequestSuccess('Request sent successfully! You can track this in "My Requests".')
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to submit request.'
      setRequestError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  }

  const handleReport = async (e) => {
    e.preventDefault()
    setReportError('')
    setReportSuccess('')
    try {
      await createReport({
        reported_item_id: item.id,
        reported_user_id: item.owner_id,
        reason: reportReason,
        description: reportDesc,
      })
      setReportSuccess('Report submitted. An administrator will review this item.')
      setReportOpen(false)
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to submit report.'
      setReportError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-6 transition">
        &larr; Back to Browse
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md dark:shadow-none overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 transition-colors">
        {/* Left: Image Card */}
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-950 overflow-hidden relative min-h-[340px] flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
          <img
            src={getItemImageUrl(item)}
            alt={item.name}
            className="w-full h-full object-cover max-h-[460px]"
          />
          <span
            className={`absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm ${
              item.listing_type === 'sell'
                ? 'bg-emerald-600'
                : item.listing_type === 'giveaway'
                  ? 'bg-blue-600'
                  : 'bg-purple-600'
            }`}
          >
            {item.listing_type === 'giveaway' ? 'Free Giveaway' : item.listing_type}
          </span>
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-sm text-white capitalize">
            {item.availability_status}
          </span>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {categoryMap[item.category_id] || 'General'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                Condition: {item.condition?.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{item.name}</h1>

            <p className="mt-3 text-2xl font-extrabold text-emerald-800 dark:text-emerald-400">
              {item.listing_type === 'sell' && item.price ? `$${item.price}` : 'Free'}
            </p>

            {item.exchange_requirement && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-300">
                <span className="font-bold">Looking for in exchange: </span>
                <span>{item.exchange_requirement}</span>
              </div>
            )}

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{item.description}</p>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-400 dark:text-slate-500 block">Pickup Location</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">{item.location}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-400 dark:text-slate-500 block">Posted By</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">{item.owner_name || 'Student'}</span>
              </div>
            </div>
          </div>

          {/* Request / Action Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {requestSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-4">
                {requestSuccess}
              </div>
            )}

            {requestError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-4">
                {requestError}
              </div>
            )}

            {!isAuthenticated ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">Sign in as a verified student to request this item.</p>
                <Link
                  to="/login"
                  state={{ from: { pathname: `/item/${item.id}` } }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Sign In to Request
                </Link>
              </div>
            ) : isOwner ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400 text-center font-medium">
                You are the owner of this listing.
              </div>
            ) : !isVerified ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold">Verification Pending: </span>
                Your student account must be approved by campus administration before requesting items.
              </div>
            ) : canRequest && !requestSuccess ? (
              <form onSubmit={handleRequest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="request_note">
                    Message / Note for Owner (Optional)
                  </label>
                  <textarea
                    id="request_note"
                    rows={2}
                    placeholder="e.g. When are you free for campus pickup?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={requestMutation.isPending}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 dark:shadow-none transition disabled:opacity-50 cursor-pointer"
                >
                  {requestMutation.isPending ? 'Sending Request...' : 'Request Item'}
                </button>
              </form>
            ) : null}

            {/* Reporting */}
            {isAuthenticated && !isOwner && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {reportSuccess ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{reportSuccess}</span>
                ) : !reportOpen ? (
                  <button
                    type="button"
                    onClick={() => setReportOpen(true)}
                    className="text-[11px] text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium cursor-pointer transition"
                  >
                    Report this listing
                  </button>
                ) : (
                  <form onSubmit={handleReport} className="w-full space-y-2 mt-2 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Report Listing</p>
                    {reportError && <p className="text-xs text-rose-600 dark:text-rose-400">{reportError}</p>}
                    <input
                      type="text"
                      required
                      placeholder="Reason (e.g. Inappropriate item, incorrect details)"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="Description"
                      value={reportDesc}
                      onChange={(e) => setReportDesc(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer">
                        Submit Report
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportOpen(false)}
                        className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-xs transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

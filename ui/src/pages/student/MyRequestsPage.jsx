import { useState, useEffect } from 'react'
import {
  listRequests,
  acceptRequest,
  rejectRequest,
  schedulePickup,
  completeRequest,
  markReused,
  cancelRequest,
} from '../../services/requests'
import { MapPinIcon } from '../../components/Icons'

function MyRequestsPage() {
  const [tab, setTab] = useState('incoming')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  // Modal for pickup scheduling
  const [pickupModalReq, setPickupModalReq] = useState(null)
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [scheduling, setScheduling] = useState(false)

  const loadRequests = () => {
    setLoading(true)
    listRequests(tab)
      .then((data) => {
        setRequests(Array.isArray(data) ? data : [])
        setError('')
      })
      .catch((err) => {
        setRequests([])
        setError(err.response?.data?.detail || 'Failed to load requests.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadRequests()
  }, [tab])

  const handleAction = async (actionFn) => {
    setActionError('')
    try {
      await actionFn()
      loadRequests()
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Action failed.'
      setActionError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  }

  const handleSchedulePickup = async (e) => {
    e.preventDefault()
    if (!pickupModalReq) return
    setScheduling(true)
    setActionError('')
    try {
      await schedulePickup(pickupModalReq.id, {
        pickup_location: pickupLocation,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
      })
      setPickupModalReq(null)
      loadRequests()
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to schedule pickup.'
      setActionError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setScheduling(false)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Request Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track and manage exchange and pickup requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setTab('incoming')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
            tab === 'incoming'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Incoming Requests (For My Items)
        </button>
        <button
          onClick={() => setTab('outgoing')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
            tab === 'outgoing'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          My Requests (Items I Asked For)
        </button>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
          {actionError}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center max-w-md mx-auto shadow-xs">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">
            {tab === 'incoming' ? 'No incoming requests' : 'You have not requested any items'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {tab === 'incoming'
              ? 'When students request items from your listings, they will appear here.'
              : 'Browse marketplace items and send a request to get started.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">{tab === 'incoming' ? 'Requester' : 'Owner'}</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Note</th>
                  <th className="py-3 px-4">Pickup Schedule</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{r.item_name || 'Listing'}</td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {tab === 'incoming' ? r.requester_name || 'Student' : r.owner_name || 'Owner'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                          r.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : r.status === 'accepted'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              : r.status === 'pickup_scheduled'
                                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                                : r.status === 'completed'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : r.status === 'cancelled'
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {r.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 max-w-[150px] truncate">{r.note || '-'}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      {r.pickup_location ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <MapPinIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{r.pickup_location}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            {r.pickup_date} at {r.pickup_time}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">Not scheduled</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Owner Actions */}
                        {tab === 'incoming' && r.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(() => acceptRequest(r.id))}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(() => rejectRequest(r.id))}
                              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-semibold rounded-lg transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {tab === 'incoming' && r.status === 'accepted' && (
                          <button
                            onClick={() => {
                              setPickupModalReq(r)
                              setPickupLocation(r.pickup_location || '')
                              setPickupDate(r.pickup_date || '')
                              setPickupTime(r.pickup_time || '')
                            }}
                            className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold rounded-lg border border-purple-200 dark:border-purple-800/60 transition cursor-pointer"
                          >
                            Schedule Pickup
                          </button>
                        )}

                        {(r.status === 'accepted' || r.status === 'pickup_scheduled') && (
                          <button
                            onClick={() => handleAction(() => completeRequest(r.id))}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/60 transition cursor-pointer"
                          >
                            Complete
                          </button>
                        )}

                        {r.status === 'completed' && (
                          <button
                            onClick={() => handleAction(() => markReused(r.id))}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition cursor-pointer"
                          >
                            Mark Reused
                          </button>
                        )}

                        {/* Requester Cancel Action */}
                        {tab === 'outgoing' && ['pending', 'accepted', 'pickup_scheduled'].includes(r.status) && (
                          <button
                            onClick={() => handleAction(() => cancelRequest(r.id))}
                            className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                          >
                            Cancel
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

      {/* Schedule Pickup Modal */}
      {pickupModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Schedule Campus Pickup</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Set the agreed on-campus pickup location, date, and time for {pickupModalReq.item_name}.
            </p>

            <form onSubmit={handleSchedulePickup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="modal_pickup_location">
                  Pickup Location
                </label>
                <input
                  id="modal_pickup_location"
                  type="text"
                  required
                  placeholder="e.g. Student Center Entrance, Library Block A"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="modal_pickup_date">
                    Pickup Date
                  </label>
                  <input
                    id="modal_pickup_date"
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="modal_pickup_time">
                    Pickup Time
                  </label>
                  <input
                    id="modal_pickup_time"
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPickupModalReq(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                >
                  {scheduling ? 'Scheduling...' : 'Confirm Pickup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [fullName, setFullName] = useState(user?.full_name || '')
  const [college, setCollege] = useState(user?.college || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)
    try {
      const res = await api.put('/users/me', { full_name: fullName.trim(), college: college.trim() })
      updateUser(res.data)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your campus credentials and personal details</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs mb-6 transition-colors">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-none">
            {user?.full_name ? user.full_name[0].toUpperCase() : 'S'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{user?.full_name}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold text-slate-400 dark:text-slate-500 block">Student ID</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{user?.student_id || '-'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 dark:text-slate-500 block">Verification Status</span>
            <span
              className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                user?.verification_status === 'approved'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : user?.verification_status === 'rejected'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
              }`}
            >
              {user?.verification_status || 'pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Edit Profile</h3>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full_name">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="college">
              College / University
            </label>
            <input
              id="college"
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-200 dark:shadow-none disabled:opacity-50 transition cursor-pointer"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </main>
  )
}

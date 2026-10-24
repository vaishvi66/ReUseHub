import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    student_id: '',
    college: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    if (formData.password.length > 72) {
      setErrorMsg('Password must be at most 72 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        full_name: formData.full_name.trim(),
        student_id: formData.student_id.trim(),
        college: formData.college.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      })

      setSuccessMsg(
        'Account created successfully! Admin verification is required before you can access the marketplace.',
      )
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        'Registration failed. Please check your information.'
      setErrorMsg(typeof detail === 'string' ? detail : JSON.stringify(detail))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-none p-8 sm:p-10 transition-colors">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-500/20 mb-3">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
              <path d="m14 16-3 3 3 3" />
              <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
              <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
              <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Student Registration</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Join your campus circular marketplace for sustainable item sharing
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
            <span className="font-bold">Error:</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <p className="font-bold mb-1">Registration Complete!</p>
            <p>{successMsg}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Redirecting to login...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="full_name">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Asha Rao"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="student_id">
                Student ID
              </label>
              <input
                id="student_id"
                name="student_id"
                type="text"
                required
                placeholder="STU1001"
                value={formData.student_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="college">
              College / University
            </label>
            <input
              id="college"
              name="college"
              type="text"
              required
              placeholder="City College of Engineering"
              value={formData.college}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="reg_email">
              College Email
            </label>
            <input
              id="reg_email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="asha@college.edu"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="reg_password">
                Password
              </label>
              <input
                id="reg_password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Min. 6 chars"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="confirm_password">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Repeat password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 dark:shadow-none disabled:opacity-50 transition cursor-pointer"
          >
            {isSubmitting ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  )
}

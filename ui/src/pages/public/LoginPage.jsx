import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || (isAdmin ? '/admin' : '/dashboard')
    navigate(destination, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setErrorMsg('Please enter your email.')
      return
    }

    if (!password) {
      setErrorMsg('Please enter your password.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await login({ email: cleanEmail, password })
      const user = response?.user
      const from = location.state?.from?.pathname
      if (from) {
        navigate(from, { replace: true })
      } else if (user?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.message ||
        'Authentication failed. Please check your credentials.'
      setErrorMsg(typeof detail === 'string' ? detail : JSON.stringify(detail))
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setErrorMsg('')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-none p-8 sm:p-10 transition-colors">
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
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to your ReUseHub campus account</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
            <span className="font-bold">Error:</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">
              College Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="e.g. asha@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-200 dark:shadow-none disabled:opacity-50 transition cursor-pointer"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Pre-fill */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
            Quick Fill Demo Accounts
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('asha@college.edu', 'Student@123')}
              className="flex-1 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@reusehub.com', 'Admin@123')}
              className="flex-1 py-1.5 px-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          New to ReUseHub?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinkClass = (path) =>
    `text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg transition ${
      isActive(path)
        ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
    }`

  const getInitials = () => {
    if (user?.full_name) {
      const parts = user.full_name.trim().split(' ')
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      return user.full_name.slice(0, 2).toUpperCase()
    }
    if (user?.email) return user.email.slice(0, 2).toUpperCase()
    return 'U'
  }

  return (
    <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand with Animated Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
              {/* Circular 3-arrow chasing recycle icon with rotation on hover */}
              <svg
                className="w-5 h-5 text-white transform group-hover:rotate-45 transition-transform duration-500"
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
              {/* Active animated pulsing ping dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-2 ring-white dark:ring-slate-900"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-900 dark:from-emerald-300 via-emerald-800 dark:via-teal-200 to-teal-700 dark:to-emerald-400 bg-clip-text text-transparent group-hover:to-emerald-600 transition-colors">
                ReUse<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 -mt-1 hidden sm:block">
                Campus Circular Economy
              </span>
            </div>
          </Link>

          {/* Core Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>
              Browse
            </Link>
            <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>
              How It Works
            </Link>
            <Link to="/sustainability" className={navLinkClass('/sustainability')}>
              Sustainability
            </Link>

            {isStudent && (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/my-listings" className={navLinkClass('/my-listings')}>
                  My Listings
                </Link>
                <Link to="/my-requests" className={navLinkClass('/my-requests')}>
                  My Requests
                </Link>
                <Link to="/history" className={navLinkClass('/history')}>
                  History
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin" className={navLinkClass('/admin')}>
                  Dashboard
                </Link>
                <Link to="/admin/students" className={navLinkClass('/admin/students')}>
                  Students
                </Link>
                <Link to="/admin/items" className={navLinkClass('/admin/items')}>
                  Items
                </Link>
                <Link to="/admin/requests" className={navLinkClass('/admin/requests')}>
                  Requests
                </Link>
                <Link to="/admin/categories" className={navLinkClass('/admin/categories')}>
                  Categories
                </Link>
                <Link to="/admin/reports" className={navLinkClass('/admin/reports')}>
                  Reports
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* User / Auth State + Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
                  Super Admin
                </span>
              ) : (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {getInitials()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-none">
                      {user?.full_name || 'Student'}
                    </span>
                    <span
                      className={`text-[10px] font-bold mt-0.5 ${
                        user?.verification_status === 'approved'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : user?.verification_status === 'rejected'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {user?.verification_status === 'approved'
                        ? 'Verified'
                        : user?.verification_status === 'rejected'
                          ? 'Rejected'
                          : 'Pending Verification'}
                    </span>
                  </div>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 dark:shadow-none transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar for smaller screens */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
        <Link to="/" className={navLinkClass('/')}>
          Browse
        </Link>
        <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>
          How It Works
        </Link>
        <Link to="/sustainability" className={navLinkClass('/sustainability')}>
          Impact
        </Link>
        {isStudent && (
          <>
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/my-listings" className={navLinkClass('/my-listings')}>
              Listings
            </Link>
            <Link to="/my-requests" className={navLinkClass('/my-requests')}>
              Requests
            </Link>
            <Link to="/profile" className={navLinkClass('/profile')}>
              Profile
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link to="/admin" className={navLinkClass('/admin')}>
              Dashboard
            </Link>
            <Link to="/admin/students" className={navLinkClass('/admin/students')}>
              Students
            </Link>
            <Link to="/admin/items" className={navLinkClass('/admin/items')}>
              Items
            </Link>
            <Link to="/admin/requests" className={navLinkClass('/admin/requests')}>
              Requests
            </Link>
            <Link to="/admin/categories" className={navLinkClass('/admin/categories')}>
              Categories
            </Link>
            <Link to="/admin/reports" className={navLinkClass('/admin/reports')}>
              Reports
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ allowedRoles = [], requireVerified = false }) {
  const { isAuthenticated, isLoading, user, isAdmin, isVerified } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-600">Authenticating session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold mb-4">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md">
          Your account role ({user?.role}) does not have permission to access this page.
        </p>
        <Navigate to={isAdmin ? '/admin' : '/'} replace />
      </div>
    )
  }

  if (requireVerified && !isVerified) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-4">
          ⏳
        </div>
        <h2 className="text-xl font-bold text-slate-900">Verification Pending</h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md">
          Your student account is currently pending admin verification. You will be able to browse and post listings once approved.
        </p>
      </div>
    )
  }

  return <Outlet />
}

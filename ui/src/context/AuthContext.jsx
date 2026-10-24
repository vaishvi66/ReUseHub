import { useCallback, useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext } from './authContextDef'
import { authService } from '../services/auth'
import { queryKeys } from '../constants/queryKeys'
import { useCurrentUserQuery, useLoginMutation, useRegisterMutation } from '../hooks/useAuthQuery'

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const token = authService.getToken()

  const {
    data: user = null,
    isLoading: isUserLoading,
    isFetching,
    refetch: refetchUser,
  } = useCurrentUserQuery()

  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()

  // Handle global 401 Unauthorized events from axios interceptor
  useEffect(() => {
    function handleUnauthorized() {
      authService.removeToken()
      queryClient.setQueryData(queryKeys.auth.me, null)
      queryClient.removeQueries({ queryKey: queryKeys.auth.me })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [queryClient])

  const logout = useCallback(() => {
    authService.logout()
    queryClient.setQueryData(queryKeys.auth.me, null)
    queryClient.clear()
  }, [queryClient])

  const login = useCallback(
    async (credentials) => {
      const data = await loginMutation.mutateAsync(credentials)
      return data
    },
    [loginMutation],
  )

  const register = useCallback(
    async (payload) => {
      return await registerMutation.mutateAsync(payload)
    },
    [registerMutation],
  )

  const updateUser = useCallback(
    (updated) => {
      queryClient.setQueryData(queryKeys.auth.me, updated)
    },
    [queryClient],
  )

  const loginStatus = loginMutation.status
  const loginError = loginMutation.error

  const value = useMemo(() => {
    const isAuthenticated = Boolean(token && user)
    const isAdmin = user?.role === 'admin'
    const isStudent = user?.role === 'student'
    const isVerified = isAdmin || user?.verification_status === 'approved'

    return {
      user,
      token,
      isLoading: Boolean(token && isUserLoading),
      isFetching,
      isAuthenticated,
      isAdmin,
      isStudent,
      isVerified,
      login,
      register,
      logout,
      updateUser,
      refetchUser,
      loginStatus,
      loginError,
    }
  }, [
    token,
    user,
    isUserLoading,
    isFetching,
    login,
    register,
    logout,
    updateUser,
    refetchUser,
    loginStatus,
    loginError,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { useAuth } from '../hooks/useAuth'
export default AuthProvider

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/auth'
import { queryKeys } from '../constants/queryKeys'

export function useCurrentUserQuery() {
  const token = authService.getToken()

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.getMe(),
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 15,
    retry: false,
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(queryKeys.auth.me, data.user)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.student })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.admin })
    },
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload) => authService.register(payload),
  })
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyRequests,
  getAdminRequests,
  updateRequestStatus,
  cancelRequest,
} from '../services/requests'
import { queryKeys } from '../constants/queryKeys'

export function useMyRequestsQuery() {
  return useQuery({
    queryKey: queryKeys.requests.mine,
    queryFn: getMyRequests,
  })
}

export function useAdminRequestsQuery() {
  return useQuery({
    queryKey: queryKeys.requests.admin,
    queryFn: getAdminRequests,
  })
}

export function useUpdateRequestStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRequestStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.student })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.admin })
    },
  })
}

export function useCancelRequestMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.mine })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.student })
    },
  })
}

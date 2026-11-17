import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listStudents,
  updateStudentStatus,
  listAdminItems,
  updateAdminItemStatus,
  getAdminReports,
} from '../services/admin'
import { queryKeys } from '../constants/queryKeys'

export function useStudentsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.students,
    queryFn: listStudents,
  })
}

export function useUpdateStudentStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStudentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.students })
    },
  })
}

export function useAdminItemsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.items,
    queryFn: listAdminItems,
  })
}

export function useUpdateAdminItemStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAdminItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.items })
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all })
    },
  })
}

export function useAdminReportsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.reports,
    queryFn: getAdminReports,
  })
}

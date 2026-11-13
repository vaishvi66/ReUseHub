import { useQuery } from '@tanstack/react-query'
import { getStudentDashboard, getAdminDashboard, getSustainabilityStats } from '../services/dashboard'
import { queryKeys } from '../constants/queryKeys'

export function useStudentDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.student,
    queryFn: getStudentDashboard,
  })
}

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.admin,
    queryFn: getAdminDashboard,
  })
}

export function useSustainabilityQuery() {
  return useQuery({
    queryKey: ['dashboard', 'sustainability'],
    queryFn: getSustainabilityStats,
    staleTime: 60 * 1000,
  })
}

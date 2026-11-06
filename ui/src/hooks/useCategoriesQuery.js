import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categories'
import { queryKeys } from '../constants/queryKeys'

export function useCategoriesQuery() {
  const query = useQuery({
    queryKey: queryKeys.categories,
    queryFn: listCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  const categories = query.data || []
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  return {
    ...query,
    categories,
    categoryMap,
  }
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

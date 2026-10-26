import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  browseItems,
  myItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  requestItem,
} from '../services/items'
import { queryKeys } from '../constants/queryKeys'

export function useBrowseItemsQuery(params = {}) {
  return useQuery({
    queryKey: queryKeys.items.list(params),
    queryFn: () => browseItems(params),
  })
}

export function useMyItemsQuery() {
  return useQuery({
    queryKey: queryKeys.items.mine,
    queryFn: myItems,
  })
}

export function useItemDetailQuery(id) {
  return useQuery({
    queryKey: queryKeys.items.detail(id),
    queryFn: () => getItem(id),
    enabled: Boolean(id),
  })
}

export function useCreateItemMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.student })
    },
  })
}

export function useUpdateItemMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all })
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.items.detail(variables.id) })
      }
    },
  })
}

export function useDeleteItemMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.student })
    },
  })
}

export function useRequestItemMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: requestItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.student })
    },
  })
}

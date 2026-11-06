import { useEffect, useState } from 'react'
import { listCategories } from '../services/categories'

let cache = null

export function useCategories() {
  const [categories, setCategories] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    listCategories()
      .then((data) => {
        cache = data
        setCategories(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  return { categories, categoryMap, loading }
}

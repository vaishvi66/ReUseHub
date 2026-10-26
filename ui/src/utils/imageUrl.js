const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, '')

export function imageUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${SERVER_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}

export const CATEGORY_FALLBACK_IMAGES = {
  books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'study materials': 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
  electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
  furniture: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
  other: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
}

export function getItemImageUrl(item) {
  const url = item?.image_url
  // If item has a valid image_url that isn't the dead 404 unsplash photo
  if (url && !url.includes('1580481077195') && !url.includes('1581092335397') && !url.includes('1532012164546')) {
    return imageUrl(url)
  }
  
  const name = (item?.name || '').toLowerCase()
  
  // Specific contextual matches with 100% verified working HTTP 200 images
  if (name.includes('chair') || name.includes('desk') || name.includes('table')) {
    return 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80'
  }
  if (name.includes('drafter') || name.includes('drawing') || name.includes('instrument')) {
    return 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80'
  }
  if (name.includes('algorithm') || name.includes('clrs')) {
    return 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80'
  }
  if (name.includes('calculator') || name.includes('casio')) {
    return 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80'
  }
  if (name.includes('keyboard')) {
    return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
  }
  if (name.includes('book') || name.includes('java') || name.includes('python')) {
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  }
  if (name.includes('notes') || name.includes('dbms')) {
    return 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80'
  }
  
  const cat = (item?.category_name || '').toLowerCase()
  if (CATEGORY_FALLBACK_IMAGES[cat]) {
    return CATEGORY_FALLBACK_IMAGES[cat]
  }
  return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
}

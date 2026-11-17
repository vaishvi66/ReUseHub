export function titleCase(value) {
  if (!value) return ''
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatPrice(price) {
  if (price === null || price === undefined) return 'Free'
  return `$${price}`
}

const BADGE_CLASS_MAP = {
  pending: 'badge-pending',
  approved: 'badge-approved',
  accepted: 'badge-approved',
  pickup_scheduled: 'badge-approved',
  available: 'badge-approved',
  reserved: 'badge-pending',
  rejected: 'badge-rejected',
  dismissed: 'badge-rejected',
  removed: 'badge-rejected',
  completed: 'badge-completed',
  reused: 'badge-reused',
  cancelled: 'badge-cancelled',
  under_review: 'badge-pending',
}

export function badgeClass(status) {
  return BADGE_CLASS_MAP[status] || 'badge-cancelled'
}

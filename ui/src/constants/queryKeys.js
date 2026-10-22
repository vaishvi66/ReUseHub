export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  categories: ['categories'],
  items: {
    all: ['items'],
    list: (filters = {}) => ['items', 'list', filters],
    detail: (id) => ['items', 'detail', id],
    mine: ['items', 'mine'],
  },
  requests: {
    all: ['requests'],
    mine: ['requests', 'mine'],
    admin: ['requests', 'admin'],
  },
  dashboard: {
    student: ['dashboard', 'student'],
    admin: ['dashboard', 'admin'],
  },
  admin: {
    students: ['admin', 'students'],
    items: ['admin', 'items'],
    reports: ['admin', 'reports'],
  },
}

export const queryKeys = {
  board: {
    all: ['board'] as const,
    detail: (id: string) => ['board', id] as const,
    comments: (id: string) => ['board', id, 'comments'] as const,
  },
  gallery: {
    all: ['gallery'] as const,
  },
  concerts: {
    all: ['concerts'] as const,
    admin: ['admin', 'concerts'] as const,
  },
  setlists: {
    byConcert: (concertId: string) => ['admin', 'setlists', concertId] as const,
    active: ['setlists', 'active'] as const,
  },
  events: {
    upcoming: ['events', 'upcoming'] as const,
    admin: ['admin', 'events'] as const,
  },
  youtube: {
    videos: ['youtube', 'videos'] as const,
  },
  images: {
    all: ['images'] as const,
    random: ['images', 'random'] as const,
  },
  adminBoard: {
    all: ['admin', 'board'] as const,
    list: (page: number, search: string) => ['admin', 'board', page, search] as const,
  },
  fanchants: {
    all: ['fanchants'] as const,
    admin: ['admin', 'fanchants'] as const,
  },
  activities: {
    all: ['activities'] as const,
    admin: ['admin', 'activities'] as const,
  },
  inquiries: {
    all: ['inquiries'] as const,
    detail: (id: string) => ['inquiries', id] as const,
    admin: ['admin', 'inquiries'] as const,
  },
} as const;

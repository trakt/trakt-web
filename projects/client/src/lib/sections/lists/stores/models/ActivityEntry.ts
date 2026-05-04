export type ActivityEntry<T> = T & ({ watchedAt: Date } | { activityAt: Date });

export type AnalyticsEngine = {
  record: (key: string, data: Record<string, string | number | Date>) => void;
  setUser: (userId: string | Nil) => void;
};

export type AnalyticsEngine = {
  record: (key: string, data: Record<string, string | number | Date>) => void;
  setUserId: (userId: string | Nil) => void;
};

// Strings become HAL dims, numbers become HAL metrics. Nothing else has a
// storage slot, so keep the union to what `splitEventPayload` can route.
export type AnalyticsData = Record<string, string | number>;

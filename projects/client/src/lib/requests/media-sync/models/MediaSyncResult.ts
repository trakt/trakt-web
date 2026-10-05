export type MediaSyncResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

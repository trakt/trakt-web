import { unixToDateTime } from './unixToDateTime.ts';

export function unixToDate(unix: number | Nil): string | Nil {
  return unixToDateTime(unix)?.slice(0, 10) ?? null;
}

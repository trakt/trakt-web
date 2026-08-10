const QUERY_ID = 'query';

export function queryId(key: string) {
  return `${QUERY_ID}:${key}`;
}

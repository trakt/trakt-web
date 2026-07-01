import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';

type PostReorderParams = {
  path: string;
  rank: number[];
} & ApiParams;

export function postReorderRequest(
  { fetch, path, rank }: PostReorderParams,
): Promise<boolean> {
  return rawApiFetch({
    fetch,
    path,
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rank }),
    },
  }).then((response) => response.status === 200);
}

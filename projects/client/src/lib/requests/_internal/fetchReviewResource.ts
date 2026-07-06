import { rawApiFetch } from '$lib/requests/api.ts';
import { toSlurmQuery } from './toSlurmQuery.ts';

type FetchReviewResourceParams = {
  fetch?: typeof fetch;
  path: string;
  slurm?: string;
};

// Fetches a YIR/MIR resource (with images). When a WebView `slurm` token is
// present it is the sole authorization: no Bearer is sent, so a different
// signed-in account can never mix into the request, and a 401 cannot tear down
// the web session. Single place the review queries share this contract.
export function fetchReviewResource(
  { fetch, path, slurm }: FetchReviewResourceParams,
) {
  return rawApiFetch({
    fetch,
    path: `${path}?extended=images${toSlurmQuery(slurm)}`,
    authenticated: !slurm,
  });
}

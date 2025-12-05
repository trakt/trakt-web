import { derived } from 'svelte/store';
import type { ExtendedMediaType } from '../../requests/models/ExtendedMediaType.ts';
import { userPlexStreamQuery } from '../../requests/queries/users/userPlexStreamQuery.ts';
import { toLoadingState } from '../../utils/requests/toLoadingState.ts';
import { useQuery } from '../query/useQuery.ts';

type UsePlexStreamProps = {
  type: ExtendedMediaType;
  slug: string;
};

export function usePlexStream({ slug, type }: UsePlexStreamProps) {
  const response = useQuery(
    userPlexStreamQuery({ slug, type }),
  );

  return {
    plexStreamSrc: derived(
      response,
      ($response) => $response.data?.src ?? null,
    ),
    isLoading: derived(response, toLoadingState),
  };
}

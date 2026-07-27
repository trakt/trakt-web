import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import { map } from 'rxjs';
import { toCoverMediaRef } from './_internal/toCoverMediaRef.ts';

type UseIsCoverProps = {
  type: ExtendedMediaType;
  id: number;
};

export function useIsCover({ type, id }: UseIsCoverProps) {
  const { user } = useUser();

  const isCover = user.pipe(
    map((current) => {
      const cover = toCoverMediaRef(current?.cover.url);
      return cover?.type === type && cover?.id === id;
    }),
  );

  return { isCover };
}

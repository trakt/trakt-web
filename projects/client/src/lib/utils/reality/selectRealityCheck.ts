import type { DocumentaryCheck } from '$lib/requests/models/DocumentaryCheck.ts';
import type { RealityCheck } from '$lib/requests/models/RealityCheck.ts';
import type { RealityCheckVariant } from '$lib/requests/models/RealityCheckVariant.ts';

type SelectRealityCheckParams = {
  story: RealityCheck | null | undefined;
  documentary: DocumentaryCheck | null | undefined;
};

export function selectRealityCheck({
  story,
  documentary,
}: SelectRealityCheckParams): RealityCheckVariant | null | undefined {
  if (documentary) {
    return documentary;
  }

  if (documentary === undefined) {
    return undefined;
  }

  return story;
}

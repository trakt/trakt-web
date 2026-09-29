import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';
import { personaPalette } from './personaPalette.ts';

export function personaAccent(id: YirPersonaId): string {
  return personaPalette(id).accent;
}

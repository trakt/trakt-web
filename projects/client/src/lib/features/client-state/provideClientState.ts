import { useClientStateRegistry } from './_internal/useClientStateRegistry.ts';

export function provideClientState() {
  useClientStateRegistry();
}

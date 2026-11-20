import type { LastPointer } from '$lib/features/onboarding/models/LastPointer.ts';

let last: LastPointer | null = null;

export const lastPointerStore = {
  get: () => last,
  set: (pointer: LastPointer) => {
    last = pointer;
  },
};

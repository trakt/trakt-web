import { NOOP_FN } from '$lib/utils/constants.ts';

(globalThis as Record<string, unknown>).matchMedia = function () {
  return {
    matches: false,
    media: '',
    onchange: null,
    addEventListener: NOOP_FN,
    removeEventListener: NOOP_FN,
    dispatchEvent: NOOP_FN,
  };
};

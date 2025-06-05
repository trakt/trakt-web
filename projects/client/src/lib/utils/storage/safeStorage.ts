import { browser } from '$app/environment';
import { NOOP_FN } from '../constants.ts';

const NOOP_STORAGE = {
  getItem: () => null,
  setItem: NOOP_FN,
  removeItem: NOOP_FN,
  clear: NOOP_FN,
};

export const safeLocalStorage = !browser ? NOOP_STORAGE : localStorage;
export const safeSessionStorage = !browser ? NOOP_STORAGE : sessionStorage;

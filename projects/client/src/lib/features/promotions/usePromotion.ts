import { readonly, writable } from 'svelte/store';
import type { Promotion } from './models/Promotion.ts';

const promotion = writable<Promotion | null>(null);

export function usePromotion() {
  return {
    set: promotion.set,
    promotion: readonly(promotion),
  };
}

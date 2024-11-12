import type { Actions } from '@sveltejs/kit';
import { action as resolve } from '$lib/features/auth/action.ts';

export const actions = {
  resolve,
} satisfies Actions;

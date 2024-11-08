import { action as persist } from '$lib/features/theme/action.ts';
import type { Actions } from '@sveltejs/kit';

export const actions = {
  persist,
} satisfies Actions;

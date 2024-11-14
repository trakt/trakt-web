import { action as resolve } from '$lib/features/auth/action.ts';
import { initiateDeviceAuth } from '$lib/requests/auth/initiateDeviceAuth.ts';
import type { Actions } from '@sveltejs/kit';

export const actions = {
  resolve,
  initiate: initiateDeviceAuth,
} satisfies Actions;

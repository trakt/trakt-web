import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';
import { fetchActivationDetails } from './fetchActivationDetails.ts';
import { fetchAuthorizationStatus } from './fetchAuthorizationStatus.ts';

type ActivationData = {
  url: string;
  code: string;
  state: 'polling';
} | {
  state: 'failed' | 'pending';
};

export function useAuthDevice() {
  let interval: NodeJS.Timeout;
  const activation = writable<ActivationData>({ state: 'pending' });

  const pollAuthorization = async (
    code: string,
    expiresAt: number,
  ) => {
    if (Date.now() > expiresAt) {
      activation.set({ state: 'failed' });
      clearInterval(interval);
      return;
    }

    const response = await fetchAuthorizationStatus(code);
    if (response.redirected) {
      clearInterval(interval);
      globalThis.window.location.assign(response.url);
    }
  };

  const authorization = (_: HTMLElement) => {
    onMount(async () => {
      const response = await fetchActivationDetails();

      if (response.isRejected) {
        activation.set({ state: 'failed' });
        return;
      }

      activation.set({
        state: 'polling',
        url: response.url,
        code: response.userCode,
      });

      const expiresAt = Date.now() + response.expiresIn * 1000;
      interval = setInterval(
        () => pollAuthorization(response.deviceCode, expiresAt),
        response.interval * 1000,
      );
    });

    return {
      destroy() {
        clearInterval(interval);
      },
    };
  };

  return {
    authorization,
    activation: derived(activation, ($data) => $data),
  };
}

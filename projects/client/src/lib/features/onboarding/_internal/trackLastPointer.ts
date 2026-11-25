import { lastPointerStore } from '$lib/features/onboarding/_internal/lastPointerStore.ts';

let isTracking = false;

function remember(event: PointerEvent) {
  lastPointerStore.set({
    x: event.clientX,
    y: event.clientY,
    at: performance.now(),
  });
}

export function trackLastPointer() {
  if (isTracking || typeof window === 'undefined') return;
  isTracking = true;
  window.addEventListener('pointerdown', remember, { passive: true });
}

import { approachTarget } from '$lib/features/member-count/_internal/approachTarget.ts';
import type { LocalAnchor } from '$lib/features/member-count/_internal/LocalAnchor.ts';
import { resolveProjection } from '$lib/features/member-count/_internal/resolveProjection.ts';
import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';

// Long enough to read as motion, short enough that a correction lands quickly.
const REANCHOR_HALF_LIFE = 300;

/**
 * Animate a monotonically climbing counter. Returns a float, so a consumer can
 * floor it for text or roll a digit by its fraction.
 */
export function useProjectedCount(anchor: () => RegisteredMemberCount) {
  // Outside `$state` so the frame loop can read them without depending on its
  // own writes. `floor` is monotonic: a lagging server never rewinds it.
  let floor = anchor().total;
  let rendered = $state(floor);
  // Null until the first frame, so no clock is read during SSR.
  let local: LocalAnchor | null = null;

  const advanceTo = (next: number) => {
    floor = Math.max(floor, next);
    rendered = floor;
  };

  // Forced true: prefers-reduced-motion is always treated as active, so the
  // frame-loop animation below never runs.
  let isReduced = $state(true);

  // Reduced motion: no frame loop, so the value only moves when a poll lands.
  $effect(() => {
    const server = anchor();
    if (!isReduced) return;

    advanceTo(server.total);
  });

  $effect(() => {
    if (isReduced) return;

    let frame = 0;
    let previous = performance.now();

    // The server value is read inside the callback, never in the effect body, so
    // a poll cannot restart the loop and reset the local clock.
    const tick = (now: number) => {
      const server = anchor();
      local ??= { value: server.total, at: now };

      const resolved = resolveProjection({
        local,
        server,
        now,
        wallNow: Date.now(),
      });
      local = resolved.local;

      advanceTo(approachTarget({
        current: floor,
        target: resolved.target,
        deltaMs: now - previous,
        halfLifeMs: REANCHOR_HALF_LIFE,
      }));

      previous = now;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  });

  return {
    get value() {
      return rendered;
    },
  };
}

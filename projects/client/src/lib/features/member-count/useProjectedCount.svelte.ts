import { approachTarget } from '$lib/features/member-count/_internal/approachTarget.ts';
import { projectMemberCount } from '$lib/features/member-count/_internal/projectMemberCount.ts';
import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';
import { useMedia, WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';

// Long enough to read as motion, short enough that the number is never
// meaningfully behind the server.
const REANCHOR_HALF_LIFE = 300;

/**
 * Animate a monotonically climbing counter from a server anchor. Returns a
 * float, so a consumer can floor it for text or roll a digit by its fraction.
 */
export function useProjectedCount(anchor: () => RegisteredMemberCount) {
  // Outside `$state` so the frame loop can read it without depending on its own
  // writes. Monotonic: a downward correction freezes rather than rewinds.
  let floor = projectMemberCount({ anchor: anchor(), now: Date.now() });
  let rendered = $state(floor);

  const advanceTo = (next: number) => {
    floor = Math.max(floor, next);
    rendered = floor;
  };

  let isReduced = $state(false);
  $effect(() => {
    const subscription = useMedia(WellKnownMediaQuery.reducedMotion)
      .subscribe((matches) => isReduced = matches);

    return () => subscription.unsubscribe();
  });

  $effect(() => {
    const current = anchor();

    if (isReduced) {
      advanceTo(projectMemberCount({ anchor: current, now: Date.now() }));
      return;
    }

    let frame = 0;
    let previous = performance.now();

    const tick = (elapsed: number) => {
      advanceTo(approachTarget({
        current: floor,
        target: projectMemberCount({ anchor: current, now: Date.now() }),
        deltaMs: elapsed - previous,
        halfLifeMs: REANCHOR_HALF_LIFE,
      }));
      previous = elapsed;
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

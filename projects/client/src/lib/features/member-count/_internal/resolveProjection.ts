import { isAnchorStale } from '$lib/features/member-count/_internal/isAnchorStale.ts';
import type { LocalAnchor } from '$lib/features/member-count/_internal/LocalAnchor.ts';
import { projectCount } from '$lib/features/member-count/_internal/projectCount.ts';
import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';

type ResolveProjectionParams = {
  local: LocalAnchor;
  server: RegisteredMemberCount;
  /** Monotonic clock reading, for measuring local elapsed time. */
  now: number;
  /** Wall clock reading, for judging the age of the server response. */
  wallNow: number;
};

/**
 * Decide where the counter should be, and which anchor to carry forward.
 *
 * The server only ever pushes the anchor forward: a total ahead of the
 * projection re-anchors it, a total behind it leaves local motion intact.
 */
export function resolveProjection(
  { local, server, now, wallNow }: ResolveProjectionParams,
): { local: LocalAnchor; target: number } {
  // A response too old to project from holds the last reported total. Parking
  // the clock at `now` means a recovered endpoint resumes from here instead of
  // leaping forward by the whole outage.
  if (isAnchorStale({ anchoredAt: server.anchoredAt, now: wallNow })) {
    const held = Math.max(local.value, server.total);
    return { local: { value: held, at: now }, target: held };
  }

  const projected = projectCount({
    value: local.value,
    elapsedMs: now - local.at,
    ratePerDay: server.ratePerDay,
  });

  return server.total > projected
    ? { local: { value: server.total, at: now }, target: server.total }
    : { local, target: projected };
}

<script lang="ts">
  import TrendLineUpIcon from "$lib/components/icons/TrendLineUpIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { toStatLabel } from "./toStatLabel.ts";

  const { user, plays }: { user: UserProfile; plays: number } = $props();

  const displayName = $derived(toDisplayableName(user));
  const playsLabel = $derived(toStatLabel(plays, "plays", languageTag()));
</script>

<div class="trakt-leaderboard-viewer-card">
  <div class="viewer-main">
    <div class="viewer-identity">
      <span class="viewer-avatar">
        <span class="viewer-glow" aria-hidden="true"></span>
        <UserAvatar {user} />
      </span>

      <div class="viewer-copy">
        <div class="viewer-heading">
          <p class="trakt-card-title ellipsis bold">{displayName}</p>
          <span class="you-chip bold">{m.text_leaderboard_you()}</span>
        </div>
        <span class="tag secondary viewer-plays">{playsLabel}</span>
      </div>
    </div>

    <span class="viewer-cue" aria-hidden="true">
      <TrendLineUpIcon />
    </span>
  </div>

  <div class="viewer-divider"></div>

  <div class="viewer-upsell">
    <p class="tag secondary upsell-copy">{m.text_leaderboard_upsell_footer()}</p>
    <GetVIPLink source="leaderboard-viewer" />
  </div>
</div>

<style lang="scss">
  .trakt-leaderboard-viewer-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--gap-s);
    border-radius: var(--border-radius-l);

    background: color-mix(in srgb, var(--purple-500) 14%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 45%, transparent);
  }

  .viewer-main {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .viewer-identity {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    flex: 1;
    min-width: 0;
  }

  .viewer-avatar {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;

    // Local stacking context so the -1 z-index glow stays behind the avatar,
    // not behind the card/page.
    isolation: isolate;
  }

  .viewer-glow {
    position: absolute;
    inset: -40%;
    z-index: -1;

    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--purple-500) 70%, transparent) 0%,
      transparent 70%
    );
    filter: blur(var(--ni-8));
  }

  .viewer-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .viewer-heading {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    min-width: 0;
  }

  .you-chip {
    flex: 0 0 auto;

    padding: 0 var(--ni-6);
    border-radius: var(--border-radius-xxl);

    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
    color: var(--color-text-primary);
    font-size: var(--font-size-tag);
  }

  .viewer-plays {
    color: var(--color-text-secondary);
  }

  .viewer-cue {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--ni-40);
    height: var(--ni-40);
    border-radius: 50%;

    color: var(--purple-200);
    background: color-mix(in srgb, var(--purple-500) 22%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 45%, transparent);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .viewer-divider {
    height: var(--ni-1);
    background: color-mix(in srgb, var(--purple-500) 30%, transparent);
  }

  .viewer-upsell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .upsell-copy {
    color: var(--color-text-secondary);
    min-width: 0;
  }
</style>

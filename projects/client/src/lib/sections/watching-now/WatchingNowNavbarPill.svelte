<script lang="ts">
  import AvatarStack from "$lib/components/avatar-stack/AvatarStack.svelte";
  import LiveDot from "$lib/components/live-dot/LiveDot.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFollowingWatching } from "./useFollowingWatching.ts";
  import WatchingNowDrawer from "./WatchingNowDrawer.svelte";

  const AVATAR_LIMIT = 3;

  const { entries } = useFollowingWatching();
  const { track } = useTrack(AnalyticsEvent.WatchingNowOpen);

  let isOpen = $state(false);

  const count = $derived($entries.length);
  const avatars = $derived(
    $entries
      .slice(0, AVATAR_LIMIT)
      .map((entry) => ({ key: entry.key, user: entry.user })),
  );

  function open() {
    isOpen = true;
    track({ source: "navbar" });
  }
</script>

{#if count > 0}
  <button
    type="button"
    class="trakt-watching-now-navbar-pill"
    aria-label={m.button_label_watching_now({ count })}
    onclick={open}
  >
    <AvatarStack {avatars} size="small" linked={false} />
    <LiveDot />
    <span class="small bold">{count}</span>
    <span class="pill-label small">{m.tag_text_watching_now_live()}</span>
  </button>
{/if}

{#if isOpen && count > 0}
  <WatchingNowDrawer entries={$entries} onClose={() => (isOpen = false)} />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-watching-now-navbar-pill {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    padding-block: var(--ni-4);
    padding-inline: var(--ni-4) var(--ni-12);
    border-radius: var(--border-radius-pill);

    color: var(--color-text-primary);
    background: color-mix(
      in srgb,
      var(--color-background-red) 18%,
      transparent
    );
    font-variant-numeric: tabular-nums;

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(
          in srgb,
          var(--color-background-red) 28%,
          transparent
        );
      }
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
    }

    .pill-label {
      white-space: nowrap;

      @include for-tablet-sm-and-below {
        display: none;
      }
    }
  }
</style>

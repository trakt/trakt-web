<script lang="ts">
  import { page } from "$app/state";
  import CassetteIcon from "$lib/components/icons/CassetteIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { MAX_MIXTAPE_PICKS } from "./_internal/MAX_MIXTAPE_PICKS.ts";
  import { parseMixtapeParams } from "./_internal/parseMixtapeParams.ts";
  import { toMixState } from "./_internal/toMixState.ts";
  import { useMixtapeSession } from "./_internal/useMixtapeSession.ts";

  const { session } = useMixtapeSession();
  const { track } = useTrack(AnalyticsEvent.MixtapeMix);

  const params = $derived(parseMixtapeParams(page.url.searchParams));
  const count = $derived(params.picks.length);
  const state = $derived(
    toMixState({
      count,
      max: MAX_MIXTAPE_PICKS,
      view: params.view,
      isMixing: $session.isMixing,
    }),
  );

  const href = $derived.by(() => {
    const base = {
      type: params.type,
      picks: params.picks,
      source: params.source ?? undefined,
    };
    switch (state) {
      case "picking":
      case "ready":
        return UrlBuilder.mixtape({ ...base, view: "results" });
      case "done":
        return UrlBuilder.mixtape(base);
      default:
        return undefined;
    }
  });

  const label = $derived.by(() => {
    switch (state) {
      case "mixing":
        return m.button_text_mixtape_mixing();
      case "done":
        return m.button_text_mixtape_remix();
      default:
        return m.button_text_mix_it();
    }
  });

  const hasCount = $derived(state === "picking" || state === "ready");
</script>

{#snippet content()}
  <span class="entry-icon"><CassetteIcon /></span>
  <span class="entry-label">{label}</span>
  {#if hasCount}
    <span class="entry-count">
      {m.text_mixtape_deck_count({ count, max: MAX_MIXTAPE_PICKS })}
    </span>
  {/if}
{/snippet}

<div
  class="trakt-mixtape-mix-entry"
  data-state={state}
  data-entry-glow={state === "ready" ? "" : undefined}
>
  <span class="entry-fill" aria-hidden="true"></span>
  {#if href}
    <Link
      {href}
      {label}
      navigationType={DpadNavigationType.Item}
      color="inherit"
      noscroll
      onclick={() =>
        state !== "done" &&
        track({
          type: params.type,
          picks: count,
          fits: $session.fitCount,
        })}
    >
      {@render content()}
    </Link>
  {:else}
    <span class="entry-static" aria-disabled="true">
      {@render content()}
    </span>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape-mix-entry {
    --entry-inset: var(--ni-12);
    --entry-ring: transparent;
    --entry-wash: transparent;
    --mix-duration: calc(10 * var(--transition-increment));

    position: relative;
    display: grid;
    min-width: 0;
    border-radius: inherit;

    :global(.trakt-link),
    .entry-static {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);

      box-sizing: border-box;
      min-width: 0;
      height: var(--navbar-entry-size);
      padding-inline: var(--entry-inset);

      border-radius: inherit;
      background: var(--entry-wash);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs) var(--entry-ring);
      color: var(--color-text-primary);
      text-decoration: none;

      transition:
        background var(--transition-increment) ease-in-out,
        box-shadow var(--transition-increment) ease-in-out,
        color var(--transition-increment) ease-in-out;
    }

    .entry-static {
      cursor: default;
    }

    /*
      The fill sits beside the link, not inside it, so it survives the swap
      between the link and the resting span. It sweeps with a keyframe keyed
      on the state: a transition would miss the change, because the results
      url can land in the same recalc that first makes the sweep possible.
    */
    .entry-fill {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--color-mixtape-mix-fill);
      clip-path: inset(0 100% 0 0);
      pointer-events: none;
    }

    &:dir(rtl) .entry-fill {
      clip-path: inset(0 0 0 100%);
    }

    &[data-state="mixing"] .entry-fill,
    &[data-state="done"] .entry-fill {
      animation: mix-entry-fill var(--mix-duration) cubic-bezier(0.4, 0, 0.2, 1)
        both;
    }

    .entry-icon {
      flex: none;
      display: flex;
      color: var(--color-text-emphasis);

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    .entry-label {
      font-weight: 500;
      white-space: nowrap;
    }

    .entry-count {
      color: var(--color-text-secondary);
      font-size: var(--font-size-text-small);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    &[data-state="empty"] {
      .entry-static,
      .entry-icon {
        color: var(--color-text-secondary);
      }
    }

    &[data-state="picking"] {
      --entry-ring: var(--color-navbar-entry-chip-ring);
    }

    &[data-state="ready"] {
      --entry-ring: var(--color-segmented-selector-border);
      --entry-wash: var(--color-navbar-entry-chip-background);

      .entry-count {
        color: var(--color-text-emphasis);
      }
    }

    &[data-state="mixing"],
    &[data-state="done"] {
      --entry-ring: var(--color-segmented-selector-border);
    }

    @include for-mobile {
      --entry-inset: 0;

      :global(.trakt-link),
      .entry-static {
        justify-content: center;
      }

      .entry-label {
        display: none;
      }

      .entry-count {
        position: absolute;
        top: calc(-1 * var(--ni-6));
        inset-inline-end: calc(-1 * var(--ni-6));

        display: flex;
        align-items: center;
        justify-content: center;

        min-width: var(--navbar-entry-chip-size);
        height: var(--navbar-entry-chip-size);
        padding-inline: var(--ni-4);
        box-sizing: border-box;

        border: var(--border-thickness-xs) solid var(--color-background);
        border-radius: var(--border-radius-pill);
        background:
          linear-gradient(
            var(--color-navbar-entry-chip-background),
            var(--color-navbar-entry-chip-background)
          ),
          var(--color-background);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs)
          var(--color-navbar-entry-chip-ring);
        color: var(--color-navbar-entry-chip-text);
        font-size: var(--font-size-tag);
      }
    }
  }

  @keyframes mix-entry-fill {
    to {
      clip-path: inset(0 0 0 0);
    }
  }
</style>

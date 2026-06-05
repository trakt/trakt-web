<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { profileDrawerNavigation } from "../_internal/profileDrawerNavigation.ts";
  import { useMatch } from "../_internal/useMatch.ts";
  import { matchLabel } from "./_internal/matchLabel.ts";

  const { slug }: { slug: string } = $props();

  const { mode } = useDiscover();
  const { match, isLoading, band } = $derived(useMatch({ slug, mode: $mode }));

  const score = $derived($match?.score ?? 0);
  const label = $derived(matchLabel(score));

  const { buildMatchDrawerLink } = profileDrawerNavigation();
  const drawerLink = $derived(buildMatchDrawerLink());
</script>

{#if $isLoading}
  <!-- Placeholder mirrors the loaded pill's outer dimensions (padding,
       border, radius) so the surrounding profile-user-details column does
       not jump when the real score lands. -->
  <div class="trakt-match-pill-link-wrapper">
    <div
      class="trakt-match-pill"
      role="status"
      data-loading="true"
      aria-busy="true"
      aria-label={m.match_pill_loading_aria_label()}
    >
      <span
        class="trakt-match-pill-placeholder trakt-match-pill-placeholder-score"
      ></span>
      <span
        class="trakt-match-pill-placeholder trakt-match-pill-placeholder-label"
      ></span>
    </div>
  </div>
{:else if $match}
  <div class="trakt-match-pill-link-wrapper">
    <Link
      {...drawerLink}
      color="inherit"
      label={m.match_pill_aria_label({ score, label })}
    >
      <span
        class="trakt-match-pill"
        data-band={band}
        style:--fill={`${score}%`}
      >
        <span class="trakt-match-pill-anchor">{m.match_pill_anchor()}</span>
        <span class="trakt-match-pill-score bold">
          {score}<span class="trakt-match-pill-suffix small">%</span>
        </span>
        <span class="trakt-match-pill-caret" aria-hidden="true">
          <CaretRightIcon />
        </span>
      </span>
    </Link>
  </div>
{/if}

<style>
  .trakt-match-pill-link-wrapper {
    align-self: flex-start;
    margin-top: var(--gap-xxs);

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .trakt-match-pill {
    --pill-accent: var(--color-foreground);
    --height-match-label: calc(var(--font-size-text) + var(--ni-2));
    --fill: 0%;

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);
    height: var(--ni-28);
    padding: 0 var(--ni-12);
    box-sizing: border-box;
    border-radius: var(--border-radius-xxl);

    /* Background is the progress encoding: the score percent of the pill
       width is filled with a soft accent tint, the rest is neutral. Reads
       like a score bar without needing a separate UI element. */
    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--pill-accent) 22%, transparent) 0%,
      color-mix(in srgb, var(--pill-accent) 22%, transparent) var(--fill),
      color-mix(in srgb, var(--color-foreground) 5%, transparent) var(--fill),
      color-mix(in srgb, var(--color-foreground) 5%, transparent) 100%
    );

    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 40%, transparent);
    color: inherit;

    cursor: pointer;

    font-family: inherit;
    white-space: nowrap;

    transition:
      transform var(--transition-increment) ease-out,
      border-color var(--transition-increment) ease-out;

    &[data-band="high"] {
      border-color: color-mix(in srgb, var(--pill-accent) 60%, transparent);
    }

    &[data-band="mid"] {
      border-color: color-mix(in srgb, var(--pill-accent) 30%, transparent);
    }

    &:active {
      transform: scale(0.97);
    }

    &[data-loading="true"] {
      cursor: default;
      background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

      &:active {
        transform: none;
      }
    }
  }

  .trakt-match-pill-score {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    height: var(--height-match-label);
  }

  .trakt-match-pill-suffix {
    opacity: 0.7;
    margin-left: var(--ni-1);
  }

  .trakt-match-pill-anchor {
    white-space: nowrap;
    opacity: 0.85;
    height: var(--height-match-label);
  }

  .trakt-match-pill-caret {
    display: inline-flex;
    align-items: center;
    opacity: 0.55;
    margin-left: var(--ni-6);
    font-size: var(--font-size-tag);
    transition:
      transform var(--transition-increment) ease-out,
      opacity var(--transition-increment) ease-out;
  }

  .trakt-match-pill:hover .trakt-match-pill-caret,
  .trakt-match-pill:focus-visible .trakt-match-pill-caret {
    opacity: 0.9;
    transform: translateX(var(--ni-2));
  }

  /* Skeleton inner blocks sized to typical pill content so the outer
     dimensions match: ~3.5ch score area, ~12ch label area. Shimmer sweep
     mirrors the SkeletonCard treatment for visual continuity. */
  .trakt-match-pill-placeholder {
    display: inline-block;
    height: var(--height-match-label);
    border-radius: var(--border-radius-xs, var(--ni-4));
    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);

    position: relative;
    overflow: hidden;

    &::after {
      content: "";

      position: absolute;
      top: 0;

      width: 300%;
      height: 100%;

      transform: translateX(100%);

      animation: slide calc(8 * var(--transition-increment)) infinite;

      background: linear-gradient(
        110deg,
        transparent 0%,
        transparent 30%,
        color-mix(in srgb, var(--color-foreground) 25%, transparent) 50%,
        transparent 70%,
        transparent 100%
      );
    }
  }

  .trakt-match-pill-placeholder-score {
    width: 3.5ch;
  }

  .trakt-match-pill-placeholder-label {
    width: 12ch;
  }
</style>

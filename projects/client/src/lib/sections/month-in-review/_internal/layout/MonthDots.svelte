<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { isPastMonth } from "../data/isPastMonth.ts";

  const {
    slug,
    year,
    month,
  }: {
    slug: string;
    year: number;
    month: number;
  } = $props();

  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  const isAvailable = (value: number) => isPastMonth({ year, month: value });

  const toLabel = (value: number) =>
    toHumanMonth(new Date(year, value - 1, 1), languageTag());
</script>

<nav class="trakt-month-review-dots" aria-label={String(year)}>
  {#each months as value (value)}
    {#if value === month}
      <span
        class="dot"
        data-state="current"
        aria-current="page"
        aria-label={toLabel(value)}
        role="img"
      ></span>
    {:else if isAvailable(value)}
      <Link
        href={UrlBuilder.users(slug).monthInReview(year, value)}
        label={toLabel(value)}
        underline="none"
      >
        <span class="dot" data-state="available"></span>
      </Link>
    {:else}
      <span class="dot" data-state="future" aria-hidden="true"></span>
    {/if}
  {/each}
</nav>

<style lang="scss">
  .trakt-month-review-dots {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .dot {
    display: block;
    width: var(--ni-10);
    height: var(--ni-10);
    border-radius: 50%;
    transition: transform var(--transition-increment) ease-out;

    &[data-state="available"] {
      background: color-mix(
        in srgb,
        var(--color-month-review-accent) 35%,
        transparent
      );

      &:hover {
        transform: scale(1.3);
      }

      :global(.trakt-link:focus-visible) & {
        transform: scale(1.3);
        outline: var(--ni-2) solid var(--color-month-review-accent);
        outline-offset: var(--ni-2);
      }
    }

    &[data-state="current"] {
      width: var(--ni-14);
      height: var(--ni-14);
      background: var(--color-month-review-accent);
      box-shadow:
        0 0 0 var(--ni-2) var(--color-background),
        0 0 0 var(--ni-4) var(--color-month-review-accent);
    }

    &[data-state="future"] {
      box-shadow: inset 0 0 0 1.5px var(--color-month-review-track);
    }
  }
</style>

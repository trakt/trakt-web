<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { AwardEntry } from "$lib/requests/models/AwardEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AwardTag from "./AwardTag.svelte";
  import { toAwardCategoryName } from "./toAwardCategoryName.ts";

  const { entry, variant }: { entry: AwardEntry; variant: "title" | "person" } =
    $props();

  const category = $derived(toAwardCategoryName(entry.category));

  const subject = $derived.by(() => {
    if (variant === "title" && entry.person) {
      return {
        href: UrlBuilder.people(entry.person.slug),
        text: entry.person.name,
      };
    }

    if (variant === "person" && entry.media) {
      return {
        href: UrlBuilder.media(entry.media.type, entry.media.slug),
        text: entry.media.year
          ? `${entry.media.title} (${entry.media.year})`
          : entry.media.title,
      };
    }

    return null;
  });
</script>

{#snippet body()}
  <span class="row-body">
    {#if variant === "person"}
      <span class="row-year small secondary">{entry.year}</span>
    {/if}
    <AwardTag won={entry.won} variant="inline" />
    <span class="row-text" class:is-full={!subject}>
      <span class="row-category ellipsis">{category}</span>
      {#if subject}
        <span class="row-subject small ellipsis">{subject.text}</span>
      {/if}
    </span>
  </span>
{/snippet}

<li
  class="trakt-award-row"
  data-variant={variant}
  class:is-won={entry.won}
  class:is-link={subject != null}
>
  {#if subject}
    <Link href={subject.href} color="inherit" underline="none">
      {@render body()}
    </Link>
  {:else}
    {@render body()}
  {/if}
</li>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-award-row {
    --award-row-tag-width: minmax(var(--ni-64), max-content);
    --award-sheen-duration: calc(var(--transition-increment) * 5);

    position: relative;
    overflow: hidden;

    margin-inline: var(--award-drawer-inset, 0);

    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--border-thickness-xxs)
      var(--color-award-row-edge);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, box-shadow;

    .row-body {
      display: grid;
      grid-template-columns: var(--award-row-tag-width) minmax(0, 1fr);
      align-items: center;
      gap: var(--gap-s);

      box-sizing: border-box;
      min-height: var(--ni-40);
      padding: var(--ni-8) var(--ni-14);
    }

    &[data-variant="person"] .row-body {
      grid-template-columns: var(--ni-32) var(--award-row-tag-width) minmax(
          0,
          1fr
        );
    }

    .row-text {
      display: flex;
      align-items: baseline;
      gap: var(--gap-s);
      min-width: 0;
    }

    &[data-variant="person"] .row-text {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }

    .row-category {
      flex: 0 1 auto;
      min-width: 0;
      font-weight: 500;
    }

    &:not(.is-won) .row-category {
      color: var(--color-text-secondary);
      font-weight: 400;
    }

    .row-subject {
      color: var(--color-link-active);
      font-weight: 500;
    }

    &[data-variant="title"] .row-subject {
      flex: 1 0 var(--ni-80);
      text-align: end;
    }

    .row-year {
      font-variant-numeric: tabular-nums;
    }

    &:has(:focus-visible) {
      box-shadow: inset 0 0 0 var(--border-thickness-xs)
        var(--color-link-active);
    }

    @include for-mouse {
      &.is-link:hover {
        background:
          linear-gradient(
            var(--color-award-chip-hover),
            var(--color-award-chip-hover)
          ),
          var(--color-card-background);
      }

      &.is-link.is-won:hover {
        box-shadow: inset 0 0 0 var(--border-thickness-xxs)
          var(--color-award-tag-won-ring);
      }
    }

    &.is-won::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;

      background: linear-gradient(
        110deg,
        transparent 30%,
        var(--color-award-gold-soft) 50%,
        transparent 70%
      );
      translate: calc(var(--rtl-sign) * -100%) 0;
    }

    @media (prefers-reduced-motion: no-preference) {
      @include for-mouse {
        &.is-link.is-won:hover::after {
          translate: calc(var(--rtl-sign) * 100%) 0;
          transition: translate var(--award-sheen-duration) ease-out;
        }
      }
    }

    @include for-mobile {
      &[data-variant="title"] .row-text {
        flex-direction: column;
        align-items: stretch;
        gap: 0;
      }

      &[data-variant="title"] .row-subject {
        flex: none;
        text-align: start;
      }
    }
  }
</style>

<script lang="ts">
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaAward } from "../../../awards/MediaAward.ts";

  /*
    The person masthead's gold award pill, seated on the poster's top edge.
    Wins lead, nominations understudy - "3 Awards" beats "5 Nominations"
    whenever there is a single win to count. The pill routes to the awards
    drawer.
  */
  const { awards, link, title }: {
    awards: ReadonlyArray<MediaAward>;
    link: {
      href: string;
      noscroll?: boolean;
      replacestate?: boolean;
    };
    title: string;
  } = $props();

  const wins = $derived(awards.filter((award) => award.isWinner).length);

  const label = $derived.by(() => {
    if (wins > 0) {
      return wins === 1
        ? m.text_person_awards_count_one({ count: wins })
        : m.text_person_awards_count({ count: wins });
    }
    if (awards.length > 0) {
      return awards.length === 1
        ? m.text_person_nominations_count_one({ count: awards.length })
        : m.text_person_nominations_count({ count: awards.length });
    }
    return null;
  });
</script>

{#if label}
  <div class="trakt-summary-header-awards-pill">
    <Link
      href={link.href}
      noscroll={link.noscroll}
      replacestate={link.replacestate}
      color="inherit"
      label={m.button_label_view_awards({ title })}
    >
      <span class="awards-pill-mark" aria-hidden="true"><TrophyIcon /></span>
      <span class="awards-pill-label">{label}</span>
    </Link>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-header-awards-pill {
    :global(.trakt-link) {
      text-decoration: none;

      display: inline-flex;
      align-items: center;
      gap: var(--gap-xxs);

      padding: var(--ni-5) var(--ni-12);
      border-radius: var(--border-radius-xxl);

      color: var(--yellow-300);
      background-color: color-mix(in srgb, var(--yellow-500) 14%, transparent);
      border: var(--ni-1) solid
        color-mix(in srgb, var(--yellow-400) 28%, transparent);

      /* Seated over artwork: the mix alone reads as a hole in the poster. */
      backdrop-filter: blur(var(--ni-8));

      transition: var(--transition-increment) ease-in-out;
      transition-property: color, background-color;
    }

    @include for-mouse {
      :global(.trakt-link:hover) {
        color: var(--yellow-200);
        background-color: color-mix(
          in srgb,
          var(--yellow-500) 22%,
          transparent
        );
      }
    }

    :global(.trakt-link:focus-visible) {
      color: var(--yellow-200);
      background-color: color-mix(in srgb, var(--yellow-500) 22%, transparent);
    }

    .awards-pill-mark {
      display: inline-flex;
      align-items: center;

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }

    .awards-pill-label {
      font-size: var(--font-size-text-small);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }
  }
</style>

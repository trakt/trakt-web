<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { EpisodeUrlOverride } from "$lib/sections/lists/components/models/EpisodeUrlOverride";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";

  type MoreEpisodesCardProps = {
    episodes: EpisodeEntry[];
    link: EpisodeUrlOverride;
  };

  const { episodes, link }: MoreEpisodesCardProps = $props();

  const firstEpisode = $derived(episodes.at(0));
  const lastEpisode = $derived(episodes.at(-1));

  const totalRuntime = $derived(
    episodes.reduce(
      (total, episode) =>
        total + (isNaN(episode.runtime) ? 0 : episode.runtime),
      0,
    ),
  );
  const durationLeft = $derived(
    toHumanDuration({ minutes: totalRuntime }, languageTag()),
  );
</script>

{#if firstEpisode && lastEpisode}
  <div class="trakt-more-episodes-card">
    <LandscapeCard>
      <Link
        focusable={false}
        color="inherit"
        href={link.href}
        noscroll={link.noscroll}
        replacestate={link.replacestate}
      >
        <div class="more-episodes-cover">
          <p class="more-episodes-count">
            {m.text_more_episodes_count({ count: episodes.length })}
          </p>
          <p class="more-episodes-label uppercase">
            {m.text_more_episodes()}
          </p>
        </div>
      </Link>

      <CardFooter>
        <p class="trakt-card-title ellipsis">
          <bdi dir="ltr">{m.episode_footer_episode_range({
            startEpisode: firstEpisode.number,
            endEpisode: lastEpisode.number,
          })}</bdi>
        </p>
        <p class="trakt-card-subtitle ellipsis uppercase">
          {m.text_duration_left({ duration: durationLeft })}
        </p>
      </CardFooter>
    </LandscapeCard>
  </div>
{/if}

<style lang="scss">
  .trakt-more-episodes-card {
    :global(.trakt-link) {
      text-decoration: none;
    }

    .more-episodes-cover {
      height: var(--height-override-card-cover, var(--height-card-cover));
      box-sizing: border-box;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--gap-xxs);

      border: var(--border-thickness-xxs) dashed
        color-mix(in srgb, var(--color-border) 60%, transparent);
      border-radius: var(--border-radius-m);
    }

    .more-episodes-count {
      margin: 0;

      color: var(--color-text-primary);
      font-size: var(--ni-24);
      font-weight: 700;
    }

    .more-episodes-label {
      margin: 0;

      color: var(--color-text-secondary);
      font-size: var(--font-size-text-small);
      font-weight: 500;
      letter-spacing: 0.08em;
    }
  }
</style>

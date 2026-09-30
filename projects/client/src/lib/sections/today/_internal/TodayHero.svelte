<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import WatchedTag from "$lib/components/media/tags/WatchedTag.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import type { TodayTitleStory } from "../models/TodayTitleStory.ts";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import TodayTileFaces from "./TodayTileFaces.svelte";
  import { hasWatchedToo } from "./hasWatchedToo.ts";
  import { todayStoryNavigation } from "./todayStoryNavigation.ts";
  import { toFriendActionText } from "./toFriendActionText.ts";

  const { story }: { story: TodayTitleStory } = $props();

  const { history } = useUser();
  const { storyLink } = todayStoryNavigation();

  const link = $derived(storyLink(story.key));
  const isWatchedToo = $derived(
    hasWatchedToo({ history: $history, media: story.media }),
  );
  const latest = $derived(story.actions.at(0));
  const onlyUser = $derived(
    story.users.length === 1 ? story.users.at(0) : undefined,
  );
  const names = $derived(
    onlyUser
      ? toDisplayableName(onlyUser)
      : m.text_today_friends_other({ count: story.users.length }),
  );
  const meta = $derived.by(() => {
    if (story.users.length > 1) {
      return m.text_today_friends_watched({ count: story.users.length });
    }
    return latest ? toFriendActionText(latest) : "";
  });
</script>

{#snippet watchedTag()}
  <WatchedTag variant="full" />
{/snippet}

<section class="trakt-today-hero">
  <CrossOriginImage
    classList="hero-backdrop"
    src={story.media.cover.url.medium}
    alt=""
  />
  <div class="hero-fade"></div>

  <div class="hero-content">
    <div class="hero-people">
      <TodayTileFaces users={story.users} />
      <p class="bold ellipsis hero-names">{names}</p>
      {#if story.milestone}
        <TodayMilestoneChip milestone={story.milestone} />
      {/if}
    </div>

    <div class="hero-poster">
      <SummaryPoster
        src={story.media.poster.url.medium}
        alt={m.image_alt_media_poster({ title: story.media.title })}
        tags={isWatchedToo ? watchedTag : undefined}
      />
    </div>

    <div class="hero-text">
      <h2 class="hero-title">{story.media.title}</h2>
      <p class="small hero-meta ellipsis">{meta}</p>
      <div class="hero-action">
        <Button
          href={link.href}
          noscroll={link.noscroll}
          replacestate={link.replacestate}
          label={m.button_label_play_story({ title: story.media.title })}
          size="small"
          color="purple"
        >
          {m.button_text_play_story()}
          {#snippet icon()}
            <PlayIcon size="small" />
          {/snippet}
        </Button>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-hero {
    position: relative;
    overflow: hidden;

    min-height: calc(var(--ni-320) + var(--ni-80));
    border-radius: var(--border-radius-xl);
    background: var(--shade-900);
    color: var(--shade-10);
    box-shadow:
      0 0 0 var(--border-thickness-xxs)
        color-mix(in srgb, var(--purple-400) 35%, transparent),
      0 var(--ni-16) var(--ni-48)
        color-mix(in srgb, var(--purple-700) 30%, transparent);

    :global(.hero-backdrop) {
      transition: transform calc(var(--transition-duration-short) * 2) ease-out;
    }

    @include for-mouse {
      &:hover :global(.hero-backdrop) {
        transform: scale(1.04);
      }
    }

    :global(.hero-backdrop) {
      position: absolute;
      inset: 0;

      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-fade {
      position: absolute;
      inset: 0;

      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--shade-1000) 15%, transparent),
        color-mix(in srgb, var(--shade-1000) 96%, transparent)
      ),
      radial-gradient(
        circle at 50% 110%,
        color-mix(in srgb, var(--purple-600) 45%, transparent),
        transparent 60%
      );
    }

    .hero-content {
      position: relative;

      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      height: 100%;
      min-height: inherit;
      box-sizing: border-box;

      padding: var(--gap-m);
    }

    .hero-people {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .hero-names {
      flex-grow: 1;
      min-width: 0;
      color: inherit;
    }

    .hero-poster {
      --summary-poster-width: var(--ni-144);

      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;

      padding-bottom: var(--gap-s);

      :global(img) {
        box-shadow: 0 var(--ni-12) var(--ni-32)
          color-mix(in srgb, var(--shade-1000) 60%, transparent);
      }
    }

    .hero-text {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
    }

    .hero-title {
      margin: 0;
      color: inherit;
    }

    .hero-meta {
      color: color-mix(in srgb, var(--shade-10) 78%, transparent);
    }

    .hero-action {
      display: flex;
      margin-top: var(--gap-xs);
    }

    @include for-mobile {
      min-height: var(--ni-200);

      .hero-content {
        display: grid;
        grid-template-columns: var(--ni-80) minmax(0, 1fr);
        grid-template-areas:
          "people people"
          "poster text";
        align-items: end;
        column-gap: var(--gap-m);
      }

      .hero-people {
        grid-area: people;
        align-self: start;
      }

      .hero-poster {
        --summary-poster-width: var(--ni-80);

        grid-area: poster;
        padding-bottom: 0;
      }

      .hero-text {
        grid-area: text;
      }
    }
  }
</style>

<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { dedupe } from "$lib/utils/array/dedupe.ts";
  import { isStorySeen } from "./_internal/isStorySeen.ts";
  import { todayStoryNavigation } from "./_internal/todayStoryNavigation.ts";
  import { toFrameMedia } from "./_internal/toFrameMedia.ts";
  import { toStoryGroups } from "./_internal/toStoryGroups.ts";
  import { useTodaySeenStories } from "./useTodaySeenStories.ts";
  import { useTodayStories } from "./useTodayStories.ts";

  const MAX_FACES = 3;
  const MAX_POSTERS = 2;

  const { type }: { type: DiscoverMode } = $props();

  const { filterMap } = useFilter();
  const { titles, forYou } = $derived(
    useTodayStories({ type, filter: $filterMap }),
  );
  const { seenStories } = useTodaySeenStories();
  const { storyLink } = todayStoryNavigation();

  const groups = $derived(
    toStoryGroups({ forYou: $forYou ?? [], titles: $titles ?? [] }),
  );
  const unseen = $derived(
    groups.filter(
      (group) => !isStorySeen({ group, seenStories: $seenStories }),
    ),
  );
  const target = $derived(unseen.at(0) ?? groups.at(0));
  const link = $derived(target ? storyLink(target.key) : null);

  const faces = $derived(
    dedupe(
      (user) => user.key,
      groups.flatMap((group) =>
        group.type === "title" ? group.story.users : [],
      ),
    ).slice(0, MAX_FACES),
  );
  const posters = $derived(
    dedupe(
      (media) => media.key,
      groups.flatMap((group) => {
        const frame = group.frames.at(0);
        return frame ? [toFrameMedia(frame)] : [];
      }),
    ).slice(0, MAX_POSTERS),
  );
</script>

{#if link}
  <div class="trakt-today-navbar-entry" data-seen={unseen.length === 0}>
    <Link
      href={link.href}
      noscroll={link.noscroll}
      replacestate={link.replacestate}
      label={m.button_label_open_today_stories()}
      navigationType={DpadNavigationType.Item}
      color="inherit"
    >
      <div class="entry-ring">
        <div class="entry-body">
          <div class="entry-posters">
            {#each posters as poster (poster.key)}
              <div class="entry-poster">
                <CrossOriginImage src={poster.poster.url.thumb} alt="" />
              </div>
            {/each}
          </div>

          <div class="entry-faces">
            {#each faces as user (user.key)}
              <CrossOriginImage src={user.avatar.url} alt="" />
            {/each}
          </div>

          <span class="bold entry-label">{m.list_title_today()}</span>

          {#if unseen.length > 0}
            <span class="bold entry-badge">{unseen.length}</span>
          {/if}
        </div>
      </div>
    </Link>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-navbar-entry {
    --entry-ring: conic-gradient(
      from 210deg,
      var(--purple-300),
      var(--purple-600),
      var(--purple-400),
      var(--purple-300)
    );
    --entry-size: var(--ni-40);

    display: flex;

    &[data-seen="true"] {
      --entry-ring: var(--color-border);
    }

    .entry-ring {
      position: relative;

      display: inline-flex;
      box-sizing: border-box;
      height: var(--entry-size);
      padding: var(--border-thickness-xs);

      border-radius: var(--border-radius-xxl);
      background: var(--entry-ring);
    }

    .entry-body {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      padding-inline: var(--ni-8) var(--ni-12);

      border-radius: var(--border-radius-xxl);
      background: var(--color-background);
      color: var(--color-text-primary);
    }

    .entry-posters {
      display: none;
    }

    .entry-faces {
      display: flex;
      padding-inline-start: var(--ni-4);

      :global(img) {
        width: var(--ni-22);
        height: var(--ni-22);

        border: var(--border-thickness-xs) solid var(--color-background);
        border-radius: 50%;
      }

      :global(img + img) {
        margin-inline-start: calc(-1 * var(--ni-8));
      }
    }

    .entry-label {
      color: inherit;
    }

    .entry-badge {
      display: flex;
      align-items: center;
      justify-content: center;

      min-width: var(--ni-22);
      height: var(--ni-22);
      padding-inline: var(--ni-6);
      box-sizing: border-box;

      border-radius: var(--border-radius-xxl);
      background: var(--purple-500);
      color: var(--shade-10);
      font-size: var(--font-size-tag);
    }

    @include for-mobile {
      .entry-ring {
        width: var(--entry-size);
      }

      .entry-body {
        position: relative;
        justify-content: center;
        width: 100%;
        padding-inline: 0;
      }

      .entry-posters {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .entry-poster {
        position: absolute;

        width: var(--ni-14);
        height: var(--ni-20);

        :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--ni-3);
        }

        &:first-child {
          transform: translateX(calc(var(--rtl-sign) * var(--ni-6) * -1))
            rotate(-10deg);
        }

        &:last-child:not(:first-child) {
          transform: translateX(calc(var(--rtl-sign) * var(--ni-6)))
            rotate(10deg);
        }
      }

      .entry-faces,
      .entry-label {
        display: none;
      }

      .entry-badge {
        position: absolute;
        top: calc(-1 * var(--ni-6));
        inset-inline-end: calc(-1 * var(--ni-6));

        min-width: var(--ni-18);
        height: var(--ni-18);
        padding-inline: var(--ni-4);

        border: var(--border-thickness-xs) solid var(--color-background);
      }
    }
  }
</style>

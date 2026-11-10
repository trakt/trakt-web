<script lang="ts">
  import type { MediaSocial } from "$lib/requests/models/MediaSocial";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { toSocialActivityLabel } from "./toSocialActivityLabel.ts";

  /*
    Who among your follows has touched this title, as a strip column rather than a
    single pill. Structurally identical to the watch-options list - avatar, name,
    one line of detail - so the columns of the masthead strip read as one system.

    Only the first few entries appear; the section chevron opens the full drawer.
  */
  const {
    entries,
  }: {
    entries: ReadonlyArray<MediaSocial>;
  } = $props();
</script>

<div class="trakt-summary-header-social-activity">
  {#each entries as entry (entry.key)}
    <div class="activity-row">
      <span class="activity-avatar">
        <UserAvatar user={entry.user} size="small" />
      </span>

      <span class="activity-info">
        <span class="activity-name ellipsis">
          <bdi>{toDisplayableName(entry.user)}</bdi>
        </span>

        <!--
          The score leads the line under the name, so it reads as that
          friend's verdict. Pinned to the row's far end it sat nearer the next
          column than its own name and read as part of it. It goes through
          UserRating, as the ratings drawer and comments do: ratings are
          stored 1-10 but shown as 5 stars.
        -->
        <span class="activity-meta">
          {#if entry.watched?.rating}
            <span class="activity-score">
              <UserRating rating={entry.watched.rating.rating} />
            </span>
            <span class="activity-separator" aria-hidden="true">·</span>
          {/if}
          <span class="activity-label">{toSocialActivityLabel(entry)}</span>
        </span>
      </span>
    </div>
  {/each}
</div>

<style lang="scss">
  .trakt-summary-header-social-activity {
    display: flex;
    flex-direction: column;
    gap: var(--summary-header-row-gap, var(--ni-12));

    width: 100%;
  }

  .activity-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    /* The strip's shared row, so every column scans at the same rhythm. */
    min-height: var(--summary-header-row-height, var(--ni-44));
    box-sizing: border-box;

    min-width: 0;
  }

  .activity-avatar {
    display: flex;
    align-items: center;
    flex: none;

    justify-content: center;

    /* The same 44px cell the provider tiles fill, so names line up across
       columns; the avatar sits inside it with room for its tier ring. */
    width: var(--summary-header-tile, var(--ni-44));
    height: var(--summary-header-tile, var(--ni-44));

    :global(.trakt-user-avatar) {
      width: calc(var(--ni-36) - var(--ni-2));
      height: calc(var(--ni-36) - var(--ni-2));
    }
  }

  .activity-info {
    display: flex;
    flex-direction: column;

    min-width: 0;
  }

  .activity-name {
    font-size: var(--font-size-text);
    font-weight: 700;
    line-height: var(--ni-20);
    color: var(--color-text-primary);
  }

  .activity-meta {
    display: flex;
    align-items: center;
    gap: var(--ni-6);

    min-width: 0;
    height: var(--ni-16);
  }

  /* Sized on the span: the global sheet sets every bare span to 14px. */
  .activity-label,
  .activity-separator {
    font-size: var(--font-size-text-small);
    line-height: var(--ni-16);
    color: var(--color-text-quiet);
  }

  .activity-label {
    min-width: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .activity-separator {
    flex: none;
  }

  /* The score is the line's one bright mark; the activity stays quiet. */
  .activity-score {
    display: flex;
    flex: none;

    font-variant-numeric: tabular-nums;

    :global(.trakt-user-rating) {
      gap: var(--ni-2);
      color: var(--color-text-primary);
    }

    :global(.trakt-user-rating span) {
      font-size: var(--font-size-text-small);
      font-weight: 700;
      line-height: var(--ni-16);
    }

    :global(.trakt-user-rating svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>

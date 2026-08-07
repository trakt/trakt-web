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
        <span class="activity-name ellipsis">{toDisplayableName(entry.user)}</span>

        <span class="activity-detail">
          <!--
            The score goes through UserRating, the same component the ratings
            drawer and comments use. Ratings are stored 1-10 but shown as 5 stars,
            so anything that prints the raw value disagrees with the drawer for the
            very same entry.
          -->
          {#if entry.watched?.rating}
            <UserRating rating={entry.watched.rating.rating} />
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

    width: 100%;
  }

  .activity-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    /* Matches the provider rows, so the two columns scan at the same rhythm. */
    min-height: var(--provider-row-height, var(--ni-52));
    padding-block: var(--gap-xxs);
    box-sizing: border-box;

    min-width: 0;
  }

  .activity-avatar {
    display: flex;
    align-items: center;
    flex: none;

    /* Same cell the provider marks occupy, so names line up across columns. */
    width: var(--provider-logo-column, var(--ni-36));

    :global(.trakt-user-avatar) {
      width: var(--ni-28);
      height: var(--ni-28);
    }
  }

  .activity-info {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    min-width: 0;
  }

  .activity-name {
    font-size: var(--font-size-text);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .activity-detail {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    white-space: nowrap;

    :global(.trakt-user-rating) {
      font-size: var(--font-size-text-small);
      color: var(--color-text-primary);
      gap: var(--ni-2);

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }
  }

  .activity-label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

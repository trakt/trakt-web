<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { MediaSocial } from "$lib/requests/models/MediaSocial.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SocialActivityTag from "./SocialActivityTag.svelte";
  import { mapToSocialActivityEntries } from "./mapToSocialActivityEntries.ts";

  const { entry }: { entry: MediaSocial } = $props();

  const displayName = $derived(toDisplayableName(entry.user));

  const profileHref = $derived(
    entry.user.slug == null
      ? undefined
      : UrlBuilder.profile.user(entry.user.slug),
  );

  const activities = $derived(mapToSocialActivityEntries(entry));

  const ratingActivity = $derived(
    activities.find((activity) => activity.type === "rating"),
  );
  const otherActivities = $derived(
    activities.filter((activity) => activity.type !== "rating"),
  );
</script>

<li class="trakt-social-activity-row">
  <div class="trakt-social-activity-card-grid">
    <UserAvatar user={entry.user} />

    <div class="trakt-social-activity-user-copy">
      <Link href={profileHref} color="inherit">
        <span class="trakt-social-activity-profile-copy">
          <p class="trakt-card-title ellipsis bold">
            {displayName}
          </p>
        </span>
      </Link>

      <div class="trakt-social-activity-pills">
        {#each otherActivities as activity (activity.key)}
          <SocialActivityTag {activity} />
        {/each}

        {#if ratingActivity}
          <span class="trakt-social-activity-rating">
            <SocialActivityTag activity={ratingActivity} />
          </span>
        {/if}
      </div>
    </div>
  </div>
</li>

<style>
  .trakt-social-activity-row {
    padding: var(--gap-xs) var(--gap-s);
    border-radius: var(--border-radius-m);

    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    :global(.trakt-link) {
      text-decoration: none;
      min-width: 0;
    }
  }

  .trakt-social-activity-card-grid {
    display: grid;
    grid-template-columns: var(--ni-44) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .trakt-social-activity-rating {
    display: inline-flex;
    margin-inline-start: auto;
    flex: 0 0 auto;
  }

  .trakt-social-activity-user-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);

    min-width: 0;
  }

  .trakt-social-activity-profile-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .trakt-social-activity-pills {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ni-4);
    flex-wrap: wrap;
  }
</style>

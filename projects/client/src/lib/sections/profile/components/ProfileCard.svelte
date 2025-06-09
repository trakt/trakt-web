<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import type { UserProfile } from "$lib/requests/models/UserProfile";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { profile }: { profile: UserProfile } = $props();
</script>

<LandscapeCard>
  <div class="profile-card" class:has-default-cover={!profile.cover?.url}>
    <Link focusable={false} href={UrlBuilder.profile.user(profile.slug ?? "")}>
      <CardCover
        title={profile.username}
        src={profile.cover?.url ?? DEFAULT_COVER}
        alt={profile.username}
      />
    </Link>

    <UserAvatar user={profile} size="small" />

    <CardFooter>
      <p class="meta-info ellipsis">{profile.username}</p>
    </CardFooter>
  </div>
</LandscapeCard>

<style>
  .profile-card {
    position: relative;

    :global(.trakt-card-cover) {
      filter: grayscale(75%);
    }

    &.has-default-cover {
      :global(.trakt-card-cover) {
        filter: grayscale(100%);
      }
    }

    :global(.trakt-user-avatar) {
      position: absolute;
      bottom: var(--ni-28);
      right: var(--ni-8);

      width: var(--ni-48);
      height: var(--ni-48);
    }
  }
</style>

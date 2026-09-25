<script lang="ts">
  import AvatarPill from "$lib/components/avatar-pill/AvatarPill.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { currentUserNetworkQuery } from "$lib/features/auth/queries/currentUserNetworkQuery.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { map } from "rxjs";
  import { profileDrawerNavigation } from "../_internal/profileDrawerNavigation.ts";

  const AVATAR_DISPLAY_LIMIT = 5;

  const { network } = useUser();
  const isLoading = useQuery(currentUserNetworkQuery()).pipe(
    map(($query) => $query.isLoading),
  );
  const { buildLeaderboardDrawerLink } = profileDrawerNavigation();
  const drawerLink = $derived(buildLeaderboardDrawerLink());

  const following = $derived($network?.following ?? []);
  const avatars = $derived(
    following
      .slice(0, AVATAR_DISPLAY_LIMIT)
      .map((user) => ({ key: user.key, user })),
  );
</script>

{#if $isLoading}
  <div class="trakt-leaderboard-pill">
    <Skeleton
      width="var(--ni-160)"
      height="var(--ni-36)"
      radius="var(--border-radius-xxl)"
    />
  </div>
{:else if following.length > 0}
  <div class="trakt-leaderboard-pill">
    <AvatarPill
      {avatars}
      countLabel={String(following.length)}
      label={m.text_following()}
      href={drawerLink.href}
      noscroll={drawerLink.noscroll}
      replacestate={drawerLink.replacestate}
      ariaLabel={m.button_label_open_leaderboard()}
    />
  </div>
{/if}

<style lang="scss">
  .trakt-leaderboard-pill {
    margin-top: var(--gap-xxs);

    display: flex;
    justify-content: flex-start;
    // The pill sizes itself against the `avatar-pill` container established on
    // the banner row, so let it overflow this (content-width) details column
    // into the space beneath the pinned action buttons.
    min-width: 0;
  }
</style>

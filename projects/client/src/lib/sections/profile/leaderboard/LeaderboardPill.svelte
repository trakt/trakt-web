<script lang="ts">
  import AvatarPill from "$lib/components/avatar-pill/AvatarPill.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { profileDrawerNavigation } from "../_internal/profileDrawerNavigation.ts";

  const AVATAR_DISPLAY_LIMIT = 5;

  const { network } = useUser();
  const { buildLeaderboardDrawerLink } = profileDrawerNavigation();
  const drawerLink = $derived(buildLeaderboardDrawerLink());

  const following = $derived($network?.following ?? []);
  const avatars = $derived(
    following
      .slice(0, AVATAR_DISPLAY_LIMIT)
      .map((user) => ({ key: user.key, user })),
  );
</script>

{#if following.length > 0}
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

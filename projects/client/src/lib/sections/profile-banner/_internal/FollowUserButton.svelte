<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { attachWarning } from "$lib/sections/media-actions/_internal/attachWarning";
  import type { DisplayableProfileProps } from "$lib/sections/profile/DisplayableProfileProps";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useFollowUserRequest } from "./useFollowUser";

  const { profile, slug }: DisplayableProfileProps = $props();
  const { isRequestingFollow, isFollowed, followUser, unfollowUser } = $derived(
    useFollowUserRequest(slug),
  );

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const unfollowHandler = $derived(
    attachWarning(
      unfollowUser,
      m.unfollow_warning({ username: profile.name.first }),
    ),
  );

  const label = $derived(
    $isFollowed
      ? m.unfollow_label({ username: profile.name.first })
      : m.follow_label({ username: profile.name.first }),
  );

  const text = $derived($isFollowed ? m.unfollow() : m.follow());
</script>

<Button
  size={$isMobile ? "tag" : "small"}
  color={$isFollowed ? "red" : "purple"}
  variant={$isFollowed ? "secondary" : "primary"}
  {label}
  onclick={() => {
    $isFollowed ? unfollowHandler() : followUser();
  }}
  disabled={$isRequestingFollow}
>
  {text}
</Button>

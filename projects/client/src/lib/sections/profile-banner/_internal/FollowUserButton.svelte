<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DisplayableProfileProps } from "$lib/sections/profile/DisplayableProfileProps";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { useFollowUser } from "./useFollowUser";

  const { profile, slug }: DisplayableProfileProps = $props();

  const displayName = $derived(toDisplayableName(profile));
  const { isRequestingFollow, isFollowed, followUser, unfollowUser } = $derived(
    useFollowUser({ slug, displayName }),
  );

  const label = $derived(
    $isFollowed
      ? m.button_label_unfollow({ username: displayName })
      : m.button_label_follow({ username: displayName }),
  );

  const text = $derived(
    $isFollowed ? m.button_text_unfollow() : m.button_text_follow(),
  );
</script>

<Button
  size={"small"}
  color={$isFollowed ? "red" : "purple"}
  variant={$isFollowed ? "secondary" : "primary"}
  {label}
  onclick={(event) => {
    $isFollowed ? unfollowUser(event) : followUser();
  }}
  disabled={$isRequestingFollow}
>
  {text}
</Button>

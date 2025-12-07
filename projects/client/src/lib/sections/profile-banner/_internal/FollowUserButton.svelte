<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DisplayableProfileProps } from "$lib/sections/profile/DisplayableProfileProps";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName";
  import { useFollowUserRequest } from "./useFollowUser";

  const { profile, slug }: DisplayableProfileProps = $props();
  const { isRequestingFollow, isFollowed, followUser, unfollowUser } = $derived(
    useFollowUserRequest(slug),
  );

  const userDisplayName = $derived(toDisplayableName(profile));

  const { confirm } = useConfirm();
  const confirmUnfollow = $derived(
    confirm({
      type: ConfirmationType.UnfollowUser,
      username: userDisplayName,
      onConfirm: unfollowUser,
    }),
  );

  const label = $derived(
    $isFollowed
      ? m.button_label_unfollow({ username: userDisplayName })
      : m.button_label_follow({ username: userDisplayName }),
  );

  const text = $derived(
    $isFollowed ? m.button_text_unfollow() : m.button_text_follow(),
  );
</script>

<Button
  size="small"
  color="default"
  variant="primary"
  {label}
  onclick={(event) => {
    $isFollowed ? confirmUnfollow(event) : followUser();
  }}
  disabled={$isRequestingFollow}
>
  {text}
</Button>

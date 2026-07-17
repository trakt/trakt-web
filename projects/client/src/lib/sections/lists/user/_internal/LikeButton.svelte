<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LikeIcon from "$lib/components/icons/LikeIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { useLikeList } from "./useLikeList";

  const { list }: { list: MediaListSummary } = $props();

  const { isAuthorized } = useAuth();
  const { user } = useUser();
  const { likeList, unlikeList, isUpdating, isLiked } = $derived(
    useLikeList(list),
  );

  // Signed-out viewers get a static, read-only count; signed-in viewers get the
  // interactive toggle. Both render the same button so styling stays in sync.
  const isAuthenticated = $derived($isAuthorized && $user != null);
  const isOwner = $derived($user?.slug === list.user?.slug);
  const isDisabled = $derived($isUpdating || isOwner);

  function toggle() {
    if ($isLiked) {
      unlikeList();
      return;
    }

    likeList();
  }

  const label = $derived(
    isAuthenticated
      ? $isLiked
        ? m.button_label_unlike_list({ name: list.name })
        : m.button_label_like_list({ name: list.name })
      : m.button_text_comment_likes({ count: list.likeCount }),
  );
</script>

<trakt-list-like class:is-readonly={!isAuthenticated}>
  <Button
    {label}
    style="ghost"
    onclick={isAuthenticated ? toggle : undefined}
    disabled={isAuthenticated && isDisabled}
  >
    {toHumanNumber(list.likeCount, languageTag())}
    {#snippet icon()}
      <LikeIcon style={$isLiked ? "filled" : "open"} />
    {/snippet}
  </Button>
</trakt-list-like>

<style>
  trakt-list-like {
    :global(.trakt-button) {
      gap: var(--gap-xs);
      flex-direction: row-reverse;
    }

    &.is-readonly {
      pointer-events: none;
    }
  }
</style>

<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import LikeListAction from "./_internal/LikeListAction.svelte";
  import { useLikeList } from "./_internal/useLikeList.ts";

  const { list, style }: {
    list: MediaListSummary;
    style?: "ghost" | "text";
  } = $props();

  const { user } = useUser();
  const { likeList, unlikeList, isUpdating, isLiked } = $derived(
    useLikeList(list),
  );

  const isListOwner = $derived($user?.slug === list.user?.slug);

  function handleLike() {
    if ($isLiked) {
      unlikeList();
      return;
    }

    likeList();
  }

  const isDisabled = $derived($isUpdating || isListOwner);
</script>

<RenderFor audience="authenticated">
  <LikeListAction
    onToggle={handleLike}
    disabled={isDisabled}
    state={$isLiked ? "liked" : "unliked"}
    {list}
    {style}
  />
</RenderFor>

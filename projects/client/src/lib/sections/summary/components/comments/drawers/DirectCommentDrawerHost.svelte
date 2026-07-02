<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { commentQuery } from "$lib/requests/queries/comments/commentQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { map } from "rxjs";
  import DirectCommentCard from "./_internal/DirectCommentCard.svelte";

  type DirectCommentDrawerHostProps = {
    commentId: number;
    onClose: () => void;
  };

  const { commentId, onClose }: DirectCommentDrawerHostProps = $props();

  const query = useQuery(
    fromRune(() => commentId).pipe(
      map((id) => commentQuery({ id })),
    ),
  );
  const comment = $derived($query?.data);
  const isLoading = $derived($query?.isLoading ?? true);

  let isOpened = $state(false);
</script>

<Drawer
  {onClose}
  title={m.dialog_title_comment()}
  size="large"
  onOpened={() => (isOpened = true)}
>
  {#if isOpened}
    <div class="trakt-direct-comment-drawer">
      {#if comment}
        <DirectCommentCard {comment} />
      {:else if isLoading}
        <LoadingIndicator />
      {:else}
        <p class="secondary">{m.list_placeholder_comments()}</p>
      {/if}
    </div>
  {/if}
</Drawer>

<style>
  .trakt-direct-comment-drawer {
    overflow-y: auto;
    overscroll-behavior: contain;
    position: relative;

    padding: var(--ni-4);
  }
</style>

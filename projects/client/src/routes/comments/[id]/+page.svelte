<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import DirectCommentDrawerHost from "$lib/sections/summary/components/comments/drawers/DirectCommentDrawerHost.svelte";
  import HomePage from "$lib/sections/home/HomePage.svelte";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();

  const commentId = $derived(Number(params.id));
  const hasValidCommentId = $derived(Number.isFinite(commentId));

  const close = () => {
    goto(resolve("/"), { replaceState: true, noScroll: true });
  };
</script>

<HomePage>
  {#if hasValidCommentId}
    <DirectCommentDrawerHost {commentId} onClose={close} />
  {/if}
</HomePage>

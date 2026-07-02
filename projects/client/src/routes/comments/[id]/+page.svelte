<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import { directCommentTargetUrl } from "$lib/sections/summary/directCommentTargetUrl.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { PageProps } from "./$types";
  import { useCommentItem } from "./useCommentItem.ts";

  const { params }: PageProps = $props();

  const commentId = $derived(Number(params.id));

  const { target, isLoading } = useCommentItem(fromRune(() => commentId));

  const targetUrl = $derived(
    $target && directCommentTargetUrl({ commentId, target: $target }),
  );
</script>

{#if targetUrl}
  <Redirect to={targetUrl} />
{:else if $isLoading}
  <div class="trakt-direct-comment-loading">
    <LoadingIndicator />
  </div>
{:else}
  <Error404Page />
{/if}

<style>
  .trakt-direct-comment-loading {
    display: grid;
    place-items: center;

    min-height: 100dvh;
  }
</style>

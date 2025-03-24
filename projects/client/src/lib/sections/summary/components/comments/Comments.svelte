<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CommentCard from "$lib/sections/summary/components/comments/_internal/CommentCard.svelte";
  import { writable } from "svelte/store";
  import CommentsDialog from "./_internal/dialog/CommentsDialog.svelte";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import { useComments } from "./_internal/useComments";
  import type { CommentsProps } from "./CommentsProps";

  const { media, ...props }: CommentsProps = $props();

  const { isLoading, comments } = $derived(
    useComments({
      slug: media.slug,
      ...props,
    }),
  );

  const topLevelComments = $derived(
    $comments.filter((comment) => comment.parentId === 0),
  );

  const dialog = writable<HTMLDialogElement>();
  const drilldownSource = writable<ActiveComment | undefined>(undefined);

  const onDrilldown = (comment: ActiveComment) => {
    $dialog.showModal();
    drilldownSource.set(comment);
  };
</script>

<SectionList
  id={`comments-list-${media.slug}`}
  items={topLevelComments}
  title={m.popular_comments()}
  --height-list="var(--height-comments-list)"
>
  {#snippet item(comment)}
    <CommentCard {comment} {media} {onDrilldown} />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.no_comments()}</p>
    {/if}
  {/snippet}

  {#snippet badge()}
    <Preview />
  {/snippet}
</SectionList>

<CommentsDialog source={$drilldownSource} {dialog} {media} {...props} />

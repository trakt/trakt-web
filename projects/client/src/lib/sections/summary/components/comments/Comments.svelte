<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import CommentCard from "./_internal/CommentCard.svelte";
  import { useComments } from "./_internal/useComments";

  const { media }: { media: MediaEntry } = $props();

  const { isLoading, comments } = $derived(
    useComments({
      slug: media.slug,
      type: media.type,
    }),
  );

  const topLevelComments = $derived(
    $comments.filter((comment) => comment.parentId === 0),
  );
</script>

<SectionList
  id={`cast-list`}
  items={topLevelComments}
  title={m.popular_comments()}
  --height-list="var(--height-comments-list)"
>
  {#snippet item(comment)}
    <CommentCard {comment} {media} />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.no_comments()}</p>
    {/if}
  {/snippet}
</SectionList>

<script lang="ts">
  import Dialog from "$lib/components/dialogs/Dialog.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { CommentsProps } from "$lib/sections/summary/components/comments/CommentsProps";
  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import CommentThreadCard from "./CommentThreadCard.svelte";
  import { useComments } from "./useComments";

  type CommentsDialogProps = {
    dialog: Writable<HTMLDialogElement>;
    sourceId?: number;
  } & CommentsProps;

  const {
    dialog = writable(),
    sourceId,
    media,
    ...props
  }: CommentsDialogProps = $props();

  const { comments } = $derived(
    useComments({
      slug: media.slug,
      ...props,
    }),
  );

  const topLevelComments = $derived(
    $comments.filter((comment) => comment.parentId === 0),
  );

  function scrollIntoView(node: HTMLElement, isSourceComment: boolean) {
    const update = (isSourceComment: boolean) => {
      isSourceComment && node.scrollIntoView({ behavior: "smooth" });
    };

    onMount(() => update(isSourceComment));
    return { update };
  }
</script>

<Dialog title="Comments" {dialog}>
  <div class="trakt-comment-threads">
    <!-- FIXME: replace with centered list -->
    <SectionList
      id={`comment-threads-list-${media.slug}`}
      items={topLevelComments}
      title=""
      --height-list="min(var(--height-comment-thread-list), 70vh)"
    >
      {#snippet item(comment)}
        <comment-thread use:scrollIntoView={comment.id === sourceId}>
          <CommentThreadCard {comment} {media} />
        </comment-thread>
      {/snippet}
    </SectionList>
  </div>
</Dialog>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-threads {
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    @include for-mobile {
      :global(.trakt-list-header) {
        display: none;
      }
    }
  }
</style>

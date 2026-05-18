<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { HistoryEntry } from "$lib/sections/lists/stores/models/HistoryEntry";
  import type { ActiveComment } from "$lib/sections/summary/components/comments/_internal/models/ActiveComment.ts";
  import AddReviewDrawer from "$lib/sections/summary/components/comments/drawers/AddReviewDrawer.svelte";

  type AddReviewActionProps = {
    entry: HistoryEntry;
    title: string;
    style: "normal" | "action" | "dropdown-item";
    size?: "normal" | "small";
  };

  const {
    entry,
    title,
    style = "action",
    size = "normal",
  }: AddReviewActionProps = $props();

  let isOpen = $state(false);

  const commentProps = $derived(() => {
    if (entry.type === "episode") {
      return {
        type: "episode" as const,
        season: entry.episode.season,
        episode: entry.episode.number,
        id: entry.episode.id,
        media: entry.show,
      };
    }

    return {
      type: entry.movie.type,
      media: entry.movie,
    };
  });

  function openDrawer() {
    isOpen = true;
  }

  function closeDrawer() {
    isOpen = false;
  }

  function handleCommentPost(_: ActiveComment) {
    isOpen = false;
  }
</script>

{#if style === "normal"}
  <Button
    label={title}
    color="default"
    variant="secondary"
    {size}
    onclick={openDrawer}
  >
    {m.button_text_add_review()}
    {#snippet icon()}
      <CommentIcon />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton
    label={title}
    color="default"
    variant="secondary"
    {size}
    style="ghost"
    onclick={openDrawer}
  >
    <CommentIcon />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem label={title} onclick={openDrawer} style="flat">
    {m.button_text_add_review()}
    {#snippet icon()}
      <CommentIcon />
    {/snippet}
  </DropdownItem>
{/if}

{#if isOpen}
  <AddReviewDrawer
    onClose={closeDrawer}
    onCommentPost={handleCommentPost}
    {...commentProps}
  />
{/if}

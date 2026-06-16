<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import type { CommentsProps } from "../CommentsProps";
  import type { ActiveComment } from "../_internal/models/ActiveComment";
  import { useComments } from "../_internal/useComments";
  import ReviewsDrawerShell from "./_internal/ReviewsDrawerShell.svelte";

  type CommentsDrawerProps = {
    source?: ActiveComment;
    onClose: () => void;
  } & CommentsProps;

  const { onClose, source, media, ...props }: CommentsDrawerProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const isOpened = writable(false);
</script>

<Drawer
  {onClose}
  title={m.dialog_title_comment()}
  size="large"
  metaInfo={$sortType.text()}
  onOpened={() => isOpened.set(true)}
>
  {#if $isOpened}
    <ReviewsDrawerShell
      {source}
      useList={() =>
        useComments({
          slug: media.slug,
          limit: COMMENTS_DRILL_SIZE,
          sort: $sortType.value,
          ...props,
        })}
      {media}
      {...props}
    />
  {/if}

  {#snippet badge()}
    <Toggler value={$sortType.value} onChange={set} {options} />
  {/snippet}
</Drawer>

<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import type { CommentsProps } from "../CommentsProps";
  import CommentLanguageSelect from "../_internal/CommentLanguageSelect.svelte";
  import { useCommentLanguage } from "../_internal/useCommentLanguage.svelte.ts";
  import type { ActiveComment } from "../_internal/models/ActiveComment";
  import { useCommentsWithPinnedMine } from "../_internal/useCommentsWithPinnedMine";
  import type { UseMyCommentsProps } from "../_internal/UseMyCommentsProps.ts";
  import ReviewsDrawerShell from "./_internal/ReviewsDrawerShell.svelte";

  type CommentsDrawerProps = {
    source?: ActiveComment;
    onClose: () => void;
  } & CommentsProps;

  const { onClose, source, media, ...props }: CommentsDrawerProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const commentLanguage = useCommentLanguage();

  const isOpened = writable(false);

  const { isAuthorized } = useAuth();
  const { isEnabled } = useFeatureFlag();
  const pinMine$ = isEnabled(FeatureFlag.ReviewsPinMine);

  // Built outside the useList factory PaginatedList wraps in $derived, so a
  // re-render updates the query's options instead of recreating it.
  const myCommentsParams$ = fromRune((): UseMyCommentsProps => ({
    ...props,
    slug: media.slug,
    enabled: $isAuthorized ?? false,
  }));
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
        useCommentsWithPinnedMine({
          slug: media.slug,
          limit: COMMENTS_DRILL_SIZE,
          sort: $sortType.value,
          language: commentLanguage.filter,
          pinMine$,
          myCommentsParams$,
          ...props,
        })}
      {media}
      {...props}
    />
  {/if}

  {#snippet badge()}
    <Toggler value={$sortType.value} onChange={set} {options} />
    <CommentLanguageSelect
      value={commentLanguage.value}
      onChange={commentLanguage.set}
    />
  {/snippet}
</Drawer>

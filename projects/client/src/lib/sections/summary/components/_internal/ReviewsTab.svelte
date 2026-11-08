<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import DrawerTabTitle from "$lib/sections/summary/components/_internal/DrawerTabTitle.svelte";
  import CommentLanguageSelect from "$lib/sections/summary/components/comments/_internal/CommentLanguageSelect.svelte";
  import { useCommentLanguage } from "$lib/sections/summary/components/comments/_internal/useCommentLanguage.svelte.ts";
  import AddCommentAction from "$lib/sections/summary/components/comments/_internal/comment-actions/AddCommentAction.svelte";
  import AddReviewDrawerHost from "$lib/sections/summary/components/comments/drawers/AddReviewDrawerHost.svelte";
  import InlineComments from "$lib/sections/summary/components/comments/InlineComments.svelte";
  import type { ReviewsTabProps } from "./ReviewsTabProps.ts";

  const { show, target, remountKey }: ReviewsTabProps = $props();

  const { current: sort, set: setSort, options } = useToggler("comment");

  const commentLanguage = useCommentLanguage();

  let isPostReviewOpen = $state(false);
</script>

<div
  class="trakt-reviews-tab"
  class:season-reviews-tab={target.type === "season"}
  class:episode-reviews-tab={target.type === "episode"}
>
  <DrawerTabTitle title={m.tab_text_seasons_reviews()}>
    {#snippet metaInfo()}
      <ListMetaInfo text={$sort.text()} />
    {/snippet}

    {#snippet actions()}
      <Toggler value={$sort.value} onChange={setSort} {options} />
      <CommentLanguageSelect
        value={commentLanguage.value}
        onChange={commentLanguage.set}
      />
      <AddCommentAction onclick={() => (isPostReviewOpen = true)} />
    {/snippet}
  </DrawerTabTitle>

  {#key remountKey}
    <InlineComments
      media={show}
      {...target}
      sort={$sort.value}
      language={commentLanguage.filter}
    />
  {/key}
</div>

{#if isPostReviewOpen}
  <AddReviewDrawerHost
    onClose={() => (isPostReviewOpen = false)}
    onCommentPost={() => (isPostReviewOpen = false)}
    mode="post"
    media={show}
    {...target}
  />
{/if}

<style lang="scss">
  .season-reviews-tab,
  .episode-reviews-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>

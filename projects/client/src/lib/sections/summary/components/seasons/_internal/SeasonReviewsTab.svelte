<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import CommentLanguageSelect from "$lib/sections/summary/components/comments/_internal/CommentLanguageSelect.svelte";
  import { useCommentLanguage } from "$lib/sections/summary/components/comments/_internal/useCommentLanguage.svelte.ts";
  import AddCommentAction from "$lib/sections/summary/components/comments/_internal/comment-actions/AddCommentAction.svelte";
  import AddReviewDrawerHost from "$lib/sections/summary/components/comments/drawers/AddReviewDrawerHost.svelte";
  import InlineComments from "$lib/sections/summary/components/comments/InlineComments.svelte";
  import { useMineTab } from "$lib/sections/summary/components/comments/_internal/useMineTab.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import DrawerTabTitle from "$lib/sections/summary/components/_internal/DrawerTabTitle.svelte";
  import type { SeasonReviewsTabProps } from "./SeasonReviewsTabProps.ts";

  const {
    show,
    season,
    seasonId,
    episodeCount,
  }: SeasonReviewsTabProps = $props();

  const {
    sort,
    mineActive,
    sortOptions,
    activeTab,
    activeText,
    onTabChange,
  } = useMineTab();

  const commentLanguage = useCommentLanguage();

  const isPostReviewOpen = writable(false);
</script>

<div class="season-reviews-tab">
  <DrawerTabTitle title={m.tab_text_seasons_reviews()}>
    {#snippet metaInfo()}
      <ListMetaInfo text={$activeText()} />
    {/snippet}

    {#snippet actions()}
      <Toggler
        value={$activeTab}
        onChange={onTabChange}
        options={$sortOptions}
      />
      <CommentLanguageSelect
        value={commentLanguage.value}
        onChange={commentLanguage.set}
      />
      <AddCommentAction onclick={() => isPostReviewOpen.set(true)} />
    {/snippet}
  </DrawerTabTitle>

  {#key season}
    <InlineComments
      media={show}
      type="season"
      {season}
      id={seasonId}
      {episodeCount}
      sort={$sort.value}
      language={commentLanguage.filter}
      mineActive={$mineActive}
    />
  {/key}
</div>

{#if $isPostReviewOpen}
  <AddReviewDrawerHost
    onClose={() => isPostReviewOpen.set(false)}
    onCommentPost={() => isPostReviewOpen.set(false)}
    mode="post"
    media={show}
    type="season"
    {season}
    id={seasonId}
    {episodeCount}
  />
{/if}

<style lang="scss">
  .season-reviews-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>

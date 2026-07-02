<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import AddCommentAction from "$lib/sections/summary/components/comments/_internal/comment-actions/AddCommentAction.svelte";
  import AddReviewDrawerHost from "$lib/sections/summary/components/comments/drawers/AddReviewDrawerHost.svelte";
  import InlineComments from "$lib/sections/summary/components/comments/InlineComments.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import SeasonTabTitle from "./SeasonTabTitle.svelte";

  const {
    show,
    season,
    seasonId,
  }: {
    show: ShowEntry;
    season: number;
    seasonId: number;
  } = $props();

  const { current: sort, set: setSort, options } = useToggler("comment");

  const isPostReviewOpen = writable(false);
</script>

<div class="season-reviews-tab">
  <SeasonTabTitle title={m.tab_text_seasons_reviews()}>
    {#snippet metaInfo()}
      <ListMetaInfo text={$sort.text()} />
    {/snippet}

    {#snippet actions()}
      <Toggler value={$sort.value} onChange={setSort} {options} />
      <AddCommentAction onclick={() => isPostReviewOpen.set(true)} />
    {/snippet}
  </SeasonTabTitle>

  {#key season}
    <InlineComments
      media={show}
      type="season"
      {season}
      id={seasonId}
      sort={$sort.value}
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
  />
{/if}

<style lang="scss">
  .season-reviews-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>

<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import DrawerTabTitle from "$lib/sections/summary/components/_internal/DrawerTabTitle.svelte";
  import AddCommentAction from "$lib/sections/summary/components/comments/_internal/comment-actions/AddCommentAction.svelte";
  import AddReviewDrawerHost from "$lib/sections/summary/components/comments/drawers/AddReviewDrawerHost.svelte";
  import InlineComments from "$lib/sections/summary/components/comments/InlineComments.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";

  const {
    show,
    episode,
  }: {
    show: ShowEntry;
    episode: EpisodeEntry;
  } = $props();

  const { current: sort, set: setSort, options } = useToggler("comment");

  const isPostReviewOpen = writable(false);
</script>

<div class="episode-reviews-tab">
  <DrawerTabTitle title={m.tab_text_seasons_reviews()}>
    {#snippet metaInfo()}
      <ListMetaInfo text={$sort.text()} />
    {/snippet}

    {#snippet actions()}
      <Toggler value={$sort.value} onChange={setSort} {options} />
      <AddCommentAction onclick={() => isPostReviewOpen.set(true)} />
    {/snippet}
  </DrawerTabTitle>

  {#key episode.id}
    <InlineComments
      media={show}
      type="episode"
      season={episode.season}
      episode={episode.number}
      id={episode.id}
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
    type="episode"
    season={episode.season}
    episode={episode.number}
    id={episode.id}
  />
{/if}

<style lang="scss">
  .episode-reviews-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>

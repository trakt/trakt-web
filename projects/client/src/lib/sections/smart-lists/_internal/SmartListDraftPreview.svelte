<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartListDraft } from "$lib/requests/models/SmartListDraft.ts";
  import { smartListDraftItemsQuery } from "$lib/requests/queries/users/smartListDraftItemsQuery.ts";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import { toDiscoverMode } from "$lib/sections/lists/smart/toDiscoverMode.ts";
  import { usePaginatedListQuery } from "$lib/sections/lists/stores/usePaginatedListQuery.ts";

  type SmartListDraftPreviewProps = {
    listId: string;
    draft: SmartListDraft;
    title: string;
  };

  const { listId, draft, title }: SmartListDraftPreviewProps = $props();

  const type = $derived(toDiscoverMode(draft.mediaType));
</script>

{#snippet actions()}
  <StemTag>
    <span class="tag secondary preview-tag"
      >{m.tag_text_smart_list_preview()}</span
    >
  </StemTag>
{/snippet}

<DrilledMediaList
  id={`smart-list-draft-${listId}`}
  {title}
  {type}
  {actions}
  useList={(params) =>
    usePaginatedListQuery(
      smartListDraftItemsQuery({ listId, limit: params.limit }),
    )}
>
  {#snippet item(media)}
    <DefaultMediaItem
      type={media.type}
      {media}
      source="smart-list"
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
      canDeemphasize
    />
  {/snippet}
</DrilledMediaList>

<style>
  .preview-tag {
    color: var(--shade-10);
  }
</style>

<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MediaList from "$lib/sections/lists/drilldown/MediaList.svelte";
  import MixtapeEntryButton from "$lib/sections/mixtape/MixtapeEntryButton.svelte";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import { useRelatedList } from "./stores/useRelatedList";

  type RelatedListProps = {
    title: string;
    type: MediaType;
    slug: string;
    drilldownLink: string;
    mixtapePick?: number;
  };

  const { title, type, slug, drilldownLink, mixtapePick }: RelatedListProps =
    $props();
</script>

<MediaList
  id={{
    scope: `related-list-${type}`,
    key: slug,
  }}
  useList={(params) => useRelatedList({ ...params, slug })}
  {type}
  {title}
  drilldown={{
    href: drilldownLink,
    label: m.button_text_view_all(),
    source: { id: "related" },
  }}
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
>
  {#snippet item(media)}
    <DefaultMediaItem {type} {media} source="related" canDeemphasize />
  {/snippet}

  {#snippet actions()}
    {#if mixtapePick != null}
      <MixtapeEntryButton {type} source="related" pick={mixtapePick} />
    {/if}
  {/snippet}
</MediaList>

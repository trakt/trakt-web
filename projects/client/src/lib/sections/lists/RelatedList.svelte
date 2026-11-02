<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RelatedModeToggles from "$lib/features/recommendations/RelatedModeToggles.svelte";
  import { useRelatedMode } from "$lib/features/recommendations/useRelatedMode";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MediaList from "$lib/sections/lists/drilldown/MediaList.svelte";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import { useRelatedList } from "./stores/useRelatedList";

  type RelatedListProps = {
    title: string;
    type: MediaType;
    slug: string;
    drilldownLink: string;
  };

  const { title, type, slug, drilldownLink }: RelatedListProps = $props();
  const { isPersonalized } = useRelatedMode();
</script>

<MediaList
  id={{
    scope: `related-list-${type}`,
    key: slug,
  }}
  useList={(params) =>
    useRelatedList({ ...params, slug, personalized: $isPersonalized })}
  contentKey={String($isPersonalized)}
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
  {#snippet actions()}
    <RelatedModeToggles />
  {/snippet}

  {#snippet item(media)}
    <DefaultMediaItem {type} {media} source="related" canDeemphasize />
  {/snippet}
</MediaList>

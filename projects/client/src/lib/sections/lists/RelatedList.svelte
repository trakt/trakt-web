<script lang="ts">
  import TogglePills from "$lib/components/toggles/TogglePills.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
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

  const { current, set, options } = useToggler("related");
  const { isEnabled } = useFeatureFlag();
  const isSmartEnabled = isEnabled(FeatureFlag.SmartRelated);
  const isSmart = $derived($isSmartEnabled && $current.value === "smart");
</script>

{#snippet subHeader()}
  <TogglePills value={$current.value} onChange={set} {options} />
{/snippet}

<MediaList
  id={{
    scope: `related-list-${type}`,
    key: slug,
  }}
  useList={(params) => useRelatedList({ ...params, slug, isSmart })}
  contentKey={$current.value}
  {type}
  {title}
  subHeader={$isSmartEnabled ? subHeader : undefined}
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
</MediaList>

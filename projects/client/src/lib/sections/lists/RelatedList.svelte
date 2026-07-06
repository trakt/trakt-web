<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
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

{#snippet metaInfo()}
  <RenderForFeature flag={FeatureFlag.SmartRelated}>
    {#snippet enabled()}
      <ListMetaInfo text={$current.text()} />
    {/snippet}
  </RenderForFeature>
{/snippet}

{#snippet actions()}
  <RenderForFeature flag={FeatureFlag.SmartRelated}>
    {#snippet enabled()}
      <Toggler value={$current.value} onChange={set} {options} variant="icon" />
    {/snippet}
  </RenderForFeature>
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
  {metaInfo}
  drilldown={{
    href: drilldownLink,
    label: m.button_text_view_all(),
    source: { id: "related" },
  }}
  {actions}
  --height-override-card="var(--height-portrait-card-sm)"
  --height-override-list="var(--height-poster-list-sm)"
>
  {#snippet item(media)}
    <DefaultMediaItem {type} {media} source="related" canDeemphasize />
  {/snippet}
</MediaList>

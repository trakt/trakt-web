<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaStoreProps } from "$lib/models/MediaStoreProps.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import CastMemberItem from "./components/CastMemberItem.svelte";

  type CastListProps = {
    title: string;
    cast: CastMember[];
    slug: string;
    type: ExtendedMediaType;
    spoiler?: ExtendedMediaStoreProps;
  };

  const { title, cast, slug, type, spoiler }: CastListProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const castDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Cast));
</script>

<SectionList
  id={{
    scope: `cast-list-${type}`,
    key: slug,
  }}
  items={cast}
  {title}
  drilldown={{
    ...castDrawerLink,
    source: { id: "social" },
    label: m.button_text_view_all(),
  }}
  --height-list="var(--height-person-list)"
>
  {#snippet item(castMember)}
    <CastMemberItem {castMember} {type} {spoiler} />
  {/snippet}
</SectionList>

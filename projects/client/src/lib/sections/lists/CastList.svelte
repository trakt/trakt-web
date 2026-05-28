<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import {
      SummaryDrawers,
      summaryDrawerNavigation,
  } from "../summary/_internal/summaryDrawerNavigation";
  import CastMemberItem from "./components/CastMemberItem.svelte";

  type CastListProps = {
    title: string;
    cast: CastMember[];
    type: ExtendedMediaType;
  };

  const { title, cast, type }: CastListProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const castDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Cast));
</script>

<SectionList
  id={`cast-list-${type}`}
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
    <CastMemberItem {castMember} {type} />
  {/snippet}
</SectionList>

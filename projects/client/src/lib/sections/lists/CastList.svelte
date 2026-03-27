<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "../summary/_internal/summaryDrawerNavigation";
  import CastMemberItem from "./components/CastMemberItem.svelte";
  import ViewAllButton from "./components/ViewAllButton.svelte";

  type CastListProps = {
    title: string;
    cast: CastMember[];
    slug: string;
    type: MediaType;
    drilldownLink?: string;
  };

  const { title, cast, slug, type, drilldownLink }: CastListProps = $props();
  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<SectionList
  id={`cast-list-${slug}`}
  items={cast}
  {title}
  {drilldownLink}
  noscroll={drilldownLink != null}
  --height-list="var(--height-person-list)"
>
  {#snippet item(castMember)}
    <CastMemberItem {castMember} {type} />
  {/snippet}

  {#snippet actions()}
    <ViewAllButton
      href={buildDrawerLink(Drawers.Cast)}
      label={m.button_text_view_all()}
      noscroll
      disabled={cast.length === 0}
      source={{ id: "social" }}
    />
  {/snippet}
</SectionList>

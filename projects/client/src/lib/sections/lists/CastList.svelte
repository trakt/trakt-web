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
  import ViewAllButton from "./components/ViewAllButton.svelte";

  type CastListProps = {
    title: string;
    cast: CastMember[];
    slug: string;
    type: ExtendedMediaType;
  };

  const { title, cast, slug, type }: CastListProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const castDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Cast));
</script>

<SectionList
  id={`cast-list-${slug}`}
  items={cast}
  {title}
  drilldownLink={castDrawerLink.href}
  noscroll={castDrawerLink.noscroll}
  replacestate={castDrawerLink.replacestate}
  --height-list="var(--height-person-list)"
>
  {#snippet item(castMember)}
    <CastMemberItem {castMember} {type} />
  {/snippet}

  {#snippet actions()}
    <ViewAllButton
      {...castDrawerLink}
      label={m.button_text_view_all()}
      noscroll
      disabled={cast.length === 0}
      source={{ id: "social" }}
    />
  {/snippet}
</SectionList>

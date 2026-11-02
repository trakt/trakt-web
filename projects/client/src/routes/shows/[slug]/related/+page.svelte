<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RelatedModeToggles from "$lib/features/recommendations/RelatedModeToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import RelatedPaginatedList from "$lib/sections/lists/RelatedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_SHOW_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#snippet titleActions()}
  <RelatedModeToggles />
{/snippet}

<TraktPage
  audience="all"
  title={m.list_title_related_shows()}
  image={DEFAULT_SHARE_SHOW_COVER}
>
  <NavbarStateSetter
    header={{
      title: m.list_title_related_shows(),
      actions: titleActions,
    }}
  />

  <RelatedPaginatedList type="show" slug={params.slug} />
</TraktPage>

<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RelatedModeToggles from "$lib/features/recommendations/RelatedModeToggles.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import RelatedPaginatedList from "$lib/sections/lists/RelatedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

{#snippet titleActions()}
  <RelatedModeToggles />
{/snippet}

<TraktPage
  audience="all"
  title={m.list_title_related_movies()}
  image={DEFAULT_SHARE_MOVIE_COVER}
>
  <NavbarStateSetter
    header={{
      title: m.list_title_related_movies(),
      actions: titleActions,
    }}
  />

  <RelatedPaginatedList type="movie" slug={params.slug} />
</TraktPage>

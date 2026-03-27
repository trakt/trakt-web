<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import RelatedPaginatedList from "$lib/sections/lists/RelatedPaginatedList.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_MOVIE_COVER } from "$lib/utils/assets";
  import type { PageProps } from "./$types";

  const { params }: PageProps = $props();
</script>

<TraktPage
  audience="all"
  title={m.list_title_related_movies()}
  image={DEFAULT_SHARE_MOVIE_COVER}
>
  <NavbarStateSetter mode="minimal" />

  <RelatedPaginatedList
    title={m.list_title_related_movies()}
    type="movie"
    slug={params.slug}
  />
</TraktPage>
